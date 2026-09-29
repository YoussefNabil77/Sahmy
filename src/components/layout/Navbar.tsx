import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Sun, Moon, TrendingUp, Menu, X } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { fetchSearchSuggestions } from '../../services/marketApi'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [search, setSearch] = useState('')
  const [suggestions, setSuggestions] = useState<{ ticker: string; companyNameAr: string; sector: string }[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (search.length < 1) { setSuggestions([]); return }
    const t = setTimeout(async () => {
      const res = await fetchSearchSuggestions(search)
      setSuggestions(res.slice(0, 6))
      setShowSuggestions(true)
    }, 200)
    return () => clearTimeout(t)
  }, [search])

  const handleSearch = (ticker?: string) => {
    const q = ticker ?? search
    if (!q.trim()) return
    navigate(`/stock/${q.trim().toUpperCase()}`)
    setSearch('')
    setShowSuggestions(false)
    setMobileOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 border-b" style={{ backgroundColor: 'rgb(var(--surface-card))', borderColor: 'rgb(var(--surface-border))' }}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <TrendingUp size={18} className="text-white" />
          </div>
          <span className="text-xl font-black" style={{ color: 'rgb(var(--text-primary))' }}>سهمي</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 me-4">
          <Link to="/" className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-emerald-500/10 hover:text-emerald-500"
            style={{ color: 'rgb(var(--text-secondary))' }}>الرئيسية</Link>
          <Link to="/stock/COMI" className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-emerald-500/10 hover:text-emerald-500"
            style={{ color: 'rgb(var(--text-secondary))' }}>تحليل الأسهم</Link>
        </div>

        {/* Search */}
        <div ref={searchRef} className="hidden md:block relative flex-1 max-w-xs">
          <div className="relative">
            <Search size={16} className="absolute top-1/2 -translate-y-1/2 start-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              placeholder="ابحث عن سهم..."
              className="w-full ps-9 pe-3 py-2 text-sm rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              style={{ borderColor: 'rgb(var(--surface-border))', color: 'rgb(var(--text-primary))' }}
            />
          </div>
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full mt-1 w-full rounded-xl border shadow-xl z-50 overflow-hidden"
              style={{ backgroundColor: 'rgb(var(--surface-card))', borderColor: 'rgb(var(--surface-border))' }}>
              {suggestions.map(s => (
                <button
                  key={s.ticker}
                  onClick={() => handleSearch(s.ticker)}
                  className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-emerald-500/10 text-sm transition-colors"
                >
                  <span className="font-semibold text-emerald-500">{s.ticker}</span>
                  <span style={{ color: 'rgb(var(--text-primary))' }}>{s.companyNameAr}</span>
                  <span className="text-xs" style={{ color: 'rgb(var(--text-secondary))' }}>{s.sector}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1" />

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg transition-colors hover:bg-emerald-500/10"
          aria-label="تبديل المظهر"
        >
          {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-500" />}
        </button>

        {/* Mobile menu */}
        <button
          className="md:hidden p-2 rounded-lg transition-colors hover:bg-emerald-500/10"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="القائمة"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t px-4 py-3 space-y-2" style={{ borderColor: 'rgb(var(--surface-border))' }}>
          <Link to="/" onClick={() => setMobileOpen(false)} className="block py-2 font-medium" style={{ color: 'rgb(var(--text-primary))' }}>الرئيسية</Link>
          <Link to="/stock" onClick={() => setMobileOpen(false)} className="block py-2 font-medium" style={{ color: 'rgb(var(--text-primary))' }}>تحليل الأسهم</Link>
          <div className="relative pt-1">
            <Search size={16} className="absolute top-1/2 mt-0.5 -translate-y-1/2 start-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="ابحث عن سهم..."
              className="w-full ps-9 pe-3 py-2 text-sm rounded-lg border bg-transparent focus:outline-none"
              style={{ borderColor: 'rgb(var(--surface-border))', color: 'rgb(var(--text-primary))' }}
            />
          </div>
        </div>
      )}
    </nav>
  )
}
