import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { TrendingUp, Sprout, BrainCircuit, BookOpen, BarChart3, Activity, Zap, ArrowRight } from 'lucide-react';
import AgriShaderCards from '../components/ui/agri-shader-cards';

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
  { name: 'Rice',    value: 22, color: '#4ade80' },
  { name: 'Cotton',  value: 15, color: '#a78bfa' },
  { name: 'Maize',   value: 12, color: '#fb923c' },
  { name: 'Soybean', value: 10, color: '#22d3ee' },
  { name: 'Others',  value: 13, color: '#5a7a5a' },
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
  { label:'Total Predictions', value:'1,247', sub:'+18% this week',  icon:Sprout,       color:'#4ade80' },
  { label:'ML Predictions',    value:'342',   sub:'+7% this week',   icon:BrainCircuit, color:'#a78bfa' },
  { label:'Expert Rules',      value:'25',    sub:'Knowledge base',  icon:BookOpen,     color:'#fbbf24' },
  { label:'Model Accuracy',    value:'91.2%', sub:'+2.1% improved',  icon:BarChart3,    color:'#60a5fa' },
];

/* ── Card wrapper ── */
function Card({ className = '', style = {}, children }) {
  const { dark } = useTheme();
  return (
    <div className={`rounded-2xl ${className}`}
      style={{
        background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.88)',
        border: dark ? '1px solid rgba(74,222,128,0.09)' : '1px solid rgba(34,139,34,0.14)',
        backdropFilter: 'blur(8px)',
        ...style,
      }}>
      {children}
    </div>
  );
}

/* ── Live weather strip ── */
function WeatherStrip() {
  const { dark } = useTheme();
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
    { label:'Temperature', val:`${w.temp}°C`,  icon:'🌡️', pct:(w.temp/45)*100, bar:'#fb923c' },
    { label:'Humidity',    val:`${w.hum}%`,    icon:'💧', pct:w.hum,           bar:'#60a5fa' },
    { label:'Rainfall',    val:`${w.rain}mm`,  icon:'🌧️', pct:(w.rain/50)*100, bar:'#22d3ee' },
    { label:'Soil Moist.', val:`${w.soil}%`,   icon:'🌱', pct:w.soil,          bar:'#4ade80' },
  ];

  const T = {
    cardBg:     dark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.75)',
    cardBdr:    dark ? '1px solid rgba(74,222,128,0.07)' : '1px solid rgba(34,139,34,0.12)',
    cardBdrHov: dark ? '1px solid rgba(74,222,128,0.18)' : '1px solid rgba(34,139,34,0.3)',
    labelClr:   dark ? 'rgba(74,222,128,0.4)'  : 'rgba(22,101,52,0.65)',
    valClr:     dark ? '#d0e8d0'               : '#0f2f0f',
    trackBg:    dark ? 'rgba(255,255,255,0.06)': 'rgba(0,0,0,0.08)',
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {metrics.map(m => (
        <div key={m.label} className="rounded-xl p-3 transition-all"
          style={{background: T.cardBg, border: T.cardBdr}}
          onMouseEnter={e => e.currentTarget.style.border = T.cardBdrHov}
          onMouseLeave={e => e.currentTarget.style.border = T.cardBdr}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-data text-[9px] uppercase tracking-[0.15em]"
              style={{color: T.labelClr}}>{m.label}</span>
            <span className="text-lg leading-none">{m.icon}</span>
          </div>
          <p className="font-data text-lg font-semibold mb-2 tabular-nums" style={{color: T.valClr}}>{m.val}</p>
          <div className="h-0.5 rounded-full overflow-hidden" style={{background: T.trackBg}}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{width:`${Math.min(100,m.pct)}%`, background:m.bar, boxShadow: dark ? `0 0 6px ${m.bar}60` : 'none'}} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Chart tooltip ── */
function ChartTip({ active, payload, label }) {
  const { dark } = useTheme();
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl p-3 shadow-2xl text-[12px]"
      style={{
        background: dark ? '#0a1a0a' : '#f0f9f0',
        border: dark ? '1px solid rgba(74,222,128,0.15)' : '1px solid rgba(34,139,34,0.2)',
      }}>
      <p className="font-semibold mb-1.5" style={{color: dark ? '#d0e8d0' : '#0f2f0f'}}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{color:p.color}} className="font-medium">{p.name}: {p.value}</p>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { dark } = useTheme();
  const hour = new Date().getHours();
  const greeting = hour<12?'Good morning':hour<17?'Good afternoon':'Good evening';

  /* ── Theme tokens ── */
  const T = {
    primaryText:  dark ? '#d0e8d0'                    : '#0f2f0f',
    secondaryText:dark ? 'rgba(180,210,180,0.55)'     : 'rgba(15,47,15,0.65)',
    accentText:   dark ? 'rgba(74,222,128,0.45)'      : 'rgba(22,101,52,0.7)',
    dimText:      dark ? 'rgba(74,222,128,0.3)'       : 'rgba(22,101,52,0.5)',
    cardBg:       dark ? 'rgba(255,255,255,0.03)'     : 'rgba(255,255,255,0.85)',
    cardBdr:      dark ? 'rgba(74,222,128,0.08)'      : 'rgba(34,139,34,0.14)',
    divider:      dark ? 'rgba(74,222,128,0.07)'      : 'rgba(34,139,34,0.1)',
    trackBg:      dark ? 'rgba(255,255,255,0.06)'     : 'rgba(0,0,0,0.08)',
    gridStroke:   dark ? 'rgba(74,222,128,0.06)'      : 'rgba(34,139,34,0.1)',
    axisTick:     dark ? 'rgba(74,222,128,0.35)'      : 'rgba(22,101,52,0.55)',
    axisSoil:     dark ? 'rgba(180,210,180,0.5)'      : 'rgba(15,47,15,0.55)',
    welcomeBg:    dark ? 'rgba(10,26,10,0.8)'         : 'rgba(230,248,230,0.95)',
    welcomeBdr:   dark ? 'rgba(74,222,128,0.15)'      : 'rgba(34,139,34,0.2)',
    rowHover:     dark ? 'rgba(74,222,128,0.03)'      : 'rgba(22,163,74,0.05)',
    viewAllClr:   dark ? 'rgba(74,222,128,0.6)'       : 'rgba(22,101,52,0.75)',
    viewAllHov:   dark ? '#4ade80'                    : '#15803d',
    expertBtnBg:  dark ? 'rgba(74,222,128,0.12)'      : 'rgba(74,222,128,0.15)',
    expertBtnBdr: dark ? 'rgba(74,222,128,0.25)'      : 'rgba(34,139,34,0.4)',
    expertBtnClr: dark ? '#4ade80'                    : '#166534',
    mlBtnBg:      dark ? 'rgba(255,255,255,0.05)'     : 'rgba(255,255,255,0.7)',
    mlBtnBdr:     dark ? 'rgba(255,255,255,0.08)'     : 'rgba(34,139,34,0.2)',
    mlBtnClr:     dark ? 'rgba(180,210,180,0.6)'      : 'rgba(15,47,15,0.7)',
    mlBtnHov:     dark ? '#d0e8d0'                    : '#0f2f0f',
  };

  return (
    <div className="space-y-4 fade-in">

      {/* ══ ROW 1: Welcome + Stats ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Welcome card */}
        <div className="relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between min-h-[160px]"
          style={{background: T.welcomeBg, border: `1px solid ${T.welcomeBdr}`}}>

          {/* Aurora blobs */}
          <div className="aurora-blob-1 w-48 h-48 top-[-30%] left-[-15%]"
            style={{background:'radial-gradient(ellipse, rgba(74,222,128,0.2), transparent 70%)'}} />
          <div className="aurora-blob-2 w-40 h-40 bottom-[-20%] right-[-10%]"
            style={{background:'radial-gradient(ellipse, rgba(34,211,238,0.12), transparent 70%)'}} />

          {/* Crop-row overlay */}
          <div className="absolute inset-0 bg-crop-rows pointer-events-none" style={{opacity: dark ? 1 : 0.4}} />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"
                style={{boxShadow: dark ? '0 0 6px #4ade80' : 'none'}} />
              <span className="font-data text-[10px] uppercase tracking-[0.18em]"
                style={{color: T.accentText}}>
                {greeting}
              </span>
            </div>
            <h2 className="text-shimmer font-display text-2xl font-bold leading-tight">{user?.name}</h2>
            <p className="text-[12px] mt-1.5" style={{color: T.secondaryText}}>
              Smart farming decisions, powered by AI
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-2 mt-4">
            <Link to="/expert"
              className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
              style={{background: T.expertBtnBg, border: `1px solid ${T.expertBtnBdr}`, color: T.expertBtnClr}}
              onMouseEnter={e => e.currentTarget.style.background = dark ? 'rgba(74,222,128,0.2)' : 'rgba(74,222,128,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = T.expertBtnBg}>
              <Zap size={11} /> Expert System
            </Link>
            <Link to="/ml"
              className="text-[11px] font-medium px-3 py-1.5 rounded-lg transition-all"
              style={{background: T.mlBtnBg, border: `1px solid ${T.mlBtnBdr}`, color: T.mlBtnClr}}
              onMouseEnter={e => e.currentTarget.style.color = T.mlBtnHov}
              onMouseLeave={e => e.currentTarget.style.color = T.mlBtnClr}>
              🤖 ML Predict
            </Link>
          </div>
        </div>

        {/* Stat cards 2×2 */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-3">
          {STATS.map((s, i) => (
            <div key={s.label}
              className={`fade-in-${i+1} group relative rounded-xl p-4 overflow-hidden transition-all duration-200 cursor-default`}
              style={{
                background: T.cardBg,
                border: `1px solid ${T.cardBdr}`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.border = `1px solid ${s.color}40`;
                e.currentTarget.style.background = `${s.color}08`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.border = `1px solid ${T.cardBdr}`;
                e.currentTarget.style.background = T.cardBg;
              }}>

              <div className="flex items-start justify-between mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{background:`${s.color}18`, border:`1px solid ${s.color}30`}}>
                  <s.icon size={15} style={{color:s.color}} />
                </div>
                {s.sub.includes('%') && (
                  <span className="flex items-center gap-0.5 text-[10px] font-data font-semibold px-1.5 py-0.5 rounded-full"
                    style={{background:`${s.color}15`, color:s.color}}>
                    <TrendingUp size={8} />{s.sub}
                  </span>
                )}
              </div>
              <p className="font-data text-2xl font-semibold tabular-nums" style={{color:s.color}}>{s.value}</p>
              <p className="text-[11px] mt-0.5" style={{color: T.secondaryText}}>{s.label}</p>
              {!s.sub.includes('%') && (
                <p className="text-[10px] font-data mt-1" style={{color:`${s.color}90`}}>{s.sub}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ══ ROW 2: Charts ══ */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Area chart */}
        <Card className="xl:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-display text-[13px] font-semibold" style={{color: T.primaryText}}>Weekly Predictions</p>
              <p className="text-[11px] mt-0.5" style={{color: T.accentText}}>Volume and accuracy over 7 days</p>
            </div>
            <div className="flex items-center gap-3 font-data text-[10px]" style={{color: T.accentText}}>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" />Volume</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />Accuracy</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyData} margin={{top:4,right:4,bottom:0,left:-20}}>
              <defs>
                <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#4ade80" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0}   />
                </linearGradient>
                <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#fbbf24" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={T.gridStroke} />
              <XAxis dataKey="day" tick={{fontSize:11,fill:T.axisTick,fontFamily:'JetBrains Mono'}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:10,fill:T.axisTick,fontFamily:'JetBrains Mono'}} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Area type="monotone" dataKey="predictions" stroke="#4ade80" strokeWidth={2} fill="url(#gP)" name="Predictions" dot={false} activeDot={{r:4,fill:'#4ade80',strokeWidth:0}} />
              <Area type="monotone" dataKey="accuracy"    stroke="#fbbf24" strokeWidth={2} fill="url(#gA)" name="Accuracy %" dot={false} activeDot={{r:4,fill:'#fbbf24',strokeWidth:0}} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Donut chart */}
        <Card className="p-5">
          <p className="font-display text-[13px] font-semibold mb-0.5" style={{color: T.primaryText}}>Crop Distribution</p>
          <p className="text-[11px] mb-3" style={{color: T.accentText}}>By prediction volume</p>
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
                <span style={{color: T.secondaryText}}>{c.name} <b style={{color: T.primaryText}}>{c.value}%</b></span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ══ ROW 3: Soil chart + Recent table ══ */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Soil bar chart */}
        <Card className="p-5">
          <p className="font-display text-[13px] font-semibold mb-4" style={{color: T.primaryText}}>Soil Type Usage</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={soilData} layout="vertical" margin={{top:0,right:8,bottom:0,left:-10}}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.gridStroke} />
              <XAxis type="number" tick={{fontSize:10,fill:T.axisTick,fontFamily:'JetBrains Mono'}} axisLine={false} tickLine={false} />
              <YAxis dataKey="soil" type="category" tick={{fontSize:11,fill:T.axisSoil}} width={42} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="count" radius={[0,4,4,0]} name="Queries">
                {soilData.map((_, i) => (
                  <Cell key={i} fill="#4ade80" fillOpacity={1 - i * 0.14} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent predictions table */}
        <div className="xl:col-span-2 rounded-2xl overflow-hidden"
          style={{background: T.cardBg, border: `1px solid ${T.cardBdr}`}}>
          <div className="flex items-center justify-between px-5 pt-4 pb-3"
            style={{borderBottom: `1px solid ${T.divider}`}}>
            <div>
              <p className="font-display text-[13px] font-semibold" style={{color: T.primaryText}}>Recent Predictions</p>
              <p className="text-[11px] mt-0.5" style={{color: T.accentText}}>Latest expert & ML results</p>
            </div>
            <Link to="/history" className="flex items-center gap-1 text-[11px] font-semibold transition-colors"
              style={{color: T.viewAllClr}}
              onMouseEnter={e => e.currentTarget.style.color = T.viewAllHov}
              onMouseLeave={e => e.currentTarget.style.color = T.viewAllClr}>
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr style={{borderBottom: `1px solid ${T.divider}`}}>
                  {['Crop','Soil','Season','Weather','Conf.','Date'].map(h=>(
                    <th key={h} className="px-4 py-2.5 text-left font-data font-medium"
                      style={{color: T.dimText, fontSize:'9px', letterSpacing:'0.12em', textTransform:'uppercase'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map(p => {
                  const tag = {
                    Kharif: { text:'#16a34a', bg: dark ? 'rgba(74,222,128,0.08)'  : 'rgba(22,163,74,0.1)',  border: dark ? 'rgba(74,222,128,0.15)'  : 'rgba(22,163,74,0.3)'  },
                    Rabi:   { text:'#2563eb', bg: dark ? 'rgba(96,165,250,0.08)'  : 'rgba(37,99,235,0.08)', border: dark ? 'rgba(96,165,250,0.15)'  : 'rgba(37,99,235,0.25)' },
                    Zaid:   { text:'#d97706', bg: dark ? 'rgba(251,191,36,0.08)'  : 'rgba(217,119,6,0.08)', border: dark ? 'rgba(251,191,36,0.15)'  : 'rgba(217,119,6,0.25)' },
                  }[p.season] || {};
                  return (
                    <tr key={p.id} className="transition-colors"
                      style={{borderBottom: `1px solid ${T.divider}`}}
                      onMouseEnter={e => e.currentTarget.style.background = T.rowHover}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td className="px-4 py-2.5 font-semibold" style={{color: T.primaryText}}>{p.crop}</td>
                      <td className="px-4 py-2.5 capitalize" style={{color: T.secondaryText}}>{p.soil}</td>
                      <td className="px-4 py-2.5">
                        <span className="text-[10px] px-2 py-0.5 rounded font-data font-medium capitalize"
                          style={{background:tag.bg, color:tag.text, border:`1px solid ${tag.border}`}}>
                          {p.season}
                        </span>
                      </td>
                      <td className="px-4 py-2.5" style={{color: T.secondaryText}}>{p.weather}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-10 h-0.5 rounded-full overflow-hidden" style={{background: T.trackBg}}>
                            <div className="h-full rounded-full" style={{width:`${p.conf}%`, background:'#4ade80', boxShadow: dark ? '0 0 4px #4ade8060' : 'none'}} />
                          </div>
                          <span className="font-data font-medium" style={{color: dark ? '#4ade80' : '#15803d'}}>{p.conf}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 font-data text-[10px]" style={{color: T.dimText}}>{p.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ══ ROW 4: Quick actions — WebGL Shader Cards ══ */}
      <AgriShaderCards />

      {/* ══ ROW 5: Live weather ══ */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-display text-[13px] font-semibold" style={{color: T.primaryText}}>Live Weather Feed</p>
            <p className="text-[11px] mt-0.5" style={{color: T.accentText}}>Updates every 2.5 seconds</p>
          </div>
          <span className="flex items-center gap-1.5 font-data text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{
              color: dark ? '#4ade80' : '#15803d',
              background: dark ? 'rgba(74,222,128,0.08)' : 'rgba(22,163,74,0.1)',
              border: dark ? '1px solid rgba(74,222,128,0.15)' : '1px solid rgba(22,163,74,0.25)',
            }}>
            <Activity size={10} className="animate-pulse" /> Live
          </span>
        </div>
        <WeatherStrip />
      </Card>

    </div>
  );
}
