'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Camera, Info, HelpCircle } from 'lucide-react'
import AccentBtn from '@/components/ui/AccentBtn'
import type { Variants } from 'framer-motion'

const SANS: React.CSSProperties = { fontFamily: "'Manrope', system-ui, sans-serif" }
const EASE_SLIDE: [number, number, number, number] = [0.76, 0, 0.24, 1]
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]

const LINKS = [
  { href: '/',        label: 'Home',    icon: <Home size={15} /> },
  { href: '/gallery', label: 'Gallery', icon: <Camera size={15} /> },
  { href: '/about',   label: 'About',   icon: <Info size={15} /> },
  { href: '/faq',     label: 'FAQ',     icon: <HelpCircle size={15} /> },
]

const sidebarVariants: Variants = {
  hidden: { x: '100%' },
  show:   { x: '0%', transition: { duration: 0.5, ease: EASE_SLIDE } },
  exit:   { x: '100%', transition: { duration: 0.4, ease: EASE_SLIDE } },
}

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.25 } },
  exit:   { opacity: 0, transition: { duration: 0.2 } },
}

function BrandIcon({ size = 26 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: Math.round(size * 0.2),
      background: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <svg width={Math.round(size * 0.46)} height={Math.round(size * 0.46)} viewBox="0 0 12 12" fill="none">
        <rect x="1.5" y="1.5" width="3.5" height="3.5" rx="0.8" fill="var(--bg)" />
        <rect x="7" y="1.5" width="3.5" height="3.5" rx="0.8" fill="var(--bg)" opacity="0.55" />
        <rect x="1.5" y="7" width="3.5" height="3.5" rx="0.8" fill="var(--bg)" opacity="0.55" />
        <rect x="7" y="7" width="3.5" height="3.5" rx="0.8" fill="var(--bg)" opacity="0.25" />
      </svg>
    </div>
  )
}

export default function Nav() {
  const { pathname } = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40,
          height: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingLeft: 20, paddingRight: 20,
          background: 'var(--nav-bg)',
          borderBottom: '1px solid var(--border)',
          backdropFilter: 'blur(20px) saturate(160%)',
          WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        }}
      >
        {/* LEFT — brand */}
        <Link href="/" data-cursor style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', cursor: 'none', flex: '0 0 auto' }}>
          <BrandIcon />
          <span style={{ ...SANS, fontWeight: 600, fontSize: 13, color: 'var(--text)', letterSpacing: '-0.02em' }}>Moments</span>
        </Link>

        {/* CENTER — desktop nav */}
        <div className="hidden md:flex items-center" style={{ gap: 4, flex: '1 1 auto', justifyContent: 'center' }}>
          {LINKS.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href} data-cursor
                style={{
                  ...SANS, fontWeight: 450, fontSize: 13,
                  color: active ? 'var(--accent)' : 'var(--muted)',
                  textDecoration: 'none', cursor: 'none',
                  padding: '6px 14px', borderRadius: 6,
                  background: active ? 'rgba(91,106,240,0.08)' : 'transparent',
                  transition: 'background 0.15s, color 0.15s',
                  letterSpacing: '-0.01em', whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--text)' }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--muted)' }}
              >
                {label}
              </Link>
            )
          })}
        </div>

        {/* RIGHT — desktop actions */}
        <div className="hidden md:flex items-center" style={{ gap: 10, flex: '0 0 auto', justifyContent: 'flex-end' }}>
          <button data-cursor aria-label="Account"
            style={{
              width: 32, height: 32, borderRadius: '50%',
              border: '1px solid var(--border)', background: 'var(--surface)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'none', flexShrink: 0,
            }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="5" r="2.5" stroke="var(--muted)" strokeWidth="1.2" />
              <path d="M2 12c0-2.2 2.2-4 5-4s5 1.8 5 4" stroke="var(--muted)" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
          <AccentBtn href="/gallery" size="sm">Get Started</AccentBtn>
        </div>

        {/* RIGHT — mobile burger */}
        <button className="md:hidden" data-cursor onClick={() => setMenuOpen(v => !v)}
          style={{ background: 'none', border: 'none', cursor: 'none', display: 'flex', flexDirection: 'column', gap: 5, padding: 6, marginLeft: 'auto' }} aria-label="Menu">
          <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6.5 : 0 }}
            transition={{ duration: 0.28, ease: EASE_SLIDE }}
            style={{ display: 'block', width: 20, height: 1.5, background: 'var(--text)', borderRadius: 2, transformOrigin: 'center' }} />
          <motion.span animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 1 }}
            transition={{ duration: 0.18 }}
            style={{ display: 'block', width: 14, height: 1.5, background: 'var(--text)', borderRadius: 2 }} />
          <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6.5 : 0 }}
            transition={{ duration: 0.28, ease: EASE_SLIDE }}
            style={{ display: 'block', width: 20, height: 1.5, background: 'var(--text)', borderRadius: 2, transformOrigin: 'center' }} />
        </button>
      </motion.nav>

      {/* ══ RIGHT SIDEBAR ══ */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div key="bd" variants={backdropVariants} initial="hidden" animate="show" exit="exit"
              onClick={() => setMenuOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 24, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)' }} />
            <motion.aside key="sb" variants={sidebarVariants} initial="hidden" animate="show" exit="exit"
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: 'clamp(260px, 70vw, 320px)', zIndex: 25,
                background: 'var(--bg)', display: 'flex', flexDirection: 'column',
                borderLeft: '1px solid var(--border)', overflow: 'hidden',
              }}>

              {/* header */}
              <div style={{
                flexShrink: 0, height: 50, display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', padding: '0 20px',
                borderBottom: '1px solid var(--border)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <BrandIcon size={24} />
                  <Link href="/" onClick={() => setMenuOpen(false)} data-cursor style={{
                    ...SANS, fontWeight: 600, fontSize: 14, color: 'var(--text)', letterSpacing: '-0.02em',
                    textDecoration: 'none', cursor: 'none',
                  }}>Moments</Link>
                </div>
                <button data-cursor onClick={() => setMenuOpen(false)}
                  style={{ ...SANS, fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'none' }}>
                  Close
                </button>
              </div>

              {/* navigation */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
                <div style={{ padding: '0 12px' }}>
                  <p style={{ ...SANS, fontSize: 9, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', padding: '4px 8px 8px', opacity: 0.6 }}>
                    Navigation
                  </p>
                  {LINKS.map(({ href, label, icon }) => {
                    const active = pathname === href
                    return (
                      <Link key={href} href={href} data-cursor onClick={() => setMenuOpen(false)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '9px 8px', borderRadius: 6, textDecoration: 'none', cursor: 'none',
                          color: 'var(--text)', transition: 'background 0.15s',
                          background: active ? 'var(--surface)' : 'transparent',
                        }}
                        onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--surface)' }}
                        onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                        <span style={{ color: active ? 'var(--accent)' : 'var(--muted)', display: 'flex' }}>{icon}</span>
                        <span style={{ ...SANS, fontSize: 13, fontWeight: active ? 600 : 400, letterSpacing: '-0.01em' }}>{label}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* footer */}
              <div style={{ flexShrink: 0, borderTop: '1px solid var(--border)', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ ...SANS, fontSize: 9, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>Est. 2024</span>
                <AccentBtn href="/gallery" size="sm">Get Started</AccentBtn>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
