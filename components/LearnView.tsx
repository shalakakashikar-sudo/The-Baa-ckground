
// Fix: Added React to imports to resolve namespace error for React.FC
import React, { useRef, useEffect } from 'react';
import { studyGuide } from '../data/studyGuide';

interface LearnViewProps {
  selectedModuleIndex: number | null;
  setSelectedModuleIndex: (index: number | null) => void;
  onBack: () => void;
  onQuiz: () => void;
}

const colorMap: Record<string, { bg: string, border: string, text: string, accent: string, hover: string, highlight: string }> = {
  blue: { bg: 'bg-blue-600/10', border: 'border-blue-600/20', text: 'text-blue-400', accent: 'bg-blue-600', hover: 'hover:border-blue-500/50', highlight: 'text-blue-300' },
  emerald: { bg: 'bg-emerald-600/10', border: 'border-emerald-600/20', text: 'text-emerald-400', accent: 'bg-emerald-600', hover: 'hover:border-emerald-500/50', highlight: 'text-emerald-300' },
  amber: { bg: 'bg-amber-600/10', border: 'border-amber-600/20', text: 'text-amber-400', accent: 'bg-amber-600', hover: 'hover:border-amber-500/50', highlight: 'text-amber-300' },
  rose: { bg: 'bg-rose-600/10', border: 'border-rose-600/20', text: 'text-rose-400', accent: 'bg-rose-600', hover: 'hover:border-rose-500/50', highlight: 'text-rose-300' },
  violet: { bg: 'bg-violet-600/10', border: 'border-violet-600/20', text: 'text-violet-400', accent: 'bg-violet-600', hover: 'hover:border-violet-500/50', highlight: 'text-violet-300' },
  slate: { bg: 'bg-slate-600/10', border: 'border-slate-600/20', text: 'text-slate-400', accent: 'bg-slate-600', hover: 'hover:border-slate-500/50', highlight: 'text-slate-300' },
};

const KEYWORDS = [
  'at', 'in', 'on', 'to', 'toward', 'towards', 'from', 'with', 'by', 'for', 'of', 
  'about', 'without', 'between', 'among', 'beside', 'besides', 'into', 'onto', 
  'out of', 'through', 'across', 'above', 'under', 'over', 'behind', 'in front of', 
  'along', 'next to', 'upon', 'since', 'during', 'until', 'before', 'after'
];

export const LearnView: React.FC<LearnViewProps> = ({ selectedModuleIndex, setSelectedModuleIndex, onBack, onQuiz }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [selectedModuleIndex]);

  const handleNext = () => {
    if (selectedModuleIndex !== null && selectedModuleIndex < studyGuide.length - 1) {
      setSelectedModuleIndex(selectedModuleIndex + 1);
    }
  };

  const handlePrev = () => {
    if (selectedModuleIndex !== null && selectedModuleIndex > 0) {
      setSelectedModuleIndex(selectedModuleIndex - 1);
    }
  };

  const highlightKeywords = (text: string, palette: any) => {
    const parts = text.split(/(\s+)/);
    return parts.map((part, i) => {
      const cleanWord = part.toLowerCase().replace(/[.,!?;:()]/g, '').trim();
      if (KEYWORDS.includes(cleanWord)) {
        return (
          <span key={i} className={`${palette.text} font-black underline decoration-2 underline-offset-4 decoration-current/40`}>
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const renderContent = (content: string, color: string) => {
    const palette = colorMap[color] || colorMap.blue;
    
    return content.split('\n').map((line, i) => {
      const trimmedLine = line.trim();
      
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-3xl md:text-4xl font-brand font-bold text-white mt-12 mb-8 border-b-2 border-slate-800 pb-4 tracking-tight">{line.replace('### ', '')}</h3>;
      }
      
      if (line.startsWith('#### ')) {
        return <h4 key={i} className={`text-xl font-bold ${palette.text} mt-10 mb-4 flex items-center gap-3`}>
          <span className={`w-3 h-1 rounded-full ${palette.accent} opacity-50`}></span>
          {line.replace('#### ', '')}
        </h4>;
      }

      if (line.startsWith('> ')) {
        return (
          <div key={i} className="my-10 p-6 rounded-3xl bg-blue-500/5 border border-blue-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl select-none">💡</div>
            <p className="text-slate-300 leading-relaxed font-medium text-lg">
              {line.replace('> ', '')}
            </p>
          </div>
        );
      }

      if (line.startsWith('Example:')) {
        return (
          <div key={i} className={`my-6 p-5 rounded-2xl border-l-4 ${palette.border} bg-slate-900/50 backdrop-blur-sm shadow-lg group hover:bg-slate-900 transition-colors`}>
            <div className="flex items-start gap-3">
              <span className="text-xl">👉</span>
              <div>
                <span className={`text-[10px] font-black uppercase tracking-tighter ${palette.text} opacity-60 block mb-1`}>Practice Example</span>
                <p className="text-slate-100 italic font-medium text-lg leading-relaxed">
                  {highlightKeywords(line.replace('Example: ', ''), palette)}
                </p>
              </div>
            </div>
          </div>
        );
      }

      if (line.startsWith('- ')) {
        return (
          <div key={i} className="flex gap-4 mb-3 ml-4">
            <span className={`${palette.text} font-black text-xl leading-none`}>•</span>
            <span className="text-slate-400 leading-relaxed text-lg">{line.replace('- ', '')}</span>
          </div>
        );
      }

      if (line.includes(':') && !line.startsWith('Example:')) {
        const parts = line.split(':');
        const label = parts[0].trim();
        const description = parts.slice(1).join(':').trim();
        
        if (label.length > 0 && label.length < 50 && description.length > 0) {
          return (
            <div key={i} className="mb-6 flex flex-col md:flex-row gap-2 md:gap-6 group bg-white/5 p-4 rounded-xl border border-transparent hover:border-slate-800 transition-all">
              <div className="min-w-[180px]">
                <span className={`${palette.text} font-black uppercase text-xs tracking-widest block mb-1`}>{label}</span>
                <div className={`h-1 w-8 rounded-full ${palette.accent} opacity-40`}></div>
              </div>
              <span className="text-slate-300 leading-relaxed flex-1 text-lg">
                {description}
              </span>
            </div>
          );
        }
      }
      
      if (trimmedLine === '') return <div key={i} className="h-6" />;
      
      return (
        <p key={i} className="text-slate-400 leading-relaxed mb-6 text-lg font-medium">
          {line}
        </p>
      );
    });
  };

  if (selectedModuleIndex !== null) {
    const selectedModule = studyGuide[selectedModuleIndex];
    const palette = colorMap[selectedModule.color] || colorMap.blue;

    return (
      <div 
        ref={scrollContainerRef}
        className="h-full overflow-y-auto bg-slate-950 scroll-smooth selection:bg-blue-500/30"
      >
        <div className="max-w-4xl mx-auto p-6 md:p-12 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex justify-between items-center mb-10">
            <button 
              onClick={() => setSelectedModuleIndex(null)}
              className="text-slate-500 hover:text-white flex items-center gap-2 font-bold transition-all group px-4 py-2 rounded-xl hover:bg-slate-900"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Academy Hub
            </button>
            <div className="flex flex-col items-end">
              <span className={`text-[10px] font-black uppercase tracking-widest ${palette.text} mb-1`}>
                Progress
              </span>
              <div className="flex gap-1">
                {studyGuide.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1.5 w-3 rounded-full transition-all ${
                      idx === selectedModuleIndex ? `${palette.accent} w-6` : 
                      idx < selectedModuleIndex ? `${palette.accent} opacity-30` : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900/40 backdrop-blur-3xl border border-slate-800 rounded-[3.5rem] p-8 md:p-16 shadow-3xl mb-12 relative overflow-hidden">
            <div className={`absolute -top-20 -right-20 w-64 h-64 ${palette.bg} rounded-full blur-[100px] opacity-20 pointer-events-none`}></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                <div className="flex items-center gap-10">
                  <div className={`w-28 h-28 ${palette.bg} rounded-[2.5rem] flex items-center justify-center text-6xl border ${palette.border} shadow-2xl transform -rotate-3`}>
                    {selectedModule.icon}
                  </div>
                  <div>
                    <h2 className="text-4xl md:text-7xl font-brand font-bold text-white mb-4 tracking-tighter leading-tight">{selectedModule.title}</h2>
                    <p className="text-slate-400 text-xl font-medium italic opacity-90 max-w-lg">{selectedModule.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="content-area">
                {renderContent(selectedModule.content, selectedModule.color)}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center gap-6 py-12">
            <button
              onClick={handlePrev}
              disabled={selectedModuleIndex === 0}
              className={`flex-1 py-7 rounded-[2.5rem] border-2 transition-all font-black flex items-center justify-center gap-3 text-lg ${
                selectedModuleIndex === 0 
                ? 'border-slate-900 text-slate-700 cursor-not-allowed opacity-30' 
                : 'border-slate-800 text-slate-400 hover:border-slate-500 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span className="text-2xl">←</span> Previous
            </button>
            <button
              onClick={handleNext}
              disabled={selectedModuleIndex === studyGuide.length - 1}
              className={`flex-1 py-7 rounded-[2.5rem] border-2 transition-all font-black flex items-center justify-center gap-3 text-lg ${
                selectedModuleIndex === studyGuide.length - 1 
                ? 'border-slate-900 text-slate-700 cursor-not-allowed opacity-30' 
                : `${palette.border} ${palette.text} hover:brightness-110 border-opacity-60 hover:bg-slate-900`
              }`}
            >
              Next Chapter <span className="text-2xl">→</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={scrollContainerRef}
      className="h-full overflow-y-auto bg-slate-950 p-6 md:p-12 scroll-smooth"
    >
      <div className="max-w-7xl mx-auto pt-16">
        <div className="text-center mb-20 animate-in fade-in slide-in-from-top-4 duration-700">
           <h1 className="text-5xl md:text-7xl font-brand font-bold text-white mb-6">The Learning Academy</h1>
           <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium text-center">18 logical chapters designed to take you from a preposition novice to a master of context.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {studyGuide.map((module, index) => {
            const palette = colorMap[module.color] || colorMap.blue;
            return (
              <div 
                key={module.id}
                onClick={() => setSelectedModuleIndex(index)}
                className={`bg-slate-900/30 backdrop-blur-sm border border-slate-800 p-12 rounded-[3.5rem] cursor-pointer ${palette.hover} hover:bg-slate-900/60 transition-all group relative overflow-hidden active:scale-[0.98] hover:shadow-2xl hover:-translate-y-2`}
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none transform group-hover:scale-150 duration-700">
                  <span className="text-[12rem]">{module.icon}</span>
                </div>
                
                <div className="relative z-10">
                  <div className={`w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center text-5xl mb-10 group-hover:${palette.accent} group-hover:text-white group-hover:scale-110 group-hover:-rotate-3 transition-all border border-slate-700`}>
                    {module.icon}
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                     <span className={`text-[10px] font-black uppercase tracking-widest ${palette.text} opacity-60`}>Chapter {index + 1}</span>
                  </div>
                  <h3 className={`text-3xl font-bold text-white mb-5 group-hover:${palette.text} transition-colors tracking-tight leading-tight`}>{module.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-lg group-hover:text-slate-300 transition-colors line-clamp-2">{module.description}</p>
                  
                  <div className="mt-10 flex items-center text-sm font-black uppercase tracking-widest text-slate-600 group-hover:text-white transition-all">
                    Start Learning <span className="ml-3 group-hover:translate-x-2 transition-transform">→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center pb-24">
          <button 
            onClick={onBack} 
            className="px-12 py-5 rounded-full border-2 border-slate-800 text-slate-400 hover:text-white hover:border-slate-400 font-black uppercase tracking-widest text-sm transition-all bg-slate-900/50 backdrop-blur-sm hover:scale-105"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
