export type Difficulty = 'easy' | 'medium' | 'hard' | 'any';

export interface CategoryInfo {
  id: number; // OpenTDB id
  name: string;
  slug: string;
  iconName: string;
  description: string;
  seedColor: string; // Theme accent
  gradient: string;
  totalQuestionsCount: number;
}

export interface Question {
  id: string;
  category: string;
  categoryId: number;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  options: string[]; // Shuffled 4 options
  explanation?: string;
  isCustom?: boolean;
}

export interface UserAnswer {
  questionId: string;
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  options: string[];
  selectedAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
  explanation?: string;
}

export interface QuizResult {
  id: string;
  date: string;
  category: string;
  categoryId: number;
  difficulty: Difficulty;
  totalQuestions: number;
  correctCount: number;
  score: number;
  accuracy: number;
  totalTimeSeconds: number;
  answers: UserAnswer[];
  xpEarned: number;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar: string;
  isLoggedIn: boolean;
  totalQuizzes: number;
  totalScore: number;
  totalXp: number;
  bestStreak: number;
  bestScores: Record<string, number>; // key: `${categoryId}_${difficulty}`
  createdAt: string;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  avatar: string;
  score: number;
  accuracy: number;
  quizzesPlayed: number;
  rank: number;
  badge?: string;
}

export interface QuizSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  timerSecondsPerQuestion: number; // e.g. 15 or 30
  instantFeedback: boolean;
  themeMode: 'light' | 'dark' | 'system';
}
