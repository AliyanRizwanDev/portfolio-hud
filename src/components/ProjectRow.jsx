import { useEffect, useRef, useState } from 'react'

import Panel from './Panel'

export default function ProjectRow({ project }) {
  const gallery = (project.images || [project.image]).filter(Boolean)
  const articleRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [modalImage, setModalImage] = useState(null)
  const [isVisible, setIsVisible] = useState(false)

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
    if (!isVisible || gallery.length <= 1) return undefined

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % gallery.length)
    }, 4200)

    return () => window.clearInterval(timer)
  }, [isVisible, gallery.length])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setModalImage(null)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const openImage = (index) => {
    setActiveIndex(index)
    setModalImage(gallery[index])
  }

  return (
    <article ref={articleRef} data-reveal className="group grid gap-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center lg:gap-14">
      <Panel panel={project.panel} />

      <div>
        <h3 className="font-display text-[clamp(1.6rem,3.4vw,2.3rem)] font-bold uppercase leading-tight text-ink transition-colors group-hover:text-signal group-focus-within:text-signal">
          {project.name}
        </h3>
        <p className="mt-1.5 text-sm text-ink-dim">{project.role}</p>

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
                        className={`h-2 w-2 rounded-full transition-colors ${
                          index === activeIndex ? 'bg-signal' : 'bg-ink-dim'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        <p className="mt-6 text-[11px] tracking-[0.14em] text-ink-dim uppercase">{project.stack.join(' · ')}</p>

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

      {modalImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-void/85 p-4 backdrop-blur-sm"
          onClick={() => setModalImage(null)}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-sm border border-line bg-panel shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setModalImage(null)}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-void/80 text-lg text-ink transition-colors hover:border-signal hover:text-signal"
              aria-label="Close image preview"
            >
              ×
            </button>
            <img
              src={modalImage}
              alt={`${project.name} full-size preview`}
              className="max-h-[85vh] w-full object-contain"
              onClick={(event) => event.stopPropagation()}
            />
          </div>
        </div>
      ) : null}
    </article>
  )
}
