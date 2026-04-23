import { useState } from "react";

const emptyUser = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  role: "staff",
  companyName: ""
};

const UsersManager = ({ users, onCreate, onToggleActive, onDelete, busy }) => {
  const [form, setForm] = useState(emptyUser);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onCreate(form);
    setForm(emptyUser);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="rounded-[1.75rem] bg-white p-6 shadow-soft">
        <h3 className="text-xl font-semibold text-ink">Create User</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            ["fullName", "Full name"],
            ["email", "Email"],
            ["phone", "Phone"],
            ["password", "Temporary password"],
            ["companyName", "Company name"]
          ].map(([key, label]) => (
            <label key={key} className="text-sm text-slate-600">
              {label}
              <input
                type={key === "password" ? "password" : "text"}
                value={form[key]}
                onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                required={["fullName", "email", "phone", "password"].includes(key)}
              />
            </label>
          ))}
          <label className="text-sm text-slate-600">
            Role
            <select
              value={form.role}
              onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
            >
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
              <option value="rental_team">Rental Team</option>
              <option value="channel_partner">Channel Partner</option>
            </select>
          </label>
        </div>
        <button
          type="submit"
          disabled={busy}
          className="mt-4 rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? "Saving..." : "Add User"}
        </button>
      </form>

      <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-soft">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Email</th>
              <th className="px-5 py-4">Role</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((item) => (
              <tr key={item.id} className="border-t border-slate-100">
                <td className="px-5 py-4 font-semibold text-ink">{item.full_name}</td>
                <td className="px-5 py-4 text-slate-600">{item.email}</td>
                <td className="px-5 py-4 capitalize">{item.role.replaceAll("_", " ")}</td>
                <td className="px-5 py-4">{item.is_active ? "Active" : "Inactive"}</td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleActive(item)}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-ink"
                    >
                      {item.is_active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersManager;

