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
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard',     roles: ['admin','farmer','student'], color: '#16a34a', dimDark: 'rgba(74,222,128,0.12)',  dimLight: 'rgba(22,163,74,0.1)'  },
  { to: '/expert',     icon: Leaf,            label: 'Expert System', roles: ['admin','farmer','student'], color: '#15803d', dimDark: 'rgba(52,211,153,0.12)',  dimLight: 'rgba(21,128,61,0.1)'  },
  { to: '/simulation', icon: Thermometer,     label: 'Simulation',    roles: ['admin','farmer','student'], color: '#c2410c', dimDark: 'rgba(251,146,60,0.12)',  dimLight: 'rgba(194,65,12,0.1)'  },
  { to: '/ml',         icon: BrainCircuit,    label: 'ML Prediction', roles: ['admin','farmer','student'], color: '#7c3aed', dimDark: 'rgba(167,139,250,0.12)', dimLight: 'rgba(124,58,237,0.1)' },
  { to: '/history',    icon: History,         label: 'History',       roles: ['admin','farmer','student'], color: '#1d4ed8', dimDark: 'rgba(96,165,250,0.12)',  dimLight: 'rgba(29,78,216,0.1)'  },
  { to: '/admin',      icon: ShieldCheck,     label: 'Admin Panel',   roles: ['admin'],                    color: '#be123c', dimDark: 'rgba(251,113,133,0.12)', dimLight: 'rgba(190,18,60,0.1)'  },
  { to: '/chatbot',    icon: MessageSquare,   label: 'AI Chatbot',    roles: ['admin','farmer','student'], color: '#0e7490', dimDark: 'rgba(34,211,238,0.12)',  dimLight: 'rgba(14,116,144,0.1)' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const allowed = NAV.filter(i => i.roles.includes(user?.role || 'student'));

  /* ── Theme-adaptive tokens ── */
  const T = {
    bg:           dark ? 'linear-gradient(180deg,#080e08 0%,#060b06 100%)' : 'linear-gradient(180deg,#f0f9f0 0%,#e8f5e8 100%)',
    border:       dark ? 'rgba(74,222,128,0.08)' : 'rgba(34,139,34,0.14)',
    logoText:     dark ? '#e8f5e8' : '#0f2f0f',
    logoSub:      dark ? 'rgba(74,222,128,0.5)' : 'rgba(22,101,52,0.6)',
    userCard:     dark ? 'rgba(74,222,128,0.05)' : 'rgba(22,163,74,0.07)',
    userCardBdr:  dark ? 'rgba(74,222,128,0.08)' : 'rgba(22,163,74,0.14)',
    userAvBg:     dark ? 'rgba(74,222,128,0.15)' : 'rgba(22,163,74,0.12)',
    userAvBdr:    dark ? 'rgba(74,222,128,0.25)' : 'rgba(22,163,74,0.3)',
    userAvColor:  dark ? '#4ade80' : '#15803d',
    userName:     dark ? '#d0e8d0' : '#0f2f0f',
    sectionLabel: dark ? 'rgba(74,222,128,0.3)' : 'rgba(22,101,52,0.45)',
    navInactive:  dark ? 'rgba(180,210,180,0.5)' : 'rgba(15,47,15,0.5)',
    navHover:     dark ? 'rgba(255,255,255,0.04)' : 'rgba(22,163,74,0.07)',
    navHoverText: dark ? 'rgba(200,230,200,0.9)' : '#0f2f0f',
    statusBg:     dark ? 'rgba(74,222,128,0.04)' : 'rgba(22,163,74,0.07)',
    statusBdr:    dark ? 'rgba(74,222,128,0.07)' : 'rgba(22,163,74,0.12)',
    statusText:   dark ? 'rgba(74,222,128,0.45)' : 'rgba(22,101,52,0.55)',
    actionText:   dark ? 'rgba(180,210,180,0.45)' : 'rgba(15,47,15,0.45)',
    actionHover:  dark ? 'rgba(200,230,200,0.85)' : '#0f2f0f',
    collapseText: dark ? 'rgba(74,222,128,0.25)' : 'rgba(22,101,52,0.35)',
    collapseHover:dark ? 'rgba(74,222,128,0.6)'  : 'rgba(22,101,52,0.7)',
    sunColor:     dark ? '#fbbf24' : '#92400e',
  };

  return (
    <aside
      className={`relative flex flex-col h-screen flex-shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out ${collapsed ? 'w-[58px]' : 'w-[218px]'}`}
      style={{ background: T.bg, borderRight: `1px solid ${T.border}` }}
    >
      {/* Crop-row diagonal overlay */}
      <div className="absolute inset-0 bg-crop-rows pointer-events-none" style={{opacity: dark ? 1 : 0.5}} />

      {/* Scan line */}
      <div className="field-scan-line top-0" style={{opacity: dark ? 1 : 0.3}} />

      {/* ── Logo ── */}
      <div
        className={`relative flex items-center h-14 flex-shrink-0 ${collapsed ? 'justify-center px-0' : 'px-4 gap-3'}`}
        style={{ borderBottom: `1px solid ${T.border}` }}
      >
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 relative"
          style={{ background: T.userAvBg, border: `1px solid ${T.userAvBdr}` }}>
          <Sprout size={15} style={{ color: T.userAvColor }} />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full"
            style={{ background: dark ? '#4ade80' : '#16a34a' }} />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-display text-[14px] font-bold leading-tight tracking-tight" style={{ color: T.logoText }}>AgriExpert</p>
            <p className="font-data text-[9px] tracking-[0.2em] uppercase" style={{ color: T.logoSub }}>Field System</p>
          </div>
        )}
      </div>

      {/* ── User card ── */}
      {!collapsed ? (
        <div className="relative mx-3 mt-3 mb-1 p-2.5 rounded-xl flex items-center gap-2.5 flex-shrink-0"
          style={{ background: T.userCard, border: `1px solid ${T.userCardBdr}` }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0"
            style={{ background: T.userAvBg, border: `1px solid ${T.userAvBdr}`, color: T.userAvColor }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold truncate leading-tight" style={{ color: T.userName }}>{user?.name}</p>
            <span className="text-[9px] px-1.5 py-0.5 rounded font-data font-medium capitalize"
              style={{ background: T.userAvBg, color: T.userAvColor, border: `1px solid ${T.userAvBdr}` }}>
              {user?.role}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex justify-center mt-3 mb-1 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold"
            style={{ background: T.userAvBg, border: `1px solid ${T.userAvBdr}`, color: T.userAvColor }}
            title={user?.name}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      )}

      {/* ── Nav label ── */}
      {!collapsed && (
        <p className="relative px-4 pt-3 pb-1.5 font-data text-[9px] uppercase tracking-[0.18em] flex-shrink-0"
          style={{ color: T.sectionLabel }}>Navigation</p>
      )}

      {/* ── Nav items ── */}
      <nav className={`relative flex-1 overflow-y-auto overflow-x-hidden py-1 space-y-0.5 ${collapsed ? 'px-1.5' : 'px-2'}`}>
        {allowed.map(({ to, icon: Icon, label, color, dimDark, dimLight }) => {
          const dim = dark ? dimDark : dimLight;
          return (
            <NavLink
              key={to}
              to={to}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `group relative flex items-center gap-2.5 rounded-lg text-[12.5px] font-medium transition-all duration-150 overflow-hidden
                 ${collapsed ? 'justify-center py-2.5 px-0' : 'px-2.5 py-2'}`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 rounded-r-full"
                      style={{ background: color, boxShadow: dark ? `0 0 8px ${color}` : 'none' }} />
                  )}

                  {/* Active background */}
                  {isActive && (
                    <span className="absolute inset-0 rounded-lg" style={{ background: dim }} />
                  )}

                  <Icon
                    size={15}
                    className="flex-shrink-0 relative z-10 transition-all duration-150"
                    style={{
                      color: isActive ? color : T.navInactive,
                      filter: isActive && dark ? `drop-shadow(0 0 4px ${color}80)` : 'none',
                    }}
                  />

                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate relative z-10"
                        style={{ color: isActive ? (dark ? color : color) : T.navInactive }}>
                        {label}
                      </span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 relative z-10"
                          style={{ background: color, boxShadow: dark ? `0 0 6px ${color}` : 'none' }} />
                      )}
                    </>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ── System status ── */}
      {!collapsed && (
        <div className="relative mx-3 mb-2 px-3 py-2 rounded-lg flex items-center gap-2"
          style={{ background: T.statusBg, border: `1px solid ${T.statusBdr}` }}>
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse"
            style={{ background: dark ? '#4ade80' : '#16a34a', boxShadow: dark ? '0 0 6px #4ade80' : 'none' }} />
          <span className="font-data text-[9px] uppercase tracking-[0.15em]" style={{ color: T.statusText }}>System Online</span>
        </div>
      )}

      {/* ── Bottom actions ── */}
      <div className={`relative py-2 space-y-0.5 flex-shrink-0 ${collapsed ? 'px-1.5' : 'px-2'}`}
        style={{ borderTop: `1px solid ${T.border}` }}>

        {/* Theme */}
        <button onClick={toggle} title={dark ? 'Light mode' : 'Dark mode'}
          className={`w-full flex items-center gap-2.5 rounded-lg text-[12.5px] font-medium transition-all ${collapsed ? 'justify-center py-2.5 px-0' : 'px-2.5 py-2'}`}
          style={{ color: T.actionText }}
          onMouseEnter={e => { e.currentTarget.style.color = T.actionHover; e.currentTarget.style.background = T.navHover; }}
          onMouseLeave={e => { e.currentTarget.style.color = T.actionText; e.currentTarget.style.background = 'transparent'; }}>
          {dark
            ? <Sun size={14} className="flex-shrink-0" style={{ color: T.sunColor }} />
            : <Moon size={14} className="flex-shrink-0" />}
          {!collapsed && <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {/* Logout */}
        <button onClick={handleLogout} title={collapsed ? 'Logout' : undefined}
          className={`w-full flex items-center gap-2.5 rounded-lg text-[12.5px] font-medium transition-all ${collapsed ? 'justify-center py-2.5 px-0' : 'px-2.5 py-2'}`}
          style={{ color: T.actionText }}
          onMouseEnter={e => { e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.background = 'rgba(220,38,38,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = T.actionText; e.currentTarget.style.background = 'transparent'; }}>
          <LogOut size={14} className="flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>

        {/* Collapse */}
        <button onClick={() => setCollapsed(c => !c)}
          className={`w-full flex items-center gap-2.5 rounded-lg text-[12.5px] font-medium transition-all ${collapsed ? 'justify-center py-2.5 px-0' : 'px-2.5 py-2'}`}
          style={{ color: T.collapseText }}
          onMouseEnter={e => e.currentTarget.style.color = T.collapseHover}
          onMouseLeave={e => e.currentTarget.style.color = T.collapseText}>
          {collapsed
            ? <ChevronRight size={13} />
            : <><ChevronLeft size={13} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
