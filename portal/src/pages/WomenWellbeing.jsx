/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { ChevronDown, ChevronUp, Mail, Phone, FileText, Video, BookOpen, Download, ShieldCheck, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'

const TABS = [
  { id: 'policy',    label: 'POSH Policy' },
  { id: 'committee', label: 'Internal Committee' },
  { id: 'meetings',  label: 'Meeting Schedule' },
  { id: 'resources', label: 'Resources & FAQs' },
  { id: 'raise',     label: 'Raise Concern' },
  { id: 'contact',   label: 'Contact / Support' },
]

const MEMBERS = [
  { initials: 'RS', name: 'Rekha Sharma',    role: 'Head — Human Resources',               dept: 'ICC Chairperson · POSH Act Sec. 4(1)', badge: 'Presiding Officer', ext: '201', color: 'bg-rose-700' },
  { initials: 'PM', name: 'Priya Mehta',     role: 'Senior Manager, Legal & Compliance',   dept: 'Internal Member', ext: '215', color: 'bg-[#064E3B]' },
  { initials: 'SJ', name: 'Sunita Joshi',    role: 'Manager, Operations & Admin',           dept: 'Internal Member', ext: '238', color: 'bg-amber-600' },
  { initials: 'DP', name: 'Dr. Divya Pillai',role: 'Sakhi Women\'s Rights Foundation',      dept: 'External Expert Member (Mandatory)', badge: 'External', color: 'bg-blue-700' },
  { initials: 'AK', name: 'Anand Kumar',     role: 'Deputy Manager, Finance',               dept: 'Internal Member', ext: '244', color: 'bg-violet-700' },
]

const PAST_MEETINGS = [
  { date: '06 May 2026', title: 'Monthly Review — May' },
  { date: '01 Apr 2026', title: 'Policy v2.1 Review & Approval' },
  { date: '04 Mar 2026', title: 'Monthly Review — March' },
  { date: '11 Feb 2026', title: 'Gender Sensitisation Training' },
  { date: '07 Jan 2026', title: 'Annual Review & Nominations' },
]

const RESOURCES = [
  { icon: FileText, tag: 'Policy',    tagColor: 'bg-red-50 text-red-700',       title: 'POSH Policy — Full Document',               sub: 'PDF · Formatted Policy · April 2026',          href: '/posh/posh-policy.pdf' },
  { icon: FileText, tag: 'Training',  tagColor: 'bg-blue-50 text-blue-700',     title: 'POSH Awareness PPT — English',               sub: 'PDF · 16 slides · Awareness & Empowerment',   href: '/posh/posh-ppt-english.pdf' },
  { icon: FileText, tag: 'Training',  tagColor: 'bg-violet-50 text-violet-700', title: 'POSH Awareness PPT — Hindi / Gujarati',      sub: 'PDF · 16 slides · જાગૃɪɪ તાɪɪɪ / जागृɪɪता',    href: '/posh/posh-ppt-hindi.pdf' },
  { icon: FileText, tag: 'Template',  tagColor: 'bg-emerald-50 text-emerald-700', title: 'Complaint Filing Template',                sub: 'DOCX · 48 KB · Editable',                     href: '#' },
  { icon: Video,    tag: 'Video',     tagColor: 'bg-violet-50 text-violet-700', title: 'Gender Sensitisation Workshop — March 2026', sub: '45 min · Managers\' session recording',        href: '#' },
  { icon: BookOpen, tag: 'Reference', tagColor: 'bg-amber-50 text-amber-700',   title: 'POSH Act 2013 — Government Gazette',         sub: 'Official GOI reference document',             href: '#' },
]

const FAQS = [
  { q: 'Who can file a complaint under POSH?', a: 'Any woman employee — permanent, contractual, temporary, trainee, intern, or visitor — who has experienced sexual harassment at the workplace can file with the ICC. The Act covers all workplaces: factories, offices, shops, hospitals, NGOs, construction sites, and even work-from-home situations.' },
  { q: 'Is my complaint confidential?', a: 'Yes. All complaints and proceedings are strictly confidential under the Act. Your name and identity will not be disclosed. Media cannot publish names. Breach of confidentiality by any party, including ICC members, is a punishable offence.' },
  { q: 'What is the time limit to file a complaint?', a: 'Within 3 months of the incident, or the last incident in a series. The ICC may extend by another 3 months if circumstances prevented timely filing. Don\'t let the deadline discourage you — approach the ICC even if you are unsure.' },
  { q: 'What if I cannot prove it?', a: '"Unable to prove" is NOT the same as "false complaint." The burden of proof is handled by the ICC, not you. You will NOT be penalised if the inquiry finds no harassment. Only deliberately false complaints with proven malicious intent face action.' },
  { q: 'Can I request interim relief during the inquiry?', a: 'Yes. You may request transfer, leave of up to 3 months, or restraint orders on the respondent. The ICC grants these at its discretion to protect you during the inquiry process.' },
  { q: 'What actions can be taken against the harasser?', a: 'Based on ICC findings, disciplinary actions include: written warning, written apology, transfer, suspension, dismissal, or denial of promotion/increments. Annual reports on complaints and resolutions are kept strictly confidential.' },
  { q: 'Are contract workers, vendors, and visitors covered?', a: 'Yes. The POSH Act covers all women at the workplace, including those employed through third parties, contractors, vendors, interns, and even visitors and clients on company premises.' },
  { q: 'Can I be punished for filing a complaint?', a: 'No. Retaliation is strictly prohibited. You cannot be fired, demoted, or transferred for filing a complaint. Threatening or pressuring a complainant is itself a punishable crime under the Act. You can report retaliation as a separate complaint.' },
]

const HARASSMENT_TYPES = [
  {
    type: 'Verbal', color: 'bg-red-50 border-red-200', badge: 'bg-red-100 text-red-700',
    examples: ['Sexual comments or jokes', 'Asking personal/intimate questions', 'Remarks about someone\'s body', 'Threatening in exchange for favours'],
  },
  {
    type: 'Non-Verbal', color: 'bg-amber-50 border-amber-200', badge: 'bg-amber-100 text-amber-700',
    examples: ['Staring or winking repeatedly', 'Sending inappropriate pictures/videos', 'Making obscene hand gestures', 'Displaying sexual posters or objects'],
  },
  {
    type: 'Physical', color: 'bg-orange-50 border-orange-200', badge: 'bg-orange-100 text-orange-700',
    examples: ['Unwanted touching or proximity', 'Blocking someone\'s path intentionally', 'Unwanted hugging or kissing', 'Any form of physical assault'],
  },
  {
    type: 'Digital', color: 'bg-purple-50 border-purple-200', badge: 'bg-purple-100 text-purple-700',
    examples: ['Sending indecent messages or emails', 'Sharing intimate images without consent', 'Inappropriate messages on group chats', 'Harassment over video calls / WFH'],
  },
]

const MYTHS = [
  { myth: '"It was just a joke!"', truth: 'Humour that makes someone uncomfortable is harassment. Intent does not matter — impact does.' },
  { myth: '"She didn\'t say no, so it was okay."', truth: 'Silence is NOT consent. Fear, embarrassment, or power imbalance may prevent someone from speaking up.' },
  { myth: '"I\'m her senior, it\'s just banter."', truth: 'Abuse of position or authority makes harassment even more serious under the law. Power does not give licence.' },
  { myth: '"Unable to prove = false complaint."', truth: 'Not being able to prove an incident does NOT mean it was a false complaint. The ICC handles the burden of proof.' },
]

const RIGHTS = [
  'Right to a safe and harassment-free workplace',
  'Right to file a complaint without fear of punishment',
  'Right to complete privacy and confidentiality',
  'Right to medical and counselling support',
  'Right to fair inquiry and legal remedy',
  'Right to bring a support person to hearings',
  'Right to interim relief during inquiry (transfer, leave, restraint order)',
]

const LOCATIONS = [
  { icon: '🏭', place: 'Factory / Shop Floor', desc: 'During work hours, near machines, breaks, or locker rooms' },
  { icon: '🏢', place: 'Office / Cabin', desc: 'Meetings, one-on-one discussions, corridors, canteen' },
  { icon: '🚗', place: 'Work Travel / Transit', desc: 'Company vehicles, client visits, official trips & stays' },
  { icon: '🎉', place: 'Events / Parties', desc: 'Office parties, annual functions, award ceremonies' },
  { icon: '💻', place: 'Online / Digital', desc: 'WhatsApp, email, social media, video calls, group chats' },
  { icon: '🏠', place: 'Work From Home', desc: 'Video meetings, online chats — POSH still applies!' },
]

const EMPLOYER_DUTIES = [
  { title: 'Constitute ICC', desc: 'Form and maintain an Internal Complaints Committee with a female Presiding Officer.' },
  { title: 'Display Notice', desc: 'Display POSH policy and ICC details at visible locations in the workplace.' },
  { title: 'Provide Training', desc: 'Conduct regular awareness and sensitisation sessions for all employees.' },
  { title: 'Annual Report', desc: 'Submit an annual report on complaints and outcomes to the District Officer.' },
  { title: 'Assist in Inquiry', desc: 'Provide all resources and assistance needed for inquiry proceedings.' },
  { title: 'Take Action', desc: 'Implement ICC recommendations — including disciplinary action if warranted.' },
]

function SectionLabel({ children, color = 'green' }) {
  const styles = { green: 'bg-emerald-50 text-emerald-800', red: 'bg-red-50 text-red-700', amber: 'bg-amber-50 text-amber-700', blue: 'bg-blue-50 text-blue-700' }
  return <span className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded mb-3 ${styles[color]}`}>{children}</span>
}

export default function WomenWellbeing() {
  const [tab, setTab] = useState('policy')
  const [openFaq, setOpenFaq] = useState(null)
  const [anon, setAnon] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [showCallback, setShowCallback] = useState(false)
  const [form, setForm] = useState({ type: '', date: '', desc: '', location: '', followup: 'No follow-up needed' })

  return (
    <div className="max-w-5xl mx-auto">
      {/* Tab bar */}
      <div className="flex gap-0 border-b border-slate-200 mb-8 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${tab === t.id ? 'border-[#064E3B] text-[#064E3B]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── POSH Policy ── */}
      {tab === 'policy' && (
        <div className="space-y-6">
          {/* Header card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-wrap items-center gap-5 shadow-sm">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 text-[15px]">Prevention of Sexual Harassment (POSH) Policy</h3>
              <p className="text-xs text-slate-500 mt-0.5">Sexual Harassment of Women at Workplace (Prevention, Prohibition &amp; Redressal) Act, 2013 · Zero-tolerance policy applies to all employees, vendors, contractors, and visitors</p>
            </div>
            <div className="flex gap-6 text-center shrink-0">
              {[['v 2.1','Version'],['Apr 2026','Updated'],['Annual','Review']].map(([v,l]) => (
                <div key={l}><p className="text-sm font-bold text-slate-800">{v}</p><p className="text-[10px] text-slate-400">{l}</p></div>
              ))}
            </div>
            <a href="/posh/posh-policy.pdf" download className="flex items-center gap-1.5 text-xs font-semibold border border-slate-200 rounded-lg px-3 py-2 text-[#064E3B] hover:bg-emerald-50 transition-colors shrink-0">
              <Download className="w-3.5 h-3.5" /> Download Policy
            </a>
          </div>

          {/* Purpose & Scope */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <SectionLabel>Purpose & Scope</SectionLabel>
            <div className="grid md:grid-cols-3 gap-4 mt-1">
              {[
                { title: 'Purpose', desc: 'To create and maintain a safe work environment free from sexual harassment and discrimination, and establish guidelines as per the POSH Act, 2013.' },
                { title: 'Zero Tolerance', desc: 'The organisation adopts a zero-tolerance approach against any form of sexual harassment towards employees, clients, vendors, and contractors — in India or abroad.' },
                { title: 'Applicability', desc: 'Applies to all employees — permanent, temporary, contractual, part-time, trainee, consultant, and retainer employees — at all company premises.' },
              ].map(({ title, desc }) => (
                <div key={title} className="rounded-lg bg-slate-50 border border-slate-100 p-4">
                  <p className="text-xs font-bold text-[#064E3B] uppercase tracking-wide mb-1.5">{title}</p>
                  <p className="text-xs text-slate-600 leading-[1.6]">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 4 Types of Harassment */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <SectionLabel color="red">Types of Harassment</SectionLabel>
            <h4 className="font-bold text-slate-800 mb-4">Recognising 4 Forms of Sexual Harassment</h4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {HARASSMENT_TYPES.map(({ type, color, badge, examples }) => (
                <div key={type} className={`rounded-xl border p-4 ${color}`}>
                  <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-3 ${badge}`}>{type}</span>
                  <ul className="space-y-1.5">
                    {examples.map(ex => (
                      <li key={ex} className="flex gap-2 text-xs text-slate-700 leading-snug">
                        <span className="shrink-0 mt-0.5">•</span>{ex}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Reporting process + What's covered */}
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <SectionLabel>Scope</SectionLabel>
              <h4 className="font-bold text-slate-800 mb-4">What This Policy Covers</h4>
              <div className="space-y-3">
                {[
                  ['Verbal & Non-verbal', 'Unwelcome remarks, jokes, gestures, or displays'],
                  ['Physical conduct', 'Unwanted touching or proximity'],
                  ['Digital harassment', 'Messages, emails, or images via any medium'],
                  ['Quid pro quo', 'Conditioning work benefits on personal favours'],
                  ['Hostile environment', 'Conduct that makes the workplace intimidating'],
                ].map(([title, desc]) => (
                  <div key={title} className="flex gap-3 items-start">
                    <span className="text-[#10B981] mt-0.5 shrink-0">●</span>
                    <p className="text-sm text-slate-700"><strong>{title}</strong> — {desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <SectionLabel color="red">Reporting Process</SectionLabel>
              <h4 className="font-bold text-slate-800 mb-4">How to File a Complaint</h4>
              <div className="relative">
                {[
                  ['Document the Incident', 'Note dates, times, location, and witnesses as soon as possible.', null],
                  ['Submit Written Complaint to ICC', 'File within 3 months of the incident via email, form, or in person.', 'Within 3 months'],
                  ['ICC Acknowledges & Investigates', 'Confidential inquiry — both parties heard independently.', '7 days acknowledgement · 60 days inquiry'],
                  ['Resolution & Action', 'ICC submits report and recommendations to management.', '10 days post-inquiry'],
                ].map(([title, desc, time], i) => (
                  <div key={i} className="flex gap-3 pb-5 last:pb-0 relative">
                    {i < 3 && <div className="absolute left-4 top-8 bottom-0 w-px bg-slate-200" />}
                    <div className="w-8 h-8 rounded-full bg-[#064E3B] text-white text-xs font-bold flex items-center justify-center shrink-0 z-10">{i+1}</div>
                    <div className="pt-1">
                      <p className="text-sm font-semibold text-slate-800">{title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                      {time && <span className="inline-block mt-1.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">{time}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Where it can happen */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <SectionLabel color="amber">Where Can It Happen?</SectionLabel>
            <h4 className="font-bold text-slate-800 mb-4">Harassment Has No Fixed Location — POSH Applies Everywhere</h4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {LOCATIONS.map(({ icon, place, desc }) => (
                <div key={place} className="flex gap-3 items-start rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <span className="text-xl shrink-0">{icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{place}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Common Myths */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <SectionLabel color="red">Common Myths</SectionLabel>
            <h4 className="font-bold text-slate-800 mb-4">Myths We Must Break</h4>
            <div className="grid sm:grid-cols-2 gap-3">
              {MYTHS.map(({ myth, truth }) => (
                <div key={myth} className="rounded-xl border border-red-100 bg-red-50/50 p-4">
                  <p className="text-xs font-bold text-red-600 mb-1.5 flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5 shrink-0" />{myth}</p>
                  <p className="text-xs text-slate-600 leading-[1.6] flex gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-500 mt-0.5" />{truth}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Your Rights + Employer Duties */}
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <SectionLabel color="blue">Your Rights</SectionLabel>
              <h4 className="font-bold text-slate-800 mb-4">You Are Not Alone — Know Your Rights</h4>
              <ul className="space-y-2">
                {RIGHTS.map(r => (
                  <li key={r} className="flex gap-2 text-sm text-slate-700">
                    <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />{r}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <SectionLabel>Employer Responsibilities</SectionLabel>
              <h4 className="font-bold text-slate-800 mb-4">What the Company Is Legally Bound to Do</h4>
              <div className="space-y-3">
                {EMPLOYER_DUTIES.map(({ title, desc }) => (
                  <div key={title} className="flex gap-3 items-start">
                    <span className="w-5 h-5 rounded-full bg-[#064E3B] text-white text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">✓</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{title}</p>
                      <p className="text-xs text-slate-500">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dos & Don'ts */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <SectionLabel>Dos &amp; Don'ts</SectionLabel>
            <h4 className="font-bold text-slate-800 mb-4">Practical Workplace Behaviour Guide</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-3 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" />DO — Encouraged Behaviours</p>
                <ul className="space-y-2">
                  {['Treat all colleagues with respect regardless of gender','Speak up if you witness harassment — be an ally','Report discomfort to ICC or HR without hesitation','Keep workplace communication professional','Attend POSH awareness sessions regularly','Support colleagues who come forward with complaints'].map(d => (
                    <li key={d} className="flex gap-2 text-sm text-slate-700"><span className="text-emerald-500 font-bold shrink-0">✔</span>{d}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-red-600 mb-3 flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5" />DON'T — Unacceptable Behaviours</p>
                <ul className="space-y-2">
                  {['Make sexual comments, jokes, or remarks','Send inappropriate messages, images, or videos','Touch someone without their clear consent','Stare, follow, or make someone feel unsafe','Use position/authority for personal favours','Dismiss or discourage someone from reporting'].map(d => (
                    <li key={d} className="flex gap-2 text-sm text-slate-700"><span className="text-red-500 font-bold shrink-0">✘</span>{d}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Redressal outcomes */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <SectionLabel color="red">Redressal</SectionLabel>
            <h4 className="font-bold text-slate-800 mb-3">Possible Disciplinary Actions Against the Harasser</h4>
            <div className="flex flex-wrap gap-2">
              {['Warning','Written Apology','Transfer','Suspension','Dismissal','Denial of Promotion','Denial of Increment'].map(a => (
                <span key={a} className="text-xs font-semibold bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-full">{a}</span>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-3">Annual reports regarding POSH complaints and resolutions shall remain strictly confidential as per the Act.</p>
          </div>

          {/* Confidentiality notice */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex gap-3 text-sm text-slate-700">
            <span className="text-lg shrink-0">🔒</span>
            <p><strong className="text-[#064E3B]">Confidentiality:</strong> All complaints and proceedings are strictly confidential. Any retaliation against a complainant or witness is a separate punishable offence under the POSH Act. The HR Department shall review this policy periodically and update it in accordance with applicable laws.</p>
          </div>
        </div>
      )}

      {/* ── Internal Committee ── */}
      {tab === 'committee' && (
        <div>
          <SectionLabel>Internal Complaints Committee</SectionLabel>
          <p className="text-sm text-slate-500 mb-2">Constituted under Section 4 of the POSH Act, 2013. All members are trained in gender sensitisation and inquiry procedures.</p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-sm mb-5">
            <span className="text-lg shrink-0">ℹ️</span>
            <p className="text-slate-700">The ICC must have at least 4 members, with at least half being women. Includes 1 Presiding Officer (senior woman employee), at least 2 internal members committed to women's issues, and 1 External Member (NGO / legal expert familiar with women's rights).</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-5">
            {MEMBERS.map(m => (
              <div key={m.name} className="bg-white border border-slate-200 rounded-xl p-4 flex gap-3 shadow-sm">
                <div className={`w-10 h-10 rounded-full ${m.color} text-white text-xs font-bold flex items-center justify-center shrink-0`}>{m.initials}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-slate-900 text-sm">{m.name}</p>
                    {m.badge && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${m.badge === 'External' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{m.badge}</span>}
                  </div>
                  <p className="text-xs text-[#065F46] font-semibold">{m.role}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{m.dept}</p>
                  <div className="flex gap-2 mt-2">
                    <button className="text-[11px] px-2.5 py-1 border border-slate-200 rounded text-slate-600 hover:border-[#064E3B] hover:text-[#064E3B] transition-colors"><Mail className="inline w-3 h-3 mr-1" />Email</button>
                    {m.ext && <button className="text-[11px] px-2.5 py-1 border border-slate-200 rounded text-slate-600 hover:border-[#064E3B] hover:text-[#064E3B] transition-colors"><Phone className="inline w-3 h-3 mr-1" />Ext. {m.ext}</button>}
                  </div>
                </div>
              </div>
            ))}
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-4 flex gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-400 text-xs font-bold flex items-center justify-center shrink-0">?</div>
              <div>
                <p className="font-bold text-slate-400 text-sm">Vacancy</p>
                <p className="text-xs text-slate-400">Internal Member Position Open</p>
                <p className="text-xs text-slate-400 mt-0.5">Nominations accepted</p>
                <button className="mt-2 text-[11px] px-2.5 py-1 border border-slate-200 rounded text-slate-500 hover:border-[#064E3B] transition-colors">Nominate</button>
              </div>
            </div>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex gap-3 text-sm">
            <span className="text-lg shrink-0">🔒</span>
            <p className="text-slate-700"><strong>Confidential contact:</strong> Members can be contacted for informal guidance before filing a formal complaint. All pre-complaint conversations are fully confidential. The ICC receives and records your complaint safely, conducts a fair unbiased inquiry, can grant interim relief, and ensures complete confidentiality throughout.</p>
          </div>
        </div>
      )}

      {/* ── Meeting Schedule ── */}
      {tab === 'meetings' && (
        <div>
          <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Next Meeting</h3>
            </div>
            <div className="flex items-center gap-4 bg-emerald-50 border border-emerald-100 rounded-xl p-4">
              <div className="w-12 h-12 bg-[#064E3B] rounded-lg flex flex-col items-center justify-center text-white shrink-0">
                <span className="text-lg font-bold leading-none">03</span>
                <span className="text-[9px] uppercase tracking-wider opacity-70">Jun</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 text-sm">ICC Monthly Review — June 2026</p>
                <p className="text-xs text-slate-500 mt-0.5">🕐 11:00 AM – 12:30 PM · 📍 Conference Room B, Head Office · All committee members</p>
              </div>
              <span className="text-xs font-semibold text-[#065F46] bg-emerald-100 px-3 py-1 rounded-full shrink-0">Upcoming</span>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mb-5">
            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Scheduled Meetings</p>
            </div>
            <table className="w-full">
              <thead><tr className="border-b border-slate-100">
                {['Date','Meeting','Time','Venue','Status'].map(h => <th key={h} className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">{h}</th>)}
              </tr></thead>
              <tbody>
                {[
                  ['03 Jun 2026','Monthly Review — June','11:00 AM','Conference Room B','Upcoming'],
                  ['14 Jun 2026','POSH Training Session','2:00 PM','Virtual (Teams)','Scheduled'],
                  ['01 Jul 2026','Quarterly Audit','10:00 AM','Board Room','Scheduled'],
                ].map(([date,title,time,venue,status]) => (
                  <tr key={date} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 text-sm text-slate-700">{date}</td>
                    <td className="px-5 py-3 text-sm font-medium text-slate-800">{title}</td>
                    <td className="px-5 py-3 text-sm text-slate-500">{time}</td>
                    <td className="px-5 py-3 text-sm text-slate-500">{venue}</td>
                    <td className="px-5 py-3"><span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">{status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Past Meetings</p>
            </div>
            <table className="w-full">
              <thead><tr className="border-b border-slate-100">
                {['Date','Meeting','Minutes','Status'].map(h => <th key={h} className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">{h}</th>)}
              </tr></thead>
              <tbody>
                {PAST_MEETINGS.map(m => (
                  <tr key={m.date} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 text-sm text-slate-500">{m.date}</td>
                    <td className="px-5 py-3 text-sm text-slate-800">{m.title}</td>
                    <td className="px-5 py-3"><button className="text-xs border border-slate-200 rounded px-2.5 py-1 text-slate-600 hover:border-[#064E3B] hover:text-[#064E3B] transition-colors">📄 View Minutes</button></td>
                    <td className="px-5 py-3"><span className="text-xs text-slate-400 font-medium">Completed</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Resources & FAQs ── */}
      {tab === 'resources' && (
        <div>
          <div className="space-y-2 mb-6">
            {RESOURCES.map(r => (
              <div key={r.title} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-[#064E3B] transition-colors shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                  <r.icon className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{r.title}</p>
                  <p className="text-xs text-slate-400">{r.sub}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${r.tagColor}`}>{r.tag}</span>
                <a href={r.href} download={r.href !== '#'} target={r.href !== '#' ? '_blank' : undefined} rel="noreferrer"
                  className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 text-[#064E3B] font-semibold hover:bg-emerald-50 transition-colors ml-2 flex items-center gap-1">
                  <Download className="w-3 h-3" /> Download
                </a>
              </div>
            ))}
          </div>
          <div className="mb-3">
            <SectionLabel>FAQs</SectionLabel>
            <h4 className="font-bold text-slate-800 mb-4">Frequently Asked Questions</h4>
          </div>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className={`w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold transition-colors ${openFaq === i ? 'bg-emerald-50 text-[#064E3B]' : 'text-slate-800 hover:bg-slate-50'}`}>
                  {faq.q}
                  {openFaq === i ? <ChevronUp className="w-4 h-4 shrink-0 ml-3" /> : <ChevronDown className="w-4 h-4 shrink-0 ml-3 text-slate-400" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Raise Concern ── */}
      {tab === 'raise' && (
        <div className="max-w-xl">
          <SectionLabel color="red">Raise a Concern</SectionLabel>
          <p className="text-sm text-slate-500 mb-6">All submissions are handled confidentially by the ICC. You may submit anonymously. A complaint can be filed within 3 months of the incident.</p>
          {submitted ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 flex flex-col items-center text-center shadow-sm">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-2xl mb-4">✅</div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Concern Submitted</h3>
              <p className="text-sm text-slate-500 mb-4">Your submission has been received by the ICC. You will be contacted within 72 working hours if a follow-up was requested.</p>
              <span className="font-mono text-xs bg-slate-100 px-4 py-2 rounded text-slate-600 mb-6">#POSH-2026-0047</span>
              <button onClick={() => setSubmitted(false)} className="bg-[#064E3B] text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-[#065F46] transition-colors">Submit Another</button>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <button onClick={() => setAnon(!anon)}
                className="w-full flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-5 hover:bg-slate-100 transition-colors">
                <div className={`w-10 h-5 rounded-full relative transition-colors ${anon ? 'bg-[#064E3B]' : 'bg-slate-300'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${anon ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-800">Anonymous Submission</p>
                  <p className="text-xs text-slate-400">Your name and ID will not be recorded</p>
                </div>
              </button>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nature of Concern</label>
                  <select value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all bg-white">
                    <option value="">Select type…</option>
                    {['Sexual Harassment','Hostile Work Environment','Verbal / Non-verbal Harassment','Physical Harassment','Digital Harassment','Quid Pro Quo','Other'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Date of Incident</label>
                  <input type="date" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Describe the Incident</label>
                <textarea rows={4} value={form.desc} onChange={e => setForm(f => ({...f, desc: e.target.value}))}
                  placeholder="Provide as much detail as you are comfortable sharing…"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all resize-none" />
                <p className="text-[11px] text-slate-400 mt-1">Omit your name if submitting anonymously.</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Location / Department <span className="text-slate-400 font-normal">(optional)</span></label>
                  <input type="text" placeholder="e.g. Head Office, Floor 3" value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Preferred Follow-up</label>
                  <select value={form.followup} onChange={e => setForm(f => ({...f, followup: e.target.value}))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all bg-white">
                    {['No follow-up needed','Anonymous email update','Through HR intermediary'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setSubmitted(true)} className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">Submit Concern</button>
                <button className="border border-slate-200 text-slate-600 text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">Save Draft</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Contact / Support ── */}
      {tab === 'contact' && (
        <div>
          <SectionLabel>Contact &amp; Support</SectionLabel>
          <p className="text-sm text-slate-500 mb-6">All channels are confidential. Choose the option that is most comfortable for you. Speak to HR or ICC directly — your first step is always the most important one.</p>
          <div className="space-y-3 mb-6">
            {[
              { ico: '📧', title: 'Email the ICC', desc: 'For formal or informal queries. Monitored by ICC & HR Wellbeing. Responded within 24 working hours.', val: 'posh@kgirdharlal.com', action: 'Compose Email' },
              { ico: '📞', title: 'Confidential Helpline', desc: 'Speak with a trained HR counsellor. Calls are not recorded. Mon–Fri, 9 AM – 6 PM.', val: '1800-XXX-POSH (Toll Free)', action: 'Call Now' },
              { ico: '👤', title: 'Walk-in / In-person', desc: 'Visit the HR office for a confidential in-person conversation. No appointment needed during helpdesk hours.', val: 'HR Office · 2nd Floor · Mon–Fri 10 AM – 5 PM', action: 'Get Directions' },
            ].map(c => (
              <div key={c.title} className="flex items-start gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <span className="text-2xl shrink-0 mt-0.5">{c.ico}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm">{c.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{c.desc}</p>
                  <p className="text-xs font-semibold text-[#064E3B] mt-1.5 font-mono">{c.val}</p>
                </div>
                <button className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-[#064E3B] hover:bg-emerald-50 transition-colors shrink-0">{c.action}</button>
              </div>
            ))}
            <div className="flex items-start gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <span className="text-2xl shrink-0 mt-0.5">🔁</span>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 text-sm">Request a Callback</h4>
                <p className="text-xs text-slate-500 mt-0.5">Leave your number and preferred time. An advisor will call within 4 working hours.</p>
              </div>
              <button onClick={() => setShowCallback(!showCallback)} className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-[#064E3B] hover:bg-emerald-50 transition-colors shrink-0">
                {showCallback ? 'Close' : 'Request Callback'}
              </button>
            </div>
          </div>
          {showCallback && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-6">
              <h4 className="font-bold text-slate-800 mb-4 text-sm">Request a Callback</h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Name <span className="font-normal text-slate-400">(optional)</span></label><input type="text" placeholder="Leave blank to stay anonymous" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all" /></div>
                <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number</label><input type="tel" placeholder="+91 XXXXX XXXXX" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all" /></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowCallback(false)} className="bg-[#064E3B] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#065F46] transition-colors">Confirm Request</button>
                <button onClick={() => setShowCallback(false)} className="border border-slate-200 text-slate-600 text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
              </div>
            </div>
          )}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-sm">Send a Query</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Subject</label>
                <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all bg-white">
                  <option>Policy Clarification</option><option>Reporting Process</option><option>Complaint Status</option><option>Training &amp; Resources</option><option>General Wellbeing</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Your Email <span className="font-normal text-slate-400">(optional)</span></label>
                <input type="email" placeholder="For a reply (leave blank to stay anonymous)" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all" />
              </div>
            </div>
            <textarea rows={3} placeholder="Describe your question or concern…" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all resize-none mb-4" />
            <button className="bg-[#064E3B] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#065F46] transition-colors">Send Query</button>
          </div>
        </div>
      )}
    </div>
  )
}
