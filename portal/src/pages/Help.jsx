import { useState, useRef } from 'react'
import { Upload, Mail, Phone, Clock } from 'lucide-react'

export default function Help() {
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const fileInputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] ?? null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const dropped = e.dataTransfer.files?.[0]
    if (dropped) setFile(dropped)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-6 py-8">
      {/* Breadcrumb */}
      <p className="text-xs text-slate-400 mb-4">Dashboard &gt; Help</p>

      {/* Heading */}
      <h1
        className="text-3xl font-bold text-slate-900 mb-8"
        style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
      >
        How can we help?
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl">
        {/* Left column — help form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-[#E6F4F1] flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-[#064E3B]" />
              </div>
              <p
                className="text-xl font-bold text-slate-900 mb-2"
                style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
              >
                Message Sent
              </p>
              <p className="text-slate-500">Thank you! We'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Subject <span className="text-red-400">*</span>
                </label>
                <input
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter Your Subject"
                  className="w-full border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all"
                />
              </div>

              {/* Brief Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Brief Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter Your Message"
                  rows={6}
                  className="w-full border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all resize-none"
                />
              </div>

              {/* Attachment */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Attachment <span className="text-red-400">*</span>
                </label>
                <div
                  className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center cursor-pointer hover:border-[#064E3B]/40 hover:bg-[#E6F4F1]/20 transition-all"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <Upload className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500 mb-1">
                    {file ? file.name : 'Drag file here or click to select'}
                  </p>
                  <p className="text-xs text-slate-400">
                    Supports .docx, .pdf, .xlsx, .jpg, .jpeg, .png, .ppt, .pptx, .csv
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".docx,.pdf,.xlsx,.jpg,.jpeg,.png,.ppt,.pptx,.csv"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-[#064E3B] hover:bg-[#065F46] text-white font-medium rounded-xl px-8 py-3 transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right column — contact card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm h-fit">
          <h2
            className="text-xl font-bold text-slate-900 mb-6"
            style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
          >
            Contact Us
          </h2>

          <div className="space-y-6">
            {/* Email */}
            <div className="flex gap-3">
              <div className="bg-[#E6F4F1] text-[#064E3B] rounded-full p-2 h-fit shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-0.5">Email</p>
                <p className="text-sm font-medium text-slate-700">care@esgtech.ai</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-3">
              <div className="bg-[#E6F4F1] text-[#064E3B] rounded-full p-2 h-fit shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-0.5">Phone</p>
                <p className="text-sm font-medium text-slate-700">+91 98250 00340</p>
              </div>
            </div>

            {/* Business Hours */}
            <div className="flex gap-3">
              <div className="bg-[#E6F4F1] text-[#064E3B] rounded-full p-2 h-fit shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-0.5">
                  Business Hours
                </p>
                <p className="text-sm font-medium text-slate-700">Mon to Fri - 11 to 18 (IST)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
