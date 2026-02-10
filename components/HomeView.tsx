import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment, Float } from '@react-three/drei';
import Shadow from './Shadow';

interface HomeViewProps {
  onLearn: () => void;
  onQuiz: () => void;
}

const PREPOSITION_TIPS = [
  "Use 'at' for specific points, like 'at the door'!",
  "Use 'in' for enclosed spaces, like 'in the box'!",
  "Use 'on' for surfaces, like 'on the table'!",
  "Movement 'into' means you're going inside something.",
  "Movement 'onto' means you're landing on a surface.",
  "'Between' is for two things; 'among' is for a group!",
  "Don't use a preposition before 'home' when moving: 'Go home'!",
  "Use 'by' for a deadline: 'Finish by Friday'!"
];

const HomeView: React.FC<HomeViewProps> = ({ onLearn, onQuiz }) => {
  const [tip, setTip] = useState<string>("Hi! I'm Shadow. Click me to learn a preposition tip!");
  const [emotion, setEmotion] = useState<'happy' | 'thinking' | 'confused' | 'surprised'>('happy');

  const handleMascotClick = () => {
    const randomTip = PREPOSITION_TIPS[Math.floor(Math.random() * PREPOSITION_TIPS.length)];
    const emotions: ('happy' | 'thinking' | 'confused' | 'surprised')[] = ['happy', 'thinking', 'confused', 'surprised'];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    
    setTip(randomTip);
    setEmotion(randomEmotion);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700 bg-slate-950 relative overflow-hidden">
      {/* 3D Mascot Section */}
      <div className="w-full h-80 relative mb-4">
        <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full scale-50"></div>
        <Canvas shadows className="cursor-pointer">
          <PerspectiveCamera makeDefault position={[0, 1.5, 5]} fov={40} />
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
          
          <Suspense fallback={null}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
              <Shadow 
                position={[0, 0, 0]} 
                emotion={emotion} 
                message={tip}
                onClick={handleMascotClick}
              />
            </Float>
          </Suspense>
        </Canvas>
      </div>
      
      <div className="relative z-10">
        <h2 className="font-brand text-5xl md:text-8xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-300 tracking-tighter">
          The Baa-ckground
        </h2>
        
        <p className="text-xl md:text-2xl text-blue-200/80 mb-4 italic font-medium">
          "Learn Prepositions with Shadow"
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl mt-8 mx-auto">
          <button
            onClick={onLearn}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black py-5 px-8 rounded-2xl text-xl transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-blue-900/40 border border-blue-400/20"
          >
            Start Learning
          </button>
          <button
            onClick={onQuiz}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-black py-5 px-8 rounded-2xl text-xl transition-all hover:scale-105 active:scale-95 border border-slate-700 shadow-xl"
          >
            Take Final Quiz
          </button>
        </div>

        <div className="mt-12 flex justify-center gap-8 grayscale opacity-50">
          <div className="text-sm font-bold uppercase tracking-widest text-slate-500">📍 Place</div>
          <div className="text-sm font-bold uppercase tracking-widest text-slate-500">⏰ Time</div>
          <div className="text-sm font-bold uppercase tracking-widest text-slate-500">🏃 Movement</div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
