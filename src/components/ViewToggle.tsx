'use client'
import { motion } from 'framer-motion'
import { LayoutGrid, List, GalleryHorizontal } from 'lucide-react'
import type { ViewMode } from '@/types'

const SANS: React.CSSProperties = { fontFamily: "'Manrope', system-ui, sans-serif" }

const VIEWS: { mode: ViewMode; label: string; icon: React.ReactNode }[] = [
  { mode: 'grid',       label: 'Grid',       icon: <LayoutGrid size={14} /> },
  { mode: 'list',       label: 'List',       icon: <List size={14} /> },
  { mode: 'horizontal', label: 'Scroll',     icon: <GalleryHorizontal size={14} /> },
]

interface ViewToggleProps {
  active: ViewMode
  onChange: (v: ViewMode) => void
}

export default function ViewToggle({ active, onChange }: ViewToggleProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 2,
      background: 'var(--surface)', borderRadius: 8,
      border: '1px solid var(--border)', padding: 3,
      transition: 'background 0.35s ease, border-color 0.35s ease',
    }}>
      {VIEWS.map(({ mode, label, icon }) => {
        const isActive = active === mode
        return (
          <button key={mode} data-cursor onClick={() => onChange(mode)}
            style={{
              position: 'relative', display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 12px', borderRadius: 6, border: 'none',
              cursor: 'none', background: isActive ? 'var(--text)' : 'transparent',
              color: isActive ? 'var(--bg)' : 'var(--muted)',
              transition: 'all 0.2s ease',
              ...SANS, fontSize: 11, fontWeight: isActive ? 600 : 400,
              letterSpacing: '0.04em',
            }}
            onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'var(--text)' }}
            onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'var(--muted)' }}
          >
            {icon}
            <span>{label}</span>
          </button>
        )
      })}
    </div>
  )
}
