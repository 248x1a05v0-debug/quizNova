import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  CategoryInfo,
  Difficulty,
  Question,
  QuizResult,
  QuizSettings,
  UserProfile,
  LeaderboardEntry,
  UserAnswer,
} from '../types/quiz';
import { QUIZ_CATEGORIES } from '../data/categories';
import { storageService } from '../services/storageService';
import { triviaApiService } from '../services/triviaApiService';
import { soundService } from '../services/soundService';

export type ScreenType =
  | 'home'
  | 'category_detail'
  | 'quiz_play'
  | 'quiz_result'
  | 'custom_form'
  | 'history'
  | 'leaderboard'
  | 'favorites'
  | 'profile';

export type ViewportMode = 'mobile' | 'web';

interface QuizState {
  screen: ScreenType;
  viewportMode: ViewportMode;
  user: UserProfile;
  settings: QuizSettings;
  categories: CategoryInfo[];
  selectedCategory: CategoryInfo | null;
  selectedDifficulty: Difficulty;
  questionCount: number;
  timerSeconds: number;

  // Active quiz state
  activeQuestions: Question[];
  currentQuestionIndex: number;
  selectedAnswer: string | null;
  isAnswerSubmitted: boolean;
  score: number;
  currentStreak: number;
  bestStreakThisQuiz: number;
  userAnswers: UserAnswer[];
  quizStartTime: number;
  questionStartTime: number;
  timeRemaining: number;
  isQuizLoading: boolean;
  quizError: string | null;
  dataSource: 'api' | 'local_cache' | 'custom';

  // Results & History
  latestResult: QuizResult | null;
  history: QuizResult[];
  favorites: Question[];
  customQuestions: Question[];
  leaderboard: LeaderboardEntry[];

  // Global search
  searchQuery: string;

  // Actions
  setScreen: (screen: ScreenType) => void;
  setViewportMode: (mode: ViewportMode) => void;
  setSearchQuery: (query: string) => void;
  openCategoryDetail: (category: CategoryInfo) => void;
  startQuiz: (config?: { category?: CategoryInfo; difficulty?: Difficulty; amount?: number }) => Promise<void>;
  submitAnswer: (answer: string) => void;
  nextQuestion: () => void;
  exitQuiz: () => void;
  retryQuiz: () => void;
  toggleFavorite: (question: Question) => void;
  isFavorite: (questionId: string) => boolean;
  addCustomQuestion: (question: Question) => void;
  deleteCustomQuestion: (questionId: string) => void;
  clearHistory: () => void;
  updateUser: (updated: Partial<UserProfile>) => void;
  updateSettings: (updated: Partial<QuizSettings>) => void;
  loginUser: (username: string, email: string) => void;
  logoutUser: () => void;
}

const QuizContext = createContext<QuizState | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [screen, setScreen] = useState<ScreenType>('home');
  const [viewportMode, setViewportMode] = useState<ViewportMode>('mobile');
  const [user, setUser] = useState<UserProfile>(() => storageService.getUser());
  const [settings, setSettings] = useState<QuizSettings>(() => storageService.getSettings());
  const [history, setHistory] = useState<QuizResult[]>(() => storageService.getHistory());
  const [favorites, setFavorites] = useState<Question[]>(() => storageService.getFavorites());
  const [customQuestions, setCustomQuestions] = useState<Question[]>(() => storageService.getCustomQuestions());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => storageService.getLeaderboard());
  const [searchQuery, setSearchQuery] = useState('');

  // Active category & quiz configuration
  const [selectedCategory, setSelectedCategory] = useState<CategoryInfo | null>(QUIZ_CATEGORIES[0]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [timerSeconds, setTimerSeconds] = useState<number>(20);

  // Active quiz runtime state
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreakThisQuiz, setBestStreakThisQuiz] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [quizStartTime, setQuizStartTime] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(20);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'api' | 'local_cache' | 'custom'>('api');
  const [latestResult, setLatestResult] = useState<QuizResult | null>(null);

  // Sync settings with sound service
  useEffect(() => {
    soundService.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Sync theme
  useEffect(() => {
    if (settings.themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.themeMode]);

  const openCategoryDetail = useCallback((category: CategoryInfo) => {
    setSelectedCategory(category);
    setScreen('category_detail');
  }, []);

  const startQuiz = useCallback(
    async (config?: { category?: CategoryInfo; difficulty?: Difficulty; amount?: number }) => {
      const cat = config?.category || selectedCategory || QUIZ_CATEGORIES[0];
      const diff = config?.difficulty || selectedDifficulty;
      const amount = config?.amount || questionCount;

      setSelectedCategory(cat);
      setSelectedDifficulty(diff);
      setQuestionCount(amount);
      setScreen('quiz_play');
      setIsQuizLoading(true);
      setQuizError(null);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setScore(0);
      setCurrentStreak(0);
      setBestStreakThisQuiz(0);
      setUserAnswers([]);

      try {
        const { questions, source } = await triviaApiService.fetchQuestions({
          categoryId: cat.id,
          categoryName: cat.name,
          difficulty: diff,
          amount,
        });

        if (!questions || questions.length === 0) {
          throw new Error('No questions available for this category and difficulty.');
        }

        setActiveQuestions(questions);
        setDataSource(source);
        const now = Date.now();
        setQuizStartTime(now);
        setQuestionStartTime(now);
        setTimeRemaining(settings.timerSecondsPerQuestion);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to load quiz questions';
        setQuizError(msg);
      } finally {
        setIsQuizLoading(false);
      }
    },
    [selectedCategory, selectedDifficulty, questionCount, settings.timerSecondsPerQuestion]
  );

  const retryQuiz = useCallback(() => {
    startQuiz({
      category: selectedCategory || undefined,
      difficulty: selectedDifficulty,
      amount: questionCount,
    });
  }, [startQuiz, selectedCategory, selectedDifficulty, questionCount]);

  const finishQuiz = useCallback(
    (finalAnswers: UserAnswer[]) => {
      const totalTimeSec = Math.max(1, Math.round((Date.now() - quizStartTime) / 1000));
      const correctCount = finalAnswers.filter(a => a.isCorrect).length;
      const totalQ = finalAnswers.length || 1;
      const accuracy = Math.round((correctCount / totalQ) * 100);

      // Score calculation: 20 pts per correct answer + time bonus
      const earnedScore = correctCount * 20 + Math.max(0, 100 - totalTimeSec);
      const earnedXp = correctCount * 25 + (accuracy >= 80 ? 50 : 0);

      const result: QuizResult = {
        id: `res_${Date.now()}`,
        date: new Date().toISOString(),
        category: selectedCategory?.name || 'General',
        categoryId: selectedCategory?.id || 9,
        difficulty: selectedDifficulty,
        totalQuestions: totalQ,
        correctCount,
        score: earnedScore,
        accuracy,
        totalTimeSeconds: totalTimeSec,
        answers: finalAnswers,
        xpEarned: earnedXp,
      };

      setLatestResult(result);

      // Update storage history
      const updatedHistory = storageService.saveHistoryResult(result);
      setHistory(updatedHistory);

      // Update user stats and best scores
      const scoreKey = `${result.categoryId}_${result.difficulty}`;
      const prevBest = user.bestScores[scoreKey] || 0;
      const newBest = Math.max(prevBest, earnedScore);

      const updatedUser: UserProfile = {
        ...user,
        totalQuizzes: user.totalQuizzes + 1,
        totalScore: user.totalScore + earnedScore,
        totalXp: user.totalXp + earnedXp,
        bestStreak: Math.max(user.bestStreak, bestStreakThisQuiz),
        bestScores: {
          ...user.bestScores,
          [scoreKey]: newBest,
        },
      };

      setUser(updatedUser);
      storageService.saveUser(updatedUser);

      // Update leaderboard
      const updatedBoard = storageService.updateUserScoreInLeaderboard(updatedUser);
      setLeaderboard(updatedBoard);

      // Play fanfare if accuracy >= 70%
      if (accuracy >= 70) {
        soundService.playFanfare();
      }

      setScreen('quiz_result');
    },
    [quizStartTime, selectedCategory, selectedDifficulty, user, bestStreakThisQuiz]
  );

  const submitAnswer = useCallback(
    (answer: string) => {
      if (isAnswerSubmitted) return;

      const currentQ = activeQuestions[currentQuestionIndex];
      if (!currentQ) return;

      const isCorrect = answer === currentQ.correctAnswer;
      setSelectedAnswer(answer);
      setIsAnswerSubmitted(true);

      const timeSpent = Math.max(1, Math.round((Date.now() - questionStartTime) / 1000));

      let newStreak = currentStreak;
      if (isCorrect) {
        newStreak += 1;
        setScore(prev => prev + 20);
        soundService.playCorrect();
      } else {
        newStreak = 0;
        soundService.playIncorrect();
      }
      setCurrentStreak(newStreak);
      setBestStreakThisQuiz(prev => Math.max(prev, newStreak));

      const recordedAnswer: UserAnswer = {
        questionId: currentQ.id,
        question: currentQ.question,
        category: currentQ.category,
        difficulty: currentQ.difficulty,
        options: currentQ.options,
        selectedAnswer: answer,
        correctAnswer: currentQ.correctAnswer,
        isCorrect,
        timeSpentSeconds: timeSpent,
        explanation: currentQ.explanation,
      };

      setUserAnswers(prev => [...prev, recordedAnswer]);
    },
    [isAnswerSubmitted, activeQuestions, currentQuestionIndex, questionStartTime, currentStreak]
  );

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex + 1 < activeQuestions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setQuestionStartTime(Date.now());
      setTimeRemaining(settings.timerSecondsPerQuestion);
    } else {
      // Finished all questions
      finishQuiz(userAnswers);
    }
  }, [currentQuestionIndex, activeQuestions.length, settings.timerSecondsPerQuestion, finishQuiz, userAnswers]);

  const exitQuiz = useCallback(() => {
    setScreen('home');
    setActiveQuestions([]);
    setIsAnswerSubmitted(false);
    setSelectedAnswer(null);
  }, []);

  const toggleFavorite = useCallback((question: Question) => {
    const { favorites: updatedFavs } = storageService.toggleFavorite(question);
    setFavorites(updatedFavs);
  }, []);

  const isFavorite = useCallback(
    (questionId: string) => {
      return favorites.some(f => f.id === questionId);
    },
    [favorites]
  );

  const addCustomQuestion = useCallback((q: Question) => {
    const updated = storageService.saveCustomQuestion(q);
    setCustomQuestions(updated);
  }, []);

  const deleteCustomQuestion = useCallback((id: string) => {
    const updated = storageService.deleteCustomQuestion(id);
    setCustomQuestions(updated);
  }, []);

  const clearHistory = useCallback(() => {
    storageService.clearHistory();
    setHistory([]);
  }, []);

  const updateUser = useCallback(
    (updated: Partial<UserProfile>) => {
      const merged = { ...user, ...updated };
      setUser(merged);
      storageService.saveUser(merged);
      const updatedBoard = storageService.updateUserScoreInLeaderboard(merged);
      setLeaderboard(updatedBoard);
    },
    [user]
  );

  const updateSettings = useCallback(
    (updated: Partial<QuizSettings>) => {
      const merged = { ...settings, ...updated };
      setSettings(merged);
      storageService.saveSettings(merged);
    },
    [settings]
  );

  const loginUser = useCallback(
    (username: string, email: string) => {
      const loggedUser: UserProfile = {
        ...user,
        username: username || 'Quiz Scholar',
        email: email || 'scholar@quiznova.edu',
        isLoggedIn: true,
      };
      setUser(loggedUser);
      storageService.saveUser(loggedUser);
      const updatedBoard = storageService.updateUserScoreInLeaderboard(loggedUser);
      setLeaderboard(updatedBoard);
    },
    [user]
  );

  const logoutUser = useCallback(() => {
    const guestUser: UserProfile = {
      ...user,
      username: 'Guest Explorer',
      email: 'guest@quiznova.local',
      isLoggedIn: false,
    };
    setUser(guestUser);
    storageService.saveUser(guestUser);
  }, [user]);

  // Question countdown timer tick
  useEffect(() => {
    if (screen !== 'quiz_play' || isQuizLoading || isAnswerSubmitted || activeQuestions.length === 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Time expired! Record answer as unattempted / timeout
          const currentQ = activeQuestions[currentQuestionIndex];
          if (currentQ && !isAnswerSubmitted) {
            setSelectedAnswer('__TIMEOUT__');
            setIsAnswerSubmitted(true);
            setCurrentStreak(0);
            soundService.playIncorrect();

            const timeoutAnswer: UserAnswer = {
              questionId: currentQ.id,
              question: currentQ.question,
              category: currentQ.category,
              difficulty: currentQ.difficulty,
              options: currentQ.options,
              selectedAnswer: null,
              correctAnswer: currentQ.correctAnswer,
              isCorrect: false,
              timeSpentSeconds: settings.timerSecondsPerQuestion,
              explanation: currentQ.explanation,
            };

            setUserAnswers(ans => [...ans, timeoutAnswer]);
          }
          return 0;
        }

        if (prev <= 5 && settings.soundEnabled) {
          soundService.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [screen, isQuizLoading, isAnswerSubmitted, currentQuestionIndex, activeQuestions, settings.timerSecondsPerQuestion, settings.soundEnabled]);

  return (
    <QuizContext.Provider
      value={{
        screen,
        viewportMode,
        user,
        settings,
        categories: QUIZ_CATEGORIES,
        selectedCategory,
        selectedDifficulty,
        questionCount,
        timerSeconds,
        activeQuestions,
        currentQuestionIndex,
        selectedAnswer,
        isAnswerSubmitted,
        score,
        currentStreak,
        bestStreakThisQuiz,
        userAnswers,
        quizStartTime,
        questionStartTime,
        timeRemaining,
        isQuizLoading,
        quizError,
        dataSource,
        latestResult,
        history,
        favorites,
        customQuestions,
        leaderboard,
        searchQuery,
        setScreen,
        setViewportMode,
        setSearchQuery,
        openCategoryDetail,
        startQuiz,
        submitAnswer,
        nextQuestion,
        exitQuiz,
        retryQuiz,
        toggleFavorite,
        isFavorite,
        addCustomQuestion,
        deleteCustomQuestion,
        clearHistory,
        updateUser,
        updateSettings,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = (): QuizState => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
