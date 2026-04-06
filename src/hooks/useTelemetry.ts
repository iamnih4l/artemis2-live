import { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/store'

interface TelemetryPoint {
  t: number;
  velocity: number;
  distanceEarth: number;
  distanceMoon: number;
}

export function useTelemetry() {
  const currentPhase = useAppStore((state) => state.currentPhase)
  const updateTelemetry = useAppStore((state) => state.updateTelemetry)
  const launchTimestamp = useAppStore((state) => state.launchTimestamp)
  const hasLaunched = useAppStore((state) => state.hasLaunched)
  const triggerLaunch = useAppStore((state) => state.triggerLaunch)
  const [dataPoints, setDataPoints] = useState<TelemetryPoint[]>([])

  useEffect(() => {
    fetch('/telemetry.json')
      .then(res => res.json())
      .then(data => setDataPoints(data))
      .catch(err => console.error("Could not load telemetry feed:", err))
  }, [])
  
  useEffect(() => {
    if (dataPoints.length === 0) return;

    const interval = setInterval(() => {
      const now = new Date().getTime()
      let secondsSinceLaunch = Math.floor((now - launchTimestamp) / 1000)
      
      if (secondsSinceLaunch >= 0 && !hasLaunched) {
        triggerLaunch()
      }

      if (currentPhase !== 'live' && currentPhase !== 'history') return

      const missionTime = Math.floor((now - launchTimestamp) / 1000)
      const t = secondsSinceLaunch

      if (t <= 0) {
        updateTelemetry({
          velocity: 0,
          distanceEarth: 0,
          distanceMoon: 384400,
          missionTime: missionTime 
        })
        return;
      }

      // Linear Interpolation
      let p1 = dataPoints[0];
      let p2 = dataPoints[dataPoints.length - 1];

      for (let i = 0; i < dataPoints.length - 1; i++) {
        if (t >= dataPoints[i].t && t <= dataPoints[i+1].t) {
          p1 = dataPoints[i];
          p2 = dataPoints[i+1];
          break;
        }
      }

      if (t >= p2.t) {
        updateTelemetry({
          velocity: p2.velocity,
          distanceEarth: p2.distanceEarth,
          distanceMoon: p2.distanceMoon,
          missionTime: missionTime 
        })
      } else {
        const progress = (t - p1.t) / (p2.t - p1.t);
        
        const velocity = p1.velocity + (p2.velocity - p1.velocity) * progress;
        const distanceEarth = p1.distanceEarth + (p2.distanceEarth - p1.distanceEarth) * progress;
        const distanceMoon = p1.distanceMoon + (p2.distanceMoon - p1.distanceMoon) * progress;

        updateTelemetry({
          velocity,
          distanceEarth,
          distanceMoon,
          missionTime: missionTime 
        })
      }
    }, 1000) // 1 FPS update for the telemetry dials

    return () => clearInterval(interval)
  }, [currentPhase, updateTelemetry, launchTimestamp, hasLaunched, triggerLaunch, dataPoints])
}
