import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Droplets, Plus, Minus, CheckCircle, Sparkles } from 'lucide-react';

export const WaterTrackerModal: React.FC = () => {
  const { isWaterModalOpen, setIsWaterModalOpen, water, addWater, removeWater, setWaterGoal } = useApp();

  if (!isWaterModalOpen) return null;

  const percentage = Math.min(100, Math.round((water.glassesDrunk / water.dailyGoalGlasses) * 100));
  const totalLiters = ((water.glassesDrunk * water.glassSizeMl) / 1000).toFixed(2);
  const goalLiters = ((water.dailyGoalGlasses * water.glassSizeMl) / 1000).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-stone-50 dark:bg-stone-900 rounded-[32px] p-6 shadow-2xl border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-lg font-['Outfit']">Hydration Tracker</h3>
          </div>
          <button
            onClick={() => setIsWaterModalOpen(false)}
            className="p-1.5 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Water Gauge */}
        <div className="flex flex-col items-center justify-center my-4">
          <div className="relative w-36 h-48 bg-stone-200/80 dark:bg-stone-800 rounded-3xl overflow-hidden border-4 border-white dark:border-stone-700 shadow-inner flex flex-col justify-end">
            {/* Water Fill */}
            <div
              className="w-full bg-gradient-to-t from-sky-600 to-sky-400 transition-all duration-500 rounded-b-2xl relative"
              style={{ height: `${Math.max(8, percentage)}%` }}
            >
              {/* Ripple / Wave highlight */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-sky-200/50 blur-[1px] animate-pulse" />
            </div>

            {/* Inner Content overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-stone-900 dark:text-white drop-shadow-sm font-['Outfit']">
                {percentage}%
              </span>
              <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                {water.glassesDrunk} / {water.dailyGoalGlasses} glasses
              </span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400">
                {totalLiters}L of {goalLiters}L
              </span>
            </div>
          </div>

          {percentage >= 100 && (
            <div className="flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
              <CheckCircle className="w-3.5 h-3.5" /> Daily Goal Achieved!
            </div>
          )}
        </div>

        {/* Rapid Adjust Controls */}
        <div className="flex items-center justify-center gap-3 my-4">
          <button
            onClick={() => removeWater(1)}
            disabled={water.glassesDrunk <= 0}
            className="w-12 h-12 rounded-2xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 disabled:opacity-40 flex items-center justify-center text-stone-700 dark:text-stone-300 font-bold transition-all active:scale-95"
          >
            <Minus className="w-5 h-5" />
          </button>
          <button
            onClick={() => addWater(1)}
            className="flex-1 py-3 px-4 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-600/25 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Add 1 Glass (250ml)
          </button>
          <button
            onClick={() => addWater(2)}
            className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/80 hover:bg-sky-200 dark:hover:bg-sky-900 text-sky-700 dark:text-sky-300 font-bold text-xs flex flex-col items-center justify-center transition-all active:scale-95"
            title="Add 2 glasses (500ml)"
          >
            <span>+2</span>
            <span className="text-[9px]">500ml</span>
          </button>
        </div>

        {/* Goal Slider */}
        <div className="bg-stone-100 dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-700/60 my-3">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">Daily Target</span>
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
              {water.dailyGoalGlasses} glasses ({goalLiters} L)
            </span>
          </div>
          <input
            type="range"
            min="4"
            max="16"
            step="1"
            value={water.dailyGoalGlasses}
            onChange={e => setWaterGoal(Number(e.target.value))}
            className="w-full accent-sky-600"
          />
        </div>

        {/* Hydration Health Note */}
        <div className="flex items-start gap-2 p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200/70 dark:border-sky-800/40 text-[11px] text-sky-800 dark:text-sky-300">
          <Sparkles className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
          <p>
            Steady water intake optimizes cellular energy, aids smoother nutrient breakdown, and maintains focus throughout the day.
          </p>
        </div>
      </div>
    </div>
  );
};
