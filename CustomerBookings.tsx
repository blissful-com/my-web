import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  AlertCircle,
  Eye,
  XCircle,
  CheckCircle2,
} from 'lucide-react';
import type { Booking } from '../types/database.js';
import { api } from '../lib/api.js';
import { formatPKR, formatDate } from '../lib/constants.js';

interface CustomerBookingsProps {
  onNavigate: (path: string) => void;
}

export const CustomerBookings: React.FC<CustomerBookingsProps> = ({ onNavigate }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.getBookings();
      setBookings(res.bookings);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId: string) => {
    if (!window.confirm('Are you sure you wish to cancel this booking?')) return;

    setCancellingId(bookingId);
    setError(null);
    setMessage(null);
    try {
      await api.cancelBooking(bookingId);
      setMessage('Booking has been cancelled.');
      await fetchBookings();
    } catch (err: any) {
      setError(err.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  const statusStyles: Record<Booking['booking_status'], string> = {
    pending: 'bg-amber-100 text-amber-900 border-amber-300',
    confirmed: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    in_progress: 'bg-blue-100 text-blue-900 border-blue-300',
    completed: 'bg-purple-100 text-purple-900 border-purple-300',
    cancelled: 'bg-gray-100 text-gray-700 border-gray-300',
    rejected: 'bg-red-100 text-red-900 border-red-300',
  };

  const paymentStyles: Record<Booking['payment_status'], string> = {
    unpaid: 'bg-rose-100 text-rose-800',
    pending: 'bg-amber-100 text-amber-800',
    paid: 'bg-emerald-100 text-emerald-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#8F0000] via-[#C00000] to-[#8F0000] rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-white/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#F7B32D] text-xs font-bold uppercase tracking-wider border border-[#F7B32D]/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Customer Portal</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white">
            My Lighting Bookings
          </h1>
          <p className="text-xs sm:text-sm text-white/85">
            Track status, venue coordination, payment approvals, and invoices.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('/designs')}
          className="px-6 py-3 rounded-2xl bg-[#F7B32D] text-[#8F0000] text-xs font-bold uppercase tracking-wider hover:bg-white transition-all shadow-md self-start md:self-auto cursor-pointer"
        >
          Book Another Design
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Bookings List */}
      {loading ? (
        <div className="py-16 text-center">
          <Sparkles className="w-8 h-8 text-[#C00000] animate-spin mx-auto mb-4" />
          <p className="text-sm font-semibold text-[#59616D]">Loading your bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#F8F9FC] text-[#C00000] flex items-center justify-center mx-auto border border-slate-200">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-serif font-bold text-[#1A1D20]">No Bookings Yet</h3>
          <p className="text-xs text-[#59616D] max-w-md mx-auto">
            You have not booked any event lighting setups yet. Explore our 18 verified designs for Barat, Mehndi, Waleema, and Birthdays.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('/designs')}
            className="px-6 py-3 rounded-xl bg-[#C00000] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#DE3C3C] transition-colors"
          >
            Explore Designs
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:shadow-lg transition-shadow"
            >
              {/* Left Info */}
              <div className="space-y-4 max-w-2xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono font-bold text-sm bg-[#C00000] text-[#F7B32D] px-3 py-1 rounded-xl">
                    {booking.booking_reference}
                  </span>
                  <span
                    className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                      statusStyles[booking.booking_status] || 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    Booking: {booking.booking_status.replace('_', ' ')}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      paymentStyles[booking.payment_status] || 'bg-gray-100'
                    }`}
                  >
                    Payment: {booking.payment_status}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-serif font-bold text-[#1A1D20]">
                    {booking.design_name_snapshot}
                  </h3>
                  <p className="text-xs text-[#C00000] font-semibold">
                    Category: {booking.event_name_snapshot}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#59616D]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#C00000] shrink-0" />
                    <span>{formatDate(booking.event_date)} ({booking.event_time})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#C00000] shrink-0" />
                    <span className="truncate">{booking.venue_address}, {booking.city}</span>
                  </div>
                </div>

                {booking.add_ons && booking.add_ons.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 text-xs text-[#59616D]">
                    <span className="font-bold text-[#1A1D20]">Add-Ons Included: </span>
                    {booking.add_ons.map((ao) => `${ao.name} (x${ao.quantity})`).join(', ')}
                  </div>
                )}
              </div>

              {/* Right Action & Price */}
              <div className="lg:text-right space-y-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#59616D] block">
                    Total Investment
                  </span>
                  <p className="text-2xl font-extrabold font-mono text-[#C00000]">
                    {formatPKR(booking.total_pkr)}
                  </p>
                </div>

                <div className="flex flex-wrap lg:justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onNavigate(`/booking-confirmation/${booking.id}`)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F8F9FC] text-[#1A1D20] hover:bg-slate-200 border border-slate-200 text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#C00000]" />
                    <span>View Pass</span>
                  </button>

                  {booking.payment_status === 'unpaid' && (
                    <button
                      type="button"
                      onClick={() => onNavigate(`/checkout/${booking.id}`)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C00000] text-[#F7B32D] hover:bg-[#DE3C3C] hover:text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                    >
                      <span>Pay / Transfer</span>
                    </button>
                  )}

                  {booking.booking_status !== 'cancelled' &&
                    booking.booking_status !== 'completed' &&
                    booking.booking_status !== 'in_progress' && (
                      <button
                        type="button"
                        disabled={cancellingId === booking.id}
                        onClick={() => handleCancel(booking.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel Booking</span>
                      </button>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
