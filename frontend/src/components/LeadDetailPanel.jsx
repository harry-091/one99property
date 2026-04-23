const formatDateTime = (value) => {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
};

const label = (value) => value?.replaceAll("_", " ") || "Not available";

const LeadDetailPanel = ({ lead, loading, onClose }) => (
  <div className="fixed inset-0 z-50 bg-ink/40 px-4 py-6 backdrop-blur-sm">
    <div className="ml-auto flex h-full w-full max-w-3xl flex-col overflow-hidden rounded-[1.25rem] bg-white shadow-soft">
      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Lead tracking</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">{lead?.full_name || "Loading lead"}</h2>
            {lead ? (
              <p className="mt-1 text-sm text-slate-500">
                {lead.phone} {lead.email ? `· ${lead.email}` : ""}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-ink"
          >
            Close
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {loading ? <p className="text-sm text-slate-500">Loading lead history...</p> : null}
        {!loading && lead ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              {[
                ["Status", label(lead.current_status)],
                ["Category", label(lead.lead_category)],
                ["Property", label(lead.property_type)],
                ["Next follow-up", formatDateTime(lead.next_follow_up_at)]
              ].map(([title, value]) => (
                <div key={title} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">{title}</p>
                  <p className="mt-2 text-sm font-semibold capitalize text-ink">{value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <section className="rounded-2xl border border-slate-100 p-5">
                <h3 className="font-semibold text-ink">Lead details</h3>
                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="text-slate-400">Location</dt>
                    <dd className="font-medium text-ink">{lead.location}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Investment range</dt>
                    <dd className="font-medium text-ink">{lead.investment_range}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Source</dt>
                    <dd className="font-medium capitalize text-ink">{label(lead.lead_source)}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Created</dt>
                    <dd className="font-medium text-ink">{formatDateTime(lead.created_at)}</dd>
                  </div>
                </dl>
              </section>

              <section className="rounded-2xl border border-slate-100 p-5">
                <h3 className="font-semibold text-ink">Notes</h3>
                <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-600">
                  {lead.notes || "No notes have been added for this lead."}
                </p>
              </section>
            </div>

            <section className="rounded-2xl border border-slate-100 p-5">
              <h3 className="font-semibold text-ink">Status history</h3>
              <div className="mt-4 space-y-4">
                {lead.statusHistory?.map((item) => (
                  <div key={item.id} className="border-l-2 border-sage pl-4">
                    <p className="text-sm font-semibold capitalize text-ink">{label(item.status)}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {formatDateTime(item.created_at)} · {item.changed_by_name || "System"}
                    </p>
                    {item.note ? <p className="mt-2 text-sm text-slate-600">{item.note}</p> : null}
                  </div>
                ))}
                {!lead.statusHistory?.length ? <p className="text-sm text-slate-500">No status changes yet.</p> : null}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 p-5">
              <h3 className="font-semibold text-ink">Activity log</h3>
              <div className="mt-4 divide-y divide-slate-100">
                {lead.activities?.map((item) => (
                  <div key={item.id} className="py-3">
                    <p className="text-sm font-semibold capitalize text-ink">{label(item.action)}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {formatDateTime(item.created_at)} · {item.actor_name || "System"}
                    </p>
                    {item.note ? <p className="mt-2 text-sm text-slate-600">{item.note}</p> : null}
                  </div>
                ))}
                {!lead.activities?.length ? <p className="text-sm text-slate-500">No activities recorded yet.</p> : null}
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </div>
  </div>
);

export default LeadDetailPanel;
