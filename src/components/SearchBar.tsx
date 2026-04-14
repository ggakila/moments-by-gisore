'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ArrowUp } from 'lucide-react'

interface SearchBarProps {
  onSearch: (q: string) => void
}

const SUGGESTIONS = ['nairobi', 'people', 'africa', 'urban', 'art', 'nature', 'cityscape']

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const submit = (q?: string) => {
    const query = q ?? value
    onSearch(query)
    if (q !== undefined) setValue(q)
  }

  const clear = () => { setValue(''); onSearch('') }

  return (
    <div
      className="flex-shrink-0 relative px-6 py-4"
      style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: '#080808' }}
    >
      {/* Suggestion chips */}
      <AnimatePresence>
        {focused && !value && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-full left-6 right-6 mb-2 flex gap-2 flex-wrap pb-1"
          >
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                data-cursor
                onMouseDown={() => submit(s)}
                className="px-3 py-1.5 rounded-full text-xs cursor-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.4)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.09)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)' }}
              >
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <form
        onSubmit={(e) => { e.preventDefault(); submit() }}
        className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200"
        style={{
          background: '#111',
          border: focused
            ? '1px solid rgba(234,76,137,0.35)'
            : '1px solid rgba(255,255,255,0.07)',
          boxShadow: focused ? '0 0 0 3px rgba(234,76,137,0.08)' : 'none',
        }}
      >
        <Search
          size={14}
          style={{
            color: focused ? '#ea4c89' : 'rgba(255,255,255,0.2)',
            flexShrink: 0,
            transition: 'color 0.2s',
          }}
        />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => { setValue(e.target.value); if (!e.target.value) onSearch('') }}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Search photos… try 'nairobi' or 'people'"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/20"
          style={{ color: '#f0f0f0', caretColor: '#ea4c89' }}
        />
        <AnimatePresence>
          {value && (
            <motion.button
              type="button"
              data-cursor
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              onClick={clear}
              className="cursor-none flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}
            >
              <X size={10} />
            </motion.button>
          )}
        </AnimatePresence>
        <motion.button
          type="submit"
          data-cursor
          whileTap={{ scale: 0.92 }}
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 cursor-none transition-all duration-200"
          style={{
            background: value ? '#ea4c89' : 'rgba(255,255,255,0.06)',
            color: value ? '#fff' : 'rgba(255,255,255,0.25)',
          }}
        >
          <ArrowUp size={13} />
        </motion.button>
      </form>
    </div>
  )
}
