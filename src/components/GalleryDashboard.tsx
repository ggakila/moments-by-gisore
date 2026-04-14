'use client'
import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Search, X, Heart, FolderPlus, Share2, Download, ChevronDown, Loader2, Upload } from 'lucide-react'
import Lightbox from './Lightbox'
import GalleryHeader from './GalleryHeader'
import GridView from './GridView'
import ListView from './ListView'
import HorizontalView from './HorizontalView'
import { fetchMultipleQueries } from '@/lib/pixabay'
import type { Photo, Folder, ViewMode } from '@/types'

const SANS: React.CSSProperties = { fontFamily: "'Manrope', system-ui, sans-serif" }

const FALLBACK_PHOTOS: Photo[] = [
  { id: 'developer', name: 'developer', preview: '/imagezz/developer.jpg', category: 'People', date: '2024-03', tags: ['portrait', 'person', 'people'], liked: false, folder: null },
  { id: 'woman',     name: 'woman',     preview: '/imagezz/woman.jpg',     category: 'People', date: '2024-03', tags: ['portrait', 'woman', 'people'], liked: false, folder: null },
  { id: 'children',  name: 'children',  preview: '/imagezz/children.jpg',  category: 'People', date: '2024-06', tags: ['children', 'people', 'portrait'], liked: false, folder: null },
  { id: 'africa',    name: 'africa',    preview: '/imagezz/africa.jpg',    category: 'Nature', date: '2024-06', tags: ['landscape', 'nature', 'africa'], liked: false, folder: null },
  { id: 'nairobi',   name: 'nairobi',   preview: '/imagezz/nairobi.jpg',   category: 'Urban',  date: '2024-09', tags: ['city', 'urban', 'nairobi', 'architecture'], liked: false, folder: null },
  { id: 'cityscape', name: 'cityscape', preview: '/imagezz/cityscape.jpg', category: 'Urban',  date: '2024-09', tags: ['city', 'skyline', 'urban', 'architecture'], liked: false, folder: null },
  { id: 'sculpture', name: 'sculpture', preview: '/imagezz/sculpture.jpg', category: 'Art',    date: '2024-12', tags: ['art', 'sculpture', 'creative'], liked: false, folder: null },
]

const MONTH_LABELS: Record<string, string> = {
  '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
  '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
  '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec',
}

function useIsMobile(bp = 768) {
  const [m, setM] = useState(false)
  useEffect(() => {
    const c = () => setM(window.innerWidth < bp)
    c(); window.addEventListener('resize', c)
    return () => window.removeEventListener('resize', c)
  }, [bp])
  return m
}

/* ── Chat-style search with autocomplete ── */
function ChatSearch({
  search, onSearchChange, onClear,
  activeTag, onTagSelect,
  tags, isActive, onFocus, onBlur,
}: {
  search: string; onSearchChange: (v: string) => void; onClear: () => void
  activeTag: string | null; onTagSelect: (t: string | null) => void
  tags: string[]; isActive: boolean; onFocus: () => void; onBlur: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const suggestions = useMemo(() => {
    if (!search.trim()) return tags.slice(0, 10)
    const q = search.toLowerCase()
    return tags.filter(t => t.toLowerCase().includes(q)).slice(0, 10)
  }, [search, tags])

  useEffect(() => {
    if (isActive && inputRef.current) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(timer)
    }
  }, [isActive])

  const handleFocus = () => { setShowSuggestions(true); onFocus() }
  const handleBlur = () => { setTimeout(() => { setShowSuggestions(false); onBlur() }, 200) }
  const handleSelectTag = (tag: string) => {
    onTagSelect(activeTag === tag ? null : tag)
    setShowSuggestions(false)
  }

  // always show input when active or has content
  if (isActive || search || activeTag) {
    return (
      <div style={{
        flexShrink: 0, borderBottom: '1px solid var(--border)',
        background: 'var(--surface)', transition: 'background 0.35s ease',
        position: 'relative', zIndex: 20,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '0 16px', height: 42,
        }}>
          <Search size={13} style={{ color: 'var(--muted)', flexShrink: 0 }} />
          <input ref={inputRef}
            type="text" value={search}
            onChange={e => onSearchChange(e.target.value)}
            onFocus={handleFocus} onBlur={handleBlur}
            placeholder="Search photos, tags..."
            style={{
              ...SANS, fontSize: 12, background: 'transparent', border: 'none',
              outline: 'none', color: 'var(--text)', flex: 1,
              letterSpacing: '-0.01em',
            }}
          />
          {activeTag && (
            <span style={{
              ...SANS, fontSize: 9, fontWeight: 500, letterSpacing: '0.06em',
              background: 'var(--accent)', color: '#fff', padding: '3px 8px',
              borderRadius: 4, display: 'flex', alignItems: 'center', gap: 5,
            }}>
              {activeTag}
              <button onMouseDown={e => e.preventDefault()} onClick={() => onTagSelect(null)}
                style={{ background: 'none', border: 'none', cursor: 'none', color: '#fff', padding: 0, display: 'flex', opacity: 0.7 }}>
                <X size={10} />
              </button>
            </span>
          )}
          {(search || activeTag) && (
            <button onMouseDown={e => e.preventDefault()} onClick={() => { onClear(); onTagSelect(null) }}
              style={{ background: 'none', border: 'none', cursor: 'none', color: 'var(--muted)', display: 'flex', padding: 0 }}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 16, right: 16,
            background: 'var(--bg)', border: '1px solid var(--border)',
            borderRadius: 8, boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
            zIndex: 30, overflow: 'hidden',
          }}>
            {suggestions.map(tag => {
              const tagActive = activeTag === tag
              return (
                <button key={tag} data-cursor
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => handleSelectTag(tag)}
                  style={{
                    ...SANS, fontSize: 11, fontWeight: tagActive ? 600 : 400,
                    letterSpacing: '-0.01em', cursor: 'none', border: 'none',
                    width: '100%', textAlign: 'left',
                    background: tagActive ? 'var(--accent)' : 'transparent',
                    color: tagActive ? '#fff' : 'var(--text)',
                    padding: '8px 14px', transition: 'background 0.15s',
                    display: 'flex', alignItems: 'center', gap: 8,
                    borderBottom: '1px solid var(--border)',
                  }}
                  onMouseEnter={e => { if (!tagActive) (e.currentTarget as HTMLElement).style.background = 'var(--surface)' }}
                  onMouseLeave={e => { if (!tagActive) (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                  <Search size={10} style={{ color: tagActive ? 'rgba(255,255,255,0.6)' : 'var(--muted)', flexShrink: 0 }} />
                  {tag}
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  // idle: centered search prompt
  return (
    <div style={{
      flexShrink: 0, borderBottom: '1px solid var(--border)',
      background: 'var(--surface)', transition: 'background 0.35s ease',
      position: 'relative', zIndex: 20,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: 42, padding: '0 16px',
      }}>
        <button data-cursor onClick={onFocus}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'transparent', border: '1px solid var(--border)',
            cursor: 'none', borderRadius: 20,
            ...SANS, fontSize: 12, color: 'var(--muted)', letterSpacing: '-0.01em',
            padding: '6px 18px',
            transition: 'all 0.25s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'var(--bg)'
            ;(e.currentTarget as HTMLElement).style.color = 'var(--text)'
            ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'transparent'
            ;(e.currentTarget as HTMLElement).style.color = 'var(--muted)'
            ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
          }}>
          <Search size={13} />
          <span>Search photos or tags</span>
        </button>
      </div>
    </div>
  )
}

/* ── Timeline ── */
function Timeline({ photos, activeDate, onSelect }: {
  photos: Photo[]; activeDate: string | null; onSelect: (d: string | null) => void
}) {
  const groups = useMemo(() => {
    const map = new Map<string, number>()
    photos.forEach(p => { const key = p.date ?? '2024-01'; map.set(key, (map.get(key) ?? 0) + 1) })
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]))
  }, [photos])
  const years = useMemo(() => {
    const s = new Set(groups.map(([k]) => k.split('-')[0]))
    return Array.from(s).sort((a, b) => b.localeCompare(a))
  }, [groups])

  return (
    <div style={{
      width: 76, flexShrink: 0,
      borderLeft: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', overflowY: 'auto',
      background: 'var(--surface)', transition: 'background 0.35s ease',
      boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.02)',
    }}>
      <button data-cursor onClick={() => onSelect(null)}
        style={{
          ...SANS, fontSize: 9, fontWeight: 600, letterSpacing: '0.08em',
          textTransform: 'uppercase', cursor: 'none', border: 'none',
          background: activeDate === null ? 'var(--text)' : 'transparent',
          color: activeDate === null ? 'var(--bg)' : 'var(--muted)',
          padding: '12px 0', textAlign: 'center', borderBottom: '1px solid var(--border)',
          transition: 'all 0.2s ease',
        }}>All</button>
      {years.map(year => (
        <div key={year}>
          <div style={{
            ...SANS, fontSize: 9, fontWeight: 600, letterSpacing: '0.04em',
            color: 'var(--muted)', padding: '10px 0 4px', textAlign: 'center',
            borderBottom: '1px solid var(--border)', opacity: 0.6,
          }}>{year}</div>
          {groups.filter(([k]) => k.startsWith(year)).map(([key, count]) => {
            const month = key.split('-')[1]
            const label = MONTH_LABELS[month] ?? month
            const isActive = activeDate === key
            return (
              <button key={key} data-cursor onClick={() => onSelect(isActive ? null : key)}
                style={{
                  ...SANS, fontSize: 9, fontWeight: isActive ? 600 : 400,
                  letterSpacing: '0.04em', textTransform: 'uppercase', cursor: 'none',
                  border: 'none', background: isActive ? 'var(--text)' : 'transparent',
                  color: isActive ? 'var(--bg)' : 'var(--muted)',
                  padding: '8px 0', width: '100%', textAlign: 'center',
                  borderBottom: '1px solid var(--border)', transition: 'all 0.2s ease',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                }}>
                <span>{label}</span>
                <span style={{ fontSize: 7, opacity: 0.5 }}>{count}</span>
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

/* ── Folder panel ── */
/* ── Status bar ── */
function StatusBar({ filtered, total, activeTag, activeDate, search, viewMode, loading, activeFolder, folders }: {
  filtered: number; total: number; activeTag: string | null; activeDate: string | null; search: string; viewMode: ViewMode; loading: boolean; activeFolder: string | null; folders: Folder[]
}) {
  const folderName = activeFolder ? (folders.find(f => f.id === activeFolder)?.name ?? '') : ''
  return (
    <div style={{
      height: 32, flexShrink: 0,
      borderTop: '1px solid var(--border)',
      background: 'var(--surface)',
      display: 'flex', alignItems: 'center',
      paddingLeft: 16, paddingRight: 16, gap: 12,
      transition: 'background 0.35s ease', overflowX: 'auto',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
    }}>
      <span style={{ ...SANS, fontSize: 9, fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
        {filtered}/{total}
      </span>
      {activeTag && <span style={{ ...SANS, fontSize: 9, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'lowercase', color: 'var(--accent)', whiteSpace: 'nowrap' }}>#{activeTag}</span>}
      {activeDate && <span style={{ ...SANS, fontSize: 9, fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text)', opacity: 0.6, whiteSpace: 'nowrap' }}>{MONTH_LABELS[activeDate.split('-')[1]]} {activeDate.split('-')[0]}</span>}
      {search && <span style={{ ...SANS, fontSize: 9, fontWeight: 400, letterSpacing: '0.08em', color: 'var(--muted)', whiteSpace: 'nowrap' }}>&quot;{search}&quot;</span>}
      {folderName && <span style={{ ...SANS, fontSize: 9, fontWeight: 400, letterSpacing: '0.08em', color: 'var(--muted)', whiteSpace: 'nowrap' }}>📁 {folderName}</span>}
      <div style={{ flex: 1, minWidth: 0 }} />
      {loading ? (
        <span style={{ ...SANS, fontSize: 9, fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', opacity: 0.7, display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
          <motion.span animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-flex' }}><Loader2 size={10} /></motion.span>
          Syncing
        </span>
      ) : (
        <span className="hidden sm:inline" style={{ ...SANS, fontSize: 9, fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', opacity: 0.4, whiteSpace: 'nowrap' }}>
          {viewMode === 'horizontal' ? 'Drag or scroll' : 'Click to open'}
        </span>
      )}
    </div>
  )
}

/* ── Move-to-folder modal ── */
function MoveToFolderModal({ photo, folders, onMove, onClose }: {
  photo: Photo; folders: Folder[]; onMove: (folderId: string | null) => void; onClose: () => void
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12,
          width: 280, maxHeight: 360, overflow: 'auto',
        }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ ...SANS, fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>Move to folder</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'none', color: 'var(--muted)' }}><X size={14} /></button>
        </div>
        <button data-cursor onClick={() => { onMove(null); onClose() }}
          style={{
            ...SANS, fontSize: 12, width: '100%', textAlign: 'left', padding: '10px 16px',
            border: 'none', borderBottom: '1px solid var(--border)', background: !photo.folder ? 'var(--surface)' : 'transparent',
            color: 'var(--text)', cursor: 'none', transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--surface)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = !photo.folder ? 'var(--surface)' : 'transparent'}>
          No folder
        </button>
        {folders.map(f => (
          <button key={f.id} data-cursor onClick={() => { onMove(f.id); onClose() }}
            style={{
              ...SANS, fontSize: 12, width: '100%', textAlign: 'left', padding: '10px 16px',
              border: 'none', borderBottom: '1px solid var(--border)',
              background: photo.folder === f.id ? 'var(--surface)' : 'transparent',
              color: 'var(--text)', cursor: 'none', transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--surface)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = photo.folder === f.id ? 'var(--surface)' : 'transparent'}>
            {f.name}
          </button>
        ))}
      </motion.div>
    </motion.div>
  )
}

/* ══════════════════════════════════════════ */
export default function GalleryDashboard() {
  const [photos, setPhotos] = useState<Photo[]>(FALLBACK_PHOTOS)
  const [folders, setFolders] = useState<Folder[]>([
    { id: 'f1', name: 'Portraits' },
    { id: 'f2', name: 'Landscapes' },
    { id: 'f3', name: 'Client Work' },
  ])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Photo | null>(null)
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [activeDate, setActiveDate] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showFavorites, setShowFavorites] = useState(false)
  const [activeFolder, setActiveFolder] = useState<string | null>(null)
  const [moveTarget, setMoveTarget] = useState<Photo | null>(null)
  const [searchFocused, setSearchFocused] = useState(false)
  const isMobile = useIsMobile(768)

  // fetch on mount
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchMultipleQueries(50).then(fetched => {
      if (cancelled) return
      if (fetched.length > 0) {
        setPhotos(fetched.map(p => ({ ...p, tags: p.tags ?? [p.category.toLowerCase(), p.name], liked: false, folder: null })))
      }
      setLoading(false)
    }).catch(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const onDrop = useCallback((files: File[]) => {
    const next = files.map(f => ({
      id: f.name + Date.now(), name: f.name.replace(/\.[^/.]+$/, ''),
      preview: URL.createObjectURL(f), category: 'Uploads',
      date: new Date().toISOString().slice(0, 7),
      tags: ['upload', f.name.replace(/\.[^/.]+$/, '').toLowerCase()],
      liked: false, folder: null,
    }))
    setPhotos(p => [...p, ...next])
  }, [])

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop, accept: { 'image/*': [] }, noClick: true, noKeyboard: true,
  })

  // all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>()
    photos.forEach(p => p.tags?.forEach(t => set.add(t)))
    return Array.from(set).sort()
  }, [photos])

  // filtered photos
  const filtered = useMemo(() => {
    let list = photos
    if (showFavorites) list = list.filter(p => p.liked)
    if (activeFolder) list = list.filter(p => p.folder === activeFolder)
    if (activeTag) list = list.filter(p => p.tags?.includes(activeTag))
    if (activeDate) list = list.filter(p => (p.date ?? '').startsWith(activeDate))
    const q = search.toLowerCase().trim()
    if (q) list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags?.some(t => t.toLowerCase().includes(q))
    )
    return list
  }, [photos, showFavorites, activeFolder, activeTag, activeDate, search])

  // toggle like
  const toggleLike = useCallback((id: string) => {
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked } : p))
  }, [])

  // move to folder
  const moveToFolder = useCallback((photoId: string, folderId: string | null) => {
    setPhotos(prev => prev.map(p => p.id === photoId ? { ...p, folder: folderId } : p))
  }, [])

  // create folder
  const createFolder = useCallback((name: string) => {
    setFolders(prev => [...prev, { id: `f${Date.now()}`, name }])
  }, [])

  // delete folder
  const deleteFolder = useCallback((id: string) => {
    setFolders(prev => prev.filter(f => f.id !== id))
    setPhotos(prev => prev.map(p => p.folder === id ? { ...p, folder: null } : p))
    if (activeFolder === id) setActiveFolder(null)
  }, [activeFolder])

  // share link
  const handleShare = useCallback((photo: Photo) => {
    const url = photo.preview
    if (navigator.share) {
      navigator.share({ title: photo.name, url }).catch(() => {})
    } else {
      navigator.clipboard.writeText(url).catch(() => {})
    }
  }, [])

  // download
  const handleDownload = useCallback((photo: Photo) => {
    const a = document.createElement('a')
    a.href = photo.preview
    a.download = `${photo.name}.jpg`
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    a.click()
  }, [])

  return (
    <div {...getRootProps()}
      style={{
        position: 'relative', display: 'flex', flexDirection: 'column',
        height: '100vh', width: '100vw', overflow: 'hidden',
        background: 'var(--bg)', color: 'var(--text)',
        transition: 'background 0.35s ease, color 0.35s ease',
      }}>
      <input {...getInputProps()} />

      {/* subtle dot grid background */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, var(--border) 0.5px, transparent 0.5px)',
        backgroundSize: '24px 24px', opacity: 0.5,
      }} />

      {/* gradient orbs for depth */}
      <div style={{
        position: 'absolute', top: '15%', left: '-5%', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(107,122,247,0.08) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '-3%', width: 350, height: 350, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,180,80,0.06) 0%, transparent 70%)',
        filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: '40%', width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200,120,200,0.05) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0,
      }} />

      {/* drop overlay */}
      <AnimatePresence>
        {isDragActive && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', border: '1px dashed var(--border)', pointerEvents: 'none' }}>
            <p style={{ ...SANS, fontSize: 11, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)' }}>Drop to upload</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* header */}
      <GalleryHeader
        viewMode={viewMode}
        folders={folders}
        activeFolder={activeFolder}
        showFavorites={showFavorites}
        photos={photos}
        onUpload={open}
        onViewChange={setViewMode}
        onShowFavorites={() => { setShowFavorites(v => !v); if (!showFavorites) setActiveFolder(null) }}
        onFolderSelect={setActiveFolder}
        onFolderCreate={createFolder}
        onFolderDelete={deleteFolder}
      />

      {/* floating upload button — mobile only */}
      <button data-cursor onClick={open}
        style={{
          position: 'fixed', bottom: 20, left: 20, zIndex: 40,
          width: 48, height: 48, borderRadius: '50%',
          background: 'var(--accent)', border: 'none',
          color: '#fff', cursor: 'none',
          display: isMobile ? 'flex' : 'none',
          alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(91,106,240,0.35), 0 2px 8px rgba(0,0,0,0.15)',
          transition: 'all 0.25s ease',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'
          ;(e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(91,106,240,0.45), 0 4px 12px rgba(0,0,0,0.2)'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1)'
          ;(e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(91,106,240,0.35), 0 2px 8px rgba(0,0,0,0.15)'
        }}>
        <Upload size={20} />
      </button>

      {/* search bar */}
      <ChatSearch
        search={search} onSearchChange={setSearch} onClear={() => setSearch('')}
        activeTag={activeTag} onTagSelect={setActiveTag}
        tags={allTags} isActive={searchFocused}
        onFocus={() => setSearchFocused(true)}
        onBlur={() => setSearchFocused(false)}
      />

      {/* main */}
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* content */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative',
          background: 'var(--bg)',
        }}>
          {/* active filters */}
          <AnimatePresence>
            {(activeTag || activeDate || search || activeFolder || showFavorites) && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                style={{ position: 'absolute', top: 10, left: 16, zIndex: 10, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                {showFavorites && <span style={{ ...SANS, fontSize: 8, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', background: '#ea4c89', color: '#fff', padding: '3px 8px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 4 }}><Heart size={8} fill="#fff" /> Favorites</span>}
                {activeFolder && <span style={{ ...SANS, fontSize: 8, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'var(--text)', color: 'var(--bg)', padding: '3px 8px', borderRadius: 4 }}>{folders.find(f => f.id === activeFolder)?.name}</span>}
                {activeTag && <span style={{ ...SANS, fontSize: 8, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'lowercase', background: 'var(--accent)', color: '#fff', padding: '3px 8px', borderRadius: 4 }}>{activeTag}</span>}
                {activeDate && <span style={{ ...SANS, fontSize: 8, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'var(--text)', color: 'var(--bg)', padding: '3px 8px', borderRadius: 4 }}>{MONTH_LABELS[activeDate.split('-')[1]]} {activeDate.split('-')[0]}</span>}
                {search && <span style={{ ...SANS, fontSize: 8, fontWeight: 400, letterSpacing: '0.1em', background: 'var(--surface)', color: 'var(--text)', padding: '3px 8px', borderRadius: 4, border: '1px solid var(--border)' }}>&quot;{search}&quot;</span>}
                <span style={{ ...SANS, fontSize: 9, fontWeight: 400, color: 'var(--muted)', letterSpacing: '0.04em' }}>{filtered.length} photo{filtered.length !== 1 ? 's' : ''}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* view area */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}>
                  <Loader2 size={20} style={{ color: 'var(--muted)' }} />
                </motion.div>
                <span style={{ ...SANS, fontSize: 10, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)' }}>Loading photos</span>
              </motion.div>
            ) : filtered.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
                <span style={{ ...SANS, fontSize: 11, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)' }}>No photos</span>
                <span style={{ ...SANS, fontSize: 11, fontWeight: 400, color: 'var(--muted)', opacity: 0.5 }}>
                  {showFavorites ? 'Like some photos to see them here' : 'Try a different filter or search'}
                </span>
              </motion.div>
            ) : (
              <motion.div key={`view-${viewMode}-${activeFolder}-${showFavorites}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ flex: 1, overflowY: viewMode === 'horizontal' ? 'hidden' : 'auto', overflowX: 'hidden', paddingTop: viewMode === 'horizontal' ? 0 : 16, paddingBottom: viewMode === 'horizontal' ? 0 : 24 }}>
                {viewMode === 'grid' && <GridView photos={filtered} onSelect={setSelected} onLike={toggleLike} onMove={p => setMoveTarget(p)} onShare={handleShare} />}
                {viewMode === 'list' && <ListView photos={filtered} onSelect={setSelected} onLike={toggleLike} onMove={p => setMoveTarget(p)} onShare={handleShare} />}
                {viewMode === 'horizontal' && (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                    <HorizontalView photos={filtered} onSelect={setSelected} />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* right sidebar: timeline always */}
        <Timeline photos={photos} activeDate={activeDate} onSelect={setActiveDate} />
      </div>

      {/* status */}
      <StatusBar
        filtered={filtered.length} total={photos.length}
        activeTag={activeTag} activeDate={activeDate} search={search}
        viewMode={viewMode} loading={loading}
        activeFolder={activeFolder} folders={folders}
      />

      {/* lightbox */}
      <Lightbox
        photo={selected}
        onClose={() => setSelected(null)}
        onLike={toggleLike}
        onDownload={handleDownload}
        onShare={handleShare}
      />

      {/* move to folder modal */}
      <AnimatePresence>
        {moveTarget && (
          <MoveToFolderModal
            photo={moveTarget}
            folders={folders}
            onMove={folderId => moveToFolder(moveTarget.id, folderId)}
            onClose={() => setMoveTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
