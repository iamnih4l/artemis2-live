"use client"

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, useTexture } from '@react-three/drei'
import React, { useRef } from 'react'
import * as THREE from 'three'

function Earth() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  const [colorMap, specularMap, cloudsMap, nightMap] = useTexture([
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
    'https://unpkg.com/three-globe/example/img/earth-night.jpg'
  ])

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001
    }
  })

  return (
    <group>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[2, 64, 64]} />
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
          <sphereGeometry args={[2.05, 64, 64]} />
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

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.1
    if (meshRef.current) {
      meshRef.current.position.x = Math.sin(t) * 10
      meshRef.current.position.z = Math.cos(t) * 10
      meshRef.current.rotation.y += 0.005
    }
  })

  return (
    <mesh ref={meshRef} position={[10, 0, 0]}>
      <sphereGeometry args={[0.5, 64, 64]} />
      <meshStandardMaterial map={moonMap} roughness={1} />
    </mesh>
  )
}

function Orion() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.2
    if (meshRef.current) {
      meshRef.current.position.x = Math.sin(t) * 4
      meshRef.current.position.y = Math.sin(t * 0.5) * 1
      meshRef.current.position.z = Math.cos(t) * 4
      
      meshRef.current.rotation.x += 0.01
      meshRef.current.rotation.y += 0.02
    }
  })

  return (
    <mesh ref={meshRef}>
      <coneGeometry args={[0.08, 0.2, 8]} />
      <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
      <pointLight color="#7B61FF" intensity={1} distance={3} />
      {/* Engine glow */}
      <mesh position={[0, -0.15, 0]}>
        <pointLight color="#00D1FF" intensity={2} distance={1} />
      </mesh>
    </mesh>
  )
}

export default function ThreeScene() {
  return (
    <div className="w-full h-full absolute inset-0 cursor-move rounded-2xl overflow-hidden">
      <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
        <color attach="background" args={['#000000']} />
        
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        
        <ambientLight intensity={0.1} />
        <directionalLight position={[10, 5, 0]} intensity={2} color="#ffffff" />
        <directionalLight position={[-10, 0, 5]} intensity={0.2} color="#7B61FF" />

        <React.Suspense fallback={null}>
          <Earth />
          <Moon />
        </React.Suspense>
        
        <Orion />

        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          minDistance={3}
          maxDistance={30}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
      <div className="absolute bottom-4 left-4 text-white/30 text-xs tracking-widest font-mono pointer-events-none">
        [ DRAG TO ROTATE CAMS ]
      </div>
    </div>
  )
}
