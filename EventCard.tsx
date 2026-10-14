import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { EventCategory } from '../types/database.js';
import { ImageWithFallback } from './ImageWithFallback.js';
import { PriceDisplay } from './PriceDisplay.js';

interface EventCardProps {
  event: EventCategory;
  onSelect?: (event: EventCategory) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onSelect }) => {
  return (
    <div
      onClick={() => onSelect && onSelect(event)}
      className="design-card group bg-white rounded-2xl overflow-hidden border border-[#DE3C3C]/20 hover:border-[#C00000]/50 shadow-md flex flex-col cursor-pointer transition-all duration-300"
    >
      {/* 4:3 Aspect Ratio Image Container */}
      <div className="design-image-container relative">
        <ImageWithFallback
          src={event.image_url}
          alt={`${event.name} lighting decoration setup in Pakistan`}
          aspectRatio="4/3"
          className="design-image"
          fallbackText={event.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#8F0000]/90 via-[#8F0000]/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
        
        <div className="absolute top-3 left-3 bg-[#C00000]/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#F7B32D] flex items-center gap-1.5 border border-[#F7B32D]/40">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Celebration</span>
        </div>

        <div className="absolute bottom-3 left-4 right-4 text-white">
          <h3 className="text-base sm:text-lg font-serif font-bold text-white drop-shadow-sm group-hover:text-[#F7B32D] transition-colors">
            {event.name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <p className="text-xs text-[#59616D] line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          {event.starting_price_pkr ? (
            <PriceDisplay
              amount={event.starting_price_pkr}
              label="Starting From"
              size="md"
              showBadge={false}
            />
          ) : (
            <span className="text-xs font-semibold text-[#C00000]">Custom Packages</span>
          )}

          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#C00000] text-white group-hover:bg-[#DE3C3C] transition-colors shadow-sm"
          >
            <span>Designs</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
