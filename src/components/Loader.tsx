'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'

const FONTS = [
  { family: "'Cormorant Garamond', Georgia, serif",  style: 'italic',  weight: 300 },
  { family: "'Dancing Script', cursive",              style: 'normal',  weight: 700 },
  { family: "'Playfair Display', Georgia, serif",     style: 'italic',  weight: 400 },
  { family: "'Space Grotesk', system-ui, sans-serif", style: 'normal',  weight: 300 },
  { family: "'Cormorant Garamond', Georgia, serif",   style: 'normal',  weight: 300 },
  { family: "'Dancing Script', cursive",              style: 'normal',  weight: 400 },
  { family: "'Manrope', system-ui, sans-serif",       style: 'normal',  weight: 300 },
  { family: "'Playfair Display', Georgia, serif",     style: 'normal',  weight: 400 },
]

const IMAGES = [
  '/imagezz/developer.jpg',
  '/imagezz/woman.jpg',
  '/imagezz/africa.jpg',
  '/imagezz/children.jpg',
  '/imagezz/nairobi.jpg',
  '/imagezz/cityscape.jpg',
  '/imagezz/sculpture.jpg',
]

const FLOATS = [
  { top: '8%',  left: '4%',   w: 140, h: 180, rot: -8  },
  { top: '12%', right: '6%',  w: 110, h: 145, rot:  6  },
  { top: '55%', left: '2%',   w: 90,  h: 120, rot: -5  },
  { top: '60%', right: '4%',  w: 130, h: 170, rot:  9  },
  { top: '30%', left: '18%',  w: 80,  h: 105, rot: -12 },
  { top: '35%', right: '16%', w: 95,  h: 125, rot:  7  },
  { top: '72%', left: '38%',  w: 70,  h: 92,  rot: -4  },
]

export default function Loader({ onDone }: { onDone: () => void }) {
  const [exiting, setExiting] = useState(false)
  const textRef = useRef<HTMLSpanElement>(null)
  const imgRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const el = textRef.current
    if (!el) return

    let idx = 0
    const INTERVAL = 74 // ~27 shuffles in 2s

    const cycle = setInterval(() => {
      idx = (idx + 1) % FONTS.length
      const f = FONTS[idx]
      // crossfade: blur out → swap font → blur in, all in one smooth tween
      gsap.to(el, {
        opacity: 0,
        filter: 'blur(6px)',
        y: -4,
        duration: INTERVAL * 0.0004,
        ease: 'power1.in',
        onComplete: () => {
          el.style.fontFamily = f.family
          el.style.fontStyle = f.style
          el.style.fontWeight = String(f.weight)
          gsap.fromTo(el,
            { opacity: 0, filter: 'blur(6px)', y: 4 },
            { opacity: 1, filter: 'blur(0px)', y: 0, duration: INTERVAL * 0.0005, ease: 'power1.out' }
          )
        },
      })
    }, INTERVAL)

    /* float images */
    imgRefs.current.forEach((imgEl, i) => {
      if (!imgEl) return
      gsap.to(imgEl, {
        y: 'random(-18, 18)', x: 'random(-10, 10)', rotation: 'random(-6, 6)',
        duration: 2.5 + i * 0.4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.2,
      })
    })

    /* exit after 2.2s */
    const exitTimer = setTimeout(() => {
      clearInterval(cycle)
      // settle on final font (Manrope)
      gsap.to(el, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.2 })
      setExiting(true)
      setTimeout(onDone, 750)
    }, 2200)

    return () => { clearInterval(cycle); clearTimeout(exitTimer) }
  }, [onDone])

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9000,
            background: '#0a0a0a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* floating images */}
          {FLOATS.map((f, i) => (
            <div key={i} ref={el => { imgRefs.current[i] = el }}
              style={{
                position: 'absolute',
                top: f.top,
                left: 'left' in f ? (f as any).left : undefined,
                right: 'right' in f ? (f as any).right : undefined,
                width: f.w, height: f.h,
                borderRadius: 8, overflow: 'hidden',
                transform: `rotate(${f.rot}deg)`,
                opacity: 0.2, willChange: 'transform',
              }}>
              <img src={IMAGES[i % IMAGES.length]} alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          ))}

          {/* text */}
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <span
              ref={textRef}
              style={{
                display: 'block',
                fontFamily: FONTS[0].family,
                fontStyle: FONTS[0].style,
                fontWeight: FONTS[0].weight,
                fontSize: 'clamp(1.2rem, 3vw, 2.6rem)',
                color: '#fff',
                letterSpacing: '-0.01em',
                lineHeight: 1,
                whiteSpace: 'nowrap',
                willChange: 'filter, opacity, transform',
              }}
            >
              Moments
            </span>
          </div>

          {/* progress line */}
          <motion.div
            style={{ position: 'absolute', bottom: 0, left: 0, height: 2, background: '#5B6AF0' }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.0, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
