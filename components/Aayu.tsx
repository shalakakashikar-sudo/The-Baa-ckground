// @ts-nocheck
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

// --- TYPES ---
type Emotion = 'happy' | 'thinking' | 'confused' | 'surprised';

interface AayuProps {
  position?: [number, number, number];
  emotion?: Emotion;
  message?: string | null;
  onClick: () => void;
}

const Aayu: React.FC<AayuProps> = ({ position = [0, 0, 0], emotion = 'happy', message, onClick }) => {
  const mainGroupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const [blinkScale, setBlinkScale] = useState(1);

  // --- 1. PROCEDURAL WOOL ---
  const woolParticles = useMemo(() => {
    const particles = [];
    const count = 50; 
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      particles.push({
        position: [
          0.85 * Math.sin(phi) * Math.cos(theta),
          0.85 * Math.sin(phi) * Math.sin(theta),
          0.85 * Math.cos(phi)
        ],
        scale: 0.35 + Math.random() * 0.2,
      });
    }
    // "Hair" fluff
    for (let i = 0; i < 15; i++) {
       particles.push({
        position: [
          (Math.random() - 0.5) * 0.7,
          0.9 + Math.random() * 0.4,
          (Math.random() - 0.5) * 0.5 + 0.3
        ],
        scale: 0.25 + Math.random() * 0.15,
       });
    }
    return particles;
  }, []);

  // --- 2. ROBUST BLINKING ---
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    // Controlled blink every ~4 seconds
    const blinkCycle = t % 4;
    if (blinkCycle > 3.85 && blinkCycle < 4.0) {
      setBlinkScale(0.1);
    } else {
      setBlinkScale(1);
    }

    // Body Animation (Breathing/Floating)
    if (mainGroupRef.current) {
      mainGroupRef.current.position.y = Math.sin(t * 2) * 0.15;
    }

    // Head Bobbing
    if (headRef.current) {
      let targetRotZ = 0;
      if (emotion === 'thinking') targetRotZ = 0.25; 
      else if (emotion === 'confused') targetRotZ = -0.2;
      else if (emotion === 'happy') targetRotZ = Math.sin(t * 3) * 0.08;

      headRef.current.rotation.z = THREE.MathUtils.lerp(headRef.current.rotation.z, targetRotZ, 0.1);
    }
  });

  // --- STYLES ---
  const bubbleStyle = {
    background: 'white',
    padding: '16px 24px',
    borderRadius: '24px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
    border: '4px solid #f8fafc',
    minWidth: '180px',
    maxWidth: '260px',
    textAlign: 'center',
    pointerEvents: 'none',
    color: '#1e293b',
    fontFamily: '"Quicksand", sans-serif',
    fontSize: '18px',
    fontWeight: '800',
    lineHeight: '1.3',
    position: 'relative',
    userSelect: 'none'
  };

  const arrowStyle = {
    position: 'absolute',
    top: '50%',
    left: '-16px',
    transform: 'translateY(-50%)',
    width: 0,
    height: 0,
    borderTop: '12px solid transparent',
    borderBottom: '12px solid transparent',
    borderRight: '16px solid white',
  };

  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      
      {/* 2.0x Overall Scaling */}
      <group ref={mainGroupRef} scale={[2.0, 2.0, 2.0]}>
        
        {/* ================= BODY ================= */}
        <group>
          {/* Core Sphere */}
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.8, 32, 32]} />
            <meshStandardMaterial color="#ffffff" roughness={1} />
          </mesh>

          {/* Procedural Wool */}
          {woolParticles.map((p, i) => (
            <mesh key={i} position={p.position} castShadow receiveShadow>
              <sphereGeometry args={[p.scale, 16, 16]} />
              <meshStandardMaterial color="#ffffff" roughness={0.9} />
            </mesh>
          ))}

          {/* Legs */}
          <group position={[0, -0.65, 0.5]}>
             <mesh position={[-0.3, 0, 0]} rotation={[0.4, 0.2, 0]} castShadow>
               <capsuleGeometry args={[0.12, 0.3, 4, 8]} />
               <meshStandardMaterial color="#795548" />
             </mesh>
             <mesh position={[0.3, 0, 0]} rotation={[0.4, -0.2, 0]} castShadow>
               <capsuleGeometry args={[0.12, 0.3, 4, 8]} />
               <meshStandardMaterial color="#795548" />
             </mesh>
          </group>
        </group>

        {/* ================= HEAD ================= */}
        {/* Pushed far forward to prevent wool clipping */}
        <group position={[0, 0.2, 0.95]} ref={headRef}>
          
          {/* Face Plate */}
          <mesh receiveShadow>
            <sphereGeometry args={[0.55, 32, 32]} scale={[1, 0.85, 0.5]} />
            <meshStandardMaterial color="#fff1e6" roughness={0.4} />
          </mesh>

          {/* Lop Ears */}
          <group position={[0, 0.2, 0]}>
             <group position={[-0.55, -0.1, 0]} rotation={[0, 0, 0.5]}>
                <mesh castShadow><capsuleGeometry args={[0.11, 0.5, 4, 16]} /><meshStandardMaterial color="#ffffff" /></mesh>
                <mesh position={[0, 0, 0.08]} scale={[0.6, 0.8, 0.2]}><capsuleGeometry args={[0.11, 0.5, 4, 16]} /><meshStandardMaterial color="#ffcdd2" /></mesh>
             </group>
             <group position={[0.55, -0.1, 0]} rotation={[0, 0, -0.5]}>
                <mesh castShadow><capsuleGeometry args={[0.11, 0.5, 4, 16]} /><meshStandardMaterial color="#ffffff" /></mesh>
                <mesh position={[0, 0, 0.08]} scale={[0.6, 0.8, 0.2]}><capsuleGeometry args={[0.11, 0.5, 4, 16]} /><meshStandardMaterial color="#ffcdd2" /></mesh>
             </group>
          </group>

          {/* Flower */}
          <group position={[0.4, 0.45, 0.2]} rotation={[0, 0, -0.4]}>
             <mesh><sphereGeometry args={[0.08, 16, 16]} /><meshStandardMaterial color="#fdd835" /></mesh>
             {[0, 72, 144, 216, 288].map((angle, i) => (
               <mesh key={i} position={[Math.cos(angle * Math.PI / 180) * 0.12, Math.sin(angle * Math.PI / 180) * 0.12, 0]}>
                 <sphereGeometry args={[0.08, 16, 16]} /><meshStandardMaterial color="#f06292" />
               </mesh>
             ))}
          </group>

          {/* Facial Features - Significant Z-offset for visibility */}
          <group position={[0, 0.05, 0.52]}>
            {/* Eyes */}
            <group position={[-0.18, 0, 0]} scale={[1, blinkScale, 1]}>
               <mesh><sphereGeometry args={[0.13, 32, 32]} scale={[1, 1.1, 0.2]} /><meshStandardMaterial color="#111111" roughness={0.1} /></mesh>
               <mesh position={[0.05, 0.05, 0.05]}><sphereGeometry args={[0.035, 16, 16]} /><meshBasicMaterial color="white" /></mesh>
            </group>
            <group position={[0.18, 0, 0]} scale={[1, blinkScale, 1]}>
               <mesh><sphereGeometry args={[0.13, 32, 32]} scale={[1, 1.1, 0.2]} /><meshStandardMaterial color="#111111" roughness={0.1} /></mesh>
               <mesh position={[0.05, 0.05, 0.05]}><sphereGeometry args={[0.035, 16, 16]} /><meshBasicMaterial color="white" /></mesh>
            </group>

            {/* Blush */}
            <mesh position={[-0.32, -0.15, 0.01]}><sphereGeometry args={[0.12, 16, 16]} scale={[1, 0.6, 0.1]} /><meshBasicMaterial color="#ff80ab" transparent opacity={0.4} /></mesh>
            <mesh position={[0.32, -0.15, 0.01]}><sphereGeometry args={[0.12, 16, 16]} scale={[1, 0.6, 0.1]} /><meshBasicMaterial color="#ff80ab" transparent opacity={0.4} /></mesh>

            {/* MOUTH AND NOSE - HIGHLY VISIBLE */}
            <group position={[0, -0.2, 0.1]}>
               {/* Nose */}
               <mesh position={[0, 0.08, 0.02]}><sphereGeometry args={[0.025, 16, 16]} scale={[1, 0.8, 0.4]} /><meshStandardMaterial color="#5d4037" /></mesh>
               
               {/* Mouth */}
               {emotion === 'surprised' ? (
                  <mesh position={[0, -0.05, 0.02]}>
                    <torusGeometry args={[0.045, 0.015, 16, 16]} />
                    <meshBasicMaterial color="#3e2723" />
                  </mesh>
               ) : (
                  <group scale={0.8} position={[0, -0.02, 0.02]}>
                     <mesh position={[-0.05, 0, 0]} rotation={[0, 0, 2.5]}>
                        <torusGeometry args={[0.05, 0.018, 12, 12, Math.PI]} />
                        <meshBasicMaterial color="#3e2723" />
                     </mesh>
                     <mesh position={[0.05, 0, 0]} rotation={[0, 0, -2.5]}>
                        <torusGeometry args={[0.05, 0.018, 12, 12, Math.PI]} />
                        <meshBasicMaterial color="#3e2723" />
                     </mesh>
                  </group>
               )}
            </group>
          </group>
        </group>
      </group>

      {/* ================= UI OVERLAYS ================= */}
      {message && (
        <Html position={[3.5, 3.5, 0]} center distanceFactor={12}>
          <div style={bubbleStyle} className="animate-in fade-in zoom-in duration-500">
            <div style={arrowStyle}></div>
            <p style={{ margin: 0 }}>{message}</p>
          </div>
        </Html>
      )}

      {/* Helper Prompt */}
      <Html position={[0, -3.8, 0]} center>
         <div style={{
            color: 'rgba(255,255,255,0.25)', fontSize: '12px', fontWeight: '900', 
            textTransform: 'uppercase', letterSpacing: '0.6em', whiteSpace: 'nowrap',
            pointerEvents: 'none'
         }}>
            Click Aayu
         </div>
      </Html>

    </group>
  );
};

export default Aayu;
