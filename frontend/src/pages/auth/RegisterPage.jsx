import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { dashboardRoutes } from "../../lib/roles";
import { useAuth } from "../../hooks/useAuth";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    password: ""
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = await register(form);
      navigate(dashboardRoutes[data.user.role], { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[linear-gradient(135deg,_#1f6f78,_#13293d)] p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl rounded-[2rem] bg-white p-10 shadow-soft">
        <p className="text-xs uppercase tracking-[0.35em] text-brand">Partner Registration</p>
        <h1 className="mt-4 text-4xl font-semibold text-ink">Create your Channel Partner account</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            ["fullName", "Full name"],
            ["email", "Email"],
            ["phone", "Phone"],
            ["companyName", "Company name"],
            ["password", "Password"]
          ].map(([key, label]) => (
            <input
              key={key}
              type={key === "password" ? "password" : "text"}
              placeholder={label}
              value={form[key]}
              onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            />
          ))}
        </div>
        {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="mt-6 rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? "Creating account..." : "Register"}
        </button>
        <p className="mt-6 text-sm text-slate-500">
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-brand">
            Go to login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;

