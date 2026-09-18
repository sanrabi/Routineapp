import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  User,
  Clock,
  Utensils,
  Bell,
  Droplets,
  Palette,
  HardDrive,
  Info,
  Check,
  Download,
  Upload,
  RefreshCw,
  Sliders,
  Volume2,
} from 'lucide-react';
import { storage } from '../../services/storage';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    userProfile,
    updateProfile,
    theme,
    toggleTheme,
    notifications,
    updateNotifications,
    requestNotificationPermission,
    resetAllData,
    showToast,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'schedule' | 'notifications' | 'data' | 'about'>('profile');

  // Local form state for profile
  const [name, setName] = useState(userProfile.name);
  const [wakeUpTime, setWakeUpTime] = useState(userProfile.wakeUpTime);
  const [sleepTime, setSleepTime] = useState(userProfile.sleepTime);
  const [dailyWaterGoal, setDailyWaterGoal] = useState(userProfile.dailyWaterGoal);
  const [units, setUnits] = useState(userProfile.units);
  const [breakfastTime, setBreakfastTime] = useState(userProfile.mealTimes.breakfast);
  const [lunchTime, setLunchTime] = useState(userProfile.mealTimes.lunch);
  const [snackTime, setSnackTime] = useState(userProfile.mealTimes.snack);
  const [dinnerTime, setDinnerTime] = useState(userProfile.mealTimes.dinner);

  if (!isSettingsOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      wakeUpTime,
      sleepTime,
      dailyWaterGoal: Number(dailyWaterGoal),
      units,
      mealTimes: {
        breakfast: breakfastTime,
        lunch: lunchTime,
        snack: snackTime,
        dinner: dinnerTime,
      },
    });
  };

  const handleExportData = () => {
    const jsonStr = storage.exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DayFlow_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Data exported successfully!', 'success');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = storage.importAllData(content);
      if (success) {
        window.location.reload();
      } else {
        showToast('Invalid backup file format', 'info');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-stone-50 dark:bg-stone-900 rounded-[36px] shadow-2xl border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-['Outfit']">Settings & Profile</h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">DayFlow Preferences</p>
            </div>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-2 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-tab Pills */}
        <div className="flex items-center gap-1.5 px-6 pt-3 pb-1 border-b border-stone-200/60 dark:border-stone-800/60 overflow-x-auto scrollbar-none text-xs">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'schedule', label: 'Daily Schedule', icon: Clock },
            { id: 'notifications', label: 'Reminders', icon: Bell },
            { id: 'data', label: 'Data', icon: HardDrive },
            { id: 'about', label: 'About', icon: Info },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* PROFILE SUBTAB */}
          {activeSubTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Theme & Mode */}
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/60">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-semibold">Appearance Theme</span>
                  </div>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-700 dark:hover:bg-stone-600 text-xs font-semibold text-stone-700 dark:text-stone-200 transition-colors"
                  >
                    Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
                  </button>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Current: <strong className="capitalize">{theme}</strong> mode. Calming, eye-friendly palette crafted for low eye fatigue.
                </p>
              </div>

              {/* Units */}
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/60">
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
                  Measurement Units
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setUnits('metric')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-colors ${
                      units === 'metric'
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : 'border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    Metric (ml, grams)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnits('imperial')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-colors ${
                      units === 'imperial'
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : 'border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    Imperial (fl oz, oz)
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Save Profile Preferences
              </button>
            </form>
          )}

          {/* SCHEDULE SUBTAB */}
          {activeSubTab === 'schedule' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/60 space-y-3">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  🌅 Daily Sleep & Wake Anchor
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                      Wake-up Time
                    </label>
                    <input
                      type="time"
                      value={wakeUpTime}
                      onChange={e => setWakeUpTime(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                      Bedtime / Sleep
                    </label>
                    <input
                      type="time"
                      value={sleepTime}
                      onChange={e => setSleepTime(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Meal preferences */}
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/60 space-y-3">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-amber-500" />
                  <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Meal Windows
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-stone-500 block mb-0.5">🍳 Breakfast</span>
                    <input
                      type="time"
                      value={breakfastTime}
                      onChange={e => setBreakfastTime(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
                    />
                  </div>
                  <div>
                    <span className="text-stone-500 block mb-0.5">🍱 Lunch</span>
                    <input
                      type="time"
                      value={lunchTime}
                      onChange={e => setLunchTime(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
                    />
                  </div>
                  <div>
                    <span className="text-stone-500 block mb-0.5">🥜 Evening Snack</span>
                    <input
                      type="time"
                      value={snackTime}
                      onChange={e => setSnackTime(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
                    />
                  </div>
                  <div>
                    <span className="text-stone-500 block mb-0.5">🍲 Dinner</span>
                    <input
                      type="time"
                      value={dinnerTime}
                      onChange={e => setDinnerTime(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
                    />
                  </div>
                </div>
              </div>

              {/* Water Goal */}
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/60">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-sky-500" />
                    <span className="text-xs font-semibold">Daily Water Goal</span>
                  </div>
                  <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
                    {dailyWaterGoal} glasses ({(dailyWaterGoal * 0.25).toFixed(1)}L)
                  </span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="16"
                  step="1"
                  value={dailyWaterGoal}
                  onChange={e => setDailyWaterGoal(Number(e.target.value))}
                  className="w-full accent-sky-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Save Schedule & Water Targets
              </button>
            </form>
          )}

          {/* NOTIFICATIONS SUBTAB */}
          {activeSubTab === 'notifications' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    System Push Alerts
                  </h4>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    Allow browser reminders for routines & water
                  </p>
                </div>
                <button
                  onClick={() => requestNotificationPermission()}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                >
                  Enable Permissions
                </button>
              </div>

              {/* Sound toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/60">
                <div className="flex items-center gap-2.5">
                  <Volume2 className="w-4 h-4 text-stone-500" />
                  <span className="text-xs font-semibold">Sound & Haptics</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.soundEnabled}
                  onChange={e => updateNotifications({ soundEnabled: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
              </div>

              {/* Notification Category Toggles requested by user */}
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/60 space-y-2.5">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                  Active Reminder Channels
                </h4>

                {[
                  { key: 'breakfast', label: 'Breakfast Notification', icon: '🍳' },
                  { key: 'lunch', label: 'Lunch Notification', icon: '🍱' },
                  { key: 'snack', label: 'Snack Notification', icon: '🥜' },
                  { key: 'dinner', label: 'Dinner Notification', icon: '🍲' },
                  { key: 'water', label: 'Hydration & Water Check-ins', icon: '💧' },
                  { key: 'tasks', label: 'Time Management / Tasks', icon: '📅' },
                  { key: 'exercise', label: 'Movement & Exercise Reminder', icon: '🏃' },
                  { key: 'sleep', label: 'Sleep & Wind-down Alert', icon: '😴' },
                ].map(item => {
                  const isChecked = notifications[item.key as keyof typeof notifications] as boolean;
                  return (
                    <label
                      key={item.key}
                      className="flex items-center justify-between py-1.5 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-750 px-2 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-2 text-xs font-medium">
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={e =>
                          updateNotifications({ [item.key]: e.target.checked })
                        }
                        className="w-4 h-4 accent-emerald-600 rounded"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* DATA SUBTAB */}
          {activeSubTab === 'data' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/60 space-y-2">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Backup & Portability
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  DayFlow stores everything locally on your device for fast, private, offline-first access. You can back up your logs anytime.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={handleExportData}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-700 dark:hover:bg-stone-600 text-xs font-semibold transition-colors"
                  >
                    <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Export Data (JSON)
                  </button>

                  <label className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-700 dark:hover:bg-stone-600 text-xs font-semibold cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    <span>Import Data</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportFile}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Reset to initial sample data */}
              <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 space-y-2">
                <h4 className="text-xs font-bold text-rose-800 dark:text-rose-300">
                  Reset & Sample Data
                </h4>
                <p className="text-xs text-rose-700/80 dark:text-rose-400">
                  Restore original balanced routines, sample meals, tasks, and healthy habits.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Reset all DayFlow data to sample starter state?')) {
                      resetAllData();
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Restore Sample Starter Data
                </button>
              </div>
            </div>
          )}

          {/* ABOUT SUBTAB */}
          {activeSubTab === 'about' && (
            <div className="space-y-3 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              <div className="p-5 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/60 text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2 text-xl font-bold font-['Outfit']">
                  D
                </div>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-50 font-['Outfit']">
                  DayFlow Mobile
                </h3>
                <p className="text-stone-500 dark:text-stone-400 text-[11px] mb-3">
                  Version 1.0.0 (Production Release)
                </p>
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  A daily lifestyle management application that brings time organization, nutritious meals, healthy snacks, water tracking, habits, and mindful notes together into one cohesive rhythm.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-100/80 dark:bg-stone-800/50 space-y-1.5">
                <h5 className="font-semibold text-stone-900 dark:text-stone-100">
                  Health & Nutrition Guidance
                </h5>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Nutritional calculations and benefits provided in DayFlow are based on standard nutritional databases and represent general health information, not medical advice.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
