/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import { Plus, X, ArrowLeft, ClipboardList, Users, Percent, Clock, IndianRupee, Pencil, Trash2 } from 'lucide-react'

// ── Dashboard data ─────────────────────────────────────────────────────────────
const ACTIVITY_TREND = [
  { month: 'Apr', sessions: 8,  trained: 320 },
  { month: 'May', sessions: 10, trained: 280 },
  { month: 'Jun', sessions: 7,  trained: 350 },
  { month: 'Jul', sessions: 12, trained: 420 },
  { month: 'Aug', sessions: 9,  trained: 380 },
  { month: 'Sep', sessions: 11, trained: 410 },
  { month: 'Oct', sessions: 8,  trained: 290 },
  { month: 'Nov', sessions: 10, trained: 360 },
]

const GENDER_DATA = [
  { name: 'Female', value: 1340, pct: 47.5, color: '#10B981' },
  { name: 'Male',   value: 1446, pct: 51.1, color: '#064E3B' },
  { name: 'Other',  value: 54,   pct: 1.2,  color: '#6EE7B7' },
]

const ACTIVITY_TYPES = [
  { name: 'Skill Development',  sessions: 26, hours: 2280, color: '#064E3B' },
  { name: 'Safety & EHS',       sessions: 22, hours: 1120, color: '#10B981' },
  { name: 'ESG Awareness',      sessions: 18, hours: 1280, color: '#34D399' },
  { name: 'Compliance & POSH',  sessions: 12, hours: 2280, color: '#FCD34D' },
  { name: 'Gender & DEI',       sessions: 10, hours: 780,  color: '#F87171' },
]
const MAX_SESSIONS = 26

const RECENT_ACTIVITIES = [
  { name: 'Excel Advanced — Data Analytics for HR', sub: 'Sat Dec · Online · 8 Nov to 14 Nov 2026', participants: 143, trainer: 'Prathana Mishra',       status: 'LIVE'     },
  { name: 'POSH Awareness & Refresher',             sub: 'Practitioner · Online · 8 Nov 2026',       participants: 320, trainer: 'Adv. Megha Sharma',     status: 'UPCOMING' },
  { name: 'Workplace Safety & First Aid',           sub: 'Training · Office · 8 Feb 2026',           participants: 186, trainer: 'Dr. John Sabutama',     status: 'DONE'     },
  { name: 'ESG & Sustainability 101',               sub: 'Training · Office · 10 May 2026',          participants: 340, trainer: 'Karan Joshi (Internal)', status: 'LIVE'     },
]

// ── Add Activity configuration ─────────────────────────────────────────────────
const ACTIVITY_TABS = [
  { key: 'training',  label: 'Training & Development'  },
  { key: 'wellbeing', label: 'Employee Wellbeing'       },
  { key: 'community', label: 'Community Engagement'     },
]

const STEPS = [
  { key: 'details',      label: 'Activity Details',   eyebrow: '01', hint: 'Name, type, description, mode' },
  { key: 'conducted',    label: 'Conducted By',       eyebrow: '02', hint: 'Internal or external trainer' },
  { key: 'timeline',     label: 'Timeline',           eyebrow: '03', hint: 'Date, time, duration, status' },
  { key: 'participants', label: 'Participants',       eyebrow: '04', hint: 'Gender-disaggregated reach' },
  { key: 'cost',         label: 'Cost',               eyebrow: '05', hint: 'Spend and cost snapshot' },
  { key: 'impact',       label: 'Impact & Outcome',   eyebrow: '06', hint: 'Outcomes, feedback, assessment' },
  { key: 'documents',    label: 'Documents & Proof',  eyebrow: '07', hint: 'Attendance, photos, certificates' },
]

const ASSESSMENT_TYPES = [
  { label: 'Knowledge Test',      color: '#064E3B', bg: '#E6F4F1' },
  { label: 'Practical Assessment',color: '#3B82F6', bg: '#EFF6FF' },
  { label: 'Feedback Survey',     color: '#F59E0B', bg: '#FFFBEB' },
  { label: 'Certificate Program', color: '#8B5CF6', bg: '#F5F3FF' },
]

const CATS = {
  training: [
    { label: 'Skill Development',  color: '#064E3B', bg: '#E6F4F1', icon: '📚' },
    { label: 'Safety & EHS',       color: '#10B981', bg: '#ECFDF5', icon: '🦺' },
    { label: 'ESG Awareness',      color: '#34D399', bg: '#F0FDF4', icon: '🌿' },
    { label: 'Compliance & POSH',  color: '#F59E0B', bg: '#FFFBEB', icon: '⚖️' },
    { label: 'Leadership',         color: '#3B82F6', bg: '#EFF6FF', icon: '🎯' },
    { label: 'Gender & DEI',       color: '#EC4899', bg: '#FDF2F8', icon: '💜' },
  ],
  wellbeing: [
    { label: 'Health & Wellness',  color: '#10B981', bg: '#ECFDF5', icon: '🏥' },
    { label: 'Sports Events',      color: '#3B82F6', bg: '#EFF6FF', icon: '⚽' },
    { label: 'Mental Well-being',  color: '#8B5CF6', bg: '#F5F3FF', icon: '🧠' },
    { label: 'Safety Drills',      color: '#F59E0B', bg: '#FFFBEB', icon: '🔥' },
    { label: 'Team Building',      color: '#EC4899', bg: '#FDF2F8', icon: '🤝' },
    { label: 'Other',              color: '#64748B', bg: '#F8FAFC', icon: '➕' },
  ],
  community: [
    { label: 'Awareness Drive',    color: '#064E3B', bg: '#E6F4F1', icon: '📢' },
    { label: 'Skill Training',     color: '#10B981', bg: '#ECFDF5', icon: '🎓' },
    { label: 'Infrastructure',     color: '#3B82F6', bg: '#EFF6FF', icon: '🏗️' },
    { label: 'Health Camp',        color: '#EF4444', bg: '#FEF2F2', icon: '💊' },
    { label: 'Environment',        color: '#34D399', bg: '#F0FDF4', icon: '🌱' },
    { label: 'Other',              color: '#64748B', bg: '#F8FAFC', icon: '➕' },
  ],
}

const MODES = ['Online', 'Offline', 'Hybrid']
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const EMPTY_FORM = {
  // Step 1
  program: 'Excel Advanced - Data Analytics for HR', mode: 'Hybrid', date: '2026-05-14', duration: '6',
  trainer: 'Pratiksha Mehta', location: 'Mumbai HO - Training Room B', description: 'Hands-on workshop covering Power Query, Pivot Tables, and dashboarding for HR analytics.',
  // Step 2
  conductedType: 'External', trainerEmail: 'pratiksha@learnsquare.in', trainerPhone: '+91 98765 12340', trainerFee: '48000',
  audienceScope: 'Employees', department: '', site: '', male: '65', female: '77', other: '', beneficiaries: '142',
  // Step 3
  startDate: '2026-05-14', endDate: '2026-05-14', startTime: '10:00 AM', frequency: 'One-time', sessions: '1', status: 'Planned',
  // Step 4
  registered: '', attended: '',
  // Step 5
  totalBudget: '48000', amountSpent: '48000', currency: 'INR', invoiceRef: 'PO-LS-2026-0418',
  // Step 7
  learningObjectives: '', assessmentType: '', impactNotes: '', feedbackRating: 0,
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    LIVE:     'bg-[#064E3B] text-white',
    UPCOMING: 'bg-[#10B981] text-white',
    DONE:     'bg-slate-200 text-slate-600',
  }
  return (
    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide ${map[status] ?? 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function Social() {
  const [chartPeriod, setChartPeriod] = useState('Monthly')
  const [cyYear,   setCyYear]   = useState('CY 2026')
  const [baseYear, setBaseYear] = useState('CY 2026 (Default)')

  // Add Activity modal state
  const [showAddActivity, setShowAddActivity] = useState(false)
  const [activityTab,  setActivityTab]  = useState('training')
  const [selectedCat,  setSelectedCat]  = useState('')
  const [form, setForm] = useState(EMPTY_FORM)
  const [currentStep, setCurrentStep]   = useState(0)
  const [docs, setDocs] = useState({ supporting: null, photos: null, certificates: null, evidence: null })

  // Saved activity rows (persisted to localStorage)
  const [savedRows, setSavedRows] = useState(() => {
    try {
      const raw = localStorage.getItem('kg_social_activities_v1')
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })
  useEffect(() => {
    try { localStorage.setItem('kg_social_activities_v1', JSON.stringify(savedRows)) } catch { /* ignore */ }
  }, [savedRows])
  const [recentActivities, setRecentActivities] = useState([])

  function deleteRow(id) { setSavedRows(r => r.filter(x => x.id !== id)) }
  function deleteRecent(i) { setRecentActivities(r => r.filter((_, idx) => idx !== i)) }

  function openAdd() {
    setActivityTab('training')
    setSelectedCat('Skill')
    setForm(EMPTY_FORM)
    setCurrentStep(0)
    setDocs({ supporting: null, photos: null, certificates: null, evidence: null })
    setShowAddActivity(true)
  }

  function handleSave() {
    const total = (parseInt(form.male) || 0) + (parseInt(form.female) || 0) + (parseInt(form.other) || 0)
    setSavedRows(r => [...r, {
      id: Date.now(), type: activityTab, cat: selectedCat,
      program: form.program, date: form.date, mode: form.mode,
      duration: form.duration, male: form.male, female: form.female,
      total, trainer: form.trainer, location: form.location,
      status: 'LIVE',
    }])
    setShowAddActivity(false)
  }

  // Aggregates derived from the user's saved activities
  const empTrained   = savedRows.reduce((s, r) => s + (parseInt(r.total) || 0), 0)
  const femaleAgg    = savedRows.reduce((s, r) => s + (parseInt(r.female) || 0), 0)
  const maleAgg      = savedRows.reduce((s, r) => s + (parseInt(r.male) || 0), 0)
  const otherAgg     = Math.max(0, empTrained - femaleAgg - maleAgg)
  const trainingHrs  = savedRows.reduce((s, r) => s + (parseFloat(r.duration) || 0), 0)
  const femalePctAgg = empTrained ? Math.round((femaleAgg / empTrained) * 100) : 0
  const pct = v => (empTrained ? +((v / empTrained) * 100).toFixed(1) : 0)
  const genderAgg = [
    { name: 'Female', value: femaleAgg, pct: pct(femaleAgg), color: '#10B981' },
    { name: 'Male',   value: maleAgg,   pct: pct(maleAgg),   color: '#064E3B' },
    { name: 'Other',  value: otherAgg,  pct: pct(otherAgg),  color: '#6EE7B7' },
  ]
  const trendData = MONTHS_SHORT.map(m => {
    const rows = savedRows.filter(r => (r.date || '').toLowerCase().includes(m.toLowerCase()))
    return { month: m, sessions: rows.length, trained: rows.reduce((s, r) => s + (parseInt(r.total) || 0), 0) }
  })

  const kpis = [
    { Icon: ClipboardList,  value: String(savedRows.length),  label: 'Total Activities',     sub: 'This year'         },
    { Icon: Users,          value: empTrained.toLocaleString(), label: 'Employees Trained',  sub: 'Across activities' },
    { Icon: Percent,        value: `${femalePctAgg}%`,        label: 'Female Participation', sub: 'Of total trained'  },
    { Icon: Clock,          value: String(trainingHrs),       label: 'Training Hours',       sub: 'Total'             },
    { Icon: IndianRupee,    value: '₹0',                      label: 'Total Spend',          sub: '—'                 },
  ]

  const totalParticipants = (parseInt(form.male) || 0) + (parseInt(form.female) || 0) + (parseInt(form.other) || 0)
  const femalePct = totalParticipants > 0 ? Math.round(((parseInt(form.female) || 0) / totalParticipants) * 100) : 0
  const malePct   = totalParticipants > 0 ? Math.round(((parseInt(form.male)   || 0) / totalParticipants) * 100) : 0
  const donutData = [
    { name: 'Female', value: parseInt(form.female) || 0, color: '#10B981' },
    { name: 'Male',   value: parseInt(form.male)   || 0, color: '#064E3B' },
    { name: 'Other',  value: parseInt(form.other)  || 0, color: '#6EE7B7' },
  ]

  useEffect(() => {
    if (showAddActivity) {
      document.getElementById('social-add-activity-overlay')?.scrollTo({ top: 0 })
    }
  }, [currentStep, showAddActivity])

  return (
    <>
    <div className="min-h-screen bg-[#F8FAFC] px-8 py-6">
      <div className="w-full">

        {/* ── Top bar ─────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <button
                className="bg-[#064E3B] text-white text-sm font-semibold px-5 py-2 rounded-xl shadow-sm"
              >
                Dashboard
              </button>
              <button
                onClick={openAdd}
                className="bg-white border border-slate-200 text-slate-700 text-sm font-semibold px-5 py-2 rounded-xl flex items-center gap-1.5 hover:border-[#064E3B] hover:text-[#064E3B] transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Activity
              </button>
            </div>
            <h1 className="text-3xl font-bold text-[#111827]" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
              Employee Wellbeing &amp; Learning
            </h1>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400 uppercase tracking-wide whitespace-nowrap">Current Year</span>
              <select value={cyYear} onChange={e => setCyYear(e.target.value)}
                className="bg-transparent text-slate-700 font-semibold text-xs outline-none cursor-pointer">
                <option>CY 2026</option>
                <option>FY 2026</option>
                <option>CY 2025</option>
              </select>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400 uppercase tracking-wide whitespace-nowrap">Baseline Year (Optional)</span>
              <select value={baseYear} onChange={e => setBaseYear(e.target.value)}
                className="bg-transparent text-slate-700 font-semibold text-xs outline-none cursor-pointer">
                <option>CY 2026 (Default)</option>
                <option>CY 2025</option>
                <option>CY 2024</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── KPI Cards ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {kpis.map(k => (
            <div key={k.label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 border-l-4 border-l-[#064E3B]">
              <div className="w-8 h-8 rounded-lg bg-[#E6F4F1] flex items-center justify-center mb-3">
                <k.Icon className="w-4 h-4 text-[#064E3B]" />
              </div>
              <p className="text-2xl font-bold text-slate-900 leading-tight" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
                {k.value}
              </p>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mt-1">{k.label}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{k.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Charts row ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-5 gap-5 mb-6">
          <div className="col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-start justify-between mb-1">
              <div>
                <h2 className="font-semibold text-slate-800 text-[15px]" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
                  Activity &amp; Participation Trend
                </h2>
                <p className="text-[10px] text-slate-400 mt-0.5">Sessions delivered and employees trained this financial year</p>
              </div>
            </div>
            <div className="mt-4">
              <ResponsiveContainer width="100%" height={220}>
                <ComposedChart data={trendData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left"  tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 10, border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }} />
                  <Bar yAxisId="left" dataKey="sessions" name="Sessions Delivered" fill="#10B981" radius={[3, 3, 0, 0]} opacity={0.85} barSize={22} />
                  <Line yAxisId="right" type="monotone" dataKey="trained" name="Employees Trained"
                    stroke="#064E3B" strokeWidth={2.5} dot={{ r: 3, fill: '#064E3B', strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-5 mt-3 px-1">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-3 rounded-sm bg-[#10B981] opacity-85" />
                <span className="text-[10px] text-slate-500">Sessions Delivered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-0.5 rounded-full bg-[#064E3B]" />
                <span className="text-[10px] text-slate-500">Employees Trained</span>
              </div>
            </div>
          </div>

          <div className="col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-semibold text-slate-800 text-[15px]" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
                Gender Participation
              </h2>
              <span className="text-[11px] bg-[#E6F4F1] text-[#064E3B] font-semibold px-2.5 py-0.5 rounded-full">{empTrained.toLocaleString()}</span>
            </div>
            <p className="text-[10px] text-slate-400 mb-4">{empTrained.toLocaleString()} total trained</p>
            <div className="relative mx-auto" style={{ width: 160, height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={genderAgg} cx="50%" cy="50%" innerRadius={54} outerRadius={72}
                    dataKey="value" strokeWidth={2} stroke="#fff" paddingAngle={2} startAngle={90} endAngle={-270}>
                    {genderAgg.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v.toLocaleString(), n]} contentStyle={{ fontSize: 11, borderRadius: 10, border: '1px solid #E2E8F0' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-[#064E3B] leading-none" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>{empTrained.toLocaleString()}</span>
                <span className="text-[9px] text-slate-400 tracking-wide mt-0.5">total trained</span>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {genderAgg.map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                  <span className="text-xs text-slate-600 flex-1">{d.name}</span>
                  <span className="text-[11px] font-semibold text-slate-800">{d.value.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 w-10 text-right">{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Activity Type Distribution ───────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-800 text-[15px]" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
              Activity Type Distribution
            </h2>
            <select className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600 outline-none bg-white">
              <option>Compare with FY</option>
              <option>FY 2024-25</option>
              <option>FY 2023-24</option>
            </select>
          </div>
          <div className="space-y-4">
            {ACTIVITY_TYPES.map(t => {
              const pct = Math.round((t.sessions / MAX_SESSIONS) * 100)
              return (
                <div key={t.name} className="flex items-center gap-4">
                  <p className="text-xs text-slate-600 w-40 shrink-0">{t.name}</p>
                  <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: t.color }} />
                  </div>
                  <p className="text-xs text-slate-700 font-semibold w-20 shrink-0 text-right">{t.sessions} sessions</p>
                  <p className="text-[10px] text-slate-400 w-20 shrink-0 text-right">{t.hours.toLocaleString()} hrs</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Recent & Top Activities ──────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-800 text-[15px]" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
              Recent &amp; Top Activities
            </h2>
            <button onClick={openAdd} className="text-xs text-[#10B981] font-semibold hover:underline">View All</button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {['ACTIVITY NAME', 'PARTICIPANTS', 'TRAINER', 'STATUS', ''].map(h => (
                  <th key={h} className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider pb-3 pr-6 last:pr-0">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...savedRows.map(r => ({
                name: r.program || r.cat, sub: `${r.date} · ${r.mode}`,
                participants: r.total, trainer: r.trainer, status: 'LIVE', _id: r.id, _saved: true,
              })), ...recentActivities.map((a, i) => ({ ...a, _idx: i, _saved: false }))].map((a, i) => (
                <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 pr-6">
                    <p className="font-semibold text-slate-800 text-xs leading-tight">{a.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{a.sub}</p>
                  </td>
                  <td className="py-3 pr-6">
                    <p className="text-xs font-semibold text-slate-800">{a.participants}</p>
                    <div className="w-16 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-[#10B981] rounded-full" style={{ width: `${Math.round((a.participants / 340) * 100)}%` }} />
                    </div>
                  </td>
                  <td className="py-3 pr-6">
                    <p className="text-xs font-semibold text-slate-800">{a.trainer}</p>
                  </td>
                  <td className="py-3 pr-6"><StatusBadge status={a.status} /></td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={openAdd}
                        className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-slate-600 hover:border-[#064E3B] hover:text-[#064E3B] transition-colors">
                        <Pencil className="w-3 h-3" /> Edit
                      </button>
                      <button onClick={() => a._saved ? deleteRow(a._id) : deleteRecent(a._idx)}
                        className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-slate-400 hover:border-red-200 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>

    {/* ═══════════════════════════════════════════════════════════════════════════
        ADD ACTIVITY — FULL SCREEN OVERLAY — 8-STEP WIZARD
    ═══════════════════════════════════════════════════════════════════════════ */}
    {showAddActivity && (
      <div id="social-add-activity-overlay" className="fixed inset-0 z-50 overflow-y-auto bg-[#F3F6FA]">

        {/* Sticky header */}
        <div className="hidden">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowAddActivity(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
              <ArrowLeft className="w-4 h-4 text-slate-500" />
            </button>
            <div>
              <p className="text-xs text-slate-400">Dashboard › Social › <span className="text-[#064E3B] font-semibold">Add Activity</span></p>
              <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
                Employee Wellbeing &amp; Learning Activity
              </h2>
            </div>
          </div>
          <button onClick={() => setShowAddActivity(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Body: left sidebar steps + right content */}
        <div className="px-8 py-7">
          <div className="mb-8 flex items-center justify-between">
            <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              <button onClick={() => setShowAddActivity(false)}
                className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-slate-700 hover:text-[#064E3B] hover:bg-[#064E3B]/5 transition-colors">
                <span className="text-base leading-none">▦</span>
                Dashboard
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-[#064E3B] px-5 py-2.5 text-sm font-bold text-white shadow-sm">
                <Plus className="h-4 w-4" />
                Add Activity
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 shadow-sm">
                Save Draft
              </button>
              <button onClick={handleSave} className="rounded-xl bg-[#064E3B] px-6 py-2.5 text-sm font-bold text-white shadow-sm">
                Submit
              </button>
            </div>
          </div>
          <h2 className="mb-10 text-3xl font-bold text-slate-950" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
            Employee Wellbeing &amp; Learning Activity
          </h2>

        <div className="flex items-start gap-8">

          {/* ── LEFT SIDEBAR — 8 steps ── */}
          <div className="w-80 shrink-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Activity Wizard
            </p>
            <p className="mt-2 text-lg font-bold text-slate-950">7 steps · ~4 min</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-[#10B981]" style={{ width: `${Math.round((currentStep / (STEPS.length - 1)) * 100)}%` }} />
              </div>
              <span className="text-sm font-bold text-[#10B981]">{Math.round((currentStep / (STEPS.length - 1)) * 100)}%</span>
            </div>
            <div className="my-6 h-px bg-slate-200" />
            {STEPS.map((step, idx) => {
              const isActive   = currentStep === idx
              const isComplete = idx < currentStep
              return (
                <button
                  key={step.key}
                  onClick={() => setCurrentStep(idx)}
                  className={`mb-2 flex w-full items-center gap-4 rounded-xl px-3 py-3 text-left transition-all ${
                    isActive
                      ? 'bg-[#E6F8F3] text-[#064E3B]'
                      : isComplete
                      ? 'text-slate-700 hover:bg-slate-50'
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                    isActive   ? 'bg-white/20 text-white' :
                    isComplete ? 'bg-[#064E3B] text-white' :
                                 'bg-slate-200 text-slate-500'
                  }`}>
                    {isComplete ? '✓' : idx + 1}
                  </span>
                  <span className="text-sm font-semibold">{step.label}</span>
                </button>
              )
            })}
          </div>

          {/* ── RIGHT CONTENT — scrollable step panel ── */}
          <div className="min-w-0 flex-1">
            <div className="space-y-6">

              {/* ──────────────────────────── STEP 1: Activity Details ── */}
              {currentStep === 0 && (<>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex min-h-44 items-start justify-between border-b border-slate-200 bg-[#FAFBFC] px-8 py-8">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#10B981]">Step 1 of 7</p>
                      <h3 className="mt-3 text-2xl font-bold text-slate-950" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
                        Activity Details
                      </h3>
                    </div>
                    <span className="rounded-lg bg-[#064E3B] px-4 py-2 text-sm font-bold text-white">01</span>
                  </div>

                  <div className="space-y-6 px-8 py-8">
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">Activity Name <span className="text-rose-500">*</span></label>
                      <input value={form.program}
                        onChange={e => setForm(f => ({ ...f, program: e.target.value }))}
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all" />
                      <p className="mt-2 text-xs text-slate-500">Use a name your team will recognize in the calendar & reports.</p>
                    </div>

                    <div>
                      <p className="mb-3 text-sm font-bold text-slate-700">Activity Type <span className="text-rose-500">*</span></p>
                      <div className="grid grid-cols-5 gap-4">
                        {[
                          { label: 'ESG', sub: 'Sustainability awareness', icon: '○' },
                          { label: 'Safety', sub: 'EHS, first aid', icon: '⬡' },
                          { label: 'Skill', sub: 'Functional, tech', icon: '<>' },
                          { label: 'Compliance', sub: 'POSH, regulatory', icon: '□' },
                          { label: 'Gender / DEI', sub: 'Inclusion, allyship', icon: '♙' },
                        ].map(type => {
                          const isSelected = selectedCat === type.label
                          return (
                            <button key={type.label}
                              onClick={() => setSelectedCat(type.label)}
                              className={`min-h-36 rounded-xl border-2 p-5 text-left transition-all ${isSelected ? 'border-[#10B981] bg-[#E6F8F3] shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                              <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-[#BFF7EA] text-sm font-bold text-[#0F766E]">{type.icon}</span>
                              <span className="block text-base font-bold text-slate-950">{type.label}</span>
                              <span className="mt-2 block text-sm text-slate-500">{type.sub}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">Description</label>
                      <textarea value={form.description}
                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                        rows={4}
                        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all" />
                      <p className="mt-2 text-xs text-slate-500">Keep it concise - under 200 words works best.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="mb-2 block text-sm font-bold text-slate-700">Mode <span className="text-rose-500">*</span></label>
                        <div className="flex h-12 rounded-xl bg-slate-100 p-1">
                          {MODES.map(mode => (
                            <button key={mode}
                              onClick={() => setForm(f => ({ ...f, mode }))}
                              className={`flex-1 rounded-lg text-sm font-bold transition-all ${form.mode === mode ? 'bg-white text-slate-950 shadow ring-2 ring-slate-950' : 'text-slate-500'}`}>
                              {mode}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-bold text-slate-700">Location <span className="text-rose-500">*</span></label>
                        <input value={form.location}
                          onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                          className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all" />
                        <p className="mt-2 text-xs text-slate-500">Shown because mode is Offline or Hybrid.</p>
                      </div>
                    </div>

                    <div className="max-w-xl">
                      <label className="mb-2 block text-sm font-bold text-slate-700">Meeting Link (optional)</label>
                      <input value="meet.impactone.app/excel-may26" readOnly
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-sm focus:outline-none" />
                    </div>
                  </div>
                </div>
              </>)}

              {currentStep === 88 && (<>
                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-1" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
                    Activity Details
                  </h3>
                  <p className="text-xs text-slate-400 mb-5">Select the type, category, and core details of this activity</p>

                  {/* Activity type tabs */}
                  <div className="flex gap-2 mb-5">
                    {ACTIVITY_TABS.map(tab => (
                      <button key={tab.key}
                        onClick={() => { setActivityTab(tab.key); setSelectedCat('') }}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                          activityTab === tab.key
                            ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-sm'
                            : 'border-slate-200 text-slate-600 bg-white hover:border-[#064E3B] hover:text-[#064E3B]'
                        }`}>
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Category cards */}
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Select Category</p>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {CATS[activityTab].map(cat => (
                      <button key={cat.label}
                        onClick={() => setSelectedCat(selectedCat === cat.label ? '' : cat.label)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all ${
                          selectedCat === cat.label
                            ? 'shadow-md ring-2 ring-[#064E3B]/10'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                        }`}
                        style={selectedCat === cat.label
                          ? { borderColor: cat.color, background: `${cat.color}12` }
                          : {}}
                      >
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 text-lg"
                          style={{ background: cat.bg }}>
                          <span style={{ filter: 'none' }}>{cat.icon}</span>
                        </div>
                        <p className="font-semibold text-sm" style={{ color: cat.color }}>{cat.label}</p>
                        {selectedCat === cat.label && (
                          <p className="text-[10px] mt-1 font-medium" style={{ color: cat.color }}>Selected ✓</p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Activity form fields */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <p className="text-sm font-bold text-slate-700 mb-5">Activity Information</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-3">
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        {activityTab === 'training' ? 'Training Program Name' : 'Activity Name'} <span className="text-red-400">*</span>
                      </label>
                      <input value={form.program}
                        onChange={e => setForm(f => ({ ...f, program: e.target.value }))}
                        placeholder={activityTab === 'training' ? 'e.g. Fire Safety Awareness' : 'e.g. Health Camp Drive'}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Mode</label>
                      <div className="flex rounded-xl border border-slate-200 overflow-hidden h-[42px] bg-white">
                        {MODES.map(m => (
                          <button key={m} onClick={() => setForm(f => ({ ...f, mode: m }))}
                            className={`flex-1 text-xs font-semibold transition-colors ${form.mode === m ? 'bg-[#064E3B] text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Activity Date</label>
                      <input type="date" value={form.date}
                        onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Duration (hrs)</label>
                      <input type="number" value={form.duration}
                        onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                        placeholder="e.g. 8"
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        {activityTab === 'training' ? 'Trainer / Facilitator' : 'Organiser'}
                      </label>
                      <input value={form.trainer}
                        onChange={e => setForm(f => ({ ...f, trainer: e.target.value }))}
                        placeholder="Name or organisation"
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Location / Venue</label>
                      <input value={form.location}
                        onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                        placeholder="e.g. Head Office, Mumbai"
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all" />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
                      <textarea value={form.description}
                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                        placeholder="Brief description of this activity..."
                        rows={3}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all resize-none" />
                    </div>
                  </div>
                </div>
              </>)}

              {/* ──────────────────────────── STEP 2: Participants ── */}
              {currentStep === 1 && (<>
                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-1" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>Conducted By</h3>
                  <p className="text-xs text-slate-400 mb-5">Choose the trainer or agency responsible for conducting this activity</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Type</label>
                      <div className="flex rounded-xl border border-slate-200 bg-slate-100 p-1">
                        {['Internal', 'External'].map(type => (
                          <button key={type}
                            onClick={() => setForm(f => ({ ...f, conductedType: type }))}
                            className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold ${form.conductedType === type ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Trainer / Agency</label>
                      <input value={form.trainer}
                        onChange={e => setForm(f => ({ ...f, trainer: e.target.value }))}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all" />
                    </div>
                    {[
                      { name: 'Pratiksha Mehta', sub: 'LearnSquare - Excel & Analytics expert - 12 yrs', initials: 'PM', type: 'External', sessions: '32 sessions' },
                      { name: 'Aarav Joshi', sub: 'Internal - Sustainability Lead', initials: 'AJ', type: 'Internal', sessions: '14 sessions' },
                      { name: 'St. John Ambulance', sub: 'Agency - Workplace First Aid & Safety', initials: 'SJ', type: 'External', sessions: '8 sessions' },
                    ].map(card => {
                      const isSelected = form.trainer === card.name
                      return (
                        <button key={card.name}
                          onClick={() => setForm(f => ({ ...f, trainer: card.name, conductedType: card.type }))}
                          className={`flex items-center gap-4 rounded-2xl border p-5 text-left transition-all ${isSelected ? 'border-[#10B981] bg-[#ECFDF5] shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}>
                          <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white ${card.type === 'Internal' ? 'bg-[#10B981]' : 'bg-indigo-500'}`}>{card.initials}</span>
                          <span>
                            <span className="block text-sm font-bold text-slate-900">{card.name}</span>
                            <span className="mt-1 block text-xs text-slate-500">{card.sub}</span>
                            <span className="mt-2 flex gap-2">
                              <span className="rounded bg-[#E6F4F1] px-2 py-1 text-[10px] font-semibold text-[#047857]">{card.type}</span>
                              <span className="rounded border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-600">{card.sessions}</span>
                            </span>
                          </span>
                        </button>
                      )
                    })}
                    <button className="flex items-center gap-4 rounded-2xl border border-dashed border-slate-300 p-5 text-left transition-all hover:border-[#10B981] hover:bg-[#ECFDF5]/40">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-300 text-2xl text-slate-400">+</span>
                      <span>
                        <span className="block text-sm font-bold text-slate-900">Add New Trainer</span>
                        <span className="mt-1 block text-xs text-slate-500">Capture name, contact, specialty, agency</span>
                      </span>
                    </button>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Contact Email</label>
                      <input value={form.trainerEmail} onChange={e => setForm(f => ({ ...f, trainerEmail: e.target.value }))}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Phone</label>
                        <input value={form.trainerPhone} onChange={e => setForm(f => ({ ...f, trainerPhone: e.target.value }))}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Engagement Fee</label>
                        <input value={form.trainerFee} onChange={e => setForm(f => ({ ...f, trainerFee: e.target.value }))}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
              </>)}

              {currentStep === 3 && (<>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex min-h-44 items-start justify-between border-b border-slate-200 bg-[#FAFBFC] px-8 py-8">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#10B981]">Step 4 of 7</p>
                      <h3 className="mt-3 text-2xl font-bold text-slate-950" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>Participants</h3>
                      <p className="mt-2 max-w-2xl text-sm text-slate-500">Who attended? Gender-disaggregated data automatically flows into BRSR Principle 5 and your DEI dashboards.</p>
                    </div>
                    <span className="rounded-lg bg-[#064E3B] px-4 py-2 text-sm font-bold text-white">04</span>
                  </div>

                  <div className="grid min-h-[410px] grid-cols-[1fr_0.9fr] items-center gap-10 px-8 py-8">
                    <div className="grid grid-cols-3 gap-5 self-start">
                      <div>
                        <label className="mb-2 block text-sm font-bold text-slate-700">Total Employees <span className="text-rose-500">*</span></label>
                        <input value={totalParticipants || ''} readOnly className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-sm" />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-bold text-slate-700">Female</label>
                        <input type="number" value={form.female} onChange={e => setForm(f => ({ ...f, female: e.target.value }))}
                          className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all" />
                        <p className="mt-3 text-sm font-bold text-[#10B981]">{femalePct}% Female</p>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-bold text-slate-700">Male</label>
                        <input type="number" value={form.male} onChange={e => setForm(f => ({ ...f, male: e.target.value }))}
                          className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all" />
                        <p className="mt-3 text-sm font-bold text-slate-500">{malePct}% Male</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="relative h-72 w-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={[
                              { name: 'Female', value: parseInt(form.female) || 0 },
                              { name: 'Male', value: parseInt(form.male) || 0 },
                            ]} cx="50%" cy="50%" innerRadius={88} outerRadius={118} dataKey="value" strokeWidth={0} paddingAngle={3}>
                              <Cell fill="#F43F5E" />
                              <Cell fill="#6366F1" />
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-5xl font-bold text-slate-950">{femalePct}%</span>
                          <span className="mt-2 text-lg text-slate-500">Female reach</span>
                        </div>
                      </div>
                      <div className="mt-6 flex gap-6 text-sm font-semibold text-slate-700">
                        <span><span className="mr-2 inline-block h-3 w-3 rounded bg-[#F43F5E]" />Female {form.female || 0}</span>
                        <span><span className="mr-2 inline-block h-3 w-3 rounded bg-[#6366F1]" />Male {form.male || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>)}

              {currentStep === 93 && (<>
                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-1" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>Participants</h3>
                  <p className="text-xs text-slate-400 mb-5">Enter participant counts by gender and view the live breakdown</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <div className="grid grid-cols-5 gap-6 items-start">
                    <div className="col-span-2 space-y-4">
                      {[['male','Male'],['female','Female'],['other','Other']].map(([key,label]) => (
                        <div key={key}>
                          <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
                          <input type="number" value={form[key]}
                            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                            placeholder="0"
                            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all" />
                        </div>
                      ))}
                      <div className="bg-[#064E3B] rounded-xl px-4 py-4">
                        <p className="text-[10px] text-[#A7F3D0] uppercase tracking-wide">Total Participants</p>
                        <p className="text-3xl font-bold text-white mt-1" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
                          {totalParticipants || '—'}
                        </p>
                        {totalParticipants > 0 && (
                          <div className="flex gap-3 mt-2">
                            <span className="text-[10px] text-[#A7F3D0]">♀ {femalePct}%</span>
                            <span className="text-[10px] text-[#A7F3D0]">♂ {malePct}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-span-2 flex flex-col items-center justify-center pt-4">
                      <div className="relative" style={{ width: 170, height: 170 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={donutData.some(d => d.value > 0) ? donutData : [{ name: 'Empty', value: 1, color: '#E2E8F0' }]}
                              cx="50%" cy="50%" innerRadius={56} outerRadius={74}
                              dataKey="value" strokeWidth={2} stroke="#fff" paddingAngle={2}>
                              {(donutData.some(d => d.value > 0) ? donutData : [{ color: '#E2E8F0' }]).map((d, i) => (
                                <Cell key={i} fill={d.color} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-2xl font-bold text-[#064E3B] leading-none" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
                            {femalePct > 0 ? `${femalePct}%` : '—'}
                          </span>
                          <span className="text-[9px] text-slate-400 mt-0.5">Female</span>
                        </div>
                      </div>
                      <div className="flex gap-5 mt-3">
                        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /><span className="text-[10px] text-slate-500">Female {femalePct}%</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#064E3B]" /><span className="text-[10px] text-slate-500">Male {malePct}%</span></div>
                      </div>
                    </div>
                    <div className="col-span-1 pt-4">
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-3">Monthly Trend</p>
                      <div className="space-y-2">
                        {MONTHS_SHORT.slice(0, 6).map((m, idx) => (
                          <div key={m} className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 w-6 shrink-0">{m}</span>
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#10B981] rounded-full" style={{ width: `${[65, 42, 78, 55, 88, 33][idx]}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>)}

              {/* ──────────────────────────── STEP 3: Timeline ── */}
              {currentStep === 2 && (<>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex min-h-44 items-start justify-between border-b border-slate-200 bg-[#FAFBFC] px-8 py-8">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#10B981]">Step 3 of 7</p>
                      <h3 className="mt-3 text-2xl font-bold text-slate-950" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>Timeline</h3>
                    </div>
                    <span className="rounded-lg bg-[#064E3B] px-4 py-2 text-sm font-bold text-white">03</span>
                  </div>

                  <div className="grid grid-cols-[1.15fr_0.95fr] gap-8 px-8 py-8">
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label className="mb-2 block text-sm font-bold text-slate-700">Activity Date <span className="text-rose-500">*</span></label>
                          <input value="14 May 2026" readOnly className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-sm" />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-bold text-slate-700">Start Time</label>
                          <input value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))}
                            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all" />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-bold text-slate-700">Duration <span className="text-rose-500">*</span></label>
                          <input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all" />
                          <p className="mt-2 text-xs text-slate-500">hours</p>
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-bold text-slate-700">Recurrence</label>
                          <select value={form.frequency} onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))}
                            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all">
                            {['One-time','Weekly','Monthly','Quarterly'].map(f => <option key={f}>{f}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-bold text-slate-700">Status</label>
                          <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all">
                            {['Planned','Scheduled','In Progress','Completed'].map(status => <option key={status}>{status}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-bold text-slate-700">Reminders</label>
                          <div className="flex h-12 items-center gap-2">
                            {['3 days', '1 day', '1 hour'].map((label, index) => (
                              <span key={label} className={`rounded-full px-3 py-1.5 text-xs font-bold ${index === 2 ? 'bg-indigo-100 text-indigo-600' : 'bg-sky-100 text-sky-700'}`}>
                                • {label}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6">
                        <div className="mb-5 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Status Progression</p>
                            <p className="mt-1 text-xl font-bold text-slate-950">Planned · 14 May 2026 · 6 hrs</p>
                          </div>
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">Upcoming</span>
                        </div>
                        <div className="relative mb-6 h-2 rounded-full bg-slate-200">
                          <div className="h-2 w-[40%] rounded-full bg-[#10B981]" />
                          {[0, 40, 70, 100].map((left, index) => (
                            <span key={left} className={`absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 ${index <= 1 ? 'border-[#10B981] bg-[#10B981]' : 'border-[#10B981] bg-white'}`} style={{ left: `${left}%` }} />
                          ))}
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-xs font-semibold text-slate-500">
                          {['Planned\n10 May', 'Scheduled\n14 May', 'In Progress\n14 May', 'Completed\n14 May'].map(item => (
                            <span key={item} className="whitespace-pre-line">{item}</span>
                          ))}
                        </div>
                        <div className="mt-5 grid grid-cols-3 gap-6">
                          <div><p className="text-xs font-bold uppercase text-slate-400">Days To Go</p><p className="text-xl font-bold text-slate-950">4 days</p></div>
                          <div><p className="text-xs font-bold uppercase text-slate-400">Block</p><p className="text-xl font-bold text-slate-950">10:00 - 16:00</p></div>
                          <div><p className="text-xs font-bold uppercase text-slate-400">Room</p><p className="text-xl font-bold text-slate-950">Online · Zoom</p></div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="mb-6 flex items-center justify-between">
                        <h4 className="text-lg font-bold text-slate-950">May 2026</h4>
                        <div className="flex gap-2">
                          <button className="h-9 w-9 rounded-lg border border-slate-200 text-slate-500">‹</button>
                          <button className="h-9 w-9 rounded-lg border border-slate-200 text-slate-500">›</button>
                        </div>
                      </div>
                      <div className="grid grid-cols-7 gap-y-4 text-center text-sm">
                        {['S','M','T','W','T','F','S'].map((day, index) => <span key={`${day}-${index}`} className="font-bold text-slate-400">{day}</span>)}
                        {[26,27,28,29,30,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31].map((day, idx) => {
                          const selected = day === 14 && idx > 10
                          const today = day === 20
                          const muted = idx < 5
                          return (
                            <span key={`${day}-${idx}`} className={`mx-auto flex h-10 w-10 items-center justify-center rounded-lg font-semibold ${selected ? 'bg-[#0F766E] text-white' : today ? 'bg-[#E6F8F3] text-[#10B981]' : muted ? 'text-slate-300' : 'text-slate-600'}`}>
                              {day}
                            </span>
                          )
                        })}
                      </div>
                      <div className="mt-6 flex gap-5 border-t border-slate-200 pt-4 text-xs font-semibold text-slate-500">
                        <span><span className="mr-2 inline-block h-3 w-3 rounded bg-[#10B981]" />Today</span>
                        <span><span className="mr-2 inline-block h-3 w-3 rounded bg-[#0F766E]" />Selected</span>
                        <span><span className="mr-2 inline-block h-3 w-3 rounded bg-indigo-500" />Other events</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>)}

              {/* ──────────────────────────── STEP 4: Attendance ── */}
              {currentStep === 99 && (<>
                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-1" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>Attendance</h3>
                  <p className="text-xs text-slate-400 mb-5">Track how many registered participants actually attended</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <div className="grid grid-cols-3 gap-6 items-start">
                    <div className="col-span-1 space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Total Registered</label>
                        <input type="number" value={form.registered}
                          onChange={e => setForm(f => ({ ...f, registered: e.target.value }))}
                          placeholder="e.g. 60"
                          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Total Attended</label>
                        <input type="number" value={form.attended}
                          onChange={e => setForm(f => ({ ...f, attended: e.target.value }))}
                          placeholder="e.g. 54"
                          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all" />
                      </div>
                      {(() => {
                        const reg = parseInt(form.registered) || 0
                        const att = parseInt(form.attended) || 0
                        const absent = reg - att
                        const pct = reg > 0 ? Math.round((att / reg) * 100) : 0
                        return (
                          <div className="bg-[#064E3B] rounded-xl px-4 py-4 space-y-1.5">
                            <p className="text-[10px] text-[#A7F3D0] uppercase tracking-wide">Attendance Rate</p>
                            <p className="text-3xl font-bold text-white" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>{pct}%</p>
                            <p className="text-[10px] text-[#A7F3D0]">Absent: {absent > 0 ? absent : '—'}</p>
                          </div>
                        )
                      })()}
                    </div>
                    <div className="col-span-2 flex flex-col items-center justify-center">
                      {(() => {
                        const reg = parseInt(form.registered) || 0
                        const att = parseInt(form.attended) || 0
                        const absent = reg > att ? reg - att : 0
                        const donut = reg > 0
                          ? [{ name: 'Attended', value: att, color: '#10B981' }, { name: 'Absent', value: absent, color: '#F87171' }]
                          : [{ name: 'Empty', value: 1, color: '#E2E8F0' }]
                        const pct = reg > 0 ? Math.round((att / reg) * 100) : 0
                        return (<>
                          <div className="relative" style={{ width: 180, height: 180 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie data={donut} cx="50%" cy="50%" innerRadius={60} outerRadius={78}
                                  dataKey="value" strokeWidth={2} stroke="#fff" paddingAngle={2}>
                                  {donut.map((d, i) => <Cell key={i} fill={d.color} />)}
                                </Pie>
                              </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                              <span className="text-3xl font-bold text-[#064E3B] leading-none" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>{pct}%</span>
                              <span className="text-[9px] text-slate-400 mt-1">Attendance</span>
                            </div>
                          </div>
                          <div className="flex gap-6 mt-4">
                            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /><span className="text-[10px] text-slate-500">Attended {att}</span></div>
                            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#F87171]" /><span className="text-[10px] text-slate-500">Absent {absent}</span></div>
                          </div>
                        </>)
                      })()}
                    </div>
                  </div>
                </div>
              </>)}

              {/* ──────────────────────────── STEP 5: Budget ── */}
              {currentStep === 4 && (<>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex min-h-44 items-start justify-between border-b border-slate-200 bg-[#FAFBFC] px-8 py-8">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#10B981]">Step 5 of 7 · Optional</p>
                      <h3 className="mt-3 text-2xl font-bold text-slate-950" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>Cost</h3>
                    </div>
                    <span className="rounded-lg bg-[#064E3B] px-4 py-2 text-sm font-bold text-white">05</span>
                  </div>

                  <div className="space-y-24 px-8 py-8">
                    <div className="max-w-xl">
                      <label className="mb-2 block text-sm font-bold text-slate-700">Total Cost (₹) <span className="text-rose-500">*</span></label>
                      <input value={form.amountSpent} onChange={e => setForm(f => ({ ...f, amountSpent: e.target.value, totalBudget: e.target.value }))}
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all" />
                      <p className="mt-2 text-xs text-slate-500">Includes trainer fee, venue, materials.</p>
                    </div>

                    <div className="max-w-xl">
                      <label className="mb-2 block text-sm font-bold text-slate-700">Invoice / PO Reference</label>
                      <input value={form.invoiceRef} onChange={e => setForm(f => ({ ...f, invoiceRef: e.target.value }))}
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all" />
                    </div>

                    <div className="rounded-xl bg-[#064E3B] p-7 text-white">
                      <p className="mb-5 text-xs font-bold uppercase tracking-widest text-slate-400">Cost Snapshot</p>
                      <div className="grid grid-cols-3 gap-8">
                        <div><p className="text-xs font-bold uppercase text-slate-400">Total</p><p className="mt-2 text-2xl font-bold">₹48,000</p></div>
                        <div><p className="text-xs font-bold uppercase text-slate-400">Per Employee</p><p className="mt-2 text-2xl font-bold text-[#10B981]">₹338</p></div>
                        <div><p className="text-xs font-bold uppercase text-slate-400">Per Hour</p><p className="mt-2 text-2xl font-bold text-indigo-400">₹8,000</p></div>
                      </div>
                      <p className="mt-5 border-t border-white/10 pt-4 text-sm text-slate-300">✓ 18% below median for Skill-Dev workshops this FY</p>
                    </div>
                  </div>
                </div>
              </>)}

              {currentStep === 94 && (<>
                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-1" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>Budget</h3>
                  <p className="text-xs text-slate-400 mb-5">Enter the financial details and spend for this activity</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Currency</label>
                      <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all">
                        {['INR','USD','AED','BWP'].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Total Budget</label>
                      <input type="number" value={form.totalBudget}
                        onChange={e => setForm(f => ({ ...f, totalBudget: e.target.value }))}
                        placeholder="e.g. 50000"
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Amount Spent</label>
                      <input type="number" value={form.amountSpent}
                        onChange={e => setForm(f => ({ ...f, amountSpent: e.target.value }))}
                        placeholder="e.g. 40320"
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all" />
                    </div>
                  </div>
                  {/* Financial summary card */}
                  {(() => {
                    const budget = parseFloat(form.totalBudget) || 0
                    const spent  = parseFloat(form.amountSpent) || 0
                    const balance = budget - spent
                    const perHead = totalParticipants > 0 && spent > 0 ? (spent / totalParticipants).toFixed(0) : null
                    const utilPct = budget > 0 ? Math.round((spent / budget) * 100) : 0
                    return (
                      <div className="bg-[#064E3B] rounded-2xl px-6 py-5">
                        <p className="text-[10px] text-[#A7F3D0] uppercase tracking-widest mb-4">Budget Summary</p>
                        <div className="grid grid-cols-3 gap-6">
                          {[
                            { label: 'Total Budget',  val: budget  > 0 ? `${form.currency} ${budget.toLocaleString()}`  : '—' },
                            { label: 'Amount Spent',  val: spent   > 0 ? `${form.currency} ${spent.toLocaleString()}`   : '—' },
                            { label: 'Balance',       val: budget  > 0 ? `${form.currency} ${balance.toLocaleString()}` : '—' },
                          ].map(item => (
                            <div key={item.label}>
                              <p className="text-[10px] text-[#6EE7B7] uppercase tracking-wide mb-1">{item.label}</p>
                              <p className="text-xl font-bold text-white" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>{item.val}</p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] text-[#6EE7B7] uppercase tracking-wide">Per Head Cost</p>
                            <p className="text-base font-bold text-white">{perHead ? `${form.currency} ${parseInt(perHead).toLocaleString()}` : '—'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-[#6EE7B7] uppercase tracking-wide">Budget Utilisation</p>
                            <p className="text-base font-bold text-white">{budget > 0 ? `${utilPct}%` : '—'}</p>
                          </div>
                        </div>
                        {budget > 0 && (
                          <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-[#10B981] rounded-full transition-all" style={{ width: `${Math.min(utilPct, 100)}%` }} />
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </div>
              </>)}

              {/* ──────────────────────────── STEP 6: Documents & Media ── */}
              {currentStep === 6 && (<>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex min-h-36 items-start justify-between border-b border-slate-200 bg-[#FAFBFC] px-8 py-8">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#10B981]">Step 7 of 7 · Final</p>
                      <h3 className="mt-3 text-2xl font-bold text-slate-950" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>Documents &amp; Proof</h3>
                      <p className="mt-2 max-w-xl text-sm text-slate-500">Attendance sheets, photos, certificates - anything an auditor or BRSR reviewer might ask for.</p>
                    </div>
                    <span className="rounded-lg bg-[#064E3B] px-4 py-2 text-sm font-bold text-white">07</span>
                  </div>

                  <div className="space-y-6 px-8 py-8">
                    <label className="block rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center hover:border-[#10B981]">
                      <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#BFF7EA] text-xl text-[#0F766E]">↥</span>
                      <span className="block text-sm font-bold text-slate-900">Drop files here or click to browse</span>
                      <span className="mt-1 block text-xs font-semibold text-slate-400">Attendance sheets · Photos · Certificates · PDFs · XLS · JPG/PNG · up to 25 MB each</span>
                      <input type="file" className="hidden" multiple onChange={e => setDocs(d => ({ ...d, supporting: e.target.files?.[0] || null }))} />
                    </label>

                    <div className="grid grid-cols-3 gap-5">
                      {[
                        { name: 'workshop_group_photo.jpg', meta: '2.4 MB', tag: 'PHOTO', tone: 'emerald' },
                        { name: 'attendance_excel_workshop.xlsx', meta: '18.4 KB · 142 rows', tag: 'ATTENDANCE', tone: 'emerald' },
                        { name: 'completion_certificates.pdf', meta: '3.2 MB · 142 pages', tag: 'CERTIFICATE', tone: 'amber' },
                        { name: 'live_session_screenshot.png', meta: '820 KB', tag: 'PHOTO', tone: 'emerald' },
                        { name: 'trainer_invoice_LS_0418.pdf', meta: '412 KB', tag: 'INVOICE', tone: 'indigo' },
                        { name: 'feedback_summary.docx', meta: '1.1 MB', tag: 'FEEDBACK', tone: 'indigo' },
                      ].map(file => (
                        <div key={file.name} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                          <div className={`flex h-32 items-center justify-center text-4xl text-white ${file.tone === 'amber' ? 'bg-amber-500' : file.tone === 'indigo' ? 'bg-indigo-500' : 'bg-[#10B981]'}`}>
                            □
                          </div>
                          <div className="p-4">
                            <p className="truncate text-sm font-bold text-slate-900">{file.name}</p>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-xs font-semibold text-slate-400">{file.meta}</span>
                              <span className={`rounded px-2 py-1 text-[10px] font-bold ${file.tone === 'amber' ? 'bg-amber-100 text-amber-700' : file.tone === 'indigo' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-700'}`}>{file.tag}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>)}

              {currentStep === 96 && (<>
                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-1" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>Documents &amp; Media</h3>
                  <p className="text-xs text-slate-400 mb-5">Upload supporting documents, photos, certificates and evidence</p>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  {[
                    { key: 'supporting',   label: 'Supporting Document',    hint: 'Activity plan, agenda, invitation letter',    accept: '.pdf,.doc,.docx' },
                    { key: 'photos',       label: 'Activity Photos',        hint: 'JPG, PNG – photos from the activity',          accept: 'image/*' },
                    { key: 'certificates', label: 'Completion Certificates', hint: 'Attendance or completion certificates',        accept: '.pdf,image/*' },
                    { key: 'evidence',     label: 'Impact Evidence',        hint: 'Survey results, test scores, before/after data', accept: '.pdf,.xlsx,.csv' },
                  ].map(item => (
                    <label key={item.key} className="bg-white rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#10B981] hover:bg-[#ECFDF5]/20 transition-all p-6 cursor-pointer block">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#E6F4F1] flex items-center justify-center shrink-0 text-lg">
                          {item.key === 'photos' ? '🖼️' : item.key === 'certificates' ? '🏅' : item.key === 'evidence' ? '📊' : '📄'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-700">{item.label}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{item.hint}</p>
                          {docs[item.key] ? (
                            <p className="text-xs text-[#064E3B] font-medium mt-2 truncate">✓ {docs[item.key].name}</p>
                          ) : (
                            <p className="text-xs text-slate-400 mt-2">Click to upload or drag &amp; drop</p>
                          )}
                        </div>
                      </div>
                      <input type="file" accept={item.accept} className="hidden"
                        onChange={e => setDocs(d => ({ ...d, [item.key]: e.target.files?.[0] || null }))} />
                    </label>
                  ))}
                </div>
              </>)}

              {/* ──────────────────────────── STEP 7: Impact & Outcomes ── */}
              {currentStep === 5 && (<>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex min-h-44 items-start justify-between border-b border-slate-200 bg-[#FAFBFC] px-8 py-8">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#10B981]">Step 6 of 7</p>
                      <h3 className="mt-3 text-2xl font-bold text-slate-950" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>Impact &amp; Outcome</h3>
                      <p className="mt-2 max-w-2xl text-sm text-slate-500">Capture the measurable outcome, feedback, and follow-up items for BRSR and internal reporting.</p>
                    </div>
                    <span className="rounded-lg bg-[#064E3B] px-4 py-2 text-sm font-bold text-white">06</span>
                  </div>

                  <div className="grid grid-cols-[1fr_0.75fr] gap-8 px-8 py-8">
                    <div className="space-y-6">
                      <div>
                        <label className="mb-2 block text-sm font-bold text-slate-700">Learning Objectives</label>
                        <textarea value={form.learningObjectives || 'Improve HR analytics confidence using Excel, Power Query, Pivot Tables, and dashboarding.'}
                          onChange={e => setForm(f => ({ ...f, learningObjectives: e.target.value }))}
                          rows={4}
                          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all" />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-bold text-slate-700">Outcome Notes</label>
                        <textarea value={form.impactNotes || 'Participants completed hands-on exercises and shared post-session feedback for follow-up coaching.'}
                          onChange={e => setForm(f => ({ ...f, impactNotes: e.target.value }))}
                          rows={4}
                          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all" />
                      </div>
                      <div>
                        <p className="mb-3 text-sm font-bold text-slate-700">Assessment Type</p>
                        <div className="grid grid-cols-2 gap-4">
                          {ASSESSMENT_TYPES.map(at => (
                            <button key={at.label}
                              onClick={() => setForm(f => ({ ...f, assessmentType: at.label }))}
                              className={`rounded-xl border-2 p-4 text-left text-sm font-bold ${form.assessmentType === at.label ? 'border-[#10B981] bg-[#E6F8F3] text-[#064E3B]' : 'border-slate-200 text-slate-600'}`}>
                              {at.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="rounded-2xl bg-[#064E3B] p-7 text-white">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Outcome Snapshot</p>
                      <div className="mt-8 space-y-6">
                        <div><p className="text-sm text-slate-400">Participants reached</p><p className="text-4xl font-bold">{totalParticipants}</p></div>
                        <div><p className="text-sm text-slate-400">Female reach</p><p className="text-4xl font-bold text-[#10B981]">{femalePct}%</p></div>
                        <div>
                          <p className="mb-3 text-sm text-slate-400">Feedback Rating</p>
                          <div className="flex gap-2">
                            {[1,2,3,4,5].map(n => (
                              <button key={n} onClick={() => setForm(f => ({ ...f, feedbackRating: n }))}
                                className={`h-10 w-10 rounded-lg text-sm font-bold ${form.feedbackRating >= n ? 'bg-[#10B981] text-white' : 'bg-white/10 text-slate-400'}`}>
                                {n}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>)}

              {currentStep === 95 && (<>
                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-1" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>Impact &amp; Outcomes</h3>
                  <p className="text-xs text-slate-400 mb-5">Define the assessment method, learning objectives, and expected impact</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Assessment Type</p>
                    <div className="grid grid-cols-2 gap-3">
                      {ASSESSMENT_TYPES.map(at => (
                        <button key={at.label}
                          onClick={() => setForm(f => ({ ...f, assessmentType: f.assessmentType === at.label ? '' : at.label }))}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            form.assessmentType === at.label
                              ? 'shadow-sm'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                          style={form.assessmentType === at.label ? { borderColor: at.color, background: at.bg } : {}}>
                          <p className="font-semibold text-sm" style={{ color: form.assessmentType === at.label ? at.color : '#475569' }}>{at.label}</p>
                          {form.assessmentType === at.label && <p className="text-[10px] mt-0.5" style={{ color: at.color }}>Selected ✓</p>}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Learning Objectives</label>
                    <textarea value={form.learningObjectives}
                      onChange={e => setForm(f => ({ ...f, learningObjectives: e.target.value }))}
                      placeholder="What will participants learn or achieve from this activity?"
                      rows={3}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Expected Impact / Notes</label>
                    <textarea value={form.impactNotes}
                      onChange={e => setForm(f => ({ ...f, impactNotes: e.target.value }))}
                      placeholder="Describe the broader impact on employees, community, or ESG goals..."
                      rows={3}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-2">Overall Feedback Rating</label>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(n => (
                        <button key={n}
                          onClick={() => setForm(f => ({ ...f, feedbackRating: n }))}
                          className={`w-10 h-10 rounded-xl border-2 font-bold text-sm transition-all ${
                            form.feedbackRating >= n
                              ? 'bg-[#064E3B] border-[#064E3B] text-white'
                              : 'border-slate-200 text-slate-400 hover:border-[#10B981]'
                          }`}>
                          {n}
                        </button>
                      ))}
                      {form.feedbackRating > 0 && (
                        <span className="text-xs text-slate-500 self-center ml-2">{['','Poor','Fair','Good','Very Good','Excellent'][form.feedbackRating]}</span>
                      )}
                    </div>
                  </div>
                </div>
              </>)}

              {/* ──────────────────────────── STEP 8: Review & Submit ── */}
              {currentStep === 99 && (<>
                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-1" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>Review &amp; Submit</h3>
                  <p className="text-xs text-slate-400 mb-5">Review all entered information before saving this activity</p>
                </div>
                <div className="space-y-4">
                  {[
                    { title: 'Activity Details', icon: '📋', rows: [
                      ['Type', ACTIVITY_TABS.find(t => t.key === activityTab)?.label || '—'],
                      ['Category', selectedCat || '—'],
                      ['Program', form.program || '—'],
                      ['Mode', form.mode],
                      ['Date', form.date || '—'],
                      ['Duration', form.duration ? `${form.duration} hrs` : '—'],
                      ['Trainer', form.trainer || '—'],
                      ['Location', form.location || '—'],
                    ]},
                    { title: 'Participants', icon: '👥', rows: [
                      ['Male', form.male || '0'],
                      ['Female', form.female || '0'],
                      ['Other', form.other || '0'],
                      ['Total', String(totalParticipants || 0)],
                    ]},
                    { title: 'Timeline', icon: '📅', rows: [
                      ['Start Date', form.startDate || '—'],
                      ['End Date', form.endDate || '—'],
                      ['Frequency', form.frequency],
                      ['Sessions', form.sessions || '—'],
                    ]},
                    { title: 'Budget', icon: '💰', rows: [
                      ['Currency', form.currency],
                      ['Total Budget', form.totalBudget || '—'],
                      ['Amount Spent', form.amountSpent || '—'],
                    ]},
                    { title: 'Impact & Outcomes', icon: '🎯', rows: [
                      ['Assessment Type', form.assessmentType || '—'],
                      ['Feedback Rating', form.feedbackRating > 0 ? `${form.feedbackRating}/5` : '—'],
                      ['Learning Objectives', form.learningObjectives || '—'],
                    ]},
                  ].map(section => (
                    <div key={section.title} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg">{section.icon}</span>
                        <p className="text-sm font-bold text-slate-800">{section.title}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                        {section.rows.map(([label, val]) => (
                          <div key={label} className="flex justify-between items-start py-1 border-b border-slate-50 last:border-0">
                            <span className="text-[11px] text-slate-400 font-medium">{label}</span>
                            <span className="text-[11px] text-slate-700 font-semibold text-right max-w-[55%] truncate">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>)}

            </div>
          </div>
        </div>

        {/* Sticky footer: Prev / Next / Save */}
        <div className="border-t border-slate-200 px-8 py-4 flex items-center justify-between shrink-0 bg-white">
          <button
            onClick={() => currentStep > 0 ? setCurrentStep(s => s - 1) : setShowAddActivity(false)}
            className="px-5 py-2.5 text-sm text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            {currentStep === 0 ? 'Cancel' : '← Previous'}
          </button>
          <div className="flex items-center gap-2">
            {STEPS.map((_, i) => (
              <div key={i} className={`rounded-full transition-all ${
                i === currentStep ? 'w-5 h-2 bg-[#064E3B]' : i < currentStep ? 'w-2 h-2 bg-[#10B981]' : 'w-2 h-2 bg-slate-200'
              }`} />
            ))}
          </div>
          {currentStep < STEPS.length - 1 ? (
            <button
              onClick={() => setCurrentStep(s => s + 1)}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-[#064E3B] hover:bg-[#065F46] rounded-xl transition-colors shadow-sm">
              Next →
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-[#064E3B] hover:bg-[#065F46] rounded-xl transition-colors shadow-sm">
              Save Activity
            </button>
          )}
        </div>

      </div>
      </div>
    )}
    </>
  )
}

