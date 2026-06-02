import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { SplineScene } from '../components/ui/SplineScene';
import { Spotlight } from '../components/ui/Spotlight';

const DEMO_CREDENTIALS = [
  { role: 'Farmer',  email: 'farmer@agri.com',  password: 'farmer123',  color: 'bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30' },
  { role: 'Student', email: 'student@agri.com', password: 'student123', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30' },
];

const FEATURES = [
  { label: '25+ Expert Rules', emoji: '📋' },
  { label: 'ML Predictions',   emoji: '🤖' },
  { label: 'Live Simulation',  emoji: '🌦️' },
  { label: 'Data Analytics',   emoji: '📊' },
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
    <div className="min-h-screen flex bg-black">

      {/* ── Left panel — 3D Spline scene ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black flex-col">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#4ade80" />

        {/* 3D Scene */}
        <div className="absolute inset-0">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none" />

        {/* Top logo */}
        <div className="relative z-10 p-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/20 border border-green-500/40 rounded-xl flex items-center justify-center text-xl">
            🌾
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight">AgriExpert System</p>
            <p className="text-green-400 text-xs">Smart Farming with AI</p>
          </div>
        </div>

        {/* Bottom text content */}
        <div className="relative z-10 mt-auto p-10">
          <h2 className="text-4xl font-bold text-white leading-tight mb-3">
            Empowering Farmers<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-300">
              with Intelligent AI
            </span>
          </h2>
          <p className="text-slate-300 text-base mb-6">
            Expert system + ML predictions + real-time simulation for smart crop decisions.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {FEATURES.map(f => (
              <div key={f.label} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3 flex items-center gap-2">
                <span className="text-xl">{f.emoji}</span>
                <span className="text-white text-sm font-medium">{f.label}</span>
              </div>
            ))}
          </div>
          <p className="text-slate-500 text-xs mt-6">© 2025 Agriculture Expert System</p>
        </div>
      </div>

      {/* ── Right panel — login form ── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#0a0a0a] relative">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="w-full max-w-md relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <span className="text-3xl">🌾</span>
            <span className="text-green-400 font-bold text-xl">AgriExpert</span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-slate-400 mb-8 text-sm">Sign in to your account to continue</p>

          {/* Demo credentials */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Quick Demo Login</p>
            <div className="flex gap-2 flex-wrap">
              {DEMO_CREDENTIALS.map(cred => (
                <button
                  key={cred.role}
                  onClick={() => fillDemo(cred)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${cred.color}`}
                >
                  {cred.role}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Email Address</label>
              <div className="relative">
                <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type={showPwd ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPwd ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white
                         bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500
                         transition-all duration-200 shadow-lg shadow-green-900/30
                         disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-green-400 font-semibold hover:text-green-300 transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
