'use client'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TextRevealProps {
  text: string
  className?: string
  delay?: number
  stagger?: number
}

export function TextReveal({ text, className, delay = 0, stagger = 0.04 }: TextRevealProps) {
  const words = text.split(' ')
  return (
    <span className={cn('inline-flex flex-wrap gap-x-[0.25em]', className)}>
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden inline-block">
          <motion.span
            className="inline-block"
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ duration: 0.7, delay: delay + i * stagger, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

export function CharReveal({ text, className, delay = 0 }: TextRevealProps) {
  return (
    <span className={cn('inline-flex', className)}>
      {text.split('').map((char, i) => (
        <span key={i} className="overflow-hidden inline-block">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 0.5, delay: delay + i * 0.03, ease: [0.16, 1, 0.3, 1] }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
