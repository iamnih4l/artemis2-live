import { useEffect } from 'react'
import { useAppStore } from '@/lib/store'

export function useTelemetry() {
  const currentPhase = useAppStore((state) => state.currentPhase)
  const updateTelemetry = useAppStore((state) => state.updateTelemetry)
  const launchTimestamp = useAppStore((state) => state.launchTimestamp)
  const hasLaunched = useAppStore((state) => state.hasLaunched)
  const triggerLaunch = useAppStore((state) => state.triggerLaunch)
  
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      let secondsSinceLaunch = Math.floor((now - launchTimestamp) / 1000)
      
      // Strict deterministic global launch check
      if (secondsSinceLaunch >= 0 && !hasLaunched) {
        triggerLaunch()
      }

      if (currentPhase !== 'live' && currentPhase !== 'history') return

      const missionTime = Math.floor((now - launchTimestamp) / 1000)
      
      let velocity = 0;
      let distEarth = 0;
      let distMoon = 384400;

      const t = secondsSinceLaunch

      if (t > 0) {
        if (t < 3600) {
          velocity = 28000 + (t / 3600) * 100;
          distEarth = 400 + (t / 3600) * 100;
        } else if (t < 7200) {
          velocity = 28000 + ((t - 3600) / 3600) * 11500;
          distEarth = 500 + ((t - 3600) / 3600) * 500;
        } else {
          const coastProgress = Math.min(1, (t - 7200) / 345600)
          velocity = Math.max(3000, 39500 - (coastProgress * 36500));
          distEarth = 1000 + (coastProgress * 380000);
          distMoon = 384400 - distEarth;
        }
      }

      updateTelemetry({
        velocity,
        distanceEarth: distEarth,
        distanceMoon: distMoon,
        missionTime: missionTime 
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [currentPhase, updateTelemetry, launchTimestamp, hasLaunched, triggerLaunch])
}
