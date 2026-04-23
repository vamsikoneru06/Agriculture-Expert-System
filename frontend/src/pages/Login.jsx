import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdGrain } from 'react-icons/md';

const DEMO_CREDENTIALS = [
  { role: 'Farmer',  email: 'farmer@agri.com',  password: 'farmer123',  color: 'bg-green-100 text-green-700 border-green-200' },
  { role: 'Student', email: 'student@agri.com', password: 'student123', color: 'bg-blue-100 text-blue-700 border-blue-200' },
];

export default function Login() {
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const location     = useLocation();
  const from         = location.state?.from?.pathname || '/dashboard';

  const [form,    setForm]    = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) navigate(from, { replace: true });
    else setError(result.message || 'Login failed');
  };

  const fillDemo = (cred) => setForm({ email: cred.email, password: cred.password });

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel (decorative) ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <MdGrain className="text-white text-2xl" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight">AgriExpert System</p>
            <p className="text-primary-200 text-xs">Smart Farming with AI</p>
          </div>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Empowering Farmers<br />with Intelligent<br />Agriculture
          </h2>
          <p className="text-primary-200 text-lg">
            Expert system + ML predictions + real-time simulation for smart crop decisions.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { label: '25+ Expert Rules',    emoji: '📋' },
              { label: 'ML Predictions',      emoji: '🤖' },
              { label: 'Live Simulation',     emoji: '🌦️' },
              { label: 'Data Analytics',      emoji: '📊' },
            ].map(f => (
              <div key={f.label} className="bg-white/10 rounded-xl p-3 flex items-center gap-2">
                <span className="text-xl">{f.emoji}</span>
                <span className="text-white text-sm font-medium">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-primary-300 text-sm">© 2025 Agriculture Expert System — Final Year Project</p>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-900">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <MdGrain className="text-white text-2xl" />
            </div>
            <span className="text-primary-700 dark:text-primary-300 font-bold text-xl">AgriExpert</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Welcome back</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Sign in to your account to continue</p>

          {/* Demo credentials */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Quick Demo Login</p>
            <div className="flex gap-2 flex-wrap">
              {DEMO_CREDENTIALS.map(cred => (
                <button
                  key={cred.role}
                  onClick={() => fillDemo(cred)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors hover:opacity-80 ${cred.color}`}
                >
                  {cred.role}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Email Address</label>
              <div className="relative">
                <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="form-input pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPwd ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-input pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPwd ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in…</>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
