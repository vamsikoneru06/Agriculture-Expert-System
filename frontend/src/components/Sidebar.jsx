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
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard',     roles: ['admin','farmer','student'], color: '#4ade80', dim: 'rgba(74,222,128,0.12)'  },
  { to: '/expert',     icon: Leaf,            label: 'Expert System', roles: ['admin','farmer','student'], color: '#34d399', dim: 'rgba(52,211,153,0.12)'   },
  { to: '/simulation', icon: Thermometer,     label: 'Simulation',    roles: ['admin','farmer','student'], color: '#fb923c', dim: 'rgba(251,146,60,0.12)'   },
  { to: '/ml',         icon: BrainCircuit,    label: 'ML Prediction', roles: ['admin','farmer','student'], color: '#a78bfa', dim: 'rgba(167,139,250,0.12)'  },
  { to: '/history',    icon: History,         label: 'History',       roles: ['admin','farmer','student'], color: '#60a5fa', dim: 'rgba(96,165,250,0.12)'   },
  { to: '/admin',      icon: ShieldCheck,     label: 'Admin Panel',   roles: ['admin'],                    color: '#fb7185', dim: 'rgba(251,113,133,0.12)'  },
  { to: '/chatbot',    icon: MessageSquare,   label: 'AI Chatbot',    roles: ['admin','farmer','student'], color: '#22d3ee', dim: 'rgba(34,211,238,0.12)'   },
];

const ROLE_COLOR = {
  admin:   { text: 'text-rose-400',  bg: 'bg-rose-500/10',   border: 'border-rose-500/20'  },
  farmer:  { text: 'text-green-400', bg: 'bg-green-500/10',  border: 'border-green-500/20' },
  student: { text: 'text-sky-400',   bg: 'bg-sky-500/10',    border: 'border-sky-500/20'   },
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const allowed = NAV.filter(i => i.roles.includes(user?.role || 'student'));
  const role = ROLE_COLOR[user?.role] || ROLE_COLOR.student;

  return (
    <aside className={`
      relative flex flex-col h-screen flex-shrink-0 overflow-hidden
      transition-[width] duration-300 ease-in-out
      ${collapsed ? 'w-[58px]' : 'w-[218px]'}
    `}
    style={{
      background: dark
        ? 'linear-gradient(180deg, #080e08 0%, #060b06 100%)'
        : 'linear-gradient(180deg, #0d1f0d 0%, #0a180a 100%)',
      borderRight: '1px solid rgba(74,222,128,0.08)',
    }}>

      {/* Crop-row diagonal overlay */}
      <div className="absolute inset-0 bg-crop-rows opacity-100 pointer-events-none" />

      {/* Subtle scan line animation */}
      <div className="field-scan-line top-0" />

      {/* ── Logo ── */}
      <div className={`relative flex items-center h-14 flex-shrink-0 ${collapsed ? 'justify-center px-0' : 'px-4 gap-3'}`}
        style={{borderBottom: '1px solid rgba(74,222,128,0.08)'}}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 relative"
          style={{background:'rgba(74,222,128,0.1)', border:'1px solid rgba(74,222,128,0.2)'}}>
          <Sprout size={15} className="text-green-400" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-400 rounded-full" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-display text-[14px] font-bold leading-tight tracking-tight"
              style={{color:'#e8f5e8'}}>AgriExpert</p>
            <p className="font-data text-[9px] tracking-[0.2em] uppercase"
              style={{color:'rgba(74,222,128,0.5)'}}>Field System</p>
          </div>
        )}
      </div>

      {/* ── User card ── */}
      {!collapsed ? (
        <div className="relative mx-3 mt-3 mb-1 p-2.5 rounded-xl flex items-center gap-2.5 flex-shrink-0"
          style={{background:'rgba(74,222,128,0.05)', border:'1px solid rgba(74,222,128,0.08)'}}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0"
            style={{background:'rgba(74,222,128,0.15)', border:'1px solid rgba(74,222,128,0.25)', color:'#4ade80'}}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold truncate leading-tight" style={{color:'#d0e8d0'}}>{user?.name}</p>
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-data font-medium capitalize border ${role.text} ${role.bg} ${role.border}`}>
              {user?.role}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex justify-center mt-3 mb-1 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold"
            style={{background:'rgba(74,222,128,0.15)', border:'1px solid rgba(74,222,128,0.25)', color:'#4ade80'}}
            title={user?.name}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      )}

      {/* ── Nav label ── */}
      {!collapsed && (
        <p className="relative px-4 pt-3 pb-1.5 font-data text-[9px] uppercase tracking-[0.18em] flex-shrink-0"
          style={{color:'rgba(74,222,128,0.3)'}}>Navigation</p>
      )}

      {/* ── Nav items ── */}
      <nav className={`relative flex-1 overflow-y-auto overflow-x-hidden py-1 space-y-0.5 ${collapsed ? 'px-1.5' : 'px-2'}`}>
        {allowed.map(({ to, icon: Icon, label, color, dim }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            className={({ isActive }) => `
              group relative flex items-center gap-2.5 rounded-lg text-[12.5px] font-medium
              transition-all duration-150 overflow-hidden
              ${collapsed ? 'justify-center py-2.5 px-0' : 'px-2.5 py-2'}
            `}
            style={({ isActive }) => ({
              background: isActive ? dim : 'transparent',
              color: isActive ? color : 'rgba(180,210,180,0.5)',
            })}
            onMouseEnter={e => {
              if (!e.currentTarget.classList.contains('active'))
                e.currentTarget.style.color = 'rgba(200,230,200,0.9)';
            }}
            onMouseLeave={e => {
              if (!e.currentTarget.dataset.active)
                e.currentTarget.style.color = 'rgba(180,210,180,0.5)';
            }}
          >
            {({ isActive }) => (
              <>
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 rounded-r-full"
                    style={{background: color, boxShadow:`0 0 8px ${color}`}} />
                )}

                <Icon
                  size={15}
                  className="flex-shrink-0 transition-all duration-150"
                  style={{
                    color: isActive ? color : 'rgba(180,210,180,0.45)',
                    filter: isActive ? `drop-shadow(0 0 4px ${color}80)` : 'none',
                  }}
                />

                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{background: color, boxShadow:`0 0 6px ${color}`}} />
                    )}
                  </>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── System status (only expanded) ── */}
      {!collapsed && (
        <div className="relative mx-3 mb-2 px-3 py-2 rounded-lg flex items-center gap-2"
          style={{background:'rgba(74,222,128,0.04)', border:'1px solid rgba(74,222,128,0.07)'}}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0"
            style={{boxShadow:'0 0 6px #4ade80'}} />
          <span className="font-data text-[9px] uppercase tracking-[0.15em]"
            style={{color:'rgba(74,222,128,0.45)'}}>System Online</span>
        </div>
      )}

      {/* ── Bottom actions ── */}
      <div className={`relative py-2 space-y-0.5 flex-shrink-0 ${collapsed ? 'px-1.5' : 'px-2'}`}
        style={{borderTop:'1px solid rgba(74,222,128,0.07)'}}>

        {/* Theme */}
        <button onClick={toggle} title={dark ? 'Light mode' : 'Dark mode'}
          className={`w-full flex items-center gap-2.5 rounded-lg text-[12.5px] font-medium transition-all
            ${collapsed ? 'justify-center py-2.5 px-0' : 'px-2.5 py-2'}`}
          style={{color:'rgba(180,210,180,0.45)'}}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(200,230,200,0.85)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(180,210,180,0.45)'}>
          {dark
            ? <Sun size={14} className="flex-shrink-0" style={{color:'#fbbf24'}} />
            : <Moon size={14} className="flex-shrink-0" style={{color:'rgba(180,210,180,0.6)'}} />
          }
          {!collapsed && <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {/* Logout */}
        <button onClick={handleLogout} title={collapsed ? 'Logout' : undefined}
          className={`w-full flex items-center gap-2.5 rounded-lg text-[12.5px] font-medium transition-all
            ${collapsed ? 'justify-center py-2.5 px-0' : 'px-2.5 py-2'}`}
          style={{color:'rgba(180,210,180,0.45)'}}
          onMouseEnter={e => { e.currentTarget.style.color = '#fb7185'; e.currentTarget.style.background = 'rgba(251,113,133,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(180,210,180,0.45)'; e.currentTarget.style.background = 'transparent'; }}>
          <LogOut size={14} className="flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>

        {/* Collapse */}
        <button onClick={() => setCollapsed(c => !c)}
          className={`w-full flex items-center gap-2.5 rounded-lg text-[12.5px] font-medium transition-all
            ${collapsed ? 'justify-center py-2.5 px-0' : 'px-2.5 py-2'}`}
          style={{color:'rgba(74,222,128,0.25)'}}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(74,222,128,0.6)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(74,222,128,0.25)'}>
          {collapsed
            ? <ChevronRight size={13} />
            : <><ChevronLeft size={13} /><span>Collapse</span></>
          }
        </button>
      </div>
    </aside>
  );
}
