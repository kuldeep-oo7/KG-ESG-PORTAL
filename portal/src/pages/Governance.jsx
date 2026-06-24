/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { Search, Plus, FileText, Award, Star, Upload, X, ChevronLeft, ChevronRight, Pencil, Trash2, AlertTriangle } from 'lucide-react'

const CATEGORY_COLORS = {
  Environment: { bg: '#ECFDF5', text: '#064E3B', dot: '#10B981' },
  HR:          { bg: '#FDF2F8', text: '#BE185D', dot: '#EC4899' },
  Governance:  { bg: '#EFF6FF', text: '#1D4ED8', dot: '#3B82F6' },
  Legal:       { bg: '#FFF7ED', text: '#C2410C', dot: '#F97316' },
  CSR:         { bg: '#F5F3FF', text: '#6D28D9', dot: '#8B5CF6' },
  Finance:     { bg: '#FFFBEB', text: '#B45309', dot: '#F59E0B' },
  IT:          { bg: '#F0F9FF', text: '#0369A1', dot: '#0EA5E9' },
}

const INITIAL_POLICIES = [
  {
    id: 1,
    policy: 'Environmental & Sustainability Policy',
    category: 'Environment',
    dept: 'All Plants',
    deptCount: '638 employees',
    reviewDate: '15 May 2027',
    reviewStatus: 'Active',
    owner: 'ESG Team',
  },
  {
    id: 2,
    policy: 'Anti-Sexual Harassment Policy (POSH)',
    category: 'HR',
    dept: 'All Employees',
    deptCount: '1,234 employees',
    reviewDate: '11 Jan 2026',
    reviewStatus: 'Active',
    owner: 'HR Department',
  },
  {
    id: 3,
    policy: 'Code of Business Conduct & Ethics',
    category: 'Governance',
    dept: 'All Stakeholders',
    deptCount: '2,840 persons',
    reviewDate: '26 May 2026',
    reviewStatus: 'Active',
    owner: 'Legal Team',
  },
  {
    id: 4,
    policy: 'Whistle-blower & Mgmt Resolution Policy',
    category: 'Governance',
    dept: 'All Stakeholders',
    deptCount: '2,840 persons',
    reviewDate: '26 May 2026',
    reviewStatus: 'Active',
    owner: 'Legal Team',
  },
  {
    id: 5,
    policy: 'Data Privacy & DPDP Compliance Policy',
    category: 'Legal',
    dept: 'All Data Handlers',
    deptCount: '412 employees',
    reviewDate: '10 May 2026',
    reviewStatus: 'Review Due',
    owner: 'IT & Legal',
  },
  {
    id: 6,
    policy: 'Diversity, Equity & Inclusion',
    category: 'CSR',
    dept: 'All Plants & HC',
    deptCount: '638 employees',
    reviewDate: '30 May 2026',
    reviewStatus: 'Active',
    owner: 'HR Department',
  },
  {
    id: 7,
    policy: 'Hazardous Waste Handling SOP',
    category: 'Environment',
    dept: 'Vapi · Halol · Daman',
    deptCount: '187 employees',
    reviewDate: '01 Jan 2026',
    reviewStatus: 'Expired',
    owner: 'EHS Team',
  },
]

const CATEGORIES_FILTER = ['All Categories', 'Environment', 'HR', 'Governance', 'Legal', 'CSR', 'Finance', 'IT']
const CATEGORIES_FORM = ['Environment', 'HR', 'Governance', 'Legal', 'CSR', 'Finance', 'IT']
const DEPARTMENTS = ['All Employees', 'All Stakeholders', 'All Departments', 'Management', 'Board', 'Operations', 'Sales']
const REVIEW_FREQ = ['Annual', 'Quarterly', 'Monthly', 'Bi-Annual']
const APPLICABLE_TO_OPTIONS = ['All Employees', 'Contractors', 'Management', 'Board']

const RECORD_TYPES = [
  {
    key: 'policy',
    icon: <FileText className="w-7 h-7" />,
    title: 'Policy',
    description: 'Internal or regulatory compliance policy document',
  },
  {
    key: 'certification',
    icon: <Award className="w-7 h-7" />,
    title: 'Certification',
    description: 'ISO, BIS, or other third-party certifications',
  },
  {
    key: 'honor',
    icon: <Star className="w-7 h-7" />,
    title: 'Honor & Recognition',
    description: 'Awards, recognitions, and industry rankings',
  },
]

function CategoryTag({ category }) {
  const c = CATEGORY_COLORS[category] ?? { bg: '#F1F5F9', text: '#475569', dot: '#94A3B8' }
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: c.bg, color: c.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.dot }} />
      {category}
    </span>
  )
}

function StatusBadge({ status }) {
  if (status === 'Active') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-600">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        ACTIVE
      </span>
    )
  }
  if (status === 'Review Due') {
    return (
      <span className="inline-flex items-center text-[11px] font-bold px-2.5 py-0.5 rounded bg-orange-50 text-orange-600 border border-orange-200">
        REVIEW DUE
      </span>
    )
  }
  if (status === 'Expired') {
    return (
      <span className="inline-flex items-center text-[11px] font-bold px-2.5 py-0.5 rounded bg-red-50 text-red-600 border border-red-200">
        EXPIRED
      </span>
    )
  }
  return <span className="text-xs text-slate-400">{status}</span>
}

function WizardModal({ onClose, onSubmit }) {
  const [step, setStep] = useState(1)
  const [selectedType, setSelectedType] = useState(null)
  const [details, setDetails] = useState({
    policyName: '', category: CATEGORIES_FORM[0], department: DEPARTMENTS[0],
    description: '', owner: '', version: '1.0',
  })
  const [validity, setValidity] = useState({
    validFrom: '', validTo: '', frequency: REVIEW_FREQ[0],
    applicableTo: [],
  })

  function toggleApplicable(opt) {
    setValidity(v => ({
      ...v,
      applicableTo: v.applicableTo.includes(opt)
        ? v.applicableTo.filter(x => x !== opt)
        : [...v.applicableTo, opt],
    }))
  }

  function handleSubmit() {
    if (!details.policyName.trim() || !selectedType) return
    onSubmit({ type: selectedType, ...details, ...validity })
    onClose()
  }

  const STEPS = ['Record Type', 'Main Details', 'Validity & Scope', 'Upload Documents']
  const STEP_DESC = [
    'Choose the type of governance record to add.',
    'Fill in the core policy information and ownership.',
    'Set validity period, review frequency and applicability.',
    'Attach the policy document or supporting files.',
  ]
  const progressPct = Math.round(((step - 1) / STEPS.length) * 100)

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#F3F6FA]">
      <div className="px-8 py-7">

        {/* Top nav */}
        <div className="mb-8 flex items-center justify-between">
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            <button type="button" onClick={onClose}
              className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-slate-700 hover:text-[#064E3B] hover:bg-[#064E3B]/5 transition-colors">
              <span className="text-base leading-none">▦</span>
              Dashboard
            </button>
            <button type="button"
              className="flex items-center gap-2 rounded-lg bg-[#064E3B] px-5 py-2.5 text-sm font-bold text-white shadow-sm">
              <Plus className="h-4 w-4" />
              Add Policy
            </button>
          </div>
        </div>

        {/* Page title */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-slate-950" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
            New Governance Record
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Add a policy, SOP, compliance document or training record. Complete all steps and submit for approval.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="flex items-start gap-8">

          {/* Left sidebar */}
          <div className="w-72 shrink-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sticky top-6">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Policy Wizard</p>
            <p className="mt-2 text-lg font-bold text-slate-950">4 steps · ~3 min</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-[#10B981] transition-all duration-300" style={{ width: `${progressPct}%` }} />
              </div>
              <span className="text-sm font-bold text-[#10B981]">{progressPct}%</span>
            </div>
            <div className="my-6 h-px bg-slate-200" />
            {STEPS.map((s, idx) => {
              const n = idx + 1
              const isActive = step === n
              const isComplete = n < step
              return (
                <button key={s} onClick={() => setStep(n)}
                  className={`mb-2 flex w-full items-center gap-4 rounded-xl px-3 py-3 text-left transition-all ${
                    isActive ? 'bg-[#E6F8F3] text-[#064E3B]' : isComplete ? 'text-slate-700 hover:bg-slate-50' : 'text-slate-500 hover:bg-slate-50'
                  }`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                    isComplete ? 'bg-[#064E3B] text-white' : isActive ? 'bg-[#10B981] text-white' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {isComplete ? '✓' : n}
                  </span>
                  <span className="text-sm font-semibold">{s}</span>
                </button>
              )
            })}
          </div>

          {/* Right content card */}
          <div className="min-w-0 flex-1">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              {/* Step header */}
              <div className="flex min-h-32 items-start justify-between border-b border-slate-200 bg-[#FAFBFC] px-8 py-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#10B981]">
                    Step {step} of {STEPS.length}
                  </p>
                  <h3 className="mt-3 text-2xl font-bold text-slate-950" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
                    {STEPS[step - 1]}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-2xl">{STEP_DESC[step - 1]}</p>
                </div>
                <span className="rounded-lg bg-[#064E3B] px-4 py-2 text-sm font-bold text-white shrink-0 ml-6">
                  {String(step).padStart(2, '0')}
                </span>
              </div>

              {/* Step content */}
              <div className="px-8 py-6">
          {step === 1 && (
            <div>
              <h2 className="font-bold text-slate-800 text-lg mb-1" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
                What are you adding?
              </h2>
              <p className="text-xs text-slate-400 mb-5">Choose the type of governance record</p>
              <div className="space-y-3">
                {RECORD_TYPES.map(rt => (
                  <button
                    key={rt.key}
                    onClick={() => setSelectedType(rt.key)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                      selectedType === rt.key ? 'border-[#10B981] bg-[#ECFDF5]' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className={selectedType === rt.key ? 'text-[#064E3B]' : 'text-slate-400'}>{rt.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{rt.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{rt.description}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <button
                  disabled={!selectedType}
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 bg-[#064E3B] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#065F46] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-bold text-slate-800 text-lg mb-1" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
                Main Details
              </h2>
              <p className="text-xs text-slate-400 mb-5">Fill in the core information</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Policy Name</label>
                  <input
                    value={details.policyName}
                    onChange={e => setDetails(d => ({ ...d, policyName: e.target.value }))}
                    placeholder="e.g. Vendor Code of Conduct"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Category</label>
                    <select
                      value={details.category}
                      onChange={e => setDetails(d => ({ ...d, category: e.target.value }))}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all"
                    >
                      {CATEGORIES_FORM.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Department</label>
                    <select
                      value={details.department}
                      onChange={e => setDetails(d => ({ ...d, department: e.target.value }))}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all"
                    >
                      {DEPARTMENTS.map(dep => <option key={dep}>{dep}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Owner</label>
                    <input
                      value={details.owner}
                      onChange={e => setDetails(d => ({ ...d, owner: e.target.value }))}
                      placeholder="e.g. Compliance Team"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Version</label>
                    <input
                      value={details.version}
                      onChange={e => setDetails(d => ({ ...d, version: e.target.value }))}
                      placeholder="e.g. 1.0"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
                  <textarea
                    value={details.description}
                    onChange={e => setDetails(d => ({ ...d, description: e.target.value }))}
                    rows={3}
                    placeholder="Brief description of this policy..."
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all resize-none"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-slate-500 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!details.policyName.trim()}
                  className="flex items-center gap-1.5 bg-[#064E3B] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#065F46] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-bold text-slate-800 text-lg mb-1" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
                Validity &amp; Scope
              </h2>
              <p className="text-xs text-slate-400 mb-5">Set the validity period and applicability</p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Valid From</label>
                    <input
                      type="date"
                      value={validity.validFrom}
                      onChange={e => setValidity(v => ({ ...v, validFrom: e.target.value }))}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Valid To</label>
                    <input
                      type="date"
                      value={validity.validTo}
                      onChange={e => setValidity(v => ({ ...v, validTo: e.target.value }))}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Review Frequency</label>
                  <select
                    value={validity.frequency}
                    onChange={e => setValidity(v => ({ ...v, frequency: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all"
                  >
                    {REVIEW_FREQ.map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-2">Applicable To</label>
                  <div className="space-y-2">
                    {APPLICABLE_TO_OPTIONS.map(opt => (
                      <label key={opt} className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={validity.applicableTo.includes(opt)}
                          onChange={() => toggleApplicable(opt)}
                          className="w-4 h-4 accent-[#064E3B] rounded"
                        />
                        <span className="text-sm text-slate-700">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1 text-slate-500 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex items-center gap-1.5 bg-[#064E3B] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#065F46] transition-colors"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="font-bold text-slate-800 text-lg mb-1" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
                Upload Documents
              </h2>
              <p className="text-xs text-slate-400 mb-5">Attach the policy or supporting documents</p>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 flex flex-col items-center justify-center gap-3 hover:border-[#064E3B]/60 transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-[#ECFDF5] flex items-center justify-center">
                  <Upload className="w-6 h-6 text-[#064E3B]" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-700">Upload Policy Document</p>
                  <p className="text-xs text-slate-400 mt-1">PDF, DOCX up to 20 MB</p>
                </div>
                <label className="text-xs text-[#064E3B] font-semibold cursor-pointer hover:underline">
                  Browse files
                  <input type="file" className="sr-only" accept=".pdf,.docx,.doc" />
                </label>
              </div>
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={() => setStep(3)}
                  className="flex items-center gap-1 text-slate-500 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-[#064E3B] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#065F46] transition-colors"
                >
                  Submit for Approval
                </button>
              </div>
            </div>
          )}
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Governance() {
  const [activeTab, setActiveTab] = useState('governance')
  const [policies, setPolicies] = useState(() => {
    try {
      const raw = localStorage.getItem('kg_governance_policies_v1')
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })
  useEffect(() => {
    try { localStorage.setItem('kg_governance_policies_v1', JSON.stringify(policies)) } catch { /* ignore */ }
  }, [policies])
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [showWizard, setShowWizard] = useState(false)

  const expiringCount = policies.filter(p => p.reviewStatus === 'Review Due').length
  const expiredCount = policies.filter(p => p.reviewStatus === 'Expired').length
  const attentionCount = expiringCount + expiredCount

  const filtered = policies.filter(p => {
    const matchSearch =
      p.policy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchCat = categoryFilter === 'All Categories' || p.category === categoryFilter
    const matchStatus =
      statusFilter === 'All Status' || p.reviewStatus === statusFilter
    return matchSearch && matchCat && matchStatus
  })

  function handleWizardSubmit(data) {
    setPolicies(prev => [
      ...prev,
      {
        id: prev.length + 1,
        policy: data.policyName,
        category: data.category,
        dept: data.department,
        deptCount: '',
        reviewDate: data.validTo || '—',
        reviewStatus: 'Active',
        owner: data.owner || '—',
      },
    ])
  }

  const kpiCards = [
    { value: '2,826', label: 'Total Policies',      change: '+16.3% vs last year',     up: true },
    { value: '2,840', label: 'Active',               change: '+16.3% vs last yr',       up: true },
    { value: '03',    label: 'Expired Docs',         change: '-1.48 | -1.48% vs last yr', up: false },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Page header */}
      <div className="px-8 pt-7 pb-5 border-b border-slate-200 bg-white">
        {/* Row 1 — title + actions */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-[#111827]" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
              Governance &amp; Compliance
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="bg-[#064E3B] text-white text-sm font-semibold px-5 py-2 rounded-xl shadow-sm hover:bg-[#065f46] transition-colors">
              Dashboard
            </button>
            <button type="button" onClick={() => setShowWizard(true)}
              className="bg-white border border-slate-200 text-slate-700 text-sm font-semibold px-5 py-2 rounded-xl flex items-center gap-1.5 hover:border-[#064E3B] hover:text-[#064E3B] transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> Add Policy
            </button>
          </div>
        </div>

        {/* Row 2 — year selectors + status chips + KPI cards */}
        <div className="flex items-stretch gap-4">
          {/* Year selectors */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="border border-slate-200 rounded-xl px-3 py-2 flex flex-col gap-0.5 bg-[#F8FAFC]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wide whitespace-nowrap">Current Year</span>
              <select className="bg-transparent text-slate-700 font-semibold text-xs outline-none cursor-pointer">
                <option>CY 2026</option>
                <option>CY 2025</option>
              </select>
            </div>
            <div className="border border-slate-200 rounded-xl px-3 py-2 flex flex-col gap-0.5 bg-[#F8FAFC]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wide whitespace-nowrap">Baseline</span>
              <select className="bg-transparent text-slate-700 font-semibold text-xs outline-none cursor-pointer">
                <option>CY 2026 (Default)</option>
                <option>CY 2025</option>
              </select>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px bg-slate-200 self-stretch" />

          {/* Status chips */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex flex-col items-center border border-amber-200 bg-amber-50 rounded-xl px-4 py-2">
              <span className="text-lg font-extrabold text-amber-600 leading-none">{expiringCount}</span>
              <span className="text-[10px] font-semibold text-amber-500 uppercase tracking-wide mt-0.5">Expiring</span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px bg-slate-200 self-stretch" />

          {/* KPI cards — inline */}
          <div className="flex items-stretch gap-3 flex-1">
            {kpiCards.map(card => (
              <div key={card.label} className="flex-1 bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-3 border-l-4 border-l-[#064E3B]">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">{card.label}</p>
                <p className="text-2xl font-extrabold text-[#064E3B] leading-none" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
                  {card.value}
                </p>
                <p className={`text-[10px] mt-1.5 ${card.up ? 'text-green-500' : 'text-red-400'}`}>
                  {card.up ? '▲' : '▼'} {card.change}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs + content */}
      <div className="px-8 pb-8">
        <div className="flex gap-0 border-b border-slate-200 mb-0">
          {[
            { key: 'governance', label: 'Governance Policies', count: policies.length },
            { key: 'certifications', label: 'Certifications & Awards', count: 0 },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium border-b-2 transition-all ${
                activeTab === t.key
                  ? 'border-[#10B981] text-[#064E3B]'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.label}
              {t.count > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeTab === t.key ? 'bg-[#064E3B] text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'governance' && (
          <div className="bg-white rounded-b-2xl rounded-tr-2xl border border-t-0 border-slate-200 shadow-sm p-6">

            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search policies..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all"
                />
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="text-xs border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all text-slate-600 bg-white"
                >
                  {CATEGORIES_FILTER.map(c => <option key={c}>{c}</option>)}
                </select>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="text-xs border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#064E3B]/20 transition-all text-slate-600 bg-white"
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Review Due</option>
                  <option>Expired</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    {['POLICY NAME', 'CATEGORY', 'DEPARTMENT', 'REVIEW DATE', 'STATUS', ''].map(h => (
                      <th
                        key={h}
                        className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider pb-3 pr-4 last:pr-0"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr
                      key={p.id}
                      className={`border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors ${
                        p.reviewStatus === 'Expired' ? 'opacity-75' : ''
                      }`}
                    >
                      <td className="py-3.5 pr-4 max-w-[240px]">
                        <p className="text-sm font-semibold text-slate-800 leading-snug">{p.policy}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{p.owner}</p>
                      </td>
                      <td className="py-3.5 pr-4">
                        <CategoryTag category={p.category} />
                      </td>
                      <td className="py-3.5 pr-4">
                        <p className="text-xs text-slate-700">{p.dept}</p>
                        {p.deptCount && (
                          <p className="text-[10px] text-slate-400 mt-0.5">{p.deptCount}</p>
                        )}
                      </td>
                      <td className="py-3.5 pr-4 text-xs text-slate-500 whitespace-nowrap">{p.reviewDate}</td>
                      <td className="py-3.5 pr-4">
                        <StatusBadge status={p.reviewStatus} />
                      </td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setShowWizard(true)}
                            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-slate-600 hover:border-[#064E3B] hover:text-[#064E3B] transition-colors">
                            <Pencil className="w-3 h-3" /> Edit
                          </button>
                          <button onClick={() => setPolicies(prev => prev.filter(x => x.id !== p.id))}
                            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-slate-400 hover:border-red-200 hover:text-red-500 transition-colors">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-sm text-slate-400">
                        No policies match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'certifications' && (
          <div className="bg-white rounded-b-2xl rounded-tr-2xl border border-t-0 border-slate-200 shadow-sm p-10 text-center">
            <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No certifications or awards on record yet.</p>
            <button
              onClick={() => setShowWizard(true)}
              className="mt-4 flex items-center gap-1.5 bg-[#064E3B] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#065F46] transition-colors mx-auto"
            >
              <Plus className="w-3.5 h-3.5" /> Add Certification
            </button>
          </div>
        )}
      </div>

      {showWizard && (
        <WizardModal
          onClose={() => setShowWizard(false)}
          onSubmit={handleWizardSubmit}
        />
      )}
    </div>
  )
}

