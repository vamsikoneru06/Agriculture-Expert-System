import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdNotifications, MdSearch } from 'react-icons/md';

const PAGE_TITLES = {
  '/dashboard':  { title: 'Dashboard',          subtitle: 'Overview & Analytics',       emoji: '🌾' },
  '/expert':     { title: 'Expert System',      subtitle: 'IF-THEN Rule Inference',     emoji: '🧠' },
  '/simulation': { title: 'Simulation',         subtitle: 'Live Environmental Conditions', emoji: '🌦️' },
  '/ml':         { title: 'ML Prediction',      subtitle: 'Decision Tree Yield Forecast', emoji: '🤖' },
  '/history':    { title: 'Prediction History', subtitle: 'Past Results & Exports',     emoji: '📋' },
  '/admin':      { title: 'Admin Panel',        subtitle: 'System Management',          emoji: '⚙️' },
  '/chatbot':    { title: 'AI Chatbot',         subtitle: 'Powered by Gemini AI',       emoji: '💬' },
};

export default function Navbar() {
  const { user }   = useAuth();
  const location   = useLocation();
  const [showNote, setShowNote] = useState(false);
  const page = PAGE_TITLES[location.pathname] || { title: 'AgriExpert', subtitle: '', emoji: '🌿' };
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <header className="bg-[#0d1117]/80 backdrop-blur-sm border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{page.emoji}</span>
        <div>
          <h1 className="text-lg font-bold text-white leading-tight">{page.title}</h1>
          <p className="text-xs text-slate-500">{page.subtitle} • {today}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2">
          <MdSearch className="text-slate-500" size={16} />
          <input placeholder="Search…" className="bg-transparent text-sm text-slate-400 outline-none w-32 placeholder-slate-600" readOnly />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => setShowNote(n => !n)} className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all relative">
            <MdNotifications size={18} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>
          {showNote && (
            <div className="absolute right-0 mt-2 w-72 bg-[#0d1117] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 z-50 p-4">
              <p className="text-sm font-semibold text-white mb-3">Notifications</p>
              {[
                { text: 'New crop prediction saved', time: '2 min ago', color: 'bg-green-500' },
                { text: 'Simulation completed',       time: '1 hr ago',  color: 'bg-blue-500'  },
                { text: 'Admin added a new rule',     time: '3 hr ago',  color: 'bg-yellow-500'},
              ].map((n, i) => (
                <div key={i} className="flex items-start gap-2.5 py-2.5 border-b border-white/[0.06] last:border-0">
                  <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.color}`} />
                  <div>
                    <p className="text-xs text-slate-300">{n.text}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-white/[0.06]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-green-500/20">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-white leading-tight">{user?.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
