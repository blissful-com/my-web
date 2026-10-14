import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Phone,
  User,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  Info,
} from 'lucide-react';
import type { Design, AddOn } from '../types/database.js';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.js';
import { ImageWithFallback } from '../components/ImageWithFallback.js';
import { PriceDisplay } from '../components/PriceDisplay.js';
import { formatPKR, PAKISTANI_CITIES, VENUE_TYPES } from '../lib/constants.js';

interface BookingProps {
  designId: string;
  onNavigate: (path: string) => void;
}

export const Booking: React.FC<BookingProps> = ({ designId, onNavigate }) => {
  const { user, isAuthenticated } = useAuth();
  const [design, setDesign] = useState<Design | null>(null);
  const [availableAddOns, setAvailableAddOns] = useState<AddOn[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('18:00');
  const [city, setCity] = useState(PAKISTANI_CITIES[0]);
  const [area, setArea] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [venueType, setVenueType] = useState(VENUE_TYPES[0]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, number>>({});

  // Minimum date: tomorrow
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  useEffect(() => {
    if (!isAuthenticated) {
      onNavigate(`/login?redirect=${encodeURIComponent(`/booking/${designId}`)}`);
      return;
    }

    if (user) {
      setCustomerName(user.full_name || '');
      setCustomerPhone(user.phone || '');
    }

    let isMounted = true;
    async function fetchDesignData() {
      try {
        const [designRes, addOnsRes] = await Promise.all([
          api.getDesignById(designId),
          api.getAddOns(),
        ]);
        if (isMounted) {
          setDesign(designRes.design);
          setAvailableAddOns(addOnsRes.addOns);
        }
      } catch (err) {
        console.error('Failed to load booking design details:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchDesignData();
    return () => {
      isMounted = false;
    };
  }, [designId, isAuthenticated, user, onNavigate]);

  const handleAddOnQuantityChange = (addonId: string, delta: number) => {
    setSelectedAddOns((prev) => {
      const current = prev[addonId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[addonId];
        return copy;
      }
      return { ...prev, [addonId]: next };
    });
  };

  const basePrice = design ? Number(design.price_pkr) : 0;
  const addOnsTotal = Object.entries(selectedAddOns).reduce((sum, [id, qty]) => {
    const item = availableAddOns.find((a) => a.id === id);
    return sum + (item ? Number(item.price_pkr) * qty : 0);
  }, 0);
  const estimatedTotal = basePrice + addOnsTotal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!eventDate) {
      setError('Please select an event celebration date.');
      return;
    }

    if (!area.trim() || !venueAddress.trim()) {
      setError('Please provide the area and complete venue address.');
      return;
    }

    if (!customerPhone.trim()) {
      setError('Please provide an active Pakistani contact phone number.');
      return;
    }

    setSubmitting(true);
    try {
      const addOnSelections = Object.entries(selectedAddOns).map(([addOnId, quantity]) => ({
        addOnId,
        quantity,
      }));

      const res = await api.createBooking({
        designId,
        eventDate,
        eventTime,
        city,
        area,
        venueAddress,
        customerPhone,
        specialInstructions,
        addOnSelections,
      });

      onNavigate(`/checkout/${res.booking.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to submit booking. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !design) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <Sparkles className="w-8 h-8 text-[#C00000] animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-[#59616D]">Preparing booking details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Step Header */}
      <div className="bg-gradient-to-r from-[#8F0000] via-[#C00000] to-[#8F0000] rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-white/20">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#F7B32D] text-xs font-bold uppercase tracking-wider border border-[#F7B32D]/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Booking & Venue Customization</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white">
            Book {design.name}
          </h1>
          <p className="text-xs sm:text-sm text-white/85">
            Complete venue logistics, pick celebratory add-ons, and confirm your booking reservation.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Column */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1: Event Schedule */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <CalendarIcon className="w-5 h-5 text-[#C00000]" />
              <h2 className="text-lg font-serif font-bold text-[#1A1D20]">Event Date & Time</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1D20] mb-1.5">
                  Celebration Date *
                </label>
                <input
                  type="date"
                  required
                  min={minDateStr}
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C00000] text-[#1A1D20]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1D20] mb-1.5">
                  Guest Arrival Time *
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="time"
                    required
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C00000] text-[#1A1D20]"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#F8F9FC] rounded-xl text-xs text-[#59616D] flex items-center gap-2 border border-slate-200">
              <Info className="w-4 h-4 text-[#C00000] shrink-0" />
              <span>Glowora technicians arrive 3 to 4 hours prior to guest arrival for setup.</span>
            </div>
          </div>

          {/* Section 2: Venue Location in Pakistan */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <MapPin className="w-5 h-5 text-[#C00000]" />
              <h2 className="text-lg font-serif font-bold text-[#1A1D20]">Pakistani Venue Address</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1D20] mb-1.5">
                  City *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C00000] text-[#1A1D20] bg-white"
                >
                  {PAKISTANI_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1D20] mb-1.5">
                  Area / Sector / Phase *
                </label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. DHA Phase 5, Gulberg III, Bahria"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C00000] text-[#1A1D20]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1D20] mb-1.5">
                Complete Venue Address *
              </label>
              <textarea
                required
                rows={2}
                value={venueAddress}
                onChange={(e) => setVenueAddress(e.target.value)}
                placeholder="Hall Name / Plot No, Street, Landmark..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C00000] text-[#1A1D20]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1D20] mb-1.5">
                Venue Type
              </label>
              <select
                value={venueType}
                onChange={(e) => setVenueType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C00000] text-[#1A1D20] bg-white"
              >
                {VENUE_TYPES.map((vt) => (
                  <option key={vt} value={vt}>{vt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 3: Contact Person Details */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <User className="w-5 h-5 text-[#C00000]" />
              <h2 className="text-lg font-serif font-bold text-[#1A1D20]">Customer Contact Info</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1D20] mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C00000] text-[#1A1D20]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1D20] mb-1.5">
                  Phone Number (WhatsApp Active) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="0300-1234567"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C00000] text-[#1A1D20]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1D20] mb-1.5">
                Special Decoration Instructions / Theme Colors
              </label>
              <textarea
                rows={3}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Mention specific floral color palette, generator power location, or entrance gate requests..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C00000] text-[#1A1D20]"
              />
            </div>
          </div>

          {/* Section 4: Optional Add-ons */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-[#F7B32D]" />
                <h2 className="text-lg font-serif font-bold text-[#1A1D20]">Select Celebration Add-Ons</h2>
              </div>
              <span className="text-xs text-[#C00000] font-semibold">Optional Enhancements</span>
            </div>

            <div className="space-y-3">
              {availableAddOns.map((addon) => {
                const qty = selectedAddOns[addon.id] || 0;
                return (
                  <div
                    key={addon.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      qty > 0
                        ? 'bg-[#DE3C3C]/10 border-[#C00000]'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#1A1D20]">{addon.name}</span>
                        {qty > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-[#C00000] text-white text-[10px] font-bold">
                            Selected
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#59616D]">{addon.description}</p>
                      <p className="text-xs font-mono font-bold text-[#C00000]">
                        {formatPKR(addon.price_pkr)} each
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleAddOnQuantityChange(addon.id, -1)}
                        disabled={qty === 0}
                        className="w-8 h-8 rounded-xl bg-slate-100 text-[#1A1D20] hover:bg-slate-200 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-bold font-mono text-[#1A1D20]">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddOnQuantityChange(addon.id, 1)}
                        className="w-8 h-8 rounded-xl bg-[#C00000] text-white hover:bg-[#DE3C3C] flex items-center justify-center transition-colors shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Sticky Order Summary */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#C00000] shadow-xl space-y-6">
            <h3 className="text-xl font-serif font-bold text-[#1A1D20] pb-3 border-b border-slate-100">
              Booking Summary
            </h3>

            {/* Design Mini Preview */}
            <div className="flex gap-4 items-center">
              <div className="w-20 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                <ImageWithFallback
                  src={design.image_url}
                  alt={design.name}
                  aspectRatio="4/3"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-[#C00000] uppercase tracking-wider">{design.event?.name}</p>
                <h4 className="text-sm font-bold text-[#1A1D20]">{design.name}</h4>
                <span className="text-xs font-mono font-semibold text-[#59616D]">{design.tier} Package</span>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
              <div className="flex justify-between items-center text-[#59616D]">
                <span>Base Package Rate:</span>
                <span className="font-mono font-bold text-[#1A1D20]">{formatPKR(basePrice)}</span>
              </div>

              {Object.keys(selectedAddOns).length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-dashed border-slate-200">
                  <span className="text-[11px] font-bold text-[#1A1D20] uppercase">Selected Add-Ons:</span>
                  {Object.entries(selectedAddOns).map(([id, qty]) => {
                    const item = availableAddOns.find((a) => a.id === id);
                    if (!item) return null;
                    return (
                      <div key={id} className="flex justify-between text-[#59616D] text-[11px]">
                        <span>{item.name} (x{qty})</span>
                        <span className="font-mono">{formatPKR(item.price_pkr * qty)}</span>
                      </div>
                    );
                  })}
                  <div className="flex justify-between text-[#59616D] font-semibold pt-1">
                    <span>Add-Ons Subtotal:</span>
                    <span className="font-mono text-[#1A1D20]">{formatPKR(addOnsTotal)}</span>
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="pt-3 border-t-2 border-[#C00000] flex justify-between items-baseline">
                <span className="text-sm font-bold uppercase tracking-wider text-[#1A1D20]">Total Investment:</span>
                <span className="text-2xl font-extrabold font-mono text-[#C00000]">
                  {formatPKR(estimatedTotal)}
                </span>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 rounded-2xl bg-[#C00000] text-[#F7B32D] hover:bg-[#DE3C3C] hover:text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <span>Confirming Booking with Server...</span>
              ) : (
                <>
                  <span>Proceed to Booking Review</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="space-y-2 pt-2 text-[11px] text-[#59616D] border-t border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C00000] shrink-0" />
                <span>Verified server calculation (no tampering permitted)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C00000] shrink-0" />
                <span>Unique reference generated instantly on submission</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
