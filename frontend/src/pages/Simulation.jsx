import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MdPlayArrow, MdStop, MdRefresh, MdThermostat, MdCloud, MdWaterDrop, MdEco } from 'react-icons/md';

const tt = { backgroundColor: '#0d1117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#e2e8f0' };

function Gauge({ value, max, label, unit, color, icon: Icon, glow }) {
  const pct    = Math.min(value / max, 1);
  const radius = 54;
  const circ   = 2 * Math.PI * radius;
  const arc    = circ * 0.75;
  const offset = arc - pct * arc;
  return (
    <div className={`bg-white/[0.03] border border-white/[0.08] rounded-2xl flex flex-col items-center p-5 shadow-lg ${glow}`}>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">{label}</p>
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-[135deg]">
          <circle cx="60" cy="60" r={radius} fill="none" strokeWidth="10" stroke="rgba(255,255,255,0.06)"
            strokeDasharray={`${arc} ${circ - arc}`} strokeLinecap="round" />
          <circle cx="60" cy="60" r={radius} fill="none" strokeWidth="10" stroke={color}
            strokeDasharray={`${arc - offset} ${circ - (arc - offset)}`} strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.5s ease', filter: `drop-shadow(0 0 8px ${color}60)` }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon size={20} style={{ color }} />
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          <p className="text-xs text-slate-500">{unit}</p>
        </div>
      </div>
      <div className="w-full mt-3">
        <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct * 100}%`, background: color, boxShadow: `0 0 6px ${color}80` }} />
        </div>
        <div className="flex justify-between text-xs text-slate-600 mt-1">
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
    rainy: { kharif: 'Rice / Jute',      rabi: 'Barley',     zaid: 'Cucumber'   },
    humid: { kharif: 'Rice',             rabi: 'Mustard',    zaid: 'Brinjal'    },
    hot:   { kharif: 'Cotton / Maize',   rabi: 'Wheat',      zaid: 'Tomato'     },
    dry:   { kharif: 'Pearl Millet',     rabi: 'Wheat',      zaid: 'Sunflower'  },
    cool:  { kharif: 'Maize',            rabi: 'Potato',     zaid: 'Watermelon' },
  };
  return cropMap[weather]?.[season] || 'Pearl Millet';
}

export default function Simulation() {
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

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Environmental Simulation</h2>
          <p className="text-slate-500 text-sm mt-0.5">Real-time dynamic simulation of agricultural environmental conditions</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2">
            <span className="text-xs text-slate-500">Speed</span>
            <select value={speed} onChange={e => setSpeed(Number(e.target.value))}
              className="bg-transparent text-sm text-white outline-none cursor-pointer">
              <option value={3000} className="bg-[#0d1117]">Slow</option>
              <option value={1500} className="bg-[#0d1117]">Normal</option>
              <option value={700}  className="bg-[#0d1117]">Fast</option>
            </select>
          </div>
          {!running ? (
            <button onClick={handleStart} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 transition-all shadow-lg shadow-green-900/30">
              <MdPlayArrow size={20} /> Start Simulation
            </button>
          ) : (
            <button onClick={handleStop} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 transition-all">
              <MdStop size={20} /> Stop
            </button>
          )}
          <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all text-sm font-medium">
            <MdRefresh size={18} /> Reset
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className={`rounded-xl px-4 py-3 flex items-center justify-between text-sm font-medium border transition-all
        ${running ? 'bg-green-500/5 border-green-500/20' : 'bg-white/[0.03] border-white/[0.06]'}`}>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${running ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`} />
          <span className={running ? 'text-green-400' : 'text-slate-500'}>
            {running ? `Simulation running — Tick #${tick}` : 'Simulation stopped — Click Start to begin'}
          </span>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full capitalize">{conditions.soilType} soil</span>
          <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full capitalize">{conditions.weather}</span>
          <span className="px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full capitalize">{conditions.season}</span>
        </div>
      </div>

      {/* Gauges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Gauge value={data.temperature}  max={50}  label="Temperature"   unit="°C" color="#f97316" icon={MdThermostat} glow="shadow-orange-500/10" />
        <Gauge value={data.humidity}     max={100} label="Humidity"      unit="%"  color="#3b82f6" icon={MdCloud}      glow="shadow-blue-500/10"   />
        <Gauge value={data.rainfall}     max={60}  label="Rainfall"      unit="mm" color="#06b6d4" icon={MdWaterDrop}  glow="shadow-cyan-500/10"   />
        <Gauge value={data.soilMoisture} max={90}  label="Soil Moisture" unit="%"  color="#22c55e" icon={MdEco}        glow="shadow-green-500/10"  />
      </div>

      {/* Trend Chart */}
      {history.length > 1 && (
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4">Live Trend Analysis</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tt} />
              <Line type="monotone" dataKey="temperature"  stroke="#f97316" strokeWidth={2} dot={false} name="Temp (°C)"     />
              <Line type="monotone" dataKey="humidity"     stroke="#3b82f6" strokeWidth={2} dot={false} name="Humidity (%)"  />
              <Line type="monotone" dataKey="rainfall"     stroke="#06b6d4" strokeWidth={2} dot={false} name="Rainfall (mm)" />
              <Line type="monotone" dataKey="soilMoisture" stroke="#22c55e" strokeWidth={2} dot={false} name="Soil Moist.(%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Crop Suitability */}
      <div className="bg-gradient-to-br from-green-950/40 to-emerald-950/20 border border-green-500/20 rounded-2xl p-5">
        <h3 className="text-white font-semibold mb-4">🌾 Crop Suitability Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {[
            { label: 'Current Conditions',  value: `${conditions.weather} weather, ${conditions.soilType} soil`, color: 'text-slate-200' },
            { label: 'Detected Season',     value: conditions.season,                                            color: 'text-slate-200' },
            { label: 'Suggested Crop 🌿',   value: cropSuggest,                                                  color: 'text-green-300 text-xl font-bold' },
          ].map(i => (
            <div key={i.label} className="bg-black/20 border border-white/[0.06] rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1 capitalize">{i.label}</p>
              <p className={`font-semibold capitalize ${i.color}`}>{i.value}</p>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {suitabilityBars.map(bar => {
            const pct = Math.max(0, Math.min(100, bar.pct));
            return (
              <div key={bar.label}>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>{bar.label}</span><span>{pct}%</span>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
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
