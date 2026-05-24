import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { Users, UserCheck, BookOpen, TrendingDown, ChevronDown, ChevronUp, Plus } from 'lucide-react'

// ── Sample data ────────────────────────────────────────────────────────────────
const DEPT_DATA = [
  { dept: 'Operations', count: 380 },
  { dept: 'Sales', count: 210 },
  { dept: 'HR', count: 95 },
  { dept: 'Finance', count: 120 },
  { dept: 'IT', count: 310 },
  { dept: 'Legal', count: 133 },
]

const GENDER_DATA = [
  { name: 'Male', value: 62 },
  { name: 'Female', value: 38 },
]
const GENDER_COLORS = ['#064E3B', '#10B981']

const STAKEHOLDERS = [
  { type: 'Employees', count: 1248, frequency: 'Monthly', lastEngagement: '15 May 2026', status: 'Active' },
  { type: 'Suppliers', count: 87, frequency: 'Quarterly', lastEngagement: '01 Apr 2026', status: 'Active' },
  { type: 'Customers', count: 3420, frequency: 'Ongoing', lastEngagement: '22 May 2026', status: 'Active' },
  { type: 'Community', count: 540, frequency: 'Bi-Annual', lastEngagement: '10 Feb 2026', status: 'Review' },
  { type: 'Investors', count: 34, frequency: 'Quarterly', lastEngagement: '31 Mar 2026', status: 'Active' },
]

const WELLBEING_TYPES = ['Health Camp', 'Mental Wellness', 'Sports', 'Other']
const TRAINING_TYPES = ['Technical', 'Soft Skills', 'Safety', 'Leadership']
const COMMUNITY_TYPES = ['Awareness Drive', 'Skill Training', 'Infrastructure', 'Health', 'Other']

function StatusBadge({ status }) {
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
      status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
    }`}>
      {status}
    </span>
  )
}

function CollapsibleSection({ title, badge, open, onToggle, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
      <button
        className="flex items-center justify-between w-full px-6 py-4"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-slate-800 text-[15px]" style={{ fontFamily: 'Hanken Grotesk, Inter, sans-serif' }}>
            {title}
          </h3>
          {badge && (
            <span className="text-[10px] bg-[#ECFDF5] text-[#064E3B] font-semibold px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && <div className="px-6 pb-6 border-t border-slate-100">{children}</div>}
    </div>
  )
}

export default function Social() {
  // Section open states
  const [openSection, setOpenSection] = useState(null)
  const toggle = key => setOpenSection(k => (k === key ? null : key))

  // Wellbeing form + rows
  const [wellbeing, setWellbeing] = useState({ type: WELLBEING_TYPES[0], date: '', participants: '', description: '', outcome: '' })
  const [wellbeingRows, setWellbeingRows] = useState([])

  // Training form + rows
  const [training, setTraining] = useState({ program: '', type: TRAINING_TYPES[0], date: '', duration: '', participants: '', trainer: '' })
  const [trainingRows, setTrainingRows] = useState([])

  // Community form + rows
  const [community, setCommunity] = useState({ name: '', type: COMMUNITY_TYPES[0], date: '', beneficiaries: '', location: '', budget: '', description: '' })
  const [communityRows, setCommunityRows] = useState([])

  function logWellbeing() {
    if (!wellbeing.date) return
    setWellbeingRows(r => [...r, { ...wellbeing, id: Date.now() }])
    setWellbeing({ type: WELLBEING_TYPES[0], date: '', participants: '', description: '', outcome: '' })
  }

  function logTraining() {
    if (!training.program.trim()) return
    setTrainingRows(r => [...r, { ...training, id: Date.now() }])
    setTraining({ program: '', type: TRAINING_TYPES[0], date: '', duration: '', participants: '', trainer: '' })
  }

  function logCommunity() {
    if (!community.name.trim()) return
    setCommunityRows(r => [...r, { ...community, id: Date.now() }])
    setCommunity({ name: '', type: COMMUNITY_TYPES[0], date: '', beneficiaries: '', location: '', budget: '', description: '' })
  }

  const kpis = [
    { icon: <Users className="w-5 h-5 text-[#10B981]" />, value: '1,248', label: 'Total Employees' },
    { icon: <UserCheck className="w-5 h-5 text-[#10B981]" />, value: '38%', label: 'Women Employees' },
    { icon: <BookOpen className="w-5 h-5 text-[#10B981]" />, value: '4.2K', label: 'Training Hours' },
    { icon: <TrendingDown className="w-5 h-5 text-[#10B981]" />, value: '8.4%', label: 'Turnover Rate' },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-6 py-6">
      <div className="max-w-[1280px] mx-auto">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <p className="text-xs text-slate-400 mb-1">Dashboard &rsaquo; Social</p>
        <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Hanken Grotesk, Inter, sans-serif' }}>
          Social
        </h1>
        <p className="text-sm text-slate-500 mb-6">Employee &amp; Community Impact</p>

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

          {/* Workforce by Department — Bar Chart */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-semibold text-slate-800 text-[15px] mb-4" style={{ fontFamily: 'Hanken Grotesk, Inter, sans-serif' }}>
              Workforce by Department
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={DEPT_DATA} barSize={28} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis
                  dataKey="dept"
                  tick={{ fontSize: 10, fill: '#94A3B8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={v => [v, 'Employees']}
                  contentStyle={{ fontSize: 11, borderRadius: 10, border: '1px solid #E2E8F0' }}
                />
                <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} name="Employees" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gender Diversity Donut */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-semibold text-slate-800 text-[15px] mb-4" style={{ fontFamily: 'Hanken Grotesk, Inter, sans-serif' }}>
              Gender Diversity
            </h2>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={GENDER_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={72}
                  dataKey="value"
                  paddingAngle={3}
                  strokeWidth={2}
                  stroke="#fff"
                >
                  {GENDER_DATA.map((_, i) => (
                    <Cell key={i} fill={GENDER_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={v => [`${v}%`]} contentStyle={{ fontSize: 11, borderRadius: 10 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-3 space-y-1.5">
              {GENDER_DATA.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: GENDER_COLORS[i] }} />
                  <span className="text-[11px] text-slate-600 flex-1">{d.name}</span>
                  <span className="text-[11px] font-bold text-slate-800">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Stakeholder Table ────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-slate-800 text-[15px] mb-5" style={{ fontFamily: 'Hanken Grotesk, Inter, sans-serif' }}>
            Type of Stakeholder
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {['STAKEHOLDER TYPE', 'COUNT', 'ENGAGEMENT FREQUENCY', 'LAST ENGAGEMENT', 'STATUS'].map(h => (
                    <th key={h} className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider pb-3 pr-4 last:pr-0">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {STAKEHOLDERS.map(s => (
                  <tr key={s.type} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 pr-4 font-medium text-slate-800 text-xs">{s.type}</td>
                    <td className="py-3 pr-4 text-xs text-slate-700 font-semibold">{s.count.toLocaleString()}</td>
                    <td className="py-3 pr-4 text-xs text-slate-500">{s.frequency}</td>
                    <td className="py-3 pr-4 text-xs text-slate-500">{s.lastEngagement}</td>
                    <td className="py-3"><StatusBadge status={s.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Accordion Sections ──────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Form 1: Employee Wellbeing */}
          <CollapsibleSection
            title="Employee Wellbeing Activity"
            badge="Log Activity"
            open={openSection === 'wellbeing'}
            onToggle={() => toggle('wellbeing')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Activity Type</label>
                <select
                  value={wellbeing.type}
                  onChange={e => setWellbeing(f => ({ ...f, type: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
                >
                  {WELLBEING_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Date</label>
                <input
                  type="date"
                  value={wellbeing.date}
                  onChange={e => setWellbeing(f => ({ ...f, date: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Participants</label>
                <input
                  type="number"
                  value={wellbeing.participants}
                  onChange={e => setWellbeing(f => ({ ...f, participants: e.target.value }))}
                  placeholder="e.g. 80"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
                <input
                  value={wellbeing.description}
                  onChange={e => setWellbeing(f => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Outcome</label>
                <input
                  value={wellbeing.outcome}
                  onChange={e => setWellbeing(f => ({ ...f, outcome: e.target.value }))}
                  placeholder="e.g. Improved morale"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
                />
              </div>
            </div>
            <button
              onClick={logWellbeing}
              className="mt-4 flex items-center gap-1.5 bg-[#064E3B] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#065F46] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Log Activity
            </button>
            {wellbeingRows.length > 0 && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {['TYPE', 'DATE', 'PARTICIPANTS', 'OUTCOME'].map(h => (
                        <th key={h} className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider pb-2 pr-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {wellbeingRows.map(r => (
                      <tr key={r.id} className="border-b border-slate-50 last:border-0">
                        <td className="py-2 pr-3 text-slate-700">{r.type}</td>
                        <td className="py-2 pr-3 text-slate-500">{r.date}</td>
                        <td className="py-2 pr-3 text-slate-700">{r.participants}</td>
                        <td className="py-2 text-slate-500">{r.outcome}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CollapsibleSection>

          {/* Form 2: Training & Development */}
          <CollapsibleSection
            title="Training & Development Activity"
            badge="Log Training"
            open={openSection === 'training'}
            onToggle={() => toggle('training')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Training Program</label>
                <input
                  value={training.program}
                  onChange={e => setTraining(f => ({ ...f, program: e.target.value }))}
                  placeholder="e.g. Fire Safety Awareness"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Type</label>
                <select
                  value={training.type}
                  onChange={e => setTraining(f => ({ ...f, type: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
                >
                  {TRAINING_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Date</label>
                <input
                  type="date"
                  value={training.date}
                  onChange={e => setTraining(f => ({ ...f, date: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Duration (hours)</label>
                <input
                  type="number"
                  value={training.duration}
                  onChange={e => setTraining(f => ({ ...f, duration: e.target.value }))}
                  placeholder="e.g. 8"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Participants</label>
                <input
                  type="number"
                  value={training.participants}
                  onChange={e => setTraining(f => ({ ...f, participants: e.target.value }))}
                  placeholder="e.g. 45"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Trainer</label>
                <input
                  value={training.trainer}
                  onChange={e => setTraining(f => ({ ...f, trainer: e.target.value }))}
                  placeholder="Name or organisation"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
                />
              </div>
            </div>
            <button
              onClick={logTraining}
              className="mt-4 flex items-center gap-1.5 bg-[#064E3B] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#065F46] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Log Training
            </button>
            {trainingRows.length > 0 && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {['PROGRAM', 'TYPE', 'DATE', 'DURATION', 'PARTICIPANTS'].map(h => (
                        <th key={h} className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider pb-2 pr-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {trainingRows.map(r => (
                      <tr key={r.id} className="border-b border-slate-50 last:border-0">
                        <td className="py-2 pr-3 text-slate-700 font-medium">{r.program}</td>
                        <td className="py-2 pr-3 text-slate-500">{r.type}</td>
                        <td className="py-2 pr-3 text-slate-500">{r.date}</td>
                        <td className="py-2 pr-3 text-slate-700">{r.duration}h</td>
                        <td className="py-2 text-slate-700">{r.participants}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CollapsibleSection>

          {/* Form 3: Community Engagement */}
          <CollapsibleSection
            title="Community Engagement Activity"
            badge="Log Activity"
            open={openSection === 'community'}
            onToggle={() => toggle('community')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Activity Name</label>
                <input
                  value={community.name}
                  onChange={e => setCommunity(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Village Health Camp"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Type</label>
                <select
                  value={community.type}
                  onChange={e => setCommunity(f => ({ ...f, type: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
                >
                  {COMMUNITY_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Date</label>
                <input
                  type="date"
                  value={community.date}
                  onChange={e => setCommunity(f => ({ ...f, date: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Beneficiaries</label>
                <input
                  type="number"
                  value={community.beneficiaries}
                  onChange={e => setCommunity(f => ({ ...f, beneficiaries: e.target.value }))}
                  placeholder="e.g. 250"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Location</label>
                <input
                  value={community.location}
                  onChange={e => setCommunity(f => ({ ...f, location: e.target.value }))}
                  placeholder="e.g. Anand, Gujarat"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Budget (₹)</label>
                <input
                  type="number"
                  value={community.budget}
                  onChange={e => setCommunity(f => ({ ...f, budget: e.target.value }))}
                  placeholder="e.g. 50000"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
                <textarea
                  value={community.description}
                  onChange={e => setCommunity(f => ({ ...f, description: e.target.value }))}
                  rows={2}
                  placeholder="Brief description of the activity..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/30 resize-none"
                />
              </div>
            </div>
            <button
              onClick={logCommunity}
              className="mt-4 flex items-center gap-1.5 bg-[#064E3B] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#065F46] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Log Activity
            </button>
            {communityRows.length > 0 && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {['ACTIVITY', 'TYPE', 'DATE', 'BENEFICIARIES', 'LOCATION'].map(h => (
                        <th key={h} className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider pb-2 pr-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {communityRows.map(r => (
                      <tr key={r.id} className="border-b border-slate-50 last:border-0">
                        <td className="py-2 pr-3 text-slate-700 font-medium">{r.name}</td>
                        <td className="py-2 pr-3 text-slate-500">{r.type}</td>
                        <td className="py-2 pr-3 text-slate-500">{r.date}</td>
                        <td className="py-2 pr-3 text-slate-700">{r.beneficiaries}</td>
                        <td className="py-2 text-slate-500">{r.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CollapsibleSection>

        </div>
      </div>
    </div>
  )
}
