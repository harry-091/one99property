const HeaderBar = ({ title, subtitle, actions }) => (
  <div className="flex flex-col gap-4 rounded-[2rem] bg-white/90 p-6 shadow-soft md:flex-row md:items-center md:justify-between">
    <div>
      <h2 className="text-3xl font-semibold text-ink">{title}</h2>
      <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
    </div>
    {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
  </div>
);

export default HeaderBar;

