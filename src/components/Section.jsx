export default function Section({ id, title, lede, children }) {
  return (
    <section id={id} className="scroll-mt-12 border-t border-line py-20 sm:py-28">
      <div data-reveal className="max-w-xl">
        <h2 className="font-display text-[clamp(1.9rem,5vw,3rem)] font-bold uppercase leading-none text-ink">
          {title}
        </h2>
        <p className="mt-4 text-sm text-ink-dim">{lede}</p>
      </div>
      <div className="mt-12 sm:mt-16">{children}</div>
    </section>
  )
}
