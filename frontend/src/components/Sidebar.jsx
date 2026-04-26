import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MdDashboard, MdEco, MdPsychology,
  MdHistory, MdAdminPanelSettings, MdChat,
  MdLogout, MdMenu, MdClose,
} from 'react-icons/md';
import { WiThermometer } from 'react-icons/wi';

const navItems = [
  { to: '/dashboard',   icon: MdDashboard,          label: 'Dashboard',     roles: ['admin','farmer','student'], color: 'text-green-400'  },
  { to: '/expert',      icon: MdEco,                label: 'Expert System', roles: ['admin','farmer','student'], color: 'text-emerald-400'},
  { to: '/simulation',  icon: WiThermometer,        label: 'Simulation',    roles: ['admin','farmer','student'], color: 'text-orange-400' },
  { to: '/ml',          icon: MdPsychology,         label: 'ML Prediction', roles: ['admin','farmer','student'], color: 'text-purple-400' },
  { to: '/history',     icon: MdHistory,            label: 'History',       roles: ['admin','farmer','student'], color: 'text-blue-400'   },
  { to: '/admin',       icon: MdAdminPanelSettings, label: 'Admin Panel',   roles: ['admin'],                    color: 'text-red-400'    },
  { to: '/chatbot',     icon: MdChat,               label: 'AI Chatbot',    roles: ['admin','farmer','student'], color: 'text-cyan-400'   },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const allowed = navItems.filter(i => i.roles.includes(user?.role || 'student'));

  return (
    <aside className={`flex flex-col h-screen bg-[#0d1117] border-r border-white/[0.06] transition-all duration-300 ease-in-out z-30 ${collapsed ? 'w-16' : 'w-64'}`}>

      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/[0.06]">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center justify-center text-lg">🌾</div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">AgriExpert</p>
              <p className="text-green-400/70 text-xs">Smart Farming AI</p>
            </div>
          </div>
        )}
        <button onClick={() => setCollapsed(c => !c)} className="text-slate-500 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors">
          {collapsed ? <MdMenu size={20} /> : <MdClose size={20} />}
        </button>
      </div>

      {/* User badge */}
      {!collapsed && user && (
        <div className="mx-3 mt-4 mb-2 p-3 bg-white/[0.04] border border-white/[0.06] rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-white font-semibold text-sm truncate">{user.name}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                ${user.role === 'admin'   ? 'bg-red-500/20 text-red-300' :
                  user.role === 'farmer'  ? 'bg-green-500/20 text-green-300' :
                                            'bg-blue-500/20 text-blue-300'}`}>
                {user.role}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Nav links */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        {allowed.map(({ to, icon: Icon, label, color }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
              ${isActive
                ? 'bg-green-500/10 border border-green-500/20 text-white'
                : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-300'}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} className={`flex-shrink-0 transition-colors ${isActive ? 'text-green-400' : color + '/60 group-hover:' + color}`} />
                {!collapsed && <span>{label}</span>}
                {!collapsed && isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-2 py-4 border-t border-white/[0.06]">
        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <MdLogout size={20} className="flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
