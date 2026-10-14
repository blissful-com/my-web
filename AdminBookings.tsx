import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
  Sparkles,
} from 'lucide-react';
import type { Booking } from '../../types/database.js';
import { api } from '../../lib/api.js';
import { formatPKR, formatDate } from '../../lib/constants.js';

interface AdminBookingsProps {
  onNavigate: (path: string) => void;
}

export const AdminBookings: React.FC<AdminBookingsProps> = ({ onNavigate }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [updating, setUpdating] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.getBookings({
        status: statusFilter,
        paymentStatus: paymentFilter,
        search,
      });
      setBookings(res.bookings);
    } catch (err) {
      console.error('Failed to load admin bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, paymentFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings();
  };

  const handleStatusUpdate = async (
    bookingId: string,
    booking_status?: Booking['booking_status'],
    payment_status?: Booking['payment_status']
  ) => {
    setUpdating(true);
    setAlertMessage(null);
    try {
      const res = await api.updateBookingStatus(bookingId, {
        booking_status,
        payment_status,
      });
      setAlertMessage(`Booking ${res.booking.booking_reference} updated successfully.`);
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking(res.booking);
      }
      await fetchBookings();
    } catch (err: any) {
      alert(err.message || 'Failed to update booking status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#8F0000] via-[#C00000] to-[#8F0000] rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-white/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white">
            Booking & Order Operations
          </h1>
          <p className="text-xs sm:text-sm text-white/85 mt-1">
            Review customer reservations, approve venue permits, and record verified bank receipts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('/admin')}
          className="px-4 py-2 rounded-xl bg-white/10 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/20 border border-white/20 self-start md:self-auto transition-colors"
        >
          Back to Overview
        </button>
      </div>

      {alertMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{alertMessage}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <form onSubmit={handleSearchSubmit} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by reference, city, or phone..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 text-[#1A1D20] focus:outline-none focus:border-[#C00000]"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 text-[#1A1D20] bg-white font-medium"
            >
              <option value="all">All Booking Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 text-[#1A1D20] bg-white font-medium"
            >
              <option value="all">All Payment Statuses</option>
              <option value="unpaid">Unpaid</option>
              <option value="pending">Pending Verification</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
      </form>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <Sparkles className="w-8 h-8 text-[#C00000] animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-[#59616D]">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <p className="py-16 text-center text-xs text-slate-400">No bookings found for the selected filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9FC] border-b border-slate-200 text-[#1A1D20] uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-4 px-5">Ref</th>
                  <th className="py-4 px-4">Customer Details</th>
                  <th className="py-4 px-4">Event & Setup</th>
                  <th className="py-4 px-4">Date & City</th>
                  <th className="py-4 px-4">Total</th>
                  <th className="py-4 px-4">Booking Status</th>
                  <th className="py-4 px-4">Payment</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#F8F9FC] transition-colors">
                    <td className="py-4 px-5 font-mono font-bold text-[#C00000]">
                      {b.booking_reference}
                    </td>

                    <td className="py-4 px-4">
                      <p className="font-bold text-[#1A1D20]">{b.customer?.full_name || 'Customer'}</p>
                      <p className="text-[11px] text-[#59616D]">{b.customer_phone}</p>
                      <p className="text-[10px] text-slate-400">{b.customer?.email}</p>
                    </td>

                    <td className="py-4 px-4">
                      <p className="font-bold text-[#1A1D20]">{b.design_name_snapshot}</p>
                      <p className="text-[11px] text-[#C00000]">{b.event_name_snapshot}</p>
                      {b.add_ons && b.add_ons.length > 0 && (
                        <p className="text-[10px] text-amber-800 font-medium">+{b.add_ons.length} Add-on(s)</p>
                      )}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <p className="font-semibold text-[#1A1D20]">{formatDate(b.event_date)}</p>
                      <p className="text-[11px] text-[#59616D]">{b.city} ({b.event_time})</p>
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-[#1A1D20]">
                      {formatPKR(b.total_pkr)}
                    </td>

                    {/* Booking Status Selector */}
                    <td className="py-4 px-4">
                      <select
                        value={b.booking_status}
                        disabled={updating}
                        onChange={(e) =>
                          handleStatusUpdate(b.id, e.target.value as Booking['booking_status'], undefined)
                        }
                        className="text-[11px] font-bold uppercase rounded-lg border border-slate-200 px-2 py-1 bg-white text-[#1A1D20]"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>

                    {/* Payment Status Selector */}
                    <td className="py-4 px-4">
                      <select
                        value={b.payment_status}
                        disabled={updating}
                        onChange={(e) =>
                          handleStatusUpdate(b.id, undefined, e.target.value as Booking['payment_status'])
                        }
                        className={`text-[11px] font-bold uppercase rounded-lg border px-2 py-1 ${
                          b.payment_status === 'paid'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}
                      >
                        <option value="unpaid">Unpaid</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>

                    <td className="py-4 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedBooking(b)}
                        className="px-3 py-1.5 rounded-xl bg-[#C00000] text-[#F7B32D] hover:bg-[#DE3C3C] hover:text-white text-xs font-bold transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inspect Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#C00000]">
                  Booking Reference Dossier
                </span>
                <h3 className="text-xl font-serif font-bold text-[#1A1D20]">
                  {selectedBooking.booking_reference}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 bg-[#F8F9FC] rounded-2xl border border-slate-200">
                <div>
                  <p className="text-[11px] text-slate-400 uppercase font-semibold">Customer</p>
                  <p className="font-bold text-sm text-[#1A1D20]">{selectedBooking.customer?.full_name}</p>
                  <p className="text-[#59616D]">{selectedBooking.customer_phone}</p>
                  <p className="text-[#59616D]">{selectedBooking.customer?.email}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 uppercase font-semibold">Event Snapshot</p>
                  <p className="font-bold text-sm text-[#1A1D20]">{selectedBooking.design_name_snapshot}</p>
                  <p className="text-[#C00000]">{selectedBooking.event_name_snapshot}</p>
                  <p className="font-semibold text-emerald-800">{formatPKR(selectedBooking.total_pkr)} Total</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-[#1A1D20] uppercase">Venue Logistics:</p>
                <p className="text-[#59616D]">{selectedBooking.venue_address}</p>
                <p className="text-[#59616D]">Sector / Area: {selectedBooking.area}, {selectedBooking.city}</p>
                <p className="text-[#59616D]">Date: {formatDate(selectedBooking.event_date)} at {selectedBooking.event_time}</p>
              </div>

              {selectedBooking.special_instructions && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="font-bold text-amber-900 mb-1">Special Client Instructions:</p>
                  <p className="text-amber-800">{selectedBooking.special_instructions}</p>
                </div>
              )}

              {selectedBooking.add_ons && selectedBooking.add_ons.length > 0 && (
                <div className="space-y-1 pt-2 border-t border-slate-100">
                  <p className="font-bold text-[#1A1D20]">Selected Add-Ons:</p>
                  {selectedBooking.add_ons.map((ao, i) => (
                    <div key={i} className="flex justify-between text-[#59616D]">
                      <span>{ao.name} (Qty: {ao.quantity})</span>
                      <span className="font-mono text-[#1A1D20]">{formatPKR(ao.total_pkr)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="px-6 py-2.5 rounded-xl bg-[#C00000] text-white text-xs font-bold uppercase tracking-wider"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
