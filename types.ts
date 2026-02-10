
export enum AppState {
  HOME = 'HOME',
  LEARN = 'LEARN',
  QUIZ = 'QUIZ'
}

export interface QuizQuestion {
  id: number;
  type: 'multiple-choice' | 'fill-blank' | 'true-false' | 'matching' | 'error-correction';
  question: string;
  options?: string[];
  answer: any;
  explanation: string;
  section: string;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  content: string;
  icon: string;
  color: string;
}
