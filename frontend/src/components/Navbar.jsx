import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Bell, Search, Sun, Moon, ChevronDown } from 'lucide-react';

const PAGE_META = {
  '/dashboard':  { title: 'Dashboard',          subtitle: 'Overview & Analytics',          emoji: '🌾', color: 'text-green-600 dark:text-green-400'  },
  '/expert':     { title: 'Expert System',      subtitle: 'IF-THEN Rule Inference',        emoji: '🧠', color: 'text-emerald-600 dark:text-emerald-400'},
  '/simulation': { title: 'Simulation',         subtitle: 'Live Environmental Conditions', emoji: '🌦️', color: 'text-orange-600 dark:text-orange-400' },
  '/ml':         { title: 'ML Prediction',      subtitle: 'Decision Tree Yield Forecast',  emoji: '🤖', color: 'text-violet-600 dark:text-violet-400' },
  '/history':    { title: 'Prediction History', subtitle: 'Past Results & Exports',        emoji: '📋', color: 'text-blue-600 dark:text-blue-400'    },
  '/admin':      { title: 'Admin Panel',        subtitle: 'System Management',             emoji: '⚙️', color: 'text-rose-600 dark:text-rose-400'    },
  '/chatbot':    { title: 'AI Chatbot',         subtitle: 'Powered by Gemini AI',          emoji: '💬', color: 'text-cyan-600 dark:text-cyan-400'    },
};

const NOTIFICATIONS = [
  { text: 'New crop prediction saved',     time: '2 min ago',  dot: 'bg-green-500'  },
  { text: 'Simulation cycle completed',    time: '1 hr ago',   dot: 'bg-blue-500'   },
  { text: 'Admin added a knowledge rule',  time: '3 hr ago',   dot: 'bg-amber-500'  },
];

export default function Navbar() {
  const { user }         = useAuth();
  const { dark, toggle } = useTheme();
  const location         = useLocation();
  const [showNote, setShowNote] = useState(false);
  const page = PAGE_META[location.pathname] || { title: 'AgriExpert', subtitle: '', emoji: '🌿', color: 'text-green-600' };
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <header className="
      h-16 flex-shrink-0 flex items-center justify-between px-6
      bg-white/80 dark:bg-[#0b0f17]/80 backdrop-blur-xl
      border-b border-slate-200/80 dark:border-white/[0.05]
      transition-colors duration-300
    ">
      {/* ── Left: page title ── */}
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-xl flex-shrink-0">{page.emoji}</span>
        <div className="min-w-0">
          <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight truncate">{page.title}</h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{page.subtitle} · {today}</p>
        </div>
      </div>

      {/* ── Right: actions ── */}
      <div className="flex items-center gap-2 flex-shrink-0">

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 h-9 px-3 bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.06] rounded-xl group focus-within:border-green-400 dark:focus-within:border-green-500/40 transition-all">
          <Search size={14} className="text-slate-400 dark:text-slate-600 flex-shrink-0" />
          <input
            placeholder="Search…"
            className="bg-transparent text-sm text-slate-600 dark:text-slate-400 outline-none w-28 placeholder-slate-400 dark:placeholder-slate-600"
            readOnly
          />
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.06] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/[0.08] transition-all"
          title={dark ? 'Light mode' : 'Dark mode'}
        >
          {dark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNote(n => !n)}
            className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.06] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/[0.08] transition-all relative"
          >
            <Bell size={15} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full ring-1 ring-white dark:ring-[#0b0f17]" />
          </button>

          {showNote && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/[0.08] rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/50 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-white/[0.06]">
                <p className="text-sm font-semibold text-slate-800 dark:text-white">Notifications</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">3 recent updates</p>
              </div>
              <div className="py-1">
                {NOTIFICATIONS.map((n, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors cursor-default">
                    <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.dot}`} />
                    <div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{n.text}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-600 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-slate-100 dark:border-white/[0.06]">
                <button className="text-xs text-green-600 dark:text-green-400 font-medium hover:underline">View all</button>
              </div>
            </div>
          )}
        </div>

        {/* User pill */}
        <div className="flex items-center gap-2.5 pl-3 ml-1 border-l border-slate-200 dark:border-white/[0.06]">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-green-500/20 flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="hidden md:block min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight truncate max-w-[100px]">{user?.name}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 capitalize">{user?.role}</p>
          </div>
          <ChevronDown size={13} className="hidden md:block text-slate-400 dark:text-slate-600 flex-shrink-0" />
        </div>
      </div>
    </header>
  );
}
