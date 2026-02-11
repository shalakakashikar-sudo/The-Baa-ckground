// @ts-nocheck
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

// --- TYPES ---
type Emotion = 'happy' | 'thinking' | 'confused' | 'surprised';

interface ShadowProps {
  position: [number, number, number];
  emotion?: Emotion;
  message?: string | null;
  onClick: () => void;
}

/**
 * SHADOW THE SHEEP (V2 - Ultra Cute Edition)
 * * Major Upgrades:
 * 1. Procedural Wool: Uses random noise to generate a "cloud" of spheres for a fluffy body.
 * 2. Blinking System: Automatic interval-based blinking for realism.
 * 3. Dynamic Physics: Emotions change the bounce speed, rotation, and head tilt.
 * 4. Architecture: Separated into logical groups (Body, Face, HUD).
 */
const Shadow: React.FC<ShadowProps> = ({ position = [0, 0, 0], emotion = 'happy', message, onClick }) => {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  
  // State for eye blinking (Open = 1, Closed = 0.1)
  const [blinkScale, setBlinkScale] = useState(1);

  // --- 1. PROCEDURAL FLUFF GENERATION ---
  // We generate 40 random spheres to stick onto the main body. 
  // This creates a "cloud" silhouette instead of a perfect sphere.
  const woolParticles = useMemo(() => {
    const particles = [];
    const count = 40; 
    for (let i = 0; i < count; i++) {
      // Spherical coordinates to distribute fluff evenly around a center
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      
      particles.push({
        position: [
          0.85 * Math.sin(phi) * Math.cos(theta), // X
          0.85 * Math.sin(phi) * Math.sin(theta), // Y
          0.85 * Math.cos(phi)                    // Z
        ],
        scale: 0.25 + Math.random() * 0.2, // Random fluff sizes
        offset: Math.random() * 100 // Random animation offset
      });
    }
    return particles;
  }, []);

  // --- 2. BLINKING LOGIC ---
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkScale(0.1); // Close eyes
      setTimeout(() => setBlinkScale(1), 150); // Open eyes after 150ms
    }, 4000 + Math.random() * 2000); // Blink every 4-6 seconds

    return () => clearInterval(blinkInterval);
  }, []);

  // --- 3. ANIMATION LOOP ---
  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // A. BODY FLOAT (The "Breathing" Effect)
    if (groupRef.current) {
      let floatSpeed = 1.5;
      let floatHeight = 0.1;
      
      // Excited bounce if happy
      if (emotion === 'happy') { floatSpeed = 3; floatHeight = 0.15; }
      // Stiff if surprised
      if (emotion === 'surprised') { floatSpeed = 10; floatHeight = 0.05; }

      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        position[1] + Math.sin(t * floatSpeed) * floatHeight,
        0.1
      );
    }

    // B. HEAD EXPRESSION (Tilting and Looking)
    if (headRef.current) {
      let targetRotZ = 0;
      let targetRotY = 0;

      if (emotion === 'thinking') {
        targetRotZ = 0.3; // Tilt head to side
        targetRotY = Math.sin(t * 1) * 0.1; // Slow nod
      } else if (emotion === 'confused') {
        targetRotZ = -0.2;
        targetRotY = Math.sin(t * 3) * 0.2; // Shake head
      } else if (emotion === 'happy') {
        targetRotZ = Math.sin(t * 2) * 0.05; // Joyful wiggle
      }

      // Smoothly interpolate current rotation to target rotation
      headRef.current.rotation.z = THREE.MathUtils.lerp(headRef.current.rotation.z, targetRotZ, 0.1);
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotY, 0.1);
    }
  });

  // --- STYLES ---
  // Using inline styles to guarantee the UI looks perfect without Tailwind setup
  const bubbleContainerStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(4px)',
    padding: '16px 24px',
    borderRadius: '24px',
    boxShadow: '0 15px 35px rgba(0,0,100,0.15), 0 5px 15px rgba(0,0,0,0.05)',
    border: '2px solid white',
    minWidth: '180px',
    maxWidth: '280px',
    textAlign: 'center',
    pointerEvents: 'none',
    position: 'relative',
    color: '#334155',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  return (
    <group position={position} ref={groupRef} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      
      {/* ================= BODY GROUP ================= */}
      <group ref={bodyRef}>
        {/* Core Body Sphere (The base) */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.9, 32, 32]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.9} />
        </mesh>

        {/* Generated Fluff Particles (The Wool) */}
        {woolParticles.map((particle, i) => (
          <mesh key={i} position={particle.position} castShadow receiveShadow>
            <sphereGeometry args={[particle.scale, 16, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={1} />
          </mesh>
        ))}

        {/* Tiny Legs (Nubs) - Makes him look grounded */}
        <mesh position={[-0.4, -0.8, 0.3]} rotation={[0.2, 0, 0]} castShadow>
          <capsuleGeometry args={[0.12, 0.4, 4, 8]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0.4, -0.8, 0.3]} rotation={[0.2, 0, 0]} castShadow>
          <capsuleGeometry args={[0.12, 0.4, 4, 8]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>

      {/* ================= FACE GROUP ================= */}
      {/* Pushed forward Z: 1.15 to prevent clipping with wool */}
      <group position={[0, 0.1, 1.15]} ref={headRef}>
        
        {/* 1. Face Shape (Squircle-ish sphere) */}
        <mesh receiveShadow>
          <sphereGeometry args={[0.48, 32, 32]} scale={[1, 0.85, 0.4]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} /> {/* Dark face for contrast */}
        </mesh>

        {/* 2. Eyes Container */}
        <group position={[0, 0.05, 0.18]}>
          {/* Left Eye */}
          <group position={[-0.16, 0, 0]} scale={[1, blinkScale, 1]}>
             <mesh>
               <sphereGeometry args={[0.11, 32, 32]} />
               <meshStandardMaterial color="white" roughness={0.1} />
             </mesh>
             {/* Pupil */}
             <mesh position={[0, 0, 0.09]}>
               <sphereGeometry args={[0.06, 32, 32]} />
               <meshBasicMaterial color="black" />
             </mesh>
             {/* Sparkle (High Kawaii Factor) */}
             <mesh position={[0.03, 0.03, 0.1]}>
               <sphereGeometry args={[0.025, 8, 8]} />
               <meshBasicMaterial color="white" />
             </mesh>
          </group>

          {/* Right Eye */}
          <group position={[0.16, 0, 0]} scale={[1, blinkScale, 1]}>
             <mesh>
               <sphereGeometry args={[0.11, 32, 32]} />
               <meshStandardMaterial color="white" roughness={0.1} />
             </mesh>
             {/* Pupil */}
             <mesh position={[0, 0, 0.09]}>
               <sphereGeometry args={[0.06, 32, 32]} />
               <meshBasicMaterial color="black" />
             </mesh>
             {/* Sparkle */}
             <mesh position={[0.03, 0.03, 0.1]}>
               <sphereGeometry args={[0.025, 8, 8]} />
               <meshBasicMaterial color="white" />
             </mesh>
          </group>
        </group>

        {/* 3. Blush (Essential for cuteness) */}
        <group position={[0, -0.08, 0.14]}>
          <mesh position={[-0.26, 0, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} scale={[1, 0.6, 0.2]} />
            <meshBasicMaterial color="#ff7a98" transparent opacity={0.4} />
          </mesh>
          <mesh position={[0.26, 0, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} scale={[1, 0.6, 0.2]} />
            <meshBasicMaterial color="#ff7a98" transparent opacity={0.4} />
          </mesh>
        </group>

        {/* 4. Mouth (Dynamic based on emotion) */}
        <group position={[0, -0.16, 0.18]}>
          {emotion === 'surprised' ? (
            // "O" Mouth
            <mesh>
              <torusGeometry args={[0.04, 0.015, 8, 16]} />
              <meshBasicMaterial color="#cbd5e1" />
            </mesh>
          ) : emotion === 'happy' ? (
            // ":3" Cat Mouth shape
            <group scale={0.8}>
                <mesh position={[-0.04, 0, 0]} rotation={[0, 0, Math.PI + 0.5]}>
                    <torusGeometry args={[0.04, 0.01, 8, 8, Math.PI]} />
                    <meshBasicMaterial color="#cbd5e1" />
                </mesh>
                <mesh position={[0.04, 0, 0]} rotation={[0, 0, Math.PI - 0.5]}>
                    <torusGeometry args={[0.04, 0.01, 8, 8, Math.PI]} />
                    <meshBasicMaterial color="#cbd5e1" />
                </mesh>
            </group>
          ) : (
            // Small "-" Mouth
             <mesh rotation={[0,0,0]}>
               <capsuleGeometry args={[0.015, 0.04, 4, 8]} rotation={[0,0,Math.PI/2]} />
               <meshBasicMaterial color="#cbd5e1" />
             </mesh>
          )}
        </group>

        {/* 5. Ears (Floppy) */}
        <group position={[0, 0.2, -0.1]}>
           <mesh position={[-0.6, -0.1, 0]} rotation={[0, 0, 0.5]}>
             <capsuleGeometry args={[0.12, 0.5, 4, 16]} />
             <meshStandardMaterial color="#1e293b" />
           </mesh>
           <mesh position={[0.6, -0.1, 0]} rotation={[0, 0, -0.5]}>
             <capsuleGeometry args={[0.12, 0.5, 4, 16]} />
             <meshStandardMaterial color="#1e293b" />
           </mesh>
        </group>
      </group>

      {/* ================= UI OVERLAYS ================= */}
      
      {/* Speech Bubble - Moves to side of face */}
      {message && (
        <Html position={[2.8, 1.8, 0]} center distanceFactor={8} zIndexRange={[100, 0]}>
          <div style={bubbleContainerStyle} className="animate-in fade-in zoom-in duration-300">
            {/* The little triangle pointer */}
            <div style={{
              position: 'absolute', top: '60%', left: '-12px', width: 0, height: 0,
              borderTop: '10px solid transparent', borderBottom: '10px solid transparent',
              borderRight: '12px solid white'
            }}></div>
            
            <p style={{ margin: 0, fontSize: '15px', fontWeight: '800', lineHeight: 1.4 }}>
              {message}
            </p>
          </div>
        </Html>
      )}

      {/* Helper Text */}
      <Html position={[0, -2, 0]} center>
         <div style={{
            color: 'rgba(255,255,255,0.2)', fontSize: '12px', fontWeight: '900', 
            textTransform: 'uppercase', letterSpacing: '0.4em', whiteSpace: 'nowrap'
         }}>
            Click Me
         </div>
      </Html>

    </group>
  );
};

export default Shadow;