import { useLenis } from 'lenis/react'

const links = [
  { href: '#work', label: 'work' },
  { href: '#skills', label: 'skills' },
  { href: '#about', label: 'about' },
  { href: '#contact', label: 'contact' },
]

export default function Nav() {
  const lenis = useLenis()

  const handleClick = (event, href) => {
    if (!lenis) return
    event.preventDefault()
    lenis.scrollTo(href, { offset: -24 })
  }

  return (
    <nav aria-label="Sections" className="flex items-center justify-between gap-6 py-7 sm:py-9">
      <a href="#" aria-label="Home" className="relative flex items-center gap-[3px]">
        <span
          aria-hidden="true"
          data-status-dot
          className="absolute -top-1 -right-2 h-1.5 w-1.5 rounded-full bg-signal"
        />
        <span aria-hidden="true" className="h-3.5 w-[3px] bg-signal" />
        <span aria-hidden="true" className="h-3.5 w-[3px] bg-ink" />
      </a>
      <ul className="flex gap-4 text-[11px] tracking-[0.16em] uppercase sm:gap-7">
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
    </nav>
  )
}
