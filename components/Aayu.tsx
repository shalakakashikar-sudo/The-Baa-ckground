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
  const groupRef = useRef<THREE.Group>(null);
  const innerGroupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  
  // State for eye blinking (Open = 1, Closed = 0.1)
  const [blinkScale, setBlinkScale] = useState(1);

  // --- 1. PROCEDURAL FLUFF GENERATION ---
  // Tighter, softer cloud generation for that "cotton ball" look
  const woolParticles = useMemo(() => {
    const particles = [];
    // Body Fluff
    const count = 45; 
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
    // Head Top Fluff (The "Hair")
    for (let i = 0; i < 18; i++) {
       particles.push({
        position: [
          (Math.random() - 0.5) * 0.6,
          0.85 + Math.random() * 0.45,
          (Math.random() - 0.5) * 0.4 + 0.35
        ],
        scale: 0.25 + Math.random() * 0.15,
       });
    }
    return particles;
  }, []);

  // --- 2. BLINKING LOGIC ---
  useEffect(() => {
    const blink = () => {
      setBlinkScale(0.1);
      setTimeout(() => setBlinkScale(1), 150);
      setTimeout(blink, 3000 + Math.random() * 3000);
    };
    const timer = setTimeout(blink, 3000);
    return () => clearTimeout(timer);
  }, []);

  // --- 3. ANIMATION LOOP ---
  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Body Breathing - Animate ONLY the inner group to avoid conflicts with parent position or Float
    if (innerGroupRef.current) {
      innerGroupRef.current.position.y = Math.sin(t * 2.5) * 0.08;
    }

    // Head Bobbing
    if (headRef.current) {
      let targetRotZ = 0;
      let targetRotY = 0;

      if (emotion === 'thinking') targetRotZ = 0.2; 
      else if (emotion === 'confused') targetRotZ = -0.15;
      else if (emotion === 'happy') targetRotZ = Math.sin(t * 3) * 0.05;

      headRef.current.rotation.z = THREE.MathUtils.lerp(headRef.current.rotation.z, targetRotZ, 0.1);
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotY, 0.1);
    }
  });

  // --- STYLES ---
  const bubbleContainerStyle = {
    background: 'white',
    padding: '16px 24px',
    borderRadius: '24px',
    boxShadow: '0 15px 45px rgba(0,0,0,0.15)',
    border: '3px solid #f8fafc',
    minWidth: '160px',
    maxWidth: '280px',
    textAlign: 'center',
    pointerEvents: 'none',
    color: '#1e293b',
    fontFamily: '"Quicksand", sans-serif',
    position: 'relative',
    transform: 'translateY(-20px)',
    userSelect: 'none'
  };

  const bubbleArrowStyle = {
    position: 'absolute',
    top: '70%',
    left: '-12px',
    width: 0,
    height: 0,
    borderTop: '12px solid transparent',
    borderBottom: '12px solid transparent',
    borderRight: '14px solid white',
  };

  return (
    <group position={position} ref={groupRef} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      
      {/* INNER GROUP HANDLES LOCAL ANIMATION TO PREVENT POSITION OVERWRITING */}
      <group ref={innerGroupRef}>
        
        {/* ================= BODY ================= */}
        <group>
          {/* Base Mesh */}
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.8, 32, 32]} />
            <meshStandardMaterial color="#ffffff" roughness={1} />
          </mesh>

          {/* Procedural Fluff */}
          {woolParticles.map((p, i) => (
            <mesh key={i} position={p.position} castShadow receiveShadow>
              <sphereGeometry args={[p.scale, 16, 16]} />
              <meshStandardMaterial color="#ffffff" roughness={0.8} />
            </mesh>
          ))}

          {/* Cute Sitting Legs */}
          <group position={[0, -0.65, 0.6]}>
             <mesh position={[-0.35, 0, 0]} rotation={[0.5, 0.2, 0]} castShadow>
               <capsuleGeometry args={[0.13, 0.3, 4, 8]} />
               <meshStandardMaterial color="#795548" />
             </mesh>
             <mesh position={[0.35, 0, 0]} rotation={[0.5, -0.2, 0]} castShadow>
               <capsuleGeometry args={[0.13, 0.3, 4, 8]} />
               <meshStandardMaterial color="#795548" />
             </mesh>
          </group>
          
          {/* Little Arms */}
          <group position={[0, -0.1, 0.75]}>
             <mesh position={[-0.45, 0, 0]} rotation={[1.2, 0, 0.5]}>
               <capsuleGeometry args={[0.1, 0.25, 4, 8]} />
               <meshStandardMaterial color="#fff1e6" />
             </mesh>
             <mesh position={[0.45, 0, 0]} rotation={[1.2, 0, -0.5]}>
               <capsuleGeometry args={[0.1, 0.25, 4, 8]} />
               <meshStandardMaterial color="#fff1e6" />
             </mesh>
          </group>
        </group>

        {/* ================= HEAD ================= */}
        <group position={[0, 0.25, 0.9]} ref={headRef}>
          
          {/* Face Base */}
          <mesh receiveShadow renderOrder={5}>
            <sphereGeometry args={[0.55, 32, 32]} scale={[1, 0.85, 0.5]} />
            <meshStandardMaterial color="#fff1e6" roughness={0.4} />
          </mesh>

          {/* Lop Ears */}
          <group position={[0, 0.2, 0]}>
             <group position={[-0.58, -0.1, 0]} rotation={[0, 0, 0.5]}>
                <mesh castShadow>
                   <capsuleGeometry args={[0.12, 0.5, 4, 16]} />
                   <meshStandardMaterial color="#ffffff" />
                </mesh>
                <mesh position={[0, 0, 0.08]} scale={[0.6, 0.8, 0.2]}>
                   <capsuleGeometry args={[0.12, 0.5, 4, 16]} />
                   <meshStandardMaterial color="#ffcdd2" />
                </mesh>
             </group>
             <group position={[0.58, -0.1, 0]} rotation={[0, 0, -0.5]}>
                <mesh castShadow>
                   <capsuleGeometry args={[0.12, 0.5, 4, 16]} />
                   <meshStandardMaterial color="#ffffff" />
                </mesh>
                <mesh position={[0, 0, 0.08]} scale={[0.6, 0.8, 0.2]}>
                   <capsuleGeometry args={[0.12, 0.5, 4, 16]} />
                   <meshStandardMaterial color="#ffcdd2" />
                </mesh>
             </group>
          </group>

          {/* Flower Accessory */}
          <group position={[0.4, 0.48, 0.2]} rotation={[0, 0, -0.4]}>
             <mesh>
               <sphereGeometry args={[0.08, 16, 16]} />
               <meshStandardMaterial color="#fdd835" />
             </mesh>
             {[0, 72, 144, 216, 288].map((angle, i) => (
               <mesh key={i} position={[
                 Math.cos(angle * Math.PI / 180) * 0.12,
                 Math.sin(angle * Math.PI / 180) * 0.12,
                 0
               ]}>
                 <sphereGeometry args={[0.08, 16, 16]} />
                 <meshStandardMaterial color="#f06292" />
               </mesh>
             ))}
          </group>

          {/* Facial Features */}
          <group position={[0, 0.05, 0.42]}>
            {/* Glossy Eyes */}
            <group position={[-0.18, 0, 0]} scale={[1, blinkScale, 1]}>
               <mesh>
                  <sphereGeometry args={[0.14, 32, 32]} scale={[1, 1.1, 0.3]} />
                  <meshStandardMaterial color="#111111" roughness={0.05} />
               </mesh>
               <mesh position={[0.05, 0.05, 0.06]}>
                  <sphereGeometry args={[0.035, 16, 16]} />
                  <meshBasicMaterial color="white" />
               </mesh>
            </group>
            <group position={[0.18, 0, 0]} scale={[1, blinkScale, 1]}>
               <mesh>
                  <sphereGeometry args={[0.14, 32, 32]} scale={[1, 1.1, 0.3]} />
                  <meshStandardMaterial color="#111111" roughness={0.05} />
               </mesh>
               <mesh position={[0.05, 0.05, 0.06]}>
                  <sphereGeometry args={[0.035, 16, 16]} />
                  <meshBasicMaterial color="white" />
               </mesh>
            </group>

            {/* Blush */}
            <mesh position={[-0.32, -0.15, 0.01]}>
               <sphereGeometry args={[0.12, 16, 16]} scale={[1, 0.6, 0.1]} />
               <meshBasicMaterial color="#ff80ab" transparent opacity={0.4} />
            </mesh>
            <mesh position={[0.32, -0.15, 0.01]}>
               <sphereGeometry args={[0.12, 16, 16]} scale={[1, 0.6, 0.1]} />
               <meshBasicMaterial color="#ff80ab" transparent opacity={0.4} />
            </mesh>

            {/* Nose & Mouth */}
            <group position={[0, -0.18, 0.05]}>
               <mesh position={[0, 0.08, 0]}>
                 <sphereGeometry args={[0.025, 16, 16]} scale={[1, 0.8, 0.4]} />
                 <meshStandardMaterial color="#5d4037" />
               </mesh>
               {emotion === 'surprised' ? (
                  <mesh position={[0, -0.05, 0]}>
                    <torusGeometry args={[0.04, 0.012, 16, 16]} />
                    <meshBasicMaterial color="#5d4037" />
                  </mesh>
               ) : (
                  <group scale={0.7} position={[0, -0.02, 0]}>
                     <mesh position={[-0.05, 0, 0]} rotation={[0, 0, 2.5]}>
                        <torusGeometry args={[0.05, 0.015, 12, 12, Math.PI]} />
                        <meshBasicMaterial color="#5d4037" />
                     </mesh>
                     <mesh position={[0.05, 0, 0]} rotation={[0, 0, -2.5]}>
                        <torusGeometry args={[0.05, 0.015, 12, 12, Math.PI]} />
                        <meshBasicMaterial color="#5d4037" />
                     </mesh>
                  </group>
               )}
            </group>
          </group>
        </group>

      </group>

      {/* ================= UI OVERLAYS ================= */}
      
      {message && (
        <Html position={[3.8, 2.2, 0]} center distanceFactor={12} zIndexRange={[100, 0]}>
          <div style={bubbleContainerStyle} className="animate-in fade-in zoom-in duration-300">
            <div style={bubbleArrowStyle}></div>
            <p style={{ margin: 0, fontSize: '15px', fontWeight: '800', lineHeight: 1.4 }}>
              {message}
            </p>
          </div>
        </Html>
      )}

      {/* Click Prompt */}
      <Html position={[0, -2.3, 0]} center>
         <div style={{
            color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: '900', 
            textTransform: 'uppercase', letterSpacing: '0.4em', whiteSpace: 'nowrap'
         }}>
            Click Aayu
         </div>
      </Html>

    </group>
  );
};

export default Aayu;
