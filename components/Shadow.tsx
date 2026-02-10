// @ts-nocheck
import React, { useRef, useMemo } from 'react';
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

const Shadow: React.FC<ShadowProps> = ({ position, emotion = 'happy', message, onClick }) => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  // Memoize fluff positions to prevent jitter
  const cloudFluff = useMemo(() => {
    const pieces = [];
    // Main body cluster - creating a dense cloud look
    for (let i = 0; i < 28; i++) {
      pieces.push({
        pos: [
          (Math.random() - 0.5) * 1.5,
          0.7 + (Math.random() - 0.5) * 1.0,
          (Math.random() - 0.5) * 1.2
        ],
        scale: 0.5 + Math.random() * 0.4
      });
    }
    // Crown fluff
    for (let i = 0; i < 10; i++) {
      pieces.push({
        pos: [
          0.7 + (Math.random() - 0.5) * 0.4,
          1.3 + (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.5
        ],
        scale: 0.35 + Math.random() * 0.25
      });
    }
    return pieces;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      // Gentle floating hover
      groupRef.current.position.y = position[1] + Math.sin(t * 1.4) * 0.08;
    }
    if (headRef.current) {
      // Expression-specific movements
      if (emotion === 'thinking') {
        headRef.current.rotation.z = Math.sin(t * 1.6) * 0.15;
      } else if (emotion === 'confused') {
        headRef.current.rotation.y = Math.sin(t * 4) * 0.1;
      } else {
        headRef.current.rotation.y = Math.sin(t * 0.8) * 0.05;
      }
    }
  });

  return (
    <group position={position} ref={groupRef} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {/* CLOUD BODY */}
      {cloudFluff.map((p, i) => (
        <mesh key={i} position={p.pos} castShadow>
          <sphereGeometry args={[p.scale, 20, 20]} />
          <meshStandardMaterial 
            color="#ffffff" 
            roughness={0.9} 
            metalness={0.1}
          />
        </mesh>
      ))}

      {/* THE FACE */}
      <group position={[0.75, 0.9, 0]} ref={headRef}>
        <mesh position={[0, 0, 0]} receiveShadow>
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshStandardMaterial color="#fff5f5" roughness={0.4} />
        </mesh>

        {/* EARS */}
        <group position={[-0.1, 0.22, 0]}>
          <mesh position={[0, 0, 0.38]} rotation={[0.5, 0, 0]}>
            <sphereGeometry args={[0.16, 16, 16]} scale={[1, 0.6, 1.6]} />
            <meshStandardMaterial color="#fff5f5" />
            <mesh position={[0.01, 0, 0]} scale={[0.8, 0.8, 0.8]}>
               <sphereGeometry args={[0.14, 16, 16]} />
               <meshStandardMaterial color="#fda4af" />
            </mesh>
          </mesh>
          <mesh position={[0, 0, -0.38]} rotation={[-0.5, 0, 0]}>
            <sphereGeometry args={[0.16, 16, 16]} scale={[1, 0.6, 1.6]} />
            <meshStandardMaterial color="#fff5f5" />
            <mesh position={[0.01, 0, 0]} scale={[0.8, 0.8, 0.8]}>
               <sphereGeometry args={[0.14, 16, 16]} />
               <meshStandardMaterial color="#fda4af" />
            </mesh>
          </mesh>
        </group>

        {/* EYES */}
        <group position={[0.3, 0.05, 0]}>
          <mesh position={[0, emotion === 'confused' ? 0.05 : 0, 0.16]}>
            <sphereGeometry 
              args={[emotion === 'surprised' ? 0.09 : 0.07, 16, 16]} 
              scale={[0.4, 1, 1]} 
            />
            <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0, -0.16]}>
            <sphereGeometry 
              args={[emotion === 'surprised' ? 0.09 : 0.07, 16, 16]} 
              scale={[0.4, 1, 1]} 
            />
            <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.8} />
          </mesh>
        </group>

        {/* MOUTH & NOSE */}
        <mesh position={[0.4, -0.04, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} scale={[0.5, 0.8, 1]} />
          <meshStandardMaterial color="#fb7185" />
        </mesh>
        
        <group position={[0.36, -0.16, 0]} rotation={[0, 0, Math.PI / 2]}>
          {emotion === 'surprised' ? (
            <mesh>
              <torusGeometry args={[0.04, 0.01, 8, 16]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
          ) : emotion === 'confused' ? (
            <mesh rotation={[0, 0, -Math.PI/2]}>
               <boxGeometry args={[0.1, 0.015, 0.01]} />
               <meshStandardMaterial color="#334155" />
            </mesh>
          ) : (
            <mesh>
              <torusGeometry args={[0.06, 0.012, 8, 16, Math.PI]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
          )}
        </group>
      </group>

      {/* COMPACT SPEECH BUBBLE - Positioned much higher to eliminate overlap */}
      {message && (
        <Html position={[0, 3.2, 0]} center distanceFactor={7}>
          <div className="bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-2xl border border-white/50 min-w-[120px] max-w-[200px] text-center animate-in zoom-in-75 fade-in duration-300 relative pointer-events-none">
            {/* Extended Pointer Triangle to reach down towards mascot */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-white/95"></div>
            <p className="text-[11px] font-bold text-slate-800 leading-tight m-0 select-none">
              {message}
            </p>
          </div>
        </Html>
      )}

      {/* CLICK PROMPT */}
      <Html position={[0, -0.8, 0]} center>
        <div className="text-[8px] font-black text-white/10 uppercase tracking-[0.4em] pointer-events-none select-none">
          Click Shadow
        </div>
      </Html>
    </group>
  );
};

export default Shadow;
