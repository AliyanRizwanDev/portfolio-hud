import { useLenis } from 'lenis/react'
import { useState } from 'react'

const links = [
  { href: '#work', label: 'work' },
  { href: '#skills', label: 'skills' },
  { href: '#about', label: 'about' },
  { href: '#contact', label: 'contact' },
]

export default function Nav() {
  const lenis = useLenis()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleClick = (event, href) => {
    setMenuOpen(false)
    if (lenis) {
      event.preventDefault()
      lenis.scrollTo(href, { offset: -24 })
    }
  }

  return (
    <nav aria-label="Sections" className="flex items-center justify-between gap-6 py-4 sm:py-9">
      <a href="#" aria-label="Mohammad Aliyan home" className="relative font-display text-sm font-bold tracking-[0.12em] text-ink uppercase transition-colors hover:text-signal">
        <span
          aria-hidden="true"
          data-status-dot
          className="absolute -top-1 -right-2 h-1.5 w-1.5 rounded-full bg-signal"
        />
        Mohammad Aliyan
      </a>
      <ul className="hidden gap-4 text-[11px] tracking-[0.16em] text-ink-dim uppercase md:flex md:gap-7">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              onClick={(event) => handleClick(event, link.href)}
              className="group/nav relative inline-flex items-center gap-1 text-ink-dim transition-colors hover:text-signal"
            >
              <span
                aria-hidden="true"
                className="h-2 w-1.5 origin-bottom-left scale-0 border-t border-l border-signal transition-transform duration-150 group-hover/nav:scale-100"
              />
              {link.label}
              <span
                aria-hidden="true"
                className="h-2 w-1.5 origin-bottom-right scale-0 border-r border-b border-signal transition-transform duration-150 group-hover/nav:scale-100"
              />
            </a>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => setMenuOpen(true)}
        className="flex h-9 w-9 items-center justify-center border border-line text-ink transition-colors hover:border-signal hover:text-signal md:hidden"
        aria-label="Open navigation menu"
        aria-expanded={menuOpen}
      >
        <span aria-hidden="true" className="flex w-4 flex-col gap-1">
          <span className="h-px w-full bg-current" />
          <span className="h-px w-3 bg-current" />
          <span className="h-px w-full bg-current" />
        </span>
      </button>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 h-full w-full bg-void/75 backdrop-blur-sm"
            aria-label="Close navigation menu"
          />
          <aside className="absolute top-0 right-0 flex h-full w-[min(19rem,84vw)] flex-col border-l border-line bg-panel p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-line pb-5">
              <span className="font-display text-sm font-bold tracking-[0.12em] text-ink uppercase">Navigate</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center border border-line text-xl text-ink transition-colors hover:border-signal hover:text-signal"
                aria-label="Close navigation menu"
              >
                ×
              </button>
            </div>
            <ul className="mt-8 space-y-6 text-sm tracking-[0.16em] text-ink-dim uppercase">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(event) => handleClick(event, link.href)}
                    className="block border-b border-line pb-4 transition-colors hover:text-signal"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      ) : null}
    </nav>
  )
}
