import { createContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("one99_token"));
  const [user, setUser] = useState(() => {
    const value = localStorage.getItem("one99_user");
    return value ? JSON.parse(value) : null;
  });
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await api.me(token);
        setUser(data.user);
        localStorage.setItem("one99_user", JSON.stringify(data.user));
      } catch (error) {
        localStorage.removeItem("one99_token");
        localStorage.removeItem("one99_user");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, [token]);

  const persistSession = (data) => {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("one99_token", data.token);
    localStorage.setItem("one99_user", JSON.stringify(data.user));
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login: async (payload) => {
        const data = await api.login(payload);
        persistSession(data);
        return data;
      },
      register: async (payload) => {
        const data = await api.register(payload);
        persistSession(data);
        return data;
      },
      logout: () => {
        localStorage.removeItem("one99_token");
        localStorage.removeItem("one99_user");
        setToken(null);
        setUser(null);
      }
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

