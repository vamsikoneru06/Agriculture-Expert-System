import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import {
  Play, Square, RotateCcw, Thermometer, Droplets,
  CloudRain, Leaf, Activity, MapPin, Search, X, Wind, Loader2,
} from 'lucide-react';
import { INDIAN_LOCATIONS } from '../data/indianLocations';
import { fetchWeather, decodeWeatherCode } from '../services/weatherService';

/* ─────────────────────────── Gauge ─────────────────────────── */
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
          <div className="h-full rounded-full transition-all duration-700"
            style={{width:`${pct*100}%`,background:hexColor,boxShadow:`0 0 6px ${hexColor}50`}} />
        </div>
        <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
          <span>0</span><span>{max}{unit}</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Location Picker Modal ──────────────── */
function LocationPicker({ onSelect, onClose }) {
  const { dark } = useTheme();
  const [search,   setSearch]   = useState('');
  const [fetching, setFetching] = useState(null); // city name being loaded
  const [error,    setError]    = useState('');
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const filtered = INDIAN_LOCATIONS.filter(loc =>
    loc.city.toLowerCase().includes(search.toLowerCase()) ||
    loc.state.toLowerCase().includes(search.toLowerCase())
  );

  /* Group filtered list by state */
  const grouped = filtered.reduce((acc, loc) => {
    if (!acc[loc.state]) acc[loc.state] = [];
    acc[loc.state].push(loc);
    return acc;
  }, {});

  const handlePick = async (loc) => {
    setFetching(loc.city);
    setError('');
    try {
      const weather = await fetchWeather(loc.lat, loc.lng);
      onSelect(loc, weather);
    } catch (e) {
      setError('Could not fetch weather — check your internet connection.');
      setFetching(null);
    }
  };

  /* Close on backdrop click */
  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

  const T = {
    bg:      dark ? '#0f1a0f' : '#ffffff',
    border:  dark ? 'rgba(74,222,128,0.12)' : 'rgba(34,139,34,0.18)',
    header:  dark ? 'rgba(74,222,128,0.06)' : 'rgba(22,163,74,0.06)',
    inputBg: dark ? '#0a120a' : '#f0f9f0',
    inputBdr:dark ? 'rgba(74,222,128,0.15)' : 'rgba(34,139,34,0.25)',
    title:   dark ? '#d0e8d0' : '#0f2f0f',
    label:   dark ? 'rgba(74,222,128,0.4)' : 'rgba(22,101,52,0.55)',
    cityClr: dark ? 'rgba(208,232,208,0.85)' : '#1a3e1a',
    cityHov: dark ? 'rgba(74,222,128,0.07)' : 'rgba(22,163,74,0.07)',
    scrollBg:dark ? '#0a120a' : '#f8fdf8',
    divider: dark ? 'rgba(74,222,128,0.07)' : 'rgba(34,139,34,0.09)',
    errClr:  '#f87171',
    placeholder: dark ? 'rgba(180,210,180,0.35)' : 'rgba(15,47,15,0.35)',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}
      onClick={handleBackdrop}>

      <div className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{
          maxHeight: '78vh',
          background: T.bg,
          border: `1px solid ${T.border}`,
        }}>

        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between flex-shrink-0"
          style={{ background: T.header, borderBottom: `1px solid ${T.border}` }}>
          <div className="flex items-center gap-2.5">
            <MapPin size={16} style={{ color: dark ? '#4ade80' : '#15803d' }} />
            <div>
              <p className="font-display text-[13px] font-bold" style={{ color: T.title }}>
                Select Indian Location
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: T.label }}>
                Live weather auto-fetched from Open-Meteo
              </p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
            style={{ color: T.label }}
            onMouseEnter={e => { e.currentTarget.style.background = T.cityHov; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
            <X size={14} />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 flex-shrink-0" style={{ borderBottom: `1px solid ${T.divider}` }}>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: T.label }} />
            <input
              ref={inputRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search city or state…"
              className="w-full text-[12px] pl-8 pr-3 py-2.5 rounded-xl outline-none transition-all"
              style={{
                background: T.inputBg,
                border: `1px solid ${T.inputBdr}`,
                color: T.title,
              }}
            />
          </div>
          {error && (
            <p className="text-[11px] mt-2 font-medium" style={{ color: T.errClr }}>
              ⚠ {error}
            </p>
          )}
        </div>

        {/* City list */}
        <div className="overflow-y-auto flex-1 py-1" style={{ background: T.scrollBg }}>
          {Object.keys(grouped).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="text-3xl mb-2">🔍</span>
              <p className="text-[12px]" style={{ color: T.label }}>No locations found</p>
            </div>
          ) : (
            Object.entries(grouped).map(([state, cities]) => (
              <div key={state}>
                <p className="px-4 pt-3 pb-1 text-[9px] font-bold uppercase tracking-[0.15em]"
                  style={{ color: T.label }}>
                  {state}
                </p>
                {cities.map(loc => {
                  const isLoading = fetching === loc.city;
                  return (
                    <button key={loc.city}
                      onClick={() => !fetching && handlePick(loc)}
                      disabled={!!fetching}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-left transition-all"
                      style={{ color: T.cityClr, opacity: fetching && !isLoading ? 0.45 : 1 }}
                      onMouseEnter={e => { if (!fetching) e.currentTarget.style.background = T.cityHov; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                      <div className="flex items-center gap-2.5">
                        <MapPin size={11} style={{ color: dark ? 'rgba(74,222,128,0.4)' : 'rgba(22,101,52,0.5)', flexShrink: 0 }} />
                        <span className="text-[12px] font-semibold">{loc.city}</span>
                      </div>
                      {isLoading ? (
                        <Loader2 size={12} className="animate-spin" style={{ color: dark ? '#4ade80' : '#15803d' }} />
                      ) : (
                        <span className="text-[9px] font-data tabular-nums"
                          style={{ color: T.label }}>
                          {loc.lat.toFixed(1)}°N
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 flex-shrink-0 flex items-center gap-2"
          style={{ borderTop: `1px solid ${T.divider}` }}>
          <span className="text-[10px]" style={{ color: T.label }}>
            🌐 Powered by{' '}
            <a href="https://open-meteo.com" target="_blank" rel="noreferrer"
              className="underline font-semibold"
              style={{ color: dark ? '#4ade80' : '#15803d' }}>
              Open-Meteo
            </a>
            {' '}— Free, no API key
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Condition helpers ───────────────────── */
function classifyConditions(d) {
  const soilType = d.soilMoisture > 70 ? 'clay' : d.soilMoisture > 50 ? 'loamy' : 'sandy';
  const weather  = d.rainfall > 30 ? 'rainy' : d.humidity > 75 ? 'humid' : d.temperature > 35 ? 'hot' : d.humidity < 40 ? 'dry' : 'cool';
  const m        = new Date().getMonth() + 1;
  const season   = m >= 6 && m <= 10 ? 'kharif' : m >= 11 || m <= 3 ? 'rabi' : 'zaid';
  return { soilType, weather, season };
}

function getCrop(d) {
  const { weather, season } = classifyConditions(d);
  const map = {
    rainy: { kharif: 'Rice / Jute',    rabi: 'Barley',   zaid: 'Cucumber'   },
    humid: { kharif: 'Rice',           rabi: 'Mustard',  zaid: 'Brinjal'    },
    hot:   { kharif: 'Cotton / Maize', rabi: 'Wheat',    zaid: 'Tomato'     },
    dry:   { kharif: 'Pearl Millet',   rabi: 'Wheat',    zaid: 'Sunflower'  },
    cool:  { kharif: 'Maize',          rabi: 'Potato',   zaid: 'Watermelon' },
  };
  return map[weather]?.[season] || 'Pearl Millet';
}

/* ─────────────────────── Chart tooltip ─────────────────────── */
function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-2.5 shadow-xl text-[11px]">
      <p className="font-semibold text-zinc-700 dark:text-zinc-300 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">{p.name}: {p.value}</p>
      ))}
    </div>
  );
}

/* ═══════════════════════ Main Component ═══════════════════════ */
const DEFAULT_DATA = { temperature: 28, humidity: 62, rainfall: 8, soilMoisture: 45 };

export default function Simulation() {
  const { dark } = useTheme();

  /* Simulation state */
  const [running,  setRunning]  = useState(false);
  const [tick,     setTick]     = useState(0);
  const [data,     setData]     = useState(DEFAULT_DATA);
  const [history,  setHistory]  = useState([]);
  const [speed,    setSpeed]    = useState(1500);
  const iRef = useRef(null);

  /* Location / weather state */
  const [locOpen,   setLocOpen]   = useState(false);
  const [location,  setLocation]  = useState(null);   // { city, state, lat, lng }
  const [liveWx,    setLiveWx]    = useState(null);   // raw weatherService result
  const [wxLoading, setWxLoading] = useState(false);

  /* Simulation tick logic */
  const next = useCallback(p => ({
    temperature:  Math.round(Math.max(10, Math.min(50, p.temperature  + (Math.random() - .45) * 3))),
    humidity:     Math.round(Math.max(15, Math.min(98, p.humidity     + (Math.random() - .5)  * 4))),
    rainfall:     Math.round(Math.max(0,  Math.min(60, p.rainfall     + (Math.random() - .4)  * 5))),
    soilMoisture: Math.round(Math.max(10, Math.min(90, p.soilMoisture + (Math.random() - .5)  * 3))),
  }), []);

  useEffect(() => {
    if (running) {
      iRef.current = setInterval(() => {
        setTick(t => t + 1);
        setData(p => {
          const n = next(p);
          setHistory(h => [...h.slice(-29), {
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            ...n,
          }]);
          return n;
        });
      }, speed);
    }
    return () => clearInterval(iRef.current);
  }, [running, speed, next]);

  const start = () => { setHistory([]); setTick(0); setRunning(true); };
  const stop  = () => setRunning(false);
  const reset = () => {
    setRunning(false); setTick(0); setHistory([]);
    setData(liveWx
      ? { temperature: liveWx.temperature, humidity: liveWx.humidity, rainfall: liveWx.rainfall, soilMoisture: liveWx.soilMoisture }
      : DEFAULT_DATA);
  };

  /* Handle location pick from modal */
  const handleLocationSelect = (loc, weather) => {
    setLocation(loc);
    setLiveWx(weather);
    setData({
      temperature:  weather.temperature,
      humidity:     weather.humidity,
      rainfall:     weather.rainfall,
      soilMoisture: weather.soilMoisture,
    });
    setHistory([]);
    setTick(0);
    setRunning(false);
    setLocOpen(false);
    setWxLoading(false);
  };

  /* Refresh weather for same location */
  const handleRefreshWeather = async () => {
    if (!location) return;
    setWxLoading(true);
    try {
      const weather = await fetchWeather(location.lat, location.lng);
      setLiveWx(weather);
      setData({
        temperature:  weather.temperature,
        humidity:     weather.humidity,
        rainfall:     weather.rainfall,
        soilMoisture: weather.soilMoisture,
      });
      setHistory([]);
      setTick(0);
      setRunning(false);
    } catch (_) { /* silently ignore */ }
    setWxLoading(false);
  };

  const cond = classifyConditions(data);
  const crop = getCrop(data);
  const wx   = liveWx ? decodeWeatherCode(liveWx.weatherCode) : null;

  const bars = [
    { label: 'Temperature', pct: Math.round(100 - Math.abs(data.temperature - 28) * 2), color: 'bg-orange-400' },
    { label: 'Humidity',    pct: Math.round(100 - Math.abs(data.humidity - 65)),         color: 'bg-blue-400'   },
    { label: 'Soil Moist.', pct: data.soilMoisture,                                      color: 'bg-green-400'  },
  ];

  return (
    <div className="space-y-5 fade-in">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Environmental Simulation</h2>
          <p className="text-[12px] text-zinc-500 mt-0.5">
            {location
              ? <>Seeded from live weather · <span className="font-semibold text-zinc-700 dark:text-zinc-300">{location.city}, {location.state}</span></>
              : 'Select an Indian location to seed with live weather data'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">

          {/* ── Location button ── */}
          <button
            onClick={() => setLocOpen(true)}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-[12px] font-semibold transition-all border"
            style={{
              background: location ? (dark ? 'rgba(74,222,128,0.1)' : 'rgba(22,163,74,0.08)') : (dark ? '#0a1a0a' : '#f0fdf0'),
              border:     location ? `1px solid ${dark ? 'rgba(74,222,128,0.3)' : 'rgba(22,163,74,0.35)'}` : (dark ? '1px solid rgba(74,222,128,0.15)' : '1px solid rgba(34,139,34,0.2)'),
              color:      dark ? (location ? '#4ade80' : 'rgba(180,210,180,0.7)') : (location ? '#15803d' : 'rgba(15,47,15,0.6)'),
            }}
            onMouseEnter={e => { e.currentTarget.style.background = dark ? 'rgba(74,222,128,0.14)' : 'rgba(22,163,74,0.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = location ? (dark ? 'rgba(74,222,128,0.1)' : 'rgba(22,163,74,0.08)') : (dark ? '#0a1a0a' : '#f0fdf0'); }}>
            <MapPin size={13} />
            {location ? `${location.city}` : 'Select Location'}
          </button>

          {/* Refresh weather — only shown when a location is selected */}
          {location && (
            <button
              onClick={handleRefreshWeather}
              disabled={wxLoading}
              title="Refresh live weather"
              className="flex items-center justify-center h-9 w-9 rounded-xl border transition-all"
              style={{
                background: dark ? '#0a1a0a' : '#f0fdf0',
                border: dark ? '1px solid rgba(74,222,128,0.15)' : '1px solid rgba(34,139,34,0.2)',
                color: dark ? 'rgba(74,222,128,0.5)' : 'rgba(22,101,52,0.6)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = dark ? 'rgba(74,222,128,0.08)' : 'rgba(22,163,74,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = dark ? '#0a1a0a' : '#f0fdf0'; }}>
              {wxLoading
                ? <Loader2 size={13} className="animate-spin" />
                : <Activity size={13} />}
            </button>
          )}

          {/* Speed */}
          <div className="flex items-center gap-2 h-9 px-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-[12px]">
            <span className="text-zinc-500 font-semibold">Speed</span>
            <select value={speed} onChange={e => setSpeed(Number(e.target.value))}
              className="bg-transparent text-zinc-800 dark:text-zinc-200 outline-none cursor-pointer font-semibold text-[12px]">
              <option value={3000} className="bg-white dark:bg-zinc-900">Slow</option>
              <option value={1500} className="bg-white dark:bg-zinc-900">Normal</option>
              <option value={700}  className="bg-white dark:bg-zinc-900">Fast</option>
            </select>
          </div>

          {/* Play / Stop */}
          {!running
            ? <button onClick={start} className="flex items-center gap-1.5 px-4 h-9 rounded-xl font-bold text-white text-[12px] bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 transition-all shadow-glow-sm">
                <Play size={14} /> Start
              </button>
            : <button onClick={stop}  className="flex items-center gap-1.5 px-4 h-9 rounded-xl font-bold text-white text-[12px] bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 transition-all">
                <Square size={14} /> Stop
              </button>
          }
          <button onClick={reset} className="flex items-center gap-1.5 px-3.5 h-9 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all text-[12px] font-semibold">
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>

      {/* ── Live weather badge (shown after location pick) ── */}
      {liveWx && location && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl px-4 py-3 border text-[12px]"
          style={{
            background: dark ? 'rgba(74,222,128,0.04)' : 'rgba(22,163,74,0.05)',
            border: dark ? '1px solid rgba(74,222,128,0.12)' : '1px solid rgba(22,163,74,0.18)',
          }}>
          <span className="text-xl">{wx?.emoji}</span>
          <div>
            <p className="font-bold" style={{ color: dark ? '#d0e8d0' : '#0f2f0f' }}>
              {location.city}, {location.state} — {wx?.desc}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: dark ? 'rgba(180,210,180,0.55)' : 'rgba(15,47,15,0.6)' }}>
              Lat {location.lat.toFixed(4)}°N · Lng {location.lng.toFixed(4)}°E · Open-Meteo live data
            </p>
          </div>
          <div className="ml-auto flex items-center gap-4 font-data text-[11px]" style={{ color: dark ? 'rgba(74,222,128,0.6)' : 'rgba(22,101,52,0.7)' }}>
            <span className="flex items-center gap-1"><Thermometer size={11} />{liveWx.temperature}°C</span>
            <span className="flex items-center gap-1"><Droplets size={11} />{liveWx.humidity}%</span>
            <span className="flex items-center gap-1"><Wind size={11} />{liveWx.windSpeed} km/h</span>
          </div>
        </div>
      )}

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
        <div className="flex flex-wrap gap-1.5">
          {location && (
            <span className="text-[10px] px-2 py-0.5 rounded-md font-bold capitalize bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 flex items-center gap-1">
              <MapPin size={9} /> {location.city}
            </span>
          )}
          {[
            { v: cond.soilType, c: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'   },
            { v: cond.weather,  c: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' },
            { v: cond.season,   c: 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400' },
          ].map(b => (
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

      {/* ── Live trend chart ── */}
      {history.length > 1 && (
        <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100">Live Trend</p>
            <span className="flex items-center gap-1.5 text-[11px] text-green-600 dark:text-green-400 font-bold">
              <Activity size={11} className="animate-pulse" /> Real-time
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={history} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: dark ? '#71717a' : '#a1a1aa' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 10, fill: dark ? '#71717a' : '#a1a1aa' }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Line type="monotone" dataKey="temperature"  stroke="#f97316" strokeWidth={1.5} dot={false} name="Temp °C"    />
              <Line type="monotone" dataKey="humidity"     stroke="#3b82f6" strokeWidth={1.5} dot={false} name="Humidity %"  />
              <Line type="monotone" dataKey="rainfall"     stroke="#06b6d4" strokeWidth={1.5} dot={false} name="Rain mm"     />
              <Line type="monotone" dataKey="soilMoisture" stroke="#22c55e" strokeWidth={1.5} dot={false} name="Soil %"      />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {[['Temp', '#f97316'], ['Humidity', '#3b82f6'], ['Rainfall', '#06b6d4'], ['Soil', '#22c55e']].map(([l, c]) => (
              <span key={l} className="flex items-center gap-1 text-[10px] text-zinc-500 font-medium">
                <span className="w-4 h-0.5 inline-block rounded-full" style={{ background: c }} />{l}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Suitability cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Current Conditions', value: `${cond.weather} · ${cond.soilType} soil`, highlight: false },
          { label: 'Detected Season',    value: cond.season,                                highlight: false },
          { label: 'Recommended Crop',   value: crop,                                       highlight: true  },
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

      {/* ── Suitability bars ── */}
      <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
        <p className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100 mb-4">Suitability Analysis</p>
        <div className="space-y-4">
          {bars.map(b => {
            const pct = Math.max(0, Math.min(100, b.pct));
            return (
              <div key={b.label}>
                <div className="flex justify-between text-[12px] font-semibold mb-1.5">
                  <span className="text-zinc-600 dark:text-zinc-400">{b.label}</span>
                  <span className="text-zinc-900 dark:text-zinc-100">{pct}%</span>
                </div>
                <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className={`h-full ${b.color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Location Picker Modal ── */}
      {locOpen && (
        <LocationPicker
          onSelect={handleLocationSelect}
          onClose={() => setLocOpen(false)}
        />
      )}
    </div>
  );
}
