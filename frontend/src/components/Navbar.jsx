import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Bell, Sun, Moon, ChevronDown, Slash } from 'lucide-react';

const PAGE_META = {
  '/dashboard':  { label: 'Dashboard',     emoji: '🌾' },
  '/expert':     { label: 'Expert System', emoji: '🧠' },
  '/simulation': { label: 'Simulation',    emoji: '🌦️' },
  '/ml':         { label: 'ML Prediction', emoji: '🤖' },
  '/history':    { label: 'History',       emoji: '📋' },
  '/admin':      { label: 'Admin',         emoji: '⚙️' },
  '/chatbot':    { label: 'AI Chatbot',    emoji: '💬' },
  '/game':       { label: 'Crop Game',     emoji: '🎮' },
};

const NOTES = [
  { text: 'Crop prediction saved to history', time: '2m ago', dot: 'bg-green-500'  },
  { text: 'Simulation cycle completed',       time: '1h ago', dot: 'bg-blue-500'   },
  { text: 'New expert rule added',            time: '3h ago', dot: 'bg-amber-500'  },
];

export default function Navbar() {
  const { user }         = useAuth();
  const { dark, toggle } = useTheme();
  const location         = useLocation();
  const [bell, setBell]  = useState(false);

  const page = PAGE_META[location.pathname] || { label: 'AgriExpert', emoji: '🌿' };

  /* ── Theme tokens ── */
  const T = {
    bg:          dark ? 'rgba(8,14,8,0.88)'        : 'rgba(240,249,240,0.95)',
    border:      dark ? 'rgba(74,222,128,0.08)'     : 'rgba(34,139,34,0.12)',
    sysText:     dark ? 'rgba(74,222,128,0.35)'     : 'rgba(22,101,52,0.5)',
    slash:       dark ? 'rgba(74,222,128,0.2)'      : 'rgba(22,101,52,0.25)',
    pageLabel:   dark ? '#d0e8d0'                   : '#0f2f0f',
    iconColor:   dark ? 'rgba(74,222,128,0.45)'     : 'rgba(22,101,52,0.5)',
    iconHoverBg: dark ? 'rgba(74,222,128,0.08)'     : 'rgba(22,163,74,0.1)',
    iconHover:   dark ? '#4ade80'                   : '#15803d',
    divider:     dark ? 'rgba(74,222,128,0.1)'      : 'rgba(34,139,34,0.12)',
    userAvBg:    dark ? 'rgba(74,222,128,0.15)'     : 'rgba(22,163,74,0.12)',
    userAvBdr:   dark ? 'rgba(74,222,128,0.25)'     : 'rgba(22,163,74,0.3)',
    userAvColor: dark ? '#4ade80'                   : '#15803d',
    userName:    dark ? '#d0e8d0'                   : '#0f2f0f',
    userHoverBg: dark ? 'rgba(74,222,128,0.06)'     : 'rgba(22,163,74,0.08)',
    dropBg:      dark ? '#0a1a0a'                   : '#f0f9f0',
    dropBorder:  dark ? 'rgba(74,222,128,0.12)'     : 'rgba(34,139,34,0.15)',
    dropDivider: dark ? 'rgba(74,222,128,0.05)'     : 'rgba(34,139,34,0.08)',
    dropTitle:   dark ? '#d0e8d0'                   : '#0f2f0f',
    dropText:    dark ? 'rgba(208,232,208,0.85)'    : '#1a3e1a',
    dropTime:    dark ? 'rgba(74,222,128,0.3)'      : 'rgba(22,101,52,0.5)',
    dropHover:   dark ? 'rgba(74,222,128,0.04)'     : 'rgba(22,163,74,0.06)',
    markText:    dark ? 'rgba(74,222,128,0.6)'      : 'rgba(22,101,52,0.7)',
    markHover:   dark ? '#4ade80'                   : '#15803d',
    sunColor:    dark ? '#fbbf24'                   : '#92400e',
  };

  return (
    <header
      className="relative h-14 flex-shrink-0 flex items-center justify-between px-5 z-20"
      style={{ background: T.bg, backdropFilter: 'blur(12px)', borderBottom: `1px solid ${T.border}` }}
    >
      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2 text-sm min-w-0">
        <span className="font-data text-[11px] tracking-widest uppercase hidden sm:block" style={{ color: T.sysText }}>AgriExpert</span>
        <Slash size={11} className="hidden sm:block flex-shrink-0" style={{ color: T.slash }} />
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-base leading-none">{page.emoji}</span>
          <span className="font-display font-semibold text-[13px] truncate" style={{ color: T.pageLabel }}>{page.label}</span>
        </div>
      </div>

      {/* ── Right actions ── */}
      <div className="flex items-center gap-1.5 flex-shrink-0">

        {/* Theme toggle */}
        <button onClick={toggle} title={dark ? 'Light mode' : 'Dark mode'}
          className="h-8 w-8 flex items-center justify-center rounded-lg transition-all"
          style={{ color: T.iconColor }}
          onMouseEnter={e => { e.currentTarget.style.background = T.iconHoverBg; e.currentTarget.style.color = T.iconHover; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.iconColor; }}>
          {dark ? <Sun size={15} style={{ color: T.sunColor }} /> : <Moon size={15} />}
        </button>

        {/* Bell */}
        <div className="relative">
          <button onClick={() => setBell(b => !b)}
            className="h-8 w-8 flex items-center justify-center rounded-lg transition-all relative"
            style={{ color: T.iconColor }}
            onMouseEnter={e => { e.currentTarget.style.background = T.iconHoverBg; e.currentTarget.style.color = T.iconHover; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.iconColor; }}>
            <Bell size={15} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
              style={{ background: dark ? '#4ade80' : '#16a34a', boxShadow: dark ? '0 0 4px #4ade80' : 'none' }} />
          </button>

          {bell && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl shadow-2xl overflow-hidden scale-in z-50"
              style={{ background: T.dropBg, border: `1px solid ${T.dropBorder}` }}>
              <div className="px-4 py-3" style={{ borderBottom: `1px solid ${T.dropDivider}` }}>
                <p className="font-display text-[13px] font-semibold" style={{ color: T.dropTitle }}>Notifications</p>
              </div>
              {NOTES.map((n, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3 cursor-default transition-colors"
                  style={{ borderBottom: `1px solid ${T.dropDivider}` }}
                  onMouseEnter={e => e.currentTarget.style.background = T.dropHover}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${n.dot}`} />
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium leading-snug" style={{ color: T.dropText }}>{n.text}</p>
                    <p className="font-data text-[10px] mt-0.5" style={{ color: T.dropTime }}>{n.time}</p>
                  </div>
                </div>
              ))}
              <div className="px-4 py-2.5">
                <button className="text-[11px] font-semibold transition-colors"
                  style={{ color: T.markText }}
                  onMouseEnter={e => e.currentTarget.style.color = T.markHover}
                  onMouseLeave={e => e.currentTarget.style.color = T.markText}>
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-5 mx-1" style={{ background: T.divider }} />

        {/* User */}
        <button className="flex items-center gap-2 h-8 pl-1 pr-2 rounded-lg transition-all"
          onMouseEnter={e => e.currentTarget.style.background = T.userHoverBg}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0"
            style={{ background: T.userAvBg, border: `1px solid ${T.userAvBdr}`, color: T.userAvColor }}>
            {user?.role?.charAt(0).toUpperCase() || 'U'}
          </div>
          <p className="hidden sm:block text-[12px] font-semibold leading-tight truncate max-w-[80px] capitalize"
            style={{ color: T.userName }}>{user?.role}</p>
          <ChevronDown size={11} className="hidden sm:block flex-shrink-0" style={{ color: T.iconColor }} />
        </button>
      </div>
    </header>
  );
}
