import React, { useState } from 'react';
import { matchRules, soilOptions, weatherOptions, seasonOptions, expertRules } from '../data/expertRules';
import { MdBugReport, MdLightbulb, MdCheckCircle, MdSearch, MdTune, MdGrain } from 'react-icons/md';

function SelectField({ label, name, value, onChange, options, emoji }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">{emoji} {label}</label>
      <select
        name={name} value={value} onChange={onChange}
        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500/40 transition-all appearance-none cursor-pointer"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%2364748b' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
      >
        <option value="" className="bg-[#0d1117]">— Select {label} —</option>
        {options.map(o => <option key={o.value} value={o.value} className="bg-[#0d1117]">{o.label}</option>)}
      </select>
    </div>
  );
}

function RuleRow({ rule }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/[0.06] rounded-xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white/[0.03] hover:bg-white/[0.06] transition-colors text-left">
        <span className="text-sm font-medium text-slate-300">Rule #{rule.id} — <span className="text-green-400">{rule.output.crop}</span></span>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          {[rule.conditions.soilType, rule.conditions.weather, rule.conditions.season].map(c => (
            <span key={c} className="px-2 py-0.5 bg-white/[0.06] rounded-full capitalize">{c}</span>
          ))}
          <span className={`transition-transform duration-200 text-slate-500 ${open ? 'rotate-180' : ''}`}>▾</span>
        </div>
      </button>
      {open && (
        <div className="px-4 py-3 bg-white/[0.02] border-t border-white/[0.06] text-xs space-y-1.5 text-slate-400">
          {[['Fertilizer', rule.output.fertilizer], ['Pest Control', rule.output.pestControl],
            ['Water Req.', rule.output.waterRequirement], ['Expected Yield', rule.output.expectedYield],
            ['Tips', rule.output.tips]].map(([k, v]) => (
            <p key={k}><span className="text-slate-500 font-semibold">{k}:</span> <span className="text-slate-300">{v}</span></p>
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
    await new Promise(r => setTimeout(r, 900));
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
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Expert System Engine</h2>
          <p className="text-slate-500 text-sm mt-0.5">Rule-based IF-THEN inference with {expertRules.length} expert knowledge rules</p>
        </div>
        <div className="flex gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl p-1">
          {['predictor', 'rules'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize
                ${tab === t ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'text-slate-500 hover:text-slate-300'}`}>
              {t === 'rules' ? `Rule Base (${expertRules.length})` : 'Predictor'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'predictor' ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <MdTune className="text-green-400" size={20} />
              <h3 className="font-semibold text-white">Input Conditions</h3>
            </div>
            <div className="space-y-4">
              <SelectField label="Soil Type"         name="soilType" value={form.soilType} onChange={handleChange} options={soilOptions}   emoji="🌍" />
              <SelectField label="Weather Condition" name="weather"  value={form.weather}  onChange={handleChange} options={weatherOptions} emoji="🌤️" />
              <SelectField label="Cropping Season"   name="season"   value={form.season}   onChange={handleChange} options={seasonOptions}  emoji="📅" />

              {isComplete && (
                <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl font-mono text-xs text-green-300 space-y-1">
                  <p className="text-green-400 font-semibold mb-2">🔍 Inference Chain:</p>
                  <p>IF soil = <span className="text-white font-bold">{form.soilType}</span></p>
                  <p>AND weather = <span className="text-white font-bold">{form.weather}</span></p>
                  <p>AND season = <span className="text-white font-bold">{form.season}</span></p>
                  <p className="mt-2 text-green-400/70">THEN → matching rules in knowledge base…</p>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button onClick={handlePredict} disabled={!isComplete || loading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-900/30">
                  {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Inferring…</> : <><MdSearch size={18} /> Get Recommendation</>}
                </button>
                <button onClick={handleReset} className="px-5 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all text-sm font-medium">Reset</button>
              </div>
            </div>
          </div>

          {/* Result Panel */}
          <div>
            {!result && !noMatch && (
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl h-full flex flex-col items-center justify-center text-center py-16 px-8">
                <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center mb-4 text-3xl">🌾</div>
                <p className="text-slate-500 text-sm">Select your conditions and click<br /><span className="text-slate-300 font-medium">Get Recommendation</span> to see results.</p>
              </div>
            )}
            {noMatch && (
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl flex flex-col items-center justify-center text-center py-16 px-8">
                <span className="text-5xl mb-3">🤔</span>
                <p className="font-semibold text-white mb-2">No exact rule found</p>
                <p className="text-slate-500 text-sm">Try a different combination of soil, weather, and season.</p>
              </div>
            )}
            {result && (
              <div className="space-y-4 fade-in">
                {/* Crop Hero */}
                <div className="relative overflow-hidden bg-gradient-to-br from-green-950/60 to-emerald-950/40 border border-green-500/25 rounded-2xl p-5">
                  <div className="absolute top-0 right-0 text-7xl opacity-10 p-4 pointer-events-none select-none">{result.cropEmoji}</div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-green-400/70 font-semibold uppercase tracking-widest mb-1">Recommended Crop</p>
                      <h3 className="text-3xl font-bold text-white">{result.cropEmoji} {result.crop}</h3>
                    </div>
                    <MdCheckCircle className="text-green-400 text-3xl flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-700" style={{ width: `${result.confidence}%` }} />
                    </div>
                    <span className="text-xs text-green-400 font-bold">{result.confidence}% match</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-black/30 rounded-xl px-3 py-2">
                      <p className="text-slate-500 mb-0.5">Water Requirement</p>
                      <p className="font-semibold text-slate-200">{result.waterRequirement}</p>
                    </div>
                    <div className="bg-black/30 rounded-xl px-3 py-2">
                      <p className="text-slate-500 mb-0.5">Expected Yield</p>
                      <p className="font-semibold text-slate-200">{result.expectedYield}</p>
                    </div>
                  </div>
                </div>

                {/* Detail Cards */}
                {[
                  { icon: MdGrain,    label: 'Fertilizer Recommendation', value: result.fertilizer,  bg: 'bg-yellow-500/5 border-yellow-500/20',  icon_c: 'text-yellow-400' },
                  { icon: MdBugReport,label: 'Pest Control Advice',        value: result.pestControl, bg: 'bg-red-500/5 border-red-500/20',         icon_c: 'text-red-400'    },
                  { icon: MdLightbulb,label: 'Expert Tips',                value: result.tips,        bg: 'bg-blue-500/5 border-blue-500/20',        icon_c: 'text-blue-400'   },
                ].map(c => (
                  <div key={c.label} className={`border ${c.bg} rounded-xl p-4 flex items-start gap-3`}>
                    <c.icon size={20} className={`${c.icon_c} flex-shrink-0 mt-0.5`} />
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{c.label}</p>
                      <p className="text-sm text-slate-200 leading-snug">{c.value}</p>
                    </div>
                  </div>
                ))}

                <button onClick={saveResult} className="w-full py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all text-sm font-medium">
                  💾 Save to History
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Rule Browser */
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search rules by crop, soil type, or weather…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500/40 transition-all text-sm" />
            </div>
            <span className="text-sm text-slate-500 whitespace-nowrap">{filteredRules.length} rules</span>
          </div>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
            {filteredRules.map(rule => <RuleRow key={rule.id} rule={rule} />)}
          </div>
        </div>
      )}
    </div>
  );
}
