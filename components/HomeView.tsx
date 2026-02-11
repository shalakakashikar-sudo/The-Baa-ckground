import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment, Float } from '@react-three/drei';
import Shadow from './Shadow';

interface HomeViewProps {
  onLearn: () => void;
  onQuiz: () => void;
}

const PREPOSITION_TIPS = [
  "Use 'at' for points!",
  "Use 'in' for spaces!",
  "Use 'on' for surfaces!",
  "Into = Entering",
  "Onto = Landing",
  "Between = Two",
  "Among = Many",
  "By = Deadline",
  "Since = Start"
];

const HomeView: React.FC<HomeViewProps> = ({ onLearn, onQuiz }) => {
  const [tip, setTip] = useState<string>("Hi! I'm Shadow.");
  const [emotion, setEmotion] = useState<'happy' | 'thinking' | 'confused' | 'surprised'>('happy');

  const handleMascotClick = () => {
    const randomTip = PREPOSITION_TIPS[Math.floor(Math.random() * PREPOSITION_TIPS.length)];
    const emotions: ('happy' | 'thinking' | 'confused' | 'surprised')[] = ['happy', 'thinking', 'confused', 'surprised'];
    setTip("");
    setTimeout(() => {
      setTip(randomTip);
      setEmotion(emotions[Math.floor(Math.random() * emotions.length)]);
    }, 50);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-slate-950 overflow-hidden relative">
      {/* 3D Stage - Brighter lights and wider FOV */}
      <div className="w-full h-[500px] sm:h-[600px] cursor-pointer">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 14]} fov={36} />
          <Environment preset="city" />
          <ambientLight intensity={1.5} />
          <pointLight position={[5, 5, 10]} intensity={4} />
          <directionalLight position={[-10, 10, 10]} intensity={2.5} />
          
          <Suspense fallback={null}>
            <Float speed={2} rotationIntensity={0.02} floatIntensity={0.1}>
              <Shadow 
                position={[0, -0.4, 0]} 
                emotion={emotion} 
                message={tip}
                onClick={handleMascotClick}
              />
            </Float>
            <mesh position={[0, -3.2, 0]} rotation={[-Math.PI/2, 0, 0]}>
              <planeGeometry args={[15, 15]} />
              <meshBasicMaterial color="#000000" transparent opacity={0.3} />
            </mesh>
          </Suspense>
        </Canvas>
      </div>

      <div className="px-4 pb-16 w-full max-w-6xl flex flex-col items-center z-10 relative">
        <h2 className="font-brand text-[clamp(2.5rem,10vw,6rem)] font-black mb-4 text-white tracking-tighter whitespace-nowrap overflow-visible text-center leading-none">
          The Baa-ckground
        </h2>
        
        <p className="text-blue-300/40 mb-10 italic font-medium tracking-tight text-lg sm:text-2xl">
          "Learn Prepositions with Shadow"
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
          <button
            onClick={onLearn}
            className="flex-1 bg-white text-slate-950 font-black py-6 rounded-[2rem] transition-all hover:scale-105 active:scale-95 shadow-2xl text-xl"
          >
            Start Learning
          </button>
          <button
            onClick={onQuiz}
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-black py-6 rounded-[2rem] transition-all hover:scale-105 active:scale-95 border border-slate-800 text-xl"
          >
            Master Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
