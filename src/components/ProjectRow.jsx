import { useEffect, useRef, useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

import Panel from './Panel'

export default function ProjectRow({ project }) {
  const gallery = (project.images || [project.image]).filter(Boolean)
  const details = project.details || project.highlights || []
  const articleRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [modalImage, setModalImage] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  useEffect(() => {
    if (!modalImage) return undefined

    const root = document.documentElement
    root.classList.add('hud-lightbox-open')
    return () => root.classList.remove('hud-lightbox-open')
  }, [modalImage])

  useEffect(() => {
    if (!modalImage) return undefined

    const mediaQuery = window.matchMedia('(max-width: 767px)')
    const updateScreenSize = () => setIsSmallScreen(mediaQuery.matches)

    updateScreenSize()
    mediaQuery.addEventListener('change', updateScreenSize)
    return () => mediaQuery.removeEventListener('change', updateScreenSize)
  }, [modalImage])

  useEffect(() => {
    const article = articleRef.current
    if (!article) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting && entry.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] },
    )

    observer.observe(article)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible || modalImage || gallery.length <= 1) return undefined

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % gallery.length)
    }, 4200)

    return () => window.clearInterval(timer)
  }, [isVisible, gallery.length, modalImage])

  const openImage = (index) => {
    setActiveIndex(index)
    setModalImage(gallery[index])
  }

  return (
    <article ref={articleRef} data-reveal className="group grid gap-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-start lg:gap-14">
      <div className="order-2 lg:order-1">
        <Panel panel={project.panel} />

        {details.length ? (
          <div className="mt-5 border-t border-line pt-4">
            <p className="text-[10px] tracking-[0.18em] text-ink-dim uppercase">Project details</p>
            <ul className="mt-3 space-y-2 text-[13px] leading-snug text-ink-dim">
              {details.map((detail) => (
                <li key={detail} className="flex gap-2">
                  <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-signal" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {project.roleDetails?.length ? (
          <div className="mt-5 border-t border-line pt-4">
            <p className="text-[10px] tracking-[0.18em] text-ink-dim uppercase">My role</p>
            <ul className="mt-3 space-y-2 text-[13px] leading-snug text-ink-dim">
              {project.roleDetails.map((detail) => (
                <li key={detail} className="flex gap-2">
                  <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-signal" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="order-1 lg:order-2">
        <h3 className="font-display text-[clamp(1.6rem,3.4vw,2.3rem)] font-bold uppercase leading-tight text-ink transition-colors group-hover:text-signal group-focus-within:text-signal">
          {project.name}
        </h3>
        <p className="mt-1.5 text-sm text-ink-dim">{project.role}</p>
        <p className="mt-4 text-[11px] tracking-[0.14em] text-ink-dim uppercase">{project.stack.join(' · ')}</p>

        <div className="mt-5 space-y-3 text-[15px] leading-relaxed">
          {project.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>

        {gallery.length ? (
          <div className="mt-6">
            <div className="relative overflow-hidden rounded-sm border border-line bg-panel">
              <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
                {gallery.map((image, index) => (
                  <button
                    key={`${project.id}-slide-${index}`}
                    type="button"
                    onClick={() => openImage(index)}
                    className="block min-w-full cursor-zoom-in text-left"
                    aria-label={`Open ${project.name} image ${index + 1}`}
                  >
                    <img
                      src={image}
                      alt={`${project.name} product preview ${index + 1}`}
                      className="h-56 w-full object-cover object-top sm:h-64"
                      loading={index === activeIndex ? 'eager' : 'lazy'}
                    />
                  </button>
                ))}
              </div>

              {gallery.length > 1 ? (
                <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 rounded-full border border-white/15 bg-void/70 px-2 py-1 backdrop-blur-sm">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        setActiveIndex((current) => (current === 0 ? gallery.length - 1 : current - 1))
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-panel text-sm text-ink transition-colors hover:border-signal hover:text-signal"
                      aria-label="Previous project image"
                    >
                      <span aria-hidden="true" className="h-2.5 w-2.5 rotate-45 border-b border-l border-current" />
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        setActiveIndex((current) => (current + 1) % gallery.length)
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-panel text-sm text-ink transition-colors hover:border-signal hover:text-signal"
                      aria-label="Next project image"
                    >
                      <span aria-hidden="true" className="h-2.5 w-2.5 -rotate-45 border-r border-b border-current" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-void/70 px-2 py-1 backdrop-blur-sm">
                    {gallery.map((_, index) => (
                      <button
                        key={`${project.id}-dot-${index}`}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        aria-label={`View image ${index + 1} of ${gallery.length}`}
                        className={`h-2 w-2 rounded-full transition-colors ${index === activeIndex ? 'bg-signal' : 'bg-ink-dim'}`}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {project.link?.href ? (
          <a
            href={project.link.href}
            target={project.link.href.startsWith('http') ? '_blank' : undefined}
            rel={project.link.href.startsWith('http') ? 'noreferrer' : undefined}
            className="mt-4 inline-block text-sm text-ink underline decoration-line underline-offset-4 transition-colors hover:text-signal hover:decoration-signal"
          >
            {project.link.label}{' '}
            <span aria-hidden="true" className="text-signal">
              →
            </span>
          </a>
        ) : (
          <p className="mt-4 text-sm text-ink-dim">{project.link?.label || 'Images available only'}</p>
        )}
      </div>

      <Lightbox
        className="portfolio-lightbox"
        open={Boolean(modalImage)}
        close={() => setModalImage(null)}
        slides={gallery.map((src, index) => ({ src, alt: `${project.name} image ${index + 1}` }))}
        index={activeIndex}
        on={{ view: ({ index }) => setActiveIndex(index) }}
        controller={{ closeOnBackdropClick: true, closeOnEscape: true }}
        carousel={{ imageFit: 'contain', padding: isSmallScreen ? '64px' : '10%', spacing: '24%' }}
      />
    </article>
  )
}
