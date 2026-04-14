'use client'
import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useRouter } from 'next/router'

export default function Cursor() {
  const mx = useMotionValue(-100)
  const my = useMotionValue(-100)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [isGallery, setIsGallery] = useState(false)
  const router = useRouter()

  const sx = useSpring(mx, { stiffness: 700, damping: 46 })
  const sy = useSpring(my, { stiffness: 700, damping: 46 })
  const tx = useSpring(mx, { stiffness: 120, damping: 26 })
  const ty = useSpring(my, { stiffness: 120, damping: 26 })

  useEffect(() => {
    setIsGallery(router.pathname === '/gallery')
  }, [router.pathname])

  useEffect(() => {
    const move = (e: MouseEvent) => { mx.set(e.clientX); my.set(e.clientY) }
    const hover = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      setHovered(!!(el.closest('button') || el.closest('a') || el.closest('[data-cursor]')))
    }
    const down = () => setClicked(true)
    const up = () => setClicked(false)
    window.addEventListener('mousemove', move)
    window.addEventListener('mousemove', hover)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousemove', hover)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
    }
  }, [mx, my])

  // On gallery: dark dot on white bg. On marketing: light dot on dark bg.
  const dotColor = isGallery
    ? (hovered ? '#ea4c89' : '#0a0a0a')
    : (hovered ? '#ea4c89' : '#f0ede8')
  const ringColor = isGallery
    ? (hovered ? 'rgba(234,76,137,0.5)' : 'rgba(0,0,0,0.25)')
    : (hovered ? 'rgba(234,76,137,0.5)' : 'rgba(240,237,232,0.25)')

  return (
    <>
      {/* Outer ring */}
      <motion.div className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full"
        style={{
          x: tx, y: ty,
          translateX: '-50%', translateY: '-50%',
          width: hovered ? 40 : 24,
          height: hovered ? 40 : 24,
          border: `1px solid ${ringColor}`,
          transition: 'width 0.2s, height 0.2s, border-color 0.2s',
        }} />
      {/* Inner dot */}
      <motion.div className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          x: sx, y: sy,
          translateX: '-50%', translateY: '-50%',
          width: clicked ? 4 : hovered ? 6 : 4,
          height: clicked ? 4 : hovered ? 6 : 4,
          background: dotColor,
          transition: 'width 0.15s, height 0.15s, background 0.2s',
        }} />
    </>
  )
}
