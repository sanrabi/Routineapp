import { Task, MealLogItem, Habit, Note, DailyRoutineItem, UserProfile, NotificationSettings, WaterState } from '../types';
import {
  INITIAL_USER_PROFILE,
  INITIAL_NOTIFICATION_SETTINGS,
  INITIAL_ROUTINE_ITEMS,
  INITIAL_TASKS,
  INITIAL_MEALS,
  INITIAL_HABITS,
  INITIAL_NOTES,
} from '../data/initialData';

const STORAGE_KEYS = {
  PROFILE: 'dayflow_profile_v1',
  NOTIFICATIONS: 'dayflow_notifications_v1',
  ROUTINE: 'dayflow_routine_v1',
  TASKS: 'dayflow_tasks_v1',
  MEALS: 'dayflow_meals_v1',
  WATER: 'dayflow_water_v1',
  HABITS: 'dayflow_habits_v1',
  NOTES: 'dayflow_notes_v1',
  CUSTOM_FOODS: 'dayflow_custom_foods_v1',
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing ${key} to storage:`, err);
  }
}

export const storage = {
  getProfile: (): UserProfile => safeGet(STORAGE_KEYS.PROFILE, INITIAL_USER_PROFILE),
  setProfile: (p: UserProfile): void => safeSet(STORAGE_KEYS.PROFILE, p),

  getNotifications: (): NotificationSettings => safeGet(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATION_SETTINGS),
  setNotifications: (n: NotificationSettings): void => safeSet(STORAGE_KEYS.NOTIFICATIONS, n),

  getRoutine: (): DailyRoutineItem[] => safeGet(STORAGE_KEYS.ROUTINE, INITIAL_ROUTINE_ITEMS),
  setRoutine: (r: DailyRoutineItem[]): void => safeSet(STORAGE_KEYS.ROUTINE, r),

  getTasks: (): Task[] => safeGet(STORAGE_KEYS.TASKS, INITIAL_TASKS),
  setTasks: (t: Task[]): void => safeSet(STORAGE_KEYS.TASKS, t),

  getMeals: (): MealLogItem[] => safeGet(STORAGE_KEYS.MEALS, INITIAL_MEALS),
  setMeals: (m: MealLogItem[]): void => safeSet(STORAGE_KEYS.MEALS, m),

  getWater: (): WaterState => safeGet(STORAGE_KEYS.WATER, {
    dailyGoalGlasses: 8,
    glassesDrunk: 5,
    glassSizeMl: 250,
    history: [
      { time: '07:30 AM', amount: 1 },
      { time: '09:15 AM', amount: 1 },
      { time: '11:00 AM', amount: 1 },
      { time: '01:30 PM', amount: 1 },
      { time: '03:45 PM', amount: 1 },
    ],
  }),
  setWater: (w: WaterState): void => safeSet(STORAGE_KEYS.WATER, w),

  getHabits: (): Habit[] => safeGet(STORAGE_KEYS.HABITS, INITIAL_HABITS),
  setHabits: (h: Habit[]): void => safeSet(STORAGE_KEYS.HABITS, h),

  getNotes: (): Note[] => safeGet(STORAGE_KEYS.NOTES, INITIAL_NOTES),
  setNotes: (n: Note[]): void => safeSet(STORAGE_KEYS.NOTES, n),

  exportAllData: (): string => {
    const fullBackup = {
      profile: storage.getProfile(),
      notifications: storage.getNotifications(),
      routine: storage.getRoutine(),
      tasks: storage.getTasks(),
      meals: storage.getMeals(),
      water: storage.getWater(),
      habits: storage.getHabits(),
      notes: storage.getNotes(),
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };
    return JSON.stringify(fullBackup, null, 2);
  },

  importAllData: (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.profile) storage.setProfile(data.profile);
      if (data.notifications) storage.setNotifications(data.notifications);
      if (data.routine) storage.setRoutine(data.routine);
      if (data.tasks) storage.setTasks(data.tasks);
      if (data.meals) storage.setMeals(data.meals);
      if (data.water) storage.setWater(data.water);
      if (data.habits) storage.setHabits(data.habits);
      if (data.notes) storage.setNotes(data.notes);
      return true;
    } catch (err) {
      console.error('Failed to import backup data:', err);
      return false;
    }
  },

  resetToDefaults: (): void => {
    localStorage.clear();
    storage.setProfile(INITIAL_USER_PROFILE);
    storage.setNotifications(INITIAL_NOTIFICATION_SETTINGS);
    storage.setRoutine(INITIAL_ROUTINE_ITEMS);
    storage.setTasks(INITIAL_TASKS);
    storage.setMeals(INITIAL_MEALS);
    storage.setWater({
      dailyGoalGlasses: 8,
      glassesDrunk: 5,
      glassSizeMl: 250,
      history: [
        { time: '07:30 AM', amount: 1 },
        { time: '09:15 AM', amount: 1 },
        { time: '11:00 AM', amount: 1 },
        { time: '01:30 PM', amount: 1 },
        { time: '03:45 PM', amount: 1 },
      ],
    });
    storage.setHabits(INITIAL_HABITS);
    storage.setNotes(INITIAL_NOTES);
  },
};
