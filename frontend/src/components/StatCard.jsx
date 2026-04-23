const StatCard = ({ label, value, accent }) => (
  <div className="rounded-[1.75rem] bg-white p-5 shadow-soft">
    <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{label}</p>
    <div className="mt-3 flex items-end justify-between">
      <p className="text-3xl font-semibold text-ink">{value ?? 0}</p>
      <span className={`rounded-full px-3 py-1 text-xs font-medium ${accent}`}>Live</span>
    </div>
  </div>
);

export default StatCard;

