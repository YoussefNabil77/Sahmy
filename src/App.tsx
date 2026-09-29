import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import StockPage from './pages/StockPage'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

export default function App() {
  // Apply dark mode on mount
  useEffect(() => {
    const stored = localStorage.getItem('sahmy-theme')
    if (!stored || stored === 'dark') {
      document.documentElement.classList.add('dark')
    }
  }, [])

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'rgb(var(--surface-bg))' }}>
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/stock" element={<StockPage />} />
            <Route path="/stock/:ticker" element={<StockPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
