import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MealType } from '../../types';
import { X, Plus, Clock, Sparkles, Check, Flame, ShieldAlert } from 'lucide-react';

export const FoodDetailModal: React.FC = () => {
  const { selectedFoodDetail, setSelectedFoodDetail, addMeal, showToast } = useApp();
  const [selectedMealType, setSelectedMealType] = useState<MealType>('snack');
  const [isLogged, setIsLogged] = useState(false);

  if (!selectedFoodDetail) return null;

  const handleLogFood = () => {
    addMeal({
      mealType: selectedMealType,
      foodName: selectedFoodDetail.name,
      calories: selectedFoodDetail.calories,
      protein: selectedFoodDetail.protein,
      carbs: selectedFoodDetail.carbs,
      fat: selectedFoodDetail.fat,
      benefits: selectedFoodDetail.benefits.join('. '),
      portion: selectedFoodDetail.suggestedServing,
      prepTimeMinutes: 5,
    });
    setIsLogged(true);
    setTimeout(() => {
      setIsLogged(false);
      setSelectedFoodDetail(null);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-stone-50 dark:bg-stone-900 rounded-[36px] p-6 shadow-2xl border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
            {selectedFoodDetail.category}
          </span>
          <button
            onClick={() => setSelectedFoodDetail(null)}
            className="p-1.5 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Visual */}
        <div className="text-center my-3">
          <div className="text-5xl mb-2 drop-shadow-sm">{selectedFoodDetail.icon}</div>
          <h3 className="text-xl font-bold font-['Outfit']">{selectedFoodDetail.name}</h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Serving: {selectedFoodDetail.suggestedServing}
          </p>
        </div>

        {/* Macro Nutrients Grid */}
        <div className="grid grid-cols-4 gap-2 my-4">
          <div className="p-2.5 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/60 text-center">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Calories</span>
            <span className="text-sm font-extrabold text-stone-900 dark:text-stone-100 flex items-center justify-center gap-0.5">
              <Flame className="w-3 h-3 text-amber-500" />
              {selectedFoodDetail.calories}
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/60 text-center">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Protein</span>
            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
              {selectedFoodDetail.protein}g
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/60 text-center">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Carbs</span>
            <span className="text-sm font-extrabold text-sky-600 dark:text-sky-400">
              {selectedFoodDetail.carbs}g
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/60 text-center">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Fat</span>
            <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400">
              {selectedFoodDetail.fat}g
            </span>
          </div>
        </div>

        {/* Health Benefits */}
        <div className="bg-white dark:bg-stone-800/80 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-700/60 mb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Health Benefits</span>
          </div>
          <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
            {selectedFoodDetail.benefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Best Time to Eat */}
        <div className="bg-stone-100 dark:bg-stone-800/50 p-3.5 rounded-2xl border border-stone-200/60 dark:border-stone-700/50 mb-3 flex items-start gap-2.5">
          <Clock className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold text-stone-800 dark:text-stone-200 block">Best Time to Eat</span>
            <span className="text-stone-500 dark:text-stone-400">{selectedFoodDetail.bestTimeToEat}</span>
          </div>
        </div>

        {/* Log To Meal Selector */}
        <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800">
          <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-2">
            Log directly to today's meals:
          </label>
          <div className="grid grid-cols-4 gap-1.5 mb-3">
            {[
              { id: 'breakfast', label: '🍳 Bfast' },
              { id: 'lunch', label: '🍱 Lunch' },
              { id: 'snack', label: '🥜 Snack' },
              { id: 'dinner', label: '🍲 Dinner' },
            ].map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMealType(m.id as MealType)}
                className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-colors ${
                  selectedMealType === m.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleLogFood}
            disabled={isLogged}
            className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
          >
            {isLogged ? (
              <>
                <Check className="w-4 h-4" />
                <span>Logged to {selectedMealType}!</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add to My {selectedMealType.toUpperCase()}</span>
              </>
            )}
          </button>
        </div>

        {/* Nutrition Disclaimer */}
        <div className="flex items-center gap-1.5 mt-3 text-[10px] text-stone-400 justify-center">
          <ShieldAlert className="w-3 h-3 text-stone-400 shrink-0" />
          <span>General nutrition information, not medical advice.</span>
        </div>
      </div>
    </div>
  );
};
