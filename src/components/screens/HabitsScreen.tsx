import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckSquare,
  Plus,
  Flame,
  CheckCircle2,
  Circle,
  Calendar,
  Trophy,
  Trash2,
  X,
  Sparkles,
} from 'lucide-react';

export const HabitsScreen: React.FC = () => {
  const { habits, toggleHabitToday, addHabit, deleteHabit } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitIcon, setNewHabitIcon] = useState('✨');
  const [newHabitTarget, setNewHabitTarget] = useState(7);
  const [newHabitCategory, setNewHabitCategory] = useState('Daily');

  const todayStr = new Date().toISOString().split('T')[0];

  // Calculate past 7 days for the weekly calendar bubbles
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString(undefined, { weekday: 'narrow' }),
      dayNumber: d.getDate(),
      isToday: i === 6,
    };
  });

  // Calculate stats
  const totalHabits = habits.length;
  const completedToday = habits.filter(h => h.completedDates.includes(todayStr)).length;
  const completionRateToday = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  // Best streak
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);

  // Weekly average across past 7 days
  const weeklyCompletions = last7Days.reduce((sum, day) => {
    const count = habits.filter(h => h.completedDates.includes(day.dateStr)).length;
    return sum + count;
  }, 0);
  const weeklyPossible = totalHabits * 7;
  const weeklyPercent = weeklyPossible > 0 ? Math.round((weeklyCompletions / weeklyPossible) * 100) : 0;

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    addHabit(newHabitName.trim(), newHabitIcon, newHabitTarget, newHabitCategory);
    setNewHabitName('');
    setIsAddModalOpen(false);
  };

  const iconOptions = ['✨', '🏃', '💧', '🥗', '🍎', '📖', '🧘', '🌅', '😴', '💊', '🌿', '🚴'];

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-50 font-['Outfit']">
            Daily Habits
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {completedToday} of {totalHabits} habits completed today
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Habit</span>
        </button>
      </div>

      {/* Overview Analytics Dashboard */}
      <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Consistency Score
            </span>
            <div className="text-3xl font-black text-stone-900 dark:text-stone-50 font-['Outfit']">
              {completionRateToday}%
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 text-center">
              <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-0.5">
                <Flame className="w-3 h-3 text-amber-500" />
                Streak
              </span>
              <span className="text-sm font-extrabold text-amber-900 dark:text-amber-100">
                {bestStreak} days
              </span>
            </div>

            <div className="p-2.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200/60 dark:border-sky-900/40 text-center">
              <span className="text-[10px] uppercase font-bold text-sky-600 dark:text-sky-400 block">
                Weekly
              </span>
              <span className="text-sm font-extrabold text-sky-900 dark:text-sky-100">
                {weeklyPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* 7-Day Matrix Header */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>Past 7 Days History</span>
            <span className="text-[11px] font-medium">Daily completion rhythm</span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {last7Days.map(d => {
              const dayCompletions = habits.filter(h => h.completedDates.includes(d.dateStr)).length;
              const isFull = totalHabits > 0 && dayCompletions === totalHabits;
              return (
                <div
                  key={d.dateStr}
                  className={`p-2 rounded-2xl border transition-all ${
                    d.isToday
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800'
                      : 'bg-stone-50 dark:bg-stone-850 border-stone-200/60 dark:border-stone-800'
                  }`}
                >
                  <span className="text-[10px] font-bold text-stone-400 block">{d.dayName}</span>
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block mb-1">
                    {d.dayNumber}
                  </span>
                  <div
                    className={`w-4 h-4 rounded-full mx-auto flex items-center justify-center text-[9px] font-bold ${
                      dayCompletions > 0
                        ? isFull
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-200 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100'
                        : 'bg-stone-200 dark:bg-stone-700 text-stone-500'
                    }`}
                  >
                    {dayCompletions}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Habit List */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 px-1">
          Active Daily Habits
        </h3>

        {habits.map(habit => {
          const isDoneToday = habit.completedDates.includes(todayStr);

          return (
            <div
              key={habit.id}
              className={`p-4 rounded-3xl border transition-all duration-200 ${
                isDoneToday
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-300/80 dark:border-emerald-800/60'
                  : 'bg-white dark:bg-stone-900 border-stone-200/80 dark:border-stone-800 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                {/* Checkbox and Name */}
                <div
                  onClick={() => toggleHabitToday(habit.id)}
                  className="flex items-center gap-3.5 flex-1 cursor-pointer select-none"
                >
                  <span className="text-2xl shrink-0">{habit.icon}</span>

                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-sm font-bold tracking-tight text-stone-900 dark:text-stone-100 ${
                          isDoneToday ? 'line-through text-stone-400 dark:text-stone-500' : ''
                        }`}
                      >
                        {habit.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500 dark:text-stone-400">
                      <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-bold">
                        <Flame className="w-3 h-3" /> {habit.streak} day streak
                      </span>
                      <span>•</span>
                      <span>{habit.targetDaysPerWeek}x / week target</span>
                    </div>
                  </div>
                </div>

                {/* Check Circle Toggle */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleHabitToday(habit.id)}
                    className="p-1 text-stone-400 hover:text-emerald-600 transition-colors"
                  >
                    {isDoneToday ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Circle className="w-6 h-6 text-stone-300 dark:text-stone-600" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Delete habit "${habit.name}"?`)) {
                        deleteHabit(habit.id);
                      }
                    }}
                    className="p-1 text-stone-300 hover:text-rose-500 transition-colors"
                    title="Delete habit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 7 mini indicator dots for this specific habit */}
              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800 text-[10px] text-stone-400">
                <span className="text-[10px]">7-Day Log:</span>
                <div className="flex items-center gap-1.5">
                  {last7Days.map(d => {
                    const done = habit.completedDates.includes(d.dateStr);
                    return (
                      <div
                        key={d.dateStr}
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors ${
                          done
                            ? 'bg-emerald-500 text-white'
                            : 'bg-stone-200 dark:bg-stone-800'
                        }`}
                        title={`${d.dateStr}: ${done ? 'Done' : 'Missed'}`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Habit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-stone-50 dark:bg-stone-900 rounded-[36px] p-6 shadow-2xl border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base font-['Outfit']">New Habit</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHabit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">
                  Habit Name
                </label>
                <input
                  type="text"
                  required
                  value={newHabitName}
                  onChange={e => setNewHabitName(e.target.value)}
                  placeholder="e.g. 10 mins meditation, evening tea..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1.5">
                  Pick an Icon
                </label>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {iconOptions.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setNewHabitIcon(icon)}
                      className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                        newHabitIcon === icon
                          ? 'bg-emerald-600 text-white shadow-xs scale-105'
                          : 'bg-stone-200/70 dark:bg-stone-800'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">
                  Target Days Per Week ({newHabitTarget} days)
                </label>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={newHabitTarget}
                  onChange={e => setNewHabitTarget(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-stone-400">
                  <span>1 day</span>
                  <span>4 days</span>
                  <span>7 days (Daily)</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Habit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
