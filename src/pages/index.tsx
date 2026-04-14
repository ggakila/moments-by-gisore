'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import gsap from 'gsap'
import AccentBtn from '@/components/ui/AccentBtn'
import Nav from '@/components/Nav'

const M: React.CSSProperties = { fontFamily: "'Manrope', system-ui, sans-serif" }
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const CARDS = [
  { src: '/imagezz/sculpture.jpg', rotate: -20, x: -300, y: 22 },
  { src: '/imagezz/africa.jpg',    rotate: -11, x: -175, y: 4  },
  { src: '/imagezz/children.jpg',  rotate: -4,  x: -58,  y: -6 },
  { src: '/imagezz/developer.jpg', rotate:  3,  x:  58,  y: -6 },
  { src: '/imagezz/nairobi.jpg',   rotate:  11, x: 175,  y: 4  },
  { src: '/imagezz/cityscape.jpg', rotate:  18, x: 295,  y: 22 },
  { src: '/imagezz/woman.jpg',     rotate:  25, x: 408,  y: 46 },
]

function FadeIn({ children, delay = 0, y = 16 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

/* section reveal — clips content up as it enters viewport */
function SectionReveal({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  )
}

function Line() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div ref={ref} style={{ width: '100%', height: 1, background: 'var(--border)' }}
      initial={{ scaleX: 0, originX: 0 }}
      animate={inView ? { scaleX: 1 } : {}}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }} />
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
      <span style={{ width: 20, height: 1, background: 'var(--muted)', display: 'inline-block' }} />
      <span style={{ ...M, fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>{children}</span>
    </div>
  )
}

function FluidBg() {
  const o1 = useRef<HTMLDivElement>(null)
  const o2 = useRef<HTMLDivElement>(null)
  const o3 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const orbs = [o1.current, o2.current, o3.current]
    orbs.forEach((orb, i) => {
      if (!orb) return
      gsap.to(orb, { x: 'random(-60, 60)', y: 'random(-50, 50)', duration: 8 + i * 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 1.2 })
    })
  }, [])

  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <div ref={o1} style={{ position: 'absolute', top: '-10%', left: '-5%', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,200,100,0.18) 0%, transparent 70%)', filter: 'blur(60px)', willChange: 'transform' }} />
      <div ref={o2} style={{ position: 'absolute', bottom: '-15%', right: '-8%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(100,160,255,0.15) 0%, transparent 70%)', filter: 'blur(70px)', willChange: 'transform' }} />
      <div ref={o3} style={{ position: 'absolute', top: '30%', right: '10%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(220,130,200,0.12) 0%, transparent 70%)', filter: 'blur(55px)', willChange: 'transform' }} />
    </div>
  )
}

/* Entry directions — each card flies in from a different angle */
const ENTRY = [
  { fromX: -280, fromY:  80, fromR: -30 }, // far left, below
  { fromX: -160, fromY: -100, fromR: -15 }, // left, above
  { fromX:  -60, fromY:  120, fromR:  -8 }, // near left, below
  { fromX:    0, fromY: -140, fromR:   0 }, // center, above (hero card)
  { fromX:   60, fromY:  120, fromR:   8 }, // near right, below
  { fromX:  160, fromY: -100, fromR:  15 }, // right, above
  { fromX:  280, fromY:   80, fromR:  30 }, // far right, below
]

function FanCards() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[]
    if (!cards.length) return

    const tl = gsap.timeline({ delay: 4.4 })

    // Phase 1 — cards fly in from different directions, all converge to center stack
    // Start each card at its entry position, invisible
    cards.forEach((card, i) => {
      gsap.set(card, {
        x: ENTRY[i].fromX,
        y: ENTRY[i].fromY,
        rotation: ENTRY[i].fromR,
        opacity: 0,
        scale: 0.88,
      })
    })

    // Stagger fly-in to center (stacked)
    tl.to(cards, {
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 1,
      scale: 1,
      duration: 0.7,
      stagger: { each: 0.06, from: 'center' },
      ease: 'expo.out',
    })

    // Phase 2 — brief pause while stacked (0.18s)
    tl.to({}, { duration: 0.18 })

    // Phase 3 — spread out to final fan positions
    tl.to(cards, {
      x: (i) => CARDS[i].x - 66,
      y: (i) => CARDS[i].y,
      rotation: (i) => CARDS[i].rotate,
      duration: 1.1,
      stagger: { each: 0.045, from: 'center' },
      ease: 'expo.out',
    })

    return () => { tl.kill() }
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {CARDS.map((card, i) => (
        <div key={i} ref={el => { cardRefs.current[i] = el }}
          style={{
            position: 'absolute', left: '50%',
            width: 132, height: 172, borderRadius: 5, overflow: 'hidden',
            zIndex: i === 3 ? 7 : i < 3 ? i + 1 : 7 - i,
            boxShadow: '0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)',
            pointerEvents: 'none', transformOrigin: 'bottom center', willChange: 'transform',
          }}>
          <img src={card.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      ))}
    </div>
  )
}

/* ── sine marquee rows ── */
const MARQUEE_IMGS_A = [
  '/imagezz/developer.jpg',
  '/imagezz/woman.jpg',
  '/imagezz/africa.jpg',
  '/imagezz/children.jpg',
  '/imagezz/nairobi.jpg',
  '/imagezz/cityscape.jpg',
  '/imagezz/sculpture.jpg',
]
const MARQUEE_IMGS_B = [...MARQUEE_IMGS_A].reverse()

function SineRow({ imgs, speed, flip }: { imgs: string[]; speed: number; flip: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const xOff = useRef(0)
  const CARD = 100
  const GAP = 10
  const STEP = CARD + GAP
  const AMP = 40  // subtle vertical arc

  useEffect(() => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return

    const cards = Array.from(track.children) as HTMLElement[]
    const total = cards.length
    const totalW = total * STEP

    const tick = gsap.ticker.add(() => {
      xOff.current += speed
      if (xOff.current > 0) xOff.current -= totalW / 2
      if (xOff.current < -totalW / 2) xOff.current += totalW / 2

      const cw = container.offsetWidth

      cards.forEach((card, i) => {
        const absX = i * STEP + xOff.current
        // normalize position across viewport: -1 (left) to 1 (right)
        const norm = ((absX + CARD / 2) / cw) * 2 - 1
        // cosine curve: peaks at center (norm=0), dips at edges
        const sinY = Math.cos(norm * Math.PI * 0.8) * AMP * (flip ? 1 : -1)
        const rot = norm * 3 * (flip ? 1 : -1)
        gsap.set(card, { x: absX, y: sinY, rotation: rot })
      })

      gsap.set(track, { x: 0 })
    })

    return () => gsap.ticker.remove(tick)
  }, [speed, flip])

  const all = [...imgs, ...imgs, ...imgs, ...imgs]

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: CARD + AMP * 2 + 16, overflow: 'hidden', alignSelf: 'stretch' }}>
      <div ref={trackRef} style={{ position: 'absolute', top: AMP + 8, left: 0, width: '100%' }}>
        {all.map((src, i) => (
          <div key={i} style={{
            position: 'absolute', width: CARD, height: CARD,
            borderRadius: 10, overflow: 'hidden',
            boxShadow: '0 4px 14px rgba(0,0,0,0.09)',
            willChange: 'transform',
          }}>
            <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Home({ loaded = false }: { loaded?: boolean }) {
  useEffect(() => {
    document.body.classList.add('page-scroll')
    let lenis: InstanceType<typeof import('lenis').default> | null = null
    import('lenis').then(mod => {
      const Lenis = mod.default
      lenis = new Lenis({ duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
      const raf = (time: number) => { lenis && lenis.raf(time); requestAnimationFrame(raf) }
      requestAnimationFrame(raf)
    })
    return () => { document.body.classList.remove('page-scroll'); lenis && lenis.destroy() }
  }, [])

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <Nav />

      {/* ── 01 HERO — 100vh ── */}
      <section style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px', position: 'relative', overflow: 'hidden' }}>
        <FluidBg />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>

          {/* eyebrow — first in */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 3.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span style={{ width: 20, height: 1, background: 'var(--muted)', display: 'inline-block' }} />
            <span style={{ ...M, fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>Cloud storage for photographers</span>
            <span style={{ width: 20, height: 1, background: 'var(--muted)', display: 'inline-block' }} />
          </motion.div>

          {/* headline line 1 — clips up */}
          <div style={{ overflow: 'hidden', marginBottom: 4 }}>
            <motion.h1 initial={{ y: '110%' }} animate={{ y: '0%' }}
              transition={{ duration: 0.85, delay: 3.95, ease: [0.16, 1, 0.3, 1] }}
              style={{ ...M, fontWeight: 600, fontSize: 'clamp(2.2rem, 5.5vw, 5rem)', lineHeight: 1.08, letterSpacing: '-0.03em', color: 'var(--text)', margin: 0 }}>
              Turn any drive into
            </motion.h1>
          </div>

          {/* headline line 2 — clips up, slight delay */}
          <div style={{ overflow: 'hidden', marginBottom: 28 }}>
            <motion.h1 initial={{ y: '110%' }} animate={{ y: '0%' }}
              transition={{ duration: 0.85, delay: 4.1, ease: [0.16, 1, 0.3, 1] }}
              style={{ ...M, fontWeight: 600, fontSize: 'clamp(2.2rem, 5.5vw, 5rem)', lineHeight: 1.08, letterSpacing: '-0.03em', color: 'var(--muted)', margin: 0 }}>
              your personal cloud.
            </motion.h1>
          </div>

          {/* cards — animate after headline settles */}
          <motion.div style={{ width: '100%', maxWidth: 900 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.01, delay: 4.4 }}>
            <FanCards />
          </motion.div>

          {/* subtitle — fades in after cards start spreading */}
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 5.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ ...M, fontWeight: 400, fontSize: 14, lineHeight: 1.7, color: 'var(--muted)', maxWidth: 440, marginTop: 20, marginBottom: 28 }}>
            Connect your hard drive. Upload from any device. Access your photos from anywhere in the world. No monthly fees, no compression, your storage, your rules.
          </motion.p>

          {/* CTA — last in */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 5.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <AccentBtn href="/gallery" size="md">Open Gallery</AccentBtn>
            <a href="#about" data-cursor
              style={{ ...M, fontWeight: 400, fontSize: 13, color: 'var(--muted)', textDecoration: 'none', cursor: 'none', letterSpacing: '-0.01em', transition: 'color 0.18s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#5B6AF0' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)' }}>
              How it works ↓
            </a>
          </motion.div>
        </div>

        {/* bottom meta — very last */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 5.9 }}
          style={{ position: 'absolute', bottom: 24, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 32, paddingRight: 32, zIndex: 1 }}>
          <span style={{ ...M, fontSize: 11, fontWeight: 400, color: 'var(--muted)', letterSpacing: '0.04em' }}>Free &amp; open source · MIT License</span>
          <span style={{ ...M, fontSize: 11, fontWeight: 400, color: 'var(--muted)', letterSpacing: '0.04em' }}>Moments by Gisore, 2024</span>
        </motion.div>
      </section>

      {/* ── 02 MARQUEE ── */}
      <section style={{ background: 'var(--bg)', height: '120vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden', padding: '60px 0' }}>
        {/* row 1 */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', paddingBottom: 16 }}>
          <SineRow imgs={MARQUEE_IMGS_A} speed={-0.5} flip={false} />
        </div>

        {/* center text */}
        <div style={{ textAlign: 'center', padding: '40px 24px', flexShrink: 0 }}>
          <FadeIn>
            <h2 style={{ ...M, fontWeight: 600, fontSize: 'clamp(1.8rem, 4vw, 3.4rem)', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 12 }}>
              Your photos, your hardware,<br />your cloud.
            </h2>
          </FadeIn>
          <FadeIn delay={0.08}>
            <p style={{ ...M, fontWeight: 400, fontSize: 14, lineHeight: 1.7, color: 'var(--muted)', maxWidth: 380, margin: '0 auto' }}>
              Plug in a hard drive. Moments makes it accessible from any browser, anywhere in the world. No uploads to someone else's servers.
            </p>
          </FadeIn>
        </div>

        {/* row 2 — mirror */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', paddingTop: 16 }}>
          <SineRow imgs={MARQUEE_IMGS_B} speed={0.5} flip={true} />
        </div>
      </section>

      {/* ── 03 WHAT IT DOES ── */}
      <SectionReveal>
        <WhatItDoes />
      </SectionReveal>

      {/* ── 04 PHILOSOPHY ── */}
      <SectionReveal>
        <Philosophy />
      </SectionReveal>

      {/* ── 05 ROADMAP ── */}
      <SectionReveal>
        <Roadmap />
      </SectionReveal>

      {/* ── 06 CTA + FOOTER ── */}
      <SectionReveal>
        <CtaFooter />
      </SectionReveal>
    </div>
  )
}

/* ── WHAT IT DOES — professional grid ── */
function FeatureCard({ n, title, body, img, soon }: {
  n: string; title: string; body: string; img: string; soon?: boolean
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE }}
      style={{
        border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden',
        background: 'var(--surface)', display: 'flex', flexDirection: 'column',
      }}>
      <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4/3' }}>
        <img src={img} alt="" draggable={false}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.7s ease' }}
          onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)')}
          onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1)')} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%', background: 'linear-gradient(to top, var(--surface), transparent)' }} />
        <span style={{
          position: 'absolute', top: 16, left: 16,
          ...M, fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'var(--muted)', background: 'var(--bg)', padding: '4px 10px', borderRadius: 4,
          border: '1px solid var(--border)',
        }}>{n}</span>
        {soon && (
          <span style={{
            position: 'absolute', top: 16, right: 16,
            ...M, fontSize: 9, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--accent)', background: 'rgba(91,106,240,0.1)', padding: '4px 10px', borderRadius: 4,
          }}>Soon</span>
        )}
      </div>
      <div style={{ padding: '20px 24px 24px', flex: 1 }}>
        <h3 style={{ ...M, fontWeight: 600, fontSize: 15, letterSpacing: '-0.015em', lineHeight: 1.3, margin: '0 0 8px' }}>{title}</h3>
        <p style={{ ...M, fontWeight: 400, fontSize: 13, lineHeight: 1.75, color: 'var(--muted)', margin: 0 }}>{body}</p>
      </div>
    </motion.div>
  )
}

function WhatItDoes() {
  return (
    <section id="about" style={{ padding: '100px 48px', borderTop: '1px solid var(--border)' }}>
      <FadeIn>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ width: 20, height: 1, background: 'var(--muted)', display: 'inline-block' }} />
          <span style={{ ...M, fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>How it works</span>
        </div>
      </FadeIn>
      <FadeIn delay={0.1}>
        <h2 style={{ ...M, fontWeight: 600, fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: 1.1, letterSpacing: '-0.03em', margin: '0 0 48px', maxWidth: 480 }}>
          Your hardware becomes your cloud.
        </h2>
      </FadeIn>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        <FeatureCard
          n="01" title="Your own storage"
          body="Connect any drive, external SSD, NAS, or old laptop. Moments turns it into a cloud gallery you can reach from any browser, anywhere."
          img="/imagezz/developer.jpg"
        />
        <FeatureCard
          n="02" title="Upload from anywhere"
          body="On the road? Upload from your phone. At the studio? Drag and drop from your desktop. Everything lands on your drive, instantly synced."
          img="/imagezz/nairobi.jpg"
        />
        <FeatureCard
          n="03" title="Share without friction"
          body="Send a clean link to clients or friends. They see your photos at full quality. No account, no app, no watermarks. Just the work."
          img="/imagezz/woman.jpg"
        />
        <FeatureCard
          n="04" title="Self-host on a VPS"
          body="Coming soon. An npm package to deploy Moments on any server. One command, your own photo cloud, full control. No vendor lock-in."
          img="/imagezz/cityscape.jpg"
          soon
        />
      </div>
    </section>
  )
}

/* ── PHILOSOPHY ── */
function Philosophy() {
  return (
    <section style={{ padding: '100px 64px', borderTop: '1px solid var(--border)' }}>
      <FadeIn>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 56 }}>
          <span style={{ width: 20, height: 1, background: 'var(--muted)', display: 'inline-block' }} />
          <span style={{ ...M, fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>Philosophy</span>
        </div>
      </FadeIn>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
        <FadeIn delay={0.05}>
          <h2 style={{ ...M, fontWeight: 600, fontSize: 'clamp(1.8rem, 3.5vw, 3.2rem)', lineHeight: 1.12, letterSpacing: '-0.03em', margin: 0 }}>
            Your photos deserve<br />
            <span style={{ color: 'var(--muted)' }}>a home, not a feed.</span>
          </h2>
        </FadeIn>
        <div>
          <FadeIn delay={0.1}>
            <p style={{ ...M, fontWeight: 400, fontSize: 15, lineHeight: 1.85, color: 'var(--muted)', marginBottom: 20 }}>
              You already own the storage. Hard drives, SSDs, a NAS in your closet. Moments connects them to the internet. Plug in a drive, open the app, and your photos are accessible from any browser, anywhere in the world.
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p style={{ ...M, fontWeight: 400, fontSize: 15, lineHeight: 1.85, color: 'var(--muted)' }}>
              No algorithms ranking your work. No ads between your shots. No compression. No monthly subscription. Open source and free to self-host. You pay nothing until you want our managed cloud infrastructure.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

/* ── ROADMAP ── */
function Roadmap() {
  const items = [
    { n: '01', title: 'NPM self-hosting package', body: 'Deploy Moments on any VPS with a single command. Your server, your gallery, full data sovereignty.' },
    { n: '02', title: 'Managed cloud storage',    body: 'Need storage from us? We will offer affordable cloud plans. Upload directly, no self-hosting required.' },
    { n: '03', title: 'Client portals',            body: 'Dedicated spaces for clients to view, download, and comment on their photo galleries.' },
  ]
  return (
    <section style={{ padding: '0 64px 100px', borderTop: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '64px 0 48px' }}>
        <FadeIn>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 20, height: 1, background: 'var(--muted)', display: 'inline-block' }} />
            <span style={{ ...M, fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>On the roadmap</span>
          </div>
        </FadeIn>
        <FadeIn delay={0.05}>
          <span style={{ ...M, fontSize: 11, fontWeight: 400, color: 'var(--muted)' }}>Coming soon</span>
        </FadeIn>
      </div>
      <div>
        {items.map(({ n, title, body }, i) => (
          <FadeIn key={n} delay={i * 0.05}>
            <div style={{ display: 'grid', gridTemplateColumns: '64px 1fr 1fr', gap: 40, padding: '28px 0', borderTop: '1px solid var(--border)', alignItems: 'start' }}>
              <span style={{ ...M, fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', paddingTop: 2 }}>{n}</span>
              <h3 style={{ ...M, fontWeight: 500, fontSize: 15, letterSpacing: '-0.01em', margin: 0 }}>{title}</h3>
              <p style={{ ...M, fontWeight: 400, fontSize: 14, lineHeight: 1.75, color: 'var(--muted)', margin: 0 }}>{body}</p>
            </div>
          </FadeIn>
        ))}
        <div style={{ borderTop: '1px solid var(--border)' }} />
      </div>
    </section>
  )
}

/* ── CTA + FOOTER ── */
function CtaFooter() {
  const year = new Date().getFullYear()
  return (
    <section style={{ borderTop: '1px solid var(--border)' }}>

      {/* CTA row */}
      <div style={{ padding: '100px 64px 80px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 560 }}>
          <FadeIn>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
              <span style={{ width: 20, height: 1, background: 'var(--muted)', display: 'inline-block' }} />
              <span style={{ ...M, fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>Get started</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.06}>
            <h2 style={{ ...M, fontWeight: 600, fontSize: 'clamp(2.4rem, 5.5vw, 5.5rem)', lineHeight: 1.0, letterSpacing: '-0.04em', margin: '0 0 20px' }}>
              Your gallery<br />
              <span style={{ color: 'var(--muted)' }}>is waiting.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.12}>
            <p style={{ ...M, fontWeight: 400, fontSize: 15, lineHeight: 1.7, color: 'var(--muted)', margin: 0, maxWidth: 380 }}>
              Free to use. No account needed. Upload your first photo in under a minute.
            </p>
          </FadeIn>
        </div>
        <FadeIn delay={0.18}>
          <AccentBtn href="/gallery" size="lg">Open Gallery</AccentBtn>
        </FadeIn>
      </div>

      {/* footer grid */}
      <div style={{ padding: '56px 64px 0', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, borderBottom: '1px solid var(--border)', paddingBottom: 56 }}>
        {/* brand col */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 22, height: 22, borderRadius: 4, background: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <rect x="1" y="1" width="3" height="3" rx="0.6" fill="var(--bg)" />
                <rect x="6" y="1" width="3" height="3" rx="0.6" fill="var(--bg)" opacity="0.55" />
                <rect x="1" y="6" width="3" height="3" rx="0.6" fill="var(--bg)" opacity="0.55" />
                <rect x="6" y="6" width="3" height="3" rx="0.6" fill="var(--bg)" opacity="0.25" />
              </svg>
            </div>
            <span style={{ ...M, fontWeight: 600, fontSize: 14, letterSpacing: '-0.02em' }}>Moments</span>
          </div>
          <p style={{ ...M, fontWeight: 400, fontSize: 13, lineHeight: 1.75, color: 'var(--muted)', maxWidth: 240 }}>
            A private gallery for photographers who care about craft. Store, share, remember.
          </p>
        </div>

        {/* link cols */}
        {[
          { heading: 'Product', links: [{ l: 'Gallery', href: '/gallery' }, { l: 'Features', href: '/#about' }, { l: 'Pricing', href: '/#about' }, { l: 'Roadmap', href: '/#about' }] },
          { heading: 'Company', links: [{ l: 'About', href: '/about' }, { l: 'FAQ', href: '/faq' }, { l: 'Blog', href: '/' }] },
          { heading: 'Connect',  links: [{ l: 'Twitter', href: '/' }, { l: 'Instagram', href: '/' }, { l: 'GitHub', href: '/' }] },
        ].map(({ heading, links }) => (
          <div key={heading}>
            <p style={{ ...M, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 20 }}>{heading}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {links.map(({ l, href }) => (
                <Link key={l} href={href} data-cursor
                  style={{ ...M, fontWeight: 400, fontSize: 13, color: 'var(--muted)', textDecoration: 'none', cursor: 'none', transition: 'color 0.18s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
                  {l}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* bottom bar */}
      <div style={{ padding: '20px 64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ ...M, fontWeight: 400, fontSize: 12, color: 'var(--muted)' }}>© {year} Moments by Gisore. All rights reserved.</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#5B6AF0', display: 'inline-block' }} />
          <span style={{ ...M, fontWeight: 400, fontSize: 12, color: 'var(--muted)' }}>Nairobi, Kenya</span>
        </div>
      </div>
    </section>
  )
}
