import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  X,
} from 'lucide-react';
import type { Design, EventCategory } from '../../types/database.js';
import { api } from '../../lib/api.js';
import { formatPKR } from '../../lib/constants.js';
import { ImageWithFallback } from '../../components/ImageWithFallback.js';

interface AdminDesignsProps {
  onNavigate: (path: string) => void;
}

export const AdminDesigns: React.FC<AdminDesignsProps> = ({ onNavigate }) => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [events, setEvents] = useState<EventCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDesign, setEditingDesign] = useState<Partial<Design> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [designsRes, eventsRes] = await Promise.all([
        api.getDesigns({}),
        api.getEvents(true),
      ]);
      setDesigns(designsRes.designs);
      setEvents(eventsRes.events);
    } catch (err) {
      console.error('Failed to load designs in admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenEdit = (design: Design) => {
    setEditingDesign({ ...design });
    setIsNew(false);
  };

  const handleOpenCreate = () => {
    setEditingDesign({
      event_id: events[0]?.id || 'evt-birthday',
      name: '',
      slug: '',
      tier: 'Classic',
      description: '',
      full_description: '',
      price_pkr: 30000,
      image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
      included_services: ['Fairy Light Backdrop', 'Stage Uplighting', 'Concealed Safety Cabling'],
      lighting_equipment: ['Warm White LED Nets', 'Surge Protected Extension Boards'],
      setup_time: '3 - 4 Hours',
      venue_type: 'Banquet Hall, Marquee',
      is_available: true,
    });
    setIsNew(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDesign) return;
    setSaving(true);
    setMessage(null);

    try {
      if (isNew) {
        const slug = editingDesign.slug || editingDesign.name?.toLowerCase().replace(/\s+/g, '-') || 'design-slug';
        await api.createDesign({
          ...editingDesign,
          slug,
        });
        setMessage('New decoration design created successfully.');
      } else {
        await api.updateDesign(editingDesign.id!, editingDesign);
        setMessage(`Design "${editingDesign.name}" updated successfully.`);
      }
      setEditingDesign(null);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save design');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you wish to delete design "${name}"?`)) return;
    try {
      await api.deleteDesign(id);
      setMessage(`Design "${name}" deleted.`);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete design');
    }
  };

  const handleToggleAvailability = async (design: Design) => {
    try {
      await api.updateDesign(design.id, { is_available: !design.is_available });
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to toggle availability');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#8F0000] via-[#C00000] to-[#8F0000] rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-white/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white">
            Design & Pricing Management
          </h1>
          <p className="text-xs sm:text-sm text-white/85 mt-1">
            Manage packages, adjust authoritative database prices in PKR, and configure equipment items.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('/admin')}
            className="px-4 py-2 rounded-xl bg-white/10 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/20 border border-white/20 transition-colors"
          >
            Overview
          </button>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F7B32D] text-[#8F0000] text-xs font-bold uppercase tracking-wider hover:bg-white transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Design</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Designs Grid Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <Sparkles className="w-8 h-8 text-[#C00000] animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-[#59616D]">Loading catalogue...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9FC] border-b border-slate-200 text-[#1A1D20] uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-4 px-5">Design Name & Image</th>
                  <th className="py-4 px-4">Event Category</th>
                  <th className="py-4 px-4">Package Tier</th>
                  <th className="py-4 px-4">Price (PKR)</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {designs.map((d) => (
                  <tr key={d.id} className="hover:bg-[#F8F9FC] transition-colors">
                    <td className="py-4 px-5 flex items-center gap-3">
                      <div className="w-14 h-11 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                        <ImageWithFallback
                          src={d.image_url}
                          alt={d.name}
                          aspectRatio="4/3"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-[#1A1D20] text-sm">{d.name}</p>
                        <p className="text-[11px] text-[#C00000] font-mono">{d.slug}</p>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-[#59616D] font-medium">
                      {d.event?.name || 'Category'}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          d.tier === 'Luxury'
                            ? 'bg-[#C00000] text-[#F7B32D]'
                            : d.tier === 'Premium'
                            ? 'bg-[#DE3C3C] text-white'
                            : 'bg-white text-[#C00000] border border-slate-200'
                        }`}
                      >
                        {d.tier}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-sm text-[#1A1D20]">
                      {formatPKR(d.price_pkr)}
                    </td>

                    <td className="py-4 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleAvailability(d)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                          d.is_available
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {d.is_available ? 'Available' : 'Unavailable'}
                      </button>
                    </td>

                    <td className="py-4 px-5 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(d)}
                        className="p-1.5 rounded-lg bg-[#F8F9FC] text-[#C00000] hover:bg-[#C00000] hover:text-white transition-colors border border-slate-200"
                        title="Edit Design & Price"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(d.id, d.name)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white transition-colors"
                        title="Delete Design"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {editingDesign && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 border border-slate-200 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xl font-serif font-bold text-[#1A1D20]">
                {isNew ? 'Create New Decoration Design' : `Edit ${editingDesign.name}`}
              </h3>
              <button
                type="button"
                onClick={() => setEditingDesign(null)}
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#1A1D20] mb-1">Design Name *</label>
                <input
                  type="text"
                  required
                  value={editingDesign.name || ''}
                  onChange={(e) => setEditingDesign({ ...editingDesign, name: e.target.value })}
                  placeholder="e.g. Royal Barat Lights"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-[#1A1D20] focus:outline-none focus:border-[#C00000]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1A1D20] mb-1">Event Category *</label>
                <select
                  value={editingDesign.event_id || ''}
                  onChange={(e) => setEditingDesign({ ...editingDesign, event_id: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-[#1A1D20] bg-white focus:outline-none focus:border-[#C00000]"
                >
                  {events.map((evt) => (
                    <option key={evt.id} value={evt.id}>{evt.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#1A1D20] mb-1">Package Tier *</label>
                <select
                  value={editingDesign.tier || 'Classic'}
                  onChange={(e) => setEditingDesign({ ...editingDesign, tier: e.target.value as any })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-[#1A1D20] bg-white focus:outline-none focus:border-[#C00000]"
                >
                  <option value="Classic">Classic</option>
                  <option value="Premium">Premium</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#1A1D20] mb-1">Price (PKR) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  step={500}
                  value={editingDesign.price_pkr || 0}
                  onChange={(e) => setEditingDesign({ ...editingDesign, price_pkr: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-mono text-[#1A1D20] focus:outline-none focus:border-[#C00000]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1D20] mb-1">Photograph Image URL *</label>
              <input
                type="url"
                required
                value={editingDesign.image_url || ''}
                onChange={(e) => setEditingDesign({ ...editingDesign, image_url: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-[#1A1D20] focus:outline-none focus:border-[#C00000]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1D20] mb-1">Short Description *</label>
              <textarea
                required
                rows={2}
                value={editingDesign.description || ''}
                onChange={(e) => setEditingDesign({ ...editingDesign, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-[#1A1D20] focus:outline-none focus:border-[#C00000]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1D20] mb-1">Full Detailed Concept Description</label>
              <textarea
                rows={3}
                value={editingDesign.full_description || ''}
                onChange={(e) => setEditingDesign({ ...editingDesign, full_description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-[#1A1D20] focus:outline-none focus:border-[#C00000]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#1A1D20] mb-1">Estimated Setup Time</label>
                <input
                  type="text"
                  value={editingDesign.setup_time || '3 - 4 Hours'}
                  onChange={(e) => setEditingDesign({ ...editingDesign, setup_time: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-[#1A1D20]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1A1D20] mb-1">Recommended Venue Type</label>
                <input
                  type="text"
                  value={editingDesign.venue_type || 'Banquet Hall, Marquee'}
                  onChange={(e) => setEditingDesign({ ...editingDesign, venue_type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-[#1A1D20]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isAvailableCheckbox"
                checked={editingDesign.is_available ?? true}
                onChange={(e) => setEditingDesign({ ...editingDesign, is_available: e.target.checked })}
                className="w-4 h-4 rounded text-[#C00000]"
              />
              <label htmlFor="isAvailableCheckbox" className="text-xs font-bold text-[#1A1D20]">
                Make design available for customer booking
              </label>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingDesign(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold uppercase tracking-wider text-[#59616D]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-[#C00000] text-[#F7B32D] hover:bg-[#DE3C3C] hover:text-white text-xs font-bold uppercase tracking-wider shadow-md disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Design'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
