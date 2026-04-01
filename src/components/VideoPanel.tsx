"use client"

export default function VideoPanel() {
  return (
    <div className="w-full h-full glass-panel flex flex-col p-2 overflow-hidden relative">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <h2 className="text-white/40 uppercase tracking-widest text-xs flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Live Broadcast
        </h2>
      </div>
      
      <div className="flex-1 relative w-full mt-2 rounded-lg overflow-hidden bg-black">
        <iframe 
          className="absolute inset-0 w-full h-full pointer-events-auto"
          src="https://www.youtube.com/embed/Tf_UjBMIzNo?si=T12AjMacy1HANK5Z&autoplay=1&mute=1" 
          title="YouTube video player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerPolicy="strict-origin-when-cross-origin" 
          allowFullScreen
        ></iframe>
      </div>
    </div>
  )
}
