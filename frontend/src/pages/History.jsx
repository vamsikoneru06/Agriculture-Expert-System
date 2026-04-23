import React, { useState, useEffect } from 'react';
import { MdHistory, MdSearch, MdFilterList, MdDelete, MdDownload, MdVisibility, MdClose } from 'react-icons/md';

/* ── Static demo entries (shown when no saved predictions exist) ── */
const DEMO_HISTORY = [
  { id: 1,  type: 'expert', crop: 'Wheat 🌿',  soilType: 'sandy',  weather: 'dry',    season: 'rabi',   fertilizer: 'DAP 50 kg/acre', confidence: 88, date: '2025-04-22T10:30:00' },
  { id: 2,  type: 'expert', crop: 'Rice 🍚',   soilType: 'clay',   weather: 'humid',  season: 'kharif', fertilizer: 'Nitrogen 120 kg/ha', confidence: 97, date: '2025-04-22T09:15:00' },
  { id: 3,  type: 'ml',     crop: 'Cotton 🌸', soilType: 'loamy',  weather: 'hot',    season: 'kharif', fertilizer: 'NPK 80:40:40',  confidence: 91, date: '2025-04-21T16:00:00' },
  { id: 4,  type: 'expert', crop: 'Tomato 🍅', soilType: 'loamy',  weather: 'hot',    season: 'zaid',   fertilizer: 'NPK 120:80:80', confidence: 92, date: '2025-04-21T14:30:00' },
  { id: 5,  type: 'ml',     crop: 'Maize 🌽',  soilType: 'loamy',  weather: 'rainy',  season: 'kharif', fertilizer: 'Urea 150 kg/ha', confidence: 89, date: '2025-04-20T11:00:00' },
  { id: 6,  type: 'expert', crop: 'Potato 🥔', soilType: 'loamy',  weather: 'cool',   season: 'rabi',   fertilizer: 'NPK 120:80:100', confidence: 93, date: '2025-04-19T08:45:00' },
  { id: 7,  type: 'expert', crop: 'Onion 🧅',  soilType: 'sandy',  weather: 'humid',  season: 'rabi',   fertilizer: 'Potash 100 kg/ha', confidence: 89, date: '2025-04-18T15:20:00' },
  { id: 8,  type: 'ml',     crop: 'Soybean 🫘',soilType: 'black',  weather: 'hot',    season: 'kharif', fertilizer: 'Phosphorus 80 kg/ha', confidence: 90, date: '2025-04-17T12:00:00' },
];

function DetailModal({ entry, onClose }) {
  if (!entry) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">Prediction Detail</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><MdClose size={22} /></button>
        </div>
        <div className="p-5 space-y-3">
          <div className="text-4xl text-center py-4">{entry.crop.split(' ')[1] || '🌾'}</div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              ['Crop',        entry.crop],
              ['Type',        entry.type === 'expert' ? 'Expert System' : 'ML Prediction'],
              ['Soil Type',   entry.soilType],
              ['Weather',     entry.weather],
              ['Season',      entry.season],
              ['Fertilizer',  entry.fertilizer || '—'],
              ['Confidence',  `${entry.confidence}%`],
              ['Date',        new Date(entry.date).toLocaleString('en-IN')],
            ].map(([k, v]) => (
              <div key={k} className="bg-slate-50 dark:bg-slate-700 rounded-xl p-3">
                <p className="text-xs text-slate-400 mb-0.5">{k}</p>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 capitalize">{v}</p>
              </div>
            ))}
          </div>
          {/* Confidence bar */}
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Confidence Score</span><span>{entry.confidence}%</span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-primary-500 rounded-full transition-all duration-700"
                style={{ width: `${entry.confidence}%` }} />
            </div>
          </div>
        </div>
        <div className="p-5 border-t border-slate-100 dark:border-slate-700">
          <button onClick={onClose} className="btn-secondary w-full">Close</button>
        </div>
      </div>
    </div>
  );
}

export default function History() {
  const [entries,   setEntries]   = useState([]);
  const [search,    setSearch]    = useState('');
  const [typeFilter,setTypeFilter]= useState('all');
  const [detail,    setDetail]    = useState(null);

  /* Load local + demo history */
  useEffect(() => {
    const local = JSON.parse(localStorage.getItem('agri_history') || '[]');
    setEntries([...local, ...DEMO_HISTORY]);
  }, []);

  const handleDelete = (id) => {
    setEntries(e => e.filter(x => x.id !== id));
    const local = JSON.parse(localStorage.getItem('agri_history') || '[]');
    localStorage.setItem('agri_history', JSON.stringify(local.filter(x => x.id !== id)));
  };

  const handleExport = () => {
    const csv = [
      'ID,Crop,Type,Soil,Weather,Season,Confidence,Date',
      ...entries.map(e =>
        `${e.id},"${e.crop}",${e.type},${e.soilType},${e.weather},${e.season},${e.confidence}%,${new Date(e.date).toLocaleDateString()}`
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'agri_predictions.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = entries.filter(e => {
    const matchSearch = e.crop.toLowerCase().includes(search.toLowerCase()) ||
                        e.soilType.includes(search.toLowerCase());
    const matchType   = typeFilter === 'all' || e.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6 fade-in">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="section-title">Prediction History</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {entries.length} total predictions stored
          </p>
        </div>
        <button onClick={handleExport} className="btn-secondary flex items-center gap-2 text-sm">
          <MdDownload size={18} /> Export CSV
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by crop or soil…" className="form-input pl-10" />
        </div>
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-xl px-3">
          <MdFilterList className="text-slate-400" size={18} />
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="bg-transparent text-sm text-slate-700 dark:text-slate-200 outline-none py-2 pr-2">
            <option value="all">All Types</option>
            <option value="expert">Expert System</option>
            <option value="ml">ML Prediction</option>
          </select>
        </div>
      </div>

      {/* ── Summary stats ── */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center py-4 bg-primary-50 dark:bg-primary-900/20 border-0">
          <p className="text-2xl font-bold text-primary-700 dark:text-primary-300">{entries.length}</p>
          <p className="text-xs text-slate-500 mt-1">Total Predictions</p>
        </div>
        <div className="card text-center py-4 bg-blue-50 dark:bg-blue-900/20 border-0">
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{entries.filter(e => e.type === 'expert').length}</p>
          <p className="text-xs text-slate-500 mt-1">Expert System</p>
        </div>
        <div className="card text-center py-4 bg-purple-50 dark:bg-purple-900/20 border-0">
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{entries.filter(e => e.type === 'ml').length}</p>
          <p className="text-xs text-slate-500 mt-1">ML Predictions</p>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="card overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <MdHistory size={48} className="mx-auto mb-3 opacity-30" />
            <p>No predictions found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
                <th className="pb-2 font-semibold">Crop</th>
                <th className="pb-2 font-semibold">Type</th>
                <th className="pb-2 font-semibold">Soil</th>
                <th className="pb-2 font-semibold">Season</th>
                <th className="pb-2 font-semibold">Confidence</th>
                <th className="pb-2 font-semibold">Date</th>
                <th className="pb-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
              {filtered.map(entry => (
                <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="py-3 font-medium text-slate-700 dark:text-slate-200">{entry.crop}</td>
                  <td className="py-3">
                    <span className={`badge ${entry.type === 'expert' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                      {entry.type === 'expert' ? 'Expert' : 'ML'}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500 dark:text-slate-400 capitalize">{entry.soilType}</td>
                  <td className="py-3">
                    <span className={`badge capitalize ${
                      entry.season === 'kharif' ? 'bg-green-100 text-green-700' :
                      entry.season === 'rabi'   ? 'bg-blue-100 text-blue-700'   :
                                                  'bg-yellow-100 text-yellow-700'}`}>
                      {entry.season}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 rounded-full" style={{ width: `${entry.confidence}%` }} />
                      </div>
                      <span className="text-xs text-slate-500">{entry.confidence}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-slate-400 text-xs">
                    {new Date(entry.date).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
                  </td>
                  <td className="py-3">
                    <div className="flex gap-1">
                      <button onClick={() => setDetail(entry)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                        <MdVisibility size={16} />
                      </button>
                      <button onClick={() => handleDelete(entry.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                        <MdDelete size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {detail && <DetailModal entry={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}
