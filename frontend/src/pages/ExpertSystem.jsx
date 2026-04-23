import React, { useState } from 'react';
import {
  matchRules, soilOptions, weatherOptions, seasonOptions, expertRules,
} from '../data/expertRules';
import {
  MdEco, MdWaterDrop, MdBugReport, MdLightbulb,
  MdCheckCircle, MdSearch, MdTune, MdGrain,
} from 'react-icons/md';
import { WiThermometer } from 'react-icons/wi';

/* Confidence badge */
function ConfidenceBadge({ value }) {
  const color = value >= 90 ? 'bg-green-100 text-green-700'
              : value >= 80 ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-orange-100 text-orange-700';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-500 rounded-full transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className={`badge ${color}`}>{value}% match</span>
    </div>
  );
}

/* Single result card */
function ResultCard({ icon: Icon, title, value, color }) {
  return (
    <div className={`rounded-xl p-4 ${color}`}>
      <div className="flex items-start gap-3">
        <Icon size={22} className="flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide opacity-70 mb-1">{title}</p>
          <p className="text-sm font-medium leading-snug">{value}</p>
        </div>
      </div>
    </div>
  );
}

/* Rule browser row */
function RuleRow({ rule }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-100 dark:border-slate-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left"
      >
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Rule #{rule.id} — {rule.output.crop}
        </span>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="badge bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300">{rule.conditions.soilType}</span>
          <span className="badge bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300">{rule.conditions.weather}</span>
          <span className="badge bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300">{rule.conditions.season}</span>
          <span className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
        </div>
      </button>
      {open && (
        <div className="px-4 py-3 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 text-xs space-y-1 text-slate-600 dark:text-slate-300">
          <p><span className="font-semibold">Fertilizer:</span> {rule.output.fertilizer}</p>
          <p><span className="font-semibold">Pest Control:</span> {rule.output.pestControl}</p>
          <p><span className="font-semibold">Water:</span> {rule.output.waterRequirement}</p>
          <p><span className="font-semibold">Expected Yield:</span> {rule.output.expectedYield}</p>
          <p><span className="font-semibold">Tips:</span> {rule.output.tips}</p>
        </div>
      )}
    </div>
  );
}

export default function ExpertSystem() {
  const [form, setForm] = useState({ soilType: '', weather: '', season: '' });
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [noMatch, setNoMatch] = useState(false);
  const [tab,     setTab]     = useState('predictor'); // 'predictor' | 'rules'
  const [search,  setSearch]  = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handlePredict = async () => {
    if (!form.soilType || !form.weather || !form.season) return;
    setLoading(true);
    setResult(null);
    setNoMatch(false);

    /* Simulate network delay */
    await new Promise(r => setTimeout(r, 800));

    /* Try backend first */
    try {
      const res = await fetch('http://localhost:5000/api/expert/predict', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data.output);
        setLoading(false);
        return;
      }
    } catch (_) {}

    /* Client-side rule matching (offline fallback) */
    const matched = matchRules(form);
    if (matched) setResult(matched);
    else setNoMatch(true);
    setLoading(false);
  };

  const handleReset = () => {
    setForm({ soilType: '', weather: '', season: '' });
    setResult(null);
    setNoMatch(false);
  };

  /* Save to local history */
  const saveResult = () => {
    if (!result) return;
    const history = JSON.parse(localStorage.getItem('agri_history') || '[]');
    history.unshift({
      id: Date.now(), ...form, ...result, date: new Date().toISOString(), type: 'expert',
    });
    localStorage.setItem('agri_history', JSON.stringify(history.slice(0, 100)));
    alert('Prediction saved to history!');
  };

  const filteredRules = expertRules.filter(r =>
    r.output.crop.toLowerCase().includes(search.toLowerCase()) ||
    r.conditions.soilType.includes(search.toLowerCase()) ||
    r.conditions.weather.includes(search.toLowerCase())
  );

  const isComplete = form.soilType && form.weather && form.season;

  return (
    <div className="space-y-6 fade-in">
      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">Expert System Engine</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Rule-based IF-THEN inference with {expertRules.length} expert knowledge rules
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTab('predictor')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${tab === 'predictor' ? 'bg-primary-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
            Predictor
          </button>
          <button onClick={() => setTab('rules')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${tab === 'rules' ? 'bg-primary-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
            Rule Base ({expertRules.length})
          </button>
        </div>
      </div>

      {tab === 'predictor' ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* ── Input form ── */}
          <div className="card">
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
              <MdTune className="text-primary-600" size={20} /> Input Conditions
            </h3>

            <div className="space-y-4">
              {/* Soil type */}
              <div>
                <label className="form-label">🌍 Soil Type</label>
                <select name="soilType" value={form.soilType} onChange={handleChange} className="form-input">
                  <option value="">— Select soil type —</option>
                  {soilOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              {/* Weather */}
              <div>
                <label className="form-label">🌤️ Weather Condition</label>
                <select name="weather" value={form.weather} onChange={handleChange} className="form-input">
                  <option value="">— Select weather —</option>
                  {weatherOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              {/* Season */}
              <div>
                <label className="form-label">📅 Cropping Season</label>
                <select name="season" value={form.season} onChange={handleChange} className="form-input">
                  <option value="">— Select season —</option>
                  {seasonOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              {/* Inference chain display */}
              {isComplete && (
                <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-xs font-mono text-primary-700 dark:text-primary-300">
                  <p className="font-semibold mb-1 text-xs">🔍 Inference Chain:</p>
                  <p>IF soil = <strong>{form.soilType}</strong></p>
                  <p>AND weather = <strong>{form.weather}</strong></p>
                  <p>AND season = <strong>{form.season}</strong></p>
                  <p className="mt-1">THEN → matching rules in knowledge base…</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handlePredict}
                  disabled={!isComplete || loading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Inferring…</>
                  ) : (
                    <><MdSearch size={18} /> Get Recommendation</>
                  )}
                </button>
                <button onClick={handleReset} className="btn-secondary px-4">Reset</button>
              </div>
            </div>
          </div>

          {/* ── Result panel ── */}
          <div>
            {!result && !noMatch && (
              <div className="card h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-4">
                  <MdGrain className="text-primary-500 text-3xl" />
                </div>
                <p className="text-slate-400 text-sm">Fill in the input conditions and click<br /><strong>Get Recommendation</strong> to see results.</p>
              </div>
            )}

            {noMatch && (
              <div className="card flex flex-col items-center justify-center text-center py-12">
                <span className="text-4xl mb-3">🤔</span>
                <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">No exact rule found</p>
                <p className="text-slate-400 text-sm">This combination doesn't match any rule in the knowledge base. Try a different combination.</p>
              </div>
            )}

            {result && (
              <div className="space-y-4 fade-in">
                {/* Crop recommendation hero */}
                <div className="card bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/20 border-primary-200 dark:border-primary-700">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold uppercase tracking-wide">Recommended Crop</p>
                      <h3 className="text-2xl font-bold text-primary-800 dark:text-primary-100 mt-1">
                        {result.cropEmoji} {result.crop}
                      </h3>
                    </div>
                    <MdCheckCircle className="text-primary-500 text-3xl flex-shrink-0" />
                  </div>
                  <ConfidenceBadge value={result.confidence} />
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white/60 dark:bg-white/10 rounded-lg px-3 py-2">
                      <p className="text-slate-500">Water Req.</p>
                      <p className="font-medium text-slate-700 dark:text-slate-200">{result.waterRequirement}</p>
                    </div>
                    <div className="bg-white/60 dark:bg-white/10 rounded-lg px-3 py-2">
                      <p className="text-slate-500">Exp. Yield</p>
                      <p className="font-medium text-slate-700 dark:text-slate-200">{result.expectedYield}</p>
                    </div>
                  </div>
                </div>

                {/* Detail cards */}
                <div className="grid grid-cols-1 gap-3">
                  <ResultCard icon={MdGrain}    title="Fertilizer Recommendation" value={result.fertilizer}   color="bg-earth-50 dark:bg-earth-900/20 text-earth-800 dark:text-earth-200"     />
                  <ResultCard icon={MdBugReport} title="Pest Control Advice"       value={result.pestControl}  color="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200"             />
                  <ResultCard icon={MdLightbulb} title="Expert Tips"               value={result.tips}         color="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200"         />
                </div>

                <button onClick={saveResult} className="btn-secondary w-full text-sm">
                  💾 Save to History
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ── Rule browser ── */
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search rules by crop, soil type, or weather…"
                className="form-input pl-10"
              />
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
              {filteredRules.length} rules
            </span>
          </div>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
            {filteredRules.map(rule => <RuleRow key={rule.id} rule={rule} />)}
          </div>
        </div>
      )}
    </div>
  );
}
