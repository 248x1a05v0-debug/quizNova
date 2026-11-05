import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import {
  Bookmark,
  X,
  Flame,
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Award,
} from 'lucide-react';

export const QuizPlayScreen: React.FC = () => {
  const {
    activeQuestions,
    currentQuestionIndex,
    selectedAnswer,
    isAnswerSubmitted,
    score,
    currentStreak,
    timeRemaining,
    isQuizLoading,
    quizError,
    dataSource,
    selectedCategory,
    selectedDifficulty,
    submitAnswer,
    nextQuestion,
    exitQuiz,
    retryQuiz,
    toggleFavorite,
    isFavorite,
    settings,
  } = useQuiz();

  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // --- State 1: Loading Indicator State (GP 3) ---
  if (isQuizLoading) {
    return (
      <div className="min-h-[360px] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-full border-4 border-indigo-100 dark:border-indigo-950 border-t-indigo-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-indigo-600">QN</span>
          </div>
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Fetching Questions...
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
            Connecting to Open Trivia Database API and verifying question integrity.
          </p>
        </div>
      </div>
    );
  }

  // --- State 2: Error State with Retry (GP 3) ---
  if (quizError) {
    return (
      <div className="min-h-[360px] flex flex-col items-center justify-center p-8 text-center space-y-4 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50">
        <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-red-900 dark:text-red-200">
            Failed to Load Quiz
          </h3>
          <p className="text-xs text-red-600 dark:text-red-300 mt-1 max-w-sm">
            {quizError}
          </p>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={retryQuiz}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
          <button
            onClick={exitQuiz}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Exit to Home
          </button>
        </div>
      </div>
    );
  }

  // --- State 3: Empty State (GP 3) ---
  if (!activeQuestions || activeQuestions.length === 0) {
    return (
      <div className="min-h-[360px] flex flex-col items-center justify-center p-8 text-center space-y-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
        <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            No Questions Available
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            There are currently no active questions for this filter.
          </p>
        </div>
        <button
          onClick={exitQuiz}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // --- State 4: Data State (Active Quiz Screen) ---
  const currentQ = activeQuestions[currentQuestionIndex];
  const progressPercent = ((currentQuestionIndex + 1) / activeQuestions.length) * 100;
  const isFav = isFavorite(currentQ.id);

  const timerRatio = Math.max(0, timeRemaining / settings.timerSecondsPerQuestion);
  const isTimerUrgent = timeRemaining <= 5;

  const handleOptionClick = (optionText: string) => {
    if (isAnswerSubmitted) return;
    submitAnswer(optionText);
  };

  return (
    <div className="space-y-4 sm:space-y-5 pb-8 relative">
      {/* Top Header: Progress, Category, Exit & Favorite */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          onClick={() => setShowExitConfirm(true)}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Exit Quiz"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex-1 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {selectedCategory?.name || currentQ.category}
            </span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">{currentQ.difficulty}</span>
            {dataSource === 'custom' && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-medium">Custom</span>
              </>
            )}
          </div>
          <p className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums mt-0.5">
            Question {currentQuestionIndex + 1} of {activeQuestions.length}
          </p>
        </div>

        {/* Favorite Bookmark Button */}
        <button
          onClick={() => toggleFavorite(currentQ)}
          title={isFav ? 'Remove from Saved Deck' : 'Save to Favorites Deck'}
          className={`p-2 rounded-xl transition-all ${
            isFav
              ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
              : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Bookmark className={`w-5 h-5 ${isFav ? 'fill-amber-500' : ''}`} />
        </button>
      </div>

      {/* Progress Bar & Status Track */}
      <div className="space-y-1.5">
        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Timer Bar + Score & Streak Strip */}
        <div className="flex items-center justify-between text-xs font-mono tabular-nums pt-1">
          {/* Countdown timer with urgency pulsing */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
              isTimerUrgent
                ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold animate-pulse'
                : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800'
            }`}
          >
            <Clock className={`w-3.5 h-3.5 ${isTimerUrgent ? 'text-red-500' : 'text-slate-400'}`} />
            <span>00:{timeRemaining.toString().padStart(2, '0')}</span>
          </div>

          <div className="flex items-center gap-3">
            {currentStreak > 1 && (
              <div className="flex items-center gap-1 text-orange-500 font-bold">
                <Flame className="w-3.5 h-3.5 fill-orange-500" />
                <span>{currentStreak}x Streak</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold">
              <Award className="w-3.5 h-3.5" />
              <span>{score} pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="p-5 sm:p-7 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            Q{currentQuestionIndex + 1}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider">
            {currentQ.difficulty}
          </span>
        </div>

        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
          {currentQ.question}
        </h2>
      </div>

      {/* Multiple Choice Options List */}
      <div className="space-y-2.5">
        {currentQ.options.map((optionText, idx) => {
          const letter = String.fromCharCode(65 + idx); // A, B, C, D
          const isSelected = selectedAnswer === optionText;
          const isCorrect = optionText === currentQ.correctAnswer;

          let optionStyle =
            'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500';
          let badgeStyle = 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';

          if (isAnswerSubmitted) {
            if (isCorrect) {
              optionStyle =
                'border-emerald-500 bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 ring-1 ring-emerald-500';
              badgeStyle = 'bg-emerald-500 text-white';
            } else if (isSelected && !isCorrect) {
              optionStyle =
                'border-red-500 bg-red-50/90 dark:bg-red-950/40 text-red-950 dark:text-red-100 ring-1 ring-red-500';
              badgeStyle = 'bg-red-500 text-white';
            } else {
              optionStyle =
                'border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 opacity-60';
              badgeStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-400';
            }
          }

          return (
            <button
              key={optionText + idx}
              type="button"
              disabled={isAnswerSubmitted}
              onClick={() => handleOptionClick(optionText)}
              className={`w-full min-h-[52px] p-3.5 rounded-xl border text-left flex items-center justify-between gap-3 transition-all ${optionStyle} ${
                !isAnswerSubmitted ? 'active:scale-[0.99] cursor-pointer' : 'cursor-default'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <span
                  className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${badgeStyle}`}
                >
                  {letter}
                </span>
                <span className="text-xs sm:text-sm font-medium leading-relaxed">
                  {optionText}
                </span>
              </div>

              {isAnswerSubmitted && isCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              )}
              {isAnswerSubmitted && isSelected && !isCorrect && (
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Instant Feedback & Explanation Box */}
      {isAnswerSubmitted && (
        <div
          className={`p-4 rounded-xl border transition-all text-xs space-y-1.5 ${
            selectedAnswer === currentQ.correctAnswer
              ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
              : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200'
          }`}
        >
          <div className="flex items-center gap-1.5 font-bold">
            {selectedAnswer === currentQ.correctAnswer ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Correct! +20 Points</span>
              </>
            ) : selectedAnswer === '__TIMEOUT__' ? (
              <>
                <Clock className="w-4 h-4 text-red-600" />
                <span>Time Expired! The correct answer was: {currentQ.correctAnswer}</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-red-600" />
                <span>Incorrect! Correct answer is: {currentQ.correctAnswer}</span>
              </>
            )}
          </div>
          {currentQ.explanation && (
            <p className="leading-relaxed opacity-90 pl-5">
              {currentQ.explanation}
            </p>
          )}
        </div>
      )}

      {/* Next Question / Finish Action CTA */}
      {isAnswerSubmitted && (
        <div className="pt-2">
          <button
            onClick={nextQuestion}
            className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 active:scale-[0.99] transition-all"
          >
            <span>
              {currentQuestionIndex + 1 < activeQuestions.length
                ? 'Next Question'
                : 'See Final Results'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 text-center space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Quit Current Quiz?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Your ongoing progress and streak for this session will not be recorded in your history.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Keep Playing
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  exitQuiz();
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
              >
                Exit Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
