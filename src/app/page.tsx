"use client"

import { useAppStore } from '@/lib/store'
import { useTelemetry } from '@/hooks/useTelemetry'
import CountdownScreen from '@/components/CountdownScreen'
import LaunchSequence from '@/components/LaunchSequence'
import LiveDashboard from '@/components/LiveDashboard'
import HistoryOverlay from '@/components/HistoryOverlay'
import { AnimatePresence, motion } from 'framer-motion'

export default function Home() {
  const currentPhase = useAppStore((state) => state.currentPhase)
  const showLaunchOverlay = useAppStore((state) => state.showLaunchOverlay)
  
  useTelemetry()

  return (
    <main className="w-full h-screen bg-black overflow-hidden font-sans">
      {/* Background dynamic elements shared across all screens */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="w-[500px] h-[500px] absolute top-[-250px] left-[-250px] bg-[#7B61FF]/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="w-[600px] h-[600px] absolute bottom-[-300px] right-[-300px] bg-[#00D1FF]/10 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      {/* Main Pages */}
      <AnimatePresence mode="wait">
        {currentPhase === 'countdown' && (
          <motion.div
            key="countdown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <CountdownScreen />
          </motion.div>
        )}

        {currentPhase === 'live' && (
          <motion.div
            key="live"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <LiveDashboard />
          </motion.div>
        )}

        {currentPhase === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} // smooth cinematic slide
            className="absolute inset-0 z-50"
          >
            <HistoryOverlay />
          </motion.div>
        )}
      </AnimatePresence>

      {/* T-0 Cinematic Overlay Layer */}
      <AnimatePresence>
        {showLaunchOverlay && (
          <motion.div
            key="launch-overlay"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-black"
          >
            <LaunchSequence />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
