import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Phone,
  MessageSquare,
} from 'lucide-react';
import type { Booking } from '../types/database.js';
import { api } from '../lib/api.js';
import { formatPKR, formatDate, BRAND } from '../lib/constants.js';

interface BookingConfirmationProps {
  bookingId: string;
  onNavigate: (path: string) => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  bookingId,
  onNavigate,
}) => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadBooking() {
      try {
        const res = await api.getBookingById(bookingId);
        if (isMounted) {
          setBooking(res.booking);
          try {
            confetti({
              particleCount: 90,
              spread: 75,
              origin: { y: 0.6 },
              colors: ['#F7B32D', '#C00000', '#DE3C3C', '#8F0000'],
            });
          } catch {
            // ignore
          }
        }
      } catch (err) {
        console.error('Failed to load confirmed booking:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadBooking();
    return () => {
      isMounted = false;
    };
  }, [bookingId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <Sparkles className="w-8 h-8 text-[#C00000] animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-[#59616D]">Loading confirmation pass...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto my-16 text-center bg-white p-8 rounded-3xl border border-slate-200">
        <h2 className="text-2xl font-serif font-bold text-[#1A1D20] mb-2">Order Not Found</h2>
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="mt-4 px-6 py-2.5 rounded-xl bg-[#C00000] text-white text-xs font-bold uppercase tracking-wider"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Celebration Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
        {/* Glow backdrop ribbon */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#8F0000] via-[#F7B32D] to-[#DE3C3C]" />

        <div className="w-16 h-16 rounded-3xl bg-[#C00000] text-[#F7B32D] flex items-center justify-center mx-auto shadow-lg border-2 border-[#F7B32D]/50">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C00000]">
            Celebration Reserved
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1D20]">
            Booking Confirmed!
          </h1>
          <p className="text-sm text-[#59616D] max-w-lg mx-auto">
            Your event lighting reservation has been successfully registered in the Glowora production schedule.
          </p>
        </div>

        {/* Big Booking Reference Box */}
        <div className="p-6 bg-[#F8F9FC] rounded-2xl border-2 border-[#C00000] max-w-md mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#59616D]">
            Official Booking Reference:
          </span>
          <p className="text-3xl sm:text-4xl font-extrabold font-mono text-[#C00000] tracking-wider select-all">
            {booking.booking_reference}
          </p>
          <p className="text-[11px] text-[#59616D]">
            Please quote this reference in all WhatsApp and hotline communications.
          </p>
        </div>

        {/* Snapshot Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left p-6 bg-[#F8F9FC] rounded-2xl border border-slate-200 text-xs">
          <div className="space-y-1">
            <span className="text-[11px] text-[#C00000] uppercase font-semibold">Selected Design:</span>
            <p className="font-bold text-[#1A1D20] text-sm">{booking.design_name_snapshot}</p>
            <p className="text-xs text-[#59616D]">{booking.event_name_snapshot} Event</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-[#C00000] uppercase font-semibold">Investment Total:</span>
            <p className="font-mono font-bold text-[#C00000] text-sm">{formatPKR(booking.total_pkr)}</p>
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-900">
              Payment: {booking.payment_status}
            </span>
          </div>

          <div className="space-y-1 pt-2 sm:pt-0">
            <span className="text-[11px] text-[#C00000] uppercase font-semibold">Date & Guest Time:</span>
            <p className="font-bold text-[#1A1D20]">{formatDate(booking.event_date)} at {booking.event_time}</p>
          </div>

          <div className="space-y-1 pt-2 sm:pt-0">
            <span className="text-[11px] text-[#C00000] uppercase font-semibold">Venue:</span>
            <p className="font-bold text-[#1A1D20] line-clamp-2">{booking.venue_address}, {booking.city}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={() => onNavigate('/account/bookings')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#C00000] text-[#F7B32D] hover:bg-[#DE3C3C] hover:text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Track in My Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href={`${BRAND.whatsappUrl}&text=Hi%20Glowora%2C%20here%20is%20my%20booking%20reference%20${booking.booking_reference}%20for%20${booking.design_name_snapshot}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-md"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Send Receipt on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
