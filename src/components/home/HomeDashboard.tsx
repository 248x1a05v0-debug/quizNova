import React from 'react';
import { useQuiz } from '../../context/QuizContext';
import { CategoryIcon } from '../common/CategoryIcon';
import { Search, Play, Flame, Award, ArrowRight, Zap, Target, BookOpen, Clock } from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const {
    user,
    categories,
    searchQuery,
    setSearchQuery,
    openCategoryDetail,
    startQuiz,
    history,
    setScreen,
  } = useQuiz();

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const latestQuiz = history.length > 0 ? history[0] : null;

  return (
    <div className="space-y-6 pb-6">
      {/* Welcome Card & Key Metric Strip */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 text-white p-5 sm:p-7 shadow-lg shadow-indigo-950/20">
        {/* Subtle decorative circles */}
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-white/5 blur-xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-indigo-200">
                <span>Knowledge Quest</span>
                <span aria-hidden="true">·</span>
                <span>Active Season</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                Hello, {user.username} 👋
              </h1>
              <p className="text-xs sm:text-sm text-indigo-100/90 mt-1 max-w-md">
                Ready to challenge your intellect? Pick a category or jump into a rapid sprint.
              </p>
            </div>

            {/* Quick Play CTA */}
            <div className="shrink-0">
              <button
                onClick={() => {
                  const randomCat = categories[Math.floor(Math.random() * categories.length)];
                  startQuiz({ category: randomCat, difficulty: 'medium', amount: 5 });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-xs sm:text-sm shadow-md hover:bg-indigo-50 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-indigo-900" />
                <span>Quick Sprint (5 Qs)</span>
              </button>
            </div>
          </div>

          {/* User Performance Metric Bar (Clean, unboxed metadata with tabular figures) */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 mt-6 pt-5 border-t border-indigo-700/50">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1 text-[11px] text-indigo-200">
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>Total XP</span>
              </div>
              <p className="text-base sm:text-xl font-bold text-white font-mono tabular-nums mt-0.5">
                {user.totalXp}
              </p>
            </div>

            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1 text-[11px] text-indigo-200">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span>Best Streak</span>
              </div>
              <p className="text-base sm:text-xl font-bold text-white font-mono tabular-nums mt-0.5">
                {user.bestStreak}
              </p>
            </div>

            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1 text-[11px] text-indigo-200">
                <BookOpen className="w-3.5 h-3.5 text-cyan-300" />
                <span>Quizzes</span>
              </div>
              <p className="text-base sm:text-xl font-bold text-white font-mono tabular-nums mt-0.5">
                {user.totalQuizzes}
              </p>
            </div>

            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1 text-[11px] text-indigo-200">
                <Target className="w-3.5 h-3.5 text-emerald-300" />
                <span>Avg Accuracy</span>
              </div>
              <p className="text-base sm:text-xl font-bold text-white font-mono tabular-nums mt-0.5">
                {user.totalQuizzes > 0
                  ? `${Math.round(
                      history.reduce((acc, h) => acc + h.accuracy, 0) / (history.length || 1)
                    )}%`
                  : '85%'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search categories (e.g. Science, Computing, History...)"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            Clear
          </button>
        )}
      </div>

      {/* Categories Grid (GP 1 & GP 5) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Quiz Categories
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select any domain to configure difficulty and question length
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono tabular-nums">
            {filteredCategories.length} available
          </span>
        </div>

        {filteredCategories.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No categories found for "{searchQuery}"
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Try searching for "Science", "Computer", or "General Knowledge"
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Reset search filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredCategories.map(cat => {
              // Best score for this category across difficulties
              const bestKeyEasy = `${cat.id}_easy`;
              const bestKeyMed = `${cat.id}_medium`;
              const bestKeyHard = `${cat.id}_hard`;
              const topScore = Math.max(
                user.bestScores[bestKeyEasy] || 0,
                user.bestScores[bestKeyMed] || 0,
                user.bestScores[bestKeyHard] || 0
              );

              return (
                <div
                  key={cat.id}
                  onClick={() => openCategoryDetail(cat)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openCategoryDetail(cat);
                    }
                  }}
                  className="group relative p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 hover:border-indigo-400/80 dark:hover:border-indigo-500/80 hover:shadow-md transition-all cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0 group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: cat.seedColor }}
                    >
                      <CategoryIcon name={cat.iconName} className="w-5 h-5" />
                    </div>

                    <div className="text-right">
                      {topScore > 0 ? (
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                          <Award className="w-3 h-3" />
                          <span className="font-mono tabular-nums">{topScore} pts</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">
                          Unranked
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Multiple Choice · Timed</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                      Configure <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Latest Quiz Card (if available) */}
      {latestQuiz && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Recent Attempt</span>
              <span aria-hidden="true">·</span>
              <span>{latestQuiz.category}</span>
            </div>
            <button
              onClick={() => setScreen('history')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View Full History
            </button>
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/40 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <span className="font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                {latestQuiz.score} pts
              </span>
              <span className="text-slate-400 ml-1.5 font-mono tabular-nums">
                ({latestQuiz.accuracy}% accuracy · {latestQuiz.correctCount}/{latestQuiz.totalQuestions} correct)
              </span>
            </div>
            <span className="capitalize text-slate-500 dark:text-slate-400">
              {latestQuiz.difficulty} mode
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
