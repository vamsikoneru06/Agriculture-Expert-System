import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import {
  MdEco, MdPsychology, MdHistory, MdBarChart, MdArrowForward,
} from 'react-icons/md';

const weeklyPredictions = [
  { day: 'Mon', predictions: 12, accuracy: 88 },
  { day: 'Tue', predictions: 18, accuracy: 91 },
  { day: 'Wed', predictions: 15, accuracy: 85 },
  { day: 'Thu', predictions: 22, accuracy: 93 },
  { day: 'Fri', predictions: 28, accuracy: 90 },
  { day: 'Sat', predictions: 20, accuracy: 87 },
  { day: 'Sun', predictions: 10, accuracy: 89 },
];

const cropDistribution = [
  { name: 'Wheat',   value: 28, color: '#eab308' },
  { name: 'Rice',    value: 22, color: '#22c55e' },
  { name: 'Cotton',  value: 15, color: '#8b5cf6' },
  { name: 'Maize',   value: 12, color: '#f97316' },
  { name: 'Soybean', value: 10, color: '#06b6d4' },
  { name: 'Others',  value: 13, color: '#475569' },
];

const soilUsage = [
  { soil: 'Loamy', count: 45 },
  { soil: 'Clay',  count: 30 },
  { soil: 'Sandy', count: 25 },
  { soil: 'Black', count: 20 },
  { soil: 'Silt',  count: 15 },
];

const recentPredictions = [
  { id: 1, crop: 'Wheat 🌿',  soil: 'Sandy', season: 'Rabi',   weather: 'Dry',   date: '2025-04-22' },
  { id: 2, crop: 'Rice 🍚',   soil: 'Clay',  season: 'Kharif', weather: 'Humid', date: '2025-04-22' },
  { id: 3, crop: 'Cotton 🌸', soil: 'Loamy', season: 'Kharif', weather: 'Hot',   date: '2025-04-21' },
  { id: 4, crop: 'Tomato 🍅', soil: 'Loamy', season: 'Zaid',   weather: 'Hot',   date: '2025-04-21' },
  { id: 5, crop: 'Potato 🥔', soil: 'Loamy', season: 'Rabi',   weather: 'Cool',  date: '2025-04-20' },
];

const STATS = [
  { title: 'Total Predictions', value: '1,247', change: '+18% this week',  icon: MdEco,        glow: 'shadow-green-500/20',  border: 'border-green-500/20',  badge: 'bg-green-500/10 text-green-400',  iconColor: 'text-green-400',  gradient: 'from-green-500/10' },
  { title: 'ML Predictions',    value: '342',   change: '+7% this week',   icon: MdPsychology, glow: 'shadow-purple-500/20', border: 'border-purple-500/20', badge: 'bg-purple-500/10 text-purple-400',iconColor: 'text-purple-400', gradient: 'from-purple-500/10'},
  { title: 'Expert Rules',      value: '25',    change: 'Knowledge base',  icon: MdBarChart,   glow: 'shadow-yellow-500/20', border: 'border-yellow-500/20', badge: 'bg-yellow-500/10 text-yellow-400',iconColor: 'text-yellow-400', gradient: 'from-yellow-500/10'},
  { title: 'Model Accuracy',    value: '91.2%', change: '+2.1% improved',  icon: MdHistory,    glow: 'shadow-blue-500/20',   border: 'border-blue-500/20',   badge: 'bg-blue-500/10 text-blue-400',    iconColor: 'text-blue-400',   gradient: 'from-blue-500/10' },
];

const QUICK_ACTIONS = [
  { to: '/expert',     emoji: '🧠', title: 'Expert System',  desc: 'IF-THEN crop prediction',   border: 'border-green-500/30',  bg: 'hover:bg-green-500/5'  },
  { to: '/simulation', emoji: '🌦️', title: 'Simulation',     desc: 'Live environment forecast',  border: 'border-orange-500/30', bg: 'hover:bg-orange-500/5' },
  { to: '/ml',         emoji: '🤖', title: 'ML Prediction',  desc: 'AI yield forecast',          border: 'border-purple-500/30', bg: 'hover:bg-purple-500/5' },
  { to: '/history',    emoji: '📋', title: 'View History',   desc: 'Past prediction results',    border: 'border-blue-500/30',   bg: 'hover:bg-blue-500/5'   },
];

const seasonColor = {
  Kharif: 'bg-green-500/10 text-green-400 border border-green-500/20',
  Rabi:   'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  Zaid:   'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
};

const customTooltipStyle = {
  backgroundColor: '#0d1117',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  color: '#e2e8f0',
};

function LiveWeather() {
  const [w, setW] = useState({ temp: 28, humidity: 65, rainfall: 12, soilMoisture: 45 });
  useEffect(() => {
    const t = setInterval(() => setW(p => ({
      temp:         Math.round(Math.max(15, Math.min(45, p.temp         + (Math.random()-.5)*2))),
      humidity:     Math.round(Math.max(20, Math.min(95, p.humidity     + (Math.random()-.5)*3))),
      rainfall:     Math.round(Math.max(0,  Math.min(50, p.rainfall     + (Math.random()-.5)*2))),
      soilMoisture: Math.round(Math.max(10, Math.min(90, p.soilMoisture + (Math.random()-.5)*2))),
    })), 3000);
    return () => clearInterval(t);
  }, []);

  const metrics = [
    { label: 'Temperature',   value: `${w.temp}°C`,         icon: '🌡️', color: 'text-orange-400', bar: 'bg-orange-500', pct: (w.temp/45)*100 },
    { label: 'Humidity',      value: `${w.humidity}%`,      icon: '💧', color: 'text-blue-400',   bar: 'bg-blue-500',   pct: w.humidity       },
    { label: 'Rainfall',      value: `${w.rainfall}mm`,     icon: '🌧️', color: 'text-cyan-400',   bar: 'bg-cyan-500',   pct: (w.rainfall/50)*100},
    { label: 'Soil Moisture', value: `${w.soilMoisture}%`,  icon: '🌱', color: 'text-green-400',  bar: 'bg-green-500',  pct: w.soilMoisture   },
  ];

  return (
    <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Live Weather Feed</h3>
        <span className="flex items-center gap-1.5 text-xs text-green-400 font-medium">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Live
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {metrics.map(m => (
          <div key={m.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500">{m.label}</span>
              <span className="text-base">{m.icon}</span>
            </div>
            <p className={`text-xl font-bold ${m.color} mb-2`}>{m.value}</p>
            <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
              <div className={`h-full ${m.bar} rounded-full transition-all duration-700`} style={{ width: `${Math.min(100, m.pct)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="space-y-6 fade-in">

      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-950/60 via-emerald-950/40 to-transparent border border-green-500/20 rounded-2xl p-6">
        <div className="absolute top-0 right-0 w-64 h-full opacity-10 text-9xl flex items-center justify-end pr-6 pointer-events-none select-none">🌾</div>
        <p className="text-green-400/70 text-sm mb-1">{greeting} 👋</p>
        <h2 className="text-2xl font-bold text-white">{user?.name || 'Welcome'}</h2>
        <p className="text-slate-400 text-sm mt-1">Your smart agriculture dashboard — make data-driven farming decisions today.</p>
        <div className="flex gap-3 mt-4">
          <Link to="/expert" className="text-xs bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-xl hover:bg-green-500/20 transition-all font-medium">
            🧠 Get Crop Advice
          </Link>
          <Link to="/ml" className="text-xs bg-white/[0.04] border border-white/[0.08] text-slate-300 px-4 py-2 rounded-xl hover:bg-white/[0.08] transition-all font-medium">
            🤖 Run ML Prediction
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.title} className={`relative overflow-hidden bg-white/[0.03] border ${s.border} rounded-2xl p-5 shadow-lg ${s.glow}`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} to-transparent opacity-50 pointer-events-none`} />
            <div className="relative">
              <div className="flex items-start justify-between mb-3">
                <s.icon size={22} className={s.iconColor} />
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.badge}`}>{s.change}</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{s.value}</p>
              <p className="text-xs text-slate-500">{s.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Area chart */}
        <div className="xl:col-span-2 bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4">Weekly Prediction Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyPredictions}>
              <defs>
                <linearGradient id="predG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}   />
                </linearGradient>
                <linearGradient id="accG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#eab308" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Area type="monotone" dataKey="predictions" stroke="#22c55e" strokeWidth={2} fill="url(#predG)" name="Predictions" />
              <Area type="monotone" dataKey="accuracy"    stroke="#eab308" strokeWidth={2} fill="url(#accG)"  name="Accuracy %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4">Crop Distribution</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={cropDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {cropDistribution.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={customTooltipStyle} formatter={v => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {cropDistribution.map(c => (
              <div key={c.name} className="flex items-center gap-1.5 text-xs">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.color }} />
                <span className="text-slate-400 truncate">{c.name} ({c.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Soil usage */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4">Soil Type Usage</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={soilUsage} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="soil" type="category" tick={{ fontSize: 11, fill: '#64748b' }} width={45} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Bar dataKey="count" fill="#22c55e" radius={[0, 6, 6, 0]} name="Queries" opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent predictions */}
        <div className="xl:col-span-2 bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Recent Predictions</h3>
            <Link to="/history" className="text-xs text-green-400 hover:text-green-300 flex items-center gap-1 transition-colors">
              View all <MdArrowForward size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-600 border-b border-white/[0.06]">
                  <th className="pb-3 font-semibold">Crop</th>
                  <th className="pb-3 font-semibold">Soil</th>
                  <th className="pb-3 font-semibold">Season</th>
                  <th className="pb-3 font-semibold">Weather</th>
                  <th className="pb-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentPredictions.map(p => (
                  <tr key={p.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 font-medium text-white">{p.crop}</td>
                    <td className="py-3 text-slate-400">{p.soil}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${seasonColor[p.season]}`}>{p.season}</span>
                    </td>
                    <td className="py-3 text-slate-400">{p.weather}</td>
                    <td className="py-3 text-slate-600 text-xs">{p.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-white font-semibold mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map(a => (
            <Link key={a.to} to={a.to}
              className={`group bg-white/[0.03] border ${a.border} rounded-2xl p-4 ${a.bg} transition-all flex items-center gap-3`}>
              <span className="text-2xl">{a.emoji}</span>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">{a.title}</p>
                <p className="text-xs text-slate-500">{a.desc}</p>
              </div>
              <MdArrowForward className="text-slate-600 group-hover:text-slate-300 transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* Live Weather */}
      <LiveWeather />
    </div>
  );
}
