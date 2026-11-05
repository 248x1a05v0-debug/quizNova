import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import {
  User,
  Settings,
  Award,
  Flame,
  Zap,
  Target,
  Volume2,
  VolumeX,
  Clock,
  Moon,
  Sun,
  LogOut,
  LogIn,
  Edit2,
  Check,
  BookOpen,
} from 'lucide-react';

const AVATAR_OPTIONS = ['🎓', '🧠', '⚡', '🏆', '🚀', '🔬', '💻', '🎯', '📚', '🌟'];

export const ProfileScreen: React.FC = () => {
  const {
    user,
    updateUser,
    loginUser,
    logoutUser,
    settings,
    updateSettings,
    history,
    categories,
  } = useQuiz();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user.username);
  const [editEmail, setEditEmail] = useState(user.email);
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authUsername, setAuthUsername] = useState('');
  const [authEmail, setAuthEmail] = useState('');

  const handleSaveProfile = () => {
    updateUser({
      username: editName.trim() || 'Scholar',
      email: editEmail.trim() || user.email,
      avatar: selectedAvatar,
    });
    setIsEditingProfile(false);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUsername.trim()) return;
    loginUser(authUsername.trim(), authEmail.trim() || `${authUsername.toLowerCase()}@quiznova.edu`);
    setShowAuthModal(false);
    setAuthUsername('');
    setAuthEmail('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Profile Header Card */}
      <div className="p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-3xl sm:text-4xl shadow-inner">
                {user.avatar || '🎓'}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100">
                  {user.username}
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {user.isLoggedIn ? 'Active Scholar' : 'Guest Explorer'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {user.email}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                <span>Joined {new Date(user.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                <span aria-hidden="true">·</span>
                <span>Tier: {user.totalXp > 1500 ? 'Master' : user.totalXp > 800 ? 'Scholar' : 'Apprentice'}</span>
              </div>
            </div>
          </div>

          {/* Edit / Auth Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                setEditName(user.username);
                setEditEmail(user.email);
                setSelectedAvatar(user.avatar);
                setIsEditingProfile(!isEditingProfile);
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>

            {user.isLoggedIn ? (
              <button
                onClick={logoutUser}
                title="Switch to Guest Mode"
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setAuthMode('login');
                  setShowAuthModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-xs hover:bg-indigo-700"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
            )}
          </div>
        </div>

        {/* Profile Editing Inline Drawer */}
        {isEditingProfile && (
          <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-700/60 space-y-4">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Customize Avatar & Identity
            </h3>

            <div>
              <span className="block text-[11px] text-slate-400 mb-1.5">Choose Avatar</span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {AVATAR_OPTIONS.map(av => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setSelectedAvatar(av)}
                    className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center border transition-all ${
                      selectedAvatar === av
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 scale-105 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 hover:border-slate-300'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setIsEditingProfile(false)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Global Academic Performance Metrics */}
      <div>
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Academic Track Record
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
              <Zap className="w-3.5 h-3.5" />
              <span>Total XP</span>
            </div>
            <p className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-1">
              {user.totalXp}
            </p>
            <span className="text-[10px] text-slate-400">All-time points</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-orange-500">
              <Flame className="w-3.5 h-3.5" />
              <span>Best Streak</span>
            </div>
            <p className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-1">
              {user.bestStreak}
            </p>
            <span className="text-[10px] text-slate-400">Consecutive correct</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
              <Target className="w-3.5 h-3.5" />
              <span>Average Accuracy</span>
            </div>
            <p className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-1">
              {user.totalQuizzes > 0
                ? `${Math.round(
                    history.reduce((a, b) => a + b.accuracy, 0) / (history.length || 1)
                  )}%`
                : '85%'}
            </p>
            <span className="text-[10px] text-slate-400">Across all tests</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Quizzes Taken</span>
            </div>
            <p className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-1">
              {user.totalQuizzes}
            </p>
            <span className="text-[10px] text-slate-400">Sessions finished</span>
          </div>
        </div>
      </div>

      {/* Category Best Scores Table (GP 2: Best scores kept after restart) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Best Scores by Category
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Persisted in local device storage across application restarts
            </p>
          </div>
          <Award className="w-5 h-5 text-amber-500" />
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-750 text-xs">
          {categories.map(cat => {
            const easy = user.bestScores[`${cat.id}_easy`] || 0;
            const med = user.bestScores[`${cat.id}_medium`] || 0;
            const hard = user.bestScores[`${cat.id}_hard`] || 0;
            const highest = Math.max(easy, med, hard);

            return (
              <div key={cat.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {cat.name}
                  </span>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5 font-mono tabular-nums">
                    <span>Easy: {easy}</span>
                    <span>Med: {med}</span>
                    <span>Hard: {hard}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
                    {highest > 0 ? `${highest} pts` : '—'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quiz Preferences & App Settings */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Application Settings
          </h3>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-750 text-xs">
          {/* Sound Toggle */}
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Quiz Sound Effects
              </p>
              <p className="text-slate-400 text-[11px]">
                Web Audio synthesized chimes and countdown clicks
              </p>
            </div>
            <button
              onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`p-2 rounded-xl transition-colors ${
                settings.soundEnabled
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
              }`}
            >
              {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* Timer Duration */}
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Question Countdown Timer
              </p>
              <p className="text-slate-400 text-[11px]">
                Time permitted for each question before auto-timeout
              </p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
              {[15, 20, 30].map(sec => (
                <button
                  key={sec}
                  onClick={() => updateSettings({ timerSecondsPerQuestion: sec })}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                    settings.timerSecondsPerQuestion === sec
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>

          {/* Theme Mode */}
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Visual Theme
              </p>
              <p className="text-slate-400 text-[11px]">
                Toggle between light and dark Material interface
              </p>
            </div>
            <button
              onClick={() =>
                updateSettings({
                  themeMode: settings.themeMode === 'dark' ? 'light' : 'dark',
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              {settings.themeMode === 'dark' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Light Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Auth Modal (Login / Register) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {authMode === 'login' ? 'Log In to QuizNova' : 'Register New Account'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Save scores across devices and compete in global tournaments.
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name / Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Connor"
                  value={authUsername}
                  onChange={e => setAuthUsername(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="scholar@university.edu"
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
                >
                  {authMode === 'login' ? 'Sign In' : 'Register'}
                </button>
              </div>
            </form>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {authMode === 'login'
                  ? "Don't have an account? Register now"
                  : 'Already have an account? Log in'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
