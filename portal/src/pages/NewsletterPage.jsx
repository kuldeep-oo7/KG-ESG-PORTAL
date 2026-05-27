import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Download, Leaf, Sparkles } from 'lucide-react'
import { newsletters } from '../data/newsletters'

function Cover({ newsletter, large = false }) {
  return (
    <div className={`overflow-hidden rounded-xl bg-[#064E3B] shadow-[0_18px_45px_rgba(6,78,59,.22)] ${large ? 'min-h-[520px]' : 'min-h-[300px]'}`}>
      <img src={newsletter.cover} alt={`${newsletter.title} newsletter cover`} className="h-full min-h-[inherit] w-full object-cover" />
    </div>
  )
}

export default function NewsletterPage() {
  const { slug } = useParams()
  const selected = newsletters.find(item => item.slug === slug)

  if (!selected) {
    return (
      <div className="min-h-screen bg-[#FBFAFC] px-6 py-10 text-slate-900">
        <div className="mx-auto max-w-7xl">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-extrabold text-[#064E3B]">
            <ArrowLeft className="h-4 w-4" /> Back to public site
          </Link>
          <div className="mt-8 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-[#064E3B]">Newsletter</h1>
              <p className="mt-2 text-sm text-slate-600">Quarterly CSR updates, sustainability progress, and community impact stories.</p>
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {newsletters.map(newsletter => (
              <Link key={newsletter.slug} to={`/newsletter/${newsletter.slug}`} className="block transition hover:-translate-y-1">
                <Cover newsletter={newsletter} />
              </Link>
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
        <div className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <Cover newsletter={selected} large />
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
                    <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#10B981] text-[#064E3B]">
                      <Leaf className="h-3.5 w-3.5" />
                    </span>
                    <p className="text-sm font-semibold leading-6 text-slate-700">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#064E3B] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#065f46]"
            >
              <Download className="h-4 w-4" /> Download / Print
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
