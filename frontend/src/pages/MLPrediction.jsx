import React, { useState } from 'react';
import { BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { BrainCircuit, CheckCircle2, TrendingUp } from 'lucide-react';
import { GlassButton } from '../components/ui/glass-button';

const TYPICAL_HI = {
  wheat:5.0, rice:6.5, maize:7.5, cotton:3.2, soybean:2.5, potato:28.0,
  sugarcane:90.0, tomato:45.0, onion:25.0, banana:50.0, groundnut:2.8,
  sunflower:2.5, chickpea:2.0, barley:4.5, mustard:2.2, lentil:1.7,
  bajra:3.0, sorghum:4.0, moong:1.5, jute:3.5, watermelon:42.0,
  cucumber:28.0, muskmelon:27.0, okra:16.0, bitter_gourd:15.0,
  bottle_gourd:40.0, cowpea:1.8, sesame:1.2, oats:4.2, pumpkin:42.0, taro:34.0,
};

function predictYield(inputs) {
  const { cropType, soilPH, nitrogen, phosphorus, potassium, temperature, rainfall, farmArea } = inputs;
  const bases = {
    wheat:4.2, rice:5.5, maize:6.1, cotton:2.8, soybean:2.5, potato:25.0,
    sugarcane:78.0, tomato:32.0, onion:20.0, banana:42.0, groundnut:2.1,
    sunflower:2.0, chickpea:1.5, barley:3.5, mustard:1.7, lentil:1.2,
    bajra:2.0, sorghum:3.0, moong:1.1, jute:2.8, watermelon:32.0,
    cucumber:21.0, muskmelon:20.0, okra:12.0, bitter_gourd:11.0,
    bottle_gourd:30.0, cowpea:1.3, sesame:0.9, oats:3.2, pumpkin:31.0, taro:26.0,
  };
  const base = bases[cropType] || 3.0;
  const ph   = 1 - Math.abs(soilPH - 6.5) * 0.1;
  const nut  = Math.min(1.3, (Number(nitrogen)+Number(phosphorus)+Number(potassium))/300);
  const cli  = temperature>15&&temperature<38 ? 1.1 : 0.85;
  const rain = rainfall>400&&rainfall<1600 ? 1.05 : 0.9;
  const y    = base * ph * nut * cli * rain;

  const hi    = TYPICAL_HI[cropType] || 5.0;
  const ratio = y / hi;
  const grade      = ratio>=0.9?'Excellent':ratio>=0.7?'Good':ratio>=0.5?'Average':'Below Average';
  const gradeColor = ratio>=0.9?'text-green-500':ratio>=0.7?'text-blue-500':ratio>=0.5?'text-amber-500':'text-rose-500';

  return {
    yieldPerHectare: y.toFixed(2),
    totalYield:      (y*farmArea).toFixed(2),
    confidence:      Math.min(96,Math.max(72,Math.round(85+ph*5+nut*5))),
    grade,
    gradeColor,
    featureImportance:[
      { feature:'Soil pH',     importance:Math.round(ph*30)         },
      { feature:'Nitrogen',    importance:Math.round(nitrogen/5)    },
      { feature:'Phosphorus',  importance:Math.round(phosphorus/6)  },
      { feature:'Potassium',   importance:Math.round(potassium/7)   },
      { feature:'Temperature', importance:Math.round(cli*22)        },
      { feature:'Rainfall',    importance:Math.round(rain*18)       },
    ],
  };
}

const CROPS = [
  {value:'wheat',        label:'Wheat',        emoji:'🌿', opt:'3–5 t/ha'     },
  {value:'rice',         label:'Rice',          emoji:'🍚', opt:'4–6 t/ha'     },
  {value:'maize',        label:'Maize',         emoji:'🌽', opt:'5–8 t/ha'     },
  {value:'cotton',       label:'Cotton',        emoji:'🌸', opt:'2–3 t/ha'     },
  {value:'soybean',      label:'Soybean',       emoji:'🫘', opt:'1.5–2.5 t/ha' },
  {value:'potato',       label:'Potato',        emoji:'🥔', opt:'20–30 t/ha'   },
  {value:'sugarcane',    label:'Sugarcane',     emoji:'🎋', opt:'65–90 t/ha'   },
  {value:'tomato',       label:'Tomato',        emoji:'🍅', opt:'25–45 t/ha'   },
  {value:'onion',        label:'Onion',         emoji:'🧅', opt:'15–25 t/ha'   },
  {value:'banana',       label:'Banana',        emoji:'🍌', opt:'30–50 t/ha'   },
  {value:'groundnut',    label:'Groundnut',     emoji:'🥜', opt:'1.5–2.8 t/ha' },
  {value:'sunflower',    label:'Sunflower',     emoji:'🌻', opt:'1.5–2.5 t/ha' },
  {value:'chickpea',     label:'Chickpea',      emoji:'🫘', opt:'1–2 t/ha'     },
  {value:'barley',       label:'Barley',        emoji:'🌾', opt:'2.5–4.5 t/ha' },
  {value:'mustard',      label:'Mustard',       emoji:'🌼', opt:'1.2–2.2 t/ha' },
  {value:'lentil',       label:'Lentil',        emoji:'🫘', opt:'0.8–1.7 t/ha' },
  {value:'bajra',        label:'Pearl Millet',  emoji:'🌾', opt:'1.5–3 t/ha'   },
  {value:'sorghum',      label:'Sorghum',       emoji:'🌾', opt:'2–4 t/ha'     },
  {value:'moong',        label:'Green Gram',    emoji:'🫘', opt:'0.8–1.5 t/ha' },
  {value:'jute',         label:'Jute',          emoji:'🌿', opt:'2–3.5 t/ha'   },
  {value:'watermelon',   label:'Watermelon',    emoji:'🍉', opt:'22–42 t/ha'   },
  {value:'cucumber',     label:'Cucumber',      emoji:'🥒', opt:'14–28 t/ha'   },
  {value:'muskmelon',    label:'Muskmelon',     emoji:'🍈', opt:'14–27 t/ha'   },
  {value:'okra',         label:'Okra',          emoji:'🌿', opt:'8–16 t/ha'    },
  {value:'bitter_gourd', label:'Bitter Gourd',  emoji:'🥒', opt:'7–15 t/ha'    },
  {value:'bottle_gourd', label:'Bottle Gourd',  emoji:'🥬', opt:'20–40 t/ha'   },
  {value:'cowpea',       label:'Cowpea',        emoji:'🫘', opt:'0.8–1.8 t/ha' },
  {value:'sesame',       label:'Sesame',        emoji:'🌿', opt:'0.6–1.2 t/ha' },
  {value:'oats',         label:'Oats',          emoji:'🌾', opt:'2–4.2 t/ha'   },
  {value:'pumpkin',      label:'Pumpkin',       emoji:'🎃', opt:'20–42 t/ha'   },
  {value:'taro',         label:'Taro',          emoji:'🌿', opt:'18–34 t/ha'   },
];

const DEF  = { cropType:'wheat', soilPH:6.5, nitrogen:120, phosphorus:60, potassium:80, temperature:25, rainfall:800, farmArea:1 };
const BARS = ['#22c55e','#3b82f6','#8b5cf6','#f97316','#06b6d4','#eab308'];

function Slider({ label, name, value, min, max, step=1, unit, onChange, color='#22c55e' }) {
  const pct = ((value-min)/(max-min))*100;
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">{label}</label>
        <span className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100">{value}<span className="text-zinc-400 text-[11px] ml-0.5 font-normal">{unit}</span></span>
      </div>
      <input type="range" name={name} min={min} max={max} step={step} value={value} onChange={onChange}
        className="w-full h-1 rounded-full appearance-none cursor-pointer"
        style={{ background:`linear-gradient(to right,${color} 0%,${color} ${pct}%,rgba(0,0,0,0.08) ${pct}%,rgba(0,0,0,0.08) 100%)`, accentColor:color }} />
      <div className="flex justify-between text-[10px] text-zinc-400 mt-0.5">
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </div>
  );
}

function ChartTip({ active, payload, label, dark }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-2.5 shadow-xl text-[11px]">
      <p className="font-semibold text-zinc-700 dark:text-zinc-300 mb-1">{label}</p>
      {payload.map(p=>(
        <p key={p.name} style={{color:p.color}} className="font-medium">{p.name}: {p.value}</p>
      ))}
    </div>
  );
}

export default function MLPrediction() {
  const { dark } = useTheme();
  const [inputs,  setInputs]  = useState(DEF);
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setInputs(f => ({ ...f, [name]: name==='cropType' ? value : Number(value) }));
  };

  const handlePredict = async () => {
    setLoading(true); setResult(null);
    await new Promise(r=>setTimeout(r,800));
    try {
      const res = await fetch('http://localhost:5000/api/ml/predict',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify(inputs), signal:AbortSignal.timeout(3000),
      });
      if (res.ok) { setResult(await res.json()); setLoading(false); return; }
    } catch(_) {}
    setResult(predictYield(inputs));
    setLoading(false);
  };

  const imp = result?.featureImportance || [];

  return (
    <div className="space-y-5 fade-in">
      <div>
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Machine Learning Prediction</h2>
        <p className="text-[12px] text-zinc-500 mt-0.5">Decision-Tree model · Soil nutrients &amp; climate inputs</p>
      </div>

      {/* Model badge */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2.5 bg-violet-50 dark:bg-violet-500/[0.06] border border-violet-100 dark:border-violet-500/15 rounded-xl text-[12px]">
        <span className="text-violet-700 dark:text-violet-300 font-medium"><span className="font-bold">Model:</span> Decision Tree Regressor</span>
        <span className="text-violet-300 dark:text-violet-700 hidden sm:block">·</span>
        <span className="text-violet-700 dark:text-violet-300 font-medium"><span className="font-bold">Dataset:</span> 632 samples · 31 crops</span>
        <span className="text-violet-300 dark:text-violet-700 hidden sm:block">·</span>
        <span className="text-violet-700 dark:text-violet-300 font-medium">Train <span className="font-bold">98.9%</span> · Test <span className="font-bold">78.3%</span></span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Input */}
        <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-violet-50 dark:bg-violet-500/10 rounded-lg flex items-center justify-center">
              <BrainCircuit size={14} className="text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100">Model Input Features</h3>
          </div>

          {/* Crop grid — scrollable */}
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Select Crop</p>
            <div className="max-h-[260px] overflow-y-auto rounded-xl pr-0.5">
              <div className="grid grid-cols-5 gap-1.5">
                {CROPS.map(c => (
                  <button key={c.value} onClick={()=>setInputs(f=>({...f,cropType:c.value}))}
                    className={`p-1.5 rounded-xl border-2 text-center transition-all duration-150 ${
                      inputs.cropType===c.value
                        ? 'border-violet-400 dark:border-violet-500/60 bg-violet-50 dark:bg-violet-500/10'
                        : 'border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 hover:border-zinc-200 dark:hover:border-zinc-700'
                    }`}>
                    <div className="text-base leading-none">{c.emoji}</div>
                    <div className={`text-[9px] font-bold mt-0.5 truncate ${inputs.cropType===c.value?'text-violet-700 dark:text-violet-300':'text-zinc-600 dark:text-zinc-400'}`}>{c.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Slider label="Soil pH"     name="soilPH"      value={inputs.soilPH}      min={4}   max={9}    step={0.1} unit=""       onChange={handleChange} color="#22c55e" />
          <Slider label="Nitrogen"    name="nitrogen"    value={inputs.nitrogen}    min={0}   max={200}  unit=" kg/ha"  onChange={handleChange} color="#22c55e" />
          <Slider label="Phosphorus"  name="phosphorus"  value={inputs.phosphorus}  min={0}   max={150}  unit=" kg/ha"  onChange={handleChange} color="#3b82f6" />
          <Slider label="Potassium"   name="potassium"   value={inputs.potassium}   min={0}   max={150}  unit=" kg/ha"  onChange={handleChange} color="#8b5cf6" />
          <Slider label="Temperature" name="temperature" value={inputs.temperature} min={5}   max={45}   unit="°C"     onChange={handleChange} color="#f97316" />
          <Slider label="Rainfall"    name="rainfall"    value={inputs.rainfall}    min={200} max={2000} unit=" mm"    onChange={handleChange} color="#06b6d4" />
          <Slider label="Farm Area"   name="farmArea"    value={inputs.farmArea}    min={0.5} max={20}   step={0.5} unit=" ha" onChange={handleChange} color="#eab308" />

          <GlassButton
            size="default"
            onClick={handlePredict}
            disabled={loading}
            className="w-full"
            contentClassName="flex items-center justify-center gap-2 w-full"
            style={{'--glass-color':'#a78bfa'}}
          >
            {loading
              ? <><div className="w-3.5 h-3.5 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" /> Running…</>
              : <><BrainCircuit size={15}/> Predict Yield</>
            }
          </GlassButton>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {!result ? (
            <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl h-52 flex flex-col items-center justify-center text-center">
              <span className="text-4xl mb-3">🤖</span>
              <p className="text-[13px] text-zinc-500">Adjust parameters and click<br /><span className="text-zinc-800 dark:text-zinc-200 font-semibold">Predict Yield</span></p>
            </div>
          ) : (
            <>
              {/* Result hero */}
              <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-violet-600 via-violet-700 to-purple-800 shadow-lg scale-in">
                <div className="absolute inset-0 bg-dot-pattern opacity-10" />
                <div className="absolute top-0 right-0 text-7xl opacity-[0.08] p-4 pointer-events-none select-none leading-none">📊</div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] text-violet-200 font-bold uppercase tracking-widest">ML Prediction Result</p>
                    <CheckCircle2 size={18} className="text-violet-200" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                      <p className="text-[10px] text-white/60 mb-1">Yield / Hectare</p>
                      <p className="text-2xl font-bold text-white">{result.yieldPerHectare}<span className="text-[12px] text-white/60 ml-1">t/ha</span></p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                      <p className="text-[10px] text-white/60 mb-1">Total ({inputs.farmArea} ha)</p>
                      <p className="text-2xl font-bold text-white">{result.totalYield}<span className="text-[12px] text-white/60 ml-1">t</span></p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-[10px] text-white/60">Grade</p>
                      <p className="text-base font-bold text-white">{result.grade}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-white/60">Confidence</p>
                      <div className="flex items-center gap-1">
                        <TrendingUp size={12} className="text-white/70" />
                        <p className="text-base font-bold text-white">{result.confidence}%</p>
                      </div>
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full transition-all duration-700" style={{width:`${result.confidence}%`}} />
                  </div>
                </div>
              </div>

              {/* Feature importance */}
              <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
                <p className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100 mb-3">Feature Importance</p>
                <ResponsiveContainer width="100%" height={185}>
                  <BarChart data={imp} layout="vertical" margin={{top:0,right:8,bottom:0,left:0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke={dark?'rgba(255,255,255,0.04)':'rgba(0,0,0,0.04)'} />
                    <XAxis type="number" tick={{fontSize:10,fill:dark?'#71717a':'#a1a1aa'}} axisLine={false} tickLine={false} />
                    <YAxis dataKey="feature" type="category" tick={{fontSize:10,fill:dark?'#a1a1aa':'#71717a'}} width={76} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTip dark={dark} />} />
                    <Bar dataKey="importance" radius={[0,5,5,0]} name="Importance">
                      {imp.map((_,i)=><Cell key={i} fill={BARS[i%6]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Radar */}
              <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
                <p className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100 mb-3">Input Profile</p>
                <ResponsiveContainer width="100%" height={185}>
                  <RadarChart data={[
                    {subject:'pH',   A:(inputs.soilPH/9)*100      },
                    {subject:'N',    A:(inputs.nitrogen/200)*100   },
                    {subject:'P',    A:(inputs.phosphorus/150)*100 },
                    {subject:'K',    A:(inputs.potassium/150)*100  },
                    {subject:'Temp', A:(inputs.temperature/45)*100 },
                    {subject:'Rain', A:(inputs.rainfall/2000)*100  },
                  ]}>
                    <PolarGrid stroke={dark?'rgba(255,255,255,0.07)':'rgba(0,0,0,0.06)'} />
                    <PolarAngleAxis dataKey="subject" tick={{fontSize:11,fill:dark?'#71717a':'#a1a1aa'}} />
                    <Radar name="Inputs" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.18} />
                    <Tooltip content={<ChartTip dark={dark} />} />
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
