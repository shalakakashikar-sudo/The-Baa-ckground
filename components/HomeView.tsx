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
      {/* 3D Stage - Adjusted FOV to accommodate distant speech bubble */}
      <div className="w-full h-[400px] sm:h-[500px] cursor-pointer">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={32} />
          <Environment preset="city" />
          <ambientLight intensity={1.0} />
          <pointLight position={[5, 5, 5]} intensity={2.5} />
          <directionalLight position={[-5, 5, 5]} intensity={1.5} />
          
          <Suspense fallback={null}>
            <Float speed={2} rotationIntensity={0.05} floatIntensity={0.15}>
              <Shadow 
                position={[0, -0.6, 0]} 
                emotion={emotion} 
                message={tip}
                onClick={handleMascotClick}
              />
            </Float>
            {/* Soft floor shadow */}
            <mesh position={[0, -2.4, 0]} rotation={[-Math.PI/2, 0, 0]}>
              <planeGeometry args={[8, 8]} />
              <meshBasicMaterial color="#000000" transparent opacity={0.25} />
            </mesh>
          </Suspense>
        </Canvas>
      </div>

      <div className="px-4 pb-16 w-full max-w-5xl flex flex-col items-center z-10 relative">
        {/* Strictly single line title with optimized scaling */}
        <h2 className="font-brand text-[clamp(2.5rem,8vw,5.5rem)] font-black mb-4 text-white tracking-tighter whitespace-nowrap overflow-visible text-center leading-none">
          The Baa-ckground
        </h2>
        
        <p className="text-blue-300/40 mb-10 italic font-medium tracking-tight text-base sm:text-lg">
          "Learn Prepositions with Shadow"
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 w-full max-w-sm">
          <button
            onClick={onLearn}
            className="flex-1 bg-white text-slate-950 font-black py-5 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-2xl"
          >
            Start Learning
          </button>
          <button
            onClick={onQuiz}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-black py-5 rounded-2xl transition-all hover:scale-105 active:scale-95 border border-slate-700"
          >
            Master Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
