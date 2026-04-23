import clsx from "clsx";
import { NavLink } from "react-router-dom";
import { navigationByRole } from "../data/navigation";
import { roleLabels } from "../lib/roles";
import { useAuth } from "../hooks/useAuth";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigation = navigationByRole[user?.role] || [];

  return (
    <aside className="flex min-h-screen w-full max-w-72 flex-col bg-ink px-6 py-8 text-white">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-white/50">One99 Properties</p>
        <h1 className="mt-3 text-3xl font-semibold">Lead OS</h1>
        <p className="mt-2 text-sm text-white/70">{roleLabels[user?.role]}</p>
      </div>

      <nav className="mt-10 flex-1 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                "block rounded-2xl px-4 py-3 text-sm transition",
                isActive ? "bg-white text-ink" : "bg-white/5 text-white/80 hover:bg-white/10"
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={logout}
        className="rounded-2xl border border-white/20 px-4 py-3 text-sm text-white/90 transition hover:bg-white/10"
      >
        Sign out
      </button>
    </aside>
  );
};

export default Sidebar;

