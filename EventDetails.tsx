import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import type { EventCategory, Design } from '../types/database.js';
import { api } from '../lib/api.js';
import { DesignCard } from '../components/DesignCard.js';
import { GridSkeleton } from '../components/LoadingSkeleton.js';
import { ImageWithFallback } from '../components/ImageWithFallback.js';

interface EventDetailsProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const EventDetails: React.FC<EventDetailsProps> = ({ slug, onNavigate }) => {
  const [event, setEvent] = useState<EventCategory | null>(null);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadEventData() {
      setLoading(true);
      try {
        const res = await api.getEventBySlug(slug);
        if (isMounted) {
          setEvent(res.event);
          setDesigns(res.designs);
        }
      } catch (err) {
        console.error('Failed to load event details:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadEventData();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const filteredDesigns = designs.filter((d) =>
    selectedTier === 'all' ? true : d.tier.toLowerCase() === selectedTier.toLowerCase()
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <GridSkeleton count={3} />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-md mx-auto my-16 text-center bg-white p-8 rounded-3xl border border-slate-200">
        <h2 className="text-2xl font-serif font-bold text-[#1A1D20] mb-2">Category Not Found</h2>
        <p className="text-sm text-[#59616D] mb-6">The requested event category could not be located.</p>
        <button
          type="button"
          onClick={() => onNavigate('/events')}
          className="px-6 py-2.5 rounded-xl bg-[#C00000] text-white text-xs font-bold uppercase tracking-wider"
        >
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => onNavigate('/events')}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C00000] hover:text-[#DE3C3C] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Categories</span>
        </button>
      </div>

      {/* Hero Category Banner */}
      <div className="bg-gradient-to-r from-[#8F0000] via-[#C00000] to-[#8F0000] rounded-3xl overflow-hidden shadow-2xl border border-white/20 grid grid-cols-1 lg:grid-cols-12 items-center">
        <div className="p-8 sm:p-12 lg:col-span-7 space-y-4 text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#F7B32D] text-xs font-bold uppercase tracking-wider border border-[#F7B32D]/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Event Collection</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            {event.name} Decoration Setups
          </h1>

          <p className="text-sm sm:text-base text-white/85 leading-relaxed">
            {event.description}
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-white">
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-[#F7B32D]" />
              <span>3 Distinct Tailored Tiers</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-[#F7B32D]" />
              <span>On-Site Wiring & Safety Crew</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 h-64 lg:h-full relative overflow-hidden">
          <ImageWithFallback
            src={event.image_url}
            alt={event.name}
            aspectRatio="auto"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#8F0000] via-transparent to-transparent" />
        </div>
      </div>

      {/* Filter / Tier bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#C00000]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#1A1D20]">Filter By Tier:</span>
        </div>

        <div className="flex items-center gap-2">
          {['all', 'Classic', 'Premium', 'Luxury'].map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setSelectedTier(tier)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                selectedTier === tier
                  ? 'bg-[#C00000] text-[#F7B32D] shadow-sm'
                  : 'bg-[#F8F9FC] text-[#59616D] hover:bg-slate-200'
              }`}
            >
              {tier === 'all' ? 'All Tiers' : tier}
            </button>
          ))}
        </div>
      </div>

      {/* The 3 Designs Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-serif font-bold text-[#1A1D20]">
          Available {event.name} Packages ({filteredDesigns.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredDesigns.map((design) => (
            <DesignCard
              key={design.id}
              design={design}
              onBook={(d) => onNavigate(`/booking/${d.id}`)}
              onViewDetails={(d) => onNavigate(`/designs/${d.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
