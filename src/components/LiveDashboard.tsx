"use client"

import TopBar from './TopBar'
import TelemetryPanel from './TelemetryPanel'
import VideoPanel from './VideoPanel'
import Timeline from './Timeline'
import dynamic from 'next/dynamic'

// Dynamically import ThreeScene to prevent SSR rendering issues with canvas
const ThreeScene = dynamic(() => import('./ThreeScene'), { ssr: false })

export default function LiveDashboard() {
  return (
    <div className="w-full h-full flex flex-col pt-6 pb-6 px-4 md:px-8 bg-transparent">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#00D1FF]/5 via-black to-black z-[-1]" />

      <TopBar />

      {/* Main 3-Column Layout */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-6 mt-6 relative z-10">
        
        {/* LEFT: 3D Scene */}
        <div className="flex-[2] relative rounded-2xl overflow-hidden bg-[#020202] border border-white/5 flex items-center justify-center shadow-2xl">
          <ThreeScene />
        </div>

        {/* CENTER: Telemetry */}
        <div className="flex-1 relative flex flex-col gap-6">
          <TelemetryPanel />
        </div>

        {/* RIGHT: Live Video */}
        <div className="flex-1 relative flex flex-col gap-6">
          <VideoPanel />
        </div>

      </div>

      {/* BOTTOM: Timeline */}
      <div className="h-28 mt-6 shrink-0 relative z-10">
        <Timeline />
      </div>
    </div>
  )
}
