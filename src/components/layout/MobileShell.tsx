import React, { useState } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { ToastContainer } from '../common/Toast';
import { Smartphone, Monitor } from 'lucide-react';

interface MobileShellProps {
  children: React.ReactNode;
}

export const MobileShell: React.FC<MobileShellProps> = ({ children }) => {
  const [deviceFrameMode, setDeviceFrameMode] = useState<'mobile-frame' | 'responsive'>('mobile-frame');

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100 flex flex-col items-center justify-start sm:p-4 transition-colors duration-200">
      <ToastContainer />

      {/* Desktop view switcher banner (only visible on wide screens) */}
      <div className="hidden lg:flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400 mb-3 px-4 py-1.5 rounded-full bg-stone-200/70 dark:bg-stone-800/80 border border-stone-300/60 dark:border-stone-700/60">
        <span className="font-medium text-stone-600 dark:text-stone-300">View Mode:</span>
        <button
          onClick={() => setDeviceFrameMode('mobile-frame')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-colors ${
            deviceFrameMode === 'mobile-frame'
              ? 'bg-white dark:bg-stone-700 text-emerald-700 dark:text-emerald-300 font-semibold shadow-xs'
              : 'hover:text-stone-700 dark:hover:text-stone-200'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          Mobile Phone
        </button>
        <button
          onClick={() => setDeviceFrameMode('responsive')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-colors ${
            deviceFrameMode === 'responsive'
              ? 'bg-white dark:bg-stone-700 text-emerald-700 dark:text-emerald-300 font-semibold shadow-xs'
              : 'hover:text-stone-700 dark:hover:text-stone-200'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          Full Responsive
        </button>
      </div>

      {/* Main App Container */}
      <div
        className={`w-full bg-stone-50 dark:bg-stone-950 flex flex-col relative transition-all duration-300 ${
          deviceFrameMode === 'mobile-frame'
            ? 'sm:max-w-[440px] sm:h-[92vh] sm:max-h-[920px] sm:rounded-[42px] sm:shadow-2xl sm:border-[8px] sm:border-stone-800 dark:sm:border-stone-800 overflow-hidden'
            : 'max-w-2xl min-h-screen sm:min-h-[90vh] sm:rounded-3xl sm:shadow-xl sm:border border-stone-200 dark:border-stone-800 overflow-hidden'
        }`}
      >
        {/* Simulated Phone Status Bar on desktop frame */}
        <div className="hidden sm:flex items-center justify-between px-7 pt-2.5 pb-1 text-[11px] font-semibold text-stone-600 dark:text-stone-400 select-none">
          <span>9:41</span>
          <div className="w-20 h-4 rounded-full bg-stone-900/10 dark:bg-stone-100/10 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-stone-400 dark:bg-stone-600"></div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px]">5G</span>
            <div className="w-4 h-2 rounded-xs border border-current flex items-center p-0.5">
              <div className="w-full h-full bg-current rounded-2xs"></div>
            </div>
          </div>
        </div>

        {/* Global Mobile Header */}
        <Header />

        {/* Main Content Area (Scrollable) */}
        <main className="flex-1 overflow-y-auto pb-24 px-4 pt-4 scroll-smooth">
          {children}
        </main>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};
