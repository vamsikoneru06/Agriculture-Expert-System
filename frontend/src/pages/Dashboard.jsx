import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import {
  MdEco, MdPsychology, MdHistory, MdBarChart,
  MdWaterDrop, MdThermostat, MdCloud, MdArrowForward,
} from 'react-icons/md';

/* ── Mock analytics data ── */
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
  { name: 'Wheat',        value: 28, color: '#eab308' },
  { name: 'Rice',         value: 22, color: '#22c55e' },
  { name: 'Cotton',       value: 15, color: '#8b5cf6' },
  { name: 'Maize',        value: 12, color: '#f97316' },
  { name: 'Soybean',      value: 10, color: '#06b6d4' },
  { name: 'Others',       value: 13, color: '#94a3b8' },
];

const soilUsage = [
  { soil: 'Loamy', count: 45 },
  { soil: 'Clay',  count: 30 },
  { soil: 'Sandy', count: 25 },
  { soil: 'Black', count: 20 },
  { soil: 'Silt',  count: 15 },
];

const recentPredictions = [
  { id: 1, crop: 'Wheat 🌿',       soil: 'Sandy',  season: 'Rabi',   weather: 'Dry',   date: '2025-04-22', status: 'saved' },
  { id: 2, crop: 'Rice 🍚',        soil: 'Clay',   season: 'Kharif', weather: 'Humid', date: '2025-04-22', status: 'saved' },
  { id: 3, crop: 'Cotton 🌸',      soil: 'Loamy',  season: 'Kharif', weather: 'Hot',   date: '2025-04-21', status: 'saved' },
  { id: 4, crop: 'Tomato 🍅',      soil: 'Loamy',  season: 'Zaid',   weather: 'Hot',   date: '2025-04-21', status: 'saved' },
  { id: 5, crop: 'Potato 🥔',      soil: 'Loamy',  season: 'Rabi',   weather: 'Cool',  date: '2025-04-20', status: 'saved' },
];

/* Simulated weather widget data */
function WeatherWidget() {
  const [weather, setWeather] = useState({
    temp: 28, humidity: 65, rainfall: 12, soilMoisture: 45,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setWeather(w => ({
        temp:        Math.round(Math.max(15, Math.min(45, w.temp        + (Math.random() - 0.5) * 2))),
        humidity:    Math.round(Math.max(20, Math.min(95, w.humidity    + (Math.random() - 0.5) * 3))),
        rainfall:    Math.round(Math.max(0,  Math.min(50, w.rainfall    + (Math.random() - 0.5) * 2))),
        soilMoisture:Math.round(Math.max(10, Math.min(90, w.soilMoisture+ (Math.random() - 0.5) * 2))),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    { label: 'Temperature',   value: `${weather.temp}°C`,    icon: MdThermostat, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    { label: 'Humidity',      value: `${weather.humidity}%`, icon: MdCloud,      color: 'text-blue-500',   bg: 'bg-blue-50 dark:bg-blue-900/20'     },
    { label: 'Rainfall',      value: `${weather.rainfall}mm`,icon: MdWaterDrop,  color: 'text-cyan-500',   bg: 'bg-cyan-50 dark:bg-cyan-900/20'     },
    { label: 'Soil Moisture', value: `${weather.soilMoisture}%`, icon: MdEco,   color: 'text-green-500',  bg: 'bg-green-50 dark:bg-green-900/20'   },
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-title text-base">Live Weather Feed</h3>
        <span className="flex items-center gap-1.5 text-xs text-primary-600 dark:text-primary-400 font-medium">
          <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
          Live
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {metrics.map(m => (
          <div key={m.label} className={`${m.bg} rounded-xl p-3 flex items-center gap-2`}>
            <m.icon className={`${m.color} text-xl flex-shrink-0`} />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{m.label}</p>
              <p className={`font-bold text-sm ${m.color}`}>{m.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Quick action card */
function QuickAction({ to, icon: Icon, title, desc, color }) {
  return (
    <Link to={to} className={`card group hover:shadow-md transition-all duration-200 border-l-4 ${color} flex items-center gap-4`}>
      <div className="w-10 h-10 rounded-xl bg-current/10 flex items-center justify-center">
        <Icon size={22} className="text-current" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{title}</p>
        <p className="text-xs text-slate-400">{desc}</p>
      </div>
      <MdArrowForward className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
    </Link>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 fade-in">
      {/* ── Welcome banner ── */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 text-white">
        <p className="text-primary-200 text-sm mb-1">Good {new Date().getHours() < 12 ? 'Morning' : 'Afternoon'} 👋</p>
        <h2 className="text-2xl font-bold">{user?.name || 'Welcome'}</h2>
        <p className="text-primary-200 text-sm mt-1">
          Your smart agriculture dashboard — make data-driven farming decisions today.
        </p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Predictions" value="1,247"  change="+18% this week"  icon={MdEco}        color="green"  />
        <StatCard title="ML Predictions"    value="342"    change="+7% this week"   icon={MdPsychology} color="blue"   />
        <StatCard title="Expert Rules"      value="25"     change="Knowledge base"  icon={MdBarChart}   color="yellow" />
        <StatCard title="Model Accuracy"    value="91.2%"  change="+2.1% improved"  icon={MdHistory}    color="purple" />
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Weekly trend chart */}
        <div className="xl:col-span-2 card">
          <h3 className="section-title text-base mb-4">Weekly Prediction Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyPredictions}>
              <defs>
                <linearGradient id="predGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#16a34a" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="predictions" stroke="#16a34a" strokeWidth={2} fill="url(#predGradient)" name="Predictions" />
              <Area type="monotone" dataKey="accuracy"    stroke="#eab308" strokeWidth={2} fill="transparent"        name="Accuracy %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Crop pie chart */}
        <div className="card">
          <h3 className="section-title text-base mb-4">Crop Distribution</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={cropDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {cropDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: '12px', border: 'none' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {cropDistribution.map(c => (
              <div key={c.name} className="flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
                <span className="text-slate-600 dark:text-slate-400 truncate">{c.name} ({c.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Soil usage bar chart */}
        <div className="card">
          <h3 className="section-title text-base mb-4">Soil Type Usage</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={soilUsage} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="soil" type="category" tick={{ fontSize: 11 }} width={45} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
              <Bar dataKey="count" fill="#16a34a" radius={[0, 6, 6, 0]} name="Queries" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent predictions table */}
        <div className="xl:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title text-base">Recent Predictions</h3>
            <Link to="/history" className="text-xs text-primary-600 dark:text-primary-400 font-medium hover:underline flex items-center gap-1">
              View all <MdArrowForward size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
                  <th className="pb-2 font-semibold">Crop</th>
                  <th className="pb-2 font-semibold">Soil</th>
                  <th className="pb-2 font-semibold">Season</th>
                  <th className="pb-2 font-semibold">Weather</th>
                  <th className="pb-2 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                {recentPredictions.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="py-2.5 font-medium text-slate-700 dark:text-slate-200">{p.crop}</td>
                    <td className="py-2.5 text-slate-500 dark:text-slate-400">{p.soil}</td>
                    <td className="py-2.5">
                      <span className={`badge ${
                        p.season === 'Kharif' ? 'bg-green-100 text-green-700' :
                        p.season === 'Rabi'   ? 'bg-blue-100 text-blue-700'   :
                                                'bg-yellow-100 text-yellow-700'}`}>
                        {p.season}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-500 dark:text-slate-400">{p.weather}</td>
                    <td className="py-2.5 text-slate-400 text-xs">{p.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Quick actions ── */}
      <div>
        <h3 className="section-title text-base mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickAction to="/expert"     icon={MdEco}        title="Get Crop Advice"    desc="Expert system prediction" color="border-primary-500 text-primary-600" />
          <QuickAction to="/simulation" icon={MdCloud}      title="Run Simulation"     desc="Environmental forecast"   color="border-blue-500 text-blue-600"     />
          <QuickAction to="/ml"         icon={MdPsychology} title="ML Prediction"      desc="AI yield forecast"        color="border-purple-500 text-purple-600" />
          <QuickAction to="/history"    icon={MdHistory}    title="View History"       desc="Past predictions"         color="border-yellow-500 text-yellow-600" />
        </div>
      </div>

      {/* ── Live weather ── */}
      <WeatherWidget />
    </div>
  );
}
