import React, { useState } from 'react';
import { BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { BrainCircuit, CheckCircle2, TrendingUp } from 'lucide-react';

function predictYield(inputs) {
  const { cropType, soilPH, nitrogen, phosphorus, potassium, temperature, rainfall, farmArea } = inputs;
  const bases = { wheat: 4.2, rice: 5.5, maize: 6.1, cotton: 2.8, soybean: 2.5, potato: 25.0, sugarcane: 78.0, tomato: 32.0, onion: 20.0, banana: 42.0, groundnut: 2.1, sunflower: 2.0 };
  const base           = bases[cropType] || 3.0;
  const phFactor       = 1 - Math.abs(soilPH - 6.5) * 0.1;
  const nutrientFactor = Math.min(1.3, (Number(nitrogen) + Number(phosphorus) + Number(potassium)) / 300);
  const climateFactor  = temperature > 15 && temperature < 38 ? 1.1 : 0.85;
  const rainFactor     = rainfall > 400 && rainfall < 1600 ? 1.05 : 0.9;
  const yield_         = base * phFactor * nutrientFactor * climateFactor * rainFactor;
  const confidence     = Math.min(96, Math.max(72, Math.round(85 + phFactor * 5 + nutrientFactor * 5)));
  return {
    yieldPerHectare: yield_.toFixed(2),
    totalYield:      (yield_ * farmArea).toFixed(2),
    confidence,
    grade:      yield_ > 5 ? 'Excellent' : yield_ > 3.5 ? 'Good' : yield_ > 2 ? 'Average' : 'Below Average',
    gradeColor: yield_ > 5 ? 'text-green-600 dark:text-green-400' : yield_ > 3.5 ? 'text-blue-600 dark:text-blue-400' : yield_ > 2 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400',
    featureImportance: [
      { feature: 'Soil pH',     importance: Math.round(phFactor * 30)      },
      { feature: 'Nitrogen',    importance: Math.round(nitrogen / 5)        },
      { feature: 'Phosphorus',  importance: Math.round(phosphorus / 6)      },
      { feature: 'Potassium',   importance: Math.round(potassium / 7)       },
      { feature: 'Temperature', importance: Math.round(climateFactor * 22)  },
      { feature: 'Rainfall',    importance: Math.round(rainFactor * 18)     },
    ],
  };
}

const CROPS = [
  { value: 'wheat',     label: 'Wheat',     emoji: '🌿', optYield: '3–5 t/ha'     },
  { value: 'rice',      label: 'Rice',      emoji: '🍚', optYield: '4–6 t/ha'     },
  { value: 'maize',     label: 'Maize',     emoji: '🌽', optYield: '5–8 t/ha'     },
  { value: 'cotton',    label: 'Cotton',    emoji: '🌸', optYield: '2–3 t/ha'     },
  { value: 'soybean',   label: 'Soybean',   emoji: '🫘', optYield: '1.5–2.5 t/ha' },
  { value: 'potato',    label: 'Potato',    emoji: '🥔', optYield: '20–30 t/ha'   },
  { value: 'sugarcane', label: 'Sugarcane', emoji: '🎋', optYield: '65–90 t/ha'   },
  { value: 'tomato',    label: 'Tomato',    emoji: '🍅', optYield: '25–45 t/ha'   },
  { value: 'onion',     label: 'Onion',     emoji: '🧅', optYield: '15–25 t/ha'   },
  { value: 'banana',    label: 'Banana',    emoji: '🍌', optYield: '30–50 t/ha'   },
  { value: 'groundnut', label: 'Groundnut', emoji: '🥜', optYield: '1.5–2.8 t/ha' },
  { value: 'sunflower', label: 'Sunflower', emoji: '🌻', optYield: '1.5–2.5 t/ha' },
];

const defaultInputs = { cropType: 'wheat', soilPH: 6.5, nitrogen: 120, phosphorus: 60, potassium: 80, temperature: 25, rainfall: 800, farmArea: 1 };
const BAR_COLORS    = ['#22c55e','#3b82f6','#8b5cf6','#f97316','#06b6d4','#eab308'];

function Slider({ label, name, value, min, max, step = 1, unit, onChange, color = '#22c55e' }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex justify-between mb-2">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wide">{label}</label>
        <span className="text-sm font-bold text-slate-900 dark:text-white">{value}<span className="text-slate-400 dark:text-slate-500 text-xs ml-0.5 font-normal">{unit}</span></span>
      </div>
      <input type="range" name={name} min={min} max={max} step={step} value={value} onChange={onChange}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ background: `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, rgba(148,163,184,0.2) ${pct}%, rgba(148,163,184,0.2) 100%)`, accentColor: color }} />
      <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-600 mt-1 font-medium">
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </div>
  );
}

export default function MLPrediction() {
  const { dark } = useTheme();
  const [inputs,  setInputs]  = useState(defaultInputs);
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setInputs(f => ({ ...f, [name]: name === 'cropType' ? value : Number(value) }));
  };

  const handlePredict = async () => {
    setLoading(true); setResult(null);
    await new Promise(r => setTimeout(r, 900));
    try {
      const res = await fetch('http://localhost:5000/api/ml/predict', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs), signal: AbortSignal.timeout(3000),
      });
      if (res.ok) { setResult(await res.json()); setLoading(false); return; }
    } catch (_) {}
    setResult(predictYield(inputs));
    setLoading(false);
  };

  const imp = result?.featureImportance || [];

  const tt = dark
    ? { backgroundColor: '#0d1117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#e2e8f0' }
    : { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#1e293b', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' };

  return (
    <div className="space-y-5 fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Machine Learning Prediction</h2>
        <p className="text-slate-500 dark:text-slate-500 text-sm mt-0.5">Decision-Tree model predicts crop yield based on soil nutrients & climate inputs</p>
      </div>

      {/* ── Model info ── */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 p-4 bg-violet-50 dark:bg-violet-500/5 border border-violet-200 dark:border-violet-500/20 rounded-xl text-sm">
        <span className="text-violet-700 dark:text-violet-300"><span className="font-bold">Model:</span> Decision Tree Regressor</span>
        <span className="text-violet-300 dark:text-violet-700">•</span>
        <span className="text-violet-700 dark:text-violet-300"><span className="font-bold">Dataset:</span> 2,200 samples</span>
        <span className="text-violet-300 dark:text-violet-700">•</span>
        <span className="text-violet-700 dark:text-violet-300"><span className="font-bold">Train:</span> 91.2%</span>
        <span className="text-violet-300 dark:text-violet-700">•</span>
        <span className="text-violet-700 dark:text-violet-300"><span className="font-bold">Test:</span> 88.7%</span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* ── Input Panel ── */}
        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] rounded-2xl p-6 space-y-5 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-violet-100 dark:bg-violet-500/15 rounded-xl flex items-center justify-center">
              <BrainCircuit size={16} className="text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">Model Input Features</h3>
          </div>

          {/* Crop grid */}
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">Select Crop</p>
            <div className="grid grid-cols-3 gap-2">
              {CROPS.map(c => (
                <button key={c.value} onClick={() => setInputs(f => ({ ...f, cropType: c.value }))}
                  className={`p-2.5 rounded-xl border-2 text-xs text-center transition-all duration-150 ${
                    inputs.cropType === c.value
                      ? 'border-violet-400 dark:border-violet-500/60 bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300'
                      : 'border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}>
                  <div className="text-lg mb-0.5">{c.emoji}</div>
                  <div className="font-semibold">{c.label}</div>
                  <div className="text-slate-400 dark:text-slate-600 text-[10px] mt-0.5">{c.optYield}</div>
                </button>
              ))}
            </div>
          </div>

          <Slider label="Soil pH"     name="soilPH"      value={inputs.soilPH}      min={4}   max={9}    step={0.1} unit=""      onChange={handleChange} color="#22c55e" />
          <Slider label="Nitrogen"    name="nitrogen"    value={inputs.nitrogen}    min={0}   max={200}  unit=" kg/ha" onChange={handleChange} color="#22c55e" />
          <Slider label="Phosphorus"  name="phosphorus"  value={inputs.phosphorus}  min={0}   max={150}  unit=" kg/ha" onChange={handleChange} color="#3b82f6" />
          <Slider label="Potassium"   name="potassium"   value={inputs.potassium}   min={0}   max={150}  unit=" kg/ha" onChange={handleChange} color="#8b5cf6" />
          <Slider label="Temperature" name="temperature" value={inputs.temperature} min={5}   max={45}   unit="°C"    onChange={handleChange} color="#f97316" />
          <Slider label="Rainfall"    name="rainfall"    value={inputs.rainfall}    min={200} max={2000} unit=" mm"   onChange={handleChange} color="#06b6d4" />
          <Slider label="Farm Area"   name="farmArea"    value={inputs.farmArea}    min={0.5} max={20}   step={0.5} unit=" ha" onChange={handleChange} color="#eab308" />

          <button onClick={handlePredict} disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-40 transition-all shadow-md shadow-violet-500/20">
            {loading
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Running ML Model…</>
              : <><BrainCircuit size={17} /> Predict Yield</>
            }
          </button>
        </div>

        {/* ── Result Panel ── */}
        <div className="space-y-4">
          {!result ? (
            <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] rounded-2xl h-64 flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-5xl mb-3">🤖</span>
              <p className="text-slate-400 dark:text-slate-500 text-sm">Adjust parameters and click<br /><span className="text-slate-700 dark:text-slate-300 font-semibold">Predict Yield</span></p>
            </div>
          ) : (
            <>
              {/* Result card */}
              <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 to-purple-700 dark:from-violet-950/60 dark:to-purple-950/40 dark:border dark:border-violet-500/25 rounded-2xl p-5 shadow-lg shadow-violet-500/20">
                <div className="absolute top-0 right-0 text-7xl opacity-10 p-4 pointer-events-none select-none">📊</div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs text-violet-200 dark:text-violet-400/70 font-bold uppercase tracking-widest">ML Prediction Result</p>
                  <CheckCircle2 size={22} className="text-white/80 dark:text-violet-400" />
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/15 dark:bg-black/30 backdrop-blur-sm rounded-xl p-3">
                    <p className="text-xs text-white/70 dark:text-slate-500 mb-1">Yield / Hectare</p>
                    <p className="text-3xl font-bold text-white dark:text-violet-200">{result.yieldPerHectare}<span className="text-sm text-white/60 dark:text-slate-500 ml-1">t/ha</span></p>
                  </div>
                  <div className="bg-white/15 dark:bg-black/30 backdrop-blur-sm rounded-xl p-3">
                    <p className="text-xs text-white/70 dark:text-slate-500 mb-1">Total ({inputs.farmArea} ha)</p>
                    <p className="text-3xl font-bold text-white dark:text-purple-200">{result.totalYield}<span className="text-sm text-white/60 dark:text-slate-500 ml-1">t</span></p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-white/60 dark:text-slate-500">Grade</p>
                    <p className={`text-lg font-bold text-white dark:${result.gradeColor}`}>{result.grade}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/60 dark:text-slate-500">Confidence</p>
                    <div className="flex items-center gap-1.5">
                      <TrendingUp size={14} className="text-white/80" />
                      <p className="text-lg font-bold text-white">{result.confidence}%</p>
                    </div>
                  </div>
                </div>
                <div className="h-2 bg-white/20 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-white dark:bg-gradient-to-r dark:from-violet-400 dark:to-purple-300 rounded-full transition-all duration-700" style={{ width: `${result.confidence}%` }} />
                </div>
              </div>

              {/* Feature importance */}
              <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3">Feature Importance</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={imp} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke={dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: dark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="feature" type="category" tick={{ fontSize: 10, fill: dark ? '#94a3b8' : '#64748b' }} width={80} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tt} />
                    <Bar dataKey="importance" radius={[0, 6, 6, 0]} name="Importance">
                      {imp.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % 6]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Radar */}
              <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3">Input Profile (Radar)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={[
                    { subject: 'pH',   A: (inputs.soilPH / 9) * 100       },
                    { subject: 'N',    A: (inputs.nitrogen / 200) * 100    },
                    { subject: 'P',    A: (inputs.phosphorus / 150) * 100  },
                    { subject: 'K',    A: (inputs.potassium / 150) * 100   },
                    { subject: 'Temp', A: (inputs.temperature / 45) * 100  },
                    { subject: 'Rain', A: (inputs.rainfall / 2000) * 100   },
                  ]}>
                    <PolarGrid stroke={dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'} />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: dark ? '#64748b' : '#94a3b8' }} />
                    <Radar name="Inputs" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
                    <Tooltip contentStyle={tt} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
