import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment, Float } from '@react-three/drei';
import Shadow from './Shadow';

interface HomeViewProps {
  onLearn: () => void;
  onQuiz: () => void;
}

const PREPOSITION_TIPS = [
  "Use 'at' for specific points, like 'at the bus stop'!",
  "Use 'in' for 3D containers, like 'in the box'!",
  "Use 'on' for 2D surfaces, like 'on the table'!",
  "Movement 'into' means entering a space.",
  "Movement 'onto' means landing on a surface.",
  "'Between' is for two; 'among' is for a crowd!",
  "Pro Tip: 'Go home' needs no preposition!",
  "Use 'by' for time deadlines: 'by noon'!",
  "Use 'since' for the start time of an action."
];

const HomeView: React.FC<HomeViewProps> = ({ onLearn, onQuiz }) => {
  const [tip, setTip] = useState<string>("Hi! I'm Shadow. Click me for a preposition tip!");
  const [emotion, setEmotion] = useState<'happy' | 'thinking' | 'confused' | 'surprised'>('happy');

  const handleMascotClick = () => {
    // Pick a new random tip and emotion
    const randomTip = PREPOSITION_TIPS[Math.floor(Math.random() * PREPOSITION_TIPS.length)];
    const emotions: ('happy' | 'thinking' | 'confused' | 'surprised')[] = ['happy', 'thinking', 'confused', 'surprised'];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    
    // Briefly clear tip to trigger re-animation if same tip picked
    setTip("");
    setTimeout(() => {
      setTip(randomTip);
      setEmotion(randomEmotion);
    }, 50);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-1000 bg-slate-950 relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      {/* Interactive 3D Mascot Stage */}
      <div className="w-full h-80 relative mb-4">
        <Canvas shadows className="cursor-pointer">
          {/* Moved camera slightly higher (y=1.6) and mascot lower (y=-0.9) to make room for bubble */}
          <PerspectiveCamera makeDefault position={[0, 1.6, 6]} fov={35} />
          <Environment preset="apartment" />
          <ambientLight intensity={0.6} />
          <pointLight position={[-5, 5, 5]} intensity={1} color="#60a5fa" />
          <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow shadow-mapSize={1024} />
          
          <Suspense fallback={null}>
            <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.5}>
              <Shadow 
                position={[0, -0.9, 0]} 
                emotion={emotion} 
                message={tip}
                onClick={handleMascotClick}
              />
            </Float>
          </Suspense>
        </Canvas>
      </div>
      
      <div className="relative z-10 max-w-2xl">
        <h2 className="font-brand text-5xl md:text-8xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tighter">
          The Baa-ckground
        </h2>
        
        <p className="text-xl md:text-2xl text-blue-300/60 mb-10 italic font-medium tracking-tight">
          "Learn Prepositions with Shadow"
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 w-full mt-2">
          <button
            onClick={onLearn}
            className="flex-1 bg-white text-slate-950 font-black py-5 px-8 rounded-3xl text-xl transition-all hover:scale-105 active:scale-95 shadow-2xl hover:shadow-blue-500/20"
          >
            Start Academy
          </button>
          <button
            onClick={onQuiz}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-black py-5 px-8 rounded-3xl text-xl transition-all hover:scale-105 active:scale-95 border border-slate-700 shadow-xl"
          >
            Master Quiz
          </button>
        </div>

        <div className="mt-16 flex justify-center gap-10 grayscale opacity-20 pointer-events-none">
          <div className="flex flex-col items-center">
            <span className="text-2xl mb-2">📍</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Place</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl mb-2">⏰</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Time</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl mb-2">🏃</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Motion</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
