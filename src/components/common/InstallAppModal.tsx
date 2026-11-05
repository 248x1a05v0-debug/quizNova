import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import {
  Download,
  Smartphone,
  CheckCircle,
  Share,
  PlusSquare,
  X,
  Sparkles,
  Terminal,
  Copy,
  Check,
} from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFlutterCode: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  onOpenFlutterCode,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'pwa' | 'apk'>('pwa');
  const [apkCmdCopied, setApkCmdCopied] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  const copyApkCommand = () => {
    navigator.clipboard.writeText('flutter build apk --release');
    setApkCmdCopied(true);
    setTimeout(() => setApkCmdCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-gradient-to-r from-indigo-50/60 to-violet-50/60 dark:from-indigo-950/40 dark:to-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30 shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100">
                Install QuizNova as an App
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Run natively on your phone without browser address bars
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Direct Phone Install (PWA) vs Android APK (Flutter GP 10) */}
        <div className="p-4 pb-0">
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('pwa')}
              className={`py-2 px-3 rounded-lg transition-all ${
                activeTab === 'pwa'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              📱 Instant Phone App (PWA)
            </button>
            <button
              onClick={() => setActiveTab('apk')}
              className={`py-2 px-3 rounded-lg transition-all ${
                activeTab === 'apk'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              🤖 Release APK (GP 10)
            </button>
          </div>
        </div>

        {/* Tab 1: Instant PWA Install on Android / iOS */}
        {activeTab === 'pwa' && (
          <div className="p-5 sm:p-6 space-y-4">
            {isInstalled ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
                  QuizNova is Installed!
                </h3>
                <p className="text-xs text-emerald-800/80 dark:text-emerald-300">
                  You are running QuizNova in standalone mobile app mode.
                </p>
              </div>
            ) : isInstallable ? (
              <div className="space-y-4 text-center">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Click the button below to add <strong>QuizNova</strong> directly to your Android or desktop home screen with a dedicated app icon and full-screen experience.
                </p>

                <button
                  onClick={handleInstallClick}
                  className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-[0.99] transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Install QuizNova App Now</span>
                </button>
              </div>
            ) : isIOS ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  To install QuizNova on your iPhone or iPad:
                </p>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                      1
                    </div>
                    <span>Tap the <strong>Share</strong> button <Share className="w-3.5 h-3.5 inline text-indigo-500 mx-1" /> in Safari's bottom toolbar.</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                      2
                    </div>
                    <span>Scroll down and select <strong>Add to Home Screen</strong> <PlusSquare className="w-3.5 h-3.5 inline text-indigo-500 mx-1" />.</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                      3
                    </div>
                    <span>Tap <strong>Add</strong> in the top-right corner.</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Open this link on your Android device in <strong>Chrome</strong>:
                </p>
                <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px] select-all break-all text-indigo-600 dark:text-indigo-400">
                  {window.location.origin}
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <p className="font-bold text-slate-800 dark:text-slate-200">How to install in Chrome:</p>
                  <p>1. Tap the three dots (<strong>⋮</strong>) in the top-right corner of Chrome.</p>
                  <p>2. Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</p>
                  <p>3. QuizNova will install on your phone like any Play Store app!</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Release APK (Flutter GP 10 Requirement) */}
        {activeTab === 'apk' && (
          <div className="p-5 sm:p-6 space-y-4 text-xs">
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              For your <strong>KHIT Guntur Group Project Submission (GP 10)</strong>, generate the physical Android Release APK using the full Flutter project files:
            </p>

            <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-[10px]">
                <span>TERMINAL COMMAND</span>
                <button
                  onClick={copyApkCommand}
                  className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
                >
                  {apkCmdCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{apkCmdCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-emerald-400 font-bold">flutter build apk --release</p>
              <p className="text-slate-400 text-[10px]">
                Output: build/app/outputs/flutter-apk/app-release.apk
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 space-y-2">
              <h4 className="font-bold text-indigo-950 dark:text-indigo-200">
                Flutter Codebase Bundle Included
              </h4>
              <p className="text-indigo-900/80 dark:text-indigo-300 leading-relaxed">
                All source code files (`main.dart`, `models/`, `services/`, `providers/`, `screens/`, `widget_test.dart`, and `pubspec.yaml`) are pre-generated inside the app.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenFlutterCode();
                }}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-xs hover:bg-indigo-700 transition-colors"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Open Flutter Project Code Viewer</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
