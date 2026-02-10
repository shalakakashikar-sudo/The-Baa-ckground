import React, { useState, useEffect, useRef } from 'react';
import { AppState } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import { LearnView } from './components/LearnView';
import QuizView from './components/QuizView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppState>(AppState.HOME);
  const [selectedModuleIndex, setSelectedModuleIndex] = useState<number | null>(null);
  const mainRef = useRef<HTMLElement>(null);

  // Global Scroll Management
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [currentView]);

  const renderView = () => {
    switch (currentView) {
      case AppState.HOME:
        return (
          <HomeView 
            onLearn={() => setCurrentView(AppState.LEARN)} 
            onQuiz={() => setCurrentView(AppState.QUIZ)} 
          />
        );
      case AppState.LEARN:
        return (
          <LearnView 
            selectedModuleIndex={selectedModuleIndex}
            setSelectedModuleIndex={setSelectedModuleIndex}
            onBack={() => setCurrentView(AppState.HOME)} 
            onQuiz={() => setCurrentView(AppState.QUIZ)} 
          />
        );
      case AppState.QUIZ:
        return <QuizView onBack={() => setCurrentView(AppState.LEARN)} />;
      default:
        return (
          <HomeView 
            onLearn={() => setCurrentView(AppState.LEARN)} 
            onQuiz={() => setCurrentView(AppState.QUIZ)} 
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <Header 
        currentView={currentView} 
        setView={(view) => {
          setCurrentView(view);
          if (view === AppState.HOME) setSelectedModuleIndex(null);
        }} 
      />
      <main ref={mainRef} className="flex-1 overflow-hidden relative">
        {renderView()}
      </main>
      <Footer />
    </div>
  );
};

export default App;