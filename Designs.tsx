import React, { useState, useEffect } from 'react';
import { Sparkles, Search } from 'lucide-react';
import type { Design, EventCategory } from '../types/database.js';
import { api } from '../lib/api.js';
import { DesignCard } from '../components/DesignCard.js';
import { GridSkeleton } from '../components/LoadingSkeleton.js';

interface DesignsProps {
  onNavigate: (path: string) => void;
}

export const Designs: React.FC<DesignsProps> = ({ onNavigate }) => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [events, setEvents] = useState<EventCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedEvent, setSelectedEvent] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        const [designsRes, eventsRes] = await Promise.all([
          api.getDesigns(),
          api.getEvents(),
        ]);
        if (isMounted) {
          setDesigns(designsRes.designs);
          setEvents(eventsRes.events);
        }
      } catch (err) {
        console.error('Failed to load designs:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = designs.filter((d) => {
    const matchesEvent = selectedEvent === 'all' || d.event_id === selectedEvent;
    const matchesTier = selectedTier === 'all' || d.tier.toLowerCase() === selectedTier.toLowerCase();
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase()) ||
      (d.event?.name || '').toLowerCase().includes(search.toLowerCase());
    return matchesEvent && matchesTier && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#8F0000] via-[#C00000] to-[#8F0000] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl border border-white/20">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#F7B32D] text-xs font-bold uppercase tracking-wider border border-[#F7B32D]/40">
            <Sparkles className="w-4 h-4" />
            <span>Complete Catalogue</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            18 Verified Event Lighting Designs
          </h1>
          <p className="text-sm sm:text-base text-white/85 leading-relaxed">
            Filter through all 18 signature setups across Pakistan. Each design offers transparent PKR pricing, verified equipment items, and safety-certified technician standby.
          </p>
        </div>
      </div>

      {/* Filter / Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search design by name or feature..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#F8F9FC] rounded-xl border border-slate-200 focus:outline-none focus:border-[#C00000] text-[#1A1D20]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <span className="text-xs font-bold uppercase tracking-wider text-[#59616D] shrink-0">Tier:</span>
            {['all', 'Classic', 'Premium', 'Luxury'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedTier(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  selectedTier === t
                    ? 'bg-[#C00000] text-[#F7B32D]'
                    : 'bg-[#F8F9FC] text-[#59616D] hover:bg-slate-200'
                }`}
              >
                {t === 'all' ? 'All Tiers' : t}
              </button>
            ))}
          </div>
        </div>

        {/* Event Category Tabs */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSelectedEvent('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedEvent === 'all'
                ? 'bg-[#C00000] text-white'
                : 'text-[#59616D] hover:bg-[#F8F9FC]'
            }`}
          >
            All Events ({designs.length})
          </button>
          {events.map((evt) => (
            <button
              key={evt.id}
              type="button"
              onClick={() => setSelectedEvent(evt.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedEvent === evt.id
                  ? 'bg-[#C00000] text-white'
                  : 'text-[#59616D] hover:bg-[#F8F9FC]'
              }`}
            >
              {evt.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-[#59616D] font-semibold">
        <span>Showing {filtered.length} of {designs.length} designs</span>
        {search && (
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSelectedEvent('all');
              setSelectedTier('all');
            }}
            className="text-xs text-[#C00000] underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <GridSkeleton count={6} />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <p className="text-lg font-serif font-bold text-[#1A1D20]">No decoration designs match your criteria.</p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSelectedEvent('all');
              setSelectedTier('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-[#C00000] text-white text-xs font-bold uppercase tracking-wider"
          >
            Show All Designs
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filtered.map((design) => (
            <DesignCard
              key={design.id}
              design={design}
              onBook={(d) => onNavigate(`/booking/${d.id}`)}
              onViewDetails={(d) => onNavigate(`/designs/${d.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
