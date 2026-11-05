import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { Bookmark, Play, Trash2, ArrowLeft, CheckCircle2, HelpCircle } from 'lucide-react';

export const FavoritesScreen: React.FC = () => {
  const { favorites, toggleFavorite, setScreen, startQuiz, categories } = useQuiz();
  const [selectedCat, setSelectedCat] = useState<string>('all');

  const filteredFavorites = favorites.filter(q => {
    if (selectedCat === 'all') return true;
    return q.category === selectedCat;
  });

  const handlePracticeFavorites = () => {
    if (favorites.length === 0) return;
    const cat = categories.find(c => c.name === favorites[0].category) || categories[0];
    startQuiz({
      category: cat,
      difficulty: 'medium',
      amount: Math.min(favorites.length, 10),
    });
  };

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

        <span className="text-xs text-slate-400 font-mono">
          {favorites.length} Saved Items
        </span>
      </div>

      {/* Screen Title & Practice Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span>Saved Questions Deck</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Review and reinforce questions you marked for revision
          </p>
        </div>

        {favorites.length > 0 && (
          <button
            onClick={handlePracticeFavorites}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95 shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Practice Saved Deck ({favorites.length})</span>
          </button>
        )}
      </div>

      {/* Saved Questions List */}
      {favorites.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
          <Bookmark className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No Bookmarked Questions Yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            Whenever you encounter an interesting or tricky question during a quiz, tap the bookmark icon to save it here for spaced revision.
          </p>
          <button
            onClick={() => setScreen('home')}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs mt-2"
          >
            Explore Quizzes Now
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFavorites.map((q, idx) => (
            <div
              key={q.id || idx}
              className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {q.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="capitalize">{q.difficulty}</span>
                </div>

                <button
                  onClick={() => toggleFavorite(q)}
                  title="Remove from favorites"
                  className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                {idx + 1}. {q.question}
              </h3>

              {/* Verified Answer badge */}
              <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Correct Answer: {q.correctAnswer}</span>
                </div>
                {q.explanation && (
                  <p className="mt-1 text-emerald-900/90 dark:text-emerald-200 pl-5 leading-relaxed">
                    {q.explanation}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
