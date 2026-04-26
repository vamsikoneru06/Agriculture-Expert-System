import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ArrowRight, TrendingUp, Sprout, BrainCircuit, BookOpen, BarChart3 } from 'lucide-react';

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
  { name: 'Others',  value: 13, color: '#94a3b8' },
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
  {
    title: 'Total Predictions', value: '1,247', change: '+18%',  trend: 'up', icon: Sprout,
    light: 'bg-green-50 border-green-200',   dark: 'dark:bg-green-500/5 dark:border-green-500/15',
    iconBg: 'bg-green-100 dark:bg-green-500/15', iconColor: 'text-green-600 dark:text-green-400',
    badge: 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400',
  },
  {
    title: 'ML Predictions',    value: '342',   change: '+7%',   trend: 'up', icon: BrainCircuit,
    light: 'bg-violet-50 border-violet-200', dark: 'dark:bg-violet-500/5 dark:border-violet-500/15',
    iconBg: 'bg-violet-100 dark:bg-violet-500/15', iconColor: 'text-violet-600 dark:text-violet-400',
    badge: 'bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400',
  },
  {
    title: 'Expert Rules',      value: '25',    change: 'Rules', trend: null, icon: BookOpen,
    light: 'bg-amber-50 border-amber-200',   dark: 'dark:bg-amber-500/5 dark:border-amber-500/15',
    iconBg: 'bg-amber-100 dark:bg-amber-500/15', iconColor: 'text-amber-600 dark:text-amber-400',
    badge: 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400',
  },
  {
    title: 'Model Accuracy',    value: '91.2%', change: '+2.1%', trend: 'up', icon: BarChart3,
    light: 'bg-blue-50 border-blue-200',     dark: 'dark:bg-blue-500/5 dark:border-blue-500/15',
    iconBg: 'bg-blue-100 dark:bg-blue-500/15', iconColor: 'text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400',
  },
];

const QUICK_ACTIONS = [
  { to: '/expert',     emoji: '🧠', title: 'Expert System',  desc: 'IF-THEN crop prediction',  accent: 'green'  },
  { to: '/simulation', emoji: '🌦️', title: 'Simulation',     desc: 'Live environment forecast', accent: 'orange' },
  { to: '/ml',         emoji: '🤖', title: 'ML Prediction',  desc: 'AI yield forecast',         accent: 'violet' },
  { to: '/history',    emoji: '📋', title: 'View History',   desc: 'Past prediction results',   accent: 'blue'   },
];

const qaAccent = {
  green:  { card: 'hover:border-green-300 dark:hover:border-green-500/30 hover:bg-green-50 dark:hover:bg-green-500/5',  dot: 'bg-green-500'  },
  orange: { card: 'hover:border-orange-300 dark:hover:border-orange-500/30 hover:bg-orange-50 dark:hover:bg-orange-500/5', dot: 'bg-orange-500' },
  violet: { card: 'hover:border-violet-300 dark:hover:border-violet-500/30 hover:bg-violet-50 dark:hover:bg-violet-500/5', dot: 'bg-violet-500' },
  blue:   { card: 'hover:border-blue-300 dark:hover:border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-500/5',     dot: 'bg-blue-500'   },
};

const seasonColor = {
  Kharif: 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400',
  Rabi:   'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400',
  Zaid:   'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400',
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
    { label: 'Temperature',   value: `${w.temp}°C`,        icon: '🌡️', barColor: 'bg-orange-500', pct: (w.temp/45)*100    },
    { label: 'Humidity',      value: `${w.humidity}%`,     icon: '💧', barColor: 'bg-blue-500',   pct: w.humidity          },
    { label: 'Rainfall',      value: `${w.rainfall}mm`,    icon: '🌧️', barColor: 'bg-cyan-500',   pct: (w.rainfall/50)*100 },
    { label: 'Soil Moisture', value: `${w.soilMoisture}%`, icon: '🌱', barColor: 'bg-green-500',  pct: w.soilMoisture      },
  ];

  return (
    <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Live Weather Feed</h3>
        <span className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-semibold">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Live
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metrics.map(m => (
          <div key={m.label} className="bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.05] rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 dark:text-slate-500 font-medium">{m.label}</span>
              <span className="text-base">{m.icon}</span>
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-white mb-2">{m.value}</p>
            <div className="h-1 bg-slate-200 dark:bg-white/[0.06] rounded-full overflow-hidden">
              <div className={`h-full ${m.barColor} rounded-full transition-all duration-700`} style={{ width: `${Math.min(100, m.pct)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TooltipStyle(dark) {
  return dark
    ? { backgroundColor: '#0d1117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#e2e8f0' }
    : { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#1e293b', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' };
}

export default function Dashboard() {
  const { user } = useAuth();
  const { dark } = useTheme();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const tt = TooltipStyle(dark);

  return (
    <div className="space-y-5 fade-in">

      {/* ── Welcome Banner ── */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-green-600 to-emerald-700 dark:from-green-950/80 dark:to-emerald-950/60 dark:border dark:border-green-500/20 shadow-lg shadow-green-500/10">
        <div className="absolute right-0 top-0 bottom-0 w-48 flex items-center justify-end pr-8 text-8xl opacity-10 pointer-events-none select-none">🌾</div>
        <div className="relative">
          <p className="text-green-200 dark:text-green-400/70 text-sm font-medium mb-1">{greeting} 👋</p>
          <h2 className="text-2xl font-bold text-white">{user?.name || 'Welcome'}</h2>
          <p className="text-green-100/70 dark:text-slate-400 text-sm mt-1 max-w-md">
            Your smart agriculture dashboard — make data-driven farming decisions today.
          </p>
          <div className="flex flex-wrap gap-2.5 mt-4">
            <Link to="/expert" className="text-xs bg-white/20 hover:bg-white/30 border border-white/30 text-white px-4 py-2 rounded-xl transition-all font-semibold backdrop-blur-sm">
              🧠 Get Crop Advice
            </Link>
            <Link to="/ml" className="text-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 hover:text-white px-4 py-2 rounded-xl transition-all font-medium">
              🤖 Run ML Prediction
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.title} className={`bg-white ${s.light} ${s.dark} border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center`}>
                <s.icon size={19} className={s.iconColor} />
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${s.badge}`}>
                {s.trend === 'up' && <TrendingUp size={10} className="inline mr-0.5" />}
                {s.change}
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-0.5">{s.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-500 font-medium">{s.title}</p>
          </div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Area chart */}
        <div className="xl:col-span-2 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Weekly Prediction Trend</h3>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Last 7 days</span>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={weeklyPredictions}>
              <defs>
                <linearGradient id="predG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22c55e" stopOpacity={dark ? 0.25 : 0.15} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="accG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f59e0b" stopOpacity={dark ? 0.2 : 0.12} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: dark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: dark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tt} />
              <Area type="monotone" dataKey="predictions" stroke="#22c55e" strokeWidth={2.5} fill="url(#predG)" name="Predictions" dot={false} />
              <Area type="monotone" dataKey="accuracy"    stroke="#f59e0b" strokeWidth={2.5} fill="url(#accG)"  name="Accuracy %" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Crop Distribution</h3>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie data={cropDistribution} cx="50%" cy="50%" innerRadius={48} outerRadius={76} paddingAngle={3} dataKey="value">
                {cropDistribution.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={tt} formatter={v => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-2">
            {cropDistribution.map(c => (
              <div key={c.name} className="flex items-center gap-1.5 text-xs">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.color }} />
                <span className="text-slate-500 dark:text-slate-500 truncate">{c.name} <span className="font-semibold text-slate-700 dark:text-slate-300">{c.value}%</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Soil usage */}
        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Soil Type Usage</h3>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={soilUsage} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} />
              <XAxis type="number" tick={{ fontSize: 10, fill: dark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="soil" type="category" tick={{ fontSize: 11, fill: dark ? '#94a3b8' : '#64748b' }} width={44} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tt} />
              <Bar dataKey="count" fill="#22c55e" radius={[0, 5, 5, 0]} name="Queries" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent predictions */}
        <div className="xl:col-span-2 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Recent Predictions</h3>
            <Link to="/history" className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold transition-colors">
              View all <ArrowRight size={13} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-400 dark:text-slate-600 border-b border-slate-100 dark:border-white/[0.05]">
                  {['Crop', 'Soil', 'Season', 'Weather', 'Date'].map(h => (
                    <th key={h} className="pb-2.5 font-semibold uppercase tracking-wider text-[10px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentPredictions.map(p => (
                  <tr key={p.id} className="border-b border-slate-100 dark:border-white/[0.04] hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 font-semibold text-slate-900 dark:text-white">{p.crop}</td>
                    <td className="py-3 text-slate-500 dark:text-slate-400 capitalize">{p.soil}</td>
                    <td className="py-3">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold capitalize ${seasonColor[p.season]}`}>{p.season}</span>
                    </td>
                    <td className="py-3 text-slate-500 dark:text-slate-400">{p.weather}</td>
                    <td className="py-3 text-slate-400 dark:text-slate-600 text-xs">{p.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map(a => {
            const ac = qaAccent[a.accent];
            return (
              <Link key={a.to} to={a.to}
                className={`group bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] ${ac.card} rounded-2xl p-4 transition-all duration-200 flex items-center gap-3 shadow-sm hover:shadow-md`}>
                <span className="text-2xl flex-shrink-0">{a.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-900 dark:text-white font-semibold text-sm truncate">{a.title}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{a.desc}</p>
                </div>
                <ArrowRight size={15} className="text-slate-400 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Live Weather ── */}
      <LiveWeather />
    </div>
  );
}
