export type MealType = 'breakfast' | 'lunch' | 'snack' | 'dinner';

export interface Task {
  id: string;
  title: string;
  startTime: string; // "09:00"
  endTime?: string;   // "10:00"
  category: 'routine' | 'work' | 'health' | 'meal' | 'personal' | 'exercise';
  isCompleted: boolean;
  isRecurring: boolean;
  reminder: boolean;
  date: string; // "YYYY-MM-DD"
  priority: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface MealLogItem {
  id: string;
  mealType: MealType;
  foodName: string;
  calories: number;
  protein: number; // in grams
  carbs: number;   // in grams
  fat: number;     // in grams
  benefits: string;
  portion: string; // e.g., "1 bowl (200g)"
  prepTimeMinutes: number;
  loggedAt: string;
  date: string; // "YYYY-MM-DD"
  isCompleted: boolean;
}

export type FoodCategory =
  | 'Fruits'
  | 'Vegetables'
  | 'Grains'
  | 'Protein-rich foods'
  | 'Nuts & seeds'
  | 'Dairy'
  | 'Healthy snacks'
  | 'Indian foods'
  | 'South Indian foods'
  | 'Drinks';

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  icon: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  benefits: string[];
  bestTimeToEat: string;
  suggestedServing: string;
  tags: string[];
  description?: string;
}

export type SnackTag =
  | 'high-protein'
  | 'low-prep'
  | 'vegetarian'
  | 'quick'
  | 'pre-workout'
  | 'post-workout';

export interface SnackItem {
  id: string;
  name: string;
  icon: string;
  calories: number;
  protein: number;
  tags: SnackTag[];
  prepTime: string;
  benefits: string;
  servingSize: string;
  ingredients: string;
}

export interface WaterState {
  dailyGoalGlasses: number;
  glassesDrunk: number;
  glassSizeMl: number;
  history: { time: string; amount: number }[];
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  completedDates: string[]; // ['2026-09-17', ...]
  streak: number;
  targetDaysPerWeek: number;
  category: string;
}

export type NoteCategory = 'Personal' | 'Work' | 'Fitness' | 'Food' | 'Ideas' | 'Important';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  color?: string;
}

export interface DailyRoutineItem {
  id: string;
  time: string; // "08:00 AM"
  title: string;
  icon: string;
  type: 'routine' | 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'sleep' | 'exercise';
  isCompleted: boolean;
}

export interface UserProfile {
  name: string;
  wakeUpTime: string; // "07:00"
  sleepTime: string;  // "22:30"
  dailyWaterGoal: number; // glasses
  mealTimes: {
    breakfast: string;
    lunch: string;
    snack: string;
    dinner: string;
  };
  hasCompletedOnboarding: boolean;
  theme: 'system' | 'light' | 'dark';
  units: 'metric' | 'imperial';
}

export interface NotificationSettings {
  breakfast: boolean;
  lunch: boolean;
  snack: boolean;
  dinner: boolean;
  water: number;
  tasks: boolean;
  exercise: boolean;
  sleep: boolean;
  soundEnabled: boolean;
}

export type NavTab = 'today' | 'schedule' | 'meals' | 'habits' | 'notes';
