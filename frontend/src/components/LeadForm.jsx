import { useState } from "react";

const initialState = {
  fullName: "",
  phone: "",
  email: "",
  location: "",
  investmentRange: "",
  propertyType: "apartment",
  leadSource: "manual",
  leadCategory: "normal",
  notes: ""
};

const LeadForm = ({ onSubmit, busy }) => {
  const [form, setForm] = useState(initialState);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
    setForm(initialState);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-[1.75rem] bg-white p-6 shadow-soft">
      <div className="mb-5">
        <h3 className="text-xl font-semibold text-ink">Add New Lead</h3>
        <p className="mt-1 text-sm text-slate-500">Capture buyer, investor, and rental enquiries in one place.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          ["fullName", "Lead Name"],
          ["phone", "Phone"],
          ["email", "Email"],
          ["location", "Location"],
          ["investmentRange", "Investment Range"],
          ["leadSource", "Lead Source"]
        ].map(([name, label]) => (
          <label key={name} className="text-sm text-slate-600">
            {label}
            <input
              name={name}
              value={form[name]}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-brand/20 transition focus:ring"
              required={["fullName", "phone", "location", "investmentRange"].includes(name)}
            />
          </label>
        ))}

        <label className="text-sm text-slate-600">
          Property Type
          <select
            name="propertyType"
            value={form.propertyType}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
          >
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="plot">Plot</option>
            <option value="commercial">Commercial</option>
            <option value="rental">Rental</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label className="text-sm text-slate-600">
          Lead Category
          <select
            name="leadCategory"
            value={form.leadCategory}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
          >
            <option value="normal">Normal</option>
            <option value="hot">Hot</option>
          </select>
        </label>
      </div>

      <label className="mt-4 block text-sm text-slate-600">
        Notes
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows="4"
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
        />
      </label>

      <button
        type="submit"
        disabled={busy}
        className="mt-5 rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {busy ? "Saving..." : "Create Lead"}
      </button>
    </form>
  );
};

export default LeadForm;

