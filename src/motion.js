import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches

export const IMPACT = 'back.out(1.7)'

export function revealOnScroll(scope, selector) {
  const targets = scope.querySelectorAll(selector)
  if (!targets.length) return

  gsap.set(targets, { opacity: 0, y: 16 })
  ScrollTrigger.batch(targets, {
    start: 'top 85%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.32, ease: 'back.out(1.4)' }),
  })
}

/** HUD boot: brackets + rule snap on in ~300ms, hero text lands by 800ms. */
export function bootSequence(scope) {
  const q = gsap.utils.selector(scope)
  const t0 = performance.now()

  gsap.set(q('[data-headline], [data-bar], [data-sub]'), { opacity: 0 })
  gsap.set(q('[data-headline]'), { y: 20 })
  gsap.set(q('[data-bar]'), { scaleX: 0, transformOrigin: 'left center' })
  gsap.set(q('[data-sub]'), { y: 10 })
  gsap.set(q('[data-bracket]'), { opacity: 0, scale: 0.5 })
  gsap.set(q('[data-scanline]'), { scaleX: 0, transformOrigin: 'left center' })

  gsap
    .timeline({
      onComplete: () => {
        const ms = Math.round(performance.now() - t0)
        if (import.meta.env.DEV) console.info(`[boot] ${ms}ms`)
      },
    })
    .to(q('[data-bracket]'), { opacity: 1, scale: 1, duration: 0.1, ease: IMPACT, stagger: 0.04 }, 0)
    .to(q('[data-scanline]'), { scaleX: 1, duration: 0.14, ease: 'power3.out' }, 0.16)
    .to(q('[data-headline]'), { opacity: 1, y: 0, duration: 0.2, ease: IMPACT, stagger: 0.05 }, 0.32)
    .to(q('[data-bar]'), { opacity: 1, scaleX: 1, duration: 0.1, ease: IMPACT }, 0.54)
    .to(q('[data-sub]'), { opacity: 1, y: 0, duration: 0.14, ease: 'power2.out' }, 0.62)
}

export function parseScore(score) {
  if (score === 'ok') return null

  const signed = /^\+(\d+\.?\d*)$/.exec(score)
  if (signed) return { value: parseFloat(signed[1]), prefix: '+', decimals: 2 }

  const suffix = /^(\d+\.?\d*)(s)$/.exec(score)
  if (suffix) return { value: parseFloat(suffix[1]), suffix: suffix[2], decimals: 1 }

  const plain = /^(\d+\.?\d*)$/.exec(score)
  if (plain) {
    return { value: parseFloat(plain[1]), decimals: score.includes('.') ? score.split('.')[1].length : 0 }
  }

  return null
}

function formatMetric(value, parsed) {
  const { prefix = '', suffix = '', decimals = 2 } = parsed
  return `${prefix}${value.toFixed(decimals)}${suffix}`
}

/** One ScrollTrigger.batch for every metric on the page — not one trigger per row. */
export function countUpMetrics(scope) {
  const metrics = scope.querySelectorAll('[data-metric]')
  if (!metrics.length) return

  metrics.forEach((el) => {
    const parsed = JSON.parse(el.dataset.metric)
    el.textContent = formatMetric(0, parsed)
    const bar = el.closest('li')?.querySelector('[data-bar]')
    if (bar) gsap.set(bar, { scaleX: 0, transformOrigin: 'left center' })
  })

  ScrollTrigger.batch(metrics, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) => {
      batch.forEach((el) => {
        const parsed = JSON.parse(el.dataset.metric)
        const state = { val: 0 }
        gsap.to(state, {
          val: parsed.value,
          duration: 0.55,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = formatMetric(state.val, parsed)
          },
        })

        const bar = el.closest('li')?.querySelector('[data-bar]')
        if (bar) {
          const barVal = parseFloat(bar.dataset.barValue)
          gsap.to(bar, { scaleX: barVal, duration: 0.55, ease: 'power2.out' })
        }
      })
    },
  })
}

export function initNavPulse(scope) {
  const dot = scope.querySelector('[data-status-dot]')
  if (!dot) return

  gsap.to(dot, {
    opacity: 0.35,
    duration: 0.9,
    ease: 'power1.inOut',
    repeat: -1,
    yoyo: true,
  })
}

export function initPanelHover(scope) {
  scope.querySelectorAll('[data-panel]').forEach((panel) => {
    const brackets = panel.querySelectorAll('[data-panel-bracket]')
    const sweep = panel.querySelector('[data-scan-sweep]')

    panel.addEventListener('mouseenter', () => {
      gsap.to(brackets, { scale: 0.82, duration: 0.22, ease: IMPACT, overwrite: true })
      gsap.fromTo(
        sweep,
        { xPercent: -110, opacity: 0.7 },
        { xPercent: 110, opacity: 0, duration: 0.28, ease: 'power2.inOut' },
      )
    })

    panel.addEventListener('mouseleave', () => {
      gsap.to(brackets, { scale: 1, duration: 0.22, ease: 'power2.out', overwrite: true })
    })
  })
}
