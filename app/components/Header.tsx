import { Link, useRouterState } from '@tanstack/react-router'

import { cn } from 'app/lib/utils'

const NAV_LINKS = [
  { href: '/', label: 'Simulator' },
  { href: '/about', label: 'About' },
  { href: '/methodology', label: 'Methodology' },
]

export function Header() {
  const { location } = useRouterState()

  return (
    <header className="border-b border-white/5 bg-background/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="text-lg font-semibold tracking-tight text-white">
          NEV Efficiency Check
        </Link>
        <nav className="flex items-center gap-3 text-sm font-medium">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.href
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'rounded-full px-3 py-1 transition-colors',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-slate-300 hover:bg-white/5',
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
