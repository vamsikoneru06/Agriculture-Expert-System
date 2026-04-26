import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard, Leaf, Thermometer, BrainCircuit,
  History, ShieldCheck, MessageSquare, LogOut,
  PanelLeftClose, PanelLeftOpen, Sun, Moon, Sprout,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard',     roles: ['admin','farmer','student'], accent: 'green'  },
  { to: '/expert',      icon: Leaf,            label: 'Expert System', roles: ['admin','farmer','student'], accent: 'emerald'},
  { to: '/simulation',  icon: Thermometer,     label: 'Simulation',    roles: ['admin','farmer','student'], accent: 'orange' },
  { to: '/ml',          icon: BrainCircuit,    label: 'ML Prediction', roles: ['admin','farmer','student'], accent: 'violet' },
  { to: '/history',     icon: History,         label: 'History',       roles: ['admin','farmer','student'], accent: 'blue'   },
  { to: '/admin',       icon: ShieldCheck,     label: 'Admin Panel',   roles: ['admin'],                    accent: 'rose'   },
  { to: '/chatbot',     icon: MessageSquare,   label: 'AI Chatbot',    roles: ['admin','farmer','student'], accent: 'cyan'   },
];

const accentMap = {
  green:   { active: 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400',   icon: 'text-green-600 dark:text-green-400',   dot: 'bg-green-500',   border: 'border-green-200 dark:border-green-500/20'   },
  emerald: { active: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400', icon: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500', border: 'border-emerald-200 dark:border-emerald-500/20' },
  orange:  { active: 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400',   icon: 'text-orange-600 dark:text-orange-400',   dot: 'bg-orange-500',  border: 'border-orange-200 dark:border-orange-500/20'  },
  violet:  { active: 'bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400',   icon: 'text-violet-600 dark:text-violet-400',   dot: 'bg-violet-500',  border: 'border-violet-200 dark:border-violet-500/20'  },
  blue:    { active: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400',           icon: 'text-blue-600 dark:text-blue-400',       dot: 'bg-blue-500',    border: 'border-blue-200 dark:border-blue-500/20'      },
  rose:    { active: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400',           icon: 'text-rose-600 dark:text-rose-400',       dot: 'bg-rose-500',    border: 'border-rose-200 dark:border-rose-500/20'      },
  cyan:    { active: 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400',           icon: 'text-cyan-600 dark:text-cyan-400',       dot: 'bg-cyan-500',    border: 'border-cyan-200 dark:border-cyan-500/20'      },
};

const roleColors = {
  admin:   'bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300',
  farmer:  'bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-300',
  student: 'bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300',
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const allowed = navItems.filter(i => i.roles.includes(user?.role || 'student'));

  return (
    <aside className={`
      relative flex flex-col h-screen flex-shrink-0
      bg-white dark:bg-[#0b0f17]
      border-r border-slate-200/80 dark:border-white/[0.05]
      transition-all duration-300 ease-in-out z-30
      shadow-[1px_0_0_0_rgba(0,0,0,0.04)] dark:shadow-none
      ${collapsed ? 'w-[70px]' : 'w-[240px]'}
    `}>

      {/* ── Logo bar ── */}
      <div className={`flex items-center h-16 border-b border-slate-100 dark:border-white/[0.05] transition-all duration-300 flex-shrink-0 ${collapsed ? 'justify-center px-0' : 'justify-between px-4'}`}>
        {!collapsed && (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md shadow-green-500/30 flex-shrink-0">
              <Sprout size={15} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-slate-900 dark:text-white font-bold text-sm leading-tight tracking-tight">AgriExpert</p>
              <p className="text-green-600 dark:text-green-500/80 text-[10px] font-medium">Smart Farming AI</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md shadow-green-500/30">
            <Sprout size={17} className="text-white" />
          </div>
        )}
        {!collapsed && (
          <button onClick={() => setCollapsed(true)} className="text-slate-400 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-all flex-shrink-0">
            <PanelLeftClose size={16} />
          </button>
        )}
      </div>

      {/* ── Expand icon when collapsed ── */}
      {collapsed && (
        <div className="flex justify-center pt-3 flex-shrink-0">
          <button onClick={() => setCollapsed(false)} className="text-slate-400 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-300 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-all">
            <PanelLeftOpen size={16} />
          </button>
        </div>
      )}

      {/* ── User card ── */}
      {!collapsed && user && (
        <div className="mx-3 mt-3 mb-1 p-3 bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.04] rounded-2xl flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-green-500/20 flex-shrink-0">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="text-slate-900 dark:text-white font-semibold text-sm truncate leading-tight">{user.name}</p>
              <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize mt-0.5 ${roleColors[user.role] || roleColors.student}`}>
                {user.role}
              </span>
            </div>
          </div>
        </div>
      )}

      {collapsed && user && (
        <div className="flex justify-center mt-2 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm" title={user.name}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      )}

      {/* ── Section label ── */}
      {!collapsed && (
        <p className="px-4 pt-4 pb-1 text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest flex-shrink-0">Menu</p>
      )}

      {/* ── Nav links ── */}
      <nav className={`flex-1 overflow-y-auto py-1 space-y-0.5 ${collapsed ? 'px-2' : 'px-3'}`}>
        {allowed.map(({ to, icon: Icon, label, accent }) => {
          const c = accentMap[accent];
          return (
            <NavLink
              key={to}
              to={to}
              title={collapsed ? label : undefined}
              className={({ isActive }) => `
                flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-150 group border
                ${collapsed ? 'justify-center py-3 px-0' : 'px-3 py-2.5'}
                ${isActive
                  ? `${c.active} ${c.border}`
                  : 'text-slate-500 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.04] border-transparent'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon size={17} className={`flex-shrink-0 transition-colors ${isActive ? c.icon : 'text-slate-400 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-400'}`} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate">{label}</span>
                      {isActive && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />}
                    </>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ── Bottom ── */}
      <div className={`border-t border-slate-100 dark:border-white/[0.05] py-3 space-y-0.5 flex-shrink-0 ${collapsed ? 'px-2' : 'px-3'}`}>
        <button
          onClick={toggle}
          title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className={`w-full flex items-center gap-3 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-all border border-transparent
            ${collapsed ? 'justify-center py-3 px-0' : 'px-3 py-2.5'}`}
        >
          {dark
            ? <Sun size={17} className="flex-shrink-0 text-amber-400" />
            : <Moon size={17} className="flex-shrink-0 text-slate-500" />
          }
          {!collapsed && <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
          className={`w-full flex items-center gap-3 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-all border border-transparent
            ${collapsed ? 'justify-center py-3 px-0' : 'px-3 py-2.5'}`}
        >
          <LogOut size={17} className="flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
