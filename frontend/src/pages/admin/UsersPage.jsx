import { useEffect, useState } from "react";
import HeaderBar from "../../components/HeaderBar";
import UsersManager from "../../components/UsersManager";
import AppShell from "../../layouts/AppShell";
import { api } from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";

const UsersPage = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const loadUsers = async () => {
    setUsers(await api.getUsers(token));
  };

  useEffect(() => {
    loadUsers();
  }, [token]);

  const withRefresh = async (task, successText) => {
    try {
      setBusy(true);
      await task();
      setMessage(successText);
      await loadUsers();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <HeaderBar title="Admin Panel" subtitle="Control users, activation status, and role-level access for the organization." />
        {message ? <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-600 shadow-soft">{message}</div> : null}
        <UsersManager
          users={users}
          busy={busy}
          onCreate={(payload) => withRefresh(() => api.createUser(token, payload), "User created successfully.")}
          onToggleActive={(item) =>
            withRefresh(
              () => api.updateUser(token, item.id, { isActive: !item.is_active, role: item.role }),
              "User status updated."
            )
          }
          onDelete={(id) => withRefresh(() => api.deleteUser(token, id), "User deleted successfully.")}
        />
      </div>
    </AppShell>
  );
};

export default UsersPage;

