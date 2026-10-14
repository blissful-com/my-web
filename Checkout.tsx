import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Copy,
  Check,
  Calendar,
  MapPin,
  Clock,
  AlertCircle,
} from 'lucide-react';
import type { Booking } from '../types/database.js';
import { api } from '../lib/api.js';
import { formatPKR, formatDate, BRAND } from '../lib/constants.js';

interface CheckoutProps {
  bookingId: string;
  onNavigate: (path: string) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ bookingId, onNavigate }) => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchBooking() {
      try {
        const res = await api.getBookingById(bookingId);
        if (isMounted) setBooking(res.booking);
      } catch (err) {
        console.error('Failed to load booking for checkout:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchBooking();
    return () => {
      isMounted = false;
    };
  }, [bookingId]);

  const copyToClipboard = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedBank(label);
      setTimeout(() => setCopiedBank(null), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <Sparkles className="w-8 h-8 text-[#C00000] animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-[#59616D]">Loading booking review...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto my-16 text-center bg-white p-8 rounded-3xl border border-slate-200">
        <h2 className="text-2xl font-serif font-bold text-[#1A1D20] mb-2">Booking Record Not Found</h2>
        <p className="text-sm text-[#59616D] mb-6">Unable to locate the specified booking order.</p>
        <button
          type="button"
          onClick={() => onNavigate('/account/bookings')}
          className="px-6 py-2.5 rounded-xl bg-[#C00000] text-white text-xs font-bold uppercase tracking-wider"
        >
          My Bookings
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Step Header */}
      <div className="bg-gradient-to-r from-[#8F0000] via-[#C00000] to-[#8F0000] rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-white/20">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#F7B32D] text-xs font-bold uppercase tracking-wider border border-[#F7B32D]/40">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Step 2 of 2: Reservation & Payment Instructions</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white">
            Booking Review & Payment Method
          </h1>
          <p className="text-xs sm:text-sm text-white/85">
            Review your reservation details and choose your preferred settlement method in Pakistan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Payment Options */}
        <div className="lg:col-span-7 space-y-6">
          {/* Method 1: Bank Transfer (Primary in Pakistan) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#C00000] shadow-md space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C00000] text-[#F7B32D] flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-[#1A1D20]">
                    Direct Bank Transfer / Raast (Recommended)
                  </h3>
                  <p className="text-xs text-[#59616D]">Zero transaction fees, immediate verification</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                Active
              </span>
            </div>

            <div className="p-4 bg-[#F8F9FC] rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#59616D] font-medium">Bank Name:</span>
                <span className="font-bold text-[#1A1D20]">Meezan Bank Limited</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#59616D] font-medium">Account Title:</span>
                <span className="font-bold text-[#1A1D20]">GLOWORA EVENT SERVICES</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#59616D] font-medium">Account / IBAN:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#C00000]">PK82MEZN0001090293817201</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('PK82MEZN0001090293817201', 'iban')}
                    className="p-1 rounded hover:bg-slate-200 text-slate-600"
                    title="Copy IBAN"
                  >
                    {copiedBank === 'iban' ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#59616D] font-medium">Payment Reference:</span>
                <span className="font-mono font-bold text-[#C00000] bg-white px-2 py-0.5 rounded border border-slate-200">
                  {booking.booking_reference}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#59616D] leading-relaxed">
              Transfer the 50% deposit (or full amount) using mobile banking. Share the transfer receipt on WhatsApp to{' '}
              <a href={BRAND.whatsappUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-[#C00000] underline">
                {BRAND.phone}
              </a>{' '}
              along with your reference <span className="font-mono font-bold text-[#C00000]">{booking.booking_reference}</span>.
            </p>
          </div>

          {/* Method 2: Cash on Site Setup Agreement */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-serif font-bold text-[#1A1D20]">
                Cash Settlement Upon Equipment Arrival
              </h4>
              <span className="text-[11px] text-[#C00000] font-semibold">Available for all Pakistani Cities</span>
            </div>
            <p className="text-xs text-[#59616D] leading-relaxed">
              Pay 20% advance confirmation deposit via online transfer, and settle the remaining 80% balance in cash directly to our lead master technician once all lighting fixtures are tested at the venue.
            </p>
          </div>

          {/* Payment Status Notice */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Payment Status: {booking.payment_status.toUpperCase()}</p>
              <p className="mt-0.5">
                In compliance with strict security requirements, orders are verified by authorized accounts staff upon receipt confirmation.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Invoice & Final Confirmation Button */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-serif font-bold text-[#1A1D20]">Invoice Summary</h3>
              <span className="font-mono font-bold text-xs bg-[#C00000] text-[#F7B32D] px-2.5 py-1 rounded-full">
                {booking.booking_reference}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <p className="font-bold text-sm text-[#1A1D20]">{booking.design_name_snapshot}</p>
                <p className="text-xs text-[#59616D]">{booking.event_name_snapshot} Setup</p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[#59616D]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#C00000]" />
                  <span>{formatDate(booking.event_date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#C00000]" />
                  <span>Guest Time: {booking.event_time}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#C00000] mt-0.5 shrink-0" />
                  <span>{booking.area}, {booking.city}</span>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                <div className="flex justify-between text-[#59616D]">
                  <span>Package Base:</span>
                  <span className="font-mono font-bold text-[#1A1D20]">{formatPKR(booking.subtotal_pkr)}</span>
                </div>

                {booking.add_ons && booking.add_ons.length > 0 && (
                  <div className="space-y-1 pt-1 border-t border-dashed border-slate-200">
                    <span className="text-[11px] font-bold text-[#1A1D20]">Add-Ons:</span>
                    {booking.add_ons.map((ao, i) => (
                      <div key={i} className="flex justify-between text-[11px] text-[#59616D]">
                        <span>{ao.name} (x{ao.quantity})</span>
                        <span className="font-mono">{formatPKR(ao.total_pkr)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-[11px] font-semibold text-[#59616D]">
                      <span>Add-ons Total:</span>
                      <span className="font-mono text-[#1A1D20]">{formatPKR(booking.add_on_total_pkr)}</span>
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t-2 border-[#C00000] flex justify-between items-baseline">
                  <span className="text-sm font-bold uppercase tracking-wider text-[#1A1D20]">Total Amount:</span>
                  <span className="text-2xl font-extrabold font-mono text-[#C00000]">
                    {formatPKR(booking.total_pkr)}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate(`/booking-confirmation/${booking.id}`)}
              className="w-full py-4 px-6 rounded-2xl bg-[#C00000] text-[#F7B32D] hover:bg-[#DE3C3C] hover:text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Confirm & View Official Booking Pass</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
