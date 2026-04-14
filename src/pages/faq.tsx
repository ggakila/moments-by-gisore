'use client'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Plus, ArrowUpRight } from 'lucide-react'
import Nav from '@/components/Nav'

const M: React.CSSProperties = { fontFamily: "'Manrope', system-ui, sans-serif" }
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const FAQS = [
  {
    category: 'Getting started',
    items: [
      { q: 'What is Moments?', a: 'Moments is an open source photo storage tool. You connect a hard drive or NAS to your machine, and Moments makes it accessible from any browser in the world. It turns your own hardware into cloud storage.' },
      { q: 'Is it free?', a: 'Completely free and open source. You can self-host it on your own machine today. In the future, we will offer managed cloud storage for those who do not want to self-host, but that is a paid service and not yet available.' },
      { q: 'Do I need an account?', a: 'For the gallery demo, no account is needed. For self-hosting, you set up your own authentication. For our managed cloud service, accounts will be required.' },
    ],
  },
  {
    category: 'How it works',
    items: [
      { q: 'How does it connect my drive to the internet?', a: 'You run Moments on the machine that has your drive connected. The app exposes your photo library through a web interface that you can access from any device, anywhere, using your unique URL.' },
      { q: 'Can I upload from my phone?', a: 'Yes. Open Moments in your phone browser and upload directly. The photos go straight to your connected drive, no middleman, no third-party servers.' },
      { q: 'What happens when my computer is off?', a: 'Your gallery is only accessible when the machine running Moments is online. For 24/7 access, you can deploy it on a VPS using our upcoming npm package.' },
    ],
  },
  {
    category: 'Self-hosting',
    items: [
      { q: 'How do I self-host?', a: 'Currently you clone the repository and run it locally with Node.js. Coming soon, an npm package will let you deploy with a single command on any VPS provider.' },
      { q: 'What are the system requirements?', a: 'Node.js 18 or later, and enough storage for your photos. That is it. Runs on a Raspberry Pi, an old laptop, or a dedicated server.' },
      { q: 'Can I use my own domain?', a: 'Yes. When self-hosting, you point your domain to your server. When using our managed cloud, you will get a custom subdomain or can bring your own.' },
    ],
  },
  {
    category: 'Storage and privacy',
    items: [
      { q: 'Where are my photos stored?', a: 'Wherever you choose. On a local hard drive, a NAS, or a cloud server you control. Moments never touches your files, it just indexes and serves them.' },
      { q: 'Do you see or use my photos?', a: 'No. When self-hosting, nothing leaves your machine. When using our managed cloud, your data is encrypted at rest and we never access, sell, or train on your content.' },
      { q: 'Is there a file size limit?', a: 'No hard limit when self-hosting. For the managed cloud, limits will depend on your plan.' },
    ],
  },
]

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: EASE }}>
      {children}
    </motion.div>
  )
}

function AccordionItem({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(false)
  return (
    <FadeIn delay={i * 0.04}>
      <div style={{ borderBottom: '1px solid var(--border)' }}>
        <button data-cursor onClick={() => setOpen(v => !v)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '24px 0', textAlign: 'left', gap: 24, cursor: 'none', border: 'none', background: 'none',
          }}>
          <span style={{ ...M, fontSize: 14, fontWeight: open ? 500 : 400, lineHeight: 1.5, color: open ? 'var(--text)' : 'var(--muted)', transition: 'color 0.2s', letterSpacing: '-0.01em' }}>
            {q}
          </span>
          <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.22 }}
            style={{ flexShrink: 0, color: open ? 'var(--accent)' : 'var(--muted)', transition: 'color 0.2s', display: 'flex' }}>
            <Plus size={16} />
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              style={{ overflow: 'hidden' }}>
              <p style={{ ...M, fontSize: 13, lineHeight: 1.85, color: 'var(--muted)', paddingBottom: 24, maxWidth: '42rem' }}>{a}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FadeIn>
  )
}

function FluidBg() {
  const o1 = useRef<HTMLDivElement>(null)
  const o2 = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const orbs = [o1.current, o2.current]
    import('gsap').then(({ default: gsap }) => {
      orbs.forEach((orb, i) => {
        if (!orb) return
        gsap.to(orb, { x: 'random(-40, 40)', y: 'random(-30, 30)', duration: 10 + i * 3, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 1.5 })
      })
    })
  }, [])
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <div ref={o1} style={{ position: 'absolute', top: '10%', right: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(107,122,247,0.12) 0%, transparent 70%)', filter: 'blur(60px)', willChange: 'transform' }} />
      <div ref={o2} style={{ position: 'absolute', bottom: '20%', left: '-8%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,200,100,0.1) 0%, transparent 70%)', filter: 'blur(50px)', willChange: 'transform' }} />
    </div>
  )
}

export default function FAQ() {
  useEffect(() => {
    document.body.classList.add('page-scroll')
    return () => document.body.classList.remove('page-scroll')
  }, [])

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      <Nav />
      <FluidBg />

      {/* hero */}
      <section style={{ padding: '140px 24px 80px', position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto' }}>
        <FadeIn>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <span style={{ width: 20, height: 1, background: 'var(--muted)', display: 'inline-block' }} />
            <span style={{ ...M, fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>Help centre</span>
          </div>
        </FadeIn>
        <div style={{ overflow: 'hidden', marginBottom: 4 }}>
          <motion.h1 initial={{ y: '100%' }} animate={{ y: '0%' }}
            transition={{ duration: 1, delay: 0.2, ease: EASE }}
            style={{ ...M, fontWeight: 600, fontSize: 'clamp(3rem, 8vw, 7rem)', lineHeight: 1, letterSpacing: '-0.03em', margin: 0 }}>
            Questions,
          </motion.h1>
        </div>
        <div style={{ overflow: 'hidden' }}>
          <motion.h1 initial={{ y: '100%' }} animate={{ y: '0%' }}
            transition={{ duration: 1, delay: 0.3, ease: EASE }}
            style={{ ...M, fontWeight: 600, fontSize: 'clamp(3rem, 8vw, 7rem)', lineHeight: 1, letterSpacing: '-0.03em', color: 'var(--muted)', margin: 0 }}>
            answered.
          </motion.h1>
        </div>
        <FadeIn delay={0.5}>
          <p style={{ ...M, fontSize: 14, lineHeight: 1.7, color: 'var(--muted)', maxWidth: 380, marginTop: 28 }}>
            Everything you need to know about self-hosting, storage, and how Moments connects your drives to the cloud.
          </p>
        </FadeIn>
      </section>

      {/* faq sections */}
      <section style={{ padding: '0 24px 80px', maxWidth: 720, margin: '0 auto' }}>
        {FAQS.map(({ category, items }, ci) => (
          <div key={category} style={{ marginBottom: 48 }}>
            <FadeIn>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 0', borderTop: '1px solid var(--border)' }}>
                <span style={{ ...M, fontSize: 9, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                  {String(ci + 1).padStart(2, '0')}
                </span>
                <span style={{ ...M, fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                  {category}
                </span>
              </div>
            </FadeIn>
            {items.map((item, ii) => (
              <AccordionItem key={item.q} q={item.q} a={item.a} i={ii} />
            ))}
          </div>
        ))}
      </section>

      {/* still have questions */}
      <section style={{ padding: '60px 24px 80px', borderTop: '1px solid var(--border)', position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 40, maxWidth: 720 }}>
          <FadeIn>
            <div>
              <h2 style={{ ...M, fontWeight: 600, fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.1, letterSpacing: '-0.03em', margin: '0 0 16px' }}>
                Still have questions?
              </h2>
              <p style={{ ...M, fontSize: 14, lineHeight: 1.7, color: 'var(--muted)', marginBottom: 28 }}>
                Open source means open conversations. File an issue, start a discussion, or reach out directly.
              </p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <a href="https://github.com/gisore/moments/issues" target="_blank" rel="noopener noreferrer" data-cursor
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '10px 20px', borderRadius: 8,
                    border: '1px solid var(--border)', background: 'transparent',
                    color: 'var(--text)', cursor: 'none',
                    ...M, fontSize: 12, fontWeight: 500, letterSpacing: '-0.01em',
                    textDecoration: 'none', transition: 'all 0.25s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface)' ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border)' }}>
                  GitHub Issues <ArrowUpRight size={13} />
                </a>
                <a href="mailto:hello@momentsbygisore.com" data-cursor
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '10px 20px', borderRadius: 8,
                    border: '1px solid var(--accent)', background: 'var(--accent)',
                    color: '#fff', cursor: 'none',
                    ...M, fontSize: 12, fontWeight: 500, letterSpacing: '-0.01em',
                    textDecoration: 'none', transition: 'all 0.25s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' ;(e.currentTarget as HTMLElement).style.color = 'var(--accent)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--accent)' ;(e.currentTarget as HTMLElement).style.color = '#fff' }}>
                  Email us <ArrowUpRight size={13} />
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* footer */}
      <footer style={{ padding: '24px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <span style={{ ...M, fontWeight: 600, fontSize: 14, letterSpacing: '-0.02em' }}>Moments</span>
          <div style={{ display: 'flex', gap: 24 }}>
            {[{ href: '/gallery', l: 'Gallery' }, { href: '/faq', l: 'FAQ' }, { href: 'https://github.com/gisore/moments', l: 'GitHub' }].map(({ href, l }) => (
              <Link key={l} href={href} data-cursor
                style={{ ...M, fontSize: 12, color: 'var(--muted)', textDecoration: 'none', cursor: 'none', transition: 'color 0.18s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
                {l}
              </Link>
            ))}
          </div>
          <span style={{ ...M, fontSize: 11, color: 'var(--muted)' }}>Moments by Gisore, {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  )
}
