// @ts-nocheck
import React, { useRef, useState, useEffect } from 'react';
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
  const [blinkScale, setBlinkScale] = useState(1);

  // Simple blink logic
  useEffect(() => {
    const blink = () => {
      setBlinkScale(0.1);
      setTimeout(() => setBlinkScale(1), 150);
      setTimeout(blink, 3000 + Math.random() * 3000);
    };
    const timer = setTimeout(blink, 3000);
    return () => clearTimeout(timer);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    // Head animation
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

  // Bubble styles
  const bubbleStyle = {
    background: 'white',
    padding: '16px 24px',
    borderRadius: '24px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
    border: '3px solid #f8fafc',
    minWidth: '180px',
    textAlign: 'center',
    pointerEvents: 'none',
    userSelect: 'none',
    position: 'relative',
    color: '#0f172a',
    fontFamily: '"Quicksand", sans-serif',
    fontSize: '18px',
    fontWeight: '900',
    lineHeight: '1.2',
  };

  const arrowStyle = {
    position: 'absolute',
    top: '50%',
    left: '-14px',
    transform: 'translateY(-50%)',
    width: 0,
    height: 0,
    borderTop: '12px solid transparent',
    borderBottom: '12px solid transparent',
    borderRight: '14px solid white',
  };

  return (
    <group position={position} ref={groupRef} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {/* --- WOOLLY BODY --- */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} />
      </mesh>

      {/* --- EXTRA FLUFF --- */}
      <mesh position={[0.7, 0.6, 0.1]}><sphereGeometry args={[0.45, 16, 16]} /><meshStandardMaterial color="#ffffff" /></mesh>
      <mesh position={[-0.7, 0.6, 0.1]}><sphereGeometry args={[0.45, 16, 16]} /><meshStandardMaterial color="#ffffff" /></mesh>
      <mesh position={[0, 0.8, -0.4]}><sphereGeometry args={[0.5, 16, 16]} /><meshStandardMaterial color="#ffffff" /></mesh>

      {/* --- THE FACE - PUSHED FAR FORWARD TO PREVENT BODY CLIPPING --- */}
      <group position={[0, 0.15, 1.2]} ref={headRef}>
        
        {/* FACE PLATE */}
        <mesh renderOrder={10}>
          <sphereGeometry args={[0.55, 32, 32]} scale={[1, 0.9, 0.3]} />
          <meshStandardMaterial color="#ffe4e1" roughness={0.3} />
        </mesh>

        {/* BIG BEAUTIFUL EYES */}
        <group position={[0, 0.1, 0.2]}>
          <mesh position={[-0.2, 0, 0]} renderOrder={11} scale={[1, blinkScale, 1]}>
            <sphereGeometry args={[0.13, 32, 32]} scale={[1, 1, 0.4]} />
            <meshBasicMaterial color="#000000" />
            {/* Sparkles */}
            <mesh position={[0.04, 0.04, 0.05]} renderOrder={12}>
              <sphereGeometry args={[0.035, 16, 16]} />
              <meshBasicMaterial color="white" />
            </mesh>
            <mesh position={[-0.03, -0.03, 0.05]} renderOrder={12}>
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshBasicMaterial color="white" />
            </mesh>
          </mesh>
          <mesh position={[0.2, 0, 0]} renderOrder={11} scale={[1, blinkScale, 1]}>
            <sphereGeometry args={[0.13, 32, 32]} scale={[1, 1, 0.4]} />
            <meshBasicMaterial color="#000000" />
            {/* Sparkles */}
            <mesh position={[0.04, 0.04, 0.05]} renderOrder={12}>
              <sphereGeometry args={[0.035, 16, 16]} />
              <meshBasicMaterial color="white" />
            </mesh>
            <mesh position={[-0.03, -0.03, 0.05]} renderOrder={12}>
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshBasicMaterial color="white" />
            </mesh>
          </mesh>
        </group>

        {/* CHEEKS */}
        <mesh position={[-0.3, -0.1, 0.18]} renderOrder={11}>
          <sphereGeometry args={[0.1, 16, 16]} scale={[1, 0.5, 0.1]} />
          <meshBasicMaterial color="#fda4af" transparent opacity={0.6} />
        </mesh>
        <mesh position={[0.3, -0.1, 0.18]} renderOrder={11}>
          <sphereGeometry args={[0.1, 16, 16]} scale={[1, 0.5, 0.1]} />
          <meshBasicMaterial color="#fda4af" transparent opacity={0.6} />
        </mesh>

        {/* ROUND MOUTH */}
        <mesh position={[0, -0.22, 0.18]} renderOrder={11}>
          <sphereGeometry args={[0.08, 32, 32]} scale={[1, 1.1, 0.15]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
      </group>

      {/* --- SPEECH BUBBLE - OFFSET TO THE RIGHT --- */}
      {message && (
        <Html position={[4.5, 1.2, 0]} center distanceFactor={10} zIndexRange={[100, 0]}>
          <div style={bubbleStyle}>
            <div style={arrowStyle}></div>
            <p style={{ margin: 0 }}>{message}</p>
          </div>
        </Html>
      )}

      {/* CLICK PROMPT */}
      <Html position={[0, -2.4, 0]} center>
        <div style={{ 
          color: 'rgba(255,255,255,0.2)', 
          fontSize: '11px', 
          fontWeight: '900', 
          textTransform: 'uppercase', 
          letterSpacing: '0.8em', 
          whiteSpace: 'nowrap',
          pointerEvents: 'none'
        }}>
          Click Shadow
        </div>
      </Html>
    </group>
  );
};

export default Shadow;
