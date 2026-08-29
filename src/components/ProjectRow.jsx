import Panel from './Panel'

export default function ProjectRow({ project }) {
  return (
    <article data-reveal className="group grid gap-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center lg:gap-14">
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

        <p className="mt-6 text-[11px] tracking-[0.14em] text-ink-dim uppercase">{project.stack.join(' · ')}</p>

        <a
          href={project.link.href}
          className="mt-4 inline-block text-sm text-ink underline decoration-line underline-offset-4 transition-colors hover:text-signal hover:decoration-signal"
        >
          {project.link.label}{' '}
          <span aria-hidden="true" className="text-signal">
            →
          </span>
        </a>
      </div>
    </article>
  )
}
