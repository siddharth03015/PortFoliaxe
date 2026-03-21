'use client';
import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    meshRef.current.rotation.x = clock.getElapsedTime() * 0.15;
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.2;
  });
  return (
    <Sphere ref={meshRef} args={[1.8, 100, 200]} scale={1}>
      <MeshDistortMaterial
        color="#7c3aed"
        attach="material"
        distort={0.5}
        speed={2}
        roughness={0.1}
        metalness={0.8}
        transparent
        opacity={0.85}
      />
    </Sphere>
  );
}

function FloatingParticles() {
  return (
    <Stars
      radius={50}
      depth={50}
      count={3000}
      factor={3}
      saturation={0.5}
      fade
      speed={0.5}
    />
  );
}

function GlowRing() {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    meshRef.current.rotation.x = Math.PI / 2 + Math.sin(clock.getElapsedTime() * 0.3) * 0.2;
    meshRef.current.rotation.z = clock.getElapsedTime() * 0.1;
  });
  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[2.6, 0.04, 16, 100]} />
      <meshStandardMaterial
        color="#2563eb"
        emissive="#2563eb"
        emissiveIntensity={2}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

export default function ThreeScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#a78bfa" />
      <pointLight position={[-10, -10, -5]} intensity={1} color="#2563eb" />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#06b6d4" />
      <Suspense fallback={null}>
        <AnimatedSphere />
        <GlowRing />
        <FloatingParticles />
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  );
}
