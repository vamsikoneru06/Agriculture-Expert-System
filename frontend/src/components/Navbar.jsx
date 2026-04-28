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
};

const NOTES = [
  { text: 'Crop prediction saved to history', time: '2m ago', dot: 'bg-green-400'  },
  { text: 'Simulation cycle completed',       time: '1h ago', dot: 'bg-blue-400'   },
  { text: 'New expert rule added',            time: '3h ago', dot: 'bg-amber-400'  },
];

export default function Navbar() {
  const { user }         = useAuth();
  const { dark, toggle } = useTheme();
  const location         = useLocation();
  const [bell, setBell]  = useState(false);

  const page = PAGE_META[location.pathname] || { label: 'AgriExpert', emoji: '🌿' };

  return (
    <header className="relative h-14 flex-shrink-0 flex items-center justify-between px-5 z-20"
      style={{
        background: dark ? 'rgba(8,14,8,0.85)' : 'rgba(10,24,10,0.88)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(74,222,128,0.08)',
      }}>

      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2 text-sm min-w-0">
        <span className="font-data text-[11px] tracking-widest uppercase hidden sm:block"
          style={{color:'rgba(74,222,128,0.35)'}}>AgriExpert</span>
        <Slash size={11} className="hidden sm:block flex-shrink-0" style={{color:'rgba(74,222,128,0.2)'}} />
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-base leading-none">{page.emoji}</span>
          <span className="font-display font-semibold text-[13px] truncate" style={{color:'#d0e8d0'}}>{page.label}</span>
        </div>
      </div>

      {/* ── Right actions ── */}
      <div className="flex items-center gap-1.5 flex-shrink-0">

        {/* Theme */}
        <button onClick={toggle} title={dark ? 'Light mode' : 'Dark mode'}
          className="h-8 w-8 flex items-center justify-center rounded-lg transition-all"
          style={{color:'rgba(74,222,128,0.4)'}}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(74,222,128,0.08)'; e.currentTarget.style.color = '#4ade80'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(74,222,128,0.4)'; }}>
          {dark
            ? <Sun size={15} style={{color:'#fbbf24'}} />
            : <Moon size={15} />}
        </button>

        {/* Bell */}
        <div className="relative">
          <button onClick={() => setBell(b => !b)}
            className="h-8 w-8 flex items-center justify-center rounded-lg transition-all relative"
            style={{color:'rgba(74,222,128,0.4)'}}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(74,222,128,0.08)'; e.currentTarget.style.color = '#4ade80'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(74,222,128,0.4)'; }}>
            <Bell size={15} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-green-400 rounded-full"
              style={{boxShadow:'0 0 4px #4ade80'}} />
          </button>

          {bell && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl shadow-2xl overflow-hidden scale-in z-50"
              style={{background: dark ? '#0a1a0a' : '#0d1f0d', border:'1px solid rgba(74,222,128,0.12)'}}>
              <div className="px-4 py-3" style={{borderBottom:'1px solid rgba(74,222,128,0.08)'}}>
                <p className="font-display text-[13px] font-semibold" style={{color:'#d0e8d0'}}>Notifications</p>
              </div>
              {NOTES.map((n, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3 cursor-default transition-colors"
                  style={{borderBottom:'1px solid rgba(74,222,128,0.05)'}}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(74,222,128,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${n.dot}`} />
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium leading-snug" style={{color:'rgba(208,232,208,0.85)'}}>{n.text}</p>
                    <p className="font-data text-[10px] mt-0.5" style={{color:'rgba(74,222,128,0.3)'}}>{n.time}</p>
                  </div>
                </div>
              ))}
              <div className="px-4 py-2.5">
                <button className="text-[11px] font-semibold"
                  style={{color:'rgba(74,222,128,0.6)'}}
                  onMouseEnter={e => e.currentTarget.style.color = '#4ade80'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(74,222,128,0.6)'}>
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-5 mx-1" style={{background:'rgba(74,222,128,0.1)'}} />

        {/* User */}
        <button className="flex items-center gap-2 h-8 pl-1 pr-2 rounded-lg transition-all"
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(74,222,128,0.06)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0"
            style={{background:'rgba(74,222,128,0.15)', border:'1px solid rgba(74,222,128,0.25)', color:'#4ade80'}}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <p className="hidden sm:block text-[12px] font-semibold leading-tight truncate max-w-[80px]"
            style={{color:'#d0e8d0'}}>{user?.name}</p>
          <ChevronDown size={11} className="hidden sm:block flex-shrink-0" style={{color:'rgba(74,222,128,0.3)'}} />
        </button>
      </div>
    </header>
  );
}
