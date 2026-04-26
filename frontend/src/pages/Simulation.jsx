import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { Play, Square, RotateCcw, Thermometer, Droplets, CloudRain, Leaf } from 'lucide-react';

function Gauge({ value, max, label, unit, hexColor, icon: Icon, glowClass }) {
  const pct    = Math.min(value / max, 1);
  const radius = 54;
  const circ   = 2 * Math.PI * radius;
  const arc    = circ * 0.75;
  const offset = arc - pct * arc;
  return (
    <div className={`bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] rounded-2xl flex flex-col items-center p-5 shadow-sm hover:shadow-md transition-all ${glowClass}`}>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">{label}</p>
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-[135deg]">
          <circle cx="60" cy="60" r={radius} fill="none" strokeWidth="10"
            stroke="rgba(0,0,0,0.06)"
            strokeDasharray={`${arc} ${circ - arc}`} strokeLinecap="round" />
          <circle cx="60" cy="60" r={radius} fill="none" strokeWidth="10"
            stroke={hexColor}
            strokeDasharray={`${arc - offset} ${circ - (arc - offset)}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.5s ease', filter: `drop-shadow(0 0 6px ${hexColor}60)` }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon size={18} style={{ color: hexColor }} />
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{unit}</p>
        </div>
      </div>
      <div className="w-full mt-3">
        <div className="h-1.5 bg-slate-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct * 100}%`, background: hexColor, boxShadow: `0 0 6px ${hexColor}80` }} />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-600 mt-1 font-medium">
          <span>0</span><span>{max}{unit}</span>
        </div>
      </div>
    </div>
  );
}

function classifyConditions(data) {
  const { temperature: temp, humidity: hum, rainfall: rain, soilMoisture: soil } = data;
  const soilType = soil > 70 ? 'clay' : soil > 50 ? 'loamy' : 'sandy';
  const weather  = rain > 30 ? 'rainy' : hum > 75 ? 'humid' : temp > 35 ? 'hot' : hum < 40 ? 'dry' : 'cool';
  const month    = new Date().getMonth() + 1;
  const season   = month >= 6 && month <= 10 ? 'kharif' : month >= 11 || month <= 3 ? 'rabi' : 'zaid';
  return { soilType, weather, season };
}

function getCropSuitability(data) {
  const { weather, season } = classifyConditions(data);
  const cropMap = {
    rainy: { kharif: 'Rice / Jute',    rabi: 'Barley',   zaid: 'Cucumber'   },
    humid: { kharif: 'Rice',           rabi: 'Mustard',  zaid: 'Brinjal'    },
    hot:   { kharif: 'Cotton / Maize', rabi: 'Wheat',    zaid: 'Tomato'     },
    dry:   { kharif: 'Pearl Millet',   rabi: 'Wheat',    zaid: 'Sunflower'  },
    cool:  { kharif: 'Maize',          rabi: 'Potato',   zaid: 'Watermelon' },
  };
  return cropMap[weather]?.[season] || 'Pearl Millet';
}

export default function Simulation() {
  const { dark } = useTheme();
  const [running, setRunning] = useState(false);
  const [tick,    setTick]    = useState(0);
  const [data,    setData]    = useState({ temperature: 28, humidity: 62, rainfall: 8, soilMoisture: 45 });
  const [history, setHistory] = useState([]);
  const [speed,   setSpeed]   = useState(1500);
  const intervalRef = useRef(null);

  const generateNext = useCallback((prev) => ({
    temperature:  Math.round(Math.max(10, Math.min(50, prev.temperature  + (Math.random() - 0.45) * 3))),
    humidity:     Math.round(Math.max(15, Math.min(98, prev.humidity     + (Math.random() - 0.5)  * 4))),
    rainfall:     Math.round(Math.max(0,  Math.min(60, prev.rainfall     + (Math.random() - 0.4)  * 5))),
    soilMoisture: Math.round(Math.max(10, Math.min(90, prev.soilMoisture + (Math.random() - 0.5)  * 3))),
  }), []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTick(t => t + 1);
        setData(prev => {
          const next = generateNext(prev);
          setHistory(h => [...h.slice(-29), {
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }), ...next,
          }]);
          return next;
        });
      }, speed);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, speed, generateNext]);

  const handleStart = () => { setHistory([]); setTick(0); setRunning(true); };
  const handleStop  = () => setRunning(false);
  const handleReset = () => { setRunning(false); setTick(0); setHistory([]); setData({ temperature: 28, humidity: 62, rainfall: 8, soilMoisture: 45 }); };

  const conditions  = classifyConditions(data);
  const cropSuggest = getCropSuitability(data);

  const suitabilityBars = [
    { label: 'Temperature Suitability', pct: Math.round(100 - Math.abs(data.temperature - 28) * 2), color: 'bg-orange-500' },
    { label: 'Humidity Suitability',    pct: Math.round(100 - Math.abs(data.humidity - 65)),         color: 'bg-blue-500'   },
    { label: 'Soil Moisture Level',     pct: data.soilMoisture,                                       color: 'bg-green-500'  },
  ];

  const tt = dark
    ? { backgroundColor: '#0d1117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#e2e8f0' }
    : { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#1e293b', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' };

  return (
    <div className="space-y-5 fade-in">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Environmental Simulation</h2>
          <p className="text-slate-500 dark:text-slate-500 text-sm mt-0.5">Real-time dynamic simulation of agricultural environmental conditions</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 h-10 px-3 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] rounded-xl shadow-sm">
            <span className="text-xs text-slate-500 font-semibold">Speed</span>
            <select value={speed} onChange={e => setSpeed(Number(e.target.value))}
              className="bg-transparent text-sm text-slate-800 dark:text-white outline-none cursor-pointer font-semibold">
              <option value={3000} className="bg-white dark:bg-[#0d1117]">Slow</option>
              <option value={1500} className="bg-white dark:bg-[#0d1117]">Normal</option>
              <option value={700}  className="bg-white dark:bg-[#0d1117]">Fast</option>
            </select>
          </div>
          {!running
            ? <button onClick={handleStart} className="flex items-center gap-2 px-5 h-10 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 transition-all shadow-md shadow-green-500/20"><Play size={16} /> Start Simulation</button>
            : <button onClick={handleStop}  className="flex items-center gap-2 px-5 h-10 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 transition-all shadow-md shadow-rose-500/20"><Square size={16} /> Stop</button>
          }
          <button onClick={handleReset} className="flex items-center gap-2 px-4 h-10 rounded-xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-all text-sm font-semibold shadow-sm">
            <RotateCcw size={15} /> Reset
          </button>
        </div>
      </div>

      {/* ── Status Bar ── */}
      <div className={`rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-2 border transition-all ${
        running
          ? 'bg-green-50 dark:bg-green-500/5 border-green-200 dark:border-green-500/20'
          : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06]'
      }`}>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${running ? 'bg-green-500 animate-pulse' : 'bg-slate-400 dark:bg-slate-600'}`} />
          <span className={`text-sm font-medium ${running ? 'text-green-700 dark:text-green-400' : 'text-slate-500'}`}>
            {running ? `Simulation running — Tick #${tick}` : 'Simulation stopped — Click Start to begin'}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            { v: conditions.soilType, cls: 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'   },
            { v: conditions.weather,  cls: 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' },
            { v: conditions.season,   cls: 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20' },
          ].map(b => (
            <span key={b.v} className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold capitalize border ${b.cls}`}>{b.v}</span>
          ))}
        </div>
      </div>

      {/* ── Gauges ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Gauge value={data.temperature}  max={50}  label="Temperature"   unit="°C" hexColor="#f97316" icon={Thermometer} glowClass="" />
        <Gauge value={data.humidity}     max={100} label="Humidity"      unit="%"  hexColor="#3b82f6" icon={Droplets}    glowClass="" />
        <Gauge value={data.rainfall}     max={60}  label="Rainfall"      unit="mm" hexColor="#06b6d4" icon={CloudRain}   glowClass="" />
        <Gauge value={data.soilMoisture} max={90}  label="Soil Moisture" unit="%"  hexColor="#22c55e" icon={Leaf}        glowClass="" />
      </div>

      {/* ── Trend Chart ── */}
      {history.length > 1 && (
        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Live Trend Analysis</h3>
            <span className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-bold">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Real-time
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: dark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 10, fill: dark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tt} />
              <Line type="monotone" dataKey="temperature"  stroke="#f97316" strokeWidth={2} dot={false} name="Temp (°C)"       />
              <Line type="monotone" dataKey="humidity"     stroke="#3b82f6" strokeWidth={2} dot={false} name="Humidity (%)"    />
              <Line type="monotone" dataKey="rainfall"     stroke="#06b6d4" strokeWidth={2} dot={false} name="Rainfall (mm)"   />
              <Line type="monotone" dataKey="soilMoisture" stroke="#22c55e" strokeWidth={2} dot={false} name="Soil Moist. (%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ── Crop Suitability ── */}
      <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] rounded-2xl p-5 shadow-sm">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4">🌾 Crop Suitability Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Current Conditions', value: `${conditions.weather} weather, ${conditions.soilType} soil`, highlight: false },
            { label: 'Detected Season',    value: conditions.season,                                             highlight: false },
            { label: 'Suggested Crop 🌿',  value: cropSuggest,                                                   highlight: true  },
          ].map(item => (
            <div key={item.label} className={`border rounded-xl p-4 ${
              item.highlight
                ? 'bg-green-50 dark:bg-green-500/5 border-green-200 dark:border-green-500/20'
                : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.05]'
            }`}>
              <p className="text-[10px] text-slate-500 mb-1 capitalize font-bold uppercase tracking-wide">{item.label}</p>
              <p className={`font-bold capitalize ${item.highlight ? 'text-green-700 dark:text-green-300 text-lg' : 'text-slate-800 dark:text-slate-200'}`}>{item.value}</p>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          {suitabilityBars.map(bar => {
            const pct = Math.max(0, Math.min(100, bar.pct));
            return (
              <div key={bar.label}>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-600 dark:text-slate-400">{bar.label}</span>
                  <span className="text-slate-900 dark:text-white">{pct}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
                  <div className={`h-full ${bar.color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
