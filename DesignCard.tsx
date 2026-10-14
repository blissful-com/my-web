import React from 'react';
import { Sparkles, Calendar, Clock, MapPin, Eye } from 'lucide-react';
import type { Design } from '../types/database.js';
import { ImageWithFallback } from './ImageWithFallback.js';
import { PriceDisplay } from './PriceDisplay.js';

interface DesignCardProps {
  design: Design;
  onBook: (design: Design) => void;
  onViewDetails: (design: Design) => void;
}

export const DesignCard: React.FC<DesignCardProps> = ({
  design,
  onBook,
  onViewDetails,
}) => {
  return (
    <div className="design-card group bg-white rounded-2xl overflow-hidden border border-[#DE3C3C]/20 hover:border-[#C00000]/50 shadow-md flex flex-col justify-between">
      <div>
        {/* 4:3 Aspect Ratio Image with Hover Zoom Container */}
        <div
          onClick={() => onViewDetails(design)}
          className="design-image-container relative cursor-pointer"
        >
          <ImageWithFallback
            src={design.image_url}
            alt={`${design.name} decoration lighting setup`}
            aspectRatio="4/3"
            className="design-image"
            fallbackText={design.name}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#8F0000]/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          {/* Tier Badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border ${
                design.tier === 'Luxury'
                  ? 'bg-[#C00000] text-[#F7B32D] border-[#F7B32D]/60'
                  : design.tier === 'Premium'
                  ? 'bg-[#DE3C3C] text-white border-transparent'
                  : 'bg-white text-[#C00000] border-[#DE3C3C]/50'
              }`}
            >
              {design.tier}
            </span>
          </div>

          {/* Category Tag */}
          {design.event && (
            <div className="absolute top-3 left-3 bg-[#8F0000]/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-white flex items-center gap-1 border border-[#F7B32D]/40">
              <Sparkles className="w-3 h-3 text-[#F7B32D]" />
              <span>{design.event.name}</span>
            </div>
          )}

          {/* Setup Duration Tag */}
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs text-white/95 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#F7B32D]" />
            <span>{design.setup_time || '3-4 Hours'}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={() => onViewDetails(design)}
              className="text-sm sm:text-base font-serif font-bold text-[#1A1D20] hover:text-[#C00000] cursor-pointer transition-colors leading-snug"
            >
              {design.name}
            </h3>
          </div>

          <p className="text-[11px] text-[#59616D] line-clamp-2 leading-relaxed">
            {design.description}
          </p>

          {/* Quick Specs */}
          {design.venue_type && (
            <div className="flex items-center gap-1.5 text-[11px] text-[#59616D] font-medium pt-1">
              <MapPin className="w-3.5 h-3.5 text-[#C00000] shrink-0" />
              <span className="truncate">{design.venue_type}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="p-5 pt-0">
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-baseline justify-between">
            <PriceDisplay amount={design.price_pkr} tier={design.tier} showBadge={false} size="lg" />
            <span className="text-[11px] font-medium text-[#59616D] uppercase tracking-wider">Per Event</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onViewDetails(design)}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F8F9FC] text-[#1A1D20] hover:bg-slate-200 border border-slate-200 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[#C00000]" />
              <span>Details</span>
            </button>

            <button
              type="button"
              onClick={() => onBook(design)}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#C00000] text-[#F7B32D] hover:bg-[#DE3C3C] hover:text-white shadow-sm transition-all"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
