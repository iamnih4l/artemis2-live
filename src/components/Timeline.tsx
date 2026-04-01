"use client"

import { useAppStore } from '@/lib/store'

const MILESTONES = [
  { id: 'liftoff', label: 'Liftoff', time: 0 },
  { id: 'meco', label: 'Main Engine Cutoff', time: 50 },
  { id: 'separation', label: 'Stage Separation', time: 120 },
  { id: 'orbit', label: 'Orbit Insertion', time: 300 },
  { id: 'tli', label: 'Translunar Inj.', time: 600 }, // Scaled down for demo purposes
]

export default function Timeline() {
  const missionTime = useAppStore(state => state.telemetry.missionTime)

  return (
    <div className="w-full h-full glass-panel flex flex-col p-4 relative overflow-x-auto overflow-y-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50 pointer-events-none z-10" />
      
      <div className="relative flex-1 flex items-center min-w-max px-12 z-0">
        <div className="absolute left-0 right-0 h-[2px] bg-white/10 top-1/2 -translate-y-1/2" />
        
        {/* Progress Line */}
        <div 
          className="absolute left-0 h-[2px] bg-[#00D1FF] top-1/2 -translate-y-1/2 shadow-[0_0_10px_#00D1FF] transition-all duration-1000 ease-linear"
          style={{ width: `${Math.min(100, Math.max(0, (missionTime / 600) * 100))}%` }}
        />

        <div className="flex justify-between w-full relative">
          {MILESTONES.map((m) => {
            const isPassed = missionTime >= m.time
            const isActive = missionTime >= m.time && (MILESTONES[MILESTONES.indexOf(m)+1]?.time > missionTime || !MILESTONES[MILESTONES.indexOf(m)+1])
            
            return (
              <div key={m.id} className="flex flex-col items-center relative group min-w-[200px]">
                <div 
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-500 z-10 bg-[#05070A] ${
                    isActive 
                      ? 'border-[#00D1FF] scale-150 shadow-[0_0_15px_#00D1FF]' 
                      : isPassed 
                        ? 'border-[#7B61FF] bg-[#7B61FF]' 
                        : 'border-white/20'
                  }`} 
                />
                <span className={`absolute top-6 text-xs whitespace-nowrap tracking-widest transition-colors ${
                  isActive ? 'text-[#00D1FF] font-bold glow-text' : isPassed ? 'text-white/80' : 'text-white/30'
                }`}>
                  {m.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
