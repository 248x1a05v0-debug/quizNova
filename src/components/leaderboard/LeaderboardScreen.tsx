import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { Trophy, Medal, Crown, ArrowLeft, Zap, Target } from 'lucide-react';

export const LeaderboardScreen: React.FC = () => {
  const { leaderboard, user, setScreen } = useQuiz();
  const [timeframe, setTimeframe] = useState<'all' | 'weekly'>('all');

  // Top 3 for podium
  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];
  const restList = leaderboard.slice(3);

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
          Global Academic Standing
        </span>
      </div>

      {/* Title & Timeframe Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>QuizNova Leaderboard</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Rankings calculated from total XP earned and accuracy consistency
          </p>
        </div>

        {/* Timeframe segmented control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setTimeframe('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              timeframe === 'all'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            All-Time
          </button>
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              timeframe === 'weekly'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            This Week
          </button>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 items-end">
        {/* Rank 2 (Silver) */}
        {top2 && (
          <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-2 shadow-xs">
            <div className="relative inline-block">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xl sm:text-2xl mx-auto shadow-inner">
                {top2.avatar}
              </div>
              <span className="absolute -bottom-1.5 -right-1 w-6 h-6 rounded-full bg-slate-400 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                2
              </span>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                {top2.username}
              </p>
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums mt-0.5">
                {top2.score} XP
              </p>
            </div>
            <span className="inline-block text-[10px] text-slate-400">
              {top2.accuracy}% Acc
            </span>
          </div>
        )}

        {/* Rank 1 (Gold - Center & Elevated) */}
        {top1 && (
          <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-amber-50 to-amber-100/50 dark:from-slate-800 dark:to-amber-950/20 border-2 border-amber-300 dark:border-amber-600/50 text-center space-y-2 shadow-md relative -top-3">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Crown className="w-6 h-6 text-amber-500 fill-amber-400" />
            </div>
            <div className="relative inline-block mt-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-200 dark:bg-amber-900/60 flex items-center justify-center text-2xl sm:text-3xl mx-auto shadow-inner">
                {top1.avatar}
              </div>
              <span className="absolute -bottom-1.5 -right-1 w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                1
              </span>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 truncate">
                {top1.username}
              </p>
              <p className="text-sm font-extrabold text-amber-600 dark:text-amber-400 font-mono tabular-nums mt-0.5">
                {top1.score} XP
              </p>
            </div>
            <span className="inline-block text-[10px] font-bold text-amber-700 dark:text-amber-300">
              {top1.badge || 'Champion'} · {top1.accuracy}%
            </span>
          </div>
        )}

        {/* Rank 3 (Bronze) */}
        {top3 && (
          <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-2 shadow-xs">
            <div className="relative inline-block">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-xl sm:text-2xl mx-auto shadow-inner">
                {top3.avatar}
              </div>
              <span className="absolute -bottom-1.5 -right-1 w-6 h-6 rounded-full bg-amber-700 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                3
              </span>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                {top3.username}
              </p>
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums mt-0.5">
                {top3.score} XP
              </p>
            </div>
            <span className="inline-block text-[10px] text-slate-400">
              {top3.accuracy}% Acc
            </span>
          </div>
        )}
      </div>

      {/* Ranks Table (List of remaining positions) */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Rankings ({leaderboard.length} Scholars)
        </h2>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-750 overflow-hidden shadow-xs">
          {leaderboard.map(item => {
            const isCurrentUser =
              item.id === 'lead_4' ||
              item.username.toLowerCase().includes('you') ||
              item.username.toLowerCase().includes(user.username.toLowerCase());

            return (
              <div
                key={item.id}
                className={`p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-colors ${
                  isCurrentUser
                    ? 'bg-indigo-50/70 dark:bg-indigo-950/40 font-semibold'
                    : 'hover:bg-slate-50/60 dark:hover:bg-slate-750'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 text-center text-xs font-mono font-bold text-slate-500">
                    #{item.rank}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-base shrink-0">
                    {item.avatar}
                  </div>
                  <div className="truncate">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate flex items-center gap-1.5">
                      <span>{item.username}</span>
                      {isCurrentUser && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-indigo-600 text-white font-bold">
                          YOU
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {item.quizzesPlayed} quizzes completed · {item.accuracy}% accuracy
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs sm:text-sm font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                    {item.score} XP
                  </span>
                  {item.badge && (
                    <span className="block text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
