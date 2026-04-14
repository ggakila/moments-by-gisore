'use client'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Heart, Share2 } from 'lucide-react'
import type { Photo } from '@/types'

const SANS: React.CSSProperties = { fontFamily: "'Manrope', system-ui, sans-serif" }
const MONTH_LABELS: Record<string, string> = {
  '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
  '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
  '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec',
}

interface LightboxProps {
  photo: Photo | null
  onClose: () => void
  onLike: (id: string) => void
  onDownload: (p: Photo) => void
  onShare: (p: Photo) => void
}

export default function Lightbox({ photo, onClose, onLike, onDownload, onShare }: LightboxProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const dateLabel = photo?.date
    ? `${MONTH_LABELS[photo.date.split('-')[1]] ?? ''} ${photo.date.split('-')[0]}`
    : ''

  const iconBtnStyle: React.CSSProperties = {
    background: 'none', border: 'none', cursor: 'none',
    color: 'var(--muted)', transition: 'color 0.18s',
    display: 'flex', alignItems: 'center', padding: 6,
  }

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}>
          {/* backdrop */}
          <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', opacity: 0.97, backdropFilter: 'blur(20px)' }} />

          {/* top bar */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 52, zIndex: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            paddingLeft: 20, paddingRight: 20,
            borderBottom: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ ...SANS, fontSize: 14, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text)' }}>{photo.name}</span>
              <span style={{
                ...SANS, fontSize: 9, fontWeight: 500, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: 'var(--muted)',
                background: 'var(--surface)', border: '1px solid var(--border)',
                padding: '3px 8px', borderRadius: 3,
              }}>{photo.category}</span>
              {dateLabel && <span style={{ ...SANS, fontSize: 10, fontWeight: 400, color: 'var(--muted)' }}>{dateLabel}</span>}
              {photo.liked && <Heart size={12} fill="#ea4c89" color="#ea4c89" />}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button style={iconBtnStyle} data-cursor onClick={e => { e.stopPropagation(); onLike(photo.id) }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#ea4c89'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--muted)'} title="Like">
                <Heart size={16} fill={photo.liked ? '#ea4c89' : 'none'} color={photo.liked ? '#ea4c89' : undefined} />
              </button>
              <button style={iconBtnStyle} data-cursor onClick={e => { e.stopPropagation(); onShare(photo) }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--muted)'} title="Share">
                <Share2 size={16} />
              </button>
              <button style={iconBtnStyle} data-cursor onClick={e => { e.stopPropagation(); onDownload(photo) }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--muted)'} title="Download">
                <Download size={16} />
              </button>
              <button style={iconBtnStyle} data-cursor onClick={e => { e.stopPropagation(); onClose() }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--muted)'} title="Close">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* image */}
          <motion.div
            style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', paddingTop: 52 }}
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.97, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}>
            <img src={photo.preview} alt={photo.name}
              style={{ maxHeight: 'calc(100vh - 80px)', maxWidth: '90vw', objectFit: 'contain', display: 'block', borderRadius: 4 }} />
          </motion.div>

          {/* bottom hint */}
          <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 10 }}>
            <span style={{ ...SANS, fontSize: 9, fontWeight: 400, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', opacity: 0.4 }}>
              Press Esc to close
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
