import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { History, Calendar, Clock, Trophy, Target, Trash2, ArrowLeft, RotateCcw } from 'lucide-react';

export const QuizHistoryScreen: React.FC = () => {
  const { history, clearHistory, setScreen, startQuiz, categories } = useQuiz();
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredHistory = history.filter(item => {
    if (filterCategory === 'all') return true;
    return item.category === filterCategory;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setScreen('home')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {history.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear your quiz history?')) {
                clearHistory();
              }
            }}
            className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 dark:text-red-400 font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Screen Title & Category Filter Tabs */}
      <div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              Quiz Attempt History
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track past scores, completion speed, and accuracy over time
            </p>
          </div>
        </div>

        {/* Filter buttons (Interactive filter controls allowed per §1.A) */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-3 no-scrollbar">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filterCategory === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Attempts ({history.length})
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setFilterCategory(c.name)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterCategory === c.name
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
          <History className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No quiz records yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Complete a quiz to review your session metrics and best scores here.
          </p>
          <button
            onClick={() => setScreen('home')}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs"
          >
            Take a Quiz
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item, idx) => {
            const dateStr = new Date(item.date).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={item.id || idx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{dateStr}</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize font-medium text-slate-600 dark:text-slate-300">
                      {item.difficulty}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {item.category}
                  </h3>

                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1 font-mono tabular-nums">
                      <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      <span className="font-bold">{item.score} pts</span>
                    </div>

                    <div className="flex items-center gap-1 font-mono tabular-nums">
                      <Target className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{item.accuracy}% accuracy</span>
                    </div>

                    <div className="flex items-center gap-1 font-mono tabular-nums">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.totalTimeSeconds}s</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-750">
                  <button
                    onClick={() => {
                      const matchedCat = categories.find(c => c.name === item.category);
                      startQuiz({
                        category: matchedCat,
                        difficulty: item.difficulty,
                        amount: item.totalQuestions || 5,
                      });
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Replay</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
