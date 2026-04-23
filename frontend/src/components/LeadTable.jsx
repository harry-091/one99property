import { useState } from "react";
import { hasAnyRole, roleLabels } from "../lib/roles";

const statusOptions = ["in_progress", "follow_up", "converted", "dropped", "hot_lead", "booked"];

const LeadTable = ({ leads, users, user, onRefresh, apiActions }) => {
  const [drafts, setDrafts] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  const updateDraft = (leadId, patch) => {
    setDrafts((current) => ({
      ...current,
      [leadId]: { ...(current[leadId] || {}), ...patch }
    }));
  };

  const execute = async (leadId, action) => {
    try {
      setLoadingId(leadId);
      await action();
      await onRefresh();
    } finally {
      setLoadingId(null);
    }
  };

  const managers = users.filter((item) => item.role === "manager");
  const staff = users.filter((item) => item.role === "staff" || item.role === "rental_team");

  return (
    <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-5 py-4">Lead</th>
              <th className="px-5 py-4">Type</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Assigned</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const draft = drafts[lead.id] || {};
              return (
                <tr key={lead.id} className="border-t border-slate-100 align-top">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-ink">{lead.full_name}</p>
                    <p className="text-slate-500">{lead.phone}</p>
                    <p className="text-slate-400">{lead.location}</p>
                  </td>
                  <td className="px-5 py-4 capitalize text-slate-600">{lead.property_type}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-sage px-3 py-1 text-xs font-medium capitalize text-ink">
                      {lead.current_status.replaceAll("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {lead.assigned_to_name || "Unassigned"}
                    <p className="mt-1 text-xs text-slate-400">{lead.manager_name || roleLabels[user.role]}</p>
                  </td>
                  <td className="px-5 py-4 capitalize">{lead.lead_category}</td>
                  <td className="px-5 py-4">
                    <div className="space-y-3">
                      {hasAnyRole(user, ["staff", "manager", "admin", "rental_team"]) ? (
                        <div className="flex flex-wrap gap-2">
                          <select
                            value={draft.status || lead.current_status}
                            onChange={(event) => updateDraft(lead.id, { status: event.target.value })}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-xs"
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status.replaceAll("_", " ")}
                              </option>
                            ))}
                          </select>
                          <input
                            value={draft.nextFollowUpAt || ""}
                            onChange={(event) => updateDraft(lead.id, { nextFollowUpAt: event.target.value })}
                            type="datetime-local"
                            className="rounded-xl border border-slate-200 px-3 py-2 text-xs"
                            aria-label="Next follow-up"
                          />
                          <input
                            value={draft.statusNote || ""}
                            onChange={(event) => updateDraft(lead.id, { statusNote: event.target.value })}
                            placeholder="Status note"
                            className="min-w-44 rounded-xl border border-slate-200 px-3 py-2 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              execute(lead.id, () =>
                                apiActions.updateStatus(lead.id, {
                                  status: draft.status || lead.current_status,
                                  nextFollowUpAt: draft.nextFollowUpAt || undefined,
                                  note: draft.statusNote || undefined
                                })
                              )
                            }
                            className="rounded-xl bg-brand px-3 py-2 text-xs font-semibold text-white"
                          >
                            {loadingId === lead.id ? "Updating" : "Save Status"}
                          </button>
                        </div>
                      ) : null}

                      {hasAnyRole(user, ["manager", "admin"]) ? (
                        <div className="flex flex-wrap gap-2">
                          <select
                            value={draft.assignedTo || ""}
                            onChange={(event) => updateDraft(lead.id, { assignedTo: event.target.value })}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-xs"
                          >
                            <option value="">Assign to staff</option>
                            {staff.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.full_name}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() =>
                              draft.assignedTo &&
                              execute(lead.id, () =>
                                apiActions.assign(lead.id, {
                                  assignedTo: Number(draft.assignedTo),
                                  assignedManagerId: user.id,
                                  note: draft.assignNote || undefined
                                })
                              )
                            }
                            className="rounded-xl bg-ink px-3 py-2 text-xs font-semibold text-white"
                          >
                            Assign
                          </button>
                          <input
                            value={draft.assignNote || ""}
                            onChange={(event) => updateDraft(lead.id, { assignNote: event.target.value })}
                            placeholder="Assignment note"
                            className="min-w-44 rounded-xl border border-slate-200 px-3 py-2 text-xs"
                          />
                        </div>
                      ) : null}

                      {hasAnyRole(user, ["staff", "manager", "admin"]) ? (
                        <div className="flex flex-wrap gap-2">
                          <select
                            value={draft.managerId || ""}
                            onChange={(event) => updateDraft(lead.id, { managerId: event.target.value })}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-xs"
                          >
                            <option value="">Forward hot lead</option>
                            {managers.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.full_name}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() =>
                              draft.managerId &&
                              execute(lead.id, () =>
                                apiActions.forwardHot(lead.id, {
                                  managerId: Number(draft.managerId),
                                  note: draft.hotNote || undefined
                                })
                              )
                            }
                            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-ink"
                          >
                            Send
                          </button>
                          <input
                            value={draft.hotNote || ""}
                            onChange={(event) => updateDraft(lead.id, { hotNote: event.target.value })}
                            placeholder="Forward note"
                            className="min-w-44 rounded-xl border border-slate-200 px-3 py-2 text-xs"
                          />
                        </div>
                      ) : null}

                      {hasAnyRole(user, ["manager", "admin"]) ? (
                        <div className="flex flex-wrap gap-2">
                          <input
                            value={draft.bookingValue || ""}
                            onChange={(event) => updateDraft(lead.id, { bookingValue: event.target.value })}
                            type="number"
                            min="0"
                            placeholder="Booking value"
                            className="w-36 rounded-xl border border-slate-200 px-3 py-2 text-xs"
                          />
                          <input
                            value={draft.bookingNote || ""}
                            onChange={(event) => updateDraft(lead.id, { bookingNote: event.target.value })}
                            placeholder="Booking note"
                            className="min-w-40 rounded-xl border border-slate-200 px-3 py-2 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              execute(lead.id, () =>
                                apiActions.book(lead.id, {
                                  bookingValue: draft.bookingValue ? Number(draft.bookingValue) : undefined,
                                  note: draft.bookingNote || undefined
                                })
                              )
                            }
                            className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white"
                          >
                            Mark Booked
                          </button>
                        </div>
                      ) : null}

                      <button
                        type="button"
                        onClick={() => apiActions.viewLead(lead.id)}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-ink"
                      >
                        View Tracking
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!leads.length ? (
              <tr>
                <td colSpan="6" className="px-5 py-10 text-center text-slate-400">
                  No leads found for the current filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadTable;
