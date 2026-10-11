// Stands in for a screenshot of the real project UI: same 16:9 frame, but
// built from live DOM so the text stays selectable and nothing has to be
// downloaded. Swap an <img> in here once real captures exist.
export default function Panel({ panel }) {
  return (
    <div
      data-panel
      className="group/panel relative flex w-full flex-col rounded-xs bg-panel p-4 transition-transform duration-200 ease-out group-hover:-translate-y-1 group-focus-within:-translate-y-1 sm:aspect-video sm:p-5"
    >
      <span
        aria-hidden="true"
        data-panel-bracket="tl"
        className="pointer-events-none absolute top-2 left-2 h-3 w-3 origin-top-left border-t border-l border-signal/50"
      />
      <span
        aria-hidden="true"
        data-panel-bracket="tr"
        className="pointer-events-none absolute top-2 right-2 h-3 w-3 origin-top-right border-t border-r border-signal/50"
      />
      <span
        aria-hidden="true"
        data-panel-bracket="bl"
        className="pointer-events-none absolute bottom-2 left-2 h-3 w-3 origin-bottom-left border-b border-l border-signal/50"
      />
      <span
        aria-hidden="true"
        data-panel-bracket="br"
        className="pointer-events-none absolute right-2 bottom-2 h-3 w-3 origin-bottom-right border-r border-b border-signal/50"
      />

      <span
        aria-hidden="true"
        data-scan-sweep
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-signal/40"
      />

      <div className="flex items-baseline justify-between gap-4 border-b border-line pb-2">
        <span className="text-[10px] tracking-[0.18em] text-ink-dim uppercase">{panel.label}</span>
        <span className="truncate text-[10px] text-ink-dim tabular-nums">{panel.meta}</span>
      </div>

      <ul className="flex flex-1 flex-col justify-center divide-y divide-line/70 py-3">
        {panel.rows.map((row) => (
          <li
            key={row.key}
            className="grid grid-cols-[minmax(0,5rem)_minmax(0,1fr)] items-center gap-x-3 py-2.5 sm:grid-cols-[minmax(0,7rem)_minmax(0,1fr)]"
          >
            <span className="text-[10px] tracking-[0.08em] text-ink-dim uppercase">{row.key}</span>
            <span className="text-right text-xs leading-snug">{row.value}</span>
          </li>
        ))}
      </ul>

      <p className="border-t border-line pt-2 text-[11px] leading-snug text-ink-dim">{panel.note}</p>
    </div>
  )
}
