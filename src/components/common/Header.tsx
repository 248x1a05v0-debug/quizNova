import React from 'react';
import { useQuiz } from '../../context/QuizContext';
import { Smartphone, Monitor, Moon, Sun, Code2, Award, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenFlutterCode: () => void;
  onOpenInstallModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenFlutterCode, onOpenInstallModal }) => {
  const {
    screen,
    setScreen,
    viewportMode,
    setViewportMode,
    settings,
    updateSettings,
    user,
  } = useQuiz();

  const toggleTheme = () => {
    updateSettings({
      themeMode: settings.themeMode === 'dark' ? 'light' : 'dark',
    });
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setScreen('home')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                QuizNova
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setScreen('home')}
            className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 ${
              screen === 'home' || screen === 'category_detail' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => setScreen('leaderboard')}
            className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 ${
              screen === 'leaderboard' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            Leaderboard
          </button>
          <button
            onClick={() => setScreen('custom_form')}
            className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 ${
              screen === 'custom_form' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            Create Question
          </button>
          <button
            onClick={() => setScreen('favorites')}
            className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 ${
              screen === 'favorites' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            Saved Deck
          </button>
          <button
            onClick={() => setScreen('history')}
            className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 ${
              screen === 'history' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            Quiz History
          </button>
        </nav>

        {/* Zone 3: Actions (Install App, Flutter Code, Viewport Toggle, Theme, Profile) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Install as Mobile App Button */}
          <button
            onClick={onOpenInstallModal}
            title="Install QuizNova directly as a phone app or get Android Release APK"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Install App</span>
          </button>

          {/* Flutter & Dart Code Inspector Modal Button */}
          <button
            onClick={onOpenFlutterCode}
            title="View Complete Flutter & Dart Source Code for KHIT Project Submission"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-all shadow-xs"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Flutter Code</span>
          </button>

          {/* Viewport Frame Toggle: Mobile phone vs Full web */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewportMode('mobile')}
              title="Mobile Device Preview"
              className={`p-1.5 rounded-md text-xs transition-colors ${
                viewportMode === 'mobile'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs font-medium'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewportMode('web')}
              title="Responsive Desktop View"
              className={`p-1.5 rounded-md text-xs transition-colors ${
                viewportMode === 'web'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs font-medium'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Dark Mode"
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {settings.themeMode === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Profile Trigger */}
          <button
            onClick={() => setScreen('profile')}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center text-sm">
              {user.avatar || '🎓'}
            </div>
            <span className="hidden lg:inline text-xs font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[100px]">
              {user.username}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
