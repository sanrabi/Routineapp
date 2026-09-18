import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavTab } from '../../types';
import { Home, Calendar, UtensilsCrossed, CheckSquare, StickyNote } from 'lucide-react';

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeCount?: number;
}

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, tasks, meals, habits, notes } = useApp();

  const pendingTasksCount = tasks.filter(t => !t.isCompleted).length;
  const pendingHabitsCount = habits.filter(
    h => !h.completedDates.includes(new Date().toISOString().split('T')[0])
  ).length;

  const navItems: NavItem[] = [
    { id: 'today', label: 'Today', icon: Home },
    { id: 'schedule', label: 'Schedule', icon: Calendar, badgeCount: pendingTasksCount > 0 ? pendingTasksCount : undefined },
    { id: 'meals', label: 'Meals', icon: UtensilsCrossed, badgeCount: meals.length > 0 ? meals.length : undefined },
    { id: 'habits', label: 'Habits', icon: CheckSquare, badgeCount: pendingHabitsCount > 0 ? pendingHabitsCount : undefined },
    { id: 'notes', label: 'Notes', icon: StickyNote, badgeCount: notes.length > 0 ? notes.length : undefined },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-stone-50/95 dark:bg-stone-950/95 backdrop-blur-lg border-t border-stone-200/80 dark:border-stone-800/80 pb-safe px-3 py-1.5 transition-colors max-w-md mx-auto sm:max-w-xl md:max-w-2xl">
      <div className="flex items-center justify-around">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}-btn`}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-emerald-700 dark:text-emerald-300 font-semibold scale-105'
                  : 'text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 font-normal'
              }`}
            >
              <div className="relative">
                <div
                  className={`p-1 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-emerald-100/80 dark:bg-emerald-950/80 shadow-xs'
                      : 'bg-transparent'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.3]' : 'stroke-[1.8]'}`} />
                </div>
                {item.badgeCount !== undefined && (
                  <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {item.badgeCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight font-medium">
                {item.label}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
