// @ts-nocheck
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

type Emotion = 'happy' | 'thinking' | 'confused' | 'surprised';

interface ShadowProps {
  position: [number, number, number];
  emotion?: Emotion;
  message?: string | null;
  onClick: () => void;
}

const Shadow: React.FC<ShadowProps> = ({ position = [0, 0, 0], emotion = 'happy', message, onClick }) => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.1;
    }
    if (headRef.current) {
      if (emotion === 'thinking') {
        headRef.current.rotation.z = Math.sin(t * 2) * 0.1;
      } else if (emotion === 'confused') {
        headRef.current.rotation.y = Math.sin(t * 5) * 0.2;
      } else {
        headRef.current.rotation.y = Math.sin(t * 0.8) * 0.1;
      }
    }
  });

  return (
    <group position={position} ref={groupRef} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {/* MAIN WOOLLY BODY - Clean single sphere */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={1} />
      </mesh>

      {/* ADDITIONAL FLUFF - Positioned to the sides and back */}
      <mesh position={[0.6, 0.6, 0.1]}><sphereGeometry args={[0.45, 16, 16]} /><meshStandardMaterial color="#ffffff" /></mesh>
      <mesh position={[-0.6, 0.6, 0.1]}><sphereGeometry args={[0.45, 16, 16]} /><meshStandardMaterial color="#ffffff" /></mesh>
      <mesh position={[0, 0.7, -0.3]}><sphereGeometry args={[0.55, 16, 16]} /><meshStandardMaterial color="#ffffff" /></mesh>

      {/* THE FACE - Moved very far forward (z: 1.05) to ensure it's never buried in the wool */}
      <group position={[0, 0.1, 1.05]} ref={headRef}>
        <mesh>
          <sphereGeometry args={[0.5, 32, 32]} scale={[1, 0.9, 0.1]} />
          <meshStandardMaterial color="#fef2f2" roughness={0.5} />
        </mesh>

        {/* EYES - Projecting forward and using pure black basic material (no shadows/lighting required) */}
        <group position={[0, 0.1, 0.1]}>
          <mesh position={[-0.18, 0, 0]}>
            <sphereGeometry args={[0.07, 16, 16]} scale={[1, 1.2, 0.5]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
          <mesh position={[0.18, 0, 0]}>
            <sphereGeometry args={[0.07, 16, 16]} scale={[1, 1.2, 0.5]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
        </group>

        {/* CHEEKS */}
        <mesh position={[-0.28, -0.1, 0.08]}><sphereGeometry args={[0.08, 12, 12]} scale={[1, 0.5, 0.1]} /><meshBasicMaterial color="#fda4af" transparent opacity={0.6} /></mesh>
        <mesh position={[0.28, -0.1, 0.08]}><sphereGeometry args={[0.08, 12, 12]} scale={[1, 0.5, 0.1]} /><meshBasicMaterial color="#fda4af" transparent opacity={0.6} /></mesh>

        {/* MOUTH - Pure black basic material for visibility */}
        <mesh position={[0, -0.15, 0.1]} rotation={[Math.PI, 0, 0]}>
          <torusGeometry args={[0.07, 0.012, 8, 16, Math.PI]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
      </group>

      {/* SPEECH BUBBLE - Increased distance (x: 3.5) to guarantee no overlap with mascot */}
      {message && (
        <Html position={[3.5, 1.2, 0]} center distanceFactor={10}>
          <div className="bg-white px-5 py-3 rounded-2xl shadow-2xl border-2 border-slate-100 min-w-[140px] max-w-[200px] text-center animate-in slide-in-from-left-4 duration-300 pointer-events-none select-none relative">
            <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[12px] border-r-white drop-shadow-md"></div>
            <p className="text-[13px] font-black text-slate-900 leading-tight m-0">{message}</p>
          </div>
        </Html>
      )}

      {/* CLICK PROMPT */}
      <Html position={[0, -1.5, 0]} center>
        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.6em] whitespace-nowrap">
          Click Shadow
        </div>
      </Html>
    </group>
  );
};

export default Shadow;
