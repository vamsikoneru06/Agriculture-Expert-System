import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MdDashboard, MdEco, MdBarChart, MdPsychology,
  MdHistory, MdAdminPanelSettings, MdChat,
  MdLogout, MdMenu, MdClose, MdGrain,
} from 'react-icons/md';
import { WiThermometer } from 'react-icons/wi';

const navItems = [
  { to: '/dashboard',   icon: MdDashboard,          label: 'Dashboard',      roles: ['admin','farmer','student'] },
  { to: '/expert',      icon: MdEco,                label: 'Expert System',  roles: ['admin','farmer','student'] },
  { to: '/simulation',  icon: WiThermometer,        label: 'Simulation',     roles: ['admin','farmer','student'] },
  { to: '/ml',          icon: MdPsychology,         label: 'ML Prediction',  roles: ['admin','farmer','student'] },
  { to: '/history',     icon: MdHistory,            label: 'History',        roles: ['admin','farmer','student'] },
  { to: '/admin',       icon: MdAdminPanelSettings, label: 'Admin Panel',    roles: ['admin'] },
  { to: '/chatbot',     icon: MdChat,               label: 'AI Chatbot',     roles: ['admin','farmer','student'] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const allowed = navItems.filter(item => item.roles.includes(user?.role || 'student'));

  return (
    <aside
      className={`
        flex flex-col h-screen bg-gradient-to-b from-primary-800 to-primary-900
        transition-all duration-300 ease-in-out shadow-xl z-30
        ${collapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* ── Logo ── */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <MdGrain className="text-white text-xl" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">AgriExpert</p>
              <p className="text-primary-200 text-xs">Smart Farming AI</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          {collapsed ? <MdMenu size={20} /> : <MdClose size={20} />}
        </button>
      </div>

      {/* ── User badge ── */}
      {!collapsed && user && (
        <div className="mx-3 mt-4 mb-2 p-3 bg-white/10 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-400 flex items-center justify-center text-white font-bold text-sm">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-white font-semibold text-sm truncate">{user.name}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                ${user.role === 'admin'   ? 'bg-red-400/30 text-red-200' :
                  user.role === 'farmer'  ? 'bg-earth-400/30 text-earth-200' :
                                            'bg-blue-400/30 text-blue-200'}`}
              >
                {user.role}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Nav links ── */}
      <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto">
        {allowed.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
              ${isActive
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-primary-100 hover:bg-white/10 hover:text-white'
              }`
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={20} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* ── Logout ── */}
      <div className="px-2 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                     text-primary-100 hover:bg-red-500/20 hover:text-red-200 transition-all duration-150"
          title={collapsed ? 'Logout' : undefined}
        >
          <MdLogout size={20} className="flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
