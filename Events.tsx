import React, { useState, useEffect } from 'react';
import { Sparkles, Search } from 'lucide-react';
import type { EventCategory } from '../types/database.js';
import { api } from '../lib/api.js';
import { EventCard } from '../components/EventCard.js';
import { GridSkeleton } from '../components/LoadingSkeleton.js';

interface EventsProps {
  onNavigate: (path: string) => void;
}

export const Events: React.FC<EventsProps> = ({ onNavigate }) => {
  const [events, setEvents] = useState<EventCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    async function fetchEvents() {
      try {
        const res = await api.getEvents();
        if (isMounted) setEvents(res.events);
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchEvents();
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = events.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#8F0000] via-[#C00000] to-[#8F0000] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl border border-white/20">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#F7B32D] text-xs font-bold uppercase tracking-wider border border-[#F7B32D]/40">
            <Sparkles className="w-4 h-4" />
            <span>Event Categories</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
            Curated Lighting For Every Occasion
          </h1>
          <p className="text-sm sm:text-base text-white/85 leading-relaxed">
            Explore our six signature celebration categories in Pakistan. Each category features three tailored tiers designed specifically for authentic Pakistani wedding halls, farmhouses, and intimate residences.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories (e.g. Barat, Mehndi)..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#F8F9FC] rounded-xl border border-slate-200 focus:outline-none focus:border-[#C00000] text-[#1A1D20]"
          />
        </div>

        <div className="text-xs text-[#59616D] font-semibold">
          Showing {filtered.length} of {events.length} Categories
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <GridSkeleton count={6} />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <p className="text-lg font-serif font-bold text-[#1A1D20]">No categories matched your search.</p>
          <button
            type="button"
            onClick={() => setSearch('')}
            className="mt-4 px-4 py-2 rounded-xl bg-[#C00000] text-white text-xs font-bold uppercase tracking-wider"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filtered.map((evt) => (
            <EventCard
              key={evt.id}
              event={evt}
              onSelect={() => onNavigate(`/events/${evt.slug}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
