import { create } from 'zustand'

export type AppPhase = 'countdown' | 'live' | 'history'

interface TelemetryData {
  velocity: number
  distanceEarth: number
  distanceMoon: number
  missionTime: number // seconds since launch
}

interface AppState {
  currentPhase: AppPhase
  launchTimestamp: number
  hasLaunched: boolean
  showLaunchOverlay: boolean
  telemetry: TelemetryData
  setPhase: (phase: AppPhase) => void
  updateTelemetry: (data: Partial<TelemetryData>) => void
  triggerLaunch: () => void
  finishLaunch: () => void
}

// Launch in 15 seconds relative to when the app loads so we can test the sequence
const ARTEMIS_2_LAUNCH = Date.now() + 15000
export const useAppStore = create<AppState>((set) => ({
  currentPhase: 'countdown',
  launchTimestamp: ARTEMIS_2_LAUNCH,
  hasLaunched: false,
  showLaunchOverlay: false,
  telemetry: {
    velocity: 0,
    distanceEarth: 0,
    distanceMoon: 384400,
    missionTime: 0,
  },
  setPhase: (phase) => set({ currentPhase: phase }),
  updateTelemetry: (data) =>
    set((state) => ({ telemetry: { ...state.telemetry, ...data } })),
  triggerLaunch: () => set({ hasLaunched: true, showLaunchOverlay: true, currentPhase: 'live' }),
  finishLaunch: () => set({ showLaunchOverlay: false }),
}))
