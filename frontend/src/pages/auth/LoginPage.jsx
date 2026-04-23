import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { dashboardRoutes } from "../../lib/roles";
import { useAuth } from "../../hooks/useAuth";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = await login(form);
      navigate(dashboardRoutes[data.user.role], { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[linear-gradient(135deg,_#13293d,_#1d4d72)] p-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-soft lg:grid-cols-[1.2fr_0.8fr]">
        <div className="bg-sand p-10">
          <p className="text-xs uppercase tracking-[0.35em] text-brand">One99 Properties</p>
          <h1 className="mt-5 max-w-lg text-5xl font-semibold leading-tight text-ink">
            Real estate lead automation for every team in the funnel.
          </h1>
          <p className="mt-5 max-w-xl text-slate-600">
            Capture, assign, qualify, and convert leads across channel partners, telecallers, managers, admin, and
            rental operations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-10">
          <h2 className="text-3xl font-semibold text-ink">Sign in</h2>
          <p className="mt-2 text-sm text-slate-500">Access your dashboard and current lead queue.</p>
          <div className="mt-8 space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            />
          </div>
          {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="mt-6 w-full rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {busy ? "Signing in..." : "Login"}
          </button>
          <p className="mt-6 text-sm text-slate-500">
            New channel partner?{" "}
            <Link to="/register" className="font-semibold text-brand">
              Create account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

