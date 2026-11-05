import React, { useState } from 'react';
import { QuizProvider, useQuiz } from './context/QuizContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { HomeDashboard } from './components/home/HomeDashboard';
import { CategoryDetailModal } from './components/quiz/CategoryDetailModal';
import { QuizPlayScreen } from './components/quiz/QuizPlayScreen';
import { QuizResultScreen } from './components/quiz/QuizResultScreen';
import { CustomQuestionForm } from './components/custom/CustomQuestionForm';
import { QuizHistoryScreen } from './components/history/QuizHistoryScreen';
import { LeaderboardScreen } from './components/leaderboard/LeaderboardScreen';
import { FavoritesScreen } from './components/favorites/FavoritesScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { FlutterCodeModal } from './components/flutter-export/FlutterCodeModal';
import { InstallAppModal } from './components/common/InstallAppModal';
import { Wifi, Battery, Signal, Code2, Download } from 'lucide-react';

interface MainContentProps {
  onOpenFlutterCode: () => void;
  onOpenInstallModal: () => void;
}

const MainContent: React.FC<MainContentProps> = ({ onOpenFlutterCode, onOpenInstallModal }) => {
  const { screen, viewportMode, setViewportMode } = useQuiz();

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return <HomeDashboard />;
      case 'category_detail':
        return <CategoryDetailModal />;
      case 'quiz_play':
        return <QuizPlayScreen />;
      case 'quiz_result':
        return <QuizResultScreen />;
      case 'custom_form':
        return <CustomQuestionForm />;
      case 'history':
        return <QuizHistoryScreen />;
      case 'leaderboard':
        return <LeaderboardScreen />;
      case 'favorites':
        return <FavoritesScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeDashboard />;
    }
  };

  // If Mobile Frame mode is selected:
  if (viewportMode === 'mobile') {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-start py-4 sm:py-8 px-2 transition-colors">
        {/* Helper Top Banner */}
        <div className="w-full max-w-[430px] mb-3 flex items-center justify-between px-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Mobile App Mode</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenInstallModal}
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Get App / APK</span>
            </button>
            <button
              onClick={() => setViewportMode('web')}
              className="text-slate-600 dark:text-slate-300 font-semibold hover:underline"
            >
              Web View
            </button>
          </div>
        </div>

        {/* Mobile Device Frame Shell */}
        <div className="w-full max-w-[420px] h-[860px] max-h-[92vh] bg-white dark:bg-slate-900 rounded-[44px] shadow-2xl border-[9px] border-slate-800 dark:border-slate-700 flex flex-col overflow-hidden relative transition-colors">
          {/* Hardware Notch / Dynamic Island */}
          <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-40 pointer-events-none">
            <div className="w-28 h-4 bg-slate-800 dark:bg-slate-700 rounded-b-xl flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700/80 mr-2" />
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/80" />
            </div>
          </div>

          {/* Smartphone Status Bar */}
          <div className="pt-2 px-6 h-10 flex items-center justify-between text-[11px] font-semibold text-slate-800 dark:text-slate-200 shrink-0 z-30 select-none">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Top Bar inside Phone */}
          <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
            <span className="text-sm font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
              QuizNova
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenInstallModal}
                className="text-[11px] font-bold text-white bg-indigo-600 px-2 py-1 rounded-lg flex items-center gap-1 shadow-xs"
              >
                <Download className="w-3 h-3" />
                <span>Install</span>
              </button>
              <button
                onClick={onOpenFlutterCode}
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-1 rounded-lg"
              >
                <Code2 className="w-3 h-3" />
                <span>Code</span>
              </button>
            </div>
          </div>

          {/* Scrollable Screen Content */}
          <div className="flex-1 overflow-y-auto px-4 py-3 min-h-0 bg-slate-50/50 dark:bg-slate-900/40">
            {renderScreen()}
          </div>

          {/* Bottom Navigation Bar */}
          <BottomNav />

          {/* Android Home Indicator Bar */}
          <div className="h-3.5 bg-white dark:bg-slate-900 flex items-center justify-center shrink-0">
            <div className="w-28 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
          </div>
        </div>
      </div>
    );
  }

  // Responsive Desktop Web View mode:
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors flex flex-col">
      <Header
        onOpenFlutterCode={onOpenFlutterCode}
        onOpenInstallModal={onOpenInstallModal}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {renderScreen()}
      </main>

      {/* Persistent Bottom Bar on Mobile Web */}
      <div className="block md:hidden">
        <BottomNav />
      </div>

      {/* Web Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">QuizNova</span>
            <span aria-hidden="true">·</span>
            <span>IITM Pravartak & BodhBridge Flutter Lab | KHIT Guntur Group Project</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenInstallModal}
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Install Mobile App / Release APK
            </button>
            <button
              onClick={onOpenFlutterCode}
              className="font-semibold text-slate-600 dark:text-slate-300 hover:underline"
            >
              Flutter Project Code (GP 1 - GP 11)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  const [isFlutterModalOpen, setIsFlutterModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  return (
    <QuizProvider>
      <MainContent
        onOpenFlutterCode={() => setIsFlutterModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
      />
      <FlutterCodeModal
        isOpen={isFlutterModalOpen}
        onClose={() => setIsFlutterModalOpen(false)}
      />
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        onOpenFlutterCode={() => {
          setIsInstallModalOpen(false);
          setIsFlutterModalOpen(true);
        }}
      />
    </QuizProvider>
  );
}
