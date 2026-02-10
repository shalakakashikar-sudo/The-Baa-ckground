
// Fix: Added @ts-nocheck to resolve type errors for Three.js intrinsic elements (mesh, group, etc.) in React Three Fiber
// @ts-nocheck
import React, { useState, Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float } from '@react-three/drei';
import { PrepositionPosition } from '../types';
import Shadow from './Shadow';

const Barn = () => (
  <group position={[-4, 0, -4]}>
    <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
      <boxGeometry args={[4, 3, 4]} />
      <meshStandardMaterial color="#991b1b" />
    </mesh>
    <mesh position={[0, 3.5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
      <coneGeometry args={[3.5, 2, 4]} />
      <meshStandardMaterial color="#450a0a" />
    </mesh>
    <mesh position={[0, 1, 2.01]} receiveShadow>
      <boxGeometry args={[1.5, 2, 0.1]} />
      <meshStandardMaterial color="#334155" />
    </mesh>
  </group>
);

const Tree = () => (
  <group position={[4, 0, 4]}>
    <mesh position={[0, 1.5, 0]} castShadow>
      <cylinderGeometry args={[0.3, 0.5, 3]} />
      <meshStandardMaterial color="#451a03" />
    </mesh>
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh position={[0, 3.5, 0]} castShadow>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshStandardMaterial color="#166534" />
      </mesh>
    </Float>
  </group>
);

const Fence = () => (
  <group position={[0, 0, 5]}>
    {[...Array(5)].map((_, i) => (
      <React.Fragment key={i}>
        <mesh position={[i * 1.5 - 3, 0.5, 0]} castShadow>
          <boxGeometry args={[0.2, 1, 0.2]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
      </React.Fragment>
    ))}
    <mesh position={[0, 0.8, 0]} castShadow>
       <boxGeometry args={[6, 0.15, 0.1]} />
       <meshStandardMaterial color="#78350f" />
    </mesh>
    <mesh position={[0, 0.4, 0]} castShadow>
       <boxGeometry args={[6, 0.15, 0.1]} />
       <meshStandardMaterial color="#78350f" />
    </mesh>
  </group>
);

const PondAndStream = () => (
  <group>
    <mesh position={[5, 0.02, -3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[2.5, 32]} />
      <meshStandardMaterial color="#0ea5e9" transparent opacity={0.8} />
    </mesh>
    <mesh position={[0, 0.01, -6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
       <planeGeometry args={[2, 20]} />
       <meshStandardMaterial color="#0ea5e9" transparent opacity={0.8} />
    </mesh>
  </group>
);

const Bridge = () => (
  <group position={[0, 0.1, -6]}>
    <mesh position={[0, 0.3, 0]} receiveShadow castShadow>
      <boxGeometry args={[3, 0.2, 2]} />
      <meshStandardMaterial color="#451a03" />
    </mesh>
    <mesh position={[0, 0.7, 1]} castShadow>
      <boxGeometry args={[3, 0.1, 0.1]} />
      <meshStandardMaterial color="#78350f" />
    </mesh>
    <mesh position={[0, 0.7, -1]} castShadow>
      <boxGeometry args={[3, 0.1, 0.1]} />
      <meshStandardMaterial color="#78350f" />
    </mesh>
  </group>
);

const Path = () => (
  <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
    <planeGeometry args={[1, 10]} />
    <meshStandardMaterial color="#d4d4d8" />
  </mesh>
);

const Rocks = () => (
  <group position={[-6, 0, 2]}>
    <mesh position={[0, 0.3, 0]} castShadow>
      <sphereGeometry args={[0.6, 8, 8]} />
      <meshStandardMaterial color="#475569" />
    </mesh>
    <mesh position={[0.8, 0.2, 0.5]} castShadow>
      <sphereGeometry args={[0.4, 8, 8]} />
      <meshStandardMaterial color="#64748b" />
    </mesh>
  </group>
);

const Flowers = () => (
  <group position={[6, 0, 6]}>
    {[...Array(6)].map((_, i) => (
      <mesh key={i} position={[Math.sin(i) * 0.8, 0.1, Math.cos(i) * 0.8]}>
        <sphereGeometry args={[0.1, 4, 4]} />
        <meshStandardMaterial color={i % 2 === 0 ? "#f472b6" : "#fcd34d"} />
      </mesh>
    ))}
  </group>
);

const MeadowView: React.FC<{ onQuiz: () => void, onBack: () => void }> = ({ onQuiz, onBack }) => {
  const [sheepPos, setSheepPos] = useState<PrepositionPosition>('IN_FRONT_OF_DOOR');
  const [targetCoords, setTargetCoords] = useState<[number, number, number]>([-4, 0, -1.5]);
  const [currentMessage, setCurrentMessage] = useState<string | null>("Hi! I'm Shadow.");
  const [sentence, setSentence] = useState<string>("Shadow is at the meadow.");
  const controlsRef = useRef();

  const setCameraView = (type: 'default' | 'top' | 'bird' | 'side') => {
    if (!controlsRef.current) return;
    switch (type) {
      case 'top':
        controlsRef.current.setLookAt(0, 30, 0, 0, 0, 0, true);
        break;
      case 'bird':
        controlsRef.current.setLookAt(20, 20, 20, 0, 0, 0, true);
        break;
      case 'side':
        controlsRef.current.setLookAt(25, 5, 0, 0, 0, 0, true);
        break;
      case 'default':
        controlsRef.current.setLookAt(12, 10, 15, 0, 0, 0, true);
        break;
    }
  };

  const updatePosition = (pos: PrepositionPosition) => {
    setSheepPos(pos);
    let coords: [number, number, number] = [0, 0, 0];
    let s = "";

    switch (pos) {
      case 'ON_ROOF': coords = [-4, 3, -4]; s = "Shadow is ON the barn roof."; break;
      case 'IN_BARN': coords = [-4, 0, -2.5]; s = "Shadow is IN the barn."; break;
      case 'UNDER_TREE': coords = [4, 0, 4]; s = "Shadow is UNDER the tree."; break;
      case 'BEHIND_FENCE': coords = [0, 0, 6.5]; s = "Shadow is BEHIND the fence."; break;
      case 'IN_FRONT_OF_DOOR': coords = [-4, 0, -1.5]; s = "Shadow is IN FRONT OF the door."; break;
      case 'BESIDE_POND': coords = [2.5, 0, -3]; s = "Shadow is BESIDE the pond."; break;
      case 'THROUGH_GATE': coords = [-3.5, 0, 5]; s = "Shadow walks THROUGH the gate."; break;
      case 'ACROSS_BRIDGE': coords = [0, 0.4, -6]; s = "Shadow is ACROSS the bridge."; break;
      case 'OVER_HOUSE': coords = [-4, 6, -4]; s = "Shadow is OVER the barn."; break;
      case 'AMONG_FLOWERS': coords = [6, 0, 6]; s = "Shadow is AMONG the flowers."; break;
      case 'BETWEEN_ROCKS': coords = [-5.6, 0, 2.2]; s = "Shadow is BETWEEN the rocks."; break;
      case 'ALONG_PATH': coords = [0, 0, -2]; s = "Shadow walks ALONG the path."; break;
      case 'TOWARD_EXIT': coords = [15, 0, 0]; s = "Shadow heads TOWARD the exit."; break;
      case 'FROM_HOME': coords = [-15, 0, -15]; s = "Shadow is FROM home."; break;
      case 'INTO_POND': coords = [5, -0.5, -3]; s = "Shadow jumps INTO the pond!"; break;
      case 'NEXT_TO_ROCK': coords = [-6.5, 0, 1.2]; s = "Shadow stands NEXT TO the rock."; break;
      case 'UPON_BARN': coords = [-4, 3.2, -4]; s = "Shadow rests UPON the barn."; break;
    }
    setTargetCoords(coords);
    setSentence(s);
    setTimeout(() => setCurrentMessage(null), 3000);
  };

  return (
    <div className="h-full relative flex flex-col bg-sky-400">
      <div className="flex-1">
        <Canvas shadows>
          <color attach="background" args={['#87ceeb']} />
          <PerspectiveCamera makeDefault position={[12, 10, 15]} fov={50} />
          <OrbitControls 
            ref={controlsRef}
            enablePan={true} 
            maxPolarAngle={Math.PI / 2.1} 
            minDistance={5}
            maxDistance={45}
          />
          <Environment preset="park" />
          <ambientLight intensity={0.7} />
          <directionalLight 
            position={[10, 20, 10]} 
            intensity={1.5} 
            castShadow 
            shadow-mapSize={[2048, 2048]}
          />
          
          <Suspense fallback={null}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[100, 100]} />
              <meshStandardMaterial color="#15803d" />
            </mesh>
            <Barn />
            <Tree />
            <Fence />
            <PondAndStream />
            <Bridge />
            <Path />
            <Rocks />
            <Flowers />
            <Shadow 
              position={targetCoords} 
              onClick={() => setCurrentMessage("Baaaa! Don't push!")}
              message={currentMessage}
              prepositionContext={sheepPos}
            />
          </Suspense>
        </Canvas>
      </div>

      <div className="absolute top-6 left-6 z-10 max-w-sm pointer-events-none">
        <div className="bg-white/90 backdrop-blur-xl p-6 rounded-[2rem] border border-blue-100 pointer-events-auto shadow-2xl overflow-y-auto max-h-[80vh]">
          <h3 className="font-brand font-bold text-lg text-blue-600 mb-1">Meadow Practice</h3>
          <p className="text-[10px] text-slate-500 mb-5 uppercase tracking-widest font-black">Visual Context Playground</p>
          
          <div className="flex gap-2 mb-4 pb-4 border-b border-slate-100">
            <button onClick={() => setCameraView('default')} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 text-[10px] font-bold">Reset</button>
            <button onClick={() => setCameraView('top')} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 text-[10px] font-bold">Top</button>
            <button onClick={() => setCameraView('bird')} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 text-[10px] font-bold">Bird's Eye</button>
            <button onClick={() => setCameraView('side')} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 text-[10px] font-bold">Side</button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'ON_ROOF', label: 'ON' },
              { id: 'IN_BARN', label: 'IN' },
              { id: 'UNDER_TREE', label: 'UNDER' },
              { id: 'BESIDE_POND', label: 'BESIDE' },
              { id: 'BETWEEN_ROCKS', label: 'BETWEEN' },
              { id: 'AMONG_FLOWERS', label: 'AMONG' },
              { id: 'BEHIND_FENCE', label: 'BEHIND' },
              { id: 'INTO_POND', label: 'INTO' },
              { id: 'THROUGH_GATE', label: 'THROUGH' },
              { id: 'ALONG_PATH', label: 'ALONG' },
              { id: 'IN_FRONT_OF_DOOR', label: 'IN FRONT' },
              { id: 'TOWARD_EXIT', label: 'TOWARD' },
              { id: 'NEXT_TO_ROCK', label: 'NEXT TO' },
              { id: 'ACROSS_BRIDGE', label: 'ACROSS' }
            ].map(btn => (
              <button
                key={btn.id}
                onClick={() => updatePosition(btn.id as PrepositionPosition)}
                className={`text-xs font-black py-2.5 px-3 rounded-xl transition-all border-2 ${
                  sheepPos === btn.id 
                  ? 'bg-blue-600 border-blue-400 text-white scale-105 shadow-lg shadow-blue-500/20' 
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-white hover:border-blue-400'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 w-full max-w-xl px-4">
        <div className="bg-white/80 backdrop-blur-xl text-slate-900 p-6 rounded-3xl shadow-2xl text-center font-brand font-bold text-2xl border border-white">
           {sentence.split(' ').map((word, i) => {
             const isPrep = word.toUpperCase() === word && word.length > 1 && word !== "SHADOW";
             return <span key={i} className={isPrep ? "text-blue-600 px-1" : "px-1"}>{word}</span>;
           })}
        </div>
      </div>

      <div className="absolute top-6 right-6 z-10 flex gap-3">
        <button onClick={onBack} className="bg-white/80 backdrop-blur-md text-slate-700 px-5 py-3 rounded-2xl hover:bg-white transition-all font-bold text-sm border border-white shadow-xl">← Academy Hub</button>
        <button onClick={onQuiz} className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-500 transition-all font-bold text-sm shadow-2xl shadow-blue-900/40">Final Quiz 🏆</button>
      </div>
    </div>
  );
};

export default MeadowView;
