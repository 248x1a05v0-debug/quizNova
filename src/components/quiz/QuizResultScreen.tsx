import React, { useEffect, useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Zap,
  Target,
  Clock,
  RotateCcw,
  Home,
  Bookmark,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Share2,
} from 'lucide-react';

export const QuizResultScreen: React.FC = () => {
  const {
    latestResult,
    setScreen,
    retryQuiz,
    toggleFavorite,
    isFavorite,
    user,
  } = useQuiz();

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    if (latestResult && latestResult.accuracy >= 70) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#10B981', '#F59E0B', '#6366F1'],
      });
    }
  }, [latestResult]);

  if (!latestResult) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-sm text-slate-500">No recent quiz result found.</p>
        <button
          onClick={() => setScreen('home')}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          Go to Home
        </button>
      </div>
    );
  }

  const {
    category,
    difficulty,
    accuracy,
    score,
    correctCount,
    totalQuestions,
    totalTimeSeconds,
    xpEarned,
    answers,
  } = latestResult;

  const handleShare = () => {
    const text = `I just scored ${score} pts (${accuracy}%) on the ${category} quiz in QuizNova! Can you beat my score?`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const getFeedbackMessage = () => {
    if (accuracy === 100) return { title: 'Flawless Victory!', subtitle: 'You answered every question correctly!' };
    if (accuracy >= 80) return { title: 'Outstanding Work!', subtitle: 'Impressive command over this subject!' };
    if (accuracy >= 60) return { title: 'Well Done!', subtitle: 'Good effort, you passed with flying colors!' };
    return { title: 'Keep Practicing!', subtitle: 'Every attempt builds stronger understanding.' };
  };

  const feedback = getFeedbackMessage();

  return (
    <div className="space-y-6 pb-10">
      {/* Top Banner Card */}
      <div className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-indigo-900 to-indigo-950 text-white text-center shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md mx-auto flex items-center justify-center text-amber-400 shadow-inner">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <div className="flex items-center justify-center gap-1.5 text-xs text-indigo-200">
              <span>{category}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{difficulty}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
              {feedback.title}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-sm mx-auto mt-1">
              {feedback.subtitle}
            </p>
          </div>

          {/* Big Circular Accuracy Display */}
          <div className="py-2">
            <div className="inline-flex flex-col items-center justify-center w-28 h-28 rounded-full border-4 border-indigo-500/40 bg-white/5">
              <span className="text-3xl font-extrabold font-mono tabular-nums text-white">
                {accuracy}%
              </span>
              <span className="text-[11px] font-medium text-indigo-200">
                {correctCount} / {totalQuestions} Correct
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Performance Metric Cards (Clean unboxed grid with tabular figures) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
          <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
            <Trophy className="w-3.5 h-3.5" />
            <span>Total Score</span>
          </div>
          <p className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-1">
            {score} pts
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
          <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            <Zap className="w-3.5 h-3.5" />
            <span>XP Gained</span>
          </div>
          <p className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-1">
            +{xpEarned} XP
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
          <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <Target className="w-3.5 h-3.5" />
            <span>Accuracy</span>
          </div>
          <p className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-1">
            {accuracy}%
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
          <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Total Time</span>
          </div>
          <p className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-1">
            {totalTimeSeconds}s
          </p>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={retryQuiz}
          className="py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>

        <button
          onClick={() => setScreen('home')}
          className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border border-slate-200 dark:border-slate-700"
        >
          <Home className="w-4 h-4" />
          <span>Explore More</span>
        </button>

        <button
          onClick={handleShare}
          className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border border-slate-200 dark:border-slate-700"
        >
          <Share2 className="w-4 h-4" />
          <span>{copiedShare ? 'Copied to Clipboard!' : 'Share Score'}</span>
        </button>
      </div>

      {/* Comprehensive Question Review Accordion */}
      {answers && answers.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Detailed Question Review ({answers.length})
            </h2>
            <span className="text-xs text-slate-400">
              Tap any item to see full explanation
            </span>
          </div>

          <div className="space-y-2.5">
            {answers.map((ans, idx) => {
              const isExpanded = expandedIndex === idx;
              const isFav = isFavorite(ans.questionId);

              return (
                <div
                  key={ans.questionId + idx}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-xs"
                >
                  <div
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="shrink-0">
                        {ans.isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      <div className="truncate">
                        <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                          Q{idx + 1}. {ans.question}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {ans.isCorrect
                            ? `Correct: ${ans.correctAnswer}`
                            : `Selected: ${ans.selectedAnswer || 'Timeout'} · Correct: ${ans.correctAnswer}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          toggleFavorite({
                            id: ans.questionId,
                            question: ans.question,
                            category: ans.category,
                            categoryId: 9,
                            difficulty: ans.difficulty,
                            correctAnswer: ans.correctAnswer,
                            incorrectAnswers: [],
                            options: ans.options,
                            explanation: ans.explanation,
                          });
                        }}
                        className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 ${
                          isFav ? 'text-amber-500' : 'text-slate-400'
                        }`}
                        title="Bookmark to Favorites"
                      >
                        <Bookmark className={`w-4 h-4 ${isFav ? 'fill-amber-500' : ''}`} />
                      </button>

                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-850 text-xs space-y-3">
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          Question:
                        </span>
                        <p className="text-slate-900 dark:text-slate-100 mt-0.5">
                          {ans.question}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
                          <span className="font-bold text-[11px] block text-emerald-700 dark:text-emerald-300">
                            Verified Correct Answer:
                          </span>
                          <span className="font-medium">{ans.correctAnswer}</span>
                        </div>

                        <div
                          className={`p-2.5 rounded-lg border ${
                            ans.isCorrect
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                              : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-900 dark:text-red-200'
                          }`}
                        >
                          <span
                            className={`font-bold text-[11px] block ${
                              ans.isCorrect
                                ? 'text-emerald-700 dark:text-emerald-300'
                                : 'text-red-700 dark:text-red-300'
                            }`}
                          >
                            Your Selection:
                          </span>
                          <span className="font-medium">
                            {ans.selectedAnswer || 'Timed Out (No selection)'}
                          </span>
                        </div>
                      </div>

                      {ans.explanation && (
                        <div className="p-2.5 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-indigo-900 dark:text-indigo-200">
                          <span className="font-bold text-[11px] block text-indigo-700 dark:text-indigo-300">
                            Key Insight:
                          </span>
                          <span>{ans.explanation}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
