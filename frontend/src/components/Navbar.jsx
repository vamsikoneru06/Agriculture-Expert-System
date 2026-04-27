import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Bell, Sun, Moon, ChevronDown, Slash } from 'lucide-react';

const PAGE_META = {
  '/dashboard':  { label: 'Dashboard',          emoji: '🌾' },
  '/expert':     { label: 'Expert System',       emoji: '🧠' },
  '/simulation': { label: 'Simulation',          emoji: '🌦️' },
  '/ml':         { label: 'ML Prediction',       emoji: '🤖' },
  '/history':    { label: 'History',             emoji: '📋' },
  '/admin':      { label: 'Admin',               emoji: '⚙️' },
  '/chatbot':    { label: 'AI Chatbot',          emoji: '💬' },
};

const NOTES = [
  { text: 'Crop prediction saved to history', time: '2m ago',  dot: 'bg-green-500'  },
  { text: 'Simulation cycle completed',       time: '1h ago',  dot: 'bg-blue-500'   },
  { text: 'New expert rule added',            time: '3h ago',  dot: 'bg-amber-500'  },
];

export default function Navbar() {
  const { user }         = useAuth();
  const { dark, toggle } = useTheme();
  const location         = useLocation();
  const [bell, setBell]  = useState(false);

  const page = PAGE_META[location.pathname] || { label: 'AgriExpert', emoji: '🌿' };

  return (
    <header className="
      relative h-14 flex-shrink-0 flex items-center justify-between px-5
      bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl
      border-b border-zinc-200/80 dark:border-zinc-800/80
      z-20
    ">
      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2 text-sm min-w-0">
        <span className="text-zinc-400 dark:text-zinc-600 font-medium text-[13px] hidden sm:block">AgriExpert</span>
        <Slash size={12} className="text-zinc-300 dark:text-zinc-700 hidden sm:block flex-shrink-0" />
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-base leading-none">{page.emoji}</span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-[13px] truncate">{page.label}</span>
        </div>
      </div>

      {/* ── Right actions ── */}
      <div className="flex items-center gap-1.5 flex-shrink-0">

        {/* Theme */}
        <button
          onClick={toggle}
          className="h-8 w-8 flex items-center justify-center rounded-lg text-zinc-500 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-zinc-200 transition-all"
          title={dark ? 'Light mode' : 'Dark mode'}
        >
          {dark
            ? <Sun size={15} className="text-amber-400" />
            : <Moon size={15} />
          }
        </button>

        {/* Bell */}
        <div className="relative">
          <button
            onClick={() => setBell(b => !b)}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-zinc-500 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-zinc-200 transition-all relative"
          >
            <Bell size={15} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-green-500 rounded-full ring-1 ring-white dark:ring-zinc-950" />
          </button>

          {bell && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden scale-in z-50">
              <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                <p className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">Notifications</p>
              </div>
              {NOTES.map((n, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-default border-b border-zinc-100/50 dark:border-zinc-800/50 last:border-0">
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${n.dot}`} />
                  <div className="min-w-0">
                    <p className="text-[12px] text-zinc-700 dark:text-zinc-300 font-medium leading-snug">{n.text}</p>
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-600 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
              <div className="px-4 py-2.5">
                <button className="text-[12px] text-green-600 dark:text-green-400 font-semibold hover:underline">Mark all as read</button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-800 mx-1" />

        {/* User */}
        <button className="flex items-center gap-2 h-8 pl-1 pr-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 shadow-glow-sm">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="hidden sm:block text-left min-w-0">
            <p className="text-[12px] font-semibold text-zinc-900 dark:text-zinc-100 leading-tight truncate max-w-[80px]">{user?.name}</p>
          </div>
          <ChevronDown size={12} className="text-zinc-400 dark:text-zinc-600 flex-shrink-0 hidden sm:block" />
        </button>
      </div>
    </header>
  );
}
