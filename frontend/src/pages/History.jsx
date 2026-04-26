import React, { useState, useEffect } from 'react';
import { MdHistory, MdSearch, MdFilterList, MdDelete, MdDownload, MdVisibility, MdClose } from 'react-icons/md';

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

const seasonColor = {
  kharif: 'bg-green-500/10 text-green-400 border border-green-500/20',
  rabi:   'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  zaid:   'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
};

function DetailModal({ entry, onClose }) {
  if (!entry) return null;
  const fields = [
    ['Crop', entry.crop], ['Type', entry.type === 'expert' ? 'Expert System' : 'ML Prediction'],
    ['Soil Type', entry.soilType], ['Weather', entry.weather], ['Season', entry.season],
    ['Fertilizer', entry.fertilizer || '—'], ['Confidence', `${entry.confidence}%`],
    ['Date', new Date(entry.date).toLocaleString('en-IN')],
  ];
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#0d1117] border border-white/[0.1] rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
          <h3 className="font-bold text-white">Prediction Detail</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><MdClose size={22} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="text-5xl text-center py-3">{entry.crop.split(' ')[1] || '🌾'}</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {fields.map(([k, v]) => (
              <div key={k} className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3">
                <p className="text-xs text-slate-500 mb-0.5">{k}</p>
                <p className="text-xs font-semibold text-slate-200 capitalize">{v}</p>
              </div>
            ))}
          </div>
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Confidence Score</span><span>{entry.confidence}%</span>
            </div>
            <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-700" style={{ width: `${entry.confidence}%` }} />
            </div>
          </div>
        </div>
        <div className="p-5 border-t border-white/[0.06]">
          <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all text-sm font-medium">Close</button>
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
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })), download: 'agri_predictions.csv' });
    a.click();
  };

  const filtered = entries.filter(e =>
    (e.crop.toLowerCase().includes(search.toLowerCase()) || e.soilType.includes(search.toLowerCase())) &&
    (typeFilter === 'all' || e.type === typeFilter)
  );

  const expertCount = entries.filter(e => e.type === 'expert').length;
  const mlCount     = entries.filter(e => e.type === 'ml').length;
  const avgConf     = entries.length ? Math.round(entries.reduce((s, e) => s + e.confidence, 0) / entries.length) : 0;

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Prediction History</h2>
          <p className="text-slate-500 text-sm mt-0.5">{entries.length} total predictions stored locally</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all text-sm font-medium">
          <MdDownload size={18} /> Export CSV
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Predictions', value: entries.length, color: 'text-green-400',  border: 'border-green-500/20',  bg: 'bg-green-500/5'  },
          { label: 'Expert System',     value: expertCount,    color: 'text-blue-400',   border: 'border-blue-500/20',   bg: 'bg-blue-500/5'   },
          { label: 'ML Predictions',    value: mlCount,        color: 'text-purple-400', border: 'border-purple-500/20', bg: 'bg-purple-500/5' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 text-center`}>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by crop or soil…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500/40 transition-all text-sm" />
        </div>
        <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3">
          <MdFilterList className="text-slate-500" size={18} />
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="bg-transparent text-sm text-slate-300 outline-none py-2 pr-2 cursor-pointer">
            <option value="all"    className="bg-[#0d1117]">All Types</option>
            <option value="expert" className="bg-[#0d1117]">Expert System</option>
            <option value="ml"     className="bg-[#0d1117]">ML Prediction</option>
          </select>
        </div>
        <div className="px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-xs text-slate-500">
          Avg. Confidence: <span className="text-green-400 font-bold">{avgConf}%</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-600">
            <MdHistory size={48} className="mx-auto mb-3 opacity-30" />
            <p>No predictions found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-600 border-b border-white/[0.06] bg-white/[0.02]">
                {['Crop', 'Type', 'Soil', 'Season', 'Confidence', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 font-semibold uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(entry => (
                <tr key={entry.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group">
                  <td className="px-4 py-3 font-medium text-white">{entry.crop}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${entry.type === 'expert' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'}`}>
                      {entry.type === 'expert' ? 'Expert' : 'ML'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 capitalize">{entry.soilType}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${seasonColor[entry.season]}`}>{entry.season}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${entry.confidence}%` }} />
                      </div>
                      <span className="text-xs text-slate-400">{entry.confidence}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {new Date(entry.date).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => setDetail(entry)} className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"><MdVisibility size={16} /></button>
                      <button onClick={() => handleDelete(entry.id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><MdDelete size={16} /></button>
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
