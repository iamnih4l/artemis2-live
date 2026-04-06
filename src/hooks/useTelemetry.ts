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
        if (t <= 120) {
          // Liftoff to SRB Jettison (0 to 2 mins)
          // Speed to ~ 6000 km/h, Alt to ~ 45 km
          velocity = (t / 120) * 6000;
          distEarth = (t / 120) * 45;
        } else if (t <= 510) {
          // SRB Jettison to MECO (2 mins to 8.5 mins)
          // Speed to ~ 28000 km/h, Alt to ~ 160 km
          velocity = 6000 + ((t - 120) / 390) * 22000;
          distEarth = 45 + ((t - 120) / 390) * 115;
        } else if (t <= 5400) {
          // Earth Orbit (8.5 mins to 1.5 hours)
          // Speed ~ 28000 km/h (slowly fluctuating), Alt ~ 160 to 400 km
          velocity = 28000 + Math.sin(t / 100) * 50; 
          distEarth = 160 + ((t - 510) / 4890) * 240;
        } else if (t <= 6600) {
          // Trans-Lunar Injection (TLI) burn (1.5h to 1.83h)
          // Speed increases to 39500 km/h
          velocity = 28000 + ((t - 5400) / 1200) * 11500;
          distEarth = 400 + ((t - 5400) / 1200) * 600;
        } else {
          // Coast to Moon (up to 4 days)
          // Speed drops from 39500 to ~ 3000 km/h
          // Distance goes from 1000 to ~ 384400
          const coastTime = Math.min(t - 6600, 345600); // capped at 4 days
          const coastProgress = coastTime / 345600;
          
          velocity = Math.max(3000, 39500 - (coastProgress * 36500));
          distEarth = 1000 + (coastProgress * 383400);
          distMoon = Math.max(0, 384400 - distEarth);
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
