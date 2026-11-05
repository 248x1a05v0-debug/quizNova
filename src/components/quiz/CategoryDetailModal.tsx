import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { Difficulty } from '../../types/quiz';
import { CategoryIcon } from '../common/CategoryIcon';
import { ArrowLeft, Play, Award, Zap, HelpCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

export const CategoryDetailModal: React.FC = () => {
  const {
    selectedCategory,
    setScreen,
    startQuiz,
    user,
  } = useQuiz();

  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [isStarting, setIsStarting] = useState(false);

  if (!selectedCategory) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-slate-500">No category selected.</p>
        <button
          onClick={() => setScreen('home')}
          className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleStart = async () => {
    setIsStarting(true);
    await startQuiz({
      category: selectedCategory,
      difficulty,
      amount: questionCount,
    });
    setIsStarting(false);
  };

  const bestScoreKey = `${selectedCategory.id}_${difficulty}`;
  const bestScoreForDiff = user.bestScores[bestScoreKey] || 0;

  return (
    <div className="space-y-6 pb-8">
      {/* Top Bar with Back action */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setScreen('home')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Categories</span>
        </button>
        <span className="text-xs text-slate-400 font-mono">Category ID: {selectedCategory.id}</span>
      </div>

      {/* Hero Category Banner (GP 5: More detail than list row) */}
      <div
        className="rounded-2xl sm:rounded-3xl p-6 sm:p-7 text-white shadow-lg relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${selectedCategory.seedColor}EE, #1e1b4b)`,
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-inner">
            <CategoryIcon name={selectedCategory.iconName} className="w-8 h-8" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs text-indigo-200">
              <span>Open Trivia Database Certified</span>
              <span aria-hidden="true">·</span>
              <span>Multiple Choice</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
              {selectedCategory.name}
            </h1>
            <p className="text-xs sm:text-sm text-white/90 mt-1.5 max-w-xl leading-relaxed">
              {selectedCategory.description}
            </p>
          </div>
        </div>

        {/* Category High Score Metric */}
        <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-white/80">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-300" />
            <span>Personal Record:</span>
            <span className="font-bold text-white font-mono tabular-nums">
              {bestScoreForDiff > 0 ? `${bestScoreForDiff} pts` : 'No score yet'}
            </span>
          </div>
          <span className="text-[11px] text-white/70">Live API + Offline Bank</span>
        </div>
      </div>

      {/* Quiz Configuration Panel */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-6">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Configure Your Quiz Session
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Customize the difficulty tier and question count to match your study goals.
          </p>
        </div>

        {/* Difficulty Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Select Difficulty Tier
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {(['easy', 'medium', 'hard', 'any'] as Difficulty[]).map(diff => {
              const isSelected = difficulty === diff;
              return (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold capitalize border transition-all text-center ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {diff}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Count Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Number of Questions
          </label>
          <div className="grid grid-cols-4 gap-2.5">
            {[5, 10, 15, 20].map(count => {
              const isSelected = questionCount === count;
              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {count} Questions
                </button>
              );
            })}
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Instant feedback after each tap</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500 shrink-0" />
            <span>20s timer per question</span>
          </div>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>Explanations for all options</span>
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-2">
          <button
            onClick={handleStart}
            disabled={isStarting}
            className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 active:scale-[0.99] transition-all disabled:opacity-60"
          >
            {isStarting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Preparing Questions...
              </span>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Start {selectedCategory.name} Quiz</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
