'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, LayoutGrid, Users, Leaf, Building2, Palette, FolderUp, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import type { Category } from '@/types'

const NAV: { label: Category; icon: React.ReactNode; emoji: string }[] = [
  { label: 'All',     icon: <LayoutGrid size={15} />, emoji: '◈' },
  { label: 'People',  icon: <Users size={15} />,      emoji: '◉' },
  { label: 'Nature',  icon: <Leaf size={15} />,       emoji: '◈' },
  { label: 'Urban',   icon: <Building2 size={15} />,  emoji: '◈' },
  { label: 'Art',     icon: <Palette size={15} />,    emoji: '◈' },
  { label: 'Uploads', icon: <FolderUp size={15} />,   emoji: '◈' },
]

interface SidebarProps {
  open: boolean
  onToggle: () => void
  active: Category
  onSelect: (c: Category) => void
  counts: Record<string, number>
  onUpload: () => void
}

export default function Sidebar({ open, onToggle, active, onSelect, counts, onUpload }: SidebarProps) {
  return (
    <motion.aside
      animate={{ width: open ? 240 : 72 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex-shrink-0 flex flex-col h-full overflow-hidden z-10"
      style={{
        background: '#0a0a0a',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center h-[60px] flex-shrink-0 px-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
          style={{ background: 'linear-gradient(135deg, #ea4c89, #ff7262)' }}
        >
          m
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="ml-3 overflow-hidden"
            >
              <p className="text-white text-sm font-semibold tracking-tight leading-none">moments</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>by gisore</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-5 overflow-y-auto overflow-x-hidden">
        <AnimatePresence>
          {open && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-[9px] uppercase tracking-[0.2em] px-5 mb-3"
              style={{ color: 'rgba(255,255,255,0.2)' }}
            >
              Albums
            </motion.p>
          )}
        </AnimatePresence>

        <div className="flex flex-col gap-0.5 px-2">
          {NAV.map(({ label, icon }) => {
            const isActive = active === label
            return (
              <button
                key={label}
                data-cursor
                onClick={() => onSelect(label)}
                className="relative flex items-center gap-3 rounded-xl transition-all duration-200 cursor-none group"
                style={{
                  padding: open ? '9px 12px' : '9px 0',
                  justifyContent: open ? 'flex-start' : 'center',
                  background: isActive ? 'rgba(255,255,255,0.07)' : 'transparent',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.35)',
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-pill"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                    style={{ background: '#ea4c89' }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
                <span className="flex-shrink-0" style={{ color: isActive ? '#ea4c89' : 'inherit' }}>{icon}</span>
                <AnimatePresence>
                  {open && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.18 }}
                      className="flex-1 text-left text-sm font-medium whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {open && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="text-[11px] tabular-nums font-mono"
                      style={{ color: isActive ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)' }}
                    >
                      {counts[label] ?? 0}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="flex-shrink-0 p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <button
          data-cursor
          onClick={onUpload}
          className="w-full flex items-center gap-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-none"
          style={{
            padding: open ? '10px 14px' : '10px 0',
            justifyContent: open ? 'flex-start' : 'center',
            background: 'rgba(234,76,137,0.12)',
            color: '#ea4c89',
            border: '1px solid rgba(234,76,137,0.2)',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(234,76,137,0.2)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(234,76,137,0.12)' }}
        >
          <Upload size={14} className="flex-shrink-0" />
          <AnimatePresence>
            {open && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.18 }}
                className="whitespace-nowrap"
              >
                Upload photos
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Toggle button */}
      <button
        data-cursor
        onClick={onToggle}
        className="absolute bottom-[72px] -right-3.5 w-7 h-7 rounded-full flex items-center justify-center cursor-none z-20 transition-all"
        style={{
          background: '#1c1c1c',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.4)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)' }}
      >
        <motion.span animate={{ rotate: open ? 0 : 180 }} transition={{ duration: 0.35 }}>
          <PanelLeftClose size={12} />
        </motion.span>
      </button>
    </motion.aside>
  )
}
