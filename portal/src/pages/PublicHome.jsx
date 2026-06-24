import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import logoImg from '../assets/kg-synergy-logo.svg'
import {
  CalendarDays, Clock, Download, Leaf, Mail, MapPin, Phone,
  Send, Users, X, CheckCircle2, Shield, Heart,
  ChevronDown, ChevronUp,
} from 'lucide-react'
import WomenWellbeing from './WomenWellbeing'
import { newsletters as NEWSLETTERS } from '../data/newsletters'
import { loadActivities } from '../lib/csrActivitiesStore'

const NAV_ITEMS = [
  ['calendar', 'Calendar'],
  ['newsletter', 'Newsletter'],
  ['womenwell', 'Women Wellbeing'],
  ['gallery', 'Gallery'],
  ['contact', 'Contact Us'],
]

/* ─── All 17 activities from Annual Charter FY 2026-27 ──────────────── */
const ACTIVITIES = [
  {
    tag: 'JAN', month: 'January 2026', esg: 'S',
    title: 'Employees Upgrading Initiative',
    date: 'January 2026', place: 'All Offices', parties: 'Employees',
    desc: 'Structured internal knowledge-sharing and learning sessions to enhance employee skills in financial literacy, innovation, productivity, and continuous learning, supporting workforce development and long-term organizational resilience.',
    sdgs: [4, 8], status: 'Completed', category: 'Social',
  },
  {
    tag: 'FEB', month: 'February 2026', esg: 'E',
    title: 'Food Donation & Food Waste Reduction Drive',
    date: 'February 2026', place: 'Community Sites', parties: 'NGOs / Community',
    desc: 'Systematic collection and distribution of surplus or freshly prepared food to underprivileged communities while reducing food wastage through improved internal food management practices.',
    sdgs: [2, 12], status: 'Completed', category: 'Environment',
  },
  {
    tag: 'MAR', month: 'March 2026', esg: 'S',
    title: "Women's Day – Inclusion & Equality Program",
    date: 'March 2026', place: 'All Offices', parties: 'Employees',
    desc: 'Awareness activities and engagement programs promoting gender equality, inclusivity, diversity, and mutual respect in the workplace.',
    sdgs: [5, 10], status: 'Completed', category: 'Social',
  },
  {
    tag: 'APR', month: 'April 2026', esg: 'S',
    title: 'Health Check-up Camp / Eye Check-up Camp',
    date: 'April 2026', place: 'Medical Partner / Office Premises', parties: 'Employees / Medical Partner',
    desc: 'Preventive health screening covering basic health parameters to support employee & community well-being, early detection, and productivity.',
    sdgs: [3], status: 'Completed', category: 'Health',
  },
  {
    tag: 'MAY', month: 'May 2026', esg: 'S',
    title: "Labour's Day Celebration & No-Tobacco Awareness Session",
    date: 'May 2026', place: 'All Offices', parties: 'Employees',
    desc: "Labour Day celebrated with awareness sessions on employee rights and healthy living, followed by gift distribution to appreciate support staff.",
    sdgs: [3, 8], status: 'Completed', category: 'Social',
  },
  {
    tag: 'JUN', month: 'June 2026', esg: 'E',
    title: 'Environment Day Celebration',
    date: 'Friday, 5 June 2026', time: '10:00 AM – 4:00 PM', place: 'Mumbai Office & Community Sites', parties: 'NGOs / Community',
    desc: 'Organize an Environment Day Celebration to promote environmental awareness, climate responsibility, and sustainable practices among employees and the surrounding community. Includes green desk decoration and tree plantation.',
    sdgs: [13, 15], status: 'Upcoming', category: 'Environment',
  },
  {
    tag: 'JUN', month: 'June 2026', esg: 'S',
    title: 'Blood Donation Camp',
    date: 'June 2026', time: '9:00 AM – 1:00 PM', place: 'Office Premises', parties: 'Employees',
    desc: 'Annual blood donation camp held on our premises to support community health needs and encourage employee participation in life-saving drives.',
    sdgs: [3], status: 'Upcoming', category: 'Health',
  },
  {
    tag: 'JUN', month: 'June 2026', esg: 'S',
    title: 'Yoga Day',
    date: 'Saturday, 21 June 2026', time: '8:00 AM – 10:00 AM', place: 'Office Premises', parties: 'Employees',
    desc: 'Yoga and meditation sessions with a yoga expert to educate and provide a refreshing experience, promoting physical fitness, mental well-being, and a deeper connection with nature.',
    sdgs: [3], status: 'Upcoming', category: 'Health',
  },
  {
    tag: 'JUL', month: 'July 2026', esg: 'S',
    title: 'Support to Local Schools / Anganwadi',
    date: 'July 2026', place: 'Community Schools & Anganwadi Centers', parties: 'Community',
    desc: 'Installation of safe drinking water filters to provide clean potable water for children, along with distribution of educational materials to support learning, hygiene, and overall child well-being in underprivileged communities.',
    sdgs: [4, 6, 10], status: 'Planning', category: 'Education',
  },
  {
    tag: 'AUG', month: 'August 2026', esg: 'E',
    title: 'Animal Welfare Support Program',
    date: 'August 2026', place: 'Partner NGO Animal Shelter', parties: 'NGOs',
    desc: 'Support to animal shelters through feeding programs, medical assistance, or basic infrastructure support, contributing to biodiversity protection and animal welfare.',
    sdgs: [15], status: 'Planning', category: 'Environment',
  },
  {
    tag: 'SEP', month: 'September 2026', esg: 'G',
    title: 'Seminar – Code of Conduct, POSH & Whistleblower Awareness',
    date: 'September 2026', place: 'Training Hall', parties: 'Employees / NGOs',
    desc: 'Internal awareness seminar on Code of Conduct, ethical business practices, POSH guidelines, and whistleblower mechanisms, strengthening a culture of compliance and accountability.',
    sdgs: [5, 16], status: 'Planning', category: 'Governance',
  },
  {
    tag: 'OCT', month: 'October 2026', esg: 'E',
    title: 'Clean Up Drive',
    date: 'October 2026', place: 'Office Premises & Surroundings', parties: 'Employees',
    desc: 'Cleanliness initiatives within and around the workplace to promote hygiene, waste segregation, and responsible waste disposal practices.',
    sdgs: [11, 12], status: 'Planning', category: 'Environment',
  },
  {
    tag: 'NOV', month: 'November 2026', esg: 'S',
    title: "Men's Day Celebration",
    date: 'November 2026', place: 'All Offices', parties: 'Employees',
    desc: 'Fun games, sports activities, and speeches by women to appreciate and celebrate the men around them with a special lunch and motivational messages.',
    sdgs: [5, 10], status: 'Planning', category: 'Social',
  },
  {
    tag: 'NOV', month: 'November 2026', esg: 'S',
    title: 'Donation Drive',
    date: 'November 2026', place: 'KG Factory', parties: 'Employees',
    desc: 'Charity drive within the KG factory, inviting employees to contribute voluntarily. Collected donations will be utilized to provide basic necessities to underprivileged communities.',
    sdgs: [1, 10], status: 'Planning', category: 'Social',
  },
  {
    tag: 'DEC', month: 'December 2026', esg: 'E',
    title: 'Energy Conservation Awareness Program',
    date: 'December 2026', place: 'All Offices', parties: 'Employees',
    desc: 'Awareness initiatives promoting energy-efficient behaviour at the workplace and at home, including an energy audit and No Lift Day, supporting responsible energy use and climate action.',
    sdgs: [7, 13], status: 'Planning', category: 'Environment',
  },
  {
    tag: 'JAN', month: 'January 2027', esg: 'E',
    title: 'Invite Sustainability Experts',
    date: 'January 2027', place: 'Conference Hall', parties: 'Employees',
    desc: 'Seminar or internal session on sustainability, ESG trends, or best practices to build awareness and strengthen sustainability culture across the organization.',
    sdgs: [12, 13], status: 'Planning', category: 'Governance',
  },
  {
    tag: 'FEB', month: 'February 2027', esg: 'S',
    title: 'Financial Literacy & Tax Awareness Session',
    date: 'Friday, 20 February 2027', time: '11:00 AM – 1:00 PM', place: 'Training Hall', parties: 'Employees',
    desc: 'Employee awareness session on basic financial planning, tax fundamentals, savings, and fraud prevention, aimed at improving financial well-being and long-term financial security.',
    sdgs: [4, 8], status: 'Planning', category: 'Education',
  },
]

const GALLERY_ITEMS = [
  { title: "Women's Day Celebration", caption: 'Inclusion & equality drive', cat: 'Community', img: '/gallery/womens-day.jpg', sdgs: [5, 10] },
  { title: 'Health Check-up Camp', caption: 'Preventive screening & care', cat: 'Health', img: '/gallery/health-checkup.jpg', sdgs: [3] },
  { title: 'Tree Plantation Drive', caption: 'Green initiative & climate action', cat: 'Environment', img: '/gallery/tree-plantation.jpg', sdgs: [13, 15] },
  { title: 'Beach Cleaning Drive', caption: 'Community clean-up & ocean care', cat: 'Environment', img: '/gallery/beach-cleaning.jpg', sdgs: [11, 14] },
  { title: 'Fire & Safety Training', caption: 'Employee safety awareness session', cat: 'Health', img: '/gallery/fire-safety.jpg', sdgs: [3, 8] },
  { title: 'Menstrual Health & Donation Drive', caption: 'Awareness & community support', cat: 'Community', img: '/gallery/menstrual-health.jpg', sdgs: [3, 5] },
]

const ESG_STYLE = {
  E:     { gradient: 'from-[#064E3B] via-[#065f46] to-[#10B981]', Icon: Leaf },
  S:     { gradient: 'from-[#1e3a8a] via-[#1d4ed8] to-[#60a5fa]', Icon: Heart },
  G:     { gradient: 'from-[#3b0764] via-[#6d28d9] to-[#a78bfa]', Icon: Shield },
  'E & G': { gradient: 'from-[#064E3B] via-[#1e3a8a] to-[#a78bfa]', Icon: Leaf },
}

const STATUS_STYLE = {
  Completed: 'bg-slate-100 text-slate-500',
  Upcoming:  'bg-[#10B981] text-[#064E3B]',
  Planning:  'bg-amber-100 text-amber-700',
}

function SdgChip({ n }) {
  return (
    <img
      src={`/sdg/sdg_${String(n).padStart(2, '0')}.png`}
      alt={`SDG ${n}`}
      title={`SDG ${n}`}
      className="w-11 h-11 rounded-lg shadow-md ring-2 ring-white/30"
    />
  )
}

function SectionHeader({ title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-extrabold text-[#064E3B]" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{children}</p>
      <div className="mt-4 h-1 w-12 rounded-full bg-[#10B981]" />
    </div>
  )
}

export default function PublicHome() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [active, setActive] = useState(() => searchParams.get('tab') || 'home')
  const [calFilter, setCalFilter] = useState('All')
  const [extraActivities, setExtraActivities] = useState(() =>
    loadActivities([]).filter(a => a.isNew)
  )

  useEffect(() => {
    function onStorage(e) {
      if (e.key === 'csr_activities_v1') {
        setExtraActivities(loadActivities([]).filter(a => a.isNew))
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])
  const [galleryFilter, setGalleryFilter] = useState('')
  const [message, setMessage] = useState('')
  const [registerEvent, setRegisterEvent] = useState(null)
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', phone: '' })
  const [registerDone, setRegisterDone] = useState(false)
  const [learnEvent, setLearnEvent] = useState(null)

  function submitContact(e) {
    e.preventDefault()
    setMessage('Message sent to CSR team.')
  }

  function openRegister(event) {
    setRegisterEvent(event)
    setRegisterForm({ name: '', email: '', phone: '' })
    setRegisterDone(false)
  }

  function submitRegister(e) {
    e.preventDefault()
    setRegisterDone(true)
  }

  function closeRegister() {
    setRegisterEvent(null)
    setRegisterDone(false)
  }

  const filteredGallery = galleryFilter
    ? GALLERY_ITEMS.filter(g => g.cat === galleryFilter)
    : GALLERY_ITEMS

  const CAL_FILTERS = ['All', 'Social', 'Environment', 'Health', 'Education', 'Governance']
  const CAL_MAP = { Social: 'S', Environment: 'E', Governance: 'G' }

  const allActivities = [...ACTIVITIES, ...extraActivities]

  const filteredActivities = allActivities.filter(a => {
    if (calFilter === 'All') return true
    if (CAL_MAP[calFilter]) return a.esg === CAL_MAP[calFilter]
    return a.category === calFilter
  })

  return (
    <div className="min-h-screen bg-[#FBFAFC] text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#064E3B] shadow-lg shadow-emerald-950/20">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <button onClick={() => setActive('home')} className="flex items-center">
            <img src={logoImg} alt="KG SYNERGY" className="h-16 w-auto object-contain" />
          </button>
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map(([id, label]) => (
              <button key={id} onClick={() => setActive(id)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${active === id ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
                {label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/signup')}
              className="rounded-full border-2 border-white/30 px-5 py-2 text-sm font-extrabold text-white hover:bg-white/10 transition-colors">
              Sign Up
            </button>
            <button onClick={() => navigate('/login')}
              className="rounded-full bg-[#FBFAFC] px-5 py-2 text-sm font-extrabold text-[#064E3B] shadow-sm hover:bg-white transition-colors">
              Login
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ── Home / Hero ─────────────────────────────────────────────────── */}
        {active === 'home' && (
          <div className="relative h-screen overflow-hidden bg-[#00352E]">
            <img src="/csr-hero.png" alt="K. Girdharlal" className="absolute inset-0 w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-[#00352E]/60" />
            <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/50 mb-5">K. Girdharlal International · CSR &amp; Sustainability</p>
              <h1 className="text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
                PEOPLE. PURPOSE. <span className="text-[#10B981]">IMPACT.</span>
              </h1>
              <p className="text-base text-white/65 max-w-2xl leading-7">
                Explore our journey towards sustainability, employee engagement, meaningful CSR initiatives, and measurable results.
              </p>
            </div>
          </div>
        )}

        {/* ── Calendar ────────────────────────────────────────────────────── */}
        {active === 'calendar' && (
          <>
            <section className="mx-auto max-w-4xl px-6 py-14">
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-extrabold text-[#064E3B]" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>Annual CSR Initiatives 2026</h2>
                <p className="mt-2 text-sm text-slate-500 max-w-2xl mx-auto leading-6">Explore the CSR calendar of the year with scheduled activities, focus areas, and SDG alignment. Stay informed about upcoming initiatives and opportunities to be part of the journey.</p>
                <div className="mt-4 mx-auto h-1 w-12 rounded-full bg-[#10B981]" />
              </div>

              {/* Filter tabs — centered */}
              <div className="flex flex-wrap justify-center gap-2 mb-10">
                {CAL_FILTERS.map(f => (
                  <button key={f} onClick={() => setCalFilter(f)}
                    className={`rounded-full border px-4 py-1.5 text-sm font-bold transition-colors ${calFilter === f ? 'border-[#064E3B] bg-[#064E3B] text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-[#064E3B]'}`}>
                    {f}
                  </button>
                ))}
              </div>

              {/* Timeline list */}
              <div className="relative">
                <div className="absolute left-[18px] top-5 bottom-5 w-0.5 bg-slate-200" style={{ zIndex: 0 }} />
                <div className="space-y-3">
                  {filteredActivities.map(act => {
                    const isHighlighted = act.status === 'Upcoming'
                    const isOpen = learnEvent?.title === act.title
                    const EsgIcon = (ESG_STYLE[act.esg] || ESG_STYLE['S']).Icon
                    const iconBg  = act.esg === 'E' ? 'bg-emerald-100/60' : act.esg === 'G' ? 'bg-violet-100/60' : 'bg-blue-100/60'
                    const iconClr = act.esg === 'E' ? 'text-emerald-600'  : act.esg === 'G' ? 'text-violet-600'  : 'text-blue-600'
                    return (
                      <div key={act.title} className="flex items-start gap-4" style={{ position: 'relative', zIndex: 1 }}>
                        {/* Month dot */}
                        <div className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-[9px] font-extrabold border-2 transition-colors ${
                          isHighlighted
                            ? 'bg-[#064E3B] border-[#064E3B] text-white shadow-md'
                            : 'bg-white border-slate-300 text-slate-500'
                        }`}>
                          {act.tag}
                        </div>

                        {/* Card */}
                        <div
                          onClick={() => setLearnEvent(isOpen ? null : act)}
                          className={`flex-1 rounded-xl border bg-white cursor-pointer transition-all hover:shadow-sm ${
                            isHighlighted ? 'border-[#064E3B] shadow-sm' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {/* Row — fixed height for consistency */}
                          <div className="flex items-center gap-4 px-5 h-[72px]">
                            <div className={`shrink-0 w-9 h-11 rounded-lg flex items-center justify-center ${iconBg}`}>
                              <EsgIcon className={`w-4 h-4 ${iconClr}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-800 leading-snug line-clamp-1">{act.title}</p>
                              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{act.desc}</p>
                            </div>
                            <div className="hidden md:flex items-center gap-1 shrink-0">
                              {(act.sdgs || []).slice(0, 3).map(n => (
                                <img key={n} src={`/sdg/sdg_${String(n).padStart(2,'0')}.png`} alt={`SDG ${n}`} className="w-7 h-7 rounded-md shadow-sm" />
                              ))}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap ${STATUS_STYLE[act.status] || 'bg-slate-100 text-slate-500'}`}>
                                {act.status}
                              </span>
                              {isOpen ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                            </div>
                          </div>

                          {/* Expanded detail */}
                          {isOpen && (
                            <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
                              <p className="text-sm leading-7 text-slate-600 mb-4">{act.desc}</p>
                              <div className="flex flex-wrap items-center gap-4 mb-4">
                                {act.date && (
                                  <span className="flex items-center gap-1.5 text-xs text-slate-500">
                                    <CalendarDays className="h-3.5 w-3.5 text-[#10B981]" />{act.date}
                                  </span>
                                )}
                                {act.time && (
                                  <span className="flex items-center gap-1.5 text-xs text-slate-500">
                                    <Clock className="h-3.5 w-3.5 text-[#10B981]" />{act.time}
                                  </span>
                                )}
                                {act.place && (
                                  <span className="flex items-center gap-1.5 text-xs text-slate-500">
                                    <MapPin className="h-3.5 w-3.5 text-[#10B981]" />{act.place}
                                  </span>
                                )}
                                {act.parties && (
                                  <span className="flex items-center gap-1.5 text-xs text-slate-500">
                                    <Users className="h-3.5 w-3.5 text-[#10B981]" />{act.parties}
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {(act.sdgs || []).map(n => <SdgChip key={n} n={n} />)}
                              </div>
                              {act.status === 'Upcoming' && (
                                <button
                                  onClick={e => { e.stopPropagation(); openRegister(act) }}
                                  className="rounded-lg bg-[#10B981] px-5 py-2.5 text-sm font-extrabold text-[#064E3B] hover:bg-emerald-400 transition-colors"
                                >
                                  Register
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>
          </>
        )}

        {/* ── Newsletter ──────────────────────────────────────────────────── */}
        {active === 'newsletter' && (
          <section className="mx-auto max-w-5xl px-6 py-12">
            {/* Page header */}
            <div className="flex items-start justify-between mb-10">
              <div>
                <h1 className="text-4xl font-extrabold text-slate-900" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
                  KG Connect — Internal Newsletter
                </h1>
                <p className="mt-3 text-sm text-slate-500 max-w-2xl leading-6">
                  Explore regular updates on our ESG activities, employee engagement programs, sustainability practices, and community initiatives.
                </p>
                <div className="mt-4 h-1 w-12 rounded-full bg-[#10B981]" />
              </div>
              {/* Decorative envelope illustration */}
              <div className="hidden lg:flex shrink-0 ml-8 h-24 w-28 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100">
                <svg viewBox="0 0 80 60" className="w-16 h-12 text-[#10B981]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="10" width="72" height="48" rx="4" fill="#d1fae5" stroke="#10B981" />
                  <polyline points="4,10 40,38 76,10" fill="none" stroke="#10B981" />
                  <line x1="58" y1="2" x2="64" y2="10" stroke="#064E3B" />
                  <line x1="64" y1="2" x2="64" y2="10" stroke="#064E3B" />
                </svg>
              </div>
            </div>

            {/* 2-column card grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {NEWSLETTERS.map((newsletter) => (
                <article
                  key={newsletter.slug}
                  className="flex overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Cover image — left */}
                  <div className="w-[180px] shrink-0 overflow-hidden">
                    <img
                      src={newsletter.cover}
                      alt={newsletter.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Content — right */}
                  <div className="flex flex-col p-5 flex-1 min-w-0">
                    <span className="inline-block rounded-md border border-[#10B981] px-3 py-0.5 text-[0.68rem] font-semibold text-[#10B981] mb-3 w-fit">
                      Quarterly Newsletter
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 leading-tight">{newsletter.title}</h3>
                    <p className="text-base font-bold text-slate-700 mb-2">{newsletter.year}</p>
                    <p className="text-sm text-slate-500 leading-[1.6] line-clamp-3 flex-1">{newsletter.summary}</p>
                    <div className="flex gap-2 mt-4">
                      <Link
                        to={`/newsletter/${newsletter.slug}`}
                        className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 hover:border-[#064E3B] hover:text-[#064E3B] transition-colors"
                      >
                        View
                      </Link>
                      <a
                        href={newsletter.pdf}
                        download
                        className="flex items-center gap-1.5 rounded-lg bg-[#064E3B] px-5 py-2 text-sm font-semibold text-white hover:bg-[#065f46] transition-colors"
                      >
                        <Download className="h-3.5 w-3.5" /> Download
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ── Women Wellbeing ──────────────────────────────────────── */}
        {active === 'womenwell' && (
          <section className="mx-auto max-w-7xl px-6 py-14">
            <SectionHeader title="Women Wellbeing">
              POSH policy, Internal Complaints Committee, meeting schedules, resources, and a confidential concern-raising portal.
            </SectionHeader>
            <WomenWellbeing />
          </section>
        )}

        {/* ── Gallery ─────────────────────────────────────────────────────── */}
        {active === 'gallery' && (
          <section className="mx-auto max-w-7xl px-6 py-14">
            <SectionHeader title="Gallery">Moments from CSR initiatives, employee drives, and community celebrations.</SectionHeader>
            <div className="mb-6 flex flex-wrap gap-2">
              {['Environment', 'Health', 'Community'].map(tab => (
                <button key={tab} onClick={() => setGalleryFilter(tab === galleryFilter ? '' : tab)}
                  className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors ${galleryFilter === tab ? 'border-[#064E3B] bg-[#064E3B] text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-[#064E3B]'}`}>
                  {tab}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[240px]">
              {filteredGallery.map((item, idx) => (
                <div key={item.title}
                  className={`relative overflow-hidden rounded-2xl cursor-pointer group ${idx === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                  <img src={item.img} alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute top-3 right-3 flex gap-1.5 z-10">
                    {item.sdgs.slice(0, 2).map(n => (
                      <img key={n} src={`/sdg/sdg_${String(n).padStart(2, '0')}.png`}
                        alt={`SDG ${n}`}
                        className="w-8 h-8 rounded-md shadow-md ring-1 ring-white/30 opacity-90" />
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-colors" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-[#10B981]/80 text-white px-2 py-0.5 rounded mb-1">{item.cat}</span>
                    <p className="font-extrabold text-sm leading-tight">{item.title}</p>
                    <p className="text-xs text-white/70 mt-0.5">{item.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Contact Us ──────────────────────────────────────────────────── */}
        {active === 'contact' && (
          <section className="mx-auto max-w-7xl px-6 py-14">
            <SectionHeader title="Contact Us">Reach out to us for queries, suggestions, support, or collaboration-related information.</SectionHeader>
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="space-y-5">
                {[
                  [Mail, 'Email', 'csr@kgirdharlal.com'],
                  [Phone, 'Phone', '+91 00000 00000'],
                ].map(([Icon, title, value]) => (
                  <div key={title} className="flex gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-[#064E3B]"><Icon className="h-5 w-5" /></span>
                    <div><p className="font-bold text-slate-800">{title}</p><p className="text-sm text-slate-500">{value}</p></div>
                  </div>
                ))}
              </div>
              <form onSubmit={submitContact} className="rounded-xl bg-white p-8 shadow-[0_2px_14px_rgba(6,78,59,.09)]">
                <div className="grid gap-4 md:grid-cols-2">
                  <input className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all" placeholder="First name" />
                  <input className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all" placeholder="Last name" />
                </div>
                <input className="mt-4 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all" placeholder="your@email.com" />
                <textarea className="mt-4 min-h-28 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all" placeholder="How can we help you?" />
                <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#064E3B] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#065f46]">
                  <Send className="h-4 w-4" /> Send Message
                </button>
                {message && <p className="mt-3 text-sm font-semibold text-[#059669]">{message}</p>}
              </form>
            </div>
          </section>
        )}
      </main>

      {/* Register modal */}
      {registerEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#10B981] mb-1">{registerEvent.category}</p>
                <h3 className="text-lg font-extrabold text-[#064E3B]">{registerEvent.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{registerEvent.date} · {registerEvent.place}</p>
              </div>
              <button onClick={closeRegister} className="text-slate-400 hover:text-slate-600 ml-4 mt-1">
                <X className="h-5 w-5" />
              </button>
            </div>
            {registerDone ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <CheckCircle2 className="h-12 w-12 text-[#10B981]" />
                <p className="text-lg font-extrabold text-[#064E3B]">Registration Confirmed!</p>
                <p className="text-sm text-slate-500">We'll send details to <span className="font-semibold">{registerForm.email}</span>.</p>
                <button onClick={closeRegister} className="mt-2 rounded-lg bg-[#064E3B] px-6 py-2.5 text-sm font-extrabold text-white hover:bg-[#065f46]">Done</button>
              </div>
            ) : (
              <form onSubmit={submitRegister} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                  <input type="text" required placeholder="Your name" value={registerForm.name}
                    onChange={e => setRegisterForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" required placeholder="your@email.com" value={registerForm.email}
                    onChange={e => setRegisterForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Phone <span className="text-slate-400 font-normal">(optional)</span></label>
                  <input type="tel" placeholder="+91 00000 00000" value={registerForm.phone}
                    onChange={e => setRegisterForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all" />
                </div>
                <div className="flex gap-2 mt-2">
                  <button type="button" onClick={closeRegister} className="flex-1 rounded-lg border border-slate-200 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                  <button type="submit" className="flex-1 rounded-lg bg-[#10B981] py-2.5 text-sm font-extrabold text-[#064E3B] hover:bg-emerald-400">Confirm Registration</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
