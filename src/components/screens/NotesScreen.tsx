import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Note, NoteCategory } from '../../types';
import {
  StickyNote,
  Plus,
  Search,
  Pin,
  Edit2,
  Trash2,
  X,
  Check,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const NotesScreen: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote, togglePinNote } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NoteCategory | 'All'>('All');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState<NoteCategory>('Personal');
  const [formIsPinned, setFormIsPinned] = useState(false);

  const categories: (NoteCategory | 'All')[] = [
    'All',
    'Personal',
    'Work',
    'Fitness',
    'Food',
    'Ideas',
    'Important',
  ];

  // Open modal for new note
  const handleOpenAdd = () => {
    setEditingNote(null);
    setFormTitle('');
    setFormContent('');
    setFormCategory('Personal');
    setFormIsPinned(false);
    setIsNoteModalOpen(true);
  };

  // Open modal for editing note
  const handleOpenEdit = (note: Note) => {
    setEditingNote(note);
    setFormTitle(note.title);
    setFormContent(note.content);
    setFormCategory(note.category);
    setFormIsPinned(note.isPinned);
    setIsNoteModalOpen(true);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingNote) {
      updateNote(editingNote.id, {
        title: formTitle.trim(),
        content: formContent.trim(),
        category: formCategory,
        isPinned: formIsPinned,
      });
    } else {
      addNote({
        title: formTitle.trim(),
        content: formContent.trim(),
        category: formCategory,
        isPinned: formIsPinned,
      });
    }
    setIsNoteModalOpen(false);
  };

  // Filter notes
  const filteredNotes = notes.filter(n => {
    if (selectedCategory !== 'All' && n.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
    }
    return true;
  });

  const pinnedNotes = filteredNotes.filter(n => n.isPinned);
  const otherNotes = filteredNotes.filter(n => !n.isPinned);

  const formatTimestamp = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryColor = (cat: NoteCategory) => {
    switch (cat) {
      case 'Personal':
        return 'bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300';
      case 'Work':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300';
      case 'Fitness':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300';
      case 'Food':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300';
      case 'Ideas':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300';
      case 'Important':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300';
      default:
        return 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300';
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-50 font-['Outfit']">
            Personal Notes
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {notes.length} thoughts, recipes & ideas saved
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/25 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search notes or keywords..."
          className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        />
      </div>

      {/* Category Pills (Personal, Work, Fitness, Food, Ideas, Important) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-purple-600 text-white font-semibold shadow-xs'
                : 'bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* PINNED SECTION */}
      {pinnedNotes.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 px-1">
            <Pin className="w-3.5 h-3.5" />
            <span>Pinned Notes</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {pinnedNotes.map(note => (
              <div
                key={note.id}
                className="p-4 rounded-3xl bg-white dark:bg-stone-900 border-2 border-purple-200/80 dark:border-purple-800/50 shadow-xs space-y-2 relative"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getCategoryColor(note.category)}`}>
                    {note.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => togglePinNote(note.id)}
                      className="p-1 text-purple-600 hover:text-purple-700"
                      title="Unpin note"
                    >
                      <Pin className="w-3.5 h-3.5 fill-current" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(note)}
                      className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Delete note?')) deleteNote(note.id);
                      }}
                      className="p-1 text-stone-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                  {note.title}
                </h3>

                <p className="text-xs text-stone-600 dark:text-stone-300 whitespace-pre-line leading-relaxed">
                  {note.content}
                </p>

                <div className="pt-2 flex items-center justify-between text-[10px] text-stone-400 border-t border-stone-100 dark:border-stone-800">
                  <span>{formatTimestamp(note.updatedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ALL / OTHER NOTES */}
      <div className="space-y-2.5">
        {pinnedNotes.length > 0 && otherNotes.length > 0 && (
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 px-1 pt-2">
            Other Notes
          </h4>
        )}

        {filteredNotes.length === 0 ? (
          <div className="py-12 px-4 text-center rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-400 flex items-center justify-center mx-auto mb-2">
              <StickyNote className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200">
              No notes found
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mx-auto mt-1 mb-3">
              Capture your meal prep reminders, fitness goals, or personal reflections.
            </p>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-purple-600 text-white font-semibold text-xs shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Note</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {otherNotes.map(note => (
              <div
                key={note.id}
                className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getCategoryColor(note.category)}`}>
                    {note.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => togglePinNote(note.id)}
                      className="p-1 text-stone-400 hover:text-purple-600"
                      title="Pin note"
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(note)}
                      className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Delete note?')) deleteNote(note.id);
                      }}
                      className="p-1 text-stone-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                  {note.title}
                </h3>

                <p className="text-xs text-stone-600 dark:text-stone-300 whitespace-pre-line leading-relaxed">
                  {note.content}
                </p>

                <div className="pt-2 flex items-center justify-between text-[10px] text-stone-400 border-t border-stone-100 dark:border-stone-800">
                  <span>{formatTimestamp(note.updatedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Note Creator / Editor Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-stone-50 dark:bg-stone-900 rounded-[36px] p-6 shadow-2xl border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base font-['Outfit']">
                {editingNote ? 'Edit Note' : 'Create Note'}
              </h3>
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-3.5">
              {/* Category Picker */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1.5">
                  Category
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  {(['Personal', 'Work', 'Fitness', 'Food', 'Ideas', 'Important'] as NoteCategory[]).map(
                    cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFormCategory(cat)}
                        className={`py-1.5 px-2 rounded-xl text-center font-medium transition-colors ${
                          formCategory === cat
                            ? 'bg-purple-600 text-white font-semibold shadow-xs'
                            : 'bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="Note title..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">
                  Content / Details
                </label>
                <textarea
                  rows={4}
                  value={formContent}
                  onChange={e => setFormContent(e.target.value)}
                  placeholder="Write your note, recipes, checklist..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Pin Toggle */}
              <label className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/60 text-xs cursor-pointer">
                <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                  <Pin className="w-4 h-4 text-purple-500" />
                  <span>Pin this note to top</span>
                </div>
                <input
                  type="checkbox"
                  checked={formIsPinned}
                  onChange={e => setFormIsPinned(e.target.checked)}
                  className="w-4 h-4 accent-purple-600 rounded"
                />
              </label>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingNote ? 'Save Changes' : 'Save Note'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
