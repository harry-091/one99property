import {
  Bar,
  BarChart,
  CartesianGrid,
  Funnel,
  FunnelChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const ChartCard = ({ title, children }) => (
  <div className="rounded-[1.75rem] bg-white p-6 shadow-soft">
    <h3 className="text-xl font-semibold text-ink">{title}</h3>
    <div className="mt-6 h-72">{children}</div>
  </div>
);

const ReportsPanel = ({ summary, calendar, delays }) => (
  <div className="grid gap-6 xl:grid-cols-2">
    <ChartCard title="Lead Source Report">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={summary?.leadSources || []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#b9381f" radius={[12, 12, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>

    <ChartCard title="Lead Status Report">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={summary?.statuses || []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#13293d" radius={[12, 12, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>

    <ChartCard title="Conversion Funnel">
      <ResponsiveContainer width="100%" height="100%">
        <FunnelChart>
          <Tooltip />
          <Legend />
          <Funnel dataKey="value" data={summary?.funnel || []} isAnimationActive fill="#4b7f52" nameKey="stage" />
        </FunnelChart>
      </ResponsiveContainer>
    </ChartCard>

    <ChartCard title="Weekly / Monthly Activity">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={calendar || []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="report_date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total_leads" fill="#b9381f" />
          <Bar dataKey="booked" fill="#13293d" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>

    <div className="rounded-[1.75rem] bg-white p-6 shadow-soft xl:col-span-2">
      <h3 className="text-xl font-semibold text-ink">Delay Alerts</h3>
      <div className="mt-4 grid gap-3">
        {(delays || []).map((item) => (
          <div key={item.id} className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {item.full_name} is overdue for follow-up. Scheduled at {item.next_follow_up_at || "not set"}.
          </div>
        ))}
        {!delays?.length ? <p className="text-sm text-slate-500">No delayed follow-ups right now.</p> : null}
      </div>
    </div>
  </div>
);

export default ReportsPanel;

