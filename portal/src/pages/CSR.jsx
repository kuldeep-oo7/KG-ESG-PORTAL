import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import { DollarSign, FolderOpen, Users, TrendingUp, Plus, ChevronDown, ChevronUp } from 'lucide-react'

// ── Sample data ────────────────────────────────────────────────────────────────
const IMPACT_DATA = [
  { year: '2021', impact: 12 },
  { year: '2022', impact: 18 },
  { year: '2023', impact: 24 },
  { year: '2024', impact: 28 },
  { year: '2025', impact: 30 },
]

const DONOR_DATA = [
  { name: 'Individual', value: 45 },
  { name: 'Corporate', value: 30 },
  { name: 'Government', value: 15 },
  { name: 'Other', value: 10 },
]
const DONOR_COLORS = ['#064E3B', '#10B981', '#6EE7B7', '#D1FAE5']

const INITIAL_PROJECTS = [
  { id: 1, name: 'Digital Literacy Program', category: 'Education', budget: 4200000, spent: 3100000, status: 'Active' },
  { id: 2, name: 'Mangrove Restoration Drive', category: 'Environment', budget: 3500000, spent: 3500000, status: 'Completed' },
  { id: 3, name: 'Mobile Health Clinics', category: 'Health', budget: 5000000, spent: 2200000, status: 'Active' },
  { id: 4, name: 'Rural Infrastructure Development', category: 'Rural Development', budget: 6000000, spent: 4800000, status: 'In Review' },
  { id: 5, name: 'Women Skill Enhancement Centre', category: 'Women Empowerment', budget: 2800000, spent: 1400000, status: 'Active' },
]

const CATEGORIES = ['Education', 'Health', 'Environment', 'Rural Development', 'Women Empowerment']
const FY_OPTIONS = ['FY 2024-25', 'FY 2025-26', 'FY 2026-27']
const STATUS_OPTIONS = ['Active', 'In Review', 'Completed']

function fmt(n) {
  return '₹' + (n / 100000).toFixed(1) + 'L'
}

function StatusBadge({ status }) {
  const map = {
    Active: 'bg-green-100 text-green-700',
    Completed: 'bg-blue-100 text-blue-700',
    'In Review': 'bg-yellow-100 text-yellow-700',
  }
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${map[status] ?? 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  )
}

export default function CSR() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '', category: CATEGORIES[0], fy: FY_OPTIONS[0],
    budget: '', agency: '', description: '',
    startDate: '', endDate: '', status: STATUS_OPTIONS[0],
  })

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSave() {
    if (!form.name.trim()) return
    const budget = parseFloat(form.budget) * 100000 || 0
    setProjects(p => [
      ...p,
      {
        id: p.length + 1,
        name: form.name,
        category: form.category,
        budget,
        spent: 0,
        status: form.status,
      },
    ])
    setForm({ name: '', category: CATEGORIES[0], fy: FY_OPTIONS[0], budget: '', agency: '', description: '', startDate: '', endDate: '', status: STATUS_OPTIONS[0] })
    setShowForm(false)
  }

  const kpis = [
    { icon: <DollarSign className="w-5 h-5 text-[#10B981]" />, value: '₹ 2.4Cr', label: 'Total CSR Budget' },
    { icon: <FolderOpen className="w-5 h-5 text-[#10B981]" />, value: projects.length.toString(), label: 'Active Projects' },
    { icon: <Users className="w-5 h-5 text-[#10B981]" />, value: '4.2K', label: 'Beneficiaries' },
    { icon: <TrendingUp className="w-5 h-5 text-[#10B981]" />, value: '₹30.3L', label: 'Spent This Year' },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-6 py-6">
      <div className="max-w-[1280px] mx-auto">

        {/* ── Breadcrumb + Title ───────────────────────────────────────────── */}
        <p className="text-xs text-slate-400 mb-1">Dashboard &rsaquo; CSR</p>
        <h1 className="text-2xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'Hanken Grotesk, Inter, sans-serif' }}>
          Corporate Social Responsibility
        </h1>

        {/* ── KPI Cards ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {kpis.map(k => (
            <div key={k.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#ECFDF5] flex items-center justify-center shrink-0">
                {k.icon}
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 leading-tight">{k.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{k.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Charts row ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-6">

          {/* Annual Impact Trajectory */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-800 text-[15px]" style={{ fontFamily: 'Hanken Grotesk, Inter, sans-serif' }}>
                Annual Impact Trajectory
              </h2>
              <span className="text-[11px] bg-[#ECFDF5] text-[#064E3B] font-semibold px-2.5 py-0.5 rounded-full">
                ₹ Impact
              </span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={IMPACT_DATA} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} unit="L" />
                <Tooltip
                  formatter={v => [`₹${v}L`, 'Impact']}
                  contentStyle={{ fontSize: 11, borderRadius: 10, border: '1px solid #E2E8F0' }}
                />
                <Line
                  type="monotone"
                  dataKey="impact"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#10B981', strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  name="Impact (₹L)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Donor Summary Donut */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-semibold text-slate-800 text-[15px] mb-4" style={{ fontFamily: 'Hanken Grotesk, Inter, sans-serif' }}>
              Donor Summary
            </h2>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={DONOR_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  dataKey="value"
                  paddingAngle={2}
                  strokeWidth={2}
                  stroke="#fff"
                >
                  {DONOR_DATA.map((_, i) => (
                    <Cell key={i} fill={DONOR_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={v => [`${v}%`]} contentStyle={{ fontSize: 11, borderRadius: 10 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 space-y-1.5">
              {DONOR_DATA.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: DONOR_COLORS[i] }} />
                  <span className="text-[11px] text-slate-600 flex-1">{d.name}</span>
                  <span className="text-[11px] font-bold text-slate-800">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Active Projects Table ────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-800 text-[15px]" style={{ fontFamily: 'Hanken Grotesk, Inter, sans-serif' }}>
              Active Projects
            </h2>
            <button
              onClick={() => setShowForm(v => !v)}
              className="flex items-center gap-1.5 bg-[#064E3B] text-white text-xs font-semibold px-3.5 py-2 rounded-lg hover:bg-[#065F46] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Project
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {['PROJECT NAME', 'CATEGORY', 'BUDGET (₹)', 'SPENT (₹)', 'STATUS', 'ACTIONS'].map(h => (
                    <th key={h} className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider pb-3 pr-4 last:pr-0">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projects.map(p => (
                  <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 pr-4 font-medium text-slate-800 text-xs">{p.name}</td>
                    <td className="py-3 pr-4 text-xs text-slate-500">{p.category}</td>
                    <td className="py-3 pr-4 text-xs text-slate-700 font-mono">{fmt(p.budget)}</td>
                    <td className="py-3 pr-4 text-xs text-slate-700 font-mono">{fmt(p.spent)}</td>
                    <td className="py-3 pr-4"><StatusBadge status={p.status} /></td>
                    <td className="py-3">
                      <button className="text-[11px] text-[#10B981] hover:underline font-medium">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Add New CSR Activity Form ────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <button
            className="flex items-center justify-between w-full"
            onClick={() => setShowForm(v => !v)}
          >
            <h2 className="font-semibold text-slate-800 text-[15px]" style={{ fontFamily: 'Hanken Grotesk, Inter, sans-serif' }}>
              New CSR Activity
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#10B981] font-semibold">+ Add Activity</span>
              {showForm ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
          </button>

          {showForm && (
            <div className="mt-5 border-t border-slate-100 pt-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Activity Name */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Activity Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Tree Plantation Drive"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
                  />
                </div>
                {/* Category */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
                  >
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                {/* Financial Year */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Financial Year</label>
                  <select
                    name="fy"
                    value={form.fy}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
                  >
                    {FY_OPTIONS.map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
                {/* Budget */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Budget (₹ in Lakhs)</label>
                  <input
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    type="number"
                    placeholder="e.g. 5.5"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
                  />
                </div>
                {/* Implementing Agency */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Implementing Agency</label>
                  <input
                    name="agency"
                    value={form.agency}
                    onChange={handleChange}
                    placeholder="e.g. NGO Samridhi"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
                  />
                </div>
                {/* Status */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
                  >
                    {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                {/* Start Date */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Start Date</label>
                  <input
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    type="date"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
                  />
                </div>
                {/* End Date */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">End Date</label>
                  <input
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    type="date"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
                  />
                </div>
                {/* Description */}
                <div className="md:col-span-2 lg:col-span-1">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Brief description of the activity..."
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#10B981]/30 resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button
                  onClick={handleSave}
                  className="bg-[#064E3B] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#065F46] transition-colors"
                >
                  Save Activity
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-slate-500 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
