import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Download, ExternalLink, Leaf, Sparkles } from 'lucide-react'
import { newsletters } from '../data/newsletters'

const GRADIENTS = [
  'linear-gradient(140deg,#064E3B 0%,#10B981 100%)',
  'linear-gradient(140deg,#065f46 0%,#34d399 100%)',
  'linear-gradient(140deg,#047857 0%,#6ee7b7 100%)',
  'linear-gradient(140deg,#064E3B 0%,#059669 100%)',
]

function GradientCard({ newsletter, idx, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full overflow-hidden rounded-xl bg-white shadow-[0_2px_14px_rgba(6,78,59,.09)] text-left transition hover:-translate-y-1 hover:shadow-[0_6px_24px_rgba(6,78,59,.18)]"
    >
      <div className="relative h-[190px] overflow-hidden">
        <img src={newsletter.cover} alt={newsletter.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        <div style={{ background: GRADIENTS[idx % 4], opacity: 0.7 }} className="absolute inset-0" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4">
          <span className="text-[0.68rem] font-semibold uppercase tracking-[.09em] text-white/80">
            {newsletter.issue} · {newsletter.year}
          </span>
          <span className="text-center text-[1rem] font-bold leading-snug text-white drop-shadow">
            {newsletter.title}
          </span>
        </div>
      </div>
      <div className="px-5 py-[18px]">
        <p className="mb-1.5 text-[0.76rem] font-medium text-slate-500">{newsletter.period} · {newsletter.quarter}</p>
        <p className="mb-4 min-h-[60px] text-[0.84rem] leading-[1.55] text-slate-600 line-clamp-3">{newsletter.summary}</p>
        <span className="inline-block rounded-lg bg-[#10B981] px-4 py-2 text-xs font-extrabold text-[#064E3B]">
          View Newsletter
        </span>
      </div>
    </button>
  )
}

export default function NewsletterPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const selected = newsletters.find(item => item.slug === slug)
  const selectedIdx = newsletters.indexOf(selected)

  if (!selected) {
    return (
      <div className="min-h-screen bg-[#FBFAFC] px-6 py-10 text-slate-900">
        <div className="mx-auto max-w-7xl">
          <Link to="/?tab=newsletter" className="inline-flex items-center gap-2 text-sm font-extrabold text-[#064E3B]">
            <ArrowLeft className="h-4 w-4" /> Back to public site
          </Link>
          <div className="mt-8">
            <h1 className="text-4xl font-extrabold text-[#064E3B]">Newsletter</h1>
            <p className="mt-2 text-sm text-slate-600">Quarterly CSR updates, sustainability progress, and community impact stories.</p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {newsletters.map((nl, idx) => (
              <GradientCard
                key={nl.slug}
                newsletter={nl}
                idx={idx}
                onClick={() => navigate(`/newsletter/${nl.slug}`)}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FBFAFC] px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-extrabold text-[#064E3B]">
          <ArrowLeft className="h-4 w-4" /> Back to public site
        </Link>

        {/* Info panel */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          {/* Left: cover image with gradient overlay */}
          <div className="relative min-h-[280px] overflow-hidden rounded-xl shadow-[0_18px_45px_rgba(6,78,59,.22)]">
            <img
              src={selected.cover}
              alt={selected.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              style={{ background: GRADIENTS[selectedIdx % 4], opacity: 0.65 }}
              className="absolute inset-0"
            />
            <div className="relative flex h-full min-h-[280px] flex-col items-center justify-center gap-4 px-8">
              <span className="text-[0.76rem] font-semibold uppercase tracking-[.09em] text-white/80">
                {selected.issue} · {selected.year}
              </span>
              <span className="text-center text-2xl font-bold leading-snug text-white drop-shadow-md">{selected.title}</span>
              <span className="rounded-full border border-white/30 px-3 py-1 text-xs font-semibold text-white/80">{selected.quarter}</span>
            </div>
          </div>

          {/* Right: details */}
          <div className="rounded-xl bg-white p-8 shadow-[0_2px_14px_rgba(6,78,59,.09)]">
            <p className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-[#064E3B]">
              <CalendarDays className="h-4 w-4" /> {selected.period}
            </p>
            <h2 className="mt-5 text-3xl font-extrabold text-[#064E3B]">{selected.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{selected.summary}</p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {selected.metrics.map(([value, label]) => (
                <div key={label} className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
                  <p className="text-2xl font-extrabold text-[#064E3B]">{value}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-widest text-[#064E3B]">
                <Sparkles className="h-4 w-4 text-[#10B981]" /> Highlights
              </h3>
              <div className="mt-4 space-y-3">
                {selected.highlights.map(highlight => (
                  <div key={highlight} className="flex gap-3 rounded-lg border border-slate-100 p-3">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#10B981] text-[#064E3B]">
                      <Leaf className="h-3.5 w-3.5" />
                    </span>
                    <p className="text-sm font-semibold leading-6 text-slate-700">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => window.open(selected.pdf, '_blank', 'noreferrer')}
                className="inline-flex items-center gap-2 rounded-lg bg-[#10B981] px-5 py-3 text-sm font-extrabold text-[#064E3B] hover:bg-emerald-400"
              >
                <ExternalLink className="h-4 w-4" /> Open in new tab
              </button>
              <a
                href={selected.pdf}
                download
                className="inline-flex items-center gap-2 rounded-lg bg-[#064E3B] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#065f46]"
              >
                <Download className="h-4 w-4" /> Download
              </a>
            </div>
          </div>
        </div>

        {/* Embedded PDF viewer */}
        <div className="mt-10 overflow-hidden rounded-xl shadow-[0_2px_14px_rgba(6,78,59,.12)]">
          <div
            style={{ background: GRADIENTS[selectedIdx % 4] }}
            className="flex items-center justify-between px-6 py-3"
          >
            <span className="text-sm font-extrabold text-white">{selected.title} — {selected.period}</span>
            <a
              href={selected.pdf}
              download
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/20 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/30"
            >
              <Download className="h-3.5 w-3.5" /> Download PDF
            </a>
          </div>
          <iframe
            src={selected.pdf}
            title={selected.title}
            className="w-full bg-white"
            style={{ height: '82vh', border: 'none' }}
          />
        </div>
      </div>
    </div>
  )
}
