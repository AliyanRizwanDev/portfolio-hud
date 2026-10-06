const lines = ['I build', 'products people trust.']

export default function Hero() {
  return (
    <header className="relative flex min-h-[80svh] flex-col justify-center py-16">
      <span
        aria-hidden="true"
        data-bracket="tl"
        className="absolute top-6 left-0 h-5 w-5 border-t-2 border-l-2 border-signal"
      />
      <span
        aria-hidden="true"
        data-bracket="tr"
        className="absolute top-6 right-0 h-5 w-5 border-t-2 border-r-2 border-signal"
      />
      <span
        aria-hidden="true"
        data-bracket="bl"
        className="absolute bottom-6 left-0 h-5 w-5 border-b-2 border-l-2 border-signal"
      />
      <span
        aria-hidden="true"
        data-bracket="br"
        className="absolute right-0 bottom-6 h-5 w-5 border-r-2 border-b-2 border-signal"
      />

      <div data-scanline aria-hidden="true" className="h-px w-full origin-left bg-signal" />

      <h1 className="mt-10 font-display text-[clamp(2.6rem,8vw,5.5rem)] leading-[1.02] font-bold tracking-[-0.01em] uppercase">
        {lines.map((line) => (
          <span key={line} data-headline className="block">
            {line}
          </span>
        ))}
      </h1>

      <span
        data-bar
        aria-hidden="true"
        className="mt-6 block h-2 w-16 skew-x-[-20deg] bg-signal"
      />

      <p data-sub className="mt-7 max-w-lg text-[15px] leading-relaxed text-ink-dim">
        Full-stack developer working across React, Next.js, TypeScript and backend systems — building user-facing products that need to be clear, fast, and reliable in the real world.
      </p>
    </header>
  )
}
