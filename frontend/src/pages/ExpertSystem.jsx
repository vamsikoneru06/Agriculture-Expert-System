import React, { useState } from 'react';
import { matchRules, soilOptions, weatherOptions, seasonOptions, expertRules } from '../data/expertRules';
import { Search, SlidersHorizontal, CheckCircle2, Bug, Lightbulb, Wheat, ChevronDown } from 'lucide-react';

function SelectField({ label, name, value, onChange, options, emoji }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">{emoji} {label}</label>
      <div className="relative">
        <select
          name={name} value={value} onChange={onChange}
          className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 dark:focus:border-green-600 transition-all appearance-none cursor-pointer text-[13px] font-medium"
        >
          <option value="" className="bg-white dark:bg-zinc-900 text-zinc-400">— Select {label} —</option>
          {options.map(o => (
            <option key={o.value} value={o.value} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">{o.label}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
      </div>
    </div>
  );
}

function RuleRow({ rule }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-zinc-100 dark:border-zinc-800/80 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-zinc-50/80 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors text-left">
        <span className="text-[13px] font-semibold text-zinc-700 dark:text-zinc-300">
          Rule #{rule.id} — <span className="text-green-600 dark:text-green-400">{rule.output.crop}</span>
        </span>
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
          {[rule.conditions.soilType, rule.conditions.weather, rule.conditions.season].map(c => (
            <span key={c} className="text-[10px] px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-md capitalize font-medium hidden sm:inline">{c}</span>
          ))}
          <ChevronDown size={14} className={`text-zinc-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>
      {open && (
        <div className="px-4 py-3 bg-white dark:bg-zinc-900/20 border-t border-zinc-100 dark:border-zinc-800 text-[12px] space-y-1.5">
          {[['Fertilizer',rule.output.fertilizer],['Pest Control',rule.output.pestControl],
            ['Water Req.',rule.output.waterRequirement],['Expected Yield',rule.output.expectedYield],
            ['Tips',rule.output.tips]].map(([k,v]) => (
            <p key={k}>
              <span className="font-bold text-zinc-500 dark:text-zinc-500">{k}: </span>
              <span className="text-zinc-700 dark:text-zinc-300">{v}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExpertSystem() {
  const [form,    setForm]    = useState({ soilType:'', weather:'', season:'' });
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [noMatch, setNoMatch] = useState(false);
  const [tab,     setTab]     = useState('predictor');
  const [search,  setSearch]  = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handlePredict = async () => {
    if (!form.soilType || !form.weather || !form.season) return;
    setLoading(true); setResult(null); setNoMatch(false);
    await new Promise(r => setTimeout(r, 700));
    try {
      const res = await fetch('http://localhost:5000/api/expert/predict', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify(form), signal:AbortSignal.timeout(3000),
      });
      if (res.ok) { setResult((await res.json()).output); setLoading(false); return; }
    } catch (_) {}
    const matched = matchRules(form);
    if (matched) setResult(matched); else setNoMatch(true);
    setLoading(false);
  };

  const handleReset = () => { setForm({ soilType:'', weather:'', season:'' }); setResult(null); setNoMatch(false); };

  const saveResult = () => {
    if (!result) return;
    const history = JSON.parse(localStorage.getItem('agri_history') || '[]');
    history.unshift({ id:Date.now(), ...form, ...result, date:new Date().toISOString(), type:'expert' });
    localStorage.setItem('agri_history', JSON.stringify(history.slice(0,100)));
    alert('Saved to history!');
  };

  const filtered = expertRules.filter(r =>
    r.output.crop.toLowerCase().includes(search.toLowerCase()) ||
    r.conditions.soilType.includes(search.toLowerCase()) ||
    r.conditions.weather.includes(search.toLowerCase())
  );

  const isComplete = form.soilType && form.weather && form.season;

  return (
    <div className="space-y-5 fade-in">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Expert System Engine</h2>
          <p className="text-[12px] text-zinc-500 mt-0.5">Rule-based IF-THEN inference · {expertRules.length} knowledge rules</p>
        </div>
        <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
          {['predictor','rules'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all capitalize ${
                tab === t
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm border border-zinc-200 dark:border-zinc-700'
                  : 'text-zinc-500 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}>
              {t === 'rules' ? `Rule Base (${expertRules.length})` : 'Predictor'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'predictor' ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

          {/* ── Input Form ── */}
          <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-green-50 dark:bg-green-500/10 rounded-lg flex items-center justify-center">
                <SlidersHorizontal size={14} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100">Input Conditions</h3>
            </div>

            <div className="space-y-3.5">
              <SelectField label="Soil Type"         name="soilType" value={form.soilType} onChange={handleChange} options={soilOptions}   emoji="🌍" />
              <SelectField label="Weather Condition" name="weather"  value={form.weather}  onChange={handleChange} options={weatherOptions} emoji="🌤️" />
              <SelectField label="Cropping Season"   name="season"   value={form.season}   onChange={handleChange} options={seasonOptions}  emoji="📅" />

              {isComplete && (
                <div className="p-3.5 bg-zinc-950 dark:bg-zinc-900 border border-zinc-800 rounded-xl font-mono text-[11px] text-green-400 space-y-1">
                  <p className="text-green-400 font-bold mb-1.5 text-[10px] uppercase tracking-wider">Inference Chain</p>
                  <p>IF soil = <span className="text-white font-bold">{form.soilType}</span></p>
                  <p>AND weather = <span className="text-white font-bold">{form.weather}</span></p>
                  <p>AND season = <span className="text-white font-bold">{form.season}</span></p>
                  <p className="mt-1.5 text-green-500/60">THEN → matching rules in knowledge base…</p>
                </div>
              )}

              <div className="flex gap-2.5 pt-1">
                <button onClick={handlePredict} disabled={!isComplete || loading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-white text-[13px] bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-glow-sm">
                  {loading
                    ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Inferring…</>
                    : <><Search size={14} /> Get Recommendation</>
                  }
                </button>
                <button onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all text-[12px] font-semibold">
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* ── Result Panel ── */}
          <div>
            {!result && !noMatch && (
              <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8">
                <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-4 text-3xl">🌾</div>
                <p className="text-[13px] text-zinc-500 dark:text-zinc-500 leading-relaxed">
                  Select conditions and click<br />
                  <span className="text-zinc-800 dark:text-zinc-200 font-semibold">Get Recommendation</span>
                </p>
              </div>
            )}

            {noMatch && (
              <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl h-full min-h-[200px] flex flex-col items-center justify-center text-center p-8">
                <span className="text-4xl mb-3">🤔</span>
                <p className="font-bold text-zinc-900 dark:text-zinc-100 text-[14px] mb-1">No matching rule found</p>
                <p className="text-[12px] text-zinc-500">Try a different combination.</p>
              </div>
            )}

            {result && (
              <div className="space-y-3 scale-in">
                {/* Hero card */}
                <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 shadow-glow-green">
                  <div className="absolute inset-0 bg-dot-pattern opacity-10" />
                  <div className="absolute top-0 right-0 text-7xl opacity-[0.08] p-4 pointer-events-none select-none leading-none">{result.cropEmoji}</div>
                  <div className="relative">
                    <p className="text-[10px] text-green-200 font-bold uppercase tracking-widest mb-1">Recommended Crop</p>
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-white">{result.cropEmoji} {result.crop}</h3>
                      <CheckCircle2 size={22} className="text-green-200 flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-2.5 mt-3">
                      <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full transition-all duration-700" style={{width:`${result.confidence}%`}} />
                      </div>
                      <span className="text-[11px] text-white font-bold">{result.confidence}% match</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3 text-[11px]">
                      <div className="bg-white/10 rounded-xl px-3 py-2 backdrop-blur-sm">
                        <p className="text-white/60 mb-0.5">Water Req.</p>
                        <p className="font-bold text-white">{result.waterRequirement}</p>
                      </div>
                      <div className="bg-white/10 rounded-xl px-3 py-2 backdrop-blur-sm">
                        <p className="text-white/60 mb-0.5">Yield</p>
                        <p className="font-bold text-white">{result.expectedYield}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detail cards */}
                {[
                  { icon:Wheat,    label:'Fertilizer',   value:result.fertilizer,  bg:'bg-amber-50 dark:bg-amber-500/[0.06] border-amber-100 dark:border-amber-500/15', ic:'text-amber-600 dark:text-amber-400', ib:'bg-amber-100 dark:bg-amber-500/15' },
                  { icon:Bug,      label:'Pest Control', value:result.pestControl, bg:'bg-rose-50 dark:bg-rose-500/[0.06] border-rose-100 dark:border-rose-500/15',     ic:'text-rose-600 dark:text-rose-400',   ib:'bg-rose-100 dark:bg-rose-500/15'   },
                  { icon:Lightbulb,label:'Expert Tips',  value:result.tips,        bg:'bg-blue-50 dark:bg-blue-500/[0.06] border-blue-100 dark:border-blue-500/15',     ic:'text-blue-600 dark:text-blue-400',   ib:'bg-blue-100 dark:bg-blue-500/15'   },
                ].map(c => (
                  <div key={c.label} className={`border ${c.bg} rounded-xl p-3.5 flex items-start gap-3`}>
                    <div className={`w-7 h-7 rounded-lg ${c.ib} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <c.icon size={14} className={c.ic} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1">{c.label}</p>
                      <p className="text-[12px] text-zinc-700 dark:text-zinc-300 leading-relaxed">{c.value}</p>
                    </div>
                  </div>
                ))}

                <button onClick={saveResult}
                  className="w-full py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all text-[12px] font-semibold">
                  💾 Save to History
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Rule Browser */
        <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by crop, soil, or weather…"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-all text-[12px]" />
            </div>
            <span className="text-[12px] text-zinc-500 font-medium whitespace-nowrap px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">{filtered.length} rules</span>
          </div>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-0.5">
            {filtered.map(rule => <RuleRow key={rule.id} rule={rule} />)}
          </div>
        </div>
      )}
    </div>
  );
}
