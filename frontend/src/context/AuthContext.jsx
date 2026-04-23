import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api')
  .replace(/\/api$/, '');

/* ── Demo users (offline fallback — admin intentionally excluded) ── */
const DEMO_USERS = [
  { id: 1, name: 'Admin',        email: 'admin@agri.com',   password: 'admin123',   role: 'admin'   },
  { id: 2, name: 'Farmer Teja',  email: 'farmer@agri.com',  password: 'farmer123',  role: 'farmer'  },
  { id: 3, name: 'Student Sai',  email: 'student@agri.com', password: 'student123', role: 'student' },
];

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  /* Restore session on mount */
  useEffect(() => {
    const saved = localStorage.getItem('agri_user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch (_) { localStorage.removeItem('agri_user'); }
    }
    setLoading(false);
  }, []);

  /* Login – tries real API first, falls back to demo users */
  const login = useCallback(async (email, password) => {
    /* Try backend */
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
        signal:  AbortSignal.timeout(5000),
      });
      if (res.ok) {
        const data = await res.json();
        const userData = { ...data.user, token: data.token };
        setUser(userData);
        localStorage.setItem('agri_user', JSON.stringify(userData));
        return { success: true };
      }
      // Backend reachable but rejected credentials — return its error, don't fall through
      const err = await res.json().catch(() => ({}));
      return { success: false, message: err.message || 'Invalid email or password' };
    } catch (_) { /* backend offline – fall through to demo */ }

    /* Demo fallback */
    const demo = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (demo) {
      const { password: _p, ...safe } = demo;
      const userData = { ...safe, token: 'demo-jwt-token' };
      setUser(userData);
      localStorage.setItem('agri_user', JSON.stringify(userData));
      return { success: true };
    }

    return { success: false, message: 'Invalid email or password' };
  }, []);

  /* Register – tries real API, falls back to demo registration */
  const register = useCallback(async (name, email, password, role, adminCode = '') => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, password, role, admin_secret_key: adminCode }),
        signal:  AbortSignal.timeout(5000),
      });
      if (res.ok) {
        const data = await res.json();
        const userData = { ...data.user, token: data.token };
        setUser(userData);
        localStorage.setItem('agri_user', JSON.stringify(userData));
        return { success: true };
      }
    } catch (_) { /* offline */ }

    /* Demo registration */
    const exists = DEMO_USERS.find(u => u.email === email);
    if (exists) return { success: false, message: 'Email already registered' };

    const newUser = {
      id: Date.now(), name, email, role: role || 'farmer', token: 'demo-jwt-token',
    };
    setUser(newUser);
    localStorage.setItem('agri_user', JSON.stringify(newUser));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('agri_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
