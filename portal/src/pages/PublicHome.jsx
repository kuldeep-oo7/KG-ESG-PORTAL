import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CalendarDays,
  Clock,
  Download,
  Image,
  Leaf,
  Mail,
  MapPin,
  Phone,
  Send,
  Users,
} from 'lucide-react'
import logoImg from '../assets/logo.jfif'
import { newsletters as NEWSLETTERS } from '../data/newsletters'

const NAV_ITEMS = [
  ['events', 'Upcoming Events'],
  ['calendar', 'CSR Calendar'],
  ['newsletter', 'Newsletter'],
  ['gallery', 'Gallery'],
  ['contact', 'Contact Us'],
]

const EVENTS = [
  {
    category: 'Environment',
    title: 'Environment Day Celebration 2026',
    date: 'Friday, 5 June 2026',
    time: '10:00 AM - 4:00 PM',
    place: 'Mumbai Office & Community Sites',
    desc: 'Tree plantation, waste segregation awareness, and employee volunteer drives aligned to climate action goals.',
    sdgs: ['SDG 13', 'SDG 15', 'SDG 12'],
  },
  {
    category: 'Health',
    title: 'Community Health & Eye Check-up Camp',
    date: 'Saturday, 18 July 2026',
    time: '9:30 AM - 2:00 PM',
    place: 'Partner NGO Health Center',
    desc: 'Preventive health screening and eye check-ups for local communities with doctor consultations and follow-up support.',
    sdgs: ['SDG 3', 'SDG 10'],
  },
  {
    category: 'Education',
    title: 'Financial Literacy Awareness Session',
    date: 'Friday, 20 February 2027',
    time: '11:00 AM - 1:00 PM',
    place: 'Training Hall',
    desc: 'Employee-led session on savings, taxation basics, and household budgeting for beneficiaries and support staff.',
    sdgs: ['SDG 4', 'SDG 8'],
  },
]

const MONTHS = [
  ['MAR', 'Women\'s Day inclusion program', 'Completed', 'Community'],
  ['APR', 'Health check-up and eye camp', 'Completed', 'Health'],
  ['JUN', 'Environment Day celebration', 'Upcoming', 'Environment'],
  ['AUG', 'Independence Day and school support', 'Planning', 'Education'],
  ['DEC', 'Energy conservation awareness program', 'Planning', 'Sustainability'],
  ['FEB', 'Financial literacy and tax awareness', 'Planning', 'Education'],
]

const GALLERY = [
  ['Women\'s Day', 'Inclusion & equality program'],
  ['Health Camp', 'Community screening drive'],
  ['Environment Day', 'Tree plantation initiative'],
  ['Education Support', 'School and Anganwadi outreach'],
  ['Volunteer Day', 'Employee community participation'],
]

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
  const [active, setActive] = useState('events')
  const [openMonth, setOpenMonth] = useState('JUN')
  const [galleryFilter, setGalleryFilter] = useState('All Events')
  const [message, setMessage] = useState('')

  function showTab(id) {
    setActive(id)
  }

  function submitContact(e) {
    e.preventDefault()
    setMessage('Message sent to CSR team.')
  }

  return (
    <div className="min-h-screen bg-[#FBFAFC] text-slate-900">
      <header className="sticky top-0 z-50 bg-[#064E3B] shadow-lg shadow-emerald-950/20">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <button onClick={() => showTab('events')} className="flex items-center gap-3 text-left">
            <img src={logoImg} alt="K.GIRDHARLAL" className="h-10 w-auto rounded bg-white object-contain" />
            <div>
              <p className="text-sm font-extrabold tracking-wide text-white">K. <span className="text-[#10B981]">Girdharlal</span></p>
              <p className="text-[9px] uppercase tracking-widest text-white/55">CSR & Sustainability</p>
            </div>
          </button>
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map(([id, label]) => (
              <button
                key={id}
                onClick={() => showTab(id)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${active === id ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
              >
                {label}
              </button>
            ))}
          </nav>
          <button
            onClick={() => navigate('/login')}
            className="rounded-full bg-[#10B981] px-5 py-2 text-sm font-extrabold text-[#064E3B] shadow-sm hover:bg-emerald-400"
          >
            Login
          </button>
        </div>
      </header>

      <main>
        {active === 'events' && <section className="mx-auto max-w-7xl px-6 py-14">
          <SectionHeader title="Upcoming Events">
            Confirmed CSR events. Register your spot or learn more about each initiative before accessing the internal dashboard.
          </SectionHeader>
          <div className="space-y-6">
            {EVENTS.map(event => (
              <article key={event.title} className="grid overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_2px_14px_rgba(6,78,59,.09)] md:grid-cols-[300px_1fr]">
                <div className="flex min-h-56 flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#064E3B] via-[#065f46] to-[#10B981] p-8 text-center">
                  <Leaf className="h-12 w-12 text-white/40" />
                  <p className="text-xs font-bold uppercase tracking-widest text-white/50">{event.category}</p>
                </div>
                <div className="p-8">
                  <p className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#10B981]"><span className="h-2 w-2 rounded-full bg-[#10B981]" />{event.category}</p>
                  <h3 className="text-2xl font-extrabold leading-tight text-[#064E3B]">{event.title}</h3>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium text-slate-600">
                    <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-[#10B981]" />{event.date}</span>
                    <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-[#10B981]" />{event.time}</span>
                    <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#10B981]" />{event.place}</span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{event.desc}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {event.sdgs.map(sdg => <span key={sdg} className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-[#065f46]">{sdg}</span>)}
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button className="rounded-lg bg-[#10B981] px-5 py-2.5 text-sm font-extrabold text-[#064E3B] hover:bg-emerald-400">Register</button>
                    <button className="rounded-lg border-2 border-[#064E3B] px-5 py-2.5 text-sm font-extrabold text-[#064E3B] hover:bg-[#064E3B] hover:text-white">Learn More</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>}

        {active === 'calendar' && <section className="mx-auto max-w-7xl px-6 py-14">
          <SectionHeader title="CSR Calendar">Month-wise CSR activity planning with status, category, and SDG context.</SectionHeader>
          <div className="rounded-xl bg-white p-5 shadow-[0_2px_14px_rgba(6,78,59,.09)]">
            {MONTHS.map(([tag, title, status, category]) => (
              <div key={tag} className="border-b border-slate-100 last:border-0">
                <button onClick={() => setOpenMonth(openMonth === tag ? '' : tag)} className="flex w-full items-center gap-4 py-4 text-left">
                  <span className={`min-w-14 rounded-full px-3 py-1 text-center text-xs font-extrabold ${status === 'Upcoming' ? 'bg-[#10B981] text-[#064E3B]' : 'bg-[#064E3B] text-white'}`}>{tag}</span>
                  <span className="flex-1 font-bold text-slate-800">{title}</span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#065f46]">{status}</span>
                </button>
                {openMonth === tag && (
                  <div className="pb-4 pl-[72px] text-sm text-slate-600">
                    <p>{category} initiative aligned with CSR annual planning and SDG reporting.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>}

        {active === 'newsletter' && <section className="mx-auto max-w-7xl px-6 py-14">
          <SectionHeader title="Newsletter">Quarterly CSR updates, sustainability progress, and community impact stories.</SectionHeader>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {NEWSLETTERS.map(newsletter => (
              <article key={newsletter.issue} className="overflow-hidden rounded-xl bg-white shadow-[0_2px_14px_rgba(6,78,59,.09)]">
                <Link to={`/newsletter/${newsletter.slug}`} className="block h-[190px] overflow-hidden bg-[#064E3B]">
                  <img src={newsletter.cover} alt={`${newsletter.title} newsletter cover`} className="h-full w-full object-cover transition duration-300 hover:scale-105" />
                </Link>
                <div className="p-5">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#059669]">{newsletter.issue} - {newsletter.year}</p>
                  <h3 className="mt-2 text-lg font-extrabold leading-tight text-[#064E3B]">{newsletter.title}</h3>
                  <p className="text-xs font-semibold text-slate-500">{newsletter.period} - {newsletter.quarter}</p>
                  <p className="mt-2 min-h-[96px] text-sm leading-6 text-slate-600">{newsletter.summary}</p>
                  <div className="mt-4 flex gap-2">
                    <Link
                      to={`/newsletter/${newsletter.slug}`}
                      className="rounded-lg bg-[#10B981] px-4 py-2 text-xs font-extrabold text-[#064E3B] hover:bg-emerald-400"
                    >
                      View
                    </Link>
                    <button
                      type="button"
                      onClick={() => window.open(`/newsletter/${newsletter.slug}`, '_blank', 'noreferrer')}
                      className="rounded-lg border border-[#064E3B] px-4 py-2 text-xs font-extrabold text-[#064E3B] hover:bg-[#064E3B] hover:text-white"
                    >
                      <Download className="inline h-3.5 w-3.5" /> Open
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>}

        {active === 'gallery' && <section className="mx-auto max-w-7xl px-6 py-14">
          <SectionHeader title="Gallery">Moments from CSR initiatives, employee drives, and community celebrations.</SectionHeader>
          <div className="mb-6 flex flex-wrap gap-2">
            {['All Events', 'Environment', 'Health', 'Community', 'Celebrations'].map(tab => (
              <button key={tab} onClick={() => setGalleryFilter(tab)} className={`rounded-full border px-4 py-2 text-sm font-bold ${galleryFilter === tab ? 'border-[#064E3B] bg-[#064E3B] text-white' : 'border-slate-200 bg-white text-slate-600'}`}>{tab}</button>
            ))}
          </div>
          <div className="grid auto-rows-[160px] grid-cols-1 gap-3 md:grid-cols-4">
            {GALLERY.map(([title, caption], idx) => (
              <div key={title} className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-200 to-emerald-100 ${idx === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                <div className="absolute inset-0 flex flex-col justify-end bg-[#064E3B]/70 p-5 text-white opacity-90">
                  <Image className="mb-3 h-6 w-6 text-[#10B981]" />
                  <p className="font-extrabold">{title}</p>
                  <p className="text-sm text-white/75">{caption}</p>
                </div>
              </div>
            ))}
          </div>
        </section>}

        {active === 'contact' && <section className="mx-auto max-w-7xl px-6 py-14">
          <SectionHeader title="Contact Us">Reach our CSR team for queries, partnerships, volunteer opportunities, or event collaborations.</SectionHeader>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-5">
              {[
                [MapPin, 'Address', 'K. Girdharlal, Mumbai, India'],
                [Mail, 'Email', 'csr@kgirdharlal.com'],
                [Phone, 'Phone', '+91 00000 00000'],
                [Users, 'CSR Desk Hours', 'Monday - Friday · 9:00 AM - 6:00 PM'],
              ].map(([Icon, title, value]) => (
                <div key={title} className="flex gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-[#064E3B]"><Icon className="h-5 w-5" /></span>
                  <div><p className="font-bold text-slate-800">{title}</p><p className="text-sm text-slate-500">{value}</p></div>
                </div>
              ))}
            </div>
            <form onSubmit={submitContact} className="rounded-xl bg-white p-8 shadow-[0_2px_14px_rgba(6,78,59,.09)]">
              <div className="grid gap-4 md:grid-cols-2">
                <input className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#10B981]" placeholder="First name" />
                <input className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#10B981]" placeholder="Last name" />
              </div>
              <input className="mt-4 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#10B981]" placeholder="your@email.com" />
              <textarea className="mt-4 min-h-28 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#10B981]" placeholder="How can we help you?" />
              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#064E3B] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#065f46]">
                <Send className="h-4 w-4" /> Send Message
              </button>
              {message && <p className="mt-3 text-sm font-semibold text-[#059669]">{message}</p>}
            </form>
          </div>
        </section>}
      </main>
    </div>
  )
}
