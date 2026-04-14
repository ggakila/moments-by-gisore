'use client'
import { motion } from 'framer-motion'
import { Share2, Expand } from 'lucide-react'
import type { Photo } from '@/types'

interface PhotoCardProps {
  photo: Photo
  index: number
  onClick: (p: Photo) => void
}

export default function PhotoCard({ photo, index, onClick }: PhotoCardProps) {
  return (
    <motion.div
      className="masonry-item relative rounded-2xl overflow-hidden group cursor-none"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      data-cursor
      onClick={() => onClick(photo)}
      whileHover="hover"
    >
      <motion.img
        src={photo.preview}
        alt={photo.name}
        className="w-full block object-cover"
        style={{ borderRadius: '16px', display: 'block' }}
        variants={{ hover: { scale: 1.04 } }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Overlay */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-between p-3"
        style={{ borderRadius: '16px', background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%)' }}
        initial={{ opacity: 0 }}
        variants={{ hover: { opacity: 1 } }}
        transition={{ duration: 0.25 }}
      >
        {/* Top actions */}
        <div className="flex justify-end gap-1.5">
          <motion.button
            data-cursor
            className="w-7 h-7 rounded-full flex items-center justify-center cursor-none"
            style={{ background: 'rgba(0,0,0,0.5)', color: 'rgba(255,255,255,0.7)' }}
            whileHover={{ scale: 1.1 }}
            onClick={(e) => { e.stopPropagation() }}
          >
            <Share2 size={11} />
          </motion.button>
          <motion.button
            data-cursor
            className="w-7 h-7 rounded-full flex items-center justify-center cursor-none"
            style={{ background: 'rgba(0,0,0,0.5)', color: 'rgba(255,255,255,0.7)' }}
            whileHover={{ scale: 1.1 }}
            onClick={(e) => { e.stopPropagation(); onClick(photo) }}
          >
            <Expand size={11} />
          </motion.button>
        </div>

        {/* Bottom info */}
        <div>
          <p className="text-white text-xs font-medium capitalize leading-tight">{photo.name}</p>
          <p className="text-white/40 text-[10px] mt-0.5">{photo.category}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}
