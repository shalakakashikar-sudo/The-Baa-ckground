// @ts-nocheck
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

type Emotion = 'happy' | 'thinking' | 'confused' | 'surprised';

interface ShadowProps {
  position: [number, number, number];
  emotion?: Emotion;
  prepositionContext?: string;
  message?: string | null;
  onClick: () => void;
}

const Shadow: React.FC<ShadowProps> = ({ position, emotion = 'happy', prepositionContext, message, onClick }) => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  // Generate a dense cloud of fluff for that extra puffy look
  const fluffParts = useMemo(() => {
    const parts = [];
    // Body cloud
    for (let i = 0; i < 20; i++) {
      parts.push({
        pos: [
          (Math.random() - 0.5) * 1.2,
          0.6 + (Math.random() - 0.5) * 0.8,
          (Math.random() - 0.5) * 1.0
        ],
        scale: 0.4 + Math.random() * 0.4
      });
    }
    // Head fluff
    for (let i = 0; i < 10; i++) {
      parts.push({
        pos: [
          0.6 + (Math.random() - 0.5) * 0.4,
          1.2 + (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4
        ],
        scale: 0.3 + Math.random() * 0.2
      });
    }
    return parts;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 1.2) * 0.05;
    }
    if (headRef.current) {
      if (emotion === 'thinking') {
        headRef.current.rotation.z = Math.sin(t * 2) * 0.1;
      } else if (emotion === 'confused') {
        headRef.current.rotation.y = Math.sin(t * 4) * 0.2;
      } else {
        headRef.current.rotation.y = Math.sin(t * 0.5) * 0.05;
      }
    }
  });

  return (
    <group position={position} ref={groupRef} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {/* CLOUD BODY & HEAD FLUFF */}
      {fluffParts.map((p, i) => (
        <mesh key={i} position={p.pos}>
          <sphereGeometry args={[p.scale, 16, 16]} />
          <meshStandardMaterial 
            color="#ffffff" 
            roughness={1} 
            emissive="#ffffff" 
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}

      {/* FACE GROUP */}
      <group position={[0.8, 0.85, 0]} ref={headRef}>
        {/* Face Base */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color="#fff1f2" roughness={0.5} />
        </mesh>

        {/* EARS */}
        <group position={[-0.1, 0.2, 0]}>
          {/* Left Ear */}
          <mesh position={[0, 0, 0.35]} rotation={[0.4, 0, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} scale={[1, 0.6, 1.5]} />
            <meshStandardMaterial color="#fff1f2" />
            <mesh position={[0, 0, 0.01]} scale={[0.8, 0.8, 0.8]}>
               <sphereGeometry args={[0.15, 16, 16]} />
               <meshStandardMaterial color="#fda4af" /> {/* Pink inner ear */}
            </mesh>
          </mesh>
          {/* Right Ear */}
          <mesh position={[0, 0, -0.35]} rotation={[-0.4, 0, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} scale={[1, 0.6, 1.5]} />
            <meshStandardMaterial color="#fff1f2" />
            <mesh position={[0, 0, -0.01]} scale={[0.8, 0.8, 0.8]}>
               <sphereGeometry args={[0.15, 16, 16]} />
               <meshStandardMaterial color="#fda4af" />
            </mesh>
          </mesh>
        </group>

        {/* EYES (Anime style) */}
        <group position={[0.25, 0.05, 0]}>
          {/* Left Eye */}
          <mesh position={[0, 0, 0.15]}>
            <sphereGeometry args={[emotion === 'surprised' ? 0.09 : 0.07, 16, 16]} scale={[0.5, 1, 1]} />
            <meshStandardMaterial color="#1e293b" />
            {/* Highlights */}
            <mesh position={[0.02, 0.03, 0.02]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshStandardMaterial color="white" emissive="white" />
            </mesh>
          </mesh>
          {/* Right Eye */}
          <mesh position={[0, 0, -0.15]}>
            <sphereGeometry args={[emotion === 'surprised' ? 0.09 : 0.07, 16, 16]} scale={[0.5, 1, 1]} />
            <meshStandardMaterial color="#1e293b" />
            {/* Highlights */}
            <mesh position={[0.02, 0.03, -0.02]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshStandardMaterial color="white" emissive="white" />
            </mesh>
          </mesh>
        </group>

        {/* NOSE & MOUTH */}
        <mesh position={[0.38, -0.05, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#fb7185" />
        </mesh>
        {/* Cute Smile Line */}
        <group position={[0.35, -0.15, 0]} rotation={[0, 0, Math.PI/2]}>
           <mesh>
             <torusGeometry args={[0.06, 0.01, 8, 16, Math.PI]} />
             <meshStandardMaterial color="#334155" />
           </mesh>
        </group>
      </group>

      {/* SPEECH BUBBLE */}
      {message && (
        <Html position={[0, 1.8, 0]} center distanceFactor={10}>
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-blue-100 min-w-[200px] text-center animate-in zoom-in-50 duration-300">
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r border-b border-blue-100"></div>
            <p className="text-[10px] font-black text-blue-500 mb-1 tracking-tighter uppercase">Shadow says:</p>
            <p className="text-xs font-bold text-slate-800 leading-tight">"{message}"</p>
          </div>
        </Html>
      )}

      {/* CLICK PROMPT */}
      <Html position={[0, -0.8, 0]} center>
        <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] pointer-events-none whitespace-nowrap">
          Click Mascot
        </div>
      </Html>
    </group>
  );
};

export default Shadow;
