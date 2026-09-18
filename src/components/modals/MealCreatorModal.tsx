import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MealType } from '../../types';
import { X, Utensils, Check, Sparkles } from 'lucide-react';

interface MealCreatorModalProps {
  defaultMealType?: MealType;
  isOpen: boolean;
  onClose: () => void;
}

export const MealCreatorModal: React.FC<MealCreatorModalProps> = ({
  defaultMealType = 'breakfast',
  isOpen,
  onClose,
}) => {
  const { addMeal } = useApp();

  const [mealType, setMealType] = useState<MealType>(defaultMealType);
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState<number | ''>(350);
  const [protein, setProtein] = useState<number | ''>(15);
  const [carbs, setCarbs] = useState<number | ''>(45);
  const [fat, setFat] = useState<number | ''>(10);
  const [benefits, setBenefits] = useState('');
  const [portion, setPortion] = useState('1 medium bowl (250g)');
  const [prepTimeMinutes, setPrepTimeMinutes] = useState<number | ''>(15);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) return;

    addMeal({
      mealType,
      foodName: foodName.trim(),
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      benefits: benefits.trim() || 'Balanced daily nourishment with essential macronutrients',
      portion: portion.trim() || '1 standard serving',
      prepTimeMinutes: Number(prepTimeMinutes) || 10,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-stone-50 dark:bg-stone-900 rounded-[36px] p-6 shadow-2xl border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <Utensils className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base font-['Outfit']">Log Custom Meal</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Meal Type Picker */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1.5">
              Meal Category
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'breakfast', label: 'Breakfast', icon: '🍳' },
                { id: 'lunch', label: 'Lunch', icon: '🍱' },
                { id: 'snack', label: 'Snack', icon: '🥜' },
                { id: 'dinner', label: 'Dinner', icon: '🍲' },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMealType(item.id as MealType)}
                  className={`py-2 px-1 rounded-xl text-xs font-medium text-center transition-colors ${
                    mealType === item.id
                      ? 'bg-amber-600 text-white font-semibold shadow-xs'
                      : 'bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <span className="block text-sm mb-0.5">{item.icon}</span>
                  <span className="text-[10px]">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Food Name */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">
              Meal / Dish Name
            </label>
            <input
              type="text"
              required
              value={foodName}
              onChange={e => setFoodName(e.target.value)}
              placeholder="e.g. Avocado Toast with Poached Egg..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Portion & Prep Time */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">
                Portion Size
              </label>
              <input
                type="text"
                value={portion}
                onChange={e => setPortion(e.target.value)}
                placeholder="1 bowl / 200g"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">
                Prep Time (mins)
              </label>
              <input
                type="number"
                min="0"
                value={prepTimeMinutes}
                onChange={e => setPrepTimeMinutes(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="15"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
              />
            </div>
          </div>

          {/* Nutrition Macros Grid */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/60 space-y-2">
            <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 block">
              Nutritional Macros (Approx)
            </span>
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-stone-400 block mb-0.5">Calories</span>
                <input
                  type="number"
                  min="0"
                  value={calories}
                  onChange={e => setCalories(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full p-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-center font-bold"
                />
              </div>
              <div>
                <span className="text-[10px] text-stone-400 block mb-0.5">Protein (g)</span>
                <input
                  type="number"
                  min="0"
                  value={protein}
                  onChange={e => setProtein(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full p-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-center font-bold text-emerald-600"
                />
              </div>
              <div>
                <span className="text-[10px] text-stone-400 block mb-0.5">Carbs (g)</span>
                <input
                  type="number"
                  min="0"
                  value={carbs}
                  onChange={e => setCarbs(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full p-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-center font-bold text-sky-600"
                />
              </div>
              <div>
                <span className="text-[10px] text-stone-400 block mb-0.5">Fat (g)</span>
                <input
                  type="number"
                  min="0"
                  value={fat}
                  onChange={e => setFat(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full p-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-center font-bold text-amber-600"
                />
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">
              Key Health Benefits / Notes
            </label>
            <textarea
              rows={2}
              value={benefits}
              onChange={e => setBenefits(e.target.value)}
              placeholder="e.g. Rich in clean fiber, good healthy fats, sustained focus..."
              className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/30 transition-all flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Log Meal to Today</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
