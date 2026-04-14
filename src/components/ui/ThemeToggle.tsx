'use client'
import { useTheme } from '@/components/ThemeProvider'
import { motion } from 'framer-motion'

const MONO = { fontFamily: "'DM Mono', monospace", fontWeight: 300 } as React.CSSProperties

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'

  return (
    <button
      data-cursor
      onClick={toggle}
      aria-label="Toggle theme"
      style={{
        ...MONO,
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'none', border: 'none', cursor: 'none',
        padding: 0,
      }}
    >
      {/* pill track */}
      <div style={{
        position: 'relative', width: 36, height: 18,
        borderRadius: 9,
        background: dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)',
        border: dark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.12)',
        transition: 'background 0.3s, border-color 0.3s',
        flexShrink: 0,
      }}>
        <motion.div
          animate={{ x: dark ? 19 : 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          style={{
            position: 'absolute', top: 2, width: 12, height: 12,
            borderRadius: '50%',
            background: dark ? '#f0ede8' : '#0a0a0a',
          }}
        />
      </div>
      <span style={{
        fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
        color: 'var(--muted)',
        transition: 'color 0.3s',
      }}>
        {dark ? 'Dark' : 'Light'}
      </span>
    </button>
  )
}
