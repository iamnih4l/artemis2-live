"use client"

import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, useTexture } from '@react-three/drei'
import React, { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { MotionValue } from 'framer-motion'

function Earth() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  const [colorMap, specularMap, cloudsMap, nightMap] = useTexture([
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
    'https://unpkg.com/three-globe/example/img/earth-night.jpg'
  ])

  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += 0.001
  })

  return (
    <group position={[0, -2, -5]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshStandardMaterial 
          map={colorMap}
          roughnessMap={specularMap}
          roughness={1}
          emissiveMap={nightMap}
          emissive={new THREE.Color(0xffeedd)}
          emissiveIntensity={1}
        />
        {/* Clouds */}
        <mesh>
          <sphereGeometry args={[3.05, 64, 64]} />
          <meshPhongMaterial
            map={cloudsMap}
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </mesh>
    </group>
  )
}

function Moon() {
  const meshRef = useRef<THREE.Mesh>(null)
  const [moonMap] = useTexture(['https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg'])

  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += 0.005
  })

  return (
    <mesh ref={meshRef} position={[20, 5, -20]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial map={moonMap} roughness={1} />
    </mesh>
  )
}

function Orion({ scrollY }: { scrollY: MotionValue<number> }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame(() => {
    if (meshRef.current) {
      const p = scrollY.get()
      meshRef.current.position.set(
        THREE.MathUtils.lerp(0, 20, p),
        THREE.MathUtils.lerp(-1, 5, p),
        THREE.MathUtils.lerp(-4, -18, p)
      )
      meshRef.current.rotation.x = p * Math.PI * 2
      meshRef.current.rotation.z = p * Math.PI
    }
  })

  return (
    <mesh ref={meshRef}>
      <coneGeometry args={[0.2, 0.6, 16]} />
      <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
      <pointLight color="#00D1FF" intensity={2} distance={2} position={[0,-0.4,0]} />
    </mesh>
  )
}

function CameraController({ scrollY }: { scrollY: MotionValue<number> }) {
  useFrame(({ camera }) => {
    const p = scrollY.get()
    const x = THREE.MathUtils.lerp(0, 22, p)
    const y = THREE.MathUtils.lerp(0, 5, p)
    const z = THREE.MathUtils.lerp(3, -15, p)
    
    camera.position.lerp(new THREE.Vector3(x, y, z), 0.05)
    
    const target = new THREE.Vector3(
      THREE.MathUtils.lerp(0, 20, p),
      THREE.MathUtils.lerp(-2, 5, p),
      THREE.MathUtils.lerp(-5, -20, p)
    )
    camera.lookAt(target)
  })
  return null
}

export default function HistoryScene({ scrollY }: { scrollY: MotionValue<number> }) {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
        <color attach="background" args={['#020202']} />
        <ambientLight intensity={0.1} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        
        <Stars radius={100} depth={50} count={3000} factor={4} />
        
        <React.Suspense fallback={null}>
          <Earth />
          <Moon />
        </React.Suspense>
        
        <Orion scrollY={scrollY} />
        <CameraController scrollY={scrollY} />
      </Canvas>
    </div>
  )
}
