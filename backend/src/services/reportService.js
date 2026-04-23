import { query } from "../config/db.js";

export const getSummaryReport = async () => {
  const [leadSources, statuses, assignments, funnel, hotLeads, timeline] = await Promise.all([
    query(
      `SELECT lead_source AS label, COUNT(*)::int AS value
       FROM leads
       GROUP BY lead_source
       ORDER BY value DESC`
    ),
    query(
      `SELECT current_status AS label, COUNT(*)::int AS value
       FROM leads
       GROUP BY current_status
       ORDER BY value DESC`
    ),
    query(
      `SELECT u.full_name AS label, COUNT(*)::int AS value
       FROM leads l
       JOIN users u ON u.id = l.assigned_to
       GROUP BY u.full_name
       ORDER BY value DESC`
    ),
    query(
      `SELECT 'New' AS stage, COUNT(*)::int AS value FROM leads
       UNION ALL
       SELECT 'In Progress' AS stage, COUNT(*)::int AS value FROM leads WHERE current_status = 'in_progress'
       UNION ALL
       SELECT 'Hot' AS stage, COUNT(*)::int AS value FROM leads WHERE lead_category = 'hot'
       UNION ALL
       SELECT 'Converted' AS stage, COUNT(*)::int AS value FROM leads WHERE current_status = 'converted'
       UNION ALL
       SELECT 'Booked' AS stage, COUNT(*)::int AS value FROM leads WHERE current_status = 'booked'`
    ),
    query(
      `SELECT DATE(updated_at) AS report_date, COUNT(*)::int AS value
       FROM leads
       WHERE lead_category = 'hot'
       GROUP BY DATE(updated_at)
       ORDER BY report_date DESC
       LIMIT 12`
    ),
    query(
      `SELECT DATE(created_at) AS report_date, COUNT(*)::int AS total
       FROM leads
       GROUP BY DATE(created_at)
       ORDER BY report_date DESC
       LIMIT 14`
    )
  ]);

  return { leadSources, statuses, assignments, funnel, hotLeads, timeline };
};

export const getCalendarReport = async () =>
  query(
    `SELECT
       DATE(COALESCE(next_follow_up_at, created_at)) AS report_date,
       COUNT(*)::int AS total_leads,
       COALESCE(SUM(CASE WHEN current_status = 'follow_up' THEN 1 ELSE 0 END), 0)::int AS follow_ups,
       COALESCE(SUM(CASE WHEN current_status = 'booked' THEN 1 ELSE 0 END), 0)::int AS booked
     FROM leads
     GROUP BY DATE(COALESCE(next_follow_up_at, created_at))
     ORDER BY report_date DESC`
  );

export const getDelayAlerts = async () =>
  query(
    `SELECT id, full_name, phone, current_status, next_follow_up_at, assigned_to
     FROM leads
     WHERE next_follow_up_at IS NOT NULL
       AND next_follow_up_at < NOW()
       AND current_status NOT IN ('converted', 'booked', 'dropped')
     ORDER BY next_follow_up_at ASC`
  );
