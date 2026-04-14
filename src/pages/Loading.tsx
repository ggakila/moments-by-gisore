import { motion } from 'framer-motion'

export default function Loading() {
  return (
    <div style={{
      background: '#f5f4f0',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', width: '100vw', flexDirection: 'column', gap: 16,
    }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
        style={{
          width: 18, height: 18, borderRadius: '50%',
          border: '1.5px solid rgba(0,0,0,0.1)',
          borderTopColor: '#0a0a0a',
        }}
      />
      <p style={{
        color: 'rgba(0,0,0,0.3)', fontSize: 9,
        letterSpacing: '0.3em', textTransform: 'uppercase',
      }}>
        moments
      </p>
    </div>
  )
}
