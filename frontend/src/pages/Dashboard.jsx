import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ArrowRight, TrendingUp, Sprout, BrainCircuit, BookOpen, BarChart3, Activity, Zap } from 'lucide-react';

/* ── Data ── */
const weeklyData = [
  { day: 'Mon', predictions: 12, accuracy: 88 },
  { day: 'Tue', predictions: 18, accuracy: 91 },
  { day: 'Wed', predictions: 15, accuracy: 85 },
  { day: 'Thu', predictions: 22, accuracy: 93 },
  { day: 'Fri', predictions: 28, accuracy: 90 },
  { day: 'Sat', predictions: 20, accuracy: 87 },
  { day: 'Sun', predictions: 10, accuracy: 89 },
];

const cropDist = [
  { name: 'Wheat',   value: 28, color: '#eab308' },
  { name: 'Rice',    value: 22, color: '#22c55e' },
  { name: 'Cotton',  value: 15, color: '#8b5cf6' },
  { name: 'Maize',   value: 12, color: '#f97316' },
  { name: 'Soybean', value: 10, color: '#06b6d4' },
  { name: 'Others',  value: 13, color: '#71717a' },
];

const soilData = [
  { soil: 'Loamy', count: 45 },
  { soil: 'Clay',  count: 30 },
  { soil: 'Sandy', count: 25 },
  { soil: 'Black', count: 20 },
  { soil: 'Silt',  count: 15 },
];

const recent = [
  { id:1, crop:'Wheat 🌿',  soil:'Sandy', season:'Rabi',   weather:'Dry',   conf:88,  date:'Apr 22' },
  { id:2, crop:'Rice 🍚',   soil:'Clay',  season:'Kharif', weather:'Humid', conf:97,  date:'Apr 22' },
  { id:3, crop:'Cotton 🌸', soil:'Loamy', season:'Kharif', weather:'Hot',   conf:91,  date:'Apr 21' },
  { id:4, crop:'Tomato 🍅', soil:'Loamy', season:'Zaid',   weather:'Hot',   conf:92,  date:'Apr 21' },
  { id:5, crop:'Potato 🥔', soil:'Loamy', season:'Rabi',   weather:'Cool',  conf:93,  date:'Apr 20' },
];

const STATS = [
  { label:'Total Predictions', value:'1,247', sub:'+18% this week',  icon:Sprout,       color:'#22c55e', ring:'ring-green-500/20',  bg:'bg-green-500/8'  },
  { label:'ML Predictions',    value:'342',   sub:'+7% this week',   icon:BrainCircuit, color:'#8b5cf6', ring:'ring-violet-500/20', bg:'bg-violet-500/8' },
  { label:'Expert Rules',      value:'25',    sub:'Knowledge base',  icon:BookOpen,     color:'#f59e0b', ring:'ring-amber-500/20',  bg:'bg-amber-500/8'  },
  { label:'Model Accuracy',    value:'91.2%', sub:'+2.1% improved',  icon:BarChart3,    color:'#3b82f6', ring:'ring-blue-500/20',   bg:'bg-blue-500/8'   },
];

const ACTIONS = [
  { to:'/expert',     emoji:'🧠', label:'Expert System',  sub:'IF-THEN inference',  color:'#22c55e', glow:'shadow-[0_0_20px_rgba(34,197,94,0.25)]'  },
  { to:'/simulation', emoji:'🌦️', label:'Simulation',     sub:'Live environment',   color:'#f97316', glow:'shadow-[0_0_20px_rgba(249,115,22,0.25)]'  },
  { to:'/ml',         emoji:'🤖', label:'ML Prediction',  sub:'Yield forecasting',  color:'#8b5cf6', glow:'shadow-[0_0_20px_rgba(139,92,246,0.25)]'  },
  { to:'/history',    emoji:'📋', label:'View History',   sub:'Past predictions',   color:'#3b82f6', glow:'shadow-[0_0_20px_rgba(59,130,246,0.25)]'  },
];

const seasonTag = {
  Kharif: 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-500/10',
  Rabi:   'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10',
  Zaid:   'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10',
};

/* ── Live weather strip ── */
function WeatherStrip() {
  const [w, setW] = useState({ temp:28, hum:65, rain:12, soil:45 });
  useEffect(() => {
    const t = setInterval(() => setW(p => ({
      temp: Math.round(Math.max(15,Math.min(45,p.temp+(Math.random()-.5)*2))),
      hum:  Math.round(Math.max(20,Math.min(95,p.hum +(Math.random()-.5)*3))),
      rain: Math.round(Math.max(0, Math.min(50,p.rain+(Math.random()-.5)*2))),
      soil: Math.round(Math.max(10,Math.min(90,p.soil+(Math.random()-.5)*2))),
    })), 2500);
    return () => clearInterval(t);
  }, []);
  const metrics = [
    { label:'Temperature', val:`${w.temp}°C`,  icon:'🌡️', pct:(w.temp/45)*100,  bar:'#f97316' },
    { label:'Humidity',    val:`${w.hum}%`,    icon:'💧', pct:w.hum,            bar:'#3b82f6' },
    { label:'Rainfall',    val:`${w.rain}mm`,  icon:'🌧️', pct:(w.rain/50)*100,  bar:'#06b6d4' },
    { label:'Soil Moist.', val:`${w.soil}%`,   icon:'🌱', pct:w.soil,           bar:'#22c55e' },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {metrics.map(m => (
        <div key={m.label} className="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800 rounded-xl p-3 group hover:border-zinc-200 dark:hover:border-zinc-700 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">{m.label}</span>
            <span className="text-lg leading-none">{m.icon}</span>
          </div>
          <p className="font-data text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2 tabular-nums">{m.val}</p>
          <div className="h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{width:`${Math.min(100,m.pct)}%`, background:m.bar, boxShadow:`0 0 6px ${m.bar}50`}} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Chart tooltip ── */
function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 shadow-xl text-[12px]">
      <p className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="text-zinc-500">
          <span className="font-medium" style={{color:p.color}}>{p.name}: </span>{p.value}
        </p>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { dark } = useTheme();
  const hour = new Date().getHours();
  const greeting = hour<12?'Good morning':hour<17?'Good afternoon':'Good evening';

  return (
    <div className="space-y-4 fade-in">

      {/* ══ ROW 1: Welcome + Stats bento ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* ── Welcome card with aurora ── */}
        <div className="relative overflow-hidden rounded-2xl bg-zinc-950 p-6 flex flex-col justify-between min-h-[160px] border border-zinc-800">

          {/* Aurora blobs */}
          <div className="aurora-blob-1 w-48 h-48 top-[-30%] left-[-15%]"
            style={{background:'radial-gradient(ellipse, rgba(34,197,94,0.35), transparent 70%)'}} />
          <div className="aurora-blob-2 w-40 h-40 bottom-[-20%] right-[-10%]"
            style={{background:'radial-gradient(ellipse, rgba(16,185,129,0.25), transparent 70%)'}} />
          <div className="aurora-blob-3 w-24 h-24 top-[20%] right-[20%]"
            style={{background:'radial-gradient(ellipse, rgba(99,102,241,0.2), transparent 70%)'}} />

          {/* dot overlay */}
          <div className="absolute inset-0 bg-dot-pattern opacity-[0.08]" />

          {/* content */}
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <p className="text-[11px] font-medium text-zinc-400">{greeting}</p>
            </div>
            <h2 className="text-shimmer text-2xl font-bold leading-tight">{user?.name}</h2>
            <p className="text-zinc-500 text-[12px] mt-1.5 font-medium">Smart farming decisions, powered by AI</p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-2 mt-4">
            <Link to="/expert"
              className="text-[11px] font-semibold bg-green-500/15 hover:bg-green-500/25 border border-green-500/30 text-green-400 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5">
              <Zap size={11} /> Expert System
            </Link>
            <Link to="/ml"
              className="text-[11px] font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-zinc-200 px-3 py-1.5 rounded-lg transition-all">
              🤖 ML Predict
            </Link>
          </div>
        </div>

        {/* ── Stat cards 2×2 ── */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-3">
          {STATS.map((s, i) => (
            <div key={s.label}
              className={`fade-in-${i+1} relative rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 overflow-hidden group`}>

              {/* hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
                style={{background:`radial-gradient(ellipse at 80% 20%, ${s.color}08, transparent 70%)`}} />

              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{background:`${s.color}12`}}>
                    <s.icon size={15} style={{color:s.color}} />
                  </div>
                  {s.sub.includes('%') && (
                    <span className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{background:`${s.color}12`, color:s.color}}>
                      <TrendingUp size={8} />{s.sub}
                    </span>
                  )}
                </div>
                <p className="font-data text-2xl font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">{s.value}</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">{s.label}</p>
                {!s.sub.includes('%') && (
                  <p className="text-[10px] mt-1" style={{color:s.color}}>{s.sub}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ ROW 2: Charts bento ══ */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Area chart */}
        <div className="xl:col-span-2 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">Weekly Predictions</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Volume and accuracy over 7 days</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-zinc-400">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" />Volume</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" />Accuracy</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyData} margin={{top:4,right:4,bottom:0,left:-20}}>
              <defs>
                <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22c55e" stopOpacity={dark?0.22:0.14} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f59e0b" stopOpacity={dark?0.18:0.10} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={dark?'rgba(255,255,255,0.04)':'rgba(0,0,0,0.04)'} />
              <XAxis dataKey="day" tick={{fontSize:11,fill:dark?'#71717a':'#a1a1aa'}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:10,fill:dark?'#71717a':'#a1a1aa'}} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Area type="monotone" dataKey="predictions" stroke="#22c55e" strokeWidth={2} fill="url(#gP)" name="Predictions" dot={false} activeDot={{r:4,fill:'#22c55e',strokeWidth:0}} />
              <Area type="monotone" dataKey="accuracy"    stroke="#f59e0b" strokeWidth={2} fill="url(#gA)" name="Accuracy %" dot={false} activeDot={{r:4,fill:'#f59e0b',strokeWidth:0}} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donut chart */}
        <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
          <p className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 mb-0.5">Crop Distribution</p>
          <p className="text-[11px] text-zinc-500 mb-3">By prediction volume</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={cropDist} cx="50%" cy="50%" innerRadius={42} outerRadius={68} paddingAngle={2} dataKey="value" stroke="none">
                {cropDist.map((e,i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip content={<ChartTip />} formatter={v=>`${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-1">
            {cropDist.map(c => (
              <div key={c.name} className="flex items-center gap-1.5 text-[11px]">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{background:c.color}} />
                <span className="text-zinc-500 truncate">{c.name} <b className="text-zinc-700 dark:text-zinc-300">{c.value}%</b></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ ROW 3: Soil chart + Recent table ══ */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Soil bar chart */}
        <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
          <p className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Soil Type Usage</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={soilData} layout="vertical" margin={{top:0,right:8,bottom:0,left:-10}}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark?'rgba(255,255,255,0.04)':'rgba(0,0,0,0.04)'} />
              <XAxis type="number" tick={{fontSize:10,fill:dark?'#71717a':'#a1a1aa'}} axisLine={false} tickLine={false} />
              <YAxis dataKey="soil" type="category" tick={{fontSize:11,fill:dark?'#a1a1aa':'#71717a'}} width={42} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="count" radius={[0,4,4,0]} name="Queries">
                {soilData.map((_, i) => (
                  <Cell key={i} fill="#22c55e" fillOpacity={1 - i * 0.12} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent table */}
        <div className="xl:col-span-2 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <p className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">Recent Predictions</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Latest expert & ML results</p>
            </div>
            <Link to="/history" className="flex items-center gap-1 text-[11px] text-green-600 dark:text-green-400 font-semibold hover:text-green-700 dark:hover:text-green-300 transition-colors">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  {['Crop','Soil','Season','Weather','Conf.','Date'].map(h=>(
                    <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map(p => (
                  <tr key={p.id} className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors last:border-0">
                    <td className="px-4 py-2.5 font-semibold text-zinc-900 dark:text-zinc-100">{p.crop}</td>
                    <td className="px-4 py-2.5 text-zinc-500 dark:text-zinc-400 capitalize">{p.soil}</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold capitalize ${seasonTag[p.season]||''}`}>{p.season}</span>
                    </td>
                    <td className="px-4 py-2.5 text-zinc-500 dark:text-zinc-400">{p.weather}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-10 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{width:`${p.conf}%`}} />
                        </div>
                        <span className="font-data font-medium text-zinc-700 dark:text-zinc-300 tabular-nums">{p.conf}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-zinc-400 dark:text-zinc-600">{p.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ══ ROW 4: Quick actions ══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {ACTIONS.map((a, i) => (
          <Link key={a.to} to={a.to}
            className={`fade-in-${i+1} group relative overflow-hidden bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 hover:-translate-y-0.5`}>

            {/* corner glow on hover */}
            <div className="absolute bottom-0 right-0 w-20 h-20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 blur-2xl"
              style={{background:`${a.color}35`}} />

            <span className="text-2xl mb-3 block">{a.emoji}</span>
            <p className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">{a.label}</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">{a.sub}</p>
            <div className="flex items-center gap-0.5 mt-3 text-[11px] font-bold transition-all group-hover:gap-1.5"
              style={{color:a.color}}>
              Open <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* ══ ROW 5: Live weather ══ */}
      <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">Live Weather Feed</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">Updates every 2.5 seconds</p>
          </div>
          <span className="flex items-center gap-1.5 text-[11px] text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/15 px-2.5 py-1 rounded-full">
            <Activity size={11} className="animate-pulse" /> Live
          </span>
        </div>
        <WeatherStrip />
      </div>

    </div>
  );
}
