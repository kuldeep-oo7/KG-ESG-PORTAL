import Navbar from './Navbar'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />
      <main className="flex-1 min-h-screen">
        <div className="max-w-[1440px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
