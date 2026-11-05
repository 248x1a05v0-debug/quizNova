import { Question, QuizResult, UserProfile, QuizSettings, LeaderboardEntry } from '../types/quiz';

const KEYS = {
  USER: 'quiznova_user',
  CUSTOM_QUESTIONS: 'quiznova_custom_questions',
  HISTORY: 'quiznova_history',
  FAVORITES: 'quiznova_favorites',
  SETTINGS: 'quiznova_settings',
  LEADERBOARD: 'quiznova_leaderboard',
};

const DEFAULT_USER: UserProfile = {
  id: 'usr_guest_01',
  username: 'Alex Rivera',
  email: 'alex.rivera@quiznova.edu',
  avatar: '🎓',
  isLoggedIn: true,
  totalQuizzes: 4,
  totalScore: 320,
  totalXp: 950,
  bestStreak: 6,
  bestScores: {
    '9_easy': 100,
    '18_medium': 90,
    '17_hard': 80,
  },
  createdAt: '2026-10-15T10:00:00.000Z',
};

const DEFAULT_SETTINGS: QuizSettings = {
  soundEnabled: true,
  vibrationEnabled: true,
  timerSecondsPerQuestion: 20,
  instantFeedback: true,
  themeMode: 'light',
};

const SEED_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'lead_1', username: 'Sophia Chen', avatar: '⚡', score: 2840, accuracy: 96, quizzesPlayed: 32, rank: 1, badge: 'Grandmaster' },
  { id: 'lead_2', username: 'Priya Sharma (KHIT)', avatar: '🏆', score: 2450, accuracy: 92, quizzesPlayed: 28, rank: 2, badge: 'Scholar' },
  { id: 'lead_3', username: 'Marcus Vance', avatar: '🚀', score: 2180, accuracy: 89, quizzesPlayed: 25, rank: 3, badge: 'Expert' },
  { id: 'lead_4', username: 'Alex Rivera (You)', avatar: '🎓', score: 950, accuracy: 85, quizzesPlayed: 4, rank: 4, badge: 'Apprentice' },
  { id: 'lead_5', username: 'Elena Rostova', avatar: '🧠', score: 870, accuracy: 81, quizzesPlayed: 11, rank: 5, badge: 'Novice' },
  { id: 'lead_6', username: 'Karthik Reddy', avatar: '🔥', score: 790, accuracy: 78, quizzesPlayed: 9, rank: 6, badge: 'Novice' },
];

export const storageService = {
  getUser(): UserProfile {
    try {
      const data = localStorage.getItem(KEYS.USER);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return DEFAULT_USER;
  },

  saveUser(user: UserProfile): void {
    try {
      localStorage.setItem(KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.warn('Failed to save user to storage', e);
    }
  },

  getCustomQuestions(): Question[] {
    try {
      const data = localStorage.getItem(KEYS.CUSTOM_QUESTIONS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return [];
  },

  saveCustomQuestion(question: Question): Question[] {
    const list = this.getCustomQuestions();
    const updated = [question, ...list];
    try {
      localStorage.setItem(KEYS.CUSTOM_QUESTIONS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save custom question', e);
    }
    return updated;
  },

  deleteCustomQuestion(id: string): Question[] {
    const list = this.getCustomQuestions().filter(q => q.id !== id);
    try {
      localStorage.setItem(KEYS.CUSTOM_QUESTIONS, JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to delete custom question', e);
    }
    return list;
  },

  getHistory(): QuizResult[] {
    try {
      const data = localStorage.getItem(KEYS.HISTORY);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return [
      {
        id: 'hist_demo_1',
        date: new Date(Date.now() - 3600000 * 5).toISOString(),
        category: 'Computer Science',
        categoryId: 18,
        difficulty: 'medium',
        totalQuestions: 5,
        correctCount: 4,
        score: 80,
        accuracy: 80,
        totalTimeSeconds: 48,
        xpEarned: 180,
        answers: [],
      },
      {
        id: 'hist_demo_2',
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
        category: 'General Knowledge',
        categoryId: 9,
        difficulty: 'easy',
        totalQuestions: 5,
        correctCount: 5,
        score: 100,
        accuracy: 100,
        totalTimeSeconds: 35,
        xpEarned: 220,
        answers: [],
      },
    ];
  },

  saveHistoryResult(result: QuizResult): QuizResult[] {
    const current = this.getHistory();
    const updated = [result, ...current];
    try {
      localStorage.setItem(KEYS.HISTORY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save history', e);
    }
    return updated;
  },

  clearHistory(): void {
    try {
      localStorage.removeItem(KEYS.HISTORY);
    } catch {
      // fallback
    }
  },

  getFavorites(): Question[] {
    try {
      const data = localStorage.getItem(KEYS.FAVORITES);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return [];
  },

  toggleFavorite(question: Question): { favorites: Question[]; isFav: boolean } {
    const list = this.getFavorites();
    const exists = list.some(q => q.id === question.id);
    let updated: Question[];
    let isFav: boolean;

    if (exists) {
      updated = list.filter(q => q.id !== question.id);
      isFav = false;
    } else {
      updated = [question, ...list];
      isFav = true;
    }

    try {
      localStorage.setItem(KEYS.FAVORITES, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to toggle favorite', e);
    }

    return { favorites: updated, isFav };
  },

  getSettings(): QuizSettings {
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: QuizSettings): void {
    try {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings', e);
    }
  },

  getLeaderboard(): LeaderboardEntry[] {
    try {
      const data = localStorage.getItem(KEYS.LEADERBOARD);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return SEED_LEADERBOARD;
  },

  updateUserScoreInLeaderboard(user: UserProfile): LeaderboardEntry[] {
    const board = this.getLeaderboard();
    const idx = board.findIndex(b => b.id === 'lead_4' || b.username.includes('(You)'));
    if (idx !== -1) {
      board[idx] = {
        ...board[idx],
        username: `${user.username} (You)`,
        avatar: user.avatar,
        score: user.totalXp,
        quizzesPlayed: user.totalQuizzes,
      };
      // sort
      board.sort((a, b) => b.score - a.score);
      board.forEach((item, i) => {
        item.rank = i + 1;
      });
      try {
        localStorage.setItem(KEYS.LEADERBOARD, JSON.stringify(board));
      } catch {
        // ignore
      }
    }
    return board;
  },
};
