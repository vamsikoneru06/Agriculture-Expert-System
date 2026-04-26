import React, { useState } from 'react';
import { matchRules, soilOptions, weatherOptions, seasonOptions, expertRules } from '../data/expertRules';
import { Search, SlidersHorizontal, CheckCircle2, Bug, Lightbulb, Wheat, ChevronDown, ChevronUp } from 'lucide-react';

function SelectField({ label, name, value, onChange, options, emoji }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-2">
        {emoji} {label}
      </label>
      <div className="relative">
        <select
          name={name} value={value} onChange={onChange}
          className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-400 dark:focus:border-green-500/40 transition-all appearance-none cursor-pointer text-sm font-medium"
        >
          <option value="" className="bg-white dark:bg-[#0d1117] text-slate-500">— Select {label} —</option>
          {options.map(o => (
            <option key={o.value} value={o.value} className="bg-white dark:bg-[#0d1117] text-slate-800 dark:text-white">{o.label}</option>
          ))}
        </select>
        <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

function RuleRow({ rule }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 dark:border-white/[0.06] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors text-left"
      >
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Rule #{rule.id} — <span className="text-green-600 dark:text-green-400">{rule.output.crop}</span>
        </span>
        <div className="flex items-center gap-2">
          {[rule.conditions.soilType, rule.conditions.weather, rule.conditions.season].map(c => (
            <span key={c} className="text-[10px] px-2 py-0.5 bg-slate-200 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400 rounded-full capitalize font-medium hidden sm:inline">{c}</span>
          ))}
          {open ? <ChevronUp size={15} className="text-slate-400 flex-shrink-0" /> : <ChevronDown size={15} className="text-slate-400 flex-shrink-0" />}
        </div>
      </button>
      {open && (
        <div className="px-4 py-3 bg-white dark:bg-white/[0.02] border-t border-slate-200 dark:border-white/[0.06] text-xs space-y-2">
          {[
            ['Fertilizer',     rule.output.fertilizer],
            ['Pest Control',   rule.output.pestControl],
            ['Water Req.',     rule.output.waterRequirement],
            ['Expected Yield', rule.output.expectedYield],
            ['Tips',           rule.output.tips],
          ].map(([k, v]) => (
            <p key={k}>
              <span className="font-semibold text-slate-500 dark:text-slate-500">{k}: </span>
              <span className="text-slate-700 dark:text-slate-300">{v}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExpertSystem() {
  const [form,    setForm]    = useState({ soilType: '', weather: '', season: '' });
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [noMatch, setNoMatch] = useState(false);
  const [tab,     setTab]     = useState('predictor');
  const [search,  setSearch]  = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handlePredict = async () => {
    if (!form.soilType || !form.weather || !form.season) return;
    setLoading(true); setResult(null); setNoMatch(false);
    await new Promise(r => setTimeout(r, 800));
    try {
      const res = await fetch('http://localhost:5000/api/expert/predict', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form), signal: AbortSignal.timeout(3000),
      });
      if (res.ok) { setResult((await res.json()).output); setLoading(false); return; }
    } catch (_) {}
    const matched = matchRules(form);
    if (matched) setResult(matched); else setNoMatch(true);
    setLoading(false);
  };

  const handleReset = () => { setForm({ soilType: '', weather: '', season: '' }); setResult(null); setNoMatch(false); };

  const saveResult = () => {
    if (!result) return;
    const history = JSON.parse(localStorage.getItem('agri_history') || '[]');
    history.unshift({ id: Date.now(), ...form, ...result, date: new Date().toISOString(), type: 'expert' });
    localStorage.setItem('agri_history', JSON.stringify(history.slice(0, 100)));
    alert('Saved to history!');
  };

  const filteredRules = expertRules.filter(r =>
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
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Expert System Engine</h2>
          <p className="text-slate-500 dark:text-slate-500 text-sm mt-0.5">Rule-based IF-THEN inference with {expertRules.length} knowledge rules</p>
        </div>
        <div className="flex gap-1 bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] rounded-xl p-1">
          {['predictor', 'rules'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all capitalize ${
                tab === t
                  ? 'bg-white dark:bg-green-500/15 text-green-700 dark:text-green-400 shadow-sm border border-green-200 dark:border-green-500/20'
                  : 'text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}>
              {t === 'rules' ? `Rule Base (${expertRules.length})` : 'Predictor'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'predictor' ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {/* ── Input Form ── */}
          <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-500/15 rounded-xl flex items-center justify-center">
                <SlidersHorizontal size={16} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">Input Conditions</h3>
            </div>

            <div className="space-y-4">
              <SelectField label="Soil Type"         name="soilType" value={form.soilType} onChange={handleChange} options={soilOptions}   emoji="🌍" />
              <SelectField label="Weather Condition" name="weather"  value={form.weather}  onChange={handleChange} options={weatherOptions} emoji="🌤️" />
              <SelectField label="Cropping Season"   name="season"   value={form.season}   onChange={handleChange} options={seasonOptions}  emoji="📅" />

              {isComplete && (
                <div className="p-4 bg-green-50 dark:bg-green-500/5 border border-green-200 dark:border-green-500/20 rounded-xl font-mono text-xs text-green-700 dark:text-green-300 space-y-1">
                  <p className="text-green-600 dark:text-green-400 font-bold mb-2 not-italic">🔍 Inference Chain:</p>
                  <p>IF soil = <span className="font-bold text-slate-900 dark:text-white">{form.soilType}</span></p>
                  <p>AND weather = <span className="font-bold text-slate-900 dark:text-white">{form.weather}</span></p>
                  <p>AND season = <span className="font-bold text-slate-900 dark:text-white">{form.season}</span></p>
                  <p className="mt-2 text-green-500/80 dark:text-green-400/60">THEN → matching rules in knowledge base…</p>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button onClick={handlePredict} disabled={!isComplete || loading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-green-500/20">
                  {loading
                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Inferring…</>
                    : <><Search size={16} /> Get Recommendation</>
                  }
                </button>
                <button onClick={handleReset}
                  className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/[0.08] transition-all text-sm font-semibold">
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* ── Result Panel ── */}
          <div>
            {!result && !noMatch && (
              <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] rounded-2xl h-full flex flex-col items-center justify-center text-center py-16 px-8 shadow-sm">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl flex items-center justify-center mb-4 text-3xl">🌾</div>
                <p className="text-slate-400 dark:text-slate-500 text-sm leading-relaxed">
                  Select your conditions and click<br />
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">Get Recommendation</span> to see results.
                </p>
              </div>
            )}

            {noMatch && (
              <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] rounded-2xl flex flex-col items-center justify-center text-center py-16 px-8 shadow-sm">
                <span className="text-5xl mb-3">🤔</span>
                <p className="font-bold text-slate-900 dark:text-white mb-2">No matching rule found</p>
                <p className="text-slate-400 dark:text-slate-500 text-sm">Try a different combination of soil, weather, and season.</p>
              </div>
            )}

            {result && (
              <div className="space-y-3 fade-in">
                {/* Crop Hero */}
                <div className="relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-700 dark:from-green-950/60 dark:to-emerald-950/40 dark:border dark:border-green-500/25 rounded-2xl p-5 shadow-lg shadow-green-500/15">
                  <div className="absolute top-0 right-0 text-7xl opacity-10 p-4 pointer-events-none select-none">{result.cropEmoji}</div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-green-200 dark:text-green-400/70 font-bold uppercase tracking-widest mb-1">Recommended Crop</p>
                      <h3 className="text-3xl font-bold text-white">{result.cropEmoji} {result.crop}</h3>
                    </div>
                    <CheckCircle2 size={28} className="text-white/80 dark:text-green-400 flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 h-2 bg-white/20 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-white dark:bg-gradient-to-r dark:from-green-500 dark:to-emerald-400 rounded-full transition-all duration-700" style={{ width: `${result.confidence}%` }} />
                    </div>
                    <span className="text-xs text-white font-bold">{result.confidence}% match</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="bg-white/15 dark:bg-black/30 backdrop-blur-sm rounded-xl px-3 py-2.5">
                      <p className="text-white/70 dark:text-slate-500 mb-0.5">Water Requirement</p>
                      <p className="font-bold text-white dark:text-slate-200">{result.waterRequirement}</p>
                    </div>
                    <div className="bg-white/15 dark:bg-black/30 backdrop-blur-sm rounded-xl px-3 py-2.5">
                      <p className="text-white/70 dark:text-slate-500 mb-0.5">Expected Yield</p>
                      <p className="font-bold text-white dark:text-slate-200">{result.expectedYield}</p>
                    </div>
                  </div>
                </div>

                {/* Detail cards */}
                {[
                  { icon: Wheat,    label: 'Fertilizer Recommendation', value: result.fertilizer,  light: 'bg-amber-50 border-amber-200',  dark: 'dark:bg-yellow-500/5 dark:border-yellow-500/20',  iconBg: 'bg-amber-100 dark:bg-yellow-500/15', iconColor: 'text-amber-600 dark:text-yellow-400' },
                  { icon: Bug,      label: 'Pest Control Advice',        value: result.pestControl, light: 'bg-rose-50 border-rose-200',    dark: 'dark:bg-red-500/5 dark:border-red-500/20',        iconBg: 'bg-rose-100 dark:bg-red-500/15',     iconColor: 'text-rose-600 dark:text-red-400'    },
                  { icon: Lightbulb,label: 'Expert Tips',                value: result.tips,        light: 'bg-blue-50 border-blue-200',    dark: 'dark:bg-blue-500/5 dark:border-blue-500/20',      iconBg: 'bg-blue-100 dark:bg-blue-500/15',    iconColor: 'text-blue-600 dark:text-blue-400'   },
                ].map(c => (
                  <div key={c.label} className={`border ${c.light} ${c.dark} rounded-xl p-4 flex items-start gap-3`}>
                    <div className={`w-8 h-8 rounded-xl ${c.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <c.icon size={16} className={c.iconColor} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wide mb-1">{c.label}</p>
                      <p className="text-sm text-slate-700 dark:text-slate-200 leading-snug">{c.value}</p>
                    </div>
                  </div>
                ))}

                <button onClick={saveResult}
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/[0.08] transition-all text-sm font-semibold">
                  💾 Save to History
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ── Rule Browser ── */
        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search rules by crop, soil type, or weather…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500/40 transition-all text-sm" />
            </div>
            <span className="text-sm text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap">{filteredRules.length} rules</span>
          </div>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
            {filteredRules.map(rule => <RuleRow key={rule.id} rule={rule} />)}
          </div>
        </div>
      )}
    </div>
  );
}
