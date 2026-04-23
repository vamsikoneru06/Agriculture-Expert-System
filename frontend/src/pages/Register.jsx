import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdPerson, MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdGrain } from 'react-icons/md';

const ROLES = [
  { value: 'farmer',  label: 'Farmer',  desc: 'Get crop & soil recommendations',    emoji: '👨‍🌾' },
  { value: 'student', label: 'Student', desc: 'Learn and explore expert system',     emoji: '🎓' },
  { value: 'admin',   label: 'Admin',   desc: 'Manage rules, users & analytics',     emoji: '⚙️'  },
];

export default function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'farmer' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    const result = await register(form.name, form.email, form.password, form.role);
    setLoading(false);
    if (result.success) navigate('/dashboard');
    else setError(result.message || 'Registration failed');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <MdGrain className="text-white text-2xl" />
          </div>
          <span className="text-primary-700 dark:text-primary-300 font-bold text-xl">AgriExpert System</span>
        </div>

        <div className="card">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Create Account</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Join the smart agriculture platform</p>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="form-label">Full Name</label>
              <div className="relative">
                <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text" name="name" value={form.name} onChange={handleChange}
                  placeholder="Your full name" className="form-input pl-10" required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="form-label">Email Address</label>
              <div className="relative">
                <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com" className="form-input pl-10" required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPwd ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} placeholder="Min. 6 characters"
                  className="form-input pl-10 pr-10" required
                />
                <button type="button" onClick={() => setShowPwd(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPwd ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                </button>
              </div>
            </div>

            {/* Role selection */}
            <div>
              <label className="form-label">Select Your Role</label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, role: r.value }))}
                    className={`p-3 rounded-xl border-2 text-center transition-all
                      ${form.role === r.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                        : 'border-slate-200 dark:border-slate-600 hover:border-primary-300'}`}
                  >
                    <div className="text-2xl mb-1">{r.emoji}</div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{r.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-tight">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating…</>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-4 text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
