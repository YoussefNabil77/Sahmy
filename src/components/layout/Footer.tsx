import { TrendingUp } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t mt-16 py-8" style={{ borderColor: 'rgb(var(--surface-border))' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
              <TrendingUp size={14} className="text-white" />
            </div>
            <span className="font-bold text-lg" style={{ color: 'rgb(var(--text-primary))' }}>سهمي</span>
          </div>
          <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
            © {new Date().getFullYear()} سهمي - البورصة المصرية. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  )
}
