import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle, Trophy, Sparkles, Calendar, ArrowRight } from 'lucide-react';

export const DailySummaryModal: React.FC = () => {
  const {
    isDailySummaryOpen,
    setIsDailySummaryOpen,
    tasks,
    meals,
    water,
    routineItems,
    notes,
    habits,
    setActiveTab,
  } = useApp();

  if (!isDailySummaryOpen) return null;

  // Calculate live stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.isCompleted).length;

  const totalMeals = meals.length;
  const completedMeals = meals.filter(m => m.isCompleted).length;

  const exerciseItem = routineItems.find(r => r.type === 'exercise');
  const isExerciseDone = exerciseItem ? exerciseItem.isCompleted : true;

  const sleepItem = routineItems.find(r => r.type === 'sleep');
  const isSleepDone = sleepItem ? sleepItem.isCompleted : false;

  const notesCount = notes.length;

  const todayStr = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Calculate overall day score out of 100%
  const taskWeight = totalTasks > 0 ? (completedTasks / totalTasks) * 40 : 40;
  const mealWeight = totalMeals > 0 ? (completedMeals / totalMeals) * 20 : 20;
  const waterWeight = Math.min(1, water.glassesDrunk / water.dailyGoalGlasses) * 20;
  const habitWeight = habits.length > 0 ? (habits.filter(h => h.completedDates.includes(new Date().toISOString().split('T')[0])).length / habits.length) * 20 : 20;
  const totalScore = Math.round(taskWeight + mealWeight + waterWeight + habitWeight);

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-stone-50 dark:bg-stone-900 rounded-[36px] p-6 sm:p-7 shadow-2xl border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              End-of-Day Review
            </span>
            <h2 className="text-xl font-extrabold font-['Outfit']">Today's Summary</h2>
          </div>
          <button
            onClick={() => setIsDailySummaryOpen(false)}
            className="p-1.5 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Date banner */}
        <div className="flex items-center gap-2 py-3 text-xs text-stone-500 dark:text-stone-400">
          <Calendar className="w-3.5 h-3.5 text-stone-400" />
          <span>{todayStr}</span>
        </div>

        {/* Big Score Card */}
        <div className="relative my-2 p-5 rounded-3xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-300/40 dark:border-emerald-700/30 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-1">
              <Trophy className="w-4 h-4" />
              <span>Lifestyle Score</span>
            </div>
            <div className="text-4xl font-black text-stone-900 dark:text-stone-50 font-['Outfit']">
              {totalScore}%
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
              {totalScore >= 80
                ? 'Outstanding commitment today!'
                : totalScore >= 50
                ? 'Steady daily progress made.'
                : 'A peaceful start to build upon.'}
            </p>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex flex-col items-center justify-center shadow-lg shadow-emerald-600/30">
            <Sparkles className="w-6 h-6 mb-0.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Flow</span>
          </div>
        </div>

        {/* Checklist Format requested by user prompt */}
        <div className="my-4 space-y-2.5">
          {/* Tasks */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/60 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-sm font-bold">
                ✅
              </div>
              <div>
                <p className="text-sm font-semibold">Tasks Completed</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">Scheduled priorities</p>
              </div>
            </div>
            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-xl">
              {completedTasks} / {totalTasks || 0}
            </span>
          </div>

          {/* Meals */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/60 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 flex items-center justify-center text-sm font-bold">
                🍳
              </div>
              <div>
                <p className="text-sm font-semibold">Meals Logged</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">Breakfast, lunch, snacks, dinner</p>
              </div>
            </div>
            <span className="text-sm font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-xl">
              {completedMeals} / {totalMeals || 4}
            </span>
          </div>

          {/* Water */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/60 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 flex items-center justify-center text-sm font-bold">
                💧
              </div>
              <div>
                <p className="text-sm font-semibold">Water Intake</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">Glasses consumed</p>
              </div>
            </div>
            <span className="text-sm font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50 px-2.5 py-1 rounded-xl">
              {water.glassesDrunk} / {water.dailyGoalGlasses}
            </span>
          </div>

          {/* Exercise */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/60 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 flex items-center justify-center text-sm font-bold">
                🏃
              </div>
              <div>
                <p className="text-sm font-semibold">Exercise Routine</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">Movement & workout</p>
              </div>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-xl ${
                isExerciseDone
                  ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50'
                  : 'text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800'
              }`}
            >
              {isExerciseDone ? 'Completed' : 'Pending'}
            </span>
          </div>

          {/* Sleep */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/60 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-sm font-bold">
                😴
              </div>
              <div>
                <p className="text-sm font-semibold">Sleep Target</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">Rest by scheduled bedtime</p>
              </div>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-xl ${
                isSleepDone
                  ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50'
                  : 'text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800'
              }`}
            >
              {isSleepDone ? 'Completed' : 'Scheduled'}
            </span>
          </div>

          {/* Notes */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/60 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 flex items-center justify-center text-sm font-bold">
                📝
              </div>
              <div>
                <p className="text-sm font-semibold">Notes & Ideas</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">Captured personal thoughts</p>
              </div>
            </div>
            <span className="text-sm font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 px-2.5 py-1 rounded-xl">
              {notesCount}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 flex gap-2">
          <button
            onClick={() => {
              setIsDailySummaryOpen(false);
              setActiveTab('habits');
            }}
            className="flex-1 py-3 px-4 rounded-2xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Review Habits</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsDailySummaryOpen(false)}
            className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Close Summary</span>
          </button>
        </div>
      </div>
    </div>
  );
};
