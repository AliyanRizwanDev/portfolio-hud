import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { IMPACT } from '../motion'

const INTERACTIVE = 'a, button, [data-panel], [data-cursor-target]'
const CLICKABLE = `${INTERACTIVE}, input, textarea, select, label`
const TEXT_HOST = 'p, h1, h2, h3, h4, li, a'

function padCoord(value, max) {
  return String(Math.round((value / max) * 9999)).padStart(4, '0')
}

function hitAt(x, y) {
  return document.elementFromPoint(x, y)
}

/** True only when (x, y) sits on painted glyph bounds — not empty box padding. */
function isPointOverText(x, y) {
  const el = hitAt(x, y)
  if (!el) return false
  if (el.closest('nav, footer, [data-panel], button')) return false

  const host = el.closest(TEXT_HOST)
  if (!host) return false

  const pad = 8
  const walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return node.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
    },
  })

  let node
  while ((node = walker.nextNode())) {
    const range = document.createRange()
    range.selectNodeContents(node)
    for (const rect of range.getClientRects()) {
      if (
        x >= rect.left - pad &&
        x <= rect.right + pad &&
        y >= rect.top - pad &&
        y <= rect.bottom + pad
      ) {
        return true
      }
    }
  }

  return false
}

function isBlankHit(x, y) {
  const el = hitAt(x, y)
  if (!el) return true
  if (el.closest(CLICKABLE)) return false
  if (isPointOverText(x, y)) return false
  return true
}

function clearSelection() {
  window.getSelection()?.removeAllRanges()
}

// Crosshair reticle + radar ping on blank clicks.
export default function HudCursor() {
  const reticle = useRef(null)
  const ring = useRef(null)
  const armsH = useRef(null)
  const armsV = useRef(null)
  const dot = useRef(null)
  const pingLayer = useRef(null)
  const hovering = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const reticleEl = reticle.current
    const ringEl = ring.current
    const armsHEl = armsH.current
    const armsVEl = armsV.current
    const dotEl = dot.current
    const layer = pingLayer.current
    if (!reticleEl || !layer) return

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine) return

    const root = document.documentElement
    root.classList.add('hud-cursor-active')

    gsap.set(reticleEl, { xPercent: -50, yPercent: -50, opacity: 0 })
    gsap.to(ringEl, { rotation: 360, duration: 12, ease: 'none', repeat: -1 })

    const moveX = gsap.quickSetter(reticleEl, 'x', 'px')
    const moveY = gsap.quickSetter(reticleEl, 'y', 'px')
    const coordX = root.querySelector('[data-hud-x]')
    const coordY = root.querySelector('[data-hud-y]')
    const scanner = root.querySelector('[data-hud-scanner]')

    const setHover = (on) => {
      if (hovering.current === on) return
      hovering.current = on
      gsap.to(ringEl, { scale: on ? 0.72 : 1, duration: 0.18, ease: IMPACT, overwrite: true })
      gsap.to(armsHEl, { scaleX: on ? 1.35 : 1, duration: 0.18, ease: IMPACT, overwrite: true })
      gsap.to(armsVEl, { scaleY: on ? 1.35 : 1, duration: 0.18, ease: IMPACT, overwrite: true })
      gsap.to(dotEl, { scale: on ? 1.6 : 1, duration: 0.18, ease: IMPACT, overwrite: true })
    }

    const spawnPing = (x, y, blank) => {
      const wrap = document.createElement('div')
      wrap.className = 'pointer-events-none absolute'
      wrap.style.left = `${x}px`
      wrap.style.top = `${y}px`
      layer.appendChild(wrap)

      const ringA = document.createElement('span')
      ringA.className =
        'absolute top-1/2 left-1/2 block h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-signal'
      wrap.appendChild(ringA)

      gsap.fromTo(
        ringA,
        { scale: 0.4, opacity: 0.95 },
        { scale: blank ? 14 : 6, opacity: 0, duration: blank ? 0.65 : 0.4, ease: 'power2.out' },
      )

      if (blank) {
        const ringB = document.createElement('span')
        ringB.className =
          'absolute top-1/2 left-1/2 block h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-signal/50'
        wrap.appendChild(ringB)
        gsap.fromTo(
          ringB,
          { scale: 0.4, opacity: 0.7 },
          { scale: 20, opacity: 0, duration: 0.85, ease: 'power2.out', delay: 0.08 },
        )

        const scan = document.createElement('span')
        scan.className = 'fixed left-0 h-px w-full origin-center bg-signal/50'
        scan.style.top = `${y}px`
        layer.appendChild(scan)
        gsap.fromTo(
          scan,
          { scaleX: 0, opacity: 0.85 },
          { scaleX: 1, opacity: 0, duration: 0.38, ease: 'power2.out', onComplete: () => scan.remove() },
        )

        const tag = document.createElement('span')
        tag.className =
          'absolute top-2 left-2 text-[9px] tracking-[0.2em] text-signal uppercase whitespace-nowrap'
        tag.textContent = `ping ${padCoord(x, window.innerWidth)}·${padCoord(y, window.innerHeight)}`
        wrap.appendChild(tag)
        gsap.fromTo(tag, { opacity: 1, y: 0 }, { opacity: 0, y: -8, duration: 0.55, ease: 'power2.out', delay: 0.1 })

        if (scanner) {
          gsap.fromTo(scanner, { opacity: 0.35 }, { opacity: 1, duration: 0.12, yoyo: true, repeat: 1 })
        }

        root.style.setProperty('--hud-flash-x', String(x))
        root.style.setProperty('--hud-flash-y', String(y))
        gsap.fromTo(root, { '--hud-flash-o': 0.85 }, { '--hud-flash-o': 0, duration: 0.45, ease: 'power2.out' })

        gsap.fromTo(
          ringEl,
          { scale: 0.5 },
          { scale: hovering.current ? 0.72 : 1, duration: 0.35, ease: IMPACT },
        )
      }

      gsap.delayedCall(blank ? 0.9 : 0.45, () => wrap.remove())
    }

    const refreshAt = (x, y) => {
      const hit = document.elementFromPoint(x, y)?.closest(INTERACTIVE)
      setHover(Boolean(hit))
    }

    const blockIfNotOnText = (event) => {
      const x = event.clientX ?? lastPos.current.x
      const y = event.clientY ?? lastPos.current.y
      if (event.target.closest('input, textarea')) return
      if (!isPointOverText(x, y)) {
        event.preventDefault()
        clearSelection()
      }
    }

    const move = (event) => {
      const { clientX: x, clientY: y } = event
      lastPos.current = { x, y }

      moveX(x)
      moveY(y)
      gsap.to(reticleEl, { opacity: 1, duration: 0.1, overwrite: true })

      root.style.setProperty('--hud-px', String(x))
      root.style.setProperty('--hud-py', String(y))
      root.style.setProperty('--hud-mx', String(x / window.innerWidth - 0.5))
      root.style.setProperty('--hud-my', String(y / window.innerHeight - 0.5))

      if (coordX) coordX.textContent = padCoord(x, window.innerWidth)
      if (coordY) coordY.textContent = padCoord(y, window.innerHeight)

      refreshAt(x, y)
    }

    const onScroll = () => {
      const { x, y } = lastPos.current
      refreshAt(x, y)
    }

    const onDown = (event) => {
      if (event.button !== 0) return
      const { clientX: x, clientY: y } = event
      const blank = isBlankHit(x, y)

      if (blank) {
        event.preventDefault()
        clearSelection()
        spawnPing(x, y, true)
        return
      }

      if (event.target.closest('a, button')) {
        spawnPing(x, y, false)
      }
    }

    const hide = () => {
      gsap.to(reticleEl, { opacity: 0, duration: 0.12 })
      setHover(false)
    }

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', onDown)
    document.addEventListener('selectstart', blockIfNotOnText, true)
    document.addEventListener('dblclick', blockIfNotOnText, true)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointerleave', hide)
    return () => {
      root.classList.remove('hud-cursor-active')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', onDown)
      document.removeEventListener('selectstart', blockIfNotOnText, true)
      document.removeEventListener('dblclick', blockIfNotOnText, true)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointerleave', hide)
    }
  }, [])

  return (
    <>
      <div
        ref={pingLayer}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[50] hidden overflow-hidden md:block"
      />

      <div
        ref={reticle}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[60] hidden md:block"
      >
        <span
          ref={ring}
          className="absolute top-1/2 left-1/2 block h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-signal/40"
        />
        <span className="relative block h-5 w-5">
          <span
            ref={armsH}
            className="absolute top-1/2 left-0 h-px w-full origin-center -translate-y-1/2 bg-signal/75"
          />
          <span
            ref={armsV}
            className="absolute top-0 left-1/2 h-full w-px origin-center -translate-x-1/2 bg-signal/75"
          />
          <span
            ref={dot}
            className="absolute top-1/2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal"
          />
        </span>
      </div>
    </>
  )
}
