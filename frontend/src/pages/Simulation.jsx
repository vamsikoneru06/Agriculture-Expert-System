import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { Play, Square, RotateCcw, Thermometer, Droplets, CloudRain, Leaf, Activity } from 'lucide-react';

function Gauge({ value, max, label, unit, hexColor, icon: Icon }) {
  const pct    = Math.min(value / max, 1);
  const radius = 52;
  const circ   = 2 * Math.PI * radius;
  const arc    = circ * 0.75;
  const offset = arc - pct * arc;
  return (
    <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex flex-col items-center hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200">
      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">{label}</p>
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-[135deg]">
          <circle cx="60" cy="60" r={radius} fill="none" strokeWidth="8"
            stroke="rgba(0,0,0,0.06)" className="dark:[stroke:rgba(255,255,255,0.05)]"
            strokeDasharray={`${arc} ${circ-arc}`} strokeLinecap="round" />
          <circle cx="60" cy="60" r={radius} fill="none" strokeWidth="8"
            stroke={hexColor}
            strokeDasharray={`${arc-offset} ${circ-(arc-offset)}`}
            strokeLinecap="round"
            style={{ transition:'stroke-dasharray 0.6s ease', filter:`drop-shadow(0 0 4px ${hexColor}60)` }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon size={16} style={{color:hexColor}} />
          <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{value}</p>
          <p className="text-[10px] text-zinc-400 font-medium">{unit}</p>
        </div>
      </div>
      <div className="w-full mt-3">
        <div className="h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-600"
            style={{width:`${pct*100}%`,background:hexColor,boxShadow:`0 0 6px ${hexColor}50`}} />
        </div>
        <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
          <span>0</span><span>{max}{unit}</span>
        </div>
      </div>
    </div>
  );
}

function classifyConditions(d) {
  const soilType = d.soilMoisture>70?'clay':d.soilMoisture>50?'loamy':'sandy';
  const weather  = d.rainfall>30?'rainy':d.humidity>75?'humid':d.temperature>35?'hot':d.humidity<40?'dry':'cool';
  const m = new Date().getMonth()+1;
  const season = m>=6&&m<=10?'kharif':m>=11||m<=3?'rabi':'zaid';
  return { soilType, weather, season };
}

function getCrop(d) {
  const { weather, season } = classifyConditions(d);
  const map = {
    rainy:{ kharif:'Rice / Jute',    rabi:'Barley',   zaid:'Cucumber'   },
    humid:{ kharif:'Rice',           rabi:'Mustard',  zaid:'Brinjal'    },
    hot:  { kharif:'Cotton / Maize', rabi:'Wheat',    zaid:'Tomato'     },
    dry:  { kharif:'Pearl Millet',   rabi:'Wheat',    zaid:'Sunflower'  },
    cool: { kharif:'Maize',          rabi:'Potato',   zaid:'Watermelon' },
  };
  return map[weather]?.[season] || 'Pearl Millet';
}

function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-2.5 shadow-xl text-[11px]">
      <p className="font-semibold text-zinc-700 dark:text-zinc-300 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{color:p.color}} className="font-medium">{p.name}: {p.value}</p>
      ))}
    </div>
  );
}

export default function Simulation() {
  const { dark } = useTheme();
  const [running, setRunning] = useState(false);
  const [tick,    setTick]    = useState(0);
  const [data,    setData]    = useState({ temperature:28, humidity:62, rainfall:8, soilMoisture:45 });
  const [history, setHistory] = useState([]);
  const [speed,   setSpeed]   = useState(1500);
  const iRef = useRef(null);

  const next = useCallback(p => ({
    temperature:  Math.round(Math.max(10,Math.min(50,p.temperature +(Math.random()-.45)*3))),
    humidity:     Math.round(Math.max(15,Math.min(98,p.humidity    +(Math.random()-.5)*4))),
    rainfall:     Math.round(Math.max(0, Math.min(60,p.rainfall    +(Math.random()-.4)*5))),
    soilMoisture: Math.round(Math.max(10,Math.min(90,p.soilMoisture+(Math.random()-.5)*3))),
  }), []);

  useEffect(() => {
    if (running) {
      iRef.current = setInterval(() => {
        setTick(t=>t+1);
        setData(p => {
          const n = next(p);
          setHistory(h => [...h.slice(-29), {
            time:new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit'}), ...n,
          }]);
          return n;
        });
      }, speed);
    }
    return () => clearInterval(iRef.current);
  }, [running, speed, next]);

  const start = () => { setHistory([]); setTick(0); setRunning(true); };
  const stop  = () => setRunning(false);
  const reset = () => { setRunning(false); setTick(0); setHistory([]); setData({temperature:28,humidity:62,rainfall:8,soilMoisture:45}); };

  const cond = classifyConditions(data);
  const crop = getCrop(data);

  const bars = [
    { label:'Temperature', pct:Math.round(100-Math.abs(data.temperature-28)*2), color:'bg-orange-400' },
    { label:'Humidity',    pct:Math.round(100-Math.abs(data.humidity-65)),       color:'bg-blue-400'   },
    { label:'Soil Moist.', pct:data.soilMoisture,                                color:'bg-green-400'  },
  ];

  return (
    <div className="space-y-5 fade-in">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Environmental Simulation</h2>
          <p className="text-[12px] text-zinc-500 mt-0.5">Real-time dynamic agricultural environment modeling</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 h-9 px-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-[12px]">
            <span className="text-zinc-500 font-semibold">Speed</span>
            <select value={speed} onChange={e=>setSpeed(Number(e.target.value))}
              className="bg-transparent text-zinc-800 dark:text-zinc-200 outline-none cursor-pointer font-semibold text-[12px]">
              <option value={3000} className="bg-white dark:bg-zinc-900">Slow</option>
              <option value={1500} className="bg-white dark:bg-zinc-900">Normal</option>
              <option value={700}  className="bg-white dark:bg-zinc-900">Fast</option>
            </select>
          </div>
          {!running
            ? <button onClick={start} className="flex items-center gap-1.5 px-4 h-9 rounded-xl font-bold text-white text-[12px] bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 transition-all shadow-glow-sm"><Play size={14}/> Start</button>
            : <button onClick={stop}  className="flex items-center gap-1.5 px-4 h-9 rounded-xl font-bold text-white text-[12px] bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 transition-all"><Square size={14}/> Stop</button>
          }
          <button onClick={reset} className="flex items-center gap-1.5 px-3.5 h-9 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all text-[12px] font-semibold">
            <RotateCcw size={13}/> Reset
          </button>
        </div>
      </div>

      {/* ── Status strip ── */}
      <div className={`rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border text-[12px] transition-all ${
        running ? 'bg-green-50 dark:bg-green-500/[0.06] border-green-100 dark:border-green-500/15'
                : 'bg-zinc-50 dark:bg-zinc-900/40 border-zinc-100 dark:border-zinc-800'
      }`}>
        <div className="flex items-center gap-2">
          {running
            ? <Activity size={14} className="text-green-500 animate-pulse" />
            : <div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          }
          <span className={`font-medium ${running ? 'text-green-700 dark:text-green-400' : 'text-zinc-500'}`}>
            {running ? `Running · Tick #${tick}` : 'Stopped · Press Start to begin'}
          </span>
        </div>
        <div className="flex gap-1.5">
          {[{v:cond.soilType,c:'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'},
            {v:cond.weather, c:'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'},
            {v:cond.season,  c:'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400'},
          ].map(b=>(
            <span key={b.v} className={`text-[10px] px-2 py-0.5 rounded-md font-bold capitalize ${b.c}`}>{b.v}</span>
          ))}
        </div>
      </div>

      {/* ── Gauges ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Gauge value={data.temperature}  max={50}  label="Temperature"   unit="°C" hexColor="#f97316" icon={Thermometer} />
        <Gauge value={data.humidity}     max={100} label="Humidity"      unit="%"  hexColor="#3b82f6" icon={Droplets}    />
        <Gauge value={data.rainfall}     max={60}  label="Rainfall"      unit="mm" hexColor="#06b6d4" icon={CloudRain}   />
        <Gauge value={data.soilMoisture} max={90}  label="Soil Moisture" unit="%"  hexColor="#22c55e" icon={Leaf}        />
      </div>

      {/* ── Chart ── */}
      {history.length > 1 && (
        <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100">Live Trend</p>
            <span className="flex items-center gap-1.5 text-[11px] text-green-600 dark:text-green-400 font-bold">
              <Activity size={11} className="animate-pulse" /> Real-time
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={history} margin={{top:4,right:4,bottom:0,left:-24}}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark?'rgba(255,255,255,0.04)':'rgba(0,0,0,0.04)'} />
              <XAxis dataKey="time" tick={{fontSize:10,fill:dark?'#71717a':'#a1a1aa'}} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{fontSize:10,fill:dark?'#71717a':'#a1a1aa'}} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Line type="monotone" dataKey="temperature"  stroke="#f97316" strokeWidth={1.5} dot={false} name="Temp °C"    />
              <Line type="monotone" dataKey="humidity"     stroke="#3b82f6" strokeWidth={1.5} dot={false} name="Humidity %"  />
              <Line type="monotone" dataKey="rainfall"     stroke="#06b6d4" strokeWidth={1.5} dot={false} name="Rain mm"     />
              <Line type="monotone" dataKey="soilMoisture" stroke="#22c55e" strokeWidth={1.5} dot={false} name="Soil %"      />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {[['Temp','#f97316'],['Humidity','#3b82f6'],['Rainfall','#06b6d4'],['Soil','#22c55e']].map(([l,c])=>(
              <span key={l} className="flex items-center gap-1 text-[10px] text-zinc-500 font-medium">
                <span className="w-4 h-0.5 inline-block rounded-full" style={{background:c}} />{l}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Suitability ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label:'Current Conditions', value:`${cond.weather} · ${cond.soilType} soil`, highlight:false },
          { label:'Detected Season',    value:cond.season,                                highlight:false },
          { label:'Recommended Crop',   value:crop,                                       highlight:true  },
        ].map(item => (
          <div key={item.label} className={`rounded-2xl border p-4 ${
            item.highlight
              ? 'bg-gradient-to-br from-green-600 to-emerald-700 border-transparent text-white shadow-glow-sm'
              : 'bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800'
          }`}>
            <p className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${item.highlight ? 'text-green-200' : 'text-zinc-500'}`}>{item.label}</p>
            <p className={`font-bold capitalize text-base ${item.highlight ? 'text-white' : 'text-zinc-900 dark:text-zinc-100'}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Suitability bars */}
      <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
        <p className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100 mb-4">Suitability Analysis</p>
        <div className="space-y-4">
          {bars.map(b => {
            const pct = Math.max(0,Math.min(100,b.pct));
            return (
              <div key={b.label}>
                <div className="flex justify-between text-[12px] font-semibold mb-1.5">
                  <span className="text-zinc-600 dark:text-zinc-400">{b.label}</span>
                  <span className="text-zinc-900 dark:text-zinc-100">{pct}%</span>
                </div>
                <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className={`h-full ${b.color} rounded-full transition-all duration-500`} style={{width:`${pct}%`}} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
