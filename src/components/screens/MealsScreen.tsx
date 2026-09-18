import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MealType, FoodCategory, SnackTag } from '../../types';
import { FOOD_LIBRARY, SNACKS_LIBRARY } from '../../data/initialData';
import { MealCreatorModal } from '../modals/MealCreatorModal';
import { FoodDetailModal } from '../modals/FoodDetailModal';
import {
  UtensilsCrossed,
  Plus,
  BookOpen,
  Search,
  Filter,
  Flame,
  Clock,
  Sparkles,
  CheckCircle2,
  Trash2,
  ChevronRight,
  Apple,
  Cookie,
  Info,
} from 'lucide-react';

export const MealsScreen: React.FC = () => {
  const {
    meals,
    deleteMeal,
    toggleMealCompleted,
    setSelectedFoodDetail,
    selectedFoodDetail,
  } = useApp();

  const [activeSubView, setActiveSubView] = useState<'today-meals' | 'food-library' | 'snacks'>('today-meals');

  // Modal controls
  const [isMealCreatorOpen, setIsMealCreatorOpen] = useState(false);
  const [activeMealTypeForCreator, setActiveMealTypeForCreator] = useState<MealType>('breakfast');

  // Food Library search & category
  const [librarySearch, setLibrarySearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'All'>('All');

  // Snacks filter
  const [snackFilter, setSnackFilter] = useState<SnackTag | 'all'>('all');

  // Today macro calculations
  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0);
  const totalCarbs = meals.reduce((sum, m) => sum + m.carbs, 0);
  const totalFat = meals.reduce((sum, m) => sum + m.fat, 0);

  // Filtered foods for library
  const filteredFoodLibrary = FOOD_LIBRARY.filter(food => {
    if (selectedCategory !== 'All' && food.category !== selectedCategory) {
      return false;
    }
    if (librarySearch.trim()) {
      const q = librarySearch.toLowerCase();
      return (
        food.name.toLowerCase().includes(q) ||
        food.category.toLowerCase().includes(q) ||
        food.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Filtered snacks
  const filteredSnacks = SNACKS_LIBRARY.filter(snack => {
    if (snackFilter !== 'all' && !snack.tags.includes(snackFilter)) {
      return false;
    }
    return true;
  });

  const categories: (FoodCategory | 'All')[] = [
    'All',
    'Fruits',
    'Vegetables',
    'Grains',
    'Protein-rich foods',
    'Nuts & seeds',
    'Dairy',
    'Healthy snacks',
    'Indian foods',
    'South Indian foods',
    'Drinks',
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Top Header & Sub-navigation Tabs */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-50 font-['Outfit']">
            Meals & Nutrition
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Nourishing, whole food lifestyle
          </p>
        </div>

        <button
          onClick={() => {
            setActiveMealTypeForCreator('breakfast');
            setIsMealCreatorOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/25 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Log Meal</span>
        </button>
      </div>

      {/* Sub-view switcher: Today's Meals / Food Library / Healthy Snacks */}
      <div className="flex p-1 bg-stone-200/70 dark:bg-stone-850 rounded-2xl">
        {[
          { id: 'today-meals', label: "Today's Meals", icon: UtensilsCrossed },
          { id: 'food-library', label: 'Food Library', icon: BookOpen },
          { id: 'snacks', label: 'Healthy Snacks', icon: Cookie },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubView(tab.id as typeof activeSubView)}
              className={`flex-1 py-2 flex items-center justify-center gap-1.5 text-xs font-semibold rounded-xl transition-all ${
                isActive
                  ? 'bg-white dark:bg-stone-750 text-amber-800 dark:text-amber-300 shadow-xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* VIEW 1: TODAY'S MEALS */}
      {activeSubView === 'today-meals' && (
        <div className="space-y-4">
          {/* Daily Macros Snapshot */}
          <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500" />
                Today's Macronutrients
              </span>
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                {totalCalories} kcal
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40">
                <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300 block">Calories</span>
                <span className="text-sm font-black text-amber-900 dark:text-amber-100">{totalCalories}</span>
              </div>
              <div className="p-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/40">
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 block">Protein</span>
                <span className="text-sm font-black text-emerald-900 dark:text-emerald-100">{totalProtein}g</span>
              </div>
              <div className="p-2 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200/60 dark:border-sky-900/40">
                <span className="text-[10px] uppercase font-bold text-sky-700 dark:text-sky-300 block">Carbs</span>
                <span className="text-sm font-black text-sky-900 dark:text-sky-100">{totalCarbs}g</span>
              </div>
              <div className="p-2 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200/60 dark:border-orange-900/40">
                <span className="text-[10px] uppercase font-bold text-orange-700 dark:text-orange-300 block">Fat</span>
                <span className="text-sm font-black text-orange-900 dark:text-orange-100">{totalFat}g</span>
              </div>
            </div>
          </div>

          {/* 4 MEAL SECTIONS: Breakfast, Lunch, Snacks, Dinner */}
          {(['breakfast', 'lunch', 'snack', 'dinner'] as const).map(mealType => {
            const mealItems = meals.filter(m => m.mealType === mealType);
            const icon =
              mealType === 'breakfast'
                ? '🍳'
                : mealType === 'lunch'
                ? '🍱'
                : mealType === 'snack'
                ? '🥜'
                : '🍲';

            const title =
              mealType === 'breakfast'
                ? 'Breakfast'
                : mealType === 'lunch'
                ? 'Lunch'
                : mealType === 'snack'
                ? 'Healthy Snacks'
                : 'Dinner';

            return (
              <div
                key={mealType}
                className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-3"
              >
                {/* Section Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{icon}</span>
                    <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 font-['Outfit']">
                      {title}
                    </h3>
                  </div>

                  <button
                    onClick={() => {
                      setActiveMealTypeForCreator(mealType);
                      setIsMealCreatorOpen(true);
                    }}
                    className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                {/* Items in this meal */}
                {mealItems.length === 0 ? (
                  <div className="py-4 text-center text-xs text-stone-400 border border-dashed border-stone-200 dark:border-stone-800 rounded-2xl">
                    No items logged for {title.toLowerCase()} yet.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {mealItems.map(item => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/70 dark:border-stone-700/60"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                              {item.foodName}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500 dark:text-stone-400">
                              <span>{item.portion}</span>
                              <span>•</span>
                              <span className="flex items-center gap-0.5">
                                <Clock className="w-3 h-3" /> {item.prepTimeMinutes}m prep
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => toggleMealCompleted(item.id)}
                              className={`p-1.5 rounded-xl transition-colors ${
                                item.isCompleted
                                  ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50'
                                  : 'text-stone-400 hover:text-emerald-600'
                              }`}
                              title="Mark meal completed"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteMeal(item.id)}
                              className="p-1.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Nutrition pill badges */}
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-stone-200/60 dark:border-stone-750 text-[10px] font-semibold">
                          <span className="text-amber-700 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950 px-2 py-0.5 rounded-md">
                            {item.calories} kcal
                          </span>
                          <span className="text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                            {item.protein}g Protein
                          </span>
                          <span className="text-sky-700 dark:text-sky-300 bg-sky-100/70 dark:bg-sky-950 px-2 py-0.5 rounded-md">
                            {item.carbs}g Carbs
                          </span>
                          <span className="text-orange-700 dark:text-orange-300 bg-orange-100/70 dark:bg-orange-950 px-2 py-0.5 rounded-md">
                            {item.fat}g Fat
                          </span>
                        </div>

                        {/* Benefits line */}
                        {item.benefits && (
                          <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1.5 italic">
                            💡 {item.benefits}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: SEARCHABLE HEALTHY FOOD LIBRARY (10 Categories) */}
      {activeSubView === 'food-library' && (
        <div className="space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={librarySearch}
              onChange={e => setLibrarySearch(e.target.value)}
              placeholder="Search foods, nutrients, or benefits..."
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          {/* 10 Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-amber-600 text-white font-semibold shadow-xs'
                    : 'bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Library Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {filteredFoodLibrary.map(food => (
              <div
                key={food.id}
                onClick={() => setSelectedFoodDetail(food)}
                className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 hover:border-amber-300 dark:hover:border-amber-700 cursor-pointer shadow-xs transition-all hover:translate-y-[-1px]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl shrink-0">{food.icon}</span>
                    <div>
                      <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                        {food.name}
                      </h4>
                      <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
                        {food.category}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 shrink-0 mt-1" />
                </div>

                {/* Macro preview */}
                <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500 dark:text-stone-400 mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800">
                  <span>{food.calories} kcal</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{food.protein}g protein</span>
                  <span>{food.suggestedServing.split('(')[0]}</span>
                </div>

                {/* First benefit */}
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1 line-clamp-1 italic">
                  ✓ {food.benefits[0]}
                </p>
              </div>
            ))}
          </div>

          {/* Medical disclaimer note */}
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-stone-100 dark:bg-stone-800/60 text-[11px] text-stone-500 dark:text-stone-400 mt-4">
            <Info className="w-4 h-4 text-stone-400 shrink-0" />
            <p>Health benefits are presented as general nutritional insights, not medical advice.</p>
          </div>
        </div>
      )}

      {/* VIEW 3: HEALTHY SNACKS SECTION (With 6 filters requested by prompt) */}
      {activeSubView === 'snacks' && (
        <div className="space-y-3">
          {/* Prompt requirement filters:
              - High protein
              - Low preparation
              - Vegetarian
              - Quick snacks
              - Pre-workout
              - Post-workout */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {[
              { id: 'all', label: 'All Snacks' },
              { id: 'high-protein', label: 'High Protein' },
              { id: 'low-prep', label: 'Low Preparation' },
              { id: 'vegetarian', label: 'Vegetarian' },
              { id: 'quick', label: 'Quick Snacks' },
              { id: 'pre-workout', label: 'Pre-Workout' },
              { id: 'post-workout', label: 'Post-Workout' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setSnackFilter(f.id as typeof snackFilter)}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
                  snackFilter === f.id
                    ? 'bg-amber-600 text-white font-semibold shadow-xs'
                    : 'bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Snacks Cards */}
          <div className="space-y-3 pt-1">
            {filteredSnacks.map(snack => (
              <div
                key={snack.id}
                className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl shrink-0">{snack.icon}</span>
                    <div>
                      <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                        {snack.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-stone-500 dark:text-stone-400">
                        <span>{snack.servingSize}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-3 h-3" /> {snack.prepTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950 px-2 py-0.5 rounded-xl">
                    {snack.protein}g protein
                  </span>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300">
                  {snack.benefits}
                </p>

                {/* Tags */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {snack.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-[10px] font-medium capitalize px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
                    >
                      {tag.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Meal Creator Modal */}
      <MealCreatorModal
        defaultMealType={activeMealTypeForCreator}
        isOpen={isMealCreatorOpen}
        onClose={() => setIsMealCreatorOpen(false)}
      />

      {/* Food Detail Modal */}
      <FoodDetailModal />
    </div>
  );
};
