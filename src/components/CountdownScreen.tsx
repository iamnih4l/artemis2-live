"use client"

import { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/store'
import { motion } from 'framer-motion'

export default function CountdownScreen() {
  const { launchTimestamp, setPhase } = useAppStore()
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null)

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime()
      const distance = launchTimestamp - now

      if (distance <= 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 })
        return
      }

      setTimeLeft({
        d: Math.floor(distance / (1000 * 60 * 60 * 24)),
        h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((distance % (1000 * 60)) / 1000),
      })
    }

    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)
    return () => clearInterval(timer)
  }, [launchTimestamp])

  if (!timeLeft) return null

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center">
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0f172a] via-black to-black z-0 opacity-80" />
      <div 
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-screen" 
        style={{ filter: "grayscale(100%)" }} 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />

      {/* Content */}
      <div className="z-10 flex flex-col items-center gap-8 mt-20">
        <div className="flex flex-col items-center gap-2">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-white/60 tracking-[0.5em] text-sm md:text-base uppercase text-center"
          >
            Artemis II launches in...
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="text-[#00D1FF]/80 tracking-widest text-xs md:text-sm uppercase text-center max-w-xl leading-relaxed"
          >
            Taking off from Florida at 6:24 p.m. EDT on Wednesday, April 1.
          </motion.p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="flex gap-4 md:gap-8 items-center font-bold font-mono glow-text text-5xl md:text-8xl tracking-widest text-white"
        >
          <span className="text-[#00D1FF]">T -</span>
          {timeLeft.d > 0 && (
            <>
              <div className="flex flex-col items-center">
                <span>{String(timeLeft.d).padStart(2, '0')}</span>
                <span className="text-xs font-sans text-white/40 tracking-widest mt-2 font-normal">DAYS</span>
              </div>
              <span className="text-white/30">:</span>
            </>
          )}
          <div className="flex flex-col items-center">
            <span>{String(timeLeft.h).padStart(2, '0')}</span>
            <span className="text-xs font-sans text-white/40 tracking-widest mt-2 font-normal">HRS</span>
          </div>
          <span className="text-white/30">:</span>
          <div className="flex flex-col items-center">
            <span>{String(timeLeft.m).padStart(2, '0')}</span>
            <span className="text-xs font-sans text-white/40 tracking-widest mt-2 font-normal">MIN</span>
          </div>
          <span className="text-white/30">:</span>
          <div className="flex flex-col items-center text-[#00D1FF]">
            <span>{String(timeLeft.s).padStart(2, '0')}</span>
            <span className="text-xs font-sans text-white/40 tracking-widest mt-2 font-normal">SEC</span>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          onClick={() => setPhase('live')}
          disabled={timeLeft.d > 0 || timeLeft.h > 0 || timeLeft.m > 0 || timeLeft.s > 0}
          className="mt-16 px-10 py-4 rounded-full border border-white/20 glass text-white tracking-widest text-sm hover:bg-white/10 hover:border-[#00D1FF]/50 transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
          <span className="relative group-hover:glow-text group-hover:text-[#00D1FF] transition-colors duration-500">
            ENTER LIVE EXPERIENCE
          </span>
        </motion.button>
        
        {/* Developer Override */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          onClick={() => setPhase('live')}
          className="mt-6 text-white/20 text-[10px] tracking-widest hover:text-white/80 transition-colors uppercase cursor-pointer z-50 flex items-center justify-center p-2"
        >
          [ Bypass Launch Sequence ]
        </motion.button>
      </div>
    </div>
  )
}
