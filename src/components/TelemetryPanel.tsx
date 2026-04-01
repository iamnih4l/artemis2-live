"use client"

import { useAppStore } from '@/lib/store'

export default function TelemetryPanel() {
  const telemetry = useAppStore(state => state.telemetry)

  const formatNumber = (num: number) => num.toLocaleString('en-US', { maximumFractionDigits: 0 })

  const formatMissionTime = (seconds: number) => {
    const isNegative = seconds < 0;
    const abs = Math.abs(seconds);
    const h = Math.floor(abs / 3600);
    const m = Math.floor((abs % 3600) / 60);
    const s = abs % 60;
    const prefix = isNegative ? 'T-' : 'T+';
    return `${prefix} ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  return (
    <div className="w-full h-full glass-panel p-6 flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#7B61FF]/10 blur-3xl rounded-full" />
      
      <h2 className="text-white/40 uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
        <span className="w-1 h-3 bg-[#7B61FF]" /> Mission Telemetry
      </h2>
      
      <div className="flex flex-col gap-8 flex-1 justify-center relative z-10">
        
        <div className="flex flex-col">
          <span className="text-white/40 text-xs tracking-widest mb-1">VELOCITY</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-mono font-bold text-white glow-text">{formatNumber(telemetry.velocity)}</span>
            <span className="text-white/30 text-sm font-mono">km/h</span>
          </div>
        </div>

        <div className="flex justify-between items-end border-b border-white/5 pb-4">
          <div className="flex flex-col">
            <span className="text-white/40 text-xs tracking-widest mb-1">DIST FROM EARTH</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono text-[#00D1FF]">{formatNumber(telemetry.distanceEarth)}</span>
              <span className="text-white/30 text-xs font-mono">km</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end border-b border-white/5 pb-4">
          <div className="flex flex-col">
            <span className="text-white/40 text-xs tracking-widest mb-1">DIST TO MOON</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono text-[#7B61FF]">{formatNumber(telemetry.distanceMoon)}</span>
              <span className="text-white/30 text-xs font-mono">km</span>
            </div>
          </div>
        </div>

        <div className="mt-auto bg-black/40 rounded-lg p-4 border border-white/5 flex items-center justify-between">
          <span className="text-white/50 text-xs tracking-widest">MISSION CLOCK</span>
          <span className="text-[#00D1FF] font-mono tracking-wider">{formatMissionTime(telemetry.missionTime)}</span>
        </div>
      </div>
    </div>
  )
}
