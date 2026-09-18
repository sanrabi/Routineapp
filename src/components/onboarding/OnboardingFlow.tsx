import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Calendar, Utensils, Award, ArrowRight, Check } from 'lucide-react';

export const OnboardingFlow: React.FC = () => {
  const { completeOnboarding, userProfile } = useApp();
  const [step, setStep] = useState<number>(1);

  // Form state
  const [name, setName] = useState(userProfile.name || 'Alex');
  const [wakeUpTime, setWakeUpTime] = useState(userProfile.wakeUpTime || '06:30');
  const [sleepTime, setSleepTime] = useState(userProfile.sleepTime || '22:30');
  const [dailyWaterGoal, setDailyWaterGoal] = useState(userProfile.dailyWaterGoal || 8);
  const [breakfastTime, setBreakfastTime] = useState(userProfile.mealTimes.breakfast || '08:30');
  const [lunchTime, setLunchTime] = useState(userProfile.mealTimes.lunch || '13:00');
  const [snackTime, setSnackTime] = useState(userProfile.mealTimes.snack || '16:30');
  const [dinnerTime, setDinnerTime] = useState(userProfile.mealTimes.dinner || '20:00');

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    completeOnboarding({
      name: name.trim() || 'Alex',
      wakeUpTime,
      sleepTime,
      dailyWaterGoal: Number(dailyWaterGoal) || 8,
      mealTimes: {
        breakfast: breakfastTime,
        lunch: lunchTime,
        snack: snackTime,
        dinner: dinnerTime,
      },
    });
  };

  const screens = [
    {
      step: 1,
      title: 'Organize your day.',
      subtitle: 'Schedule routines, prioritize tasks, and keep every hour intentional without stress.',
      icon: Calendar,
      accentColor: 'from-emerald-500 to-teal-600',
      badge: 'Time Management',
    },
    {
      step: 2,
      title: 'Eat better, one meal at a time.',
      subtitle: 'Discover healthy foods, track macros, explore guilt-free snacks, and nourish your body.',
      icon: Utensils,
      accentColor: 'from-amber-500 to-orange-600',
      badge: 'Nutrition & Meals',
    },
    {
      step: 3,
      title: 'Build healthy daily habits.',
      subtitle: 'Strengthen hydration, regular rest, mindful eating, and celebrate daily consistency.',
      icon: Award,
      accentColor: 'from-sky-500 to-indigo-600',
      badge: 'Habits & Rest',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-stone-50 dark:bg-stone-950 rounded-[32px] p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 max-h-[92vh] overflow-y-auto">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step
                    ? 'w-8 bg-emerald-600 dark:bg-emerald-400'
                    : i < step
                    ? 'w-4 bg-emerald-300 dark:bg-emerald-700'
                    : 'w-2 bg-stone-200 dark:bg-stone-800'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setStep(4)}
            className="text-xs font-semibold text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
          >
            {step < 4 ? 'Skip Setup' : ''}
          </button>
        </div>

        {/* Informational Intro Screens (Steps 1, 2, 3) */}
        {step <= 3 && (
          <div className="flex flex-col items-center text-center py-4">
            {screens.map(item => {
              if (item.step !== step) return null;
              const Icon = item.icon;
              return (
                <div key={item.step} className="flex flex-col items-center">
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 mb-6">
                    {item.badge}
                  </span>

                  <div
                    className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${item.accentColor} flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 mb-6 transform hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-12 h-12 stroke-[1.75]" />
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50 mb-3 font-['Outfit']">
                    {item.title}
                  </h2>
                  <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed max-w-xs mb-8">
                    {item.subtitle}
                  </p>
                </div>
              );
            })}

            <div className="w-full flex items-center gap-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(s => s - 1)}
                  className="px-5 py-3.5 rounded-2xl border border-stone-300 dark:border-stone-700 font-semibold text-sm hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors"
                >
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={() => setStep(s => s + 1)}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/30 transition-all active:scale-[0.98]"
              >
                {step === 3 ? 'Set Up My Routine' : 'Next'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Questionnaire Setup */}
        {step === 4 && (
          <form onSubmit={handleFinish} className="flex flex-col gap-4">
            <div className="text-center mb-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold font-['Outfit']">Personalize Your Day</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Help DayFlow tailor your schedule, hydration goals, and meal alerts.
              </p>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Alex"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            {/* Wake & Sleep Times */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  🌅 Wake-up Time
                </label>
                <input
                  type="time"
                  value={wakeUpTime}
                  onChange={e => setWakeUpTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  😴 Sleep Time
                </label>
                <input
                  type="time"
                  value={sleepTime}
                  onChange={e => setSleepTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm"
                />
              </div>
            </div>

            {/* Daily Water Goal */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  💧 Daily Water Goal
                </label>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {dailyWaterGoal} glasses ({(dailyWaterGoal * 0.25).toFixed(1)} L)
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="16"
                step="1"
                value={dailyWaterGoal}
                onChange={e => setDailyWaterGoal(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>4 glasses (1L)</span>
                <span>8 glasses (2L)</span>
                <span>16 glasses (4L)</span>
              </div>
            </div>

            {/* Preferred Meal Times */}
            <div className="bg-stone-100/70 dark:bg-stone-900/70 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800">
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
                🍽 Preferred Meal Schedule
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-stone-500 block mb-0.5">🍳 Breakfast</span>
                  <input
                    type="time"
                    value={breakfastTime}
                    onChange={e => setBreakfastTime(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                  />
                </div>
                <div>
                  <span className="text-stone-500 block mb-0.5">🍱 Lunch</span>
                  <input
                    type="time"
                    value={lunchTime}
                    onChange={e => setLunchTime(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                  />
                </div>
                <div>
                  <span className="text-stone-500 block mb-0.5">🥜 Snack</span>
                  <input
                    type="time"
                    value={snackTime}
                    onChange={e => setSnackTime(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                  />
                </div>
                <div>
                  <span className="text-stone-500 block mb-0.5">🍲 Dinner</span>
                  <input
                    type="time"
                    value={dinnerTime}
                    onChange={e => setDinnerTime(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-3 rounded-2xl border border-stone-300 dark:border-stone-700 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/30 transition-all active:scale-[0.98]"
              >
                <Check className="w-4 h-4" />
                Start My DayFlow
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
