import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';
import { TaskModal } from '../modals/TaskModal';
import {
  Calendar as CalendarIcon,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Bell,
  Repeat,
  Tag,
  Filter,
  Search,
  Check,
  Edit2,
  Trash2,
} from 'lucide-react';

export const ScheduleScreen: React.FC = () => {
  const { tasks, toggleTask, deleteTask } = useApp();

  const [activeFilter, setActiveFilter] = useState<'today' | 'upcoming' | 'completed'>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    // Search
    if (searchQuery.trim() && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Category
    if (selectedCategory !== 'all' && task.category !== selectedCategory) {
      return false;
    }

    // Tab filter
    if (activeFilter === 'today') {
      return task.date === todayStr || task.isRecurring;
    }
    if (activeFilter === 'completed') {
      return task.isCompleted;
    }
    if (activeFilter === 'upcoming') {
      return task.date >= todayStr && !task.isCompleted;
    }
    return true;
  });

  // Sort by start time
  const sortedTasks = [...filteredTasks].sort((a, b) => a.startTime.localeCompare(b.startTime));

  const completedCount = tasks.filter(t => t.isCompleted).length;
  const totalCount = tasks.length;

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Header & Add Task Action */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-50 font-['Outfit']">
            Schedule & Time
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {completedCount} of {totalCount} daily tasks completed
          </p>
        </div>

        <button
          onClick={() => {
            setEditingTask(null);
            setIsTaskModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter Tabs: Today / Upcoming / Completed */}
      <div className="flex p-1 bg-stone-200/70 dark:bg-stone-850 rounded-2xl">
        {[
          { id: 'today', label: "Today's Schedule" },
          { id: 'upcoming', label: 'Upcoming' },
          { id: 'completed', label: 'Completed' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeFilter === tab.id
                ? 'bg-white dark:bg-stone-750 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Category Pills */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search tasks by title..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {['all', 'work', 'routine', 'health', 'exercise', 'personal', 'meal'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl capitalize font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-stone-200/60 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline List of Tasks */}
      <div className="space-y-2.5">
        {sortedTasks.length === 0 ? (
          <div className="py-12 px-4 text-center rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-400 flex items-center justify-center mx-auto mb-2">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200">
              No tasks found
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mx-auto mt-1 mb-3">
              {searchQuery ? 'Try another search query or category filter.' : 'Organize your day by adding your first task.'}
            </p>
            <button
              onClick={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>
        ) : (
          sortedTasks.map(task => {
            const priorityColor =
              task.priority === 'high'
                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300'
                : task.priority === 'medium'
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300';

            return (
              <div
                key={task.id}
                className={`p-4 rounded-3xl border transition-all ${
                  task.isCompleted
                    ? 'bg-stone-100/50 dark:bg-stone-900/50 border-stone-200/50 dark:border-stone-800/60 opacity-80'
                    : 'bg-white dark:bg-stone-900 border-stone-200/80 dark:border-stone-800 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: Checkbox & Info */}
                  <div className="flex items-start gap-3 flex-1 overflow-hidden">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="mt-0.5 shrink-0 text-stone-400 hover:text-emerald-600 transition-colors"
                    >
                      {task.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-stone-300 dark:text-stone-600" />
                      )}
                    </button>

                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {/* Time marker */}
                        <div className="flex items-center gap-1 text-[11px] font-mono font-semibold text-stone-500 dark:text-stone-400">
                          <Clock className="w-3 h-3 text-emerald-500" />
                          <span>
                            {task.startTime}
                            {task.endTime ? ` - ${task.endTime}` : ''}
                          </span>
                        </div>

                        {/* Priority Badge */}
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${priorityColor}`}>
                          {task.priority}
                        </span>

                        {/* Recurring indicator */}
                        {task.isRecurring && (
                          <span className="flex items-center gap-0.5 text-[10px] font-semibold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50 px-1.5 py-0.5 rounded-md">
                            <Repeat className="w-2.5 h-2.5" />
                            Daily
                          </span>
                        )}

                        {/* Reminder indicator */}
                        {task.reminder && (
                          <span className="flex items-center gap-0.5 text-[10px] text-amber-600 dark:text-amber-400">
                            <Bell className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>

                      <h3
                        className={`text-sm font-bold text-stone-900 dark:text-stone-100 ${
                          task.isCompleted ? 'line-through text-stone-400 dark:text-stone-500' : ''
                        }`}
                      >
                        {task.title}
                      </h3>

                      {task.notes && (
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-1">
                          {task.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        setEditingTask(task);
                        setIsTaskModalOpen(true);
                      }}
                      className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                      title="Edit task"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-stone-400 hover:text-rose-600 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Task Modal for Add / Edit */}
      <TaskModal
        task={editingTask}
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />
    </div>
  );
};
