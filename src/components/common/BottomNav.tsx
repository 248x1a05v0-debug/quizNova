import React from 'react';
import { useQuiz, ScreenType } from '../../context/QuizContext';
import { Home, Trophy, Plus, Bookmark, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { screen, setScreen } = useQuiz();

  // Hide bottom nav during active quiz play
  if (screen === 'quiz_play') {
    return null;
  }

  const navItems: { label: string; screen: ScreenType; icon: React.FC<{ className?: string }> }[] = [
    { label: 'Explore', screen: 'home', icon: Home },
    { label: 'Ranks', screen: 'leaderboard', icon: Trophy },
    { label: 'Saved', screen: 'favorites', icon: Bookmark },
    { label: 'Profile', screen: 'profile', icon: User },
  ];

  return (
    <div className="sticky bottom-0 z-20 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between relative">
        {/* Left 2 items */}
        <div className="flex items-center justify-around flex-1">
          {navItems.slice(0, 2).map(item => {
            const Icon = item.icon;
            const isActive = screen === item.screen;
            return (
              <button
                key={item.label}
                onClick={() => setScreen(item.screen)}
                className="flex flex-col items-center justify-center min-w-[56px] py-1 transition-transform active:scale-95"
              >
                <div
                  className={`w-9 h-7 rounded-full flex items-center justify-center transition-colors ${
                    isActive
                      ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-[10px] font-medium tracking-tight mt-0.5 ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Center Floating Action Button (FAB): Custom Question Creator (GP 4) */}
        <div className="relative -top-4 px-2">
          <button
            onClick={() => setScreen('custom_form')}
            title="Add Custom Question (GP 4)"
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Right 2 items */}
        <div className="flex items-center justify-around flex-1">
          {navItems.slice(2, 4).map(item => {
            const Icon = item.icon;
            const isActive = screen === item.screen;
            return (
              <button
                key={item.label}
                onClick={() => setScreen(item.screen)}
                className="flex flex-col items-center justify-center min-w-[56px] py-1 transition-transform active:scale-95"
              >
                <div
                  className={`w-9 h-7 rounded-full flex items-center justify-center transition-colors ${
                    isActive
                      ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-[10px] font-medium tracking-tight mt-0.5 ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
