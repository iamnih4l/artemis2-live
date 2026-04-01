"use client"

import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Line } from '@react-three/drei'
import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { useAppStore } from '@/lib/store'
import { motion } from 'framer-motion'

function Rocket() {
  const group = useRef<THREE.Group>(null)
  const engineRef = useRef<THREE.PointLight>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (group.current) {
      // Rocket ascends upward and slowly arcs
      group.current.position.y = -5 + (t * t * 2.5) 
      group.current.position.z = - (t * t * 0.4)
      group.current.rotation.x = - (t * 0.08)
      
      // Intense Shake during early flight
      if (t < 4) {
        group.current.position.x = (Math.random() - 0.5) * 0.05
      } else {
        group.current.position.x = 0
      }
    }
    
    if (engineRef.current) {
      engineRef.current.intensity = 15 + Math.random() * 5 // flickering engine
    }
  })

  // Ultra-Realistic Procedural Artemis SLS Block 1
  return (
    <group ref={group} position={[0, -5, 0]}>
      {/* 1. Core Stage (Orange Cryogenic Foam) */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 5, 32]} />
        {/* Deep burnt orange for foam */}
        <meshStandardMaterial color="#c66827" roughness={0.9} />
      </mesh>
      
      {/* Core Stage Engine Section (White bottom) */}
      <mesh position={[0, -0.7, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.5, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
      
      {/* Core Stage Interstage (White top) */}
      <mesh position={[0, 4.6, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.4, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>

      {/* 2. ICPS (Upper stage cylinder) */}
      <mesh position={[0, 5, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.5, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>

      {/* 3. Orion Spacecraft & Service Module */}
      <mesh position={[0, 5.4, 0]}>
        {/* Service Module */}
        <cylinderGeometry args={[0.22, 0.22, 0.4, 32]} />
        <meshStandardMaterial color="#silver" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 5.75, 0]}>
        {/* Orion Crew Module */}
        <coneGeometry args={[0.22, 0.3, 32]} />
        <meshStandardMaterial color="#bbbbbb" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* 4. Launch Abort System (LAS) Tower */}
      <mesh position={[0, 6.2, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>
      {/* LAS Nose */}
      <mesh position={[0, 6.65, 0]}>
        <coneGeometry args={[0.03, 0.1, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>

      {/* 5. Solid Rocket Boosters (SRBs) - Twin White with pointed tops */}
      {[-0.35, 0.35].map((x, i) => (
        <group position={[x, 1.8, 0]} key={i}>
          {/* Booster Body */}
          <mesh>
            <cylinderGeometry args={[0.08, 0.08, 4.5, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} />
          </mesh>
          {/* Booster Nose Cone */}
          <mesh position={[0, 2.45, 0]}>
            <coneGeometry args={[0.08, 0.4, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} />
          </mesh>
          {/* Booster Engine Skirt */}
          <mesh position={[0, -2.3, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.08, 0.12, 0.3, 16]} />
            <meshStandardMaterial color="#dddddd" roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* 6. Volumetric Engine Exhaust Plumes */}
      {/* Main RS-25 Engine Plume */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.1, 0.6, 2, 16]} />
        <meshBasicMaterial color="#00D1FF" transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Core Intense Inner Flame */}
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.05, 0.2, 1.5, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* SRB Engine Plumes */}
      {[-0.35, 0.35].map((x, i) => (
        <group position={[x, 0, 0]} key={`flame-${i}`}>
          <mesh position={[0, -1.6, 0]}>
            <cylinderGeometry args={[0.05, 0.4, 2.5, 16]} />
            <meshBasicMaterial color="#FF6A00" transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
          <mesh position={[0, -1.3, 0]}>
            <cylinderGeometry args={[0.02, 0.15, 2, 16]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        </group>
      ))}
      
      {/* Colossal Ignition Light */}
      <pointLight ref={engineRef} color="#FFaa00" intensity={15} distance={50} position={[0, -1, 0]} />
      {/* Secondary blue thrust light to illuminate the core */}
      <pointLight color="#00D1FF" intensity={5} distance={10} position={[0, -0.5, 0]} />
    </group>
  )
}

function TrajectoryLine() {
  const points = []
  for (let i = 0; i < 100; i++) {
    const t = i / 100;
    points.push(new THREE.Vector3(0, -5 + (t * t * 300), - (t * t * 60)))
  }
  
  return (
    <Line
      points={points}
      color="#00D1FF"
      lineWidth={2}
      dashed={true}
      dashScale={50}
      dashSize={2}
      dashOffset={0}
    />
  )
}

function CameraRig() {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime()
    if (t < 3) {
      // Violent shake right next to engines
      camera.position.x = (Math.random() - 0.5) * 0.15
      camera.position.y = -4 + (Math.random() - 0.5) * 0.15
      camera.position.z = 2.5
      camera.lookAt(0, -2, 0)
    } else {
      // Rapid pull back to reveal trajectory
      camera.position.lerp(new THREE.Vector3(8, 12, 18), 0.03)
      // Look slightly above the rocket core to track its path
      const target = new THREE.Vector3().lerp(new THREE.Vector3(0, 5 + (t * 5), -t * 2), 0.05)
      camera.lookAt(target)
    }
  })
  
  return null
}

export default function LaunchSequence() {
  const finishLaunch = useAppStore(state => state.finishLaunch)
  const [showText, setShowText] = useState(true)

  useEffect(() => {
    // Hide text early
    const t1 = setTimeout(() => setShowText(false), 2000)
    // End the cinematic and unmount from overlay after ~9 seconds
    const t2 = setTimeout(() => {
      finishLaunch()
    }, 9000) 
    
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [finishLaunch])

  return (
    <div className="w-full h-full relative bg-black overflow-hidden">
      <Canvas camera={{ position: [0, -3, 3], fov: 60 }}>
        <color attach="background" args={['#000000']} />
        
        <Stars radius={100} depth={50} count={5000} factor={4} />
        
        {/* Soft fill light */}
        <ambientLight intensity={0.4} />
        {/* Distinct directional light to give the cylinder a strong shadow edge */}
        <directionalLight position={[10, 5, 10]} intensity={2.5} color="#ffffff" castShadow />
        <directionalLight position={[-10, 0, -10]} intensity={0.5} color="#00D1FF" />
        
        <React.Suspense fallback={null}>
          <Rocket />
          <TrajectoryLine />
        </React.Suspense>

        <CameraRig />
      </Canvas>

      {/* Dramatic Overlay Text */}
      <motion.div 
        animate={{ opacity: showText ? 1 : 0, scale: showText ? 1 : 1.1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
      >
        <h1 className="text-white text-6xl md:text-9xl font-bold tracking-widest opacity-80" style={{ textShadow: "0 0 50px #ffbb00" }}>
          LIFTOFF
        </h1>
      </motion.div>
    </div>
  )
}
