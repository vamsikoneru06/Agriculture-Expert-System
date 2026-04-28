import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
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

const ACTIONS = [
  { to:'/expert',     emoji:'🧠', label:'Expert System', sub:'IF-THEN inference',  color:'#4ade80' },
  { to:'/simulation', emoji:'🌦️', label:'Simulation',    sub:'Live environment',   color:'#fb923c' },
  { to:'/ml',         emoji:'🤖', label:'ML Prediction', sub:'Yield forecasting',  color:'#a78bfa' },
  { to:'/history',    emoji:'📋', label:'View History',  sub:'Past predictions',   color:'#60a5fa' },
];

const seasonTag = {
  Kharif: { text:'#4ade80', bg:'rgba(74,222,128,0.08)',  border:'rgba(74,222,128,0.15)'  },
  Rabi:   { text:'#60a5fa', bg:'rgba(96,165,250,0.08)',  border:'rgba(96,165,250,0.15)'  },
  Zaid:   { text:'#fbbf24', bg:'rgba(251,191,36,0.08)',  border:'rgba(251,191,36,0.15)'  },
};

/* ── Card wrapper — adapts to light/dark terra shell ── */
function Card({ className = '', style = {}, children }) {
  return (
    <div className={`rounded-2xl ${className}`}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(74,222,128,0.09)',
        backdropFilter: 'blur(8px)',
        ...style,
      }}>
      {children}
    </div>
  );
}

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
    { label:'Temperature', val:`${w.temp}°C`,  icon:'🌡️', pct:(w.temp/45)*100, bar:'#fb923c' },
    { label:'Humidity',    val:`${w.hum}%`,    icon:'💧', pct:w.hum,           bar:'#60a5fa' },
    { label:'Rainfall',    val:`${w.rain}mm`,  icon:'🌧️', pct:(w.rain/50)*100, bar:'#22d3ee' },
    { label:'Soil Moist.', val:`${w.soil}%`,   icon:'🌱', pct:w.soil,          bar:'#4ade80' },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {metrics.map(m => (
        <div key={m.label} className="rounded-xl p-3 transition-all"
          style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(74,222,128,0.07)'}}
          onMouseEnter={e => e.currentTarget.style.border = '1px solid rgba(74,222,128,0.18)'}
          onMouseLeave={e => e.currentTarget.style.border = '1px solid rgba(74,222,128,0.07)'}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-data text-[9px] uppercase tracking-[0.15em]"
              style={{color:'rgba(74,222,128,0.4)'}}>{m.label}</span>
            <span className="text-lg leading-none">{m.icon}</span>
          </div>
          <p className="font-data text-lg font-semibold mb-2 tabular-nums" style={{color:'#d0e8d0'}}>{m.val}</p>
          <div className="h-0.5 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.06)'}}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{width:`${Math.min(100,m.pct)}%`, background:m.bar, boxShadow:`0 0 6px ${m.bar}60`}} />
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
    <div className="rounded-xl p-3 shadow-2xl text-[12px]"
      style={{background:'#0a1a0a', border:'1px solid rgba(74,222,128,0.15)'}}>
      <p className="font-semibold mb-1.5" style={{color:'#d0e8d0'}}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{color:p.color}} className="font-medium">{p.name}: {p.value}</p>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour<12?'Good morning':hour<17?'Good afternoon':'Good evening';

  return (
    <div className="space-y-4 fade-in">

      {/* ══ ROW 1: Welcome + Stats ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Welcome card — aurora on terra */}
        <div className="relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between min-h-[160px]"
          style={{background:'rgba(10,26,10,0.8)', border:'1px solid rgba(74,222,128,0.15)'}}>

          {/* Aurora blobs */}
          <div className="aurora-blob-1 w-48 h-48 top-[-30%] left-[-15%]"
            style={{background:'radial-gradient(ellipse, rgba(74,222,128,0.2), transparent 70%)'}} />
          <div className="aurora-blob-2 w-40 h-40 bottom-[-20%] right-[-10%]"
            style={{background:'radial-gradient(ellipse, rgba(34,211,238,0.12), transparent 70%)'}} />

          {/* Crop-row overlay */}
          <div className="absolute inset-0 bg-crop-rows pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"
                style={{boxShadow:'0 0 6px #4ade80'}} />
              <span className="font-data text-[10px] uppercase tracking-[0.18em]"
                style={{color:'rgba(74,222,128,0.5)'}}>
                {greeting}
              </span>
            </div>
            <h2 className="text-shimmer font-display text-2xl font-bold leading-tight">{user?.name}</h2>
            <p className="text-[12px] mt-1.5" style={{color:'rgba(180,210,180,0.5)'}}>
              Smart farming decisions, powered by AI
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-2 mt-4">
            <Link to="/expert"
              className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
              style={{background:'rgba(74,222,128,0.12)', border:'1px solid rgba(74,222,128,0.25)', color:'#4ade80'}}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(74,222,128,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(74,222,128,0.12)'}>
              <Zap size={11} /> Expert System
            </Link>
            <Link to="/ml"
              className="text-[11px] font-medium px-3 py-1.5 rounded-lg transition-all"
              style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(180,210,180,0.6)'}}
              onMouseEnter={e => e.currentTarget.style.color = '#d0e8d0'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(180,210,180,0.6)'}>
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
                background:'rgba(255,255,255,0.03)',
                border:`1px solid rgba(74,222,128,0.08)`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.border = `1px solid ${s.color}30`;
                e.currentTarget.style.background = `${s.color}06`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.border = '1px solid rgba(74,222,128,0.08)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              }}>

              <div className="flex items-start justify-between mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{background:`${s.color}12`, border:`1px solid ${s.color}20`}}>
                  <s.icon size={15} style={{color:s.color}} />
                </div>
                {s.sub.includes('%') && (
                  <span className="flex items-center gap-0.5 text-[10px] font-data font-semibold px-1.5 py-0.5 rounded-full"
                    style={{background:`${s.color}12`, color:s.color}}>
                    <TrendingUp size={8} />{s.sub}
                  </span>
                )}
              </div>
              <p className="font-data text-2xl font-semibold tabular-nums" style={{color:s.color}}>{s.value}</p>
              <p className="text-[11px] mt-0.5" style={{color:'rgba(180,210,180,0.5)'}}>{s.label}</p>
              {!s.sub.includes('%') && (
                <p className="text-[10px] font-data mt-1" style={{color:`${s.color}80`}}>{s.sub}</p>
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
              <p className="font-display text-[13px] font-semibold" style={{color:'#d0e8d0'}}>Weekly Predictions</p>
              <p className="text-[11px] mt-0.5" style={{color:'rgba(74,222,128,0.4)'}}>Volume and accuracy over 7 days</p>
            </div>
            <div className="flex items-center gap-3 font-data text-[10px]" style={{color:'rgba(74,222,128,0.4)'}}>
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
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,222,128,0.06)" />
              <XAxis dataKey="day" tick={{fontSize:11,fill:'rgba(74,222,128,0.35)',fontFamily:'JetBrains Mono'}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:10,fill:'rgba(74,222,128,0.35)',fontFamily:'JetBrains Mono'}} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Area type="monotone" dataKey="predictions" stroke="#4ade80" strokeWidth={2} fill="url(#gP)" name="Predictions" dot={false} activeDot={{r:4,fill:'#4ade80',strokeWidth:0}} />
              <Area type="monotone" dataKey="accuracy"    stroke="#fbbf24" strokeWidth={2} fill="url(#gA)" name="Accuracy %" dot={false} activeDot={{r:4,fill:'#fbbf24',strokeWidth:0}} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Donut chart */}
        <Card className="p-5">
          <p className="font-display text-[13px] font-semibold mb-0.5" style={{color:'#d0e8d0'}}>Crop Distribution</p>
          <p className="text-[11px] mb-3" style={{color:'rgba(74,222,128,0.4)'}}>By prediction volume</p>
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
                <span style={{color:'rgba(180,210,180,0.5)'}}>{c.name} <b style={{color:'#d0e8d0'}}>{c.value}%</b></span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ══ ROW 3: Soil chart + Recent table ══ */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Soil bar chart */}
        <Card className="p-5">
          <p className="font-display text-[13px] font-semibold mb-4" style={{color:'#d0e8d0'}}>Soil Type Usage</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={soilData} layout="vertical" margin={{top:0,right:8,bottom:0,left:-10}}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,222,128,0.06)" />
              <XAxis type="number" tick={{fontSize:10,fill:'rgba(74,222,128,0.35)',fontFamily:'JetBrains Mono'}} axisLine={false} tickLine={false} />
              <YAxis dataKey="soil" type="category" tick={{fontSize:11,fill:'rgba(180,210,180,0.5)'}} width={42} axisLine={false} tickLine={false} />
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
          style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(74,222,128,0.09)'}}>
          <div className="flex items-center justify-between px-5 pt-4 pb-3"
            style={{borderBottom:'1px solid rgba(74,222,128,0.07)'}}>
            <div>
              <p className="font-display text-[13px] font-semibold" style={{color:'#d0e8d0'}}>Recent Predictions</p>
              <p className="text-[11px] mt-0.5" style={{color:'rgba(74,222,128,0.4)'}}>Latest expert & ML results</p>
            </div>
            <Link to="/history" className="flex items-center gap-1 text-[11px] font-semibold transition-colors"
              style={{color:'rgba(74,222,128,0.6)'}}
              onMouseEnter={e => e.currentTarget.style.color = '#4ade80'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(74,222,128,0.6)'}>
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr style={{borderBottom:'1px solid rgba(74,222,128,0.07)'}}>
                  {['Crop','Soil','Season','Weather','Conf.','Date'].map(h=>(
                    <th key={h} className="px-4 py-2.5 text-left font-data font-medium"
                      style={{color:'rgba(74,222,128,0.3)', fontSize:'9px', letterSpacing:'0.12em', textTransform:'uppercase'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map(p => {
                  const tag = seasonTag[p.season] || {};
                  return (
                    <tr key={p.id} className="transition-colors"
                      style={{borderBottom:'1px solid rgba(74,222,128,0.04)'}}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(74,222,128,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td className="px-4 py-2.5 font-semibold" style={{color:'#d0e8d0'}}>{p.crop}</td>
                      <td className="px-4 py-2.5 capitalize" style={{color:'rgba(180,210,180,0.5)'}}>{p.soil}</td>
                      <td className="px-4 py-2.5">
                        <span className="text-[10px] px-2 py-0.5 rounded font-data font-medium capitalize"
                          style={{background:tag.bg, color:tag.text, border:`1px solid ${tag.border}`}}>
                          {p.season}
                        </span>
                      </td>
                      <td className="px-4 py-2.5" style={{color:'rgba(180,210,180,0.5)'}}>{p.weather}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-10 h-0.5 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.06)'}}>
                            <div className="h-full rounded-full" style={{width:`${p.conf}%`, background:'#4ade80', boxShadow:'0 0 4px #4ade8060'}} />
                          </div>
                          <span className="font-data font-medium" style={{color:'#4ade80'}}>{p.conf}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 font-data text-[10px]" style={{color:'rgba(74,222,128,0.3)'}}>{p.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ══ ROW 4: Quick actions ══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {ACTIONS.map((a, i) => (
          <Link key={a.to} to={a.to}
            className={`fade-in-${i+1} group relative overflow-hidden rounded-2xl p-4 transition-all duration-200 hover:-translate-y-0.5`}
            style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(74,222,128,0.08)'}}
            onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${a.color}30`; e.currentTarget.style.background = `${a.color}06`; }}
            onMouseLeave={e => { e.currentTarget.style.border = '1px solid rgba(74,222,128,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}>
            {/* Corner glow */}
            <div className="absolute bottom-0 right-0 w-20 h-20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 blur-2xl"
              style={{background:`${a.color}25`}} />
            <span className="text-2xl mb-3 block">{a.emoji}</span>
            <p className="font-display text-[13px] font-semibold" style={{color:'#d0e8d0'}}>{a.label}</p>
            <p className="text-[11px] mt-0.5" style={{color:'rgba(180,210,180,0.4)'}}>{a.sub}</p>
            <div className="flex items-center gap-0.5 mt-3 text-[11px] font-semibold group-hover:gap-1.5 transition-all"
              style={{color:a.color}}>
              Open <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* ══ ROW 5: Live weather ══ */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-display text-[13px] font-semibold" style={{color:'#d0e8d0'}}>Live Weather Feed</p>
            <p className="text-[11px] mt-0.5" style={{color:'rgba(74,222,128,0.4)'}}>Updates every 2.5 seconds</p>
          </div>
          <span className="flex items-center gap-1.5 font-data text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{color:'#4ade80', background:'rgba(74,222,128,0.08)', border:'1px solid rgba(74,222,128,0.15)'}}>
            <Activity size={10} className="animate-pulse" /> Live
          </span>
        </div>
        <WeatherStrip />
      </Card>

    </div>
  );
}
