import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Droplets,
  CheckCircle2,
  Circle,
  Plus,
  ArrowRight,
  Flame,
  BarChart2,
  Clock,
  Calendar as CalendarIcon,
  CheckSquare,
  StickyNote,
} from 'lucide-react';

export const TodayDashboard: React.FC = () => {
  const {
    userProfile,
    routineItems,
    toggleRoutineItem,
    water,
    addWater,
    setIsWaterModalOpen,
    tasks,
    toggleTask,
    habits,
    toggleHabitToday,
    notes,
    setIsDailySummaryOpen,
    setActiveTab,
  } = useApp();

  // Current live time & date
  const [currentTime, setCurrentTime] = useState<string>('');
  const [greeting, setGreeting] = useState<string>('GOOD MORNING');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );

      const hour = now.getHours();
      if (hour < 12) setGreeting('GOOD MORNING 👋');
      else if (hour < 17) setGreeting('GOOD AFTERNOON ☀️');
      else setGreeting('GOOD EVENING 🌙');
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const todayFormatted = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Calculate routine & day progress
  const totalRoutine = routineItems.length;
  const completedRoutine = routineItems.filter(r => r.isCompleted).length;
  const progressPercent = totalRoutine > 0 ? Math.round((completedRoutine / totalRoutine) * 100) : 0;

  // Water calculations
  const waterPercent = Math.min(100, Math.round((water.glassesDrunk / water.dailyGoalGlasses) * 100));

  // Today string for habits
  const todayDateStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Greeting & Date Hero Banner */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 text-stone-100 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950 p-5 sm:p-6 shadow-xl border border-stone-800">
        {/* Subtle decorative glow */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-teal-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-extrabold tracking-widest text-emerald-400 uppercase">
                {greeting}
              </span>
              <span className="text-xs text-stone-400 font-medium">
                {userProfile.name ? userProfile.name : ''}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-['Outfit']">
              {todayFormatted}
            </h1>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-stone-800/80 border border-stone-700/60 text-emerald-400 text-xs font-mono font-bold tracking-tight">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            <span>{currentTime || '09:00 AM'}</span>
          </div>
        </div>

        {/* Today's Progress Bar (matches prompt: Today's Progress ██████░░░░ 60%) */}
        <div className="mt-5 pt-4 border-t border-stone-800/80">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-stone-300 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Today's Routine Progress
            </span>
            <span className="font-extrabold text-emerald-400 font-mono">
              {completedRoutine}/{totalRoutine} ({progressPercent}%)
            </span>
          </div>

          {/* Graphical Progress Bar */}
          <div className="h-3 w-full bg-stone-800 rounded-full overflow-hidden p-0.5 border border-stone-700/50">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Quick End-of-Day Summary Trigger */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[11px] text-stone-400">
              {progressPercent === 100 ? 'All daily anchors checked!' : 'Check off items as your day unfolds'}
            </span>
            <button
              onClick={() => setIsDailySummaryOpen(true)}
              className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span>Daily Summary</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Hydration Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm flex items-center justify-between gap-4">
        <div
          onClick={() => setIsWaterModalOpen(true)}
          className="flex items-center gap-3 cursor-pointer flex-1"
        >
          <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 flex items-center justify-center text-xl shadow-xs">
            💧
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                Water Intake
              </h3>
              <span className="text-[10px] font-bold text-sky-700 dark:text-sky-300 bg-sky-100/70 dark:bg-sky-950 px-1.5 py-0.5 rounded-full">
                {waterPercent}%
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {water.glassesDrunk} of {water.dailyGoalGlasses} glasses ({((water.glassesDrunk * water.glassSizeMl) / 1000).toFixed(1)}L)
            </p>
            {/* Mini Progress */}
            <div className="w-28 sm:w-36 h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-sky-500 rounded-full transition-all duration-300"
                style={{ width: `${waterPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Add Button */}
        <button
          onClick={() => addWater(1)}
          className="px-3.5 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-sky-500/20 active:scale-95 transition-all"
          title="Quick log +1 glass"
        >
          <Plus className="w-4 h-4" />
          <span>+1 Glass</span>
        </button>
      </div>

      {/* 1. HOME / TODAY DASHBOARD ROUTINE TIMELINE */}
      <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 font-['Outfit']">
              Daily Rhythm & Routine
            </h2>
          </div>
          <span className="text-xs text-stone-400 font-medium">Tap to check off</span>
        </div>

        {/* Routine items matching user prompt specification */}
        <div className="space-y-2">
          {routineItems.map(item => {
            return (
              <div
                key={item.id}
                onClick={() => toggleRoutineItem(item.id)}
                className={`group flex items-center justify-between p-3 rounded-2xl border transition-all duration-200 cursor-pointer select-none ${
                  item.isCompleted
                    ? 'bg-stone-100/60 dark:bg-stone-800/40 border-stone-200/60 dark:border-stone-800 text-stone-400 dark:text-stone-500'
                    : 'bg-stone-50 dark:bg-stone-850 hover:bg-emerald-50/40 dark:hover:bg-stone-800 border-stone-200/80 dark:border-stone-700/60 text-stone-800 dark:text-stone-200 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl shrink-0">{item.icon}</span>
                  <div>
                    <span className="text-[11px] font-mono font-semibold text-stone-500 dark:text-stone-400 block">
                      {item.time}
                    </span>
                    <span
                      className={`text-sm font-semibold tracking-tight transition-all ${
                        item.isCompleted ? 'line-through text-stone-400 dark:text-stone-500' : ''
                      }`}
                    >
                      {item.title}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 p-1">
                  {item.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-stone-300 dark:text-stone-600 group-hover:text-emerald-500 transition-colors" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Priority Schedule Tasks Glance */}
      <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              Today's Key Tasks
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('schedule')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>View Schedule</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2">
          {tasks.slice(0, 4).map(task => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`flex items-center justify-between p-2.5 rounded-2xl border cursor-pointer transition-all ${
                task.isCompleted
                  ? 'bg-stone-100/60 dark:bg-stone-800/40 border-stone-200/60 dark:border-stone-800 text-stone-400'
                  : 'bg-stone-50 dark:bg-stone-850 border-stone-200/80 dark:border-stone-700/60 text-stone-800 dark:text-stone-200'
              }`}
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <span className="text-xs font-mono font-semibold text-stone-500 shrink-0">
                  {task.startTime}
                </span>
                <span
                  className={`text-xs font-medium truncate ${
                    task.isCompleted ? 'line-through text-stone-400' : ''
                  }`}
                >
                  {task.title}
                </span>
              </div>
              <div className="shrink-0">
                {task.isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Circle className="w-4 h-4 text-stone-300 dark:text-stone-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Habits Quick Glance */}
      <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              Daily Habits Check
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('habits')}
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>All Habits</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {habits.slice(0, 4).map(habit => {
            const isDone = habit.completedDates.includes(todayDateStr);
            return (
              <button
                key={habit.id}
                onClick={() => toggleHabitToday(habit.id)}
                className={`p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  isDone
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
                    : 'bg-stone-50 dark:bg-stone-850 border-stone-200/80 dark:border-stone-700/60 text-stone-700 dark:text-stone-300'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-base">{habit.icon}</span>
                  <span className="text-xs font-medium truncate">{habit.name}</span>
                </div>
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pinned Notes Glance */}
      {notes.length > 0 && (
        <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <StickyNote className="w-4 h-4 text-purple-500" />
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                Personal Notes
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('notes')}
              className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
            >
              <span>Open Notes</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div
            onClick={() => setActiveTab('notes')}
            className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-700/60 cursor-pointer hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                {notes[0].title}
              </span>
              <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full">
                {notes[0].category}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">
              {notes[0].content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
