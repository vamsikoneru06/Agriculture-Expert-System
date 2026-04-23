import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { MdPlayArrow, MdStop, MdRefresh, MdThermostat, MdCloud, MdWaterDrop, MdEco } from 'react-icons/md';

/* ── SVG Radial Gauge ── */
function Gauge({ value, max, label, unit, color, icon: Icon }) {
  const pct    = Math.min(value / max, 1);
  const radius = 54;
  const circ   = 2 * Math.PI * radius;
  const arc    = circ * 0.75; // 270° sweep
  const offset = arc - pct * arc;

  return (
    <div className="card flex flex-col items-center p-4">
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">{label}</p>
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-[135deg]">
          {/* Track */}
          <circle cx="60" cy="60" r={radius} fill="none" strokeWidth="12"
            stroke="#e2e8f0" strokeDasharray={`${arc} ${circ - arc}`} strokeLinecap="round" />
          {/* Fill */}
          <circle cx="60" cy="60" r={radius} fill="none" strokeWidth="12"
            stroke={color}
            strokeDasharray={`${arc - offset} ${circ - (arc - offset)}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon size={20} style={{ color }} />
          <p className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1">{value}</p>
          <p className="text-xs text-slate-400">{unit}</p>
        </div>
      </div>
      {/* Mini progress bar */}
      <div className="w-full mt-2">
        <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct * 100}%`, background: color }} />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-0.5">
          <span>0</span><span>{max}{unit}</span>
        </div>
      </div>
    </div>
  );
}

/* Classify conditions from simulated values */
function classifyConditions(data) {
  const temp  = data.temperature;
  const hum   = data.humidity;
  const rain  = data.rainfall;
  const soil  = data.soilMoisture;

  const soilType = soil > 70 ? 'clay' : soil > 50 ? 'loamy' : 'sandy';
  const weather  = rain > 30 ? 'rainy' : hum > 75 ? 'humid' : temp > 35 ? 'hot' : hum < 40 ? 'dry' : 'cool';
  const month    = new Date().getMonth() + 1;
  const season   = month >= 6 && month <= 10 ? 'kharif' : month >= 11 || month <= 3 ? 'rabi' : 'zaid';

  return { soilType, weather, season };
}

/* Determine crop suitability text */
function getCropSuitability(data) {
  const { weather, season } = classifyConditions(data);
  const cropMap = {
    rainy:  { kharif: 'Rice / Jute', rabi: 'Barley',    zaid: 'Cucumber' },
    humid:  { kharif: 'Rice',        rabi: 'Mustard',   zaid: 'Brinjal'  },
    hot:    { kharif: 'Cotton / Maize', rabi: 'Wheat',  zaid: 'Tomato'   },
    dry:    { kharif: 'Pearl Millet', rabi: 'Wheat',    zaid: 'Sunflower' },
    cool:   { kharif: 'Maize',       rabi: 'Potato',    zaid: 'Watermelon'},
  };
  return cropMap[weather]?.[season] || 'Pearl Millet';
}

export default function Simulation() {
  const [running, setRunning] = useState(false);
  const [tick, setTick]       = useState(0);
  const [data,  setData]      = useState({
    temperature:  28, humidity: 62, rainfall: 8, soilMoisture: 45,
  });
  const [history, setHistory] = useState([]);
  const [speed,   setSpeed]   = useState(1500); // ms per tick
  const intervalRef = useRef(null);

  const generateNext = useCallback((prev) => ({
    temperature:   Math.round(Math.max(10, Math.min(50, prev.temperature   + (Math.random() - 0.45) * 3))),
    humidity:      Math.round(Math.max(15, Math.min(98, prev.humidity      + (Math.random() - 0.5)  * 4))),
    rainfall:      Math.round(Math.max(0,  Math.min(60, prev.rainfall      + (Math.random() - 0.4)  * 5))),
    soilMoisture:  Math.round(Math.max(10, Math.min(90, prev.soilMoisture  + (Math.random() - 0.5)  * 3))),
  }), []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTick(t => t + 1);
        setData(prev => {
          const next = generateNext(prev);
          setHistory(h => [...h.slice(-29), {
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            ...next,
          }]);
          return next;
        });
      }, speed);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, speed, generateNext]);

  const handleStart = () => { setHistory([]); setTick(0); setRunning(true); };
  const handleStop  = () => setRunning(false);
  const handleReset = () => {
    setRunning(false);
    setTick(0);
    setHistory([]);
    setData({ temperature: 28, humidity: 62, rainfall: 8, soilMoisture: 45 });
  };

  const conditions  = classifyConditions(data);
  const cropSuggest = getCropSuitability(data);

  return (
    <div className="space-y-6 fade-in">
      {/* ── Header controls ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="section-title">Environmental Simulation</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Real-time dynamic simulation of agricultural environmental conditions
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Speed control */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-xl px-3 py-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">Speed</span>
            <select
              value={speed}
              onChange={e => setSpeed(Number(e.target.value))}
              className="bg-transparent text-sm text-slate-700 dark:text-slate-200 outline-none"
            >
              <option value={3000}>Slow</option>
              <option value={1500}>Normal</option>
              <option value={700}>Fast</option>
            </select>
          </div>
          {!running ? (
            <button onClick={handleStart} className="btn-primary flex items-center gap-2">
              <MdPlayArrow size={20} /> Start Simulation
            </button>
          ) : (
            <button onClick={handleStop} className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2">
              <MdStop size={20} /> Stop
            </button>
          )}
          <button onClick={handleReset} className="btn-secondary flex items-center gap-2">
            <MdRefresh size={18} /> Reset
          </button>
        </div>
      </div>

      {/* ── Status bar ── */}
      <div className={`rounded-xl px-4 py-3 flex items-center justify-between text-sm font-medium
        ${running ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700'
                  : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${running ? 'bg-primary-500 animate-pulse' : 'bg-slate-400'}`} />
          <span className={running ? 'text-primary-700 dark:text-primary-300' : 'text-slate-500'}>
            {running ? `Simulation running — Tick #${tick}` : 'Simulation stopped'}
          </span>
        </div>
        <div className="flex gap-3 text-xs">
          <span className="badge bg-blue-100 text-blue-700">Soil: {conditions.soilType}</span>
          <span className="badge bg-yellow-100 text-yellow-700">Weather: {conditions.weather}</span>
          <span className="badge bg-green-100 text-green-700">Season: {conditions.season}</span>
        </div>
      </div>

      {/* ── Gauges ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Gauge value={data.temperature}  max={50} label="Temperature"  unit="°C" color="#f97316" icon={MdThermostat} />
        <Gauge value={data.humidity}     max={100} label="Humidity"    unit="%"  color="#3b82f6" icon={MdCloud}      />
        <Gauge value={data.rainfall}     max={60}  label="Rainfall"    unit="mm" color="#06b6d4" icon={MdWaterDrop}  />
        <Gauge value={data.soilMoisture} max={90}  label="Soil Moisture" unit="%" color="#22c55e" icon={MdEco}       />
      </div>

      {/* ── Trend chart ── */}
      {history.length > 1 && (
        <div className="card">
          <h3 className="section-title text-base mb-4">Trend Analysis</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Legend />
              <Line type="monotone" dataKey="temperature"  stroke="#f97316" strokeWidth={2} dot={false} name="Temp (°C)"     />
              <Line type="monotone" dataKey="humidity"     stroke="#3b82f6" strokeWidth={2} dot={false} name="Humidity (%)"  />
              <Line type="monotone" dataKey="rainfall"     stroke="#06b6d4" strokeWidth={2} dot={false} name="Rainfall (mm)" />
              <Line type="monotone" dataKey="soilMoisture" stroke="#22c55e" strokeWidth={2} dot={false} name="Soil Moist.(%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ── Crop suitability summary ── */}
      <div className="card bg-gradient-to-r from-primary-50 to-green-50 dark:from-primary-900/20 dark:to-green-900/20 border-primary-200 dark:border-primary-700">
        <h3 className="section-title text-base mb-3">🌾 Crop Suitability Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/60 dark:bg-white/5 rounded-xl p-3">
            <p className="text-xs text-slate-500 mb-1">Current Conditions</p>
            <p className="font-semibold text-slate-700 dark:text-slate-200 capitalize">
              {conditions.weather} weather, {conditions.soilType} soil
            </p>
          </div>
          <div className="bg-white/60 dark:bg-white/5 rounded-xl p-3">
            <p className="text-xs text-slate-500 mb-1">Detected Season</p>
            <p className="font-semibold text-slate-700 dark:text-slate-200 capitalize">{conditions.season}</p>
          </div>
          <div className="bg-primary-100/60 dark:bg-primary-800/30 rounded-xl p-3">
            <p className="text-xs text-primary-600 dark:text-primary-400 mb-1 font-medium">Suggested Crop</p>
            <p className="font-bold text-primary-800 dark:text-primary-100 text-lg">🌿 {cropSuggest}</p>
          </div>
        </div>

        {/* Suitability bars */}
        <div className="mt-4 space-y-2">
          {[
            { label: 'Temperature Suitability', pct: Math.round(100 - Math.abs(data.temperature - 28) * 2) },
            { label: 'Humidity Suitability',    pct: Math.round(100 - Math.abs(data.humidity - 65))          },
            { label: 'Soil Moisture Level',     pct: data.soilMoisture                                       },
          ].map(bar => (
            <div key={bar.label}>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span>{bar.label}</span>
                <span>{Math.max(0, Math.min(100, bar.pct))}%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(0, Math.min(100, bar.pct))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
