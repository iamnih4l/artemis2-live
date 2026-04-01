"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, X } from 'lucide-react'
import { useAppStore } from '@/lib/store'

export default function AIPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const currentPhase = useAppStore(state => state.currentPhase)

  return (
    <div className="fixed bottom-36 right-8 md:bottom-8 md:right-8 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="glass-panel p-6 mb-4 w-80 rounded-2xl border border-[#7B61FF]/30 relative overflow-hidden backdrop-blur-2xl bg-black/60 shadow-2xl shadow-[#7B61FF]/10 z-50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#7B61FF]/10 to-transparent pointer-events-none" />
            
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white"
            >
              <X size={16} />
            </button>
            
            <h3 className="text-[#7B61FF] text-xs font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
              <Info size={14} /> Mission Intelligence
            </h3>
            
            <p className="text-sm text-white/80 leading-relaxed font-light">
              {currentPhase === 'live' 
                ? "The Orion spacecraft is currently traversing cislunar space. Translunar injection has completed, and the crew is coasting towards the Moon's sphere of influence at high velocity."
                : "The launch system is nominal. T-0 marks the ignition of the RS-25 engines and solid rocket boosters, generating 8.8 million pounds of thrust."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass rounded-full px-6 py-3 border border-white/20 hover:border-[#7B61FF]/50 text-white/80 text-xs tracking-widest hover:text-white hover:bg-white/10 transition-all duration-300 flex items-center gap-2 shadow-xl z-50"
      >
        <span className="w-2 h-2 rounded-full bg-[#7B61FF] animate-pulse glow-box shadow-[#7B61FF]" />
        WHAT'S HAPPENING?
      </button>
    </div>
  )
}
