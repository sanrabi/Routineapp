import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Sun, Moon, Settings, BarChart2, Bell } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    theme,
    toggleTheme,
    setIsSettingsOpen,
    setIsDailySummaryOpen,
    userProfile,
    showToast,
  } = useApp();

  const handleTestNotification = () => {
    showToast(`💧 Reminder: Time for a refreshing glass of water!`, 'reminder');
  };

  return (
    <header className="sticky top-0 z-30 bg-stone-50/85 dark:bg-stone-950/85 backdrop-blur-md border-b border-stone-200/70 dark:border-stone-800/80 px-4 py-3 transition-colors">
      <div className="flex items-center justify-between">
        {/* Brand & Identity */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-stone-900 dark:text-stone-50 font-['Outfit']">
                DayFlow
              </span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                Daily
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
              Healthy & Organized
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Daily Summary button */}
          <button
            id="header-daily-summary-btn"
            onClick={() => setIsDailySummaryOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors text-xs font-semibold"
            title="View Daily Summary"
          >
            <BarChart2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden xs:inline">Summary</span>
          </button>

          {/* Quick Reminder Bell */}
          <button
            id="header-reminder-btn"
            onClick={handleTestNotification}
            className="p-2 rounded-xl text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-800/60 transition-colors relative"
            title="Test Hydration / Meal Reminder"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500"></span>
          </button>

          {/* Theme Toggle */}
          <button
            id="header-theme-btn"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-800/60 transition-colors"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-stone-600" />
            )}
          </button>

          {/* User Settings button */}
          <button
            id="header-settings-btn"
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-1.5 p-1 pl-1.5 pr-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200/60 dark:border-emerald-800/40 transition-colors"
            title="Settings & Profile"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center uppercase">
              {userProfile.name ? userProfile.name.charAt(0) : 'D'}
            </div>
            <Settings className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" />
          </button>
        </div>
      </div>
    </header>
  );
};
