import { useEffect, useRef } from 'react'
import { ReactLenis } from 'lenis/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

import {
  bootSequence,
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
          lede="A selection of web products and internal tools I've worked on."
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
          lede="Technologies and tools listed on my CV."
        >
          <div data-reveal className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
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

        <Section id="about" title="About" lede="A little about my background.">
          <p data-reveal className="max-w-2xl text-[15px] leading-relaxed">
            I'm a full-stack software engineer with 1.5+ years of experience. At Ragzon Solutions, I built 5+ applications that together served 15k+ monthly active users. I reduced page load time by 44% (3.2s to 1.8s) through API restructuring, lazy loading, and Redis caching.
          </p>
          <p data-reveal className="mt-5 max-w-2xl text-[15px] leading-relaxed">
            I completed my B.Sc. in Computer Science at the University of Central Punjab and am pursuing an M.Sc. in Web &amp; Data Science at Universität Koblenz.
          </p>
          <div data-reveal className="mt-12 grid gap-10 border-t border-line pt-8 sm:grid-cols-2">
            <div>
              <h3 className="text-[11px] tracking-[0.16em] text-ink-dim uppercase">Languages</h3>
              <ul className="mt-4 space-y-2 text-[15px]">
                <li>English: C1 (Fluent)</li>
                <li>German: A1 (Elementary)</li>
                <li>Urdu: Native</li>
              </ul>
            </div>
            <div>
              <h3 className="text-[11px] tracking-[0.16em] text-ink-dim uppercase">Publication</h3>
              <p className="mt-4 text-[15px] font-medium leading-relaxed">
                <a
                  href="https://doi.org/10.1109/INOCON60754.2024.10512150"
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-line underline-offset-4 transition-colors hover:text-signal hover:decoration-signal"
                >
                  Analysis and Performance Evaluation of Various Shortest Path Algorithms
                </a>
              </p>
              <p className="mt-2 text-sm text-ink-dim">Lead author · IEEE INOCON 2024</p>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-dim">
                The paper compares 8+ shortest-path algorithms on graphs with 10k+ nodes. I implemented the simulations and analyzed their performance.
              </p>
              <a
                href="https://doi.org/10.1109/INOCON60754.2024.10512150"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-xs text-ink-dim underline decoration-line underline-offset-4 transition-colors hover:text-signal hover:decoration-signal"
              >
                Read the paper (DOI)
              </a>
            </div>
          </div>
        </Section>

        <Section id="contact" title="Contact" lede="Get in touch about software engineering opportunities.">
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
                <a href="https://www.linkedin.com/in/aliyanrizwandev/" target="_blank" rel="noreferrer" className="text-ink-dim transition-colors hover:text-signal">
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
