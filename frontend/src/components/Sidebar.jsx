import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard, Leaf, Thermometer, BrainCircuit,
  History, ShieldCheck, MessageSquare, LogOut,
  ChevronLeft, ChevronRight, Sun, Moon, Sprout,
} from 'lucide-react';

const NAV = [
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard',     roles: ['admin','farmer','student'], color: '#22c55e'  },
  { to: '/expert',      icon: Leaf,            label: 'Expert System', roles: ['admin','farmer','student'], color: '#10b981'  },
  { to: '/simulation',  icon: Thermometer,     label: 'Simulation',    roles: ['admin','farmer','student'], color: '#f97316'  },
  { to: '/ml',          icon: BrainCircuit,    label: 'ML Prediction', roles: ['admin','farmer','student'], color: '#8b5cf6'  },
  { to: '/history',     icon: History,         label: 'History',       roles: ['admin','farmer','student'], color: '#3b82f6'  },
  { to: '/admin',       icon: ShieldCheck,     label: 'Admin Panel',   roles: ['admin'],                    color: '#f43f5e'  },
  { to: '/chatbot',     icon: MessageSquare,   label: 'AI Chatbot',    roles: ['admin','farmer','student'], color: '#06b6d4'  },
];

const ROLE_BADGE = {
  admin:   'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400',
  farmer:  'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400',
  student: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const allowed = NAV.filter(i => i.roles.includes(user?.role || 'student'));

  return (
    <aside
      className={`
        relative flex flex-col h-screen flex-shrink-0 overflow-hidden
        bg-white dark:bg-zinc-950
        border-r border-zinc-200 dark:border-zinc-800/80
        transition-[width] duration-300 ease-in-out
        ${collapsed ? 'w-[60px]' : 'w-[220px]'}
      `}
    >
      {/* subtle grid bg */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.4] pointer-events-none" />

      {/* ── Logo ── */}
      <div className={`relative flex items-center h-14 border-b border-zinc-100 dark:border-zinc-800/80 px-3 flex-shrink-0 ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
        <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-glow-sm flex-shrink-0">
          <Sprout size={14} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight tracking-tight">AgriExpert</p>
            <p className="text-[10px] text-green-600 dark:text-green-500 font-medium tracking-wide">Smart Farming AI</p>
          </div>
        )}
      </div>

      {/* ── User ── */}
      {!collapsed ? (
        <div className="relative mx-3 mt-3 mb-1 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-glow-sm flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold text-zinc-900 dark:text-zinc-100 truncate leading-tight">{user?.name}</p>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-semibold capitalize ${ROLE_BADGE[user?.role] || ROLE_BADGE.student}`}>
              {user?.role}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex justify-center mt-3 mb-1 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-glow-sm" title={user?.name}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      )}

      {/* ── Section label ── */}
      {!collapsed && (
        <p className="relative px-4 pt-3 pb-1 text-[9px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.12em] flex-shrink-0">Pages</p>
      )}

      {/* ── Nav ── */}
      <nav className={`relative flex-1 overflow-y-auto overflow-x-hidden py-1 space-y-0.5 ${collapsed ? 'px-1.5' : 'px-2'}`}>
        {allowed.map(({ to, icon: Icon, label, color }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            className={({ isActive }) => `
              group relative flex items-center gap-2.5 rounded-lg text-[13px] font-medium
              transition-all duration-150 overflow-hidden
              ${collapsed ? 'justify-center py-2.5 px-0' : 'px-2.5 py-2'}
              ${isActive
                ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100'
                : 'text-zinc-500 dark:text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 hover:text-zinc-800 dark:hover:text-zinc-300'
              }
            `}
          >
            {({ isActive }) => (
              <>
                {/* Active left bar */}
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full"
                    style={{ background: color }}
                  />
                )}
                <Icon
                  size={16}
                  className="flex-shrink-0 transition-colors"
                  style={{ color: isActive ? color : undefined }}
                />
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                    )}
                  </>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Bottom actions ── */}
      <div className={`relative border-t border-zinc-100 dark:border-zinc-800/80 py-2 space-y-0.5 flex-shrink-0 ${collapsed ? 'px-1.5' : 'px-2'}`}>
        {/* Theme toggle */}
        <button
          onClick={toggle}
          title={dark ? 'Light mode' : 'Dark mode'}
          className={`w-full flex items-center gap-2.5 rounded-lg text-[13px] font-medium text-zinc-500 dark:text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 hover:text-zinc-800 dark:hover:text-zinc-300 transition-all
            ${collapsed ? 'justify-center py-2.5 px-0' : 'px-2.5 py-2'}`}
        >
          {dark
            ? <Sun size={15} className="flex-shrink-0 text-amber-400" />
            : <Moon size={15} className="flex-shrink-0 text-zinc-500" />
          }
          {!collapsed && <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
          className={`w-full flex items-center gap-2.5 rounded-lg text-[13px] font-medium text-zinc-500 dark:text-zinc-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-all
            ${collapsed ? 'justify-center py-2.5 px-0' : 'px-2.5 py-2'}`}
        >
          <LogOut size={15} className="flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className={`w-full flex items-center gap-2.5 rounded-lg text-[13px] font-medium text-zinc-400 dark:text-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 hover:text-zinc-600 dark:hover:text-zinc-400 transition-all
            ${collapsed ? 'justify-center py-2.5 px-0' : 'px-2.5 py-2'}`}
        >
          {collapsed ? <ChevronRight size={14} /> : <><ChevronLeft size={14} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
