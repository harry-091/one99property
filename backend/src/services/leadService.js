import { parse } from "csv-parse/sync";
import { query } from "../config/db.js";
import { ROLES } from "../utils/constants.js";
import { logNotification, sendEmailNotification } from "./notificationService.js";

const appendActivity = async ({ leadId, actorId, action, note = null, metadata = null }) =>
  query(
    `INSERT INTO lead_activities (lead_id, actor_id, action, note, metadata_json)
     VALUES (:leadId, :actorId, :action, :note, :metadata)`,
    { leadId, actorId, action, note, metadata: metadata ? JSON.stringify(metadata) : null }
  );

const appendStatusHistory = async ({ leadId, status, changedBy, note = null }) =>
  query(
    `INSERT INTO lead_status_history (lead_id, status, changed_by, note)
     VALUES (:leadId, :status, :changedBy, :note)`,
    { leadId, status, changedBy, note }
  );

const ensureLeadAccess = async (leadId, currentUser) => {
  const visibility = buildLeadVisibilityClause(currentUser);
  const rows = await query(
    `SELECT l.id
     FROM leads l
     ${visibility.clause} AND l.id = :leadId
     LIMIT 1`,
    { ...visibility.params, leadId }
  );

  if (!rows.length) {
    throw { status: 404, message: "Lead not found for your role scope" };
  }
};

const buildLeadVisibilityClause = (user) => {
  switch (user.role) {
    case ROLES.CHANNEL_PARTNER:
      return {
        clause: "WHERE l.created_by = :userId",
        params: { userId: user.id }
      };
    case ROLES.STAFF:
      return {
        clause: "WHERE l.assigned_to = :userId",
        params: { userId: user.id }
      };
    case ROLES.MANAGER:
      return {
        clause: "WHERE (l.assigned_manager_id = :userId OR l.lead_category = 'hot' OR l.assigned_to IS NOT NULL)",
        params: { userId: user.id }
      };
    case ROLES.RENTAL_TEAM:
      return {
        clause: "WHERE l.property_type = 'rental'",
        params: {}
      };
    default:
      return {
        clause: "WHERE 1 = 1",
        params: {}
      };
  }
};

export const createLead = async (payload, currentUser) => {
  const rows = await query(
    `INSERT INTO leads (
       full_name, phone, email, location, investment_range, property_type, lead_source, lead_category,
       notes, created_by, assigned_manager_id
     ) VALUES (
       :fullName, :phone, :email, :location, :investmentRange, :propertyType, :leadSource, :leadCategory,
       :notes, :createdBy, :assignedManagerId
     )
     RETURNING id`,
    {
      ...payload,
      createdBy: currentUser.id,
      assignedManagerId: payload.assignedManagerId || null
    }
  );
  const insertedLead = rows[0];

  await appendStatusHistory({
    leadId: insertedLead.id,
    status: "new",
    changedBy: currentUser.id,
    note: "Lead created"
  });
  await appendActivity({
    leadId: insertedLead.id,
    actorId: currentUser.id,
    action: "lead_created",
    note: payload.notes
  });

  const leads = await query("SELECT * FROM leads WHERE id = :id", { id: insertedLead.id });
  return leads[0];
};

export const uploadLeadsFromCsv = async (fileBuffer, currentUser) => {
  const records = parse(fileBuffer, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  const created = [];
  for (const row of records) {
    const lead = await createLead(
      {
        fullName: row.name || row.full_name,
        phone: row.phone,
        email: row.email || null,
        location: row.location || "",
        investmentRange: row.investment_range || row.budget || "",
        propertyType: row.property_type || "apartment",
        leadSource: row.lead_source || "csv_upload",
        leadCategory: row.lead_category || "normal",
        notes: row.notes || "Imported from CSV"
      },
      currentUser
    );
    created.push(lead);
  }

  return created;
};

export const listLeads = async (filters, currentUser) => {
  const visibility = buildLeadVisibilityClause(currentUser);
  const conditions = [visibility.clause];
  const params = { ...visibility.params };

  if (filters.search) {
    conditions.push("(l.full_name ILIKE :search OR l.phone ILIKE :search OR l.email ILIKE :search)");
    params.search = `%${filters.search}%`;
  }
  if (filters.status) {
    conditions.push("l.current_status = :status");
    params.status = filters.status;
  }
  if (filters.category) {
    conditions.push("l.lead_category = :category");
    params.category = filters.category;
  }
  if (filters.propertyType) {
    conditions.push("l.property_type = :propertyType");
    params.propertyType = filters.propertyType;
  }

  const whereClause = conditions.length ? conditions.join(" AND ") : "WHERE 1 = 1";

  return query(
    `SELECT
       l.*,
       creator.full_name AS created_by_name,
       assignee.full_name AS assigned_to_name,
       manager.full_name AS manager_name
     FROM leads l
     LEFT JOIN users creator ON creator.id = l.created_by
     LEFT JOIN users assignee ON assignee.id = l.assigned_to
     LEFT JOIN users manager ON manager.id = l.assigned_manager_id
     ${whereClause}
     ORDER BY l.updated_at DESC`,
    params
  );
};

export const getLeadById = async (id, currentUser = null) => {
  if (currentUser) {
    await ensureLeadAccess(id, currentUser);
  }

  const leads = await query("SELECT * FROM leads WHERE id = :id LIMIT 1", { id });
  if (!leads.length) {
    throw { status: 404, message: "Lead not found" };
  }

  const statuses = await query(
    `SELECT h.*, u.full_name AS changed_by_name
     FROM lead_status_history h
     LEFT JOIN users u ON u.id = h.changed_by
     WHERE h.lead_id = :id
     ORDER BY h.created_at DESC`,
    { id }
  );
  const activities = await query(
    `SELECT a.*, u.full_name AS actor_name
     FROM lead_activities a
     LEFT JOIN users u ON u.id = a.actor_id
     WHERE a.lead_id = :id
     ORDER BY a.created_at DESC`,
    { id }
  );

  return { ...leads[0], statusHistory: statuses, activities };
};

export const updateLeadStatus = async ({ id, status, note, nextFollowUpAt }, currentUser) => {
  await ensureLeadAccess(id, currentUser);
  await query(
    `UPDATE leads
     SET current_status = :status,
         next_follow_up_at = :nextFollowUpAt,
         lead_category = CASE WHEN :status = 'hot_lead' THEN 'hot' ELSE lead_category END,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = :id`,
    { id, status, note, nextFollowUpAt: nextFollowUpAt || null }
  );

  await appendStatusHistory({ leadId: id, status, changedBy: currentUser.id, note });
  await appendActivity({ leadId: id, actorId: currentUser.id, action: "status_updated", note, metadata: { status } });

  return getLeadById(id, currentUser);
};

export const assignLead = async ({ leadId, assignedTo, assignedManagerId = null, note }, currentUser) => {
  await ensureLeadAccess(leadId, currentUser);
  await query(
    `UPDATE leads
     SET assigned_to = :assignedTo,
         assigned_manager_id = COALESCE(:assignedManagerId, assigned_manager_id),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = :leadId`,
    { leadId, assignedTo, assignedManagerId }
  );

  await query(
    `INSERT INTO lead_assignments (lead_id, assigned_to, assigned_by, assigned_manager_id, note)
     VALUES (:leadId, :assignedTo, :assignedBy, :assignedManagerId, :note)`,
    {
      leadId,
      assignedTo,
      assignedBy: currentUser.id,
      assignedManagerId,
      note
    }
  );

  await appendActivity({ leadId, actorId: currentUser.id, action: "lead_assigned", note, metadata: { assignedTo } });

  const assignees = await query("SELECT id, email, full_name FROM users WHERE id = :id", { id: assignedTo });
  if (assignees.length) {
    await sendEmailNotification({
      to: assignees[0].email,
      subject: "New lead assigned",
      html: `<p>Hello ${assignees[0].full_name},</p><p>A new lead has been assigned to you in One99 Properties.</p>`,
      leadId,
      userId: assignedTo,
      type: "lead_assignment"
    });
  }

  return getLeadById(leadId, currentUser);
};

export const forwardHotLeadToManager = async ({ leadId, managerId, note }, currentUser) => {
  await ensureLeadAccess(leadId, currentUser);
  await query(
    `UPDATE leads
     SET lead_category = 'hot',
         current_status = 'hot_lead',
         assigned_manager_id = :managerId,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = :leadId`,
    { leadId, managerId }
  );

  await appendStatusHistory({
    leadId,
    status: "hot_lead",
    changedBy: currentUser.id,
    note: note || "Forwarded to manager"
  });
  await appendActivity({ leadId, actorId: currentUser.id, action: "hot_lead_forwarded", note, metadata: { managerId } });
  await logNotification({
    leadId,
    userId: managerId,
    type: "hot_lead",
    subject: "Hot lead forwarded",
    message: note || "A hot lead has been forwarded for manager attention."
  });

  return getLeadById(leadId, currentUser);
};

export const markLeadBooked = async ({ leadId, bookingValue = null, note }, currentUser) => {
  await ensureLeadAccess(leadId, currentUser);
  await query(
    `UPDATE leads
     SET current_status = 'booked',
         booked_at = CURRENT_TIMESTAMP,
         booking_value = :bookingValue,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = :leadId`,
    { leadId, bookingValue }
  );

  await appendStatusHistory({
    leadId,
    status: "booked",
    changedBy: currentUser.id,
    note: note || "Lead booked"
  });
  await appendActivity({ leadId, actorId: currentUser.id, action: "lead_booked", note, metadata: { bookingValue } });

  return getLeadById(leadId, currentUser);
};

export const getLeadStats = async (currentUser) => {
  const visibility = buildLeadVisibilityClause(currentUser);
  const rows = await query(
    `SELECT
       COUNT(*)::int AS "totalLeads",
       COALESCE(SUM(CASE WHEN l.lead_category = 'hot' THEN 1 ELSE 0 END), 0)::int AS "hotLeads",
       COALESCE(SUM(CASE WHEN l.current_status = 'converted' THEN 1 ELSE 0 END), 0)::int AS "convertedLeads",
       COALESCE(SUM(CASE WHEN l.current_status = 'follow_up' THEN 1 ELSE 0 END), 0)::int AS "followUps",
       COALESCE(SUM(CASE WHEN l.current_status = 'booked' THEN 1 ELSE 0 END), 0)::int AS "bookedLeads"
     FROM leads l
     ${visibility.clause}`,
    visibility.params
  );

  return rows[0];
};
