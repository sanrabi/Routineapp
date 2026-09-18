import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';
import { X, Calendar, Clock, Bell, Repeat, Check, Trash2 } from 'lucide-react';

interface TaskModalProps {
  task?: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ task, isOpen, onClose }) => {
  const { addTask, updateTask, deleteTask } = useApp();

  const [title, setTitle] = useState(task?.title || '');
  const [startTime, setStartTime] = useState(task?.startTime || '09:00');
  const [endTime, setEndTime] = useState(task?.endTime || '10:00');
  const [category, setCategory] = useState<Task['category']>(task?.category || 'work');
  const [priority, setPriority] = useState<Task['priority']>(task?.priority || 'medium');
  const [reminder, setReminder] = useState(task?.reminder ?? true);
  const [isRecurring, setIsRecurring] = useState(task?.isRecurring ?? false);
  const [notes, setNotes] = useState(task?.notes || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (task) {
      updateTask(task.id, {
        title: title.trim(),
        startTime,
        endTime,
        category,
        priority,
        reminder,
        isRecurring,
        notes: notes.trim(),
      });
    } else {
      addTask({
        title: title.trim(),
        startTime,
        endTime,
        category,
        priority,
        reminder,
        isRecurring,
        date: new Date().toISOString().split('T')[0],
        isCompleted: false,
        notes: notes.trim(),
      });
    }
    onClose();
  };

  const handleDelete = () => {
    if (task && window.confirm('Delete this task?')) {
      deleteTask(task.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-stone-50 dark:bg-stone-900 rounded-[36px] p-6 shadow-2xl border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base font-['Outfit']">
              {task ? 'Edit Task' : 'Add New Task'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">
              Task Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Focus work block, walk in park..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Time Start & End */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['routine', 'work', 'health', 'meal', 'personal', 'exercise'] as const).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-medium capitalize transition-colors ${
                    category === cat
                      ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                      : 'bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1.5">
              Priority
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['low', 'medium', 'high'] as const).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`py-1.5 px-2 rounded-xl text-xs capitalize transition-colors ${
                    priority === p
                      ? p === 'high'
                        ? 'bg-rose-600 text-white font-semibold'
                        : p === 'medium'
                        ? 'bg-amber-600 text-white font-semibold'
                        : 'bg-emerald-600 text-white font-semibold'
                      : 'bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles: Reminder & Recurring */}
          <div className="bg-white dark:bg-stone-800/80 p-3 rounded-2xl border border-stone-200/80 dark:border-stone-700/60 space-y-2">
            <label className="flex items-center justify-between text-xs cursor-pointer">
              <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                <Bell className="w-3.5 h-3.5 text-amber-500" />
                <span>Enable Notification Reminder</span>
              </div>
              <input
                type="checkbox"
                checked={reminder}
                onChange={e => setReminder(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between text-xs cursor-pointer pt-1 border-t border-stone-100 dark:border-stone-700/50">
              <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                <Repeat className="w-3.5 h-3.5 text-sky-500" />
                <span>Recurring Daily Task</span>
              </div>
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={e => setIsRecurring(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
            </label>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">
              Optional Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any details or checklist..."
              className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Submit / Actions */}
          <div className="pt-2 flex gap-2">
            {task && (
              <button
                type="button"
                onClick={handleDelete}
                className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{task ? 'Update Task' : 'Save Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
