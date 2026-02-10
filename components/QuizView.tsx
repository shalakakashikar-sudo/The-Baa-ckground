import React, { useState } from 'react';
import { quizQuestions } from '../data/quizQuestions';
import { QuizQuestion } from '../types';

interface QuizViewProps {
  onBack: () => void;
}

type QuizPhase = 'SETUP' | 'ACTIVE' | 'REVIEW';

export const QuizView: React.FC<QuizViewProps> = ({ onBack }) => {
  const [phase, setPhase] = useState<QuizPhase>('SETUP');
  const [configCount, setConfigCount] = useState<number>(10);
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);

  // Shuffle logic for randomization
  const startQuiz = (count: number) => {
    const shuffled = [...quizQuestions].sort(() => 0.5 - Math.random());
    setActiveQuestions(shuffled.slice(0, count));
    setPhase('ACTIVE');
    setCurrentStep(0);
    setUserAnswers({});
    setScore(0);
  };

  const handleAnswer = (ans: string) => {
    const currentQ = activeQuestions[currentStep];
    // If already answered, don't allow re-answering
    if (userAnswers[currentQ.id] !== undefined) return;

    const isCorrect = ans.toLowerCase().trim() === String(currentQ.answer).toLowerCase().trim();
    
    setUserAnswers(prev => ({ ...prev, [currentQ.id]: ans }));
    if (isCorrect) setScore(s => s + 1);
  };

  const nextStep = () => {
    if (currentStep + 1 < activeQuestions.length) {
      setCurrentStep(s => s + 1);
    } else {
      setPhase('REVIEW');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1);
    }
  };

  const currentQ = activeQuestions[currentStep];
  const currentAnswer = userAnswers[currentQ?.id];
  const isAnswered = currentAnswer !== undefined;

  if (phase === 'SETUP') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700 bg-slate-950">
        <div className="mb-10">
          <div className="text-7xl mb-6">🏆</div>
          <h2 className="text-4xl md:text-6xl font-brand font-bold text-white mb-4">Final Proficiency Quiz</h2>
          <p className="text-slate-400 text-lg max-w-md mx-auto">Select your challenge level. Questions are randomly selected from our master preposition database.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-xl mb-12">
          {[5, 10, 20, 30, 40, 50].map(num => (
            <button
              key={num}
              onClick={() => setConfigCount(num)}
              className={`py-6 rounded-3xl border-2 transition-all font-black text-2xl flex flex-col items-center gap-1 ${
                configCount === num 
                ? 'bg-blue-600 border-blue-400 text-white scale-105 shadow-2xl shadow-blue-500/20' 
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-white'
              }`}
            >
              {num}
              <span className="text-[10px] uppercase tracking-widest opacity-60">Questions</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4 w-full max-w-sm">
          <button
            onClick={() => startQuiz(configCount)}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-6 rounded-3xl text-xl shadow-2xl shadow-blue-900/40 transition-transform active:scale-95"
          >
            Launch Quiz
          </button>
          <button onClick={onBack} className="text-slate-500 hover:text-white font-bold text-sm py-2">
            ← Return to Academy
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'ACTIVE' && currentQ) {
    const isCorrect = isAnswered && currentAnswer.toLowerCase().trim() === String(currentQ.answer).toLowerCase().trim();

    return (
      <div className="h-full overflow-y-auto bg-slate-950 p-6 md:p-12 scroll-smooth">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">{currentQ.section}</span>
              <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
            </div>
            <div className="bg-slate-900 px-5 py-2 rounded-2xl border border-slate-800">
              <span className="text-blue-400 font-black text-sm">Question {currentStep + 1} of {activeQuestions.length}</span>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-3xl border border-slate-800 p-8 md:p-14 rounded-[3rem] shadow-3xl mb-8">
            <h3 className="text-2xl md:text-4xl font-brand font-bold text-white mb-10 leading-snug">{currentQ.question}</h3>
            
            <div className="space-y-4">
              {(currentQ.type === 'multiple-choice' || currentQ.type === 'true-false') ? (
                (currentQ.options || (currentQ.type === 'true-false' ? ['True', 'False'] : [])).map((opt) => {
                  const isSelected = isAnswered && currentAnswer === opt;
                  const isChoiceCorrect = String(currentQ.answer).toLowerCase() === opt.toLowerCase();
                  
                  let btnStyle = 'border-slate-800 bg-slate-900/40 text-slate-300';
                  if (isAnswered) {
                    if (isChoiceCorrect) {
                      btnStyle = 'border-emerald-500 bg-emerald-500/20 text-emerald-400';
                    } else if (isSelected) {
                      btnStyle = 'border-rose-500 bg-rose-500/20 text-rose-400';
                    } else {
                      btnStyle = 'border-slate-800 bg-slate-900/20 text-slate-600 opacity-50';
                    }
                  } else {
                    btnStyle += ' hover:bg-slate-800 hover:border-slate-700 hover:text-white';
                  }

                  return (
                    <button
                      key={opt}
                      disabled={isAnswered}
                      onClick={() => handleAnswer(opt)}
                      className={`w-full p-6 md:p-8 rounded-[1.5rem] text-left font-bold text-lg md:text-xl transition-all border-2 ${btnStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })
              ) : (
                <div className="relative">
                  <input 
                    autoFocus={!isAnswered}
                    disabled={isAnswered}
                    type="text"
                    value={isAnswered ? currentAnswer : undefined}
                    placeholder="Type answer and press Enter..."
                    className={`w-full bg-slate-950 border-2 p-8 rounded-[1.5rem] text-xl outline-none transition-all font-bold placeholder:text-slate-700 ${
                      isAnswered 
                      ? (isCorrect ? 'border-emerald-500 text-emerald-400' : 'border-rose-500 text-rose-400')
                      : 'border-slate-800 text-white focus:border-blue-500'
                    }`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim() && !isAnswered) {
                        handleAnswer(e.currentTarget.value);
                      }
                    }}
                  />
                  {isAnswered && !isCorrect && (
                    <p className="mt-4 text-emerald-400 font-bold px-4">Correct Answer: {String(currentQ.answer)}</p>
                  )}
                </div>
              )}
            </div>

            {isAnswered && (
              <div className="mt-12 flex gap-4 items-start bg-blue-500/5 p-8 rounded-[2rem] border border-blue-500/10 animate-in fade-in slide-in-from-bottom-4">
                <span className="text-3xl">💡</span>
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-blue-400 block mb-2">Preposition Logic</span>
                  <p className="text-slate-300 leading-relaxed font-medium italic text-lg">{currentQ.explanation}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between gap-4 mb-12">
             <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex-1 py-5 rounded-[2rem] border-2 transition-all font-black flex items-center justify-center gap-3 text-lg ${
                currentStep === 0 
                ? 'border-slate-900 text-slate-800 opacity-20 cursor-not-allowed' 
                : 'border-slate-800 text-slate-400 hover:border-slate-500 hover:text-white'
              }`}
            >
              ← Previous
            </button>
            <button
              onClick={nextStep}
              disabled={!isAnswered}
              className={`flex-1 py-5 rounded-[2rem] border-2 transition-all font-black flex items-center justify-center gap-3 text-lg ${
                !isAnswered 
                ? 'border-slate-900 text-slate-800 opacity-20 cursor-not-allowed' 
                : 'bg-blue-600 border-blue-400 text-white hover:bg-blue-500'
              }`}
            >
              {currentStep + 1 === activeQuestions.length ? 'See Results 🏆' : 'Next Question →'}
            </button>
          </div>

          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-12 border border-slate-800/50">
            <div 
              className="bg-blue-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / activeQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'REVIEW') {
    const percentage = Math.round((score / activeQuestions.length) * 100);
    return (
      <div className="h-full overflow-y-auto bg-slate-950 p-6 md:p-12 scroll-smooth">
        <div className="max-w-4xl mx-auto">
          {/* Header Summary */}
          <div className="bg-slate-900/40 backdrop-blur-3xl border border-slate-800 p-12 md:p-20 rounded-[4rem] text-center mb-16 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
             <div className="text-8xl mb-8">
               {percentage >= 80 ? '🌟' : percentage >= 50 ? '🥈' : '📚'}
             </div>
             <h2 className="text-4xl md:text-6xl font-brand font-bold text-white mb-6 tracking-tight">Quiz Results</h2>
             <div className="flex flex-col items-center gap-2 mb-10">
               <span className="text-8xl md:text-9xl font-black text-blue-500 leading-none">{score}</span>
               <span className="text-2xl font-black uppercase tracking-widest text-slate-500">Out of {activeQuestions.length}</span>
             </div>
             <p className="text-xl text-slate-400 max-w-md mx-auto mb-12 font-medium">
               {percentage === 100 ? "Flawless! You've mastered English context." : 
                percentage >= 80 ? "Excellent work! Your sheep-skills are top-tier." :
                percentage >= 50 ? "Good progress. A bit more study will make you a pro." : 
                "Keep learning! The Academy modules have all the answers."}
             </p>
             
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <button 
                 onClick={() => setPhase('SETUP')}
                 className="bg-blue-600 hover:bg-blue-500 text-white font-black py-5 px-10 rounded-3xl transition-all hover:scale-105 shadow-2xl shadow-blue-900/40"
               >
                 Retake Quiz ↺
               </button>
               <button 
                 onClick={onBack}
                 className="bg-slate-800 hover:bg-slate-700 text-white font-black py-5 px-10 rounded-3xl transition-all hover:scale-105 border border-slate-700"
               >
                 Back to Academy 🐑
               </button>
             </div>
          </div>

          {/* Detailed Review Feed */}
          <h3 className="text-2xl font-black uppercase tracking-widest text-slate-600 mb-10 px-4">Detailed Question Review</h3>
          <div className="space-y-6 pb-32">
            {activeQuestions.map((q, idx) => {
              const userAns = userAnswers[q.id];
              const isCorrect = userAns?.toLowerCase().trim() === String(q.answer).toLowerCase().trim();
              
              return (
                <div key={idx} className={`bg-slate-900/30 border-l-8 p-8 md:p-12 rounded-[2.5rem] transition-all ${isCorrect ? 'border-emerald-500/50' : 'border-rose-500/50'}`}>
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{q.section}</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${isCorrect ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <p className="text-xl md:text-2xl font-bold text-white mb-8 leading-relaxed">"{q.question}"</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                      <span className="text-[10px] font-black uppercase text-slate-600 block mb-2">Your Answer</span>
                      <p className={`font-black text-lg ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>{userAns || 'Skipped'}</p>
                    </div>
                    {!isCorrect && (
                      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                        <span className="text-[10px] font-black uppercase text-slate-600 block mb-2">Correct Answer</span>
                        <p className="font-black text-lg text-emerald-400">{String(q.answer)}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 items-start bg-blue-500/5 p-6 rounded-3xl border border-blue-500/10">
                    <span className="text-2xl">💡</span>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 block mb-1">Logic Explanation</span>
                      <p className="text-slate-400 leading-relaxed font-medium italic">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default QuizView;