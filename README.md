<div align="center">
  <img src="public/favicon.ico" alt="Artemis Logo" width="100"/>
  <h1>🚀 ARTEMIS II LIVE</h1>
  <p><b>Experience Humanity’s Return to the Moon natively in your browser.</b></p>
  <i>"We go not just to visit, but to stay."</i>
</div>

<br/>

An immersive, real-time, emotionally engaging web architecture tracking the upcoming Artemis II mission. Built with a cinematic combination of an Apple Keynote aesthetic + NASA Mission Control utilitarianism.

---

## 🌌 The Mission Features

- 🛰️ **T-0 Cinematic Launch Sequence:** Wait on the dashboard until launch time, and watch an ultra-realistic 3D Space Launch System (SLS) violently ignite and take over your screen as it thrusts into orbit.
- 📡 **Absolute True Telemetry:** A deterministic flight-path tracker synchronized exclusively to actual Artemis II scheduled milestones. Zero random mock variables—it simulates the actual Translunar Injection speeds!
- 🌎 **Photorealistic 3D Globe:** Deep space backgrounds, real global street light maps on the night side of the Earth, and dynamic orbiting components rendered at 60fps.
- 📜 **Scroll-Linked 3D Narrative:** Scroll through the historical chapters and watch the backdrop dynamically maneuver the 3D camera past the Earth, track the Orion capsule, and seamlessly enter a cinematic lunar orbit.
- 🎥 **NASA Live Broadcast Integration:** The dashboard directly taps into NASA's active 24/7 endpoint for live video coverage.

## 💻 Tech Stack Payload

* **Core Engine:** [Next.js App Router](https://nextjs.org/) + [React](https://react.dev/)
* **3D Renderer:** [Three.js](https://threejs.org/) & [@React-Three-Fiber](https://docs.pmnd.rs/) with `@react-three/drei`
* **Animation Thrusters:** [Framer Motion](https://www.framer.com/motion/)
* **Mission State Management:** [Zustand](https://github.com/pmndrs/zustand)
* **Visuals & Compositing:** [Tailwind CSS v4](https://tailwindcss.com/) with pure Glassmorphism utility overlays

---

## 👨‍🚀 Simulation Instructions (Local Setup)

Initialize the tracking station on your local machine:

```bash
# 1. Boot up dependencies
npm install

# 2. Ignite development server
npm run dev
```

*Open your visor at `http://localhost:3000` to enter the Mission Control dashboard.*

---
<div align="center">
  <b>Built for the final frontier.</b> 🌕
</div>
