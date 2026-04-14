'use client'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import type { Photo } from '@/types'

const SANS: React.CSSProperties = { fontFamily: "'Manrope', system-ui, sans-serif" }
const HEIGHTS = [200, 260, 320, 180, 300, 240, 280]
const MONTH_LABELS: Record<string, string> = {
  '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
  '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
  '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec',
}

function DragCursor({ visible, x, y }: { visible: boolean; x: number; y: number }) {
  return (
    <motion.div
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.6 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed', top: 0, left: 0, width: 88, height: 88, borderRadius: '50%',
        background: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none', zIndex: 999,
        transform: `translate(${x - 44}px, ${y - 44}px)`, willChange: 'transform',
      }}>
      <span style={{
        ...SANS, fontSize: 10, fontWeight: 600, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: 'var(--bg)', userSelect: 'none',
      }}>Drag</span>
    </motion.div>
  )
}

export default function HorizontalView({ photos, onSelect }: { photos: Photo[]; onSelect: (p: Photo) => void }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const xRef = useRef(0)
  const velRef = useRef(0)
  const dragging = useRef(false)
  const didDrag = useRef(false)
  const dragStartX = useRef(0)
  const dragStartOffset = useRef(0)
  const lastDragX = useRef(0)
  const halfWidth = useRef(0)
  const canScroll = useRef(false)
  const rafId = useRef<number>(0)
  const [cursorVisible, setCursorVisible] = useState(false)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const cursorTarget = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const measure = () => {
      if (trackRef.current && wrapRef.current) {
        const hw = trackRef.current.scrollWidth / 2
        halfWidth.current = hw
        canScroll.current = hw > wrapRef.current.clientWidth
        if (!canScroll.current) {
          xRef.current = 0
          velRef.current = 0
          gsap.set(trackRef.current, { x: 0 })
        }
      }
    }
    measure(); const t = setTimeout(measure, 120); return () => clearTimeout(t)
  }, [photos])

  useEffect(() => {
    const loop = () => {
      if (canScroll.current) {
        velRef.current *= 0.92
        if (Math.abs(velRef.current) < 0.05) velRef.current = 0
        xRef.current += velRef.current
        const hw = halfWidth.current
        if (hw > 0) {
          if (xRef.current <= -hw) xRef.current += hw
          if (xRef.current >= 0) xRef.current -= hw
        }
        gsap.set(trackRef.current, { x: xRef.current })
        const skew = velRef.current === 0 ? 0 : gsap.utils.clamp(-8, 8, velRef.current * 0.9)
        const scaleX = velRef.current === 0 ? 1 : 1 + Math.abs(skew) * 0.004
        trackRef.current?.querySelectorAll<HTMLElement>('.ph-img').forEach(el => {
          gsap.set(el, { skewX: skew, scaleX })
        })
      } else {
        trackRef.current?.querySelectorAll<HTMLElement>('.ph-img').forEach(el => {
          gsap.set(el, { skewX: 0, scaleX: 1 })
        })
      }
      rafId.current = requestAnimationFrame(loop)
    }
    rafId.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId.current)
  }, [photos])

  useEffect(() => {
    let raf: number
    const follow = () => {
      setCursorPos(prev => ({
        x: prev.x + (cursorTarget.current.x - prev.x) * 0.14,
        y: prev.y + (cursorTarget.current.y - prev.y) * 0.14,
      }))
      raf = requestAnimationFrame(follow)
    }
    raf = requestAnimationFrame(follow)
    return () => cancelAnimationFrame(raf)
  }, [])

  const onMouseDown = (e: React.MouseEvent) => {
    if (!canScroll.current) return
    dragging.current = true; didDrag.current = false
    dragStartX.current = e.clientX; dragStartOffset.current = xRef.current
    lastDragX.current = e.clientX; velRef.current = 0
  }
  const onMouseMove = (e: React.MouseEvent) => {
    cursorTarget.current = { x: e.clientX, y: e.clientY }
    if (!dragging.current || !canScroll.current) return
    const dx = e.clientX - dragStartX.current
    if (Math.abs(dx) > 3) didDrag.current = true
    velRef.current = (e.clientX - lastDragX.current) * 0.6
    lastDragX.current = e.clientX
    xRef.current = dragStartOffset.current + dx
  }
  const onMouseUp = () => { dragging.current = false }

  // touch handlers for mobile
  const onTouchStart = (e: React.TouchEvent) => {
    if (!canScroll.current) return
    const t = e.touches[0]
    dragging.current = true; didDrag.current = false
    dragStartX.current = t.clientX; dragStartOffset.current = xRef.current
    lastDragX.current = t.clientX; velRef.current = 0
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragging.current || !canScroll.current) return
    const t = e.touches[0]
    const dx = t.clientX - dragStartX.current
    if (Math.abs(dx) > 3) didDrag.current = true
    velRef.current = (t.clientX - lastDragX.current) * 0.6
    lastDragX.current = t.clientX
    xRef.current = dragStartOffset.current + dx
  }
  const onTouchEnd = () => { dragging.current = false }

  useEffect(() => {
    const el = wrapRef.current; if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (!canScroll.current) return
      e.preventDefault()
      velRef.current = gsap.utils.clamp(-22, 22, -e.deltaY * 0.06 + velRef.current)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  const onImgEnter = (e: React.MouseEvent<HTMLDivElement>) =>
    gsap.to(e.currentTarget.querySelector('img'), { scale: 1.08, duration: 0.5, ease: 'power2.out' })
  const onImgLeave = (e: React.MouseEvent<HTMLDivElement>) =>
    gsap.to(e.currentTarget.querySelector('img'), { scale: 1, duration: 0.5, ease: 'power2.out' })

  const renderPhotos = (suffix: string) => photos.map((photo, i) => {
    const h = HEIGHTS[i % HEIGHTS.length]
    return (
      <div key={photo.id + suffix} className="ph-item" data-cursor
        onMouseEnter={onImgEnter} onMouseLeave={onImgLeave}
        onClick={() => { if (!didDrag.current) onSelect(photo) }}
        style={{
          flexShrink: 0, height: h, width: 'auto', overflow: 'hidden',
          position: 'relative', alignSelf: 'center', cursor: 'none',
        }}>
        <img src={photo.preview} alt="" draggable={false} className="ph-img"
          style={{
            height: '100%', width: 'auto', maxWidth: 'none', objectFit: 'cover',
            display: 'block', pointerEvents: 'none', transformOrigin: 'center center',
            willChange: 'transform',
          }} />
        {photo.date && (
          <span style={{
            position: 'absolute', bottom: 8, left: 8,
            ...SANS, fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.75)', background: 'rgba(0,0,0,0.45)',
            padding: '3px 6px', backdropFilter: 'blur(4px)',
          }}>
            {MONTH_LABELS[photo.date.split('-')[1]] ?? ''} {photo.date.split('-')[0]}
          </span>
        )}
      </div>
    )
  })

  return (
    <>
      <DragCursor visible={cursorVisible} x={cursorPos.x} y={cursorPos.y} />
      <div ref={wrapRef}
        onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}
        onMouseLeave={() => { onMouseUp(); setCursorVisible(false) }}
        onMouseEnter={() => setCursorVisible(canScroll.current)}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        style={{
          width: '100%', overflow: 'hidden', cursor: 'none', userSelect: 'none',
          position: 'relative', touchAction: 'pan-y',
        }}>
        <div ref={trackRef}
          style={{
            display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4,
            willChange: 'transform', width: 'max-content',
          }}>
          {renderPhotos('a')}
          {renderPhotos('b')}
        </div>
      </div>
    </>
  )
}
