"use client"

import { useAppStore } from '@/lib/store'

export default function TopBar() {
  const currentPhase = useAppStore(state => state.currentPhase)
  return (
    <header className="flex justify-between items-center glass px-6 py-4 rounded-2xl shrink-0 z-20">
      <div className="flex items-center gap-4">
        <div className="w-2 h-2 rounded-full bg-[#00D1FF] animate-pulse glow-box shadow-[#00D1FF]" />
        <h1 className="text-white font-bold tracking-widest text-lg">ARTEMIS II LIVE</h1>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-[#00D1FF] text-sm tracking-[0.2em] uppercase font-semibold">
          {currentPhase === 'live' ? 'IN FLIGHT' : 'COUNTDOWN'}
        </div>
        <button 
          onClick={() => useAppStore.getState().setPhase('history')}
          className="text-xs tracking-widest text-white/50 hover:text-white transition-colors uppercase border border-white/20 px-4 py-2 rounded-full hover:bg-white/10"
        >
          View History
        </button>
      </div>
    </header>
  )
}
