/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import { Plus, ChevronDown, Building2, ClipboardList, IndianRupee, Users, UserRound, Pencil, Trash2 } from 'lucide-react'
// CSR Activities connected to SQLite database API

// ── Data ───────────────────────────────────────────────────────────────────────
const SPEND_DATA = [
  { month: 'Apr', budget: 40, spend: 28, impact: 32 },
  { month: 'May', budget: 42, spend: 35, impact: 38 },
  { month: 'Jun', budget: 45, spend: 30, impact: 34 },
  { month: 'Jul', budget: 43, spend: 38, impact: 40 },
  { month: 'Aug', budget: 48, spend: 42, impact: 45 },
  { month: 'Sep', budget: 50, spend: 45, impact: 48 },
  { month: 'Oct', budget: 52, spend: 40, impact: 44 },
  { month: 'Nov', budget: 55, spend: 50, impact: 52 },
  { month: 'Dec', budget: 58, spend: 55, impact: 58 },
  { month: 'Jan', budget: 60, spend: 48, impact: 50 },
  { month: 'Feb', budget: 62, spend: 52, impact: 55 },
  { month: 'Mar', budget: 65, spend: 60, impact: 62 },
]

const GENDER_DATA = [
  { name: 'Female', value: 1346, pct: 47.2, color: '#10B981' },
  { name: 'Male',   value: 1464, pct: 51.4, color: '#064E3B' },
  { name: 'Other',  value: 84,   pct: 1.2,  color: '#6EE7B7' },
]

const SDG_INFO = {
  1:  { color: '#E5243B', name: 'No Poverty',                line1: 'NO',         line2: 'POVERTY'        },
  2:  { color: '#DDA63A', name: 'Zero Hunger',               line1: 'ZERO',       line2: 'HUNGER'         },
  3:  { color: '#4C9F38', name: 'Good Health',               line1: 'GOOD',       line2: 'HEALTH'         },
  4:  { color: '#C5192D', name: 'Quality Education',         line1: 'QUALITY',    line2: 'EDUCATION'      },
  5:  { color: '#FF3A21', name: 'Gender Equality',           line1: 'GENDER',     line2: 'EQUALITY'       },
  6:  { color: '#26BDE2', name: 'Clean Water',               line1: 'CLEAN',      line2: 'WATER'          },
  7:  { color: '#FCC30B', name: 'Affordable Energy',         line1: 'CLEAN',      line2: 'ENERGY'         },
  8:  { color: '#A21942', name: 'Decent Work',               line1: 'DECENT',     line2: 'WORK'           },
  9:  { color: '#FD6925', name: 'Industry & Innovation',     line1: 'INDUSTRY',   line2: 'INNOVATION'     },
  10: { color: '#DD1367', name: 'Reduced Inequalities',      line1: 'REDUCED',    line2: 'INEQUALITIES'   },
  11: { color: '#FD9D24', name: 'Sustainable Cities',        line1: 'SUST.',      line2: 'CITIES'         },
  12: { color: '#BF8B2E', name: 'Responsible Consumption',   line1: 'RESP.',      line2: 'CONSUMPTION'    },
  13: { color: '#3F7E44', name: 'Climate Action',            line1: 'CLIMATE',    line2: 'ACTION'         },
  14: { color: '#0A97D9', name: 'Life Below Water',          line1: 'LIFE',       line2: 'BELOW WATER'    },
  15: { color: '#56C02B', name: 'Life on Land',              line1: 'LIFE',       line2: 'ON LAND'        },
  16: { color: '#00689D', name: 'Peace & Justice',           line1: 'PEACE',      line2: '& JUSTICE'      },
  17: { color: '#19486A', name: 'Partnerships',              line1: 'PARTNER-',   line2: 'SHIPS'          },
}

const INITIAL_PROJECTS = [
  { id: 1, initials: 'SH', avatarColor: '#4C9F38',  name: 'Shiksha Setu — Rural Education',       category: 'Education',        location: '4 states',      sdgRef: 'SDG 4',   spend: 8620000,  budget: 10500000, beneficiaries: 8420,  femalePct: 52,  sdg: [4, 8, 1],  status: 'Active'   },
  { id: 2, initials: 'Jl', avatarColor: '#26BDE2',  name: 'Jal Mitra — Clean Water Initiative',   category: 'Water & Sanitation',location: 'Gujarat & MP',  sdgRef: 'SDG 6',   spend: 6240000,  budget: 7500000,  beneficiaries: 12840, femalePct: 54,  sdg: [6, 3],     status: 'Active'   },
  { id: 3, initials: 'SK', avatarColor: '#FF3A21',  name: 'Skill Bharat — Women Livelihoods',      category: 'Skill Dev',        location: 'Maharashtra',   sdgRef: 'SDG 5, 8',spend: 4850000,  budget: 6000000,  beneficiaries: 3240,  femalePct: 100, sdg: [5, 8],     status: 'Active'   },
  { id: 4, initials: 'AR', avatarColor: '#3F7E44',  name: 'Arogya Vahini — Mobile Health',         category: 'Healthcare',       location: 'Rajasthan',     sdgRef: 'SDG 3',   spend: 3580000,  budget: 5000000,  beneficiaries: 9650,  femalePct: 61,  sdg: [3],        status: 'Active'   },
  { id: 5, initials: 'HR', avatarColor: '#A21942',  name: 'Hariyali — Tree Plantation Drive',      category: 'Environment',      location: '8 states',      sdgRef: 'SDG 13, 15',spend: 1840000,budget: 2800000,  beneficiaries: 4270,  femalePct: 46,  sdg: [13, 15],   status: 'Ongoing'  },
]

const ANNUAL_CHARTER = [
  { tag: 'JAN', month: 'Jan 2026',  esg: 'S', title: 'Employees Upgrading Initiative',                                   sdgs: [4, 8],     budget: 0,     status: 'Completed', parties: 'Employees'                },
  { tag: 'FEB', month: 'Feb 2026',  esg: 'E', title: 'Food Donation & Food Waste Reduction Drive',                       sdgs: [2, 12],    budget: 10000, status: 'Completed', parties: 'NGOs / Community'         },
  { tag: 'MAR', month: 'Mar 2026',  esg: 'S', title: "Women's Day – Inclusion & Equality Program",                       sdgs: [5, 10],    budget: 20000, status: 'Completed', parties: 'Employees'                },
  { tag: 'APR', month: 'Apr 2026',  esg: 'S', title: 'Health Check-up Camp / Eye Check-up Camp',                         sdgs: [3],        budget: 20000, status: 'Completed', parties: 'Employees / Medical'      },
  { tag: 'MAY', month: 'May 2026',  esg: 'S', title: "Labour's Day Celebration & No-Tobacco Awareness Session",           sdgs: [3, 8],     budget: 20000, status: 'Completed', parties: 'Employees'                },
  { tag: 'JUN', month: 'Jun 2026',  esg: 'E', title: 'Environment Day Celebration',                                      sdgs: [13, 15],   budget: 5000,  status: 'Upcoming',  parties: 'NGOs / Community'         },
  { tag: 'JUN', month: 'Jun 2026',  esg: 'S', title: 'Blood Donation Camp',                                              sdgs: [3],        budget: 0,     status: 'Upcoming',  parties: 'Employees'                },
  { tag: 'JUN', month: 'Jun 2026',  esg: 'S', title: 'Yoga Day',                                                         sdgs: [3],        budget: 2000,  status: 'Upcoming',  parties: 'Employees'                },
  { tag: 'JUL', month: 'Jul 2026',  esg: 'S', title: 'Support to Local Schools / Anganwadi',                             sdgs: [4, 6, 10], budget: 20000, status: 'Planning',  parties: 'Community'                },
  { tag: 'AUG', month: 'Aug 2026',  esg: 'E', title: 'Animal Welfare Support Program',                                   sdgs: [15],       budget: 15000, status: 'Planning',  parties: 'NGOs'                     },
  { tag: 'SEP', month: 'Sep 2026',  esg: 'G', title: 'Seminar – Code of Conduct, POSH & Whistleblower Awareness',        sdgs: [5, 16],    budget: 5000,  status: 'Planning',  parties: 'Employees / NGOs'         },
  { tag: 'OCT', month: 'Oct 2026',  esg: 'E', title: 'Clean Up Drive',                                                   sdgs: [11, 12],   budget: 3000,  status: 'Planning',  parties: 'Employees'                },
  { tag: 'NOV', month: 'Nov 2026',  esg: 'S', title: "Men's Day Celebration",                                            sdgs: [5, 10],    budget: 0,     status: 'Planning',  parties: 'Employees'                },
  { tag: 'NOV', month: 'Nov 2026',  esg: 'S', title: 'Donation Drive',                                                   sdgs: [1, 10],    budget: 0,     status: 'Planning',  parties: 'Employees'                },
  { tag: 'DEC', month: 'Dec 2026',  esg: 'E', title: 'Energy Conservation Awareness Program',                            sdgs: [7, 13],    budget: 5000,  status: 'Planning',  parties: 'Employees'                },
  { tag: 'JAN', month: 'Jan 2027',  esg: 'G', title: 'Invite Sustainability Experts',                                    sdgs: [12, 13],   budget: 0,     status: 'Planning',  parties: 'Employees'                },
  { tag: 'FEB', month: 'Feb 2027',  esg: 'S', title: 'Financial Literacy & Tax Awareness Session',                       sdgs: [4, 8],     budget: 5000,  status: 'Planning',  parties: 'Employees'                },
]

const ESG_BADGE = {
  E:     'bg-emerald-100 text-emerald-800',
  S:     'bg-blue-100 text-blue-800',
  G:     'bg-violet-100 text-violet-800',
  'E & G': 'bg-teal-100 text-teal-800',
}

const CHARTER_STATUS_STYLE = {
  Completed: 'bg-slate-100 text-slate-500',
  Upcoming:  'bg-emerald-100 text-emerald-700',
  Planning:  'bg-amber-100 text-amber-700',
}

const CATEGORIES    = ['Education', 'Health', 'Environment', 'Rural Development', 'Women Empowerment']
const FY_OPTIONS    = ['FY 2024-25', 'FY 2025-26', 'FY 2026-27']
const STATUS_OPTIONS = ['Active', 'Ongoing', 'Completed', 'In Review']
const SCHEDULE_VII  = ['(i) Eradicating poverty', '(ii) Promoting education', '(iii) Gender equality', '(iv) Environmental sustainability', '(v) National heritage', '(vi) Armed forces welfare', '(vii) Sports', '(viii) Education for PMs programs', '(ix) Technology incubators', '(x) Rural development']
const STATES        = ['Gujarat', 'Maharashtra', 'Rajasthan', 'Madhya Pradesh', 'Uttar Pradesh', 'Karnataka']
const DISTRICTS     = ['Banaskantha', 'Surat', 'Ahmedabad', 'Patan', 'Mehsana', 'Sabarkantha']

const CSR_STEPS = [
  'Activity Details',
  'Location',
  'NGO / Implementation Partner',
  'Timeline',
  'Financials',
  'Beneficiaries',
  'Impact',
  'Uploads & Evidence',
]

const STEP_DESC = [
  'Activity name, category, and Schedule VII details for statutory reporting.',
  'Where will this activity be delivered? Used for state-wise CSR-2 reporting & ESG disclosures.',
  'Which implementing partner or NGO will execute this activity?',
  'Define when this activity will take place and its duration.',
  'Capture budget allocation, actual spend, and cost breakdown.',
  'Who did this activity reach? Disaggregated data powers your gender & equity reporting.',
  'What outcomes were achieved? Link to SDGs and measure social return.',
  'Attach supporting evidence — reports, photos, invoices, and compliance documents.',
]

const SDG_OPTIONS = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17].map(n => ({ num: n, label: SDG_INFO[n]?.name || `Goal ${n}` }))

// ── CSR Impact Mapping (from CSR_Impact_Mapping.xlsx) ─────────────────────────
const IMPACT_MAPPING = {
  'Environment': {
    subtypes: ['Tree Plantation','Beach Cleaning','River Cleaning','Waste Management','Plastic Waste Collection Drive','E-Waste Collection Drive','Water Conservation','Rainwater Harvesting','Biodiversity Conservation','Animal Welfare'],
    metrics: {
      'Tree Plantation':              [{ key:'treesPlanted', label:'Trees Planted', unit:'count' },{ key:'survivalRate', label:'Survival Rate', unit:'%' },{ key:'areaCovered', label:'Area Covered', unit:'acres' },{ key:'co2Offset', label:'CO₂ Offset', unit:'tons' },{ key:'volunteerHours', label:'Volunteer Hours', unit:'hrs' },{ key:'volunteers', label:'Volunteers', unit:'count' }],
      'Beach Cleaning':               [{ key:'wasteCollected', label:'Waste Collected', unit:'kg' },{ key:'plasticWaste', label:'Plastic Waste', unit:'kg' },{ key:'areaCleaned', label:'Area Cleaned', unit:'sq.m' },{ key:'volunteers', label:'Volunteers', unit:'count' },{ key:'volunteerHours', label:'Volunteer Hours', unit:'hrs' }],
      'River Cleaning':               [{ key:'wasteCollected', label:'Waste Collected', unit:'kg' },{ key:'areaCleaned', label:'Area Cleaned', unit:'sq.m' },{ key:'volunteers', label:'Volunteers', unit:'count' },{ key:'volunteerHours', label:'Volunteer Hours', unit:'hrs' }],
      'Waste Management':             [{ key:'wasteCollected', label:'Waste Collected', unit:'kg' },{ key:'wasteRecycled', label:'Waste Recycled', unit:'kg' }],
      'Plastic Waste Collection Drive':[{ key:'plasticCollected', label:'Plastic Collected', unit:'kg' },{ key:'drivesCount', label:'Collection Drives Conducted', unit:'count' },{ key:'volunteers', label:'Volunteers', unit:'count' },{ key:'volunteerHours', label:'Volunteer Hours', unit:'hrs' }],
      'E-Waste Collection Drive':     [{ key:'ewasteCollected', label:'E-Waste Collected', unit:'kg' },{ key:'drivesCount', label:'Collection Drives Conducted', unit:'count' },{ key:'volunteers', label:'Volunteers', unit:'count' },{ key:'volunteerHours', label:'Volunteer Hours', unit:'hrs' }],
      'Water Conservation':           [{ key:'waterSaved', label:'Water Saved', unit:'liters' },{ key:'structuresBuilt', label:'Structures Built', unit:'count' },{ key:'areaImpacted', label:'Area Impacted', unit:'acres' },{ key:'beneficiaries', label:'Beneficiaries', unit:'count' }],
      'Rainwater Harvesting':         [{ key:'systemsInstalled', label:'Systems Installed', unit:'count' },{ key:'waterCollected', label:'Water Collected', unit:'liters' },{ key:'buildingsCovered', label:'Buildings Covered', unit:'count' },{ key:'beneficiaries', label:'Beneficiaries', unit:'count' }],
      'Biodiversity Conservation':    [{ key:'treesPreserved', label:'Trees / Plants Preserved', unit:'count' },{ key:'speciesProtected', label:'Species Protected', unit:'count' },{ key:'areaRestored', label:'Area Restored', unit:'acres' },{ key:'activitiesConducted', label:'Activities Conducted', unit:'count' }],
      'Animal Welfare':               [{ key:'animalsTreated', label:'Animals Treated', unit:'count' },{ key:'animalsRescued', label:'Animals Rescued', unit:'count' },{ key:'campsConducted', label:'Camps Conducted', unit:'count' },{ key:'foodDistributed', label:'Food Distributed', unit:'units' }],
    },
  },
  'Healthcare': {
    subtypes: ['Blood Donation Camp','Health Check-up Camp','Nutrition Program'],
    metrics: {
      'Blood Donation Camp':  [{ key:'bloodUnits', label:'Blood Units Collected', unit:'units' },{ key:'donorsCount', label:'Donors', unit:'count' }],
      'Health Check-up Camp': [{ key:'patientsTreated', label:'Patients Treated', unit:'count' },{ key:'campsConducted', label:'Camps Conducted', unit:'count' }],
      'Nutrition Program':    [{ key:'beneficiaries', label:'Beneficiaries', unit:'count' },{ key:'mealsProvided', label:'Meals Provided', unit:'count' }],
    },
  },
  'Education': {
    subtypes: ['School Support Program','Scholarship Program','Digital Education'],
    metrics: {
      'School Support Program': [{ key:'studentsBenefited', label:'Students Benefited', unit:'count' },{ key:'schoolsSupported', label:'Schools Supported', unit:'count' }],
      'Scholarship Program':    [{ key:'studentsSupported', label:'Students Supported', unit:'count' },{ key:'amountDisbursed', label:'Amount Disbursed', unit:'₹' }],
      'Digital Education':      [{ key:'devicesDistributed', label:'Devices Distributed', unit:'count' },{ key:'studentsTrained', label:'Students Trained', unit:'count' }],
    },
  },
  'Livelihood & Skill Development': {
    subtypes: ['Vocational Training','Employment Generation Program'],
    metrics: {
      'Vocational Training':             [{ key:'peopleTrained', label:'People Trained', unit:'count' },{ key:'certificationsGiven', label:'Certifications Given', unit:'count' }],
      'Employment Generation Program':   [{ key:'jobsCreated', label:'Jobs Created', unit:'count' }],
    },
  },
  'Women Empowerment': {
    subtypes: ['Menstrual Health Awareness'],
    metrics: {
      'Menstrual Health Awareness': [{ key:'womenReached', label:'Women Reached', unit:'count' },{ key:'kitsDistributed', label:'Kits Distributed', unit:'count' }],
    },
  },
  'Child Welfare': {
    subtypes: ['Child Education Support'],
    metrics: {
      'Child Education Support': [{ key:'studentsSupported', label:'Students Supported', unit:'count' }],
    },
  },
  'Rural Development': {
    subtypes: ['Village Development Program'],
    metrics: {
      'Village Development Program': [{ key:'villagesCovered', label:'Villages Covered', unit:'count' }],
    },
  },
  'Water & Sanitation': {
    subtypes: ['Drinking Water Project'],
    metrics: {
      'Drinking Water Project': [{ key:'peopleServed', label:'People Served', unit:'count' }],
    },
  },
  'Social Welfare': {
    subtypes: ['Food Distribution Drive'],
    metrics: {
      'Food Distribution Drive': [{ key:'mealsDistributed', label:'Meals Distributed', unit:'count' }],
    },
  },
  'Awareness & Campaign': {
    subtypes: ['Health Awareness'],
    metrics: {
      'Health Awareness': [{ key:'peopleReached', label:'People Reached', unit:'count' }],
    },
  },
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmtSpend(n) {
  if (n >= 10000000) return '₹' + (n / 10000000).toFixed(2) + 'Cr'
  return '₹' + (n / 100000).toFixed(1) + 'L'
}
function spendPct(spend, budget) {
  return budget > 0 ? Math.round((spend / budget) * 100) : 0
}

// ── Small components ───────────────────────────────────────────────────────────
function StatusDot({ status }) {
  const map = {
    Active:      { dot: '#10B981', text: 'text-slate-700',  label: 'ACTIVE'    },
    Ongoing:     { dot: '#F59E0B', text: 'text-amber-600',  label: 'IN PROG.'  },
    Completed:   { dot: '#94A3B8', text: 'text-slate-500',  label: 'COMPLETE'  },
    'In Review': { dot: '#6366F1', text: 'text-indigo-600', label: 'IN REVIEW' },
  }
  const s = map[status] ?? { dot: '#94A3B8', text: 'text-slate-500', label: status.toUpperCase() }
  return (
    <span className={`flex items-center gap-1.5 text-xs font-semibold ${s.text}`}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: s.dot }} />
      {s.label}
    </span>
  )
}

function SdgTile({ num, size = 'sm' }) {
  const sdg = SDG_INFO[num]
  if (!sdg) return null
  const h = size === 'lg' ? 44 : 28
  return (
    <img
      src={`/sdg/sdg_${String(num).padStart(2, '0')}.png`}
      alt={`SDG ${num}: ${sdg.name}`}
      title={`SDG ${num}: ${sdg.name}`}
      className="shrink-0 rounded-sm shadow-sm"
      style={{ height: h, width: 'auto', display: 'inline-block' }}
    />
  )
}

// ── Wizard steps ───────────────────────────────────────────────────────────────
function Step1({ form, setForm }) {
  const activityTypes = ['Environment','Healthcare','Education','Livelihood & Skill Development','Women Empowerment','Child Welfare','Rural Development','Water & Sanitation','Social Welfare','Awareness & Campaign','Other']
  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
  const subTypes = form.activityType && IMPACT_MAPPING[form.activityType] ? IMPACT_MAPPING[form.activityType].subtypes : []

  return (
    <div className="space-y-6">
      <div className="max-w-3xl space-y-5">
        <div className="col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Activity Name <span className="text-red-500">*</span>
          </label>
          <input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Annual Tree Plantation Drive — Banaskantha"
            className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm text-slate-800 outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Activity Type <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-4 gap-3">
            {activityTypes.map(type => {
              const active = (form.activityType || form.category) === type
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, activityType: type }))}
                  className={`h-20 rounded-xl border px-3 text-left transition-all ${
                    active
                      ? 'border-[#10B981] bg-[#ECFDF5] shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-[#E6F4F1] text-xs font-bold text-[#064E3B]">
                    {type.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="block text-xs font-bold text-slate-800">{type}</span>
                </button>
              )
            })}
          </div>
        </div>
        {form.activityType === 'Other' && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Other Details <span className="text-red-500">*</span></label>
            <input
              value={form.otherActivityDetails || ''}
              onChange={e => setForm(f => ({ ...f, otherActivityDetails: e.target.value }))}
              placeholder="Add activity type details"
              className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm text-slate-800 outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all"
            />
          </div>
        )}

        {subTypes.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Sub-Type <span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-2">
              {subTypes.map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, subType: st, impactMetrics: {} }))}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-all ${
                    form.subType === st
                      ? 'border-[#10B981] bg-[#ECFDF5] text-[#064E3B] shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Financial Year <span className="text-red-500">*</span></label>
          <div className="relative">
            <select
              value={form.fy}
              onChange={e => setForm(f => ({ ...f, fy: e.target.value }))}
              className="w-full h-11 border border-slate-200 rounded-xl px-4 pr-9 text-sm text-slate-800 bg-white outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all appearance-none"
            >
              {FY_OPTIONS.map(y => <option key={y}>{y}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Month <span className="text-red-500">*</span></label>
          <div className="relative">
            <select
              value={form.month || ''}
              onChange={e => setForm(f => ({ ...f, month: e.target.value }))}
              className="w-full h-11 border border-slate-200 rounded-xl px-4 pr-9 text-sm text-slate-800 bg-white outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all appearance-none"
            >
              {months.map(m => <option key={m}>{m}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Schedule VII Category <span className="text-red-500">*</span></label>
          <div className="relative">
            <select
              value={form.scheduleVII || ''}
              onChange={e => setForm(f => ({ ...f, scheduleVII: e.target.value }))}
              className="w-full h-11 border border-slate-200 rounded-xl px-4 pr-9 text-sm text-slate-800 bg-white outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all appearance-none"
            >
              <option value="">Select Schedule VII item</option>
              {SCHEDULE_VII.map(s => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Activity Description</label>
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={3}
            placeholder="Briefly describe what this activity involves and its intended impact..."
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all resize-none"
          />
        </div>
        <div className="rounded-xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
          This CSR activity will appear in statutory CSR-2 disclosures and portfolio impact reporting.
        </div>
      </div>
    </div>
  )
}

function Step3({ form, setForm }) {
  const locationTitle = [form.district, form.state].filter(Boolean).join(', ')
  const cityLabel = form.village?.split(',')[0]?.trim() || 'Location'
  const settingCopy = `${form.setting || 'Rural'} region · CSR reporting location`

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">State <span className="text-red-500">*</span></label>
          <div className="relative">
            <select
              value={form.state}
              onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
              className="w-full h-11 border border-slate-200 rounded-xl px-4 pr-9 text-sm text-slate-800 bg-white outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all appearance-none"
            >
              {STATES.map(s => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">District <span className="text-red-500">*</span></label>
          <div className="relative">
            <select
              value={form.district}
              onChange={e => setForm(f => ({ ...f, district: e.target.value }))}
              className="w-full h-11 border border-slate-200 rounded-xl px-4 pr-9 text-sm text-slate-800 bg-white outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all appearance-none"
            >
              {DISTRICTS.map(d => <option key={d}>{d}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">City / Village <span className="text-red-500">*</span></label>
          <input
            value={form.village}
            onChange={e => setForm(f => ({ ...f, village: e.target.value }))}
            className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm text-slate-800 outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Setting</label>
          <div className="flex h-11 rounded-xl bg-slate-100 p-1 gap-1">
            {['Rural', 'Urban', 'Peri-urban'].map(s => (
              <button key={s} onClick={() => setForm(f => ({ ...f, setting: s }))}
                className={`flex-1 rounded-lg text-sm font-semibold transition-all ${form.setting === s ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                {s === 'Rural' && <span className="mr-1">⌂</span>}{s}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-1.5">73% of your activities this FY are rural — aligned with your CSR policy.</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Geo-tag (optional)</label>
          <input
            value={form.geotag}
            onChange={e => setForm(f => ({ ...f, geotag: e.target.value }))}
            className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm text-slate-800 outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all"
          />
        </div>
      </div>

      {/* Map preview */}
      <div className="rounded-2xl border border-[#A7F3D0] bg-[#F0FDF9] px-6 py-5 flex items-center gap-8">
        <div className="relative shrink-0" style={{ width: 80, height: 110 }}>
          <svg viewBox="0 0 80 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M40 5 C20 5 8 20 8 38 C8 62 40 105 40 105 C40 105 72 62 72 38 C72 20 60 5 40 5Z"
              fill="#D1FAE5" stroke="#10B981" strokeWidth="2" />
            <circle cx="40" cy="40" r="10" fill="#6EE7B7" stroke="#10B981" strokeWidth="2" />
            <circle cx="40" cy="40" r="4" fill="#059669" />
          </svg>
          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[#059669] whitespace-nowrap">{cityLabel}</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>{locationTitle}</h3>
          <p className="text-sm text-slate-500 mt-1">{settingCopy} · {form.village}</p>
          <div className="flex items-center gap-3 mt-3">
            <span className="flex items-center gap-1 text-sm font-semibold text-[#059669]">
              <span className="w-2 h-2 rounded-full bg-[#059669]" />
              Eligible for CSR Sec 135
            </span>
            <span className="flex items-center gap-1 text-sm font-semibold text-sky-600 bg-sky-100 px-3 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              Schedule VII · (ii)
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Step4({ form, setForm, showNotice }) {
  function changePartner() {
    const next = form.agency === 'Draft Foundation'
      ? { agency: 'Samridhi Foundation', partnerFocus: 'Rural Development', csrRegNo: 'CSR00067890', contactPerson: 'Priya Sharma', contactEmail: 'priya@samridhi.org', contactPhone: '+91 99887 77665' }
      : { agency: 'Draft Foundation', partnerFocus: 'Education', csrRegNo: 'CSR00012345', contactPerson: 'Ramesh Sharma', contactEmail: 'ramesh@draft.org', contactPhone: '+91 98765 43210' }
    setForm(f => ({ ...f, ...next }))
    showNotice(`Partner changed to ${next.agency}`)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Partner Type <span className="text-red-500">*</span></label>
          <div className="relative">
            <select
              value={form.partnerType || 'NGO'}
              onChange={e => setForm(f => ({ ...f, partnerType: e.target.value }))}
              className="w-full h-11 border border-slate-200 rounded-xl px-4 pr-9 text-sm text-slate-800 bg-white outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all appearance-none"
            >
              {['Internal', 'External'].map(t => <option key={t}>{t}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Partner / NGO Name <span className="text-red-500">*</span>
          </label>
          <input
            value={form.agency || ''}
            onChange={e => setForm(f => ({ ...f, agency: e.target.value }))}
            placeholder="Draft Foundation"
            className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm text-slate-800 outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Contact Person</label>
          <input
            value={form.contactPerson || ''}
            onChange={e => setForm(f => ({ ...f, contactPerson: e.target.value }))}
            placeholder="Ramesh Sharma"
            className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm text-slate-800 outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label>
          <input
            value={form.contactPhone || ''}
            onChange={e => setForm(f => ({ ...f, contactPhone: e.target.value }))}
            placeholder="+91 98765 43210"
            className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm text-slate-800 outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Contact Email</label>
          <input
            type="email"
            value={form.contactEmail || ''}
            onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))}
            placeholder="partner@ngo.org"
            className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm text-slate-800 outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all"
          />
        </div>
      </div>
    </div>
  )
}

function Step5({ form, setForm }) {
  const start = form.startDate || ''
  const end = form.endDate || ''
  let duration = '90 days'
  if (start && end) {
    const d1 = new Date(start), d2 = new Date(end)
    const days = Math.round((d2 - d1) / 86400000)
    if (days > 0) duration = days >= 30 ? `${Math.round(days / 30)} months` : `${days} days`
  }
  const fmtDate = value => {
    if (!value) return ''
    const date = new Date(`${value}T00:00:00`)
    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }
  const midpoint = start && end
    ? new Date((new Date(`${start}T00:00:00`).getTime() + new Date(`${end}T00:00:00`).getTime()) / 2)
    : null
  const midpointLabel = midpoint && !Number.isNaN(midpoint.getTime())
    ? midpoint.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'Midway'

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Start Date <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={form.startDate || ''}
            onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
            placeholder="YYYY-MM-DD"
            className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm text-slate-800 outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">End Date <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={form.endDate || ''}
            onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
            placeholder="YYYY-MM-DD"
            className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm text-slate-800 outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Activity Status</label>
          <div className="relative">
            <select
              value={form.activityStatus || 'In Progress'}
              onChange={e => setForm(f => ({ ...f, activityStatus: e.target.value }))}
              className="w-full h-11 border border-slate-200 rounded-xl px-4 pr-9 text-sm text-slate-800 bg-white outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all appearance-none"
            >
              {['Planned', 'In Progress', 'Completed', 'Delayed'].map(s => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>


      <div className="grid grid-cols-3 gap-4">
        {[
          ['Duration', duration],
          ['Reporting Quarter', form.quarter || 'Q4 (Jan-Mar)'],
          ['Completion', '62% complete'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
            <p className="mt-1 text-sm font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function Step6({ form, setForm }) {
  const allocated = parseFloat(form.allocatedBudget || 0)
  const actual    = parseFloat(form.actualSpend     || 0)
  const unspent   = Math.max(0, allocated - actual)

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 max-w-md">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Allocated Budget (₹) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            value={form.allocatedBudget || ''}
            onChange={e => setForm(f => ({ ...f, allocatedBudget: e.target.value }))}
            placeholder="e.g. 500000"
            className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm text-slate-800 outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Actual Spend (₹) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            value={form.actualSpend || ''}
            onChange={e => setForm(f => ({ ...f, actualSpend: e.target.value }))}
            placeholder="e.g. 320000"
            className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm text-slate-800 outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Unspent Amount (Auto)
          </label>
          <div className="flex h-11 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700">
            ₹ {unspent > 0 ? unspent.toLocaleString('en-IN') : '—'}
          </div>
        </div>
      </div>
    </div>
  )
}

function Step7({ form, setForm }) {
  const total   = parseInt(form.benTotal  || 0)
  const female  = parseInt(form.benFemale || 0)
  const male    = parseInt(form.benMale   || 0)
  const femalePct = total > 0 ? Math.round((female / total) * 100) : 0
  const r = 54, cx = 80, cy = 80
  const circ = 2 * Math.PI * r
  const fSlice = total > 0 ? (female / total) * circ : 0
  const mSlice = total > 0 ? (male   / total) * circ : 0

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-10">
        <div className="flex-1 space-y-5 max-w-lg">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Total <span className="text-red-500">*</span></label>
              <input
                type="number"
                value={form.benTotal || ''}
                onChange={e => setForm(f => ({ ...f, benTotal: e.target.value }))}
                placeholder="2,400"
                className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm text-slate-800 outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Female</label>
              <input
                type="number"
                value={form.benFemale || ''}
                onChange={e => setForm(f => ({ ...f, benFemale: e.target.value }))}
                placeholder="1,488"
                className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm text-slate-800 outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Male</label>
              <input
                type="number"
                value={form.benMale || ''}
                onChange={e => setForm(f => ({ ...f, benMale: e.target.value }))}
                placeholder="912"
                className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm text-slate-800 outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">CHILDREN</p>
              <input
                type="number"
                value={form.benChildren || ''}
                onChange={e => setForm(f => ({ ...f, benChildren: e.target.value }))}
                placeholder="2,180"
                className="w-full text-2xl font-bold text-slate-900 bg-transparent outline-none"
                style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
              />
            </div>
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">DIFFERENTLY ABLED</p>
              <input
                type="number"
                value={form.benDiffAbled || ''}
                onChange={e => setForm(f => ({ ...f, benDiffAbled: e.target.value }))}
                placeholder="34"
                className="w-full text-2xl font-bold text-slate-900 bg-transparent outline-none"
                style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
              />
            </div>
          </div>
        </div>

        {/* Donut */}
        <div className="shrink-0 flex flex-col items-center">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E2E8F0" strokeWidth="20" />
            {total > 0 && (
              <>
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#6366F1" strokeWidth="20"
                  strokeDasharray={`${circ} ${circ}`} strokeDashoffset={circ - mSlice}
                  transform={`rotate(-90 ${cx} ${cy})`} strokeLinecap="butt" />
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F43F5E" strokeWidth="20"
                  strokeDasharray={`${fSlice} ${circ}`} strokeDashoffset={0}
                  transform={`rotate(-90 ${cx} ${cy})`} strokeLinecap="butt" />
              </>
            )}
            <text x={cx} y={cy - 6} textAnchor="middle" fontSize="22" fontWeight="bold" fill="#111827"
              style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
              {total > 0 ? `${femalePct}%` : '—'}
            </text>
            <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fill="#94A3B8">Female reach</text>
          </svg>
          <div className="flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F43F5E]" />
              Female {female > 0 ? female.toLocaleString() : '—'}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6366F1]" />
              Male {male > 0 ? male.toLocaleString() : '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Step8({ form, setForm }) {
  const [selectedSdgs, setSelectedSdgs] = useState(form.sdgs || [])

  function toggleSdg(num) {
    const updated = selectedSdgs.includes(num)
      ? selectedSdgs.filter(n => n !== num)
      : [...selectedSdgs, num]
    setSelectedSdgs(updated)
    setForm(f => ({ ...f, sdgs: updated }))
  }

  const typeMap = IMPACT_MAPPING[form.activityType]
  const dynamicMetrics = typeMap && form.subType && typeMap.metrics[form.subType]
    ? typeMap.metrics[form.subType]
    : []

  function setMetricVal(key, val) {
    setForm(f => ({ ...f, impactMetrics: { ...(f.impactMetrics || {}), [key]: val } }))
  }

  return (
    <div className="space-y-6 max-w-2xl">

      {/* Dynamic impact metrics from CSR Impact Mapping */}
      {dynamicMetrics.length > 0 && (
        <div className="rounded-2xl border border-emerald-200 bg-[#F0FDF9] px-5 py-5">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#059669]">
            Impact Metrics — {form.activityType} · {form.subType}
          </p>
          <p className="mb-4 text-xs text-slate-500">Enter measured outcomes for this activity type.</p>
          <div className="grid grid-cols-2 gap-4">
            {dynamicMetrics.map(({ key, label, unit }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {label} <span className="font-normal text-slate-400">({unit})</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={(form.impactMetrics || {})[key] || ''}
                  onChange={e => setMetricVal(key, e.target.value)}
                  placeholder="0"
                  className="w-full h-10 border border-slate-200 rounded-xl px-3 text-sm text-slate-800 bg-white outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {!dynamicMetrics.length && (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-400">
          Select an Activity Type and Sub-Type in Step 1 to see the relevant impact metrics here.
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Outcome Description <span className="text-red-500">*</span></label>
        <textarea
          value={form.outcome || ''}
          onChange={e => setForm(f => ({ ...f, outcome: e.target.value }))}
          rows={4}
          placeholder="Describe the key social, environmental, or economic outcomes achieved through this activity..."
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">SDG Alignment</label>
        <p className="text-xs text-slate-400 mb-3">Select all Sustainable Development Goals this activity contributes to.</p>
        <div className="flex flex-wrap gap-2">
          {SDG_OPTIONS.map(({ num, label }) => (
            <button key={num} onClick={() => toggleSdg(num)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                selectedSdgs.includes(num)
                  ? 'text-white border-transparent'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
              style={selectedSdgs.includes(num) ? { background: SDG_INFO[num]?.color ?? '#064E3B' } : {}}
            >
              <span className="font-bold">{num}</span>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

const SAMPLE_FILES = [
  { name: 'Activity_Report_Q3_FY26.pdf',   type: 'PDF',   size: '2.4 MB',  color: 'bg-red-100 text-red-700'    },
  { name: 'Beneficiary_Photos_Mar26.zip',  type: 'ZIP',   size: '18.1 MB', color: 'bg-yellow-100 text-yellow-700' },
  { name: 'Budget_Utilization_FY26.xlsx',  type: 'XLSX',  size: '540 KB',  color: 'bg-green-100 text-green-700'  },
  { name: 'NGO_Partnership_MoU.pdf',       type: 'PDF',   size: '1.1 MB',  color: 'bg-red-100 text-red-700'    },
]

function Step9({ files, setFiles, showNotice }) {
  function addFiles(event) {
    const picked = Array.from(event.target.files || []).map(file => ({
      name: file.name,
      type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
      size: file.size > 1024 * 1024 ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(file.size / 1024))} KB`,
      color: 'bg-sky-100 text-sky-700',
    }))
    if (picked.length) {
      setFiles(current => [...current, ...picked])
      showNotice(`${picked.length} file${picked.length > 1 ? 's' : ''} added`)
    }
    event.target.value = ''
  }

  function removeFile(name) {
    setFiles(current => current.filter(file => file.name !== name))
    showNotice(`${name} removed`)
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center cursor-pointer hover:border-[#064E3B] hover:bg-[#E6F4F1]/20 transition-all group">
        <div className="w-12 h-12 rounded-full bg-[#ECFDF5] flex items-center justify-center mb-3 group-hover:bg-[#D1FAE5] transition-colors">
          <span className="text-[#10B981] text-2xl font-light">↑</span>
        </div>
        <p className="text-sm font-semibold text-slate-700">Drag & drop files here</p>
        <p className="text-xs text-slate-400 mt-1">or click to browse</p>
        <p className="text-[10px] text-slate-300 mt-2">PDF, Excel, Word, Image, ZIP — max 25 MB per file</p>
        <input type="file" multiple className="hidden" onChange={addFiles} />
      </label>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Attachments</p>
        {files.map((f, i) => (
          <div key={i} className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl px-4 py-3 hover:border-slate-200 transition-colors">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${f.color}`}>{f.type}</span>
            <span className="flex-1 text-sm text-slate-700 font-medium truncate">{f.name}</span>
            <span className="text-xs text-slate-400 shrink-0">{f.size}</span>
            <button
              type="button"
              onClick={() => removeFile(f.name)}
              className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-400 hover:bg-red-50 transition-colors text-sm"
              aria-label={`Remove ${f.name}`}
            >
              ×
            </button>
          </div>
        ))}
        {files.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-200 px-4 py-5 text-center text-sm text-slate-400">
            No attachments added yet.
          </div>
        )}
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function CSR() {
  const [currentUserEmail, setCurrentUserEmail] = useState(() => {
    const raw = localStorage.getItem('kg_current_user_v1')
    return raw ? JSON.parse(raw)?.email : null
  })
  
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)

  const [editIdx, setEditIdx] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [notice, setNotice] = useState('')
  const [draftSaved, setDraftSaved] = useState(false)
  const [charterFilter, setCharterFilter] = useState('All')
  const [files, setFiles] = useState(SAMPLE_FILES)
  const [chartPeriod, setChartPeriod] = useState('Monthly')
  const [cyYear,   setCyYear]   = useState('CY 2026')
  const [baseYear, setBaseYear] = useState('CY 2024 (Default)')

  useEffect(() => {
    const interval = setInterval(() => {
      const raw = localStorage.getItem('kg_current_user_v1')
      const email = raw ? JSON.parse(raw)?.email : null
      if (email !== currentUserEmail) {
        setCurrentUserEmail(email)
      }
    }, 500)
    return () => clearInterval(interval)
  }, [currentUserEmail])

  useEffect(() => {
    if (!currentUserEmail) {
      Promise.resolve().then(() => {
        setActivities([])
        setLoading(false)
        setHasLoaded(true)
      })
      return
    }

    Promise.resolve().then(() => {
      setLoading(true)
    })
    fetch(`http://localhost:5000/api/csr-activities?email=${encodeURIComponent(currentUserEmail)}`)
      .then(res => {
        if (!res.ok) throw new Error('API Error')
        return res.json()
      })
      .then(data => {
        if (data.length === 0 && currentUserEmail === 'ketanbheda@kgirdharlal.com') {
          fetch('http://localhost:5000/api/csr-activities/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: currentUserEmail, activities: ANNUAL_CHARTER })
          })
            .then(() => {
              setActivities(ANNUAL_CHARTER)
              setLoading(false)
              setHasLoaded(true)
            })
            .catch(err => {
              console.error(err)
              setActivities(ANNUAL_CHARTER)
              setLoading(false)
              setHasLoaded(true)
            })
        } else {
          setActivities(data)
          setLoading(false)
          setHasLoaded(true)
        }
      })
      .catch(err => {
        console.error(err)
        const stored = localStorage.getItem(`kg_csr_activities_v1_${currentUserEmail}`)
        if (stored) {
          try {
            setActivities(JSON.parse(stored))
          } catch {
            setActivities(currentUserEmail === 'ketanbheda@kgirdharlal.com' ? ANNUAL_CHARTER : [])
          }
        } else {
          setActivities(currentUserEmail === 'ketanbheda@kgirdharlal.com' ? ANNUAL_CHARTER : [])
        }
        setLoading(false)
        setHasLoaded(true)
      })
  }, [currentUserEmail])
  const [form, setForm] = useState({
    name: 'Digital Classroom Setup - Phase 2', category: CATEGORIES[0], activityType: 'Education', month: 'Jan', otherActivityDetails: '', fy: FY_OPTIONS[0],
    budget: '24', disbursed: '17.8', agency: 'Draft Foundation', description: 'Setting up smart classrooms and learning support in rural government schools.',
    startDate: '2026-01-01', endDate: '2026-03-31', status: STATUS_OPTIONS[0],
    project:  'Shiksha Setu — Rural Education (FY 25-26)',
    state:    'Gujarat',
    district: 'Banaskantha',
    village:  'Deesa, Tharad cluster',
    setting:  'Rural',
    geotag:   '24.2588° N, 72.1916° E',
    implType: 'Registered NGO (CSR-1)',
    partnerType: 'NGO',
    partnerFocus: 'Education',
    frequency: 'One-time',
    benTotal: '2400', benFemale: '1488', benMale: '912',
    benChildren: '2180', benDiffAbled: '34',
    sdgs: [], outcome: '', impactMetric: '', impactValue: '',
    scheduleVII: '(ii) Promoting education', csrRegNo: 'CSR00012345', contactPerson: 'Ramesh Sharma', contactEmail: 'ramesh@draft.org', contactPhone: '+91 98765 43210',
    implCost: '15', adminCost: '2.4', quarter: 'Q4 (Jan-Mar)', approvedAmount: '24', utilizedAmount: '17.8', activityStatus: 'In Progress',
  })

  function showNotice(message) {
    setNotice(message)
  }

  function handleSave() {
    const ESG_MAP = { 'Environment': 'E', 'Healthcare': 'S', 'Education': 'S', 'Livelihood & Skill Development': 'S', 'Women Empowerment': 'S', 'Child Welfare': 'S', 'Rural Development': 'S', 'Water & Sanitation': 'S', 'Social Welfare': 'S', 'Awareness & Campaign': 'S', 'Other': 'S' }
    const CAT_MAP = { 'Environment': 'Environment', 'Healthcare': 'Health', 'Education': 'Education', 'Women Empowerment': 'Social', 'Child Welfare': 'Social', 'Rural Development': 'Social', 'Water & Sanitation': 'Social', 'Social Welfare': 'Social', 'Awareness & Campaign': 'Social', 'Livelihood & Skill Development': 'Social', 'Other': 'Social' }
    const newActivity = {
      tag: (form.month || 'JAN').slice(0, 3).toUpperCase(),
      month: `${form.month || 'Jan'} ${form.fy?.slice(-2) === '27' ? '2027' : '2026'}`,
      esg: ESG_MAP[form.activityType] || 'S',
      category: CAT_MAP[form.activityType] || 'Social',
      title: form.name || 'New Activity',
      sdgs: form.sdgs || [],
      budget: parseFloat(form.allocatedBudget) || 0,
      status: form.activityStatus || 'Planning',
      parties: form.agency || 'Employees',
      desc: form.description || '',
      place: [form.village, form.district, form.state].filter(Boolean).join(', ') || 'TBD',
      date: form.startDate || `${form.month || 'Jan'} ${form.fy?.slice(-2) === '27' ? '2027' : '2026'}`,
      isNew: true,
    }
    if (editIdx !== null) {
      setActivities(a => a.map((act, i) => i === editIdx ? newActivity : act))
      showNotice('Activity updated')
    } else {
      setActivities(a => [...a, newActivity])
      showNotice('Activity added successfully')
    }
    setShowForm(false)
    setCurrentStep(0)
    setEditIdx(null)
    setDraftSaved(false)
  }

  function openWizard() { setEditIdx(null); setCurrentStep(0); setShowForm(true) }

  function openEdit(act, idx) {
    setForm(f => ({
      ...f,
      name: act.title,
      month: act.tag,
      allocatedBudget: act.budget ? String(act.budget) : '',
      activityStatus: act.status,
      agency: act.parties,
      sdgs: act.sdgs || [],
    }))
    setEditIdx(idx)
    setCurrentStep(0)
    setShowForm(true)
  }

  function deleteActivity(idx) {
    setActivities(a => a.filter((_, i) => i !== idx))
    showNotice('Activity removed')
  }

  function saveDraft() {
    setDraftSaved(true)
    showNotice(`Draft saved for ${form.name || 'new CSR activity'}`)
  }

  useEffect(() => {
    if (!hasLoaded || !currentUserEmail) return
    
    // Save to local storage as fallback
    localStorage.setItem(`kg_csr_activities_v1_${currentUserEmail}`, JSON.stringify(activities))

    // Sync activities to backend on change
    fetch('http://localhost:5000/api/csr-activities/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: currentUserEmail, activities })
    }).catch(err => console.error('Failed to sync CSR activities:', err))
  }, [activities, hasLoaded, currentUserEmail])

  const progressPct = Math.round((currentStep / (CSR_STEPS.length - 1)) * 100)

  const kpis = [
    { Icon: ClipboardList,   value: '84',      label: 'Total Activities',      sub: '+24% vs last FY'        },
    { Icon: IndianRupee,  value: '₹4.82Cr', label: 'Total Spend',          sub: '+8.4% of allocation'    },
    { Icon: Users,        value: '38,420',  label: 'Beneficiaries',         sub: '+24% vs last FY'        },
    { Icon: UserRound,    value: '205',     label: 'Female Beneficiaries', sub: '+34% vs last FY'        },
  ]

  const STEP_COMPONENTS = [
    <Step1 form={form} setForm={setForm} />,
    <Step3 form={form} setForm={setForm} />,
    <Step4 form={form} setForm={setForm} showNotice={showNotice} />,
    <Step5 form={form} setForm={setForm} />,
    <Step6 form={form} setForm={setForm} />,
    <Step7 form={form} setForm={setForm} />,
    <Step8 form={form} setForm={setForm} />,
    <Step9 files={files} setFiles={setFiles} showNotice={showNotice} />,
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-8 py-6">
      <div className="w-full">
        {notice && (
          <div className="fixed right-6 top-6 z-[70] flex items-center gap-3 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-[#064E3B] shadow-lg">
            <span className="h-2 w-2 rounded-full bg-[#10B981]" />
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice('')}
              className="ml-2 rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        )}

        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div className="-mx-8 -mt-6 px-8 pt-7 pb-5 mb-6 border-b border-slate-200 bg-white">
          {/* Row 1 — title + actions */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <h1 className="text-2xl font-extrabold text-[#111827]" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
              Corporate Social Responsibility
            </h1>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => showNotice('CSR dashboard is already open')}
                className="bg-[#064E3B] text-white text-sm font-semibold px-5 py-2 rounded-xl shadow-sm hover:bg-[#065f46] transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={openWizard}
                className="bg-white border border-slate-200 text-slate-700 text-sm font-semibold px-5 py-2 rounded-xl flex items-center gap-1.5 hover:border-[#064E3B] hover:text-[#064E3B] transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Activity
              </button>
            </div>
          </div>

          {/* Row 2 — year selectors + KPI cards */}
          <div className="flex items-stretch gap-4">
            {/* Year selectors */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="border border-slate-200 rounded-xl px-3 py-2 flex flex-col gap-0.5 bg-[#F8FAFC]">
                <span className="text-[10px] text-slate-400 uppercase tracking-wide whitespace-nowrap">Current Year</span>
                <select value={cyYear} onChange={e => setCyYear(e.target.value)}
                  className="bg-transparent text-slate-700 font-semibold text-xs outline-none cursor-pointer">
                  {['CY 2024', 'CY 2025', 'CY 2026'].map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
              <div className="border border-slate-200 rounded-xl px-3 py-2 flex flex-col gap-0.5 bg-[#F8FAFC]">
                <span className="text-[10px] text-slate-400 uppercase tracking-wide whitespace-nowrap">Baseline</span>
                <select value={baseYear} onChange={e => setBaseYear(e.target.value)}
                  className="bg-transparent text-slate-700 font-semibold text-xs outline-none cursor-pointer">
                  {['CY 2022', 'CY 2023', 'CY 2024 (Default)'].map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px bg-slate-200 self-stretch" />

            {/* KPI cards — fill remaining width */}
            <div className="flex items-stretch gap-3 flex-1">
              {kpis.map(k => (
                <div key={k.label} className="flex-1 bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-3 border-l-4 border-l-[#064E3B] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#E6F4F1] flex items-center justify-center shrink-0">
                    <k.Icon className="w-4 h-4 text-[#064E3B]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xl font-extrabold text-[#064E3B] leading-none" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
                      {k.value}
                    </p>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mt-1 truncate">{k.label}</p>
                    <p className="text-[10px] text-slate-400">{k.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Impact Summary Strip ────────────────────────────────────────── */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-6 divide-x divide-slate-100 px-0">
            {[
              { icon: '🌱', value: '12,500',    label: 'Trees Planted'    },
              { icon: '♻️',  value: '8,200 kg',  label: 'Waste Collected'  },
              { icon: '💧', value: '5.2M L',    label: 'Water Saved'      },
              { icon: '🩸', value: '1,200',     label: 'Blood Units'      },
              { icon: '🌿', value: '2,150',     label: 'Volunteers'       },
              { icon: '⏱️', value: '4,800 hrs', label: 'Volunteer Hours'  },
            ].map(({ icon, value, label }) => (
              <div key={label} className="flex flex-col items-start gap-1 px-5 py-4">
                <span className="text-xl leading-none mb-1">{icon}</span>
                <p className="text-base font-bold text-[#064E3B] leading-tight" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>{value}</p>
                <p className="text-[11px] text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Charts row ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-5 gap-5 mb-6">
          <div className="col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-start justify-between mb-1">
              <div>
                <h2 className="font-semibold text-slate-800 text-[15px]" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
                  Spend & Impact Trajectory
                </h2>
                <p className="text-[10px] text-slate-400 mt-0.5">Allocated vs Actual spend across the financial year</p>
              </div>
              <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                {['Monthly', 'Quarterly'].map(period => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => {
                      setChartPeriod(period)
                      showNotice(`Chart switched to ${period}`)
                    }}
                    className={`px-3 py-1 text-xs font-medium transition-colors ${chartPeriod === period ? 'bg-[#064E3B] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={SPEND_DATA} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="csrGradBudget" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#CBD5E1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#CBD5E1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="csrGradSpend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="csrGradImpact" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#064E3B" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#064E3B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 10, border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                    formatter={(v, name) => [`${v}L`, name]} />
                  <Area type="monotone" dataKey="budget" name="Allocated Budget"
                    stroke="#CBD5E1" strokeWidth={1.5} strokeDasharray="4 4" fill="url(#csrGradBudget)" dot={false} />
                  <Area type="monotone" dataKey="spend" name="Actual Spend"
                    stroke="#10B981" strokeWidth={2.5} fill="url(#csrGradSpend)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                  <Area type="monotone" dataKey="impact" name="Impact Score"
                    stroke="#064E3B" strokeWidth={2} fill="url(#csrGradImpact)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-5 mt-3 px-1">
              <div className="flex items-center gap-1.5">
                <svg width="20" height="8"><line x1="0" y1="4" x2="20" y2="4" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 3" /></svg>
                <span className="text-[10px] text-slate-500">Allocated Budget</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-0.5 rounded-full bg-[#10B981]" />
                <span className="text-[10px] text-slate-500">Actual Spend</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-0.5 rounded-full bg-[#064E3B]" />
                <span className="text-[10px] text-slate-500">Impact Score (Right)</span>
              </div>
            </div>
          </div>

          <div className="col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-semibold text-slate-800 text-[15px]" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
                Gender & Reach
              </h2>
              <span className="text-[11px] bg-[#E6F4F1] text-[#064E3B] font-semibold px-2.5 py-0.5 rounded-full">38K</span>
            </div>
            <p className="text-[10px] text-slate-400 mb-4">38,420 beneficiaries</p>
            <div className="relative mx-auto" style={{ width: 160, height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={GENDER_DATA} cx="50%" cy="50%" innerRadius={54} outerRadius={72}
                    dataKey="value" strokeWidth={2} stroke="#fff" paddingAngle={2} startAngle={90} endAngle={-270}>
                    {GENDER_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v.toLocaleString(), n]}
                    contentStyle={{ fontSize: 11, borderRadius: 10, border: '1px solid #E2E8F0' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-[#064E3B] leading-none" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>38.4K</span>
                <span className="text-[9px] text-slate-400 tracking-wide mt-0.5">Total</span>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {GENDER_DATA.map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                  <span className="text-xs text-slate-600 flex-1">{d.name}</span>
                  <span className="text-[11px] font-semibold text-slate-800">{d.value.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 w-10 text-right">{d.pct}%</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
              {[{ label: 'States Covered', value: '14' }, { label: 'Districts', value: '80' }, { label: 'Rural Share', value: '72%' }].map(s => (
                <div key={s.label}>
                  <p className="text-base font-bold text-slate-800" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>{s.value}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CSR Activities ───────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-slate-800 text-[15px]" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
                CSR Activities — FY 2026-27
              </h2>
              <p className="text-[10px] text-slate-400 mt-0.5">{activities.length} activities · full details & evidence</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={openWizard}
                className="flex items-center gap-1.5 rounded-xl bg-[#064E3B] px-4 py-2 text-xs font-bold text-white hover:bg-[#065f46] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Activity
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Month', 'Activity & Details', 'ESG', 'SDGs', 'Involving', 'Status', ''].map(h => (
                    <th key={h} className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider pb-3 pr-4 last:pr-0 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activities.filter(a => charterFilter === 'All' || a.esg === charterFilter).map((act, idx) => (
                  <tr key={idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors group">
                    <td className="py-3 pr-4 whitespace-nowrap align-top">
                      <span className="text-xs font-bold text-[#064E3B]">{act.tag}</span>
                      <span className="text-[10px] text-slate-400 block">{act.month}</span>
                    </td>
                    <td className="py-3 pr-4 align-top" style={{ maxWidth: 280 }}>
                      <p className="text-xs font-semibold text-slate-800 leading-snug">{act.title}</p>
                      {act.category && (
                        <span className="inline-block mt-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">{act.category}</span>
                      )}
                      {act.desc && (
                        <p className="mt-1.5 text-[10px] leading-4 text-slate-400 line-clamp-2">{act.desc}</p>
                      )}
                      {act.place && act.place !== 'TBD' && (
                        <p className="mt-1 text-[10px] text-slate-400">📍 {act.place}</p>
                      )}
                    </td>
                    <td className="py-3 pr-4 align-top">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${ESG_BADGE[act.esg] || ESG_BADGE['S']}`}>{act.esg}</span>
                    </td>
                    <td className="py-3 pr-4 align-top">
                      <div className="flex gap-1 flex-wrap">
                        {(act.sdgs || []).map(n => <SdgTile key={n} num={n} size="sm" />)}
                      </div>
                    </td>
                    <td className="py-3 pr-4 align-top">
                      <span className="text-[10px] text-slate-500">{act.parties}</span>
                    </td>
                    <td className="py-3 pr-4 align-top">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${CHARTER_STATUS_STYLE[act.status] || 'bg-slate-100 text-slate-500'}`}>{act.status}</span>
                    </td>
                    <td className="py-3 align-top">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(act, idx)}
                          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-slate-600 hover:border-[#064E3B] hover:text-[#064E3B] transition-colors"
                        >
                          <Pencil className="w-3 h-3" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteActivity(idx)}
                          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-slate-400 hover:border-red-200 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {activities.filter(a => charterFilter === 'All' || a.esg === charterFilter).length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-sm text-slate-400">
                      No activities found. <button type="button" onClick={openWizard} className="text-[#10B981] font-semibold hover:underline">Add one →</button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ── Add Activity Wizard Overlay ──────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#F3F6FA]">
          <div className="px-8 py-7">

            {/* Top nav */}
            <div className="mb-8 flex items-center justify-between">
              <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-slate-700 hover:text-[#064E3B] hover:bg-[#064E3B]/5 transition-colors">
                  <span className="text-base leading-none">▦</span>
                  Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(0)
                    showNotice('Returned to Activity Details')
                  }}
                  className="flex items-center gap-2 rounded-lg bg-[#064E3B] px-5 py-2.5 text-sm font-bold text-white shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  Add Activity
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={saveDraft}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50 transition-colors"
                >
                  {draftSaved ? 'Draft Saved' : 'Save Draft'}
                </button>
              </div>
            </div>

            {/* Page title */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-slate-950" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
                {editIdx !== null ? 'Edit CSR Activity' : 'New CSR Activity'}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                Capture an impact-tracked activity end-to-end — from activity details to outcomes.
                <br />
                Save as draft anytime.
              </p>
            </div>

            {/* Two-column layout */}
            <div className="flex items-start gap-8">

              {/* Left sidebar */}
              <div className="w-80 shrink-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sticky top-6">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Activity Wizard</p>
                <p className="mt-2 text-lg font-bold text-slate-950">8 steps · ~5 min</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-[#10B981] transition-all duration-300" style={{ width: `${progressPct}%` }} />
                  </div>
                  <span className="text-sm font-bold text-[#10B981]">{progressPct}%</span>
                </div>
                <div className="my-6 h-px bg-slate-200" />
                {CSR_STEPS.map((step, idx) => {
                  const isActive   = currentStep === idx
                  const isComplete = idx < currentStep
                  return (
                    <button key={step} onClick={() => setCurrentStep(idx)}
                      className={`mb-2 flex w-full items-center gap-4 rounded-xl px-3 py-3 text-left transition-all ${
                        isActive ? 'bg-[#E6F8F3] text-[#064E3B]' : isComplete ? 'text-slate-700 hover:bg-slate-50' : 'text-slate-500 hover:bg-slate-50'
                      }`}>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                        isComplete ? 'bg-[#064E3B] text-white' : isActive ? 'bg-[#10B981] text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {isComplete ? '✓' : idx + 1}
                      </span>
                      <span className="text-sm font-semibold">{step}</span>
                    </button>
                  )
                })}
              </div>

              {/* Right content card */}
              <div className="min-w-0 flex-1">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                  {/* Step header */}
                  <div className="flex min-h-36 items-start justify-between border-b border-slate-200 bg-[#FAFBFC] px-8 py-8">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#10B981]">
                        Step {currentStep + 1} of {CSR_STEPS.length}
                      </p>
                      <h3 className="mt-3 text-2xl font-bold text-slate-950" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
                        {CSR_STEPS[currentStep]}
                      </h3>
                      {STEP_DESC[currentStep] && (
                        <p className="text-sm text-slate-500 mt-1 max-w-2xl">{STEP_DESC[currentStep]}</p>
                      )}
                    </div>
                    <span className="rounded-lg bg-[#064E3B] px-4 py-2 text-sm font-bold text-white shrink-0 ml-6">
                      {String(currentStep + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Step body */}
                  <div className="px-8 py-8">
                    {STEP_COMPONENTS[currentStep]}
                  </div>

                  {/* Footer nav */}
                  <div className="flex items-center justify-between px-8 py-5 border-t border-slate-100">
                    <button
                      onClick={() => currentStep > 0 ? setCurrentStep(s => s - 1) : setShowForm(false)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                      ‹ Back
                    </button>
                    <button
                      onClick={() => currentStep < CSR_STEPS.length - 1 ? setCurrentStep(s => s + 1) : handleSave()}
                      className="flex items-center gap-2 px-7 py-2.5 rounded-xl bg-[#10B981] text-sm font-bold text-white hover:bg-[#059669] transition-colors shadow-md shadow-emerald-100">
                      {currentStep === CSR_STEPS.length - 1 ? 'Submit Activity' : 'Continue ›'}
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  )
}
