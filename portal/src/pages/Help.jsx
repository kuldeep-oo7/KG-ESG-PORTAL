import { useState } from 'react'
import { Upload, Mail, Phone, Clock, ChevronRight } from 'lucide-react'

export default function Help() {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [file, setFile] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Breadcrumb */}
      <div className="px-6 py-3 flex items-center gap-1.5 text-xs text-slate-500 border-b border-slate-200 bg-white">
        <span className="text-[#064E3B] font-medium hover:underline cursor-pointer">Dashboard</span>
        <ChevronRight className="w-3 h-3" />
        <span>Help</span>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-3 gap-6">
        {/* Form */}
        <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-7">
          <h1 className="text-xl font-semibold text-slate-800 mb-6">How can we help?</h1>

          {submitted && (
            <div className="mb-4 bg-[#ECFDF5] border border-[#10B981] text-[#065F46] text-sm rounded-xl px-4 py-3">
              Your message has been submitted successfully. We'll get back to you within 24 hours.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Subject <span className="text-red-400">*</span>
              </label>
              <input
                required value={subject} onChange={e => setSubject(e.target.value)}
                placeholder="Enter Your Subject"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Brief Description <span className="text-red-400">*</span>
              </label>
              <textarea
                required value={message} onChange={e => setMessage(e.target.value)}
                placeholder="Enter Your Message"
                rows={5}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition-all placeholder:text-slate-400 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Attachment <span className="text-red-400">*</span>
              </label>
              <label className="block border-2 border-dashed border-slate-200 rounded-xl px-6 py-8 text-center cursor-pointer hover:border-[#10B981] hover:bg-[#ECFDF5]/30 transition-all">
                <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600">
                  {file ? file.name : 'Drag file here or click to select'}
                </p>
                <p className="text-xs text-slate-400 mt-1">Supports .docx, .pdf, .xlsx, .jpg, .jpeg, .png, .ppt, .pptx, .csv</p>
                <input type="file" className="hidden" onChange={e => setFile(e.target.files?.[0])} />
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-[#064E3B] hover:bg-[#065F46] text-white font-medium text-sm px-8 py-2.5 rounded-xl transition-colors"
              >
                Submit
              </button>
            </div>
          </form>
        </div>

        {/* Contact card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 h-fit">
          <h2 className="text-base font-semibold text-slate-800 mb-4">Contact Us</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#ECFDF5] flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-[#064E3B]" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">EMAIL</p>
                <p className="text-sm font-medium text-[#064E3B]">care@esgtech.ai</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#ECFDF5] flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-[#064E3B]" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">PHONE</p>
                <p className="text-sm font-medium text-slate-800">+91 98250 00340</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#ECFDF5] flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-[#064E3B]" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">BUSINESS HOURS</p>
                <p className="text-sm font-medium text-slate-800">Mon to Fri · 11 to 18 (IST)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
