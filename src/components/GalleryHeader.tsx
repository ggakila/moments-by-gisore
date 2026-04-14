'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Heart, Home, Camera, Info, HelpCircle, FolderOpen, FolderPlus, Trash2 } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import ThemeToggle from '@/components/ui/ThemeToggle'
import ViewToggle from './ViewToggle'
import type { Variants } from 'framer-motion'
import type { ViewMode, Folder } from '@/types'

const SANS: React.CSSProperties = { fontFamily: "'Manrope', system-ui, sans-serif" }
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]
const EASE_SLIDE: [number, number, number, number] = [0.76, 0, 0.24, 1]

const NAV = [
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
      width: size, height: size, borderRadius: Math.round(size * 0.2), background: 'var(--text)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
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

const iconBtn = (active?: boolean): React.CSSProperties => ({
  width: 32, height: 32, borderRadius: 6, border: 'none', cursor: 'none',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: active ? 'var(--text)' : 'transparent',
  color: active ? 'var(--bg)' : 'var(--muted)',
  transition: 'all 0.2s ease', position: 'relative',
})

interface GalleryHeaderProps {
  viewMode: ViewMode
  folders: Folder[]
  activeFolder: string | null
  showFavorites: boolean
  photos: Photo[]
  onUpload: () => void
  onViewChange: (v: ViewMode) => void
  onShowFavorites: () => void
  onFolderSelect: (id: string | null) => void
  onFolderCreate: (name: string) => void
  onFolderDelete: (id: string) => void
}

import type { Photo } from '@/types'

export default function GalleryHeader({
  viewMode, folders, activeFolder, showFavorites, photos,
  onUpload, onViewChange, onShowFavorites, onFolderSelect, onFolderCreate, onFolderDelete,
}: GalleryHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [creatingFolder, setCreatingFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const folderInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    if (creatingFolder && folderInputRef.current) folderInputRef.current.focus()
  }, [creatingFolder])

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onFolderCreate(newFolderName.trim())
      setNewFolderName('')
      setCreatingFolder(false)
    }
  }

  const folderCount = (id: string) => photos.filter(p => p.folder === id).length

  return (
    <>
      <header style={{
        position: 'relative', zIndex: 30, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 50, paddingLeft: 14, paddingRight: 14,
        background: 'var(--nav-bg)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
      }}>
        {/* LEFT — brand only */}
        <Link href="/" data-cursor style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', cursor: 'none' }}>
          <BrandIcon />
          <span style={{ ...SANS, fontWeight: 600, fontSize: 13, color: 'var(--text)', letterSpacing: '-0.02em' }}>Moments</span>
        </Link>

        {/* CENTER — view toggle (desktop) */}
        <div className="hidden md:flex" style={{ alignItems: 'center' }}>
          <ViewToggle active={viewMode} onChange={onViewChange} />
        </div>

        {/* RIGHT */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button data-cursor onClick={onShowFavorites} style={iconBtn(showFavorites)} title="Favorites">
            <Heart size={15} fill={showFavorites ? 'currentColor' : 'none'} />
          </button>

          {/* mobile view icons */}
          <div className="flex md:hidden" style={{ alignItems: 'center', gap: 1 }}>
            {(['grid', 'list', 'horizontal'] as ViewMode[]).map(mode => (
              <button key={mode} data-cursor onClick={() => onViewChange(mode)} style={iconBtn(viewMode === mode)}>
                {mode === 'grid' && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="1" width="4" height="4" rx="1" fill="currentColor" /><rect x="7" y="1" width="4" height="4" rx="1" fill="currentColor" /><rect x="1" y="7" width="4" height="4" rx="1" fill="currentColor" /><rect x="7" y="7" width="4" height="4" rx="1" fill="currentColor" /></svg>}
                {mode === 'list' && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="2" width="10" height="2" rx="0.5" fill="currentColor" /><rect x="1" y="5" width="10" height="2" rx="0.5" fill="currentColor" /><rect x="1" y="8" width="10" height="2" rx="0.5" fill="currentColor" /></svg>}
                {mode === 'horizontal' && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="3" width="3" height="6" rx="0.5" fill="currentColor" /><rect x="5" y="2" width="3" height="8" rx="0.5" fill="currentColor" /><rect x="9" y="4" width="3" height="4" rx="0.5" fill="currentColor" /></svg>}
              </button>
            ))}
          </div>

          {/* desktop upload */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 8 }}>
            <div style={{ width: 1, height: 16, background: 'var(--border)' }} />
            <button data-cursor onClick={onUpload}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 6,
                border: '1px solid var(--accent)', background: 'var(--accent)',
                color: '#fff', cursor: 'none',
                ...SANS, fontSize: 11, fontWeight: 500, letterSpacing: '-0.01em',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'transparent'
                ;(e.currentTarget as HTMLElement).style.color = 'var(--accent)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'var(--accent)'
                ;(e.currentTarget as HTMLElement).style.color = '#fff'
              }}>
              <Upload size={13} />
              <span>Upload</span>
            </button>
          </div>

          {/* burger — always visible */}
          <div style={{ marginLeft: 4, display: 'flex' }}>
            <button data-cursor aria-label="Menu" onClick={() => setMenuOpen(v => !v)}
              style={{ background: 'none', border: 'none', cursor: 'none', display: 'flex', flexDirection: 'column', gap: 4, padding: 6 }}>
              <motion.span animate={menuOpen ? { rotate: 45, y: 5.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: EASE_SLIDE }}
                style={{ display: 'block', width: 18, height: 1.5, background: 'var(--text)', borderRadius: 2, transformOrigin: 'center' }} />
              <motion.span animate={menuOpen ? { scaleX: 0, opacity: 0 } : { scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.15 }}
                style={{ display: 'block', width: 12, height: 1.5, background: 'var(--text)', borderRadius: 2 }} />
              <motion.span animate={menuOpen ? { rotate: -45, y: -5.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: EASE_SLIDE }}
                style={{ display: 'block', width: 18, height: 1.5, background: 'var(--text)', borderRadius: 2, transformOrigin: 'center' }} />
            </button>
          </div>
        </div>
      </header>

      {/* ══ SIDEBAR ══ */}
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

              {/* user */}
              <div style={{
                padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12,
                borderBottom: '1px solid var(--border)',
              }}>
                <Avatar className="h-9 w-9">
                  <AvatarFallback style={{
                    ...SANS, fontSize: 11, fontWeight: 600, background: 'var(--surface)',
                    color: 'var(--text)', border: '1px solid var(--border)',
                  }}>MG</AvatarFallback>
                </Avatar>
                <div>
                  <p style={{ ...SANS, fontSize: 13, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.01em' }}>Moments by Gisore</p>
                  <p style={{ ...SANS, fontSize: 10, color: 'var(--muted)', letterSpacing: '0.03em', marginTop: 1 }}>Nairobi, Kenya</p>
                </div>
              </div>

              {/* scrollable content */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>

                {/* navigation */}
                <div style={{ padding: '0 12px', marginBottom: 8 }}>
                  <p style={{ ...SANS, fontSize: 9, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', padding: '4px 8px 8px', opacity: 0.6 }}>
                    Navigation
                  </p>
                  {NAV.map(({ href, label, icon }) => (
                    <Link key={href} href={href} data-cursor onClick={() => setMenuOpen(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '9px 8px', borderRadius: 6, textDecoration: 'none', cursor: 'none',
                        color: 'var(--text)', transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--surface)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                      <span style={{ color: 'var(--muted)', display: 'flex' }}>{icon}</span>
                      <span style={{ ...SANS, fontSize: 13, fontWeight: 500, letterSpacing: '-0.01em' }}>{label}</span>
                    </Link>
                  ))}
                </div>

                {/* separator */}
                <div style={{ height: 1, background: 'var(--border)', margin: '8px 20px' }} />

                {/* folders */}
                <div style={{ padding: '0 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px 8px' }}>
                    <p style={{ ...SANS, fontSize: 9, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', opacity: 0.6 }}>
                      Folders
                    </p>
                    <button data-cursor onClick={() => setCreatingFolder(true)}
                      style={{ background: 'none', border: 'none', cursor: 'none', color: 'var(--accent)', display: 'flex', padding: 0 }}>
                      <FolderPlus size={13} />
                    </button>
                  </div>

                  {/* create folder input */}
                  {creatingFolder && (
                    <div style={{ padding: '4px 8px 8px', display: 'flex', gap: 6 }}>
                      <input ref={folderInputRef} value={newFolderName}
                        onChange={e => setNewFolderName(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleCreateFolder(); if (e.key === 'Escape') setCreatingFolder(false) }}
                        placeholder="Folder name..."
                        style={{
                          ...SANS, fontSize: 11, flex: 1, background: 'var(--surface)',
                          border: '1px solid var(--border)', borderRadius: 5, padding: '5px 10px',
                          color: 'var(--text)', outline: 'none',
                        }} />
                      <button onClick={handleCreateFolder}
                        style={{
                          ...SANS, fontSize: 10, fontWeight: 600, background: 'var(--accent)', color: '#fff',
                          border: 'none', borderRadius: 5, padding: '5px 10px', cursor: 'none',
                        }}>Add</button>
                    </div>
                  )}

                  {/* all photos */}
                  <button data-cursor onClick={() => { onFolderSelect(null); setMenuOpen(false) }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                      padding: '8px 8px', borderRadius: 5, border: 'none', cursor: 'none',
                      background: activeFolder === null && !showFavorites ? 'var(--surface)' : 'transparent',
                      color: 'var(--text)', transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--surface)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = activeFolder === null && !showFavorites ? 'var(--surface)' : 'transparent'}>
                    <Camera size={14} style={{ color: 'var(--muted)', flexShrink: 0 }} />
                    <span style={{ ...SANS, fontSize: 12, fontWeight: activeFolder === null && !showFavorites ? 600 : 400, flex: 1, textAlign: 'left', letterSpacing: '-0.01em' }}>
                      All photos
                    </span>
                    <span style={{ ...SANS, fontSize: 10, color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>{photos.length}</span>
                  </button>

                  {/* favorites */}
                  <button data-cursor onClick={() => { onShowFavorites(); setMenuOpen(false) }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                      padding: '8px 8px', borderRadius: 5, border: 'none', cursor: 'none',
                      background: showFavorites ? 'var(--surface)' : 'transparent',
                      color: 'var(--text)', transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--surface)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = showFavorites ? 'var(--surface)' : 'transparent'}>
                    <Heart size={14} style={{ color: showFavorites ? '#ea4c89' : 'var(--muted)', flexShrink: 0 }} fill={showFavorites ? '#ea4c89' : 'none'} />
                    <span style={{ ...SANS, fontSize: 12, fontWeight: showFavorites ? 600 : 400, flex: 1, textAlign: 'left', letterSpacing: '-0.01em' }}>
                      Favorites
                    </span>
                    <span style={{ ...SANS, fontSize: 10, color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>{photos.filter(p => p.liked).length}</span>
                  </button>

                  {/* folder list */}
                  {folders.map(f => {
                    const isActive = activeFolder === f.id
                    const count = folderCount(f.id)
                    return (
                      <div key={f.id} style={{ display: 'flex', alignItems: 'center' }}>
                        <button data-cursor onClick={() => { onFolderSelect(isActive ? null : f.id); setMenuOpen(false) }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10, flex: 1,
                            padding: '8px 8px', borderRadius: 5, border: 'none', cursor: 'none',
                            background: isActive ? 'var(--surface)' : 'transparent',
                            color: 'var(--text)', transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--surface)'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = isActive ? 'var(--surface)' : 'transparent'}>
                          <FolderOpen size={14} style={{ color: isActive ? 'var(--accent)' : 'var(--muted)', flexShrink: 0 }} />
                          <span style={{ ...SANS, fontSize: 12, fontWeight: isActive ? 600 : 400, flex: 1, textAlign: 'left', letterSpacing: '-0.01em' }}>
                            {f.name}
                          </span>
                          <span style={{ ...SANS, fontSize: 10, color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>{count}</span>
                        </button>
                        <button data-cursor onClick={() => onFolderDelete(f.id)}
                          style={{ background: 'none', border: 'none', cursor: 'none', color: 'var(--muted)', padding: '8px 6px', display: 'flex', opacity: 0.4, transition: 'opacity 0.15s' }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '0.4'}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* footer */}
              <div style={{ flexShrink: 0, borderTop: '1px solid var(--border)', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ ...SANS, fontSize: 9, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>Est. 2024</span>
                <ThemeToggle />
                <span style={{ ...SANS, fontSize: 9, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>Moments</span>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
