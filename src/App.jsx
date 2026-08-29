import { useEffect, useRef } from 'react'
import { ReactLenis } from 'lenis/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

import {
  bootSequence,
  countUpMetrics,
  finePointer,
  initNavPulse,
  initPanelHover,
  reducedMotion,
  revealOnScroll,
} from './motion'
import { projects, skills } from './content'
import Hero from './components/Hero'
import Nav from './components/Nav'
import ProjectRow from './components/ProjectRow'
import HudCursor from './components/HudCursor'
import HudField from './components/HudField'
import Section from './components/Section'

function Smooth({ children }) {
  const lenisRef = useRef(null)

  useEffect(() => {
    const raf = (time) => {
      lenisRef.current?.lenis?.raf(time * 1000)
      ScrollTrigger.update()
    }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => gsap.ticker.remove(raf)
  }, [])

  return (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false }}>
      {children}
    </ReactLenis>
  )
}

function Page() {
  const root = useRef(null)

  useGSAP(
    () => {
      if (reducedMotion) return

      const scope = root.current
      bootSequence(scope)
      revealOnScroll(scope, '[data-reveal]')
      countUpMetrics(scope)
      initNavPulse(scope)
      initPanelHover(scope)

      document.fonts?.ready.then(() => ScrollTrigger.refresh())
    },
    { scope: root },
  )

  return (
    <div ref={root} className="relative z-10 mx-auto w-full max-w-[76rem] px-6 sm:px-10">
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:mt-3 focus:bg-ink focus:px-3 focus:py-2 focus:text-sm focus:text-void"
      >
        Skip to projects
      </a>

      <Nav />
      <Hero />

      <main>
        <Section
          id="work"
          title="Work"
          lede="Five projects, the most technically involved first. Each one carries the number I would be asked about in an interview, and the part that still does not hold up."
        >
          <ul className="divide-y divide-line">
            {projects.map((project) => (
              <li key={project.id} className="py-14 first:pt-0 last:pb-0 sm:py-16">
                <ProjectRow project={project} />
              </li>
            ))}
          </ul>
        </Section>

        <Section
          id="skills"
          title="Skills"
          lede="Ordered inside each group by what I would be comfortable being interviewed on with no warning."
        >
          <div data-reveal className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {skills.map((skill) => (
              <div key={skill.group}>
                <h3 className="text-[11px] tracking-[0.16em] text-ink-dim uppercase">{skill.group}</h3>
                <ul className="mt-4 space-y-2 text-[15px]">
                  {skill.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section id="about" title="About" lede="The short version.">
          <p data-reveal className="max-w-2xl text-[15px] leading-relaxed">
            I work on the part of machine learning that starts after the model works — evaluation,
            failure modes, and getting a system to explain itself to whoever has to sign their name
            under its output. I came in through backend engineering, which is why I would rather
            ship something small I can watch in production than something clever that I cannot. Away
            from work I storyboard short animated sequences, slowly and not especially well, and most
            of what I know about pacing came from that rather than from anything on this page.
          </p>
        </Section>

        <Section id="contact" title="Contact" lede="Email is the one I actually watch.">
          <div data-reveal className="max-w-2xl">
            <a
              href="mailto:hello@example.com"
              className="font-display text-[clamp(1.4rem,4.5vw,2.4rem)] font-bold text-ink underline decoration-line underline-offset-[0.18em] transition-colors hover:text-signal hover:decoration-signal"
            >
              hello@example.com
            </a>

            <p className="mt-8 text-[15px] leading-relaxed">
              Send a job description and I will tell you within a day whether I think I am the right
              fit for it, including the times I am not.
            </p>

            <p className="mt-6 flex gap-7 text-[11px] tracking-[0.16em] uppercase">
              <a href="#" className="text-ink-dim transition-colors hover:text-signal">
                GitHub
              </a>
              <a href="#" className="text-ink-dim transition-colors hover:text-signal">
                Writing
              </a>
            </p>
          </div>
        </Section>
      </main>

      <footer className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-line py-10 text-[11px] tracking-[0.16em] text-ink-dim uppercase">
        <span className="flex items-center gap-3">
          <span aria-hidden="true" className="flex items-center gap-[3px]">
            <span className="h-3 w-[2px] bg-signal" />
            <span className="h-3 w-[2px] bg-ink-dim" />
          </span>
          2026
        </span>
        <span>Rajdhani &amp; IBM Plex Sans</span>
      </footer>
    </div>
  )
}

export default function App() {
  if (reducedMotion) return <Page />

  return (
    <Smooth>
      {finePointer ? <HudField /> : null}
      <Page />
      {finePointer ? <HudCursor /> : null}
    </Smooth>
  )
}
