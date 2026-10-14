import React, { useState, useEffect } from 'react';
import { Sparkles, Edit, CheckCircle2, X } from 'lucide-react';
import type { EventCategory } from '../../types/database.js';
import { api } from '../../lib/api.js';
import { ImageWithFallback } from '../../components/ImageWithFallback.js';

interface AdminEventsProps {
  onNavigate: (path: string) => void;
}

export const AdminEvents: React.FC<AdminEventsProps> = ({ onNavigate }) => {
  const [events, setEvents] = useState<EventCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<EventCategory | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.getEvents(true);
      setEvents(res.events);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    try {
      await api.updateEvent(editingEvent.id, {
        description: editingEvent.description,
        image_url: editingEvent.image_url,
        is_active: editingEvent.is_active,
      });
      setMessage(`Category "${editingEvent.name}" updated successfully.`);
      setEditingEvent(null);
      await fetchEvents();
    } catch (err: any) {
      alert(err.message || 'Failed to update event');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="bg-gradient-to-r from-[#8F0000] via-[#C00000] to-[#8F0000] rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-white/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white">
            Event Categories Management
          </h1>
          <p className="text-xs sm:text-sm text-white/85 mt-1">
            Manage the six core celebration categories (Birthday, Mehndi, Engagement, Parties, Barat, Waleema).
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('/admin')}
          className="px-4 py-2 rounded-xl bg-white/10 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/20 border border-white/20 transition-colors"
        >
          Overview
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="aspect-[4/3] relative">
                <ImageWithFallback
                  src={evt.image_url}
                  alt={evt.name}
                  aspectRatio="4/3"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      evt.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {evt.is_active ? 'Active' : 'Hidden'}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="text-xl font-serif font-bold text-[#1A1D20]">{evt.name}</h3>
                <p className="text-xs text-[#59616D] leading-relaxed line-clamp-3">{evt.description}</p>
                <p className="text-[11px] font-mono text-[#C00000]">Slug: /{evt.slug}</p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                type="button"
                onClick={() => setEditingEvent(evt)}
                className="w-full py-2.5 rounded-xl bg-[#F8F9FC] text-[#C00000] hover:bg-[#C00000] hover:text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 border border-slate-200"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Category Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 border border-slate-200 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-serif font-bold text-[#1A1D20]">
                Edit {editingEvent.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1D20] mb-1">Description</label>
              <textarea
                required
                rows={3}
                value={editingEvent.description}
                onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs text-[#1A1D20] focus:outline-none focus:border-[#C00000]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1D20] mb-1">Banner Image URL</label>
              <input
                type="url"
                required
                value={editingEvent.image_url}
                onChange={(e) => setEditingEvent({ ...editingEvent, image_url: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#1A1D20] focus:outline-none focus:border-[#C00000]"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="activeEvtCheckbox"
                checked={editingEvent.is_active}
                onChange={(e) => setEditingEvent({ ...editingEvent, is_active: e.target.checked })}
                className="w-4 h-4 text-[#C00000]"
              />
              <label htmlFor="activeEvtCheckbox" className="text-xs font-bold text-[#1A1D20]">
                Category visible to clients
              </label>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold uppercase tracking-wider text-[#59616D]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#C00000] text-white hover:bg-[#DE3C3C] text-xs font-bold uppercase tracking-wider"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
