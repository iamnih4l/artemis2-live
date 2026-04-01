"use client"

import { useScroll, motion } from 'framer-motion'
import { useRef } from 'react'
import { useAppStore } from '@/lib/store'
import dynamic from 'next/dynamic'

const HistoryScene = dynamic(() => import('./HistoryScene'), { ssr: false })

const SECTIONS = [
  {
    title: "The Apollo Legacy",
    text: "In 1972, Apollo 17 departed the lunar surface. For over 50 years, no human has returned. The frontier waited.",
  },
  {
    title: "The Orion Spacecraft",
    text: "Enter Artemis II. The first crewed flight of the Orion spacecraft propelled by the SLS rocket, designed to carry humans deeper than ever before.",
  },
  {
    title: "The Artemis II Crew",
    text: "Commander Reid Wiseman, Pilot Victor Glover, and Mission Specialists Christina Koch and Jeremy Hansen. The first humans to travel to the lunar vicinity in half a century.",
  },
  {
    title: "The Flyby Trajectory",
    text: "A 10-day mission. Orion will execute a translunar injection, coasting thousands of miles beyond the Moon to test life support systems on a free-return trajectory.",
  },
  {
    title: "Gateway to Mars",
    text: "We go not just to visit, but to stay. Artemis paves the way for the Lunar Gateway, humanity's stepping stone to Mars.",
  }
]

export default function HistoryOverlay() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    container: containerRef,
    offset: ["start start", "end end"]
  })

  return (
    <div className="w-full h-full relative bg-black overflow-hidden">
      
      {/* Dynamic 3D Scene rendered behind text */}
      <HistoryScene scrollY={scrollYProgress} />

      <div 
        ref={containerRef}
        className="w-full h-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scrollbar-hide relative z-10"
      >
        {/* Back Button */}
        <div className="fixed top-8 left-8 z-50">
          <button 
            onClick={() => useAppStore.getState().setPhase('live')}
            className="text-white/50 hover:text-white uppercase tracking-widest text-xs glass px-6 py-3 rounded-full transition-all hover:bg-white/10"
          >
            &larr; Return to Live
          </button>
        </div>

        {SECTIONS.map((section, idx) => (
          <Section 
            key={idx} 
            section={section} 
            index={idx} 
            isLast={idx === SECTIONS.length - 1} 
          />
        ))}
      </div>
    </div>
  )
}

function Section({ section, index, isLast }: { section: typeof SECTIONS[0], index: number, isLast: boolean }) {
  return (
    <div className="w-full h-screen snap-center relative flex items-center justify-center">
      {/* Gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none opacity-80" />
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: "-20%" }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center px-4 max-w-4xl"
      >
        <p className="text-[#00D1FF] tracking-[0.3em] text-sm md:text-base uppercase mb-6 font-bold drop-shadow-md">Chapter {index + 1}</p>
        <h2 className="text-4xl md:text-8xl font-bold text-white mb-8 tracking-tighter drop-shadow-lg">
          {section.title}
        </h2>
        <p className="text-lg md:text-3xl text-white/80 font-light leading-relaxed max-w-2xl mx-auto drop-shadow-md">
          {section.text}
        </p>

        {isLast && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-20 pt-20 border-t border-white/10"
          >
            <p className="tracking-widest text-[#7B61FF] mb-8 text-sm uppercase">You are now watching the next chapter.</p>
            <button 
              onClick={() => useAppStore.getState().setPhase('live')}
              className="glass px-8 py-4 rounded-full text-white uppercase tracking-[0.2em] hover:bg-white/10 transition-colors"
            >
              Enter Live Experience
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
