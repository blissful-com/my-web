import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  ShieldCheck,
  Zap,
  PackageCheck,
  Share2,
} from 'lucide-react';
import type { Design, AddOn } from '../types/database.js';
import { api } from '../lib/api.js';
import { ImageWithFallback } from '../components/ImageWithFallback.js';
import { PriceDisplay } from '../components/PriceDisplay.js';
import { formatPKR } from '../lib/constants.js';

interface DesignDetailsProps {
  designId: string;
  onNavigate: (path: string) => void;
}

export const DesignDetails: React.FC<DesignDetailsProps> = ({ designId, onNavigate }) => {
  const [design, setDesign] = useState<Design | null>(null);
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchDetail() {
      setLoading(true);
      try {
        const [designRes, addOnsRes] = await Promise.all([
          api.getDesignById(designId),
          api.getAddOns(),
        ]);
        if (isMounted) {
          setDesign(designRes.design);
          setAddOns(addOnsRes.addOns);
        }
      } catch (err) {
        console.error('Failed to load design:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchDetail();
    return () => {
      isMounted = false;
    };
  }, [designId]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Sparkles className="w-8 h-8 text-[#C00000] animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-[#59616D]">Loading lighting design specifications...</p>
      </div>
    );
  }

  if (!design) {
    return (
      <div className="max-w-md mx-auto my-16 text-center bg-white p-8 rounded-3xl border border-slate-200">
        <h2 className="text-2xl font-serif font-bold text-[#1A1D20] mb-2">Design Not Found</h2>
        <p className="text-sm text-[#59616D] mb-6">The requested decoration design could not be loaded.</p>
        <button
          type="button"
          onClick={() => onNavigate('/designs')}
          className="px-6 py-2.5 rounded-xl bg-[#C00000] text-white text-xs font-bold uppercase tracking-wider"
        >
          Back to Catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            if (design.event) {
              onNavigate(`/events/${design.event.slug}`);
            } else {
              onNavigate('/designs');
            }
          }}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C00000] hover:text-[#DE3C3C] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {design.event?.name || 'Designs'}</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#1A1D20] hover:bg-slate-100 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 text-[#C00000]" />
          <span>{copied ? 'Link Copied!' : 'Share Design'}</span>
        </button>
      </div>

      {/* Main Showcase Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Big HD Image & Equipment */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-lg">
            <ImageWithFallback
              src={design.image_url}
              alt={design.name}
              aspectRatio="4/3"
              className="w-full h-auto"
            />
          </div>

          {/* Description & Narrative */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xl font-serif font-bold text-[#1A1D20]">
              About This Lighting Concept
            </h3>
            <p className="text-sm text-[#59616D] leading-relaxed">
              {design.full_description || design.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#C00000] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[#1A1D20]">Estimated Setup Duration</p>
                  <p className="text-xs text-[#59616D]">{design.setup_time || '3 to 4 Hours'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#C00000] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[#1A1D20]">Recommended Venues</p>
                  <p className="text-xs text-[#59616D]">{design.venue_type || 'Banquet Hall, Marquee, Lawn'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Included Services & Equipment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Services */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-[#C00000]" />
                <h4 className="text-base font-serif font-bold text-[#1A1D20]">Included Services</h4>
              </div>
              <ul className="space-y-2.5">
                {(design.included_services || []).map((srv, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#59616D] leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-[#C00000] shrink-0 mt-0.5" />
                    <span>{srv}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Equipment */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#F7B32D]" />
                <h4 className="text-base font-serif font-bold text-[#1A1D20]">Lighting Equipment</h4>
              </div>
              <ul className="space-y-2.5">
                {(design.lighting_equipment || [
                  'High-Output LED Fixtures',
                  'Heavy Duty Surge-Safe Extensions',
                  'Safety Cable Ramps & Ties',
                  'Distribution Control Console',
                ]).map((eq, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#59616D] leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-[#DE3C3C] shrink-0 mt-0.5" />
                    <span>{eq}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Booking Card & Add-ons */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#C00000] shadow-xl space-y-6">
            {/* Tier & Availability */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C00000]">
                {design.event?.name} Celebration
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  design.is_available
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {design.is_available ? 'Available for Booking' : 'Unavailable'}
              </span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1D20]">
                {design.name}
              </h1>
              <p className="text-xs text-[#59616D] mt-1">
                Unique Design Ref: <span className="font-mono text-[#C00000] font-bold">{design.id}</span>
              </p>
            </div>

            {/* Price Box */}
            <div className="p-5 bg-[#F8F9FC] rounded-2xl border border-slate-200">
              <PriceDisplay
                amount={design.price_pkr}
                tier={design.tier}
                label="Package Investment"
                size="xl"
              />
              <p className="text-[11px] text-[#59616D] mt-2 font-medium">
                * Includes all standard fixtures, wiring safety check, and on-site dismantling in Pakistan.
              </p>
            </div>

            {/* Action CTA */}
            <div>
              <button
                type="button"
                disabled={!design.is_available}
                onClick={() => onNavigate(`/booking/${design.id}`)}
                className="w-full inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-[#C00000] text-[#F7B32D] hover:bg-[#DE3C3C] hover:text-white text-sm font-bold uppercase tracking-wider shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book This Design</span>
              </button>
            </div>

            {/* Trust Assurances */}
            <div className="space-y-3 pt-4 border-t border-slate-100 text-xs text-[#59616D]">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#C00000] shrink-0" />
                <span>Zero surprise fees — trusted server calculation</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C00000] shrink-0" />
                <span>Dedicated standby technician option</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#C00000] shrink-0" />
                <span>Advance booking cancellation guarantee</span>
              </div>
            </div>
          </div>

          {/* Popular Add-Ons Preview */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-serif font-bold text-[#1A1D20]">Popular Upgrade Add-Ons</h4>
              <span className="text-[11px] text-[#C00000] font-semibold">Selectable during checkout</span>
            </div>

            <div className="space-y-3">
              {addOns.slice(0, 4).map((addon) => (
                <div
                  key={addon.id}
                  className="p-3 rounded-xl bg-[#F8F9FC] border border-slate-200 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <p className="font-bold text-[#1A1D20]">{addon.name}</p>
                    <p className="text-[11px] text-[#59616D] line-clamp-1">{addon.description}</p>
                  </div>
                  <span className="font-mono font-bold text-[#C00000] shrink-0">
                    +{formatPKR(addon.price_pkr)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
