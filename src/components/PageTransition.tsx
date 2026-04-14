'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/router'

export default function PageTransition({ children, loaded }: { children: React.ReactNode; loaded: boolean }) {
  const { pathname } = useRouter()

  return (
    <>
      {/* initial load — just reveal, no slide */}
      <div style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.01s' }}>
        {/* subsequent nav transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={false}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}
