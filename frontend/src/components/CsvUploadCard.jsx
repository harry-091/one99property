import { useState } from "react";

const CsvUploadCard = ({ onUpload, busy }) => {
  const [file, setFile] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) return;
    await onUpload(file);
    setFile(null);
    event.target.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-[1.75rem] bg-white p-6 shadow-soft">
      <h3 className="text-xl font-semibold text-ink">Bulk Upload via CSV</h3>
      <p className="mt-1 text-sm text-slate-500">Use columns like name, phone, email, location, budget, property_type.</p>
      <input
        type="file"
        accept=".csv"
        onChange={(event) => setFile(event.target.files?.[0] || null)}
        className="mt-4 block w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm"
      />
      <button
        type="submit"
        disabled={!file || busy}
        className="mt-4 rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
      >
        {busy ? "Uploading..." : "Import CSV"}
      </button>
    </form>
  );
};

export default CsvUploadCard;

