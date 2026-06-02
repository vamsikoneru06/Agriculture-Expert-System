import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { expertRules } from '../data/expertRules';
import {
  MdAdd, MdEdit, MdDelete, MdSearch, MdClose, MdPeople,
  MdGrain, MdBarChart, MdAdminPanelSettings, MdCheck,
} from 'react-icons/md';

/* ── Demo users ── */
const INITIAL_USERS = [
  { id: 1, name: 'Admin User',    email: 'admin@agri.com',   role: 'admin',   status: 'active',   joined: '2024-01-10' },
  { id: 2, name: 'Farmer Ravi',   email: 'farmer@agri.com',  role: 'farmer',  status: 'active',   joined: '2024-02-14' },
  { id: 3, name: 'Student Priya', email: 'student@agri.com', role: 'student', status: 'active',   joined: '2024-03-05' },
  { id: 4, name: 'Suresh Kumar',  email: 'suresh@agri.com',  role: 'farmer',  status: 'inactive', joined: '2024-04-20' },
  { id: 5, name: 'Meena Devi',    email: 'meena@agri.com',   role: 'student', status: 'active',   joined: '2025-01-11' },
];

const analyticsData = [
  { month: 'Jan', predictions: 45,  users: 8 },
  { month: 'Feb', predictions: 62,  users: 12 },
  { month: 'Mar', predictions: 78,  users: 15 },
  { month: 'Apr', predictions: 110, users: 22 },
  { month: 'May', predictions: 95,  users: 19 },
  { month: 'Jun', predictions: 130, users: 28 },
];

/* ── Rule Modal ── */
function RuleModal({ rule, onClose, onSave }) {
  const [form, setForm] = useState(rule || {
    conditions: { soilType: 'loamy', weather: 'hot', season: 'kharif' },
    output: { crop: '', cropEmoji: '🌾', fertilizer: '', pestControl: '', waterRequirement: '', expectedYield: '', tips: '', confidence: 85 },
  });

  const setCondition = (key, val) => setForm(f => ({ ...f, conditions: { ...f.conditions, [key]: val } }));
  const setOutput    = (key, val) => setForm(f => ({ ...f, output:     { ...f.output,     [key]: val } }));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">{rule ? 'Edit Rule' : 'Add New Rule'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <MdClose size={22} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">IF Conditions</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: 'soilType', label: 'Soil', opts: ['sandy','clay','loamy','black','silt'] },
              { key: 'weather',  label: 'Weather', opts: ['hot','humid','rainy','dry','cool'] },
              { key: 'season',   label: 'Season', opts: ['kharif','rabi','zaid'] },
            ].map(f => (
              <div key={f.key}>
                <label className="form-label text-xs">{f.label}</label>
                <select value={form.conditions[f.key]} onChange={e => setCondition(f.key, e.target.value)} className="form-input text-sm py-2">
                  {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>

          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide pt-2">THEN Output</p>
          {[
            { key: 'crop',             label: 'Crop Name',          placeholder: 'e.g. Wheat' },
            { key: 'fertilizer',       label: 'Fertilizer',         placeholder: 'e.g. DAP 50 kg/acre' },
            { key: 'pestControl',      label: 'Pest Control',        placeholder: 'e.g. Neem spray' },
            { key: 'waterRequirement', label: 'Water Requirement',   placeholder: 'e.g. Moderate – 500 mm' },
            { key: 'expectedYield',    label: 'Expected Yield',      placeholder: 'e.g. 3-5 tons/ha' },
            { key: 'tips',             label: 'Tips',                placeholder: 'Agronomic tips…' },
          ].map(f => (
            <div key={f.key}>
              <label className="form-label text-xs">{f.label}</label>
              <input value={form.output[f.key] || ''} onChange={e => setOutput(f.key, e.target.value)}
                placeholder={f.placeholder} className="form-input text-sm" />
            </div>
          ))}

          <div>
            <label className="form-label text-xs">Confidence ({form.output.confidence}%)</label>
            <input type="range" min="50" max="99" value={form.output.confidence}
              onChange={e => setOutput('confidence', Number(e.target.value))}
              className="w-full accent-primary-600" />
          </div>
        </div>
        <div className="flex gap-3 p-5 border-t border-slate-100 dark:border-slate-700">
          <button onClick={() => onSave(form)} className="btn-primary flex-1 flex items-center justify-center gap-2">
            <MdCheck size={18} /> {rule ? 'Save Changes' : 'Add Rule'}
          </button>
          <button onClick={onClose} className="btn-secondary px-5">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const [tab,      setTab]      = useState('rules');
  const [rules,    setRules]    = useState(expertRules.map((r, i) => ({ ...r, id: i + 1 })));
  const [users,    setUsers]    = useState(INITIAL_USERS);
  const [search,   setSearch]   = useState('');
  const [modal,    setModal]    = useState(null); // null | 'add' | rule object
  const [delConfirm, setDelConfirm] = useState(null);

  /* ── Rules CRUD ── */
  const saveRule = (form) => {
    if (modal === 'add') {
      setRules(r => [...r, { ...form, id: Date.now() }]);
    } else {
      setRules(r => r.map(x => x.id === modal.id ? { ...form, id: modal.id } : x));
    }
    setModal(null);
  };

  const deleteRule = (id) => { setRules(r => r.filter(x => x.id !== id)); setDelConfirm(null); };

  const toggleUserStatus = (id) => {
    setUsers(u => u.map(x => x.id === id ? { ...x, status: x.status === 'active' ? 'inactive' : 'active' } : x));
  };

  const deleteUser = (id) => setUsers(u => u.filter(x => x.id !== id));

  const filteredRules = rules.filter(r =>
    r.output.crop.toLowerCase().includes(search.toLowerCase()) ||
    r.conditions.soilType.includes(search.toLowerCase())
  );

  const tabs = [
    { key: 'rules',     label: 'Knowledge Base', icon: MdGrain    },
    { key: 'users',     label: 'Users',           icon: MdPeople   },
    { key: 'analytics', label: 'Analytics',       icon: MdBarChart },
  ];

  return (
    <div className="space-y-6 fade-in">
      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
          <MdAdminPanelSettings className="text-red-600 dark:text-red-400 text-xl" />
        </div>
        <div>
          <h2 className="section-title">Admin Panel</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage rules, users, and view system analytics</p>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Rules',     value: rules.length,  bg: 'bg-primary-50 dark:bg-primary-900/20' },
          { label: 'Total Users',     value: users.length,  bg: 'bg-blue-50 dark:bg-blue-900/20'       },
          { label: 'Active Users',    value: users.filter(u => u.status === 'active').length, bg: 'bg-green-50 dark:bg-green-900/20' },
        ].map(s => (
          <div key={s.label} className={`card ${s.bg} border-0 text-center py-4`}>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{s.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${tab === t.key ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
            <t.icon size={16} />{t.label}
          </button>
        ))}
      </div>

      {/* ── Rules tab ── */}
      {tab === 'rules' && (
        <div className="card">
          <div className="flex items-center justify-between mb-4 gap-3">
            <div className="relative flex-1 max-w-sm">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search rules…" className="form-input pl-9 text-sm py-2" />
            </div>
            <button onClick={() => setModal('add')} className="btn-primary flex items-center gap-2 text-sm">
              <MdAdd size={18} /> Add Rule
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
                  <th className="pb-2 font-semibold">#</th>
                  <th className="pb-2 font-semibold">Crop</th>
                  <th className="pb-2 font-semibold">Soil</th>
                  <th className="pb-2 font-semibold">Weather</th>
                  <th className="pb-2 font-semibold">Season</th>
                  <th className="pb-2 font-semibold">Confidence</th>
                  <th className="pb-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                {filteredRules.map(rule => (
                  <tr key={rule.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="py-2.5 text-slate-400 text-xs">{rule.id}</td>
                    <td className="py-2.5 font-medium text-slate-700 dark:text-slate-200">{rule.output.cropEmoji} {rule.output.crop}</td>
                    <td className="py-2.5"><span className="badge bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 capitalize">{rule.conditions.soilType}</span></td>
                    <td className="py-2.5"><span className="badge bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 capitalize">{rule.conditions.weather}</span></td>
                    <td className="py-2.5"><span className="badge bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 capitalize">{rule.conditions.season}</span></td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-primary-500 rounded-full" style={{ width: `${rule.output.confidence}%` }} />
                        </div>
                        <span className="text-xs text-slate-500">{rule.output.confidence}%</span>
                      </div>
                    </td>
                    <td className="py-2.5">
                      <div className="flex gap-1">
                        <button onClick={() => setModal(rule)}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                          <MdEdit size={16} />
                        </button>
                        <button onClick={() => setDelConfirm(rule.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                          <MdDelete size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Users tab ── */}
      {tab === 'users' && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
                <th className="pb-2 font-semibold">Name</th>
                <th className="pb-2 font-semibold">Email</th>
                <th className="pb-2 font-semibold">Role</th>
                <th className="pb-2 font-semibold">Status</th>
                <th className="pb-2 font-semibold">Joined</th>
                <th className="pb-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-xs">
                        {u.name.charAt(0)}
                      </div>
                      <span className="font-medium text-slate-700 dark:text-slate-200">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-slate-500 dark:text-slate-400">{u.email}</td>
                  <td className="py-3">
                    <span className={`badge ${
                      u.role === 'admin'   ? 'bg-red-100 text-red-700'    :
                      u.role === 'farmer'  ? 'bg-green-100 text-green-700' :
                                            'bg-blue-100 text-blue-700'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3">
                    <button onClick={() => toggleUserStatus(u.id)}
                      className={`badge cursor-pointer hover:opacity-80 ${u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {u.status}
                    </button>
                  </td>
                  <td className="py-3 text-slate-400 text-xs">{u.joined}</td>
                  <td className="py-3">
                    <button onClick={() => deleteUser(u.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <MdDelete size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Analytics tab ── */}
      {tab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 text-sm mb-4">Monthly Predictions</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Bar dataKey="predictions" fill="#16a34a" radius={[6, 6, 0, 0]} name="Predictions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 text-sm mb-4">Monthly User Growth</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Bar dataKey="users" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Users" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card lg:col-span-2 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20">
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 text-sm mb-3">System Health</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'API Uptime',      value: '99.8%',  color: 'text-primary-600' },
                { label: 'Avg Response',    value: '142ms',  color: 'text-blue-600'    },
                { label: 'DB Size',         value: '2.4 MB', color: 'text-purple-600'  },
                { label: 'Total API Calls', value: '14,820', color: 'text-yellow-600'  },
              ].map(s => (
                <div key={s.label} className="bg-white/60 dark:bg-white/5 rounded-xl p-3 text-center">
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Rule Modal ── */}
      {modal && (
        <RuleModal
          rule={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={saveRule}
        />
      )}

      {/* ── Delete confirm ── */}
      {delConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-2xl max-w-sm w-full">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">Delete Rule?</h3>
            <p className="text-slate-500 text-sm mb-4">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => deleteRule(delConfirm)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl transition-colors">
                Delete
              </button>
              <button onClick={() => setDelConfirm(null)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
