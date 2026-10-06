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
    <div ref={root} className="relative z-10 mx-auto w-full max-w-304 px-6 sm:px-10">
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
          lede="Selected builds from my full-stack and product work — mostly product-facing systems that had to be useful, reliable, and easy to trust in real operations."
        >
          <ul className="divide-y-2 divide-line">
            {projects.map((project) => (
              <li key={project.id} className="py-16 first:pt-0 last:pb-0 sm:py-20">
                <ProjectRow project={project} />
              </li>
            ))}
          </ul>
        </Section>

        <Section
          id="skills"
          title="Skills"
          lede="The stack I use most often when turning product requirements into working systems: frontend, APIs, data, and delivery."
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
            I build digital products, internal tools, and the systems that support them. My work sits between product thinking and implementation: I care about interfaces people can use without friction, APIs teams can maintain, and workflows that make sense to the people using them.
          </p>
          <p data-reveal className="mt-5 max-w-2xl text-[15px] leading-relaxed">
            I am pursuing an M.Sc. in Web &amp; Data Science at Universität Koblenz and completed my B.Sc. in Computer Science at the University of Central Punjab. I have worked on production applications serving 15k+ users, built multiple full-stack products end-to-end, and continue to look for work where strong engineering and clear product judgment matter equally.
          </p>
        </Section>

        <Section id="contact" title="Contact" lede="Happy to talk about product or engineering work.">
          <div data-reveal className="grid gap-10 md:grid-cols-[minmax(0,1fr)_14rem] md:items-center">
            <div>
              <a
                href="mailto:aliyanrizwandev@gmail.com"
                className="font-display text-[clamp(1.4rem,4.5vw,2.4rem)] font-bold text-ink underline decoration-line underline-offset-[0.18em] transition-colors hover:text-signal hover:decoration-signal"
              >
                aliyanrizwandev@gmail.com
              </a>

              <p className="mt-6 text-[15px] leading-relaxed">Koblenz, Germany • +49 160 4236589.</p>

              <p className="mt-8 flex flex-wrap gap-7 text-[11px] tracking-[0.16em] uppercase">
                <a href="https://github.com/AliyanRizwanDev" target="_blank" rel="noreferrer" className="text-ink-dim transition-colors hover:text-signal">
                  GitHub
                </a>
                <a href="https://www.linkedin.com/in/aliyan-rizwan-dev/" target="_blank" rel="noreferrer" className="text-ink-dim transition-colors hover:text-signal">
                  LinkedIn
                </a>
              </p>
            </div>

            <img
              src="/profile/mohammad-aliyan.jpg"
              alt="Mohammad Aliyan"
              className="h-56 w-56 justify-self-start rounded-sm border border-line object-cover object-center md:justify-self-end"
              loading="lazy"
            />
          </div>
        </Section>
      </main>

      <footer className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-line py-10 text-[11px] tracking-[0.16em] text-ink-dim uppercase">
        <span className="flex items-center gap-3">
          <span aria-hidden="true" className="flex items-center gap-0.75">
            <span className="h-3 w-0.5 bg-signal" />
            <span className="h-3 w-0.5 bg-ink-dim" />
          </span>
          2026
        </span>
        <span>Mohammad Aliyan</span>
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
