
import React from 'react';
import { AppState } from '../types';

interface HeaderProps {
  currentView: AppState;
  setView: (view: AppState) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 py-3 px-6 flex justify-between items-center z-50">
      <div 
        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => setView(AppState.HOME)}
      >
        <span className="text-2xl">🐑</span>
        <h1 className="font-brand font-bold text-xl tracking-tight text-white">
          The Baa-ckground
        </h1>
      </div>
      
      <nav className="flex gap-4">
        {[
          { label: 'Learn', view: AppState.LEARN },
          { label: 'Quiz', view: AppState.QUIZ }
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => setView(item.view)}
            className={`text-sm font-semibold transition-colors px-3 py-1 rounded-full ${
              currentView === item.view 
              ? 'bg-blue-600 text-white' 
              : 'text-slate-400 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
};

export default Header;
