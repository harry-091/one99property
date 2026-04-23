import { useEffect, useState } from "react";
import CsvUploadCard from "../../components/CsvUploadCard";
import HeaderBar from "../../components/HeaderBar";
import LeadDetailPanel from "../../components/LeadDetailPanel";
import LeadForm from "../../components/LeadForm";
import LeadTable from "../../components/LeadTable";
import StatCard from "../../components/StatCard";
import AppShell from "../../layouts/AppShell";
import { api } from "../../lib/api";
import { hasAnyRole, roleLabels } from "../../lib/roles";
import { useAuth } from "../../hooks/useAuth";

const DashboardPage = () => {
  const { token, user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({ search: "", status: "", category: "", propertyType: "" });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    const query = new URLSearchParams(
      Object.entries(filters).filter(([, value]) => value).map(([key, value]) => [key, value])
    ).toString();

    const [leadRows, statRows] = await Promise.all([
      api.getLeads(token, query ? `?${query}` : ""),
      api.getLeadStats(token)
    ]);

    setLeads(leadRows);
    setStats(statRows);

    if (hasAnyRole(user, ["manager", "admin", "staff"])) {
      const userRows = await api.getUsers(token).catch(() => []);
      setUsers(userRows);
    }
  };

  useEffect(() => {
    loadData();
  }, [token, user, filters.search, filters.status, filters.category, filters.propertyType]);

  const withFeedback = async (task, successText) => {
    try {
      setBusy(true);
      await task();
      setMessage(successText);
      await loadData();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  const openLeadDetail = async (leadId) => {
    try {
      setDetailLoading(true);
      setSelectedLead({ id: leadId });
      const lead = await api.getLead(token, leadId);
      setSelectedLead(lead);
    } catch (error) {
      setMessage(error.message);
      setSelectedLead(null);
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <HeaderBar
          title={`${roleLabels[user.role]} Dashboard`}
          subtitle="Manage lead flow, follow-ups, assignments, and conversion velocity from one workspace."
        />

        {message ? <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-600 shadow-soft">{message}</div> : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Total Leads" value={stats.totalLeads} accent="bg-sand text-brand" />
          <StatCard label="Hot Leads" value={stats.hotLeads} accent="bg-rose-50 text-rose-600" />
          <StatCard label="Converted" value={stats.convertedLeads} accent="bg-emerald-50 text-emerald-700" />
          <StatCard label="Follow-ups" value={stats.followUps} accent="bg-amber-50 text-amber-700" />
          <StatCard label="Booked" value={stats.bookedLeads} accent="bg-slate-100 text-slate-700" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          {hasAnyRole(user, ["channel_partner", "admin", "manager", "rental_team"]) ? (
            <LeadForm onSubmit={(payload) => withFeedback(() => api.createLead(token, payload), "Lead created successfully.")} busy={busy} />
          ) : (
            <div className="rounded-[1.75rem] bg-white p-6 shadow-soft">
              <h3 className="text-xl font-semibold text-ink">Performance Snapshot</h3>
              <p className="mt-2 text-sm text-slate-500">
                Focus on timely follow-ups and hot lead qualification to improve team conversion rate.
              </p>
            </div>
          )}

          {hasAnyRole(user, ["channel_partner", "admin"]) ? (
            <CsvUploadCard
              onUpload={(file) =>
                withFeedback(async () => {
                  const formData = new FormData();
                  formData.append("file", file);
                  await api.uploadCsv(token, formData);
                }, "CSV import completed.")
              }
              busy={busy}
            />
          ) : (
            <div className="rounded-[1.75rem] bg-white p-6 shadow-soft">
              <h3 className="text-xl font-semibold text-ink">Action Guide</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li>Update status after every call to keep reporting accurate.</li>
                <li>Forward hot leads immediately so managers can prioritize closure.</li>
                <li>Use follow-up dates to avoid admin delay alerts.</li>
              </ul>
            </div>
          )}
        </div>

        <div className="grid gap-4 rounded-[1.75rem] bg-white p-5 shadow-soft md:grid-cols-4">
          <input
            placeholder="Search by name, phone, email"
            value={filters.search}
            onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
            className="rounded-2xl border border-slate-200 px-4 py-3"
          />
          <select
            value={filters.status}
            onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
            className="rounded-2xl border border-slate-200 px-4 py-3"
          >
            <option value="">All statuses</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="follow_up">Follow Up</option>
            <option value="converted">Converted</option>
            <option value="dropped">Dropped</option>
            <option value="hot_lead">Hot Lead</option>
            <option value="booked">Booked</option>
          </select>
          <select
            value={filters.category}
            onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))}
            className="rounded-2xl border border-slate-200 px-4 py-3"
          >
            <option value="">All categories</option>
            <option value="normal">Normal</option>
            <option value="hot">Hot</option>
          </select>
          <select
            value={filters.propertyType}
            onChange={(event) => setFilters((current) => ({ ...current, propertyType: event.target.value }))}
            className="rounded-2xl border border-slate-200 px-4 py-3"
          >
            <option value="">All property types</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="plot">Plot</option>
            <option value="commercial">Commercial</option>
            <option value="rental">Rental</option>
            <option value="other">Other</option>
          </select>
        </div>

        <LeadTable
          leads={leads}
          users={users}
          user={user}
          onRefresh={loadData}
          apiActions={{
            updateStatus: (leadId, payload) => api.updateLeadStatus(token, leadId, payload),
            assign: (leadId, payload) => api.assignLead(token, leadId, payload),
            forwardHot: (leadId, payload) => api.forwardHotLead(token, leadId, payload),
            book: (leadId, payload) => api.bookLead(token, leadId, payload),
            viewLead: openLeadDetail
          }}
        />

        {selectedLead ? (
          <LeadDetailPanel lead={selectedLead.full_name ? selectedLead : null} loading={detailLoading} onClose={() => setSelectedLead(null)} />
        ) : null}
      </div>
    </AppShell>
  );
};

export default DashboardPage;
