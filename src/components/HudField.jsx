// Ambient cockpit layer: parallax grid + scanner field + live coordinate readout.
// Driven by CSS vars (--hud-px, --hud-py, --hud-mx, --hud-my) set in HudCursor.
export default function HudField() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div data-hud-grid className="hud-grid absolute inset-[-24px]" />
      <div data-hud-scanner className="hud-scanner absolute inset-0" />
      <div className="absolute right-6 bottom-6 text-[10px] tracking-[0.2em] text-ink-dim uppercase tabular-nums sm:right-10">
        <span className="text-signal/70">trk</span>{' '}
        <span data-hud-x>0000</span>
        <span className="text-line"> / </span>
        <span data-hud-y>0000</span>
      </div>
    </div>
  )
}
