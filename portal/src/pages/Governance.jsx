import { useState } from 'react'
import { Search, Plus, FileText, Award, Star, Upload, X, ChevronLeft, ChevronRight } from 'lucide-react'

// ── Sample policy data ─────────────────────────────────────────────────────────
const INITIAL_POLICIES = [
  {
    id: 1,
    policy: 'Environment & Sustainability Policy',
    category: 'Environment',
    dept: 'All Employees',
    reviewDate: '12 Jan 2026',
    status: 'Active',
    reviewStatus: 'Reviewed',
  },
  {
    id: 2,
    policy: 'Anti-Sexual Harassment Policy (POSH)',
    category: 'HR',
    dept: 'All Employees',
    reviewDate: '11 Jan 2026',
    status: 'Active',
    reviewStatus: 'Reviewed',
  },
  {
    id: 3,
    policy: 'Code of Business Conduct & Ethics',
    category: 'Governance',
    dept: 'All Stakeholders',
    reviewDate: '26 May 2026',
    status: 'Active',
    reviewStatus: 'Due Soon',
  },
  {
    id: 4,
    policy: 'Whistle-blower & High Mgt Resolution Policy',
    category: 'Governance',
    dept: 'All Stakeholders',
    reviewDate: '26 May 2026',
    status: 'Active',
    reviewStatus: 'Due Soon',
  },
  {
    id: 5,
    policy: 'Data Privacy & DPDP Compliance Policy',
    category: 'Legal',
    dept: 'All Departments',
    reviewDate: '30 May 2026',
    status: 'Active',
    reviewStatus: 'Overdue',
  },
  {
    id: 6,
    policy: 'Philanthropy, Equity & Inclusion',
    category: 'CSR',
    dept: 'All Employees',
    reviewDate: '30 May 2026',
    status: 'Active',
    reviewStatus: 'Overdue',
  },
]

const CATEGORIES = ['Environment', 'HR', 'Governance', 'Legal', 'CSR', 'Finance', 'IT']
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

function ReviewStatusBadge({ status }) {
  const map = {
    Reviewed: 'bg-green-100 text-green-700',
    'Due Soon': 'bg-yellow-100 text-yellow-700',
    Overdue: 'bg-red-100 text-red-700',
  }
  const icon = {
    Reviewed: '✅',
    'Due Soon': '⚠',
    Overdue: '🔴',
  }
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${map[status] ?? 'bg-slate-100 text-slate-600'}`}>
      <span>{icon[status]}</span> {status}
    </span>
  )
}

function ActiveBadge() {
  return (
    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700">
      Active
    </span>
  )
}

// ── Wizard Modal ───────────────────────────────────────────────────────────────
function WizardModal({ onClose, onSubmit }) {
  const [step, setStep] = useState(1)
  const [selectedType, setSelectedType] = useState(null)
  const [details, setDetails] = useState({
    policyName: '', category: CATEGORIES[0], department: DEPARTMENTS[0],
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
    onSubmit({
      type: selectedType,
      ...details,
      ...validity,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step indicator */}
        <div className="px-8 pt-7 pb-5 border-b border-slate-100">
          <p className="text-xs text-slate-400 mb-1">New Governance Record</p>
          <div className="flex items-center gap-2 mt-3">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  n <= step ? 'bg-[#064E3B] text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {n}
                </div>
                {n < 4 && <div className={`h-0.5 w-8 rounded-full ${n < step ? 'bg-[#10B981]' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-2 text-[10px] text-slate-400">
            <span className="w-7 text-center">Type</span>
            <span className="w-8" />
            <span className="w-7 text-center">Details</span>
            <span className="w-8" />
            <span className="w-7 text-center">Validity</span>
            <span className="w-8" />
            <span className="w-7 text-center">Upload</span>
          </div>
        </div>

        <div className="px-8 py-6">

          {/* Step 1: What are you adding? */}
          {step === 1 && (
            <div>
              <h2 className="font-bold text-slate-800 text-lg mb-1" style={{ fontFamily: 'Hanken Grotesk, Inter, sans-serif' }}>
                What are you adding?
              </h2>
              <p className="text-xs text-slate-400 mb-5">Choose the type of governance record</p>
              <div className="space-y-3">
                {RECORD_TYPES.map(rt => (
                  <button
                    key={rt.key}
                    onClick={() => setSelectedType(rt.key)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                      selectedType === rt.key
                        ? 'border-[#10B981] bg-[#ECFDF5]'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className={`${selectedType === rt.key ? 'text-[#064E3B]' : 'text-slate-400'}`}>
                      {rt.icon}
                    </span>
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

          {/* Step 2: Main Details */}
          {step === 2 && (
            <div>
              <h2 className="font-bold text-slate-800 text-lg mb-1" style={{ fontFamily: 'Hanken Grotesk, Inter, sans-serif' }}>
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
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Category</label>
                    <select
                      value={details.category}
                      onChange={e => setDetails(d => ({ ...d, category: e.target.value }))}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
                    >
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Department</label>
                    <select
                      value={details.department}
                      onChange={e => setDetails(d => ({ ...d, department: e.target.value }))}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
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
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Version</label>
                    <input
                      value={details.version}
                      onChange={e => setDetails(d => ({ ...d, version: e.target.value }))}
                      placeholder="e.g. 1.0"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
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
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/30 resize-none"
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

          {/* Step 3: Validity & Scope */}
          {step === 3 && (
            <div>
              <h2 className="font-bold text-slate-800 text-lg mb-1" style={{ fontFamily: 'Hanken Grotesk, Inter, sans-serif' }}>
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
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Valid To</label>
                    <input
                      type="date"
                      value={validity.validTo}
                      onChange={e => setValidity(v => ({ ...v, validTo: e.target.value }))}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Review Frequency</label>
                  <select
                    value={validity.frequency}
                    onChange={e => setValidity(v => ({ ...v, frequency: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
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
                          className="w-4 h-4 accent-[#10B981] rounded"
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

          {/* Step 4: Upload Documents */}
          {step === 4 && (
            <div>
              <h2 className="font-bold text-slate-800 text-lg mb-1" style={{ fontFamily: 'Hanken Grotesk, Inter, sans-serif' }}>
                Upload Documents
              </h2>
              <p className="text-xs text-slate-400 mb-5">Attach the policy or supporting documents</p>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 flex flex-col items-center justify-center gap-3 hover:border-[#10B981]/60 transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-[#ECFDF5] flex items-center justify-center">
                  <Upload className="w-6 h-6 text-[#10B981]" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-700">Upload Policy Document</p>
                  <p className="text-xs text-slate-400 mt-1">PDF, DOCX up to 20 MB</p>
                </div>
                <label className="text-xs text-[#10B981] font-semibold cursor-pointer hover:underline">
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
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Governance() {
  const [activeTab, setActiveTab] = useState('governance')
  const [policies, setPolicies] = useState(INITIAL_POLICIES)
  const [searchQuery, setSearchQuery] = useState('')
  const [showWizard, setShowWizard] = useState(false)

  const filtered = policies.filter(p =>
    p.policy.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  function handleWizardSubmit(data) {
    setPolicies(prev => [
      ...prev,
      {
        id: prev.length + 1,
        policy: data.policyName,
        category: data.category,
        dept: data.department,
        reviewDate: data.validTo || '—',
        status: 'Active',
        reviewStatus: 'Reviewed',
      },
    ])
  }

  const metrics = [
    { value: '2,036', label: 'Total Policies' },
    { value: '2,040', label: 'Documents' },
    { value: '03', label: 'Overdue Reviews', highlight: true },
    { value: '06', label: 'Pending Approvals', highlight: true },
    { value: '₹30.3L', label: 'Compliance Budget' },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-6 py-6">
      <div className="max-w-[1280px] mx-auto">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex items-start gap-3 mb-2">
          <span className="mt-1 text-[11px] font-semibold bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full">
            Governance
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Hanken Grotesk, Inter, sans-serif' }}>
          Governance &amp; Compliance (GRC)
        </h1>
        <p className="text-sm text-slate-500 mb-6">Policies need your attention this quarter</p>

        {/* ── Metrics Row ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-7">
          {metrics.map(m => (
            <div key={m.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
              <p className={`text-2xl font-bold leading-tight ${m.highlight ? 'text-red-500' : 'text-slate-900'}`}>
                {m.value}
              </p>
              <p className="text-xs text-slate-500 mt-1">{m.label}</p>
            </div>
          ))}
        </div>

        {/* ── Tabs ────────────────────────────────────────────────────────── */}
        <div className="flex gap-0 border-b border-slate-200 mb-6">
          {[
            { key: 'governance', label: 'Governance Record' },
            { key: 'certifications', label: 'Certifications & Awards' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-all ${
                activeTab === t.key
                  ? 'border-[#10B981] text-[#064E3B]'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Governance Record Tab ────────────────────────────────────────── */}
        {activeTab === 'governance' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            {/* Table toolbar */}
            <div className="flex items-center justify-between mb-5 gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search policies..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
                />
              </div>
              <button
                onClick={() => setShowWizard(true)}
                className="flex items-center gap-1.5 bg-[#064E3B] text-white text-xs font-semibold px-3.5 py-2 rounded-lg hover:bg-[#065F46] transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> Add Policy
              </button>
            </div>

            {/* Policy Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    {['POLICY', 'CATEGORY', 'DEPT.', 'REVIEW DATE', 'STATUS', 'REVIEW STATUS', 'ACTIONS'].map(h => (
                      <th key={h} className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider pb-3 pr-4 last:pr-0">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 pr-4 font-medium text-slate-800 text-xs max-w-[220px]">{p.policy}</td>
                      <td className="py-3 pr-4 text-xs text-slate-500">{p.category}</td>
                      <td className="py-3 pr-4 text-xs text-slate-500">{p.dept}</td>
                      <td className="py-3 pr-4 text-xs text-slate-500 whitespace-nowrap">{p.reviewDate}</td>
                      <td className="py-3 pr-4"><ActiveBadge /></td>
                      <td className="py-3 pr-4"><ReviewStatusBadge status={p.reviewStatus} /></td>
                      <td className="py-3">
                        <button className="text-[11px] text-[#10B981] hover:underline font-medium">View</button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-sm text-slate-400">No policies match your search.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Certifications Tab ───────────────────────────────────────────── */}
        {activeTab === 'certifications' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
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

      {/* ── Wizard Modal ────────────────────────────────────────────────────── */}
      {showWizard && (
        <WizardModal
          onClose={() => setShowWizard(false)}
          onSubmit={handleWizardSubmit}
        />
      )}
    </div>
  )
}
