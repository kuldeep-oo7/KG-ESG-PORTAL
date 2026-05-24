import Navbar from './Navbar'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-slate-200 bg-white py-3 px-6 flex justify-between items-center">
        <div className="flex gap-4">
          {['Twitter','LinkedIn','YouTube','Facebook','Instagram'].map(s => (
            <span key={s} className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 text-xs cursor-pointer hover:border-[#10B981] hover:text-[#10B981] transition-colors">{s[0]}</span>
          ))}
        </div>
        <div className="flex gap-4 text-xs text-slate-400">
          <span className="hover:text-slate-600 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-slate-600 cursor-pointer">Terms of Service</span>
        </div>
      </footer>
    </div>
  )
}
