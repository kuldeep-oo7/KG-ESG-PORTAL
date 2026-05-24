import { Construction } from 'lucide-react'

export default function Placeholder({ title }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-[#ECFDF5] flex items-center justify-center">
        <Construction className="w-8 h-8 text-[#064E3B]" />
      </div>
      <h1 className="text-2xl font-semibold text-slate-800">{title}</h1>
      <p className="text-slate-500 text-sm">This section is coming soon.</p>
    </div>
  )
}
