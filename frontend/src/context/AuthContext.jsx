import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // resolving stored token on mount

  /* ── Restore session from stored token on app load ── */
  useEffect(() => {
    const token = localStorage.getItem("motorly_token");
    if (!token) {
      setLoading(false);
      return;
    }
    authAPI
      .me()
      .then((data) => setUser(data.user))
      .catch(() => {
        // Token invalid/expired — clear it
        localStorage.removeItem("motorly_token");
      })
      .finally(() => setLoading(false));
  }, []);

  const isLoggedIn = !!user;

  /* ── Register ── */
  const register = async (formData) => {
    const data = await authAPI.register(formData);
    localStorage.setItem("motorly_token", data.token);
    setUser(data.user);
    return data;
  };

  /* ── Login ── */
  const login = async (credentials) => {
    const data = await authAPI.login(credentials);
    localStorage.setItem("motorly_token", data.token);
    setUser(data.user);
    return data;
  };

  /* ── Logout ── */
  const logout = () => {
    localStorage.removeItem("motorly_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
