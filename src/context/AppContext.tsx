import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  NavTab,
  UserProfile,
  NotificationSettings,
  DailyRoutineItem,
  Task,
  MealLogItem,
  WaterState,
  Habit,
  Note,
  FoodItem,
} from '../types';
import { storage } from '../services/storage';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'reminder';
  timestamp: number;
}

interface AppContextType {
  // Navigation & Modals
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isDailySummaryOpen: boolean;
  setIsDailySummaryOpen: (open: boolean) => void;
  isWaterModalOpen: boolean;
  setIsWaterModalOpen: (open: boolean) => void;
  isFoodLibraryOpen: boolean;
  setIsFoodLibraryOpen: (open: boolean) => void;
  selectedFoodDetail: FoodItem | null;
  setSelectedFoodDetail: (food: FoodItem | null) => void;

  // Profile & Theme
  userProfile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  completeOnboarding: (details: Partial<UserProfile>) => void;

  // Notifications
  notifications: NotificationSettings;
  updateNotifications: (updates: Partial<NotificationSettings>) => void;
  requestNotificationPermission: () => Promise<boolean>;

  // Routine
  routineItems: DailyRoutineItem[];
  toggleRoutineItem: (id: string) => void;

  // Tasks / Schedule
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;

  // Meals
  meals: MealLogItem[];
  addMeal: (meal: Omit<MealLogItem, 'id' | 'loggedAt' | 'date' | 'isCompleted'>) => void;
  deleteMeal: (id: string) => void;
  toggleMealCompleted: (id: string) => void;

  // Water
  water: WaterState;
  addWater: (glasses?: number) => void;
  removeWater: (glasses?: number) => void;
  setWaterGoal: (goal: number) => void;

  // Habits
  habits: Habit[];
  toggleHabitToday: (id: string) => void;
  addHabit: (name: string, icon: string, targetDays: number, category: string) => void;
  deleteHabit: (id: string) => void;

  // Notes
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'reminder') => void;
  removeToast: (id: string) => void;

  // System
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State initialization from storage
  const [userProfile, setUserProfileState] = useState<UserProfile>(() => storage.getProfile());
  const [notifications, setNotificationsState] = useState<NotificationSettings>(() => storage.getNotifications());
  const [routineItems, setRoutineItemsState] = useState<DailyRoutineItem[]>(() => storage.getRoutine());
  const [tasks, setTasksState] = useState<Task[]>(() => storage.getTasks());
  const [meals, setMealsState] = useState<MealLogItem[]>(() => storage.getMeals());
  const [water, setWaterState] = useState<WaterState>(() => storage.getWater());
  const [habits, setHabitsState] = useState<Habit[]>(() => storage.getHabits());
  const [notes, setNotesState] = useState<Note[]>(() => storage.getNotes());

  // UI state
  const [activeTab, setActiveTab] = useState<NavTab>('today');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDailySummaryOpen, setIsDailySummaryOpen] = useState(false);
  const [isWaterModalOpen, setIsWaterModalOpen] = useState(false);
  const [isFoodLibraryOpen, setIsFoodLibraryOpen] = useState(false);
  const [selectedFoodDetail, setSelectedFoodDetail] = useState<FoodItem | null>(null);

  // Theme calculation
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = storage.getProfile().theme;
    if (saved === 'dark') return 'dark';
    if (saved === 'light') return 'light';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Apply dark mode class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'reminder' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 5);
    const newToast: ToastMessage = { id, message, type, timestamp: Date.now() };
    setToasts(prev => [...prev.slice(-3), newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  // Request browser notifications
  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      showToast('Notifications not supported in this browser', 'info');
      return false;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        showToast('Notifications enabled successfully!', 'success');
        return true;
      } else {
        showToast('Notification permission was declined', 'info');
        return false;
      }
    } catch {
      return false;
    }
  };

  // Profile operations
  const updateProfile = (updates: Partial<UserProfile>) => {
    setUserProfileState(prev => {
      const updated = { ...prev, ...updates };
      storage.setProfile(updated);
      return updated;
    });
    showToast('Profile updated', 'success');
  };

  const completeOnboarding = (details: Partial<UserProfile>) => {
    setUserProfileState(prev => {
      const updated = { ...prev, ...details, hasCompletedOnboarding: true };
      storage.setProfile(updated);
      return updated;
    });
    showToast('Welcome to DayFlow! Your personalized day is ready.', 'success');
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    updateProfile({ theme: next });
  };

  // Notification settings
  const updateNotifications = (updates: Partial<NotificationSettings>) => {
    setNotificationsState(prev => {
      const updated = { ...prev, ...updates };
      storage.setNotifications(updated);
      return updated;
    });
    showToast('Reminder preferences updated', 'success');
  };

  // Routine operations
  const toggleRoutineItem = (id: string) => {
    setRoutineItemsState(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          const nextState = !item.isCompleted;
          if (nextState) {
            showToast(`Completed: ${item.title}`, 'success');
          }
          return { ...item, isCompleted: nextState };
        }
        return item;
      });
      storage.setRoutine(updated);
      return updated;
    });
  };

  // Task operations
  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: 'task_' + Date.now(),
    };
    setTasksState(prev => {
      const updated = [newTask, ...prev];
      storage.setTasks(updated);
      return updated;
    });
    showToast(`Task added: "${newTask.title}"`, 'success');
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasksState(prev => {
      const updated = prev.map(t => (t.id === id ? { ...t, ...updates } : t));
      storage.setTasks(updated);
      return updated;
    });
    showToast('Task updated', 'success');
  };

  const deleteTask = (id: string) => {
    setTasksState(prev => {
      const updated = prev.filter(t => t.id !== id);
      storage.setTasks(updated);
      return updated;
    });
    showToast('Task deleted', 'info');
  };

  const toggleTask = (id: string) => {
    setTasksState(prev => {
      const updated = prev.map(t => {
        if (t.id === id) {
          const next = !t.isCompleted;
          if (next) showToast(`Task completed! 🎉`, 'success');
          return { ...t, isCompleted: next };
        }
        return t;
      });
      storage.setTasks(updated);
      return updated;
    });
  };

  // Meal operations
  const addMeal = (mealData: Omit<MealLogItem, 'id' | 'loggedAt' | 'date' | 'isCompleted'>) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const todayStr = now.toISOString().split('T')[0];

    const newMeal: MealLogItem = {
      ...mealData,
      id: 'meal_' + Date.now(),
      loggedAt: timeStr,
      date: todayStr,
      isCompleted: true,
    };

    setMealsState(prev => {
      const updated = [newMeal, ...prev];
      storage.setMeals(updated);
      return updated;
    });
    showToast(`Logged ${mealData.foodName} to ${mealData.mealType}!`, 'success');
  };

  const deleteMeal = (id: string) => {
    setMealsState(prev => {
      const updated = prev.filter(m => m.id !== id);
      storage.setMeals(updated);
      return updated;
    });
    showToast('Meal entry removed', 'info');
  };

  const toggleMealCompleted = (id: string) => {
    setMealsState(prev => {
      const updated = prev.map(m => (m.id === id ? { ...m, isCompleted: !m.isCompleted } : m));
      storage.setMeals(updated);
      return updated;
    });
  };

  // Water operations
  const addWater = (glasses: number = 1) => {
    setWaterState(prev => {
      const newDrunk = Math.min(prev.dailyGoalGlasses * 2, prev.glassesDrunk + glasses);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const updated: WaterState = {
        ...prev,
        glassesDrunk: newDrunk,
        history: [{ time: timeStr, amount: glasses }, ...prev.history].slice(0, 20),
      };
      storage.setWater(updated);
      return updated;
    });
    showToast(`Hydration logged! +${glasses} glass 💧`, 'success');
  };

  const removeWater = (glasses: number = 1) => {
    setWaterState(prev => {
      const newDrunk = Math.max(0, prev.glassesDrunk - glasses);
      const updated: WaterState = {
        ...prev,
        glassesDrunk: newDrunk,
      };
      storage.setWater(updated);
      return updated;
    });
  };

  const setWaterGoal = (goal: number) => {
    setWaterState(prev => {
      const updated: WaterState = {
        ...prev,
        dailyGoalGlasses: Math.max(1, goal),
      };
      storage.setWater(updated);
      return updated;
    });
    showToast(`Water goal updated to ${goal} glasses`, 'success');
  };

  // Habit operations
  const toggleHabitToday = (id: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setHabitsState(prev => {
      const updated = prev.map(habit => {
        if (habit.id === id) {
          const isDoneToday = habit.completedDates.includes(todayStr);
          let newDates: string[];
          let newStreak = habit.streak;

          if (isDoneToday) {
            newDates = habit.completedDates.filter(d => d !== todayStr);
            newStreak = Math.max(0, newStreak - 1);
          } else {
            newDates = [...habit.completedDates, todayStr];
            newStreak = newStreak + 1;
            showToast(`Habit marked complete: ${habit.name}! 🔥 ${newStreak} day streak`, 'success');
          }
          return {
            ...habit,
            completedDates: newDates,
            streak: newStreak,
          };
        }
        return habit;
      });
      storage.setHabits(updated);
      return updated;
    });
  };

  const addHabit = (name: string, icon: string, targetDays: number, category: string) => {
    const newHabit: Habit = {
      id: 'habit_' + Date.now(),
      name,
      icon: icon || '✨',
      completedDates: [],
      streak: 0,
      targetDaysPerWeek: targetDays,
      category: category || 'Daily',
    };
    setHabitsState(prev => {
      const updated = [...prev, newHabit];
      storage.setHabits(updated);
      return updated;
    });
    showToast(`Habit "${name}" created`, 'success');
  };

  const deleteHabit = (id: string) => {
    setHabitsState(prev => {
      const updated = prev.filter(h => h.id !== id);
      storage.setHabits(updated);
      return updated;
    });
    showToast('Habit deleted', 'info');
  };

  // Note operations
  const addNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newNote: Note = {
      ...noteData,
      id: 'note_' + Date.now(),
      createdAt: now,
      updatedAt: now,
    };
    setNotesState(prev => {
      const updated = [newNote, ...prev];
      storage.setNotes(updated);
      return updated;
    });
    showToast(`Note "${newNote.title}" saved`, 'success');
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotesState(prev => {
      const updated = prev.map(n =>
        n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
      );
      storage.setNotes(updated);
      return updated;
    });
    showToast('Note updated', 'success');
  };

  const deleteNote = (id: string) => {
    setNotesState(prev => {
      const updated = prev.filter(n => n.id !== id);
      storage.setNotes(updated);
      return updated;
    });
    showToast('Note deleted', 'info');
  };

  const togglePinNote = (id: string) => {
    setNotesState(prev => {
      const updated = prev.map(n => (n.id === id ? { ...n, isPinned: !n.isPinned } : n));
      storage.setNotes(updated);
      return updated;
    });
  };

  // Reset all
  const resetAllData = () => {
    storage.resetToDefaults();
    setUserProfileState(storage.getProfile());
    setNotificationsState(storage.getNotifications());
    setRoutineItemsState(storage.getRoutine());
    setTasksState(storage.getTasks());
    setMealsState(storage.getMeals());
    setWaterState(storage.getWater());
    setHabitsState(storage.getHabits());
    setNotesState(storage.getNotes());
    showToast('Reset data to initial sample state', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isSettingsOpen,
        setIsSettingsOpen,
        isDailySummaryOpen,
        setIsDailySummaryOpen,
        isWaterModalOpen,
        setIsWaterModalOpen,
        isFoodLibraryOpen,
        setIsFoodLibraryOpen,
        selectedFoodDetail,
        setSelectedFoodDetail,

        userProfile,
        updateProfile,
        theme,
        toggleTheme,
        completeOnboarding,

        notifications,
        updateNotifications,
        requestNotificationPermission,

        routineItems,
        toggleRoutineItem,

        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,

        meals,
        addMeal,
        deleteMeal,
        toggleMealCompleted,

        water,
        addWater,
        removeWater,
        setWaterGoal,

        habits,
        toggleHabitToday,
        addHabit,
        deleteHabit,

        notes,
        addNote,
        updateNote,
        deleteNote,
        togglePinNote,

        toasts,
        showToast,
        removeToast,

        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
