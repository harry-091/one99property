const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

const buildOptions = (method, body, token, isFormData = false) => ({
  method,
  headers: {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(!isFormData ? { "Content-Type": "application/json" } : {})
  },
  ...(body ? { body: isFormData ? body : JSON.stringify(body) } : {})
});

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const api = {
  register: (payload) => request("/auth/register", buildOptions("POST", payload)),
  login: (payload) => request("/auth/login", buildOptions("POST", payload)),
  me: (token) => request("/auth/me", buildOptions("GET", null, token)),
  getLeads: (token, query = "") => request(`/leads${query}`, buildOptions("GET", null, token)),
  getLead: (token, leadId) => request(`/leads/${leadId}`, buildOptions("GET", null, token)),
  getLeadStats: (token) => request("/leads/stats/overview", buildOptions("GET", null, token)),
  createLead: (token, payload) => request("/leads", buildOptions("POST", payload, token)),
  uploadCsv: (token, formData) => request("/leads/upload-csv", buildOptions("POST", formData, token, true)),
  updateLeadStatus: (token, leadId, payload) =>
    request(`/leads/${leadId}/status`, buildOptions("PATCH", payload, token)),
  assignLead: (token, leadId, payload) =>
    request(`/leads/${leadId}/assign`, buildOptions("POST", payload, token)),
  forwardHotLead: (token, leadId, payload) =>
    request(`/leads/${leadId}/forward-hot`, buildOptions("POST", payload, token)),
  bookLead: (token, leadId, payload) => request(`/leads/${leadId}/book`, buildOptions("POST", payload, token)),
  getUsers: (token) => request("/users", buildOptions("GET", null, token)),
  createUser: (token, payload) => request("/users", buildOptions("POST", payload, token)),
  updateUser: (token, id, payload) => request(`/users/${id}`, buildOptions("PATCH", payload, token)),
  deleteUser: (token, id) => request(`/users/${id}`, buildOptions("DELETE", null, token)),
  getSummaryReport: (token) => request("/reports/summary", buildOptions("GET", null, token)),
  getCalendarReport: (token) => request("/reports/calendar", buildOptions("GET", null, token)),
  getDelayAlerts: (token) => request("/reports/delay-alerts", buildOptions("GET", null, token)),
  exportCsvUrl: `${API_BASE}/reports/export/csv`
};
