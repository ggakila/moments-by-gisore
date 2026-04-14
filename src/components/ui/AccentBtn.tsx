'use client'
import { useState } from 'react'
import Link from 'next/link'

const M: React.CSSProperties = { fontFamily: "'Manrope', system-ui, sans-serif" }
const ACCENT = '#5B6AF0'

interface Props {
  href?: string
  onClick?: () => void
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  variant?: 'filled' | 'outline'
  style?: React.CSSProperties
}

export default function AccentBtn({ href, onClick, children, size = 'md', variant = 'filled', style }: Props) {
  const [hovered, setHovered] = useState(false)

  const pad = size === 'sm' ? '7px 16px' : size === 'lg' ? '14px 34px' : '10px 24px'
  const fs  = size === 'sm' ? 12 : size === 'lg' ? 14 : 13

  const isFilled = variant === 'filled'

  const inner = (
    <span style={{
      position: 'relative',
      display: 'inline-flex', alignItems: 'center', gap: 7,
      padding: pad,
      borderRadius: 8,
      border: `1px solid ${ACCENT}`,
      overflow: 'hidden',
      cursor: 'none',
      ...M,
      fontWeight: 500,
      fontSize: fs,
      letterSpacing: '-0.01em',
      color: isFilled
        ? (hovered ? ACCENT : '#fff')
        : (hovered ? '#fff' : ACCENT),
      transition: 'color 0.3s ease',
      background: isFilled ? ACCENT : 'transparent',
      ...style,
    }}>
      {/* slide-up fill layer */}
      <span style={{
        position: 'absolute', inset: 0,
        background: isFilled ? 'rgba(0,0,0,0.18)' : ACCENT,
        transform: hovered ? 'translateY(0%)' : 'translateY(102%)',
        transition: 'transform 0.34s cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: 0,
      }} />
      {/* label */}
      <span style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>{children}</span>
      {/* arrow — shifts diagonally on hover */}
      <span style={{
        position: 'relative', zIndex: 1,
        display: 'inline-flex', alignItems: 'center',
        fontSize: fs + 2,
        lineHeight: 1,
        transform: hovered ? 'translate(2px, -2px)' : 'translate(0, 0)',
        transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>↗</span>
    </span>
  )

  const handlers = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  }

  if (href) {
    return (
      <Link href={href} data-cursor style={{ textDecoration: 'none', display: 'inline-block' }} {...handlers}>
        {inner}
      </Link>
    )
  }

  return (
    <button data-cursor onClick={onClick}
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'none', display: 'inline-block' }}
      {...handlers}>
      {inner}
    </button>
  )
}
