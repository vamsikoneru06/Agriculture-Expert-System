import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { MdSunny, MdNightlight, MdNotifications, MdSearch } from 'react-icons/md';

const PAGE_TITLES = {
  '/dashboard':  { title: 'Dashboard',       subtitle: 'Overview & Analytics' },
  '/expert':     { title: 'Expert System',   subtitle: 'AI Crop Recommendations' },
  '/simulation': { title: 'Simulation',      subtitle: 'Environmental Conditions' },
  '/ml':         { title: 'ML Prediction',   subtitle: 'Machine Learning Insights' },
  '/history':    { title: 'Prediction History', subtitle: 'Past Results' },
  '/admin':      { title: 'Admin Panel',     subtitle: 'System Management' },
  '/chatbot':    { title: 'AI Chatbot',      subtitle: 'Ask Anything' },
};

export default function Navbar() {
  const { dark, toggle } = useTheme();
  const { user }         = useAuth();
  const location         = useLocation();
  const [showNote, setShowNote] = useState(false);

  const page = PAGE_TITLES[location.pathname] || { title: 'AgriExpert', subtitle: '' };

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between shadow-sm">
      {/* ── Page title ── */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{page.title}</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">{page.subtitle} • {today}</p>
      </div>

      {/* ── Right controls ── */}
      <div className="flex items-center gap-3">
        {/* Search (decorative) */}
        <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-xl px-3 py-2">
          <MdSearch className="text-slate-400" size={18} />
          <input
            placeholder="Search…"
            className="bg-transparent text-sm text-slate-600 dark:text-slate-300 outline-none w-36 placeholder-slate-400"
            readOnly
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNote(n => !n)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300
                       hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors relative"
          >
            <MdNotifications size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          {showNote && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-xl
                            border border-slate-100 dark:border-slate-700 z-50 p-4">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Notifications</p>
              {[
                { text: 'New crop prediction saved', time: '2 min ago', color: 'bg-green-500' },
                { text: 'Simulation completed',       time: '1 hr ago',  color: 'bg-blue-500'  },
                { text: 'Admin added a new rule',     time: '3 hr ago',  color: 'bg-yellow-500'},
              ].map((n, i) => (
                <div key={i} className="flex items-start gap-2 py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                  <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.color}`} />
                  <div>
                    <p className="text-xs text-slate-700 dark:text-slate-300">{n.text}</p>
                    <p className="text-xs text-slate-400">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300
                     hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {dark ? <MdSunny size={20} /> : <MdNightlight size={20} />}
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight">{user?.name}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
