import React, { useState, useEffect } from 'react';
import { Clock, Search, Filter, Trash2, Download, Eye, X, TrendingUp } from 'lucide-react';

const DEMO_HISTORY = [
  { id: 1, type:'expert', crop:'Wheat 🌿',  soilType:'sandy', weather:'dry',   season:'rabi',   fertilizer:'DAP 50 kg/acre',       confidence:88, date:'2025-04-22T10:30:00' },
  { id: 2, type:'expert', crop:'Rice 🍚',   soilType:'clay',  weather:'humid', season:'kharif', fertilizer:'Nitrogen 120 kg/ha',    confidence:97, date:'2025-04-22T09:15:00' },
  { id: 3, type:'ml',     crop:'Cotton 🌸', soilType:'loamy', weather:'hot',   season:'kharif', fertilizer:'NPK 80:40:40',          confidence:91, date:'2025-04-21T16:00:00' },
  { id: 4, type:'expert', crop:'Tomato 🍅', soilType:'loamy', weather:'hot',   season:'zaid',   fertilizer:'NPK 120:80:80',         confidence:92, date:'2025-04-21T14:30:00' },
  { id: 5, type:'ml',     crop:'Maize 🌽',  soilType:'loamy', weather:'rainy', season:'kharif', fertilizer:'Urea 150 kg/ha',        confidence:89, date:'2025-04-20T11:00:00' },
  { id: 6, type:'expert', crop:'Potato 🥔', soilType:'loamy', weather:'cool',  season:'rabi',   fertilizer:'NPK 120:80:100',        confidence:93, date:'2025-04-19T08:45:00' },
  { id: 7, type:'expert', crop:'Onion 🧅',  soilType:'sandy', weather:'humid', season:'rabi',   fertilizer:'Potash 100 kg/ha',      confidence:89, date:'2025-04-18T15:20:00' },
  { id: 8, type:'ml',     crop:'Soybean 🫘',soilType:'black', weather:'hot',   season:'kharif', fertilizer:'Phosphorus 80 kg/ha',   confidence:90, date:'2025-04-17T12:00:00' },
];

const seasonBadge = {
  kharif: 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20',
  rabi:   'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20',
  zaid:   'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20',
};

function DetailModal({ entry, onClose }) {
  if (!entry) return null;
  const fields = [
    ['Crop',       entry.crop],
    ['Type',       entry.type === 'expert' ? 'Expert System' : 'ML Prediction'],
    ['Soil Type',  entry.soilType],
    ['Weather',    entry.weather],
    ['Season',     entry.season],
    ['Fertilizer', entry.fertilizer || '—'],
    ['Confidence', `${entry.confidence}%`],
    ['Date',       new Date(entry.date).toLocaleString('en-IN')],
  ];
  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md scale-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <p className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100">Prediction Detail</p>
          <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all">
            <X size={15} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="text-5xl text-center py-2">{entry.crop.split(' ')[1] || '🌾'}</div>
          <div className="grid grid-cols-2 gap-2">
            {fields.map(([k, v]) => (
              <div key={k} className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-xl p-3">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">{k}</p>
                <p className="text-[12px] font-semibold text-zinc-800 dark:text-zinc-200 capitalize">{v}</p>
              </div>
            ))}
          </div>
          <div>
            <div className="flex justify-between text-[12px] font-semibold mb-1.5">
              <span className="text-zinc-500">Confidence Score</span>
              <span className="text-zinc-900 dark:text-zinc-100">{entry.confidence}%</span>
            </div>
            <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-700" style={{ width: `${entry.confidence}%` }} />
            </div>
          </div>
        </div>
        <div className="px-5 pb-5">
          <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all text-[12px] font-semibold">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function History() {
  const [entries,    setEntries]    = useState([]);
  const [search,     setSearch]     = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [detail,     setDetail]     = useState(null);

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
    const csv = ['ID,Crop,Type,Soil,Weather,Season,Confidence,Date',
      ...entries.map(e => `${e.id},"${e.crop}",${e.type},${e.soilType},${e.weather},${e.season},${e.confidence}%,${new Date(e.date).toLocaleDateString()}`)
    ].join('\n');
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
      download: 'agri_predictions.csv',
    });
    a.click();
  };

  const filtered = entries.filter(e =>
    (e.crop.toLowerCase().includes(search.toLowerCase()) || e.soilType.includes(search.toLowerCase())) &&
    (typeFilter === 'all' || e.type === typeFilter)
  );

  const expertCount = entries.filter(e => e.type === 'expert').length;
  const mlCount     = entries.filter(e => e.type === 'ml').length;
  const avgConf     = entries.length ? Math.round(entries.reduce((s, e) => s + e.confidence, 0) / entries.length) : 0;

  const STAT_CARDS = [
    { label:'Total Predictions', value:entries.length, color:'text-green-600 dark:text-green-400',   bg:'bg-green-50 dark:bg-green-500/5 border-green-100 dark:border-green-500/15'  },
    { label:'Expert System',     value:expertCount,    color:'text-blue-600 dark:text-blue-400',     bg:'bg-blue-50 dark:bg-blue-500/5 border-blue-100 dark:border-blue-500/15'      },
    { label:'ML Predictions',    value:mlCount,        color:'text-violet-600 dark:text-violet-400', bg:'bg-violet-50 dark:bg-violet-500/5 border-violet-100 dark:border-violet-500/15' },
  ];

  return (
    <div className="space-y-5 fade-in">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Prediction History</h2>
          <p className="text-[12px] text-zinc-500 mt-0.5">{entries.length} total predictions stored locally</p>
        </div>
        <button onClick={handleExport}
          className="flex items-center gap-2 px-4 h-9 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all text-[12px] font-semibold">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-3 gap-4">
        {STAT_CARDS.map(s => (
          <div key={s.label} className={`border ${s.bg} rounded-2xl p-4 text-center`}>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-zinc-500 mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by crop or soil…"
            className="w-full pl-9 pr-4 h-9 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-all text-[12px]" />
        </div>
        <div className="flex items-center gap-2 h-9 px-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
          <Filter size={13} className="text-zinc-400" />
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="bg-transparent text-[12px] text-zinc-700 dark:text-zinc-300 outline-none cursor-pointer font-medium">
            <option value="all"    className="bg-white dark:bg-zinc-900">All Types</option>
            <option value="expert" className="bg-white dark:bg-zinc-900">Expert System</option>
            <option value="ml"     className="bg-white dark:bg-zinc-900">ML Prediction</option>
          </select>
        </div>
        <div className="flex items-center gap-2 h-9 px-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
          <TrendingUp size={13} className="text-green-500" />
          <span className="text-zinc-500 text-[11px] font-medium">Avg. Confidence:</span>
          <span className="text-green-600 dark:text-green-400 font-bold text-[12px]">{avgConf}%</span>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-zinc-400 dark:text-zinc-600">
            <Clock size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-[13px] font-medium">No predictions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
                  {['Crop', 'Type', 'Soil', 'Season', 'Confidence', 'Date', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(entry => (
                  <tr key={entry.id} className="border-b border-zinc-100 dark:border-zinc-800/60 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors last:border-0">
                    <td className="px-4 py-3 text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">{entry.crop}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${
                        entry.type === 'expert'
                          ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20'
                          : 'bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-500/20'
                      }`}>
                        {entry.type === 'expert' ? 'Expert' : 'ML'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-zinc-500 dark:text-zinc-400 capitalize font-medium">{entry.soilType}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold capitalize ${seasonBadge[entry.season] || ''}`}>{entry.season}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: `${entry.confidence}%` }} />
                        </div>
                        <span className="text-[12px] text-zinc-700 dark:text-zinc-300 font-semibold">{entry.confidence}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-zinc-400 font-medium">
                      {new Date(entry.date).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => setDetail(entry)} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"><Eye size={14} /></button>
                        <button onClick={() => handleDelete(entry.id)} className="p-1.5 text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {detail && <DetailModal entry={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}
