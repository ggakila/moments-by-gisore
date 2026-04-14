'use client'
import { useRef, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import { Heart, FolderInput, Share2 } from 'lucide-react'
import type { Photo } from '@/types'

const SANS: React.CSSProperties = { fontFamily: "'Manrope', system-ui, sans-serif" }
const MONTH_LABELS: Record<string, string> = {
  '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
  '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
  '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec',
}

function ListRow({ photo, index, onClick, onLike, onMove, onShare }: {
  photo: Photo; index: number; onClick: (p: Photo) => void
  onLike: (id: string) => void; onMove: (p: Photo) => void; onShare: (p: Photo) => void
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-30px' })

  const iconBtnStyle: React.CSSProperties = {
    width: 26, height: 26, borderRadius: 5, border: 'none', cursor: 'none',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--surface)', color: 'var(--muted)',
    transition: 'all 0.2s ease',
  }

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, x: -12 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.03, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'grid', gridTemplateColumns: '52px 1fr auto auto auto auto',
        alignItems: 'center', gap: 12,
        padding: '10px 16px', borderBottom: '1px solid var(--border)',
        transition: 'background 0.2s ease',
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--surface)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
      {/* thumb */}
      <div style={{ width: 52, height: 38, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)', cursor: 'none' }} data-cursor onClick={() => onClick(photo)}>
        <img src={photo.preview} alt={photo.name} draggable={false}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
      {/* name */}
      <div style={{ minWidth: 0, cursor: 'none' }} data-cursor onClick={() => onClick(photo)}>
        <p style={{ ...SANS, fontWeight: 600, fontSize: 12, color: 'var(--text)', letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{photo.name}</p>
      </div>
      {/* category */}
      <span style={{ ...SANS, fontSize: 9, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', background: 'var(--surface)', border: '1px solid var(--border)', padding: '3px 8px', borderRadius: 3 }}>{photo.category}</span>
      {/* date */}
      <span style={{ ...SANS, fontSize: 10, fontWeight: 400, color: 'var(--muted)', fontVariantNumeric: 'tabular-nums', minWidth: 60, textAlign: 'right' }}>
        {photo.date ? `${MONTH_LABELS[photo.date.split('-')[1]]} ${photo.date.split('-')[0]}` : '—'}
      </span>
      {/* like */}
      <button style={iconBtnStyle} data-cursor onClick={e => { e.stopPropagation(); onLike(photo.id) }}>
        <Heart size={13} fill={photo.liked ? '#ea4c89' : 'none'} color={photo.liked ? '#ea4c89' : 'var(--muted)'} />
      </button>
      {/* move */}
      <button style={iconBtnStyle} data-cursor onClick={e => { e.stopPropagation(); onMove(photo) }}>
        <FolderInput size={13} />
      </button>
    </motion.div>
  )
}

function GroupHeader({ label, count }: { label: string; count: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 28, paddingBottom: 10, borderTop: '1px solid var(--border)', marginTop: -1 }}>
      <span style={{ ...SANS, fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>{label}</span>
      <span style={{ ...SANS, fontSize: 9, fontWeight: 400, color: 'var(--muted)', opacity: 0.5, background: 'var(--surface)', border: '1px solid var(--border)', padding: '1px 6px', borderRadius: 3 }}>{count}</span>
    </motion.div>
  )
}

interface ListViewProps {
  photos: Photo[]
  onSelect: (p: Photo) => void
  onLike: (id: string) => void
  onMove: (p: Photo) => void
  onShare: (p: Photo) => void
  groupBy?: 'category' | 'date'
}

export default function ListView({ photos, onSelect, onLike, onMove, onShare, groupBy = 'category' }: ListViewProps) {
  const groups = useMemo(() => {
    const map = new Map<string, Photo[]>()
    photos.forEach(p => {
      const key = groupBy === 'category' ? (p.category || 'Uncategorized') : (p.date || 'Unknown')
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(p)
    })
    const entries = Array.from(map.entries())
    if (groupBy === 'date') entries.sort((a, b) => b[0].localeCompare(a[0]))
    return entries.map(([label, photos]) => ({
      label: groupBy === 'date' ? `${MONTH_LABELS[label.split('-')[1]] ?? ''} ${label.split('-')[0]}` : label,
      photos,
    }))
  }, [photos, groupBy])

  let flatIndex = 0

  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr auto auto auto auto', alignItems: 'center', gap: 12, padding: '0 16px', marginBottom: 4 }}>
        <span />
        <span style={{ ...SANS, fontSize: 9, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', opacity: 0.5 }}>Name</span>
        <span style={{ ...SANS, fontSize: 9, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', opacity: 0.5, textAlign: 'center' }}>Category</span>
        <span style={{ ...SANS, fontSize: 9, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', opacity: 0.5, textAlign: 'right' }}>Date</span>
        <span /><span />
      </div>
      {groups.map(({ label, photos: gp }) => (
        <div key={label}>
          <GroupHeader label={label} count={gp.length} />
          {gp.map(photo => {
            const idx = flatIndex++
            return <ListRow key={photo.id} photo={photo} index={idx} onClick={onSelect} onLike={onLike} onMove={onMove} onShare={onShare} />
          })}
        </div>
      ))}
    </div>
  )
}
