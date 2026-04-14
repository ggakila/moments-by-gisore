'use client'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Heart, FolderInput, Share2 } from 'lucide-react'
import type { Photo } from '@/types'

const SANS: React.CSSProperties = { fontFamily: "'Manrope', system-ui, sans-serif" }
const VARIANTS = [240, 300, 200, 340, 260, 320, 280, 360]
const MONTH_LABELS: Record<string, string> = {
  '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
  '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
  '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec',
}

function GridCard({ photo, index, onClick, onLike, onMove, onShare }: {
  photo: Photo; index: number; onClick: (p: Photo) => void
  onLike: (id: string) => void; onMove: (p: Photo) => void; onShare: (p: Photo) => void
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [hovered, setHovered] = useState(false)
  const h = VARIANTS[index % VARIANTS.length]

  const actionBtnStyle: React.CSSProperties = {
    width: 28, height: 28, borderRadius: '50%', border: 'none', cursor: 'none',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(0,0,0,0.5)', color: 'rgba(255,255,255,0.8)',
    backdropFilter: 'blur(4px)', transition: 'all 0.2s ease',
  }

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      data-cursor
      onClick={() => onClick(photo)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', borderRadius: 12, overflow: 'hidden',
        cursor: 'none', breakInside: 'avoid', marginBottom: 12,
        border: hovered ? '1px solid rgba(91,106,240,0.25)' : '1px solid var(--border)',
        background: 'var(--surface)',
        transition: 'all 0.35s ease',
        boxShadow: hovered
          ? '0 20px 50px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.04)'
          : '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}>
      <div style={{ width: '100%', height: h, overflow: 'hidden', position: 'relative' }}>
        <img src={photo.preview} alt={photo.name} draggable={false}
          style={{
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            transform: hovered ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)',
          }} />
        {/* subtle vignette always present */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.15) 100%)',
        }} />
      </div>

      {/* overlay */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', padding: 12,
        background: hovered
          ? 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 45%, transparent 100%)'
          : 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 40%)',
        opacity: hovered ? 1 : 0.75,
        transition: 'all 0.4s ease',
      }}>
        {/* top actions */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: 6,
          opacity: hovered ? 1 : 0, transform: hovered ? 'translateY(0)' : 'translateY(-6px)',
          transition: 'all 0.25s ease',
        }}>
          <button style={actionBtnStyle} onClick={e => { e.stopPropagation(); onLike(photo.id) }}
            data-cursor>
            <Heart size={12} fill={photo.liked ? '#ea4c89' : 'none'} color={photo.liked ? '#ea4c89' : '#fff'} />
          </button>
          <button style={actionBtnStyle} onClick={e => { e.stopPropagation(); onMove(photo) }} data-cursor>
            <FolderInput size={12} />
          </button>
          <button style={actionBtnStyle} onClick={e => { e.stopPropagation(); onShare(photo) }} data-cursor>
            <Share2 size={12} />
          </button>
        </div>

        {/* bottom info */}
        <div>
          <p style={{ ...SANS, fontWeight: 600, fontSize: 12, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
            {photo.name}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <span style={{
              ...SANS, fontSize: 8, fontWeight: 500, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)',
              background: 'rgba(255,255,255,0.12)', padding: '2px 7px', borderRadius: 3,
            }}>{photo.category}</span>
            {photo.date && (
              <span style={{ ...SANS, fontSize: 8, fontWeight: 400, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.45)' }}>
                {MONTH_LABELS[photo.date.split('-')[1]]} {photo.date.split('-')[0]}
              </span>
            )}
            {photo.liked && <Heart size={9} fill="#ea4c89" color="#ea4c89" />}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

interface GridViewProps {
  photos: Photo[]
  onSelect: (p: Photo) => void
  onLike: (id: string) => void
  onMove: (p: Photo) => void
  onShare: (p: Photo) => void
}

export default function GridView({ photos, onSelect, onLike, onMove, onShare }: GridViewProps) {
  return (
    <div className="photo-grid">
      {photos.map((photo, i) => (
        <GridCard key={photo.id} photo={photo} index={i} onClick={onSelect}
          onLike={onLike} onMove={onMove} onShare={onShare} />
      ))}
    </div>
  )
}
