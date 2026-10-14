import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Users,
  Sparkles,
  Layers,
  MessageSquare,
  ArrowRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import type { AdminStats, Booking } from '../../types/database.js';
import { api } from '../../lib/api.js';
import { formatPKR, formatDate } from '../../lib/constants.js';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          api.getAdminStats(),
          api.getBookings({ status: 'all' }),
        ]);
        if (isMounted) {
          setStats(statsRes.stats);
          setRecentBookings(bookingsRes.bookings.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <Sparkles className="w-8 h-8 text-[#C00000] animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-[#59616D]">Loading administration metrics...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Admin Top Header */}
      <div className="bg-gradient-to-r from-[#8F0000] via-[#C00000] to-[#8F0000] rounded-3xl p-8 sm:p-10 text-white shadow-xl border border-white/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#F7B32D] text-xs font-bold uppercase tracking-wider border border-[#F7B32D]/40">
            <ShieldCheck className="w-4 h-4" />
            <span>Master Management Portal</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-white">
            Glowora Executive Overview
          </h1>
          <p className="text-xs sm:text-sm text-white/85">
            Monitor operational bookings, pipeline financial metrics, customer contacts, and inventory.
          </p>
        </div>

        {/* Quick Nav Shortcut Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onNavigate('/admin/bookings')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-[#DE3C3C] text-xs font-bold uppercase tracking-wider text-white transition-colors border border-white/20"
          >
            Manage Bookings
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/admin/designs')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-[#DE3C3C] text-xs font-bold uppercase tracking-wider text-white transition-colors border border-white/20"
          >
            Manage Designs
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/admin/messages')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-[#DE3C3C] text-xs font-bold uppercase tracking-wider text-white transition-colors border border-white/20"
          >
            Inquiries ({stats?.unread_messages || 0})
          </button>
        </div>
      </div>

      {/* KPI Financial & Booking Metrics */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Estimated Pipeline Revenue */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C00000]">
                Pipeline Revenue
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#DE3C3C]/10 text-[#C00000] flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-[#C00000]" />
              </div>
            </div>
            <p className="text-2xl font-extrabold font-mono text-[#1A1D20]">
              {formatPKR(stats.estimated_revenue_pkr)}
            </p>
            <p className="text-[11px] text-[#59616D] font-medium">
              Active confirmed & pending event pipeline
            </p>
          </div>

          {/* Actual Collected Payments */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Collected Payments
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold font-mono text-emerald-800">
              {formatPKR(stats.collected_revenue_pkr)}
            </p>
            <p className="text-[11px] text-[#59616D] font-medium">
              Verified bank & cash receipts in hand
            </p>
          </div>

          {/* Pending Action Bookings */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Pending Bookings
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold font-mono text-amber-900">
              {stats.pending_bookings}
            </p>
            <p className="text-[11px] text-[#59616D] font-medium">
              Awaiting crew assignment / payment approval
            </p>
          </div>

          {/* Confirmed / In Progress */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C00000]">
                Confirmed Setups
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#C00000] text-white flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-[#F7B32D]" />
              </div>
            </div>
            <p className="text-2xl font-extrabold font-mono text-[#1A1D20]">
              {stats.confirmed_bookings}
            </p>
            <p className="text-[11px] text-[#59616D] font-medium">
              Scheduled for on-site execution
            </p>
          </div>
        </div>
      )}

      {/* Secondary Metrics Bar */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F8F9FC] text-[#C00000] flex items-center justify-center shadow-xs border border-slate-200">
              <Users className="w-5 h-5 text-[#C00000]" />
            </div>
            <div>
              <p className="text-lg font-bold font-mono text-[#1A1D20]">{stats.total_customers}</p>
              <p className="text-[11px] text-[#59616D] font-semibold uppercase">Customers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F8F9FC] text-[#F7B32D] flex items-center justify-center shadow-xs border border-slate-200">
              <Sparkles className="w-5 h-5 text-[#F7B32D]" />
            </div>
            <div>
              <p className="text-lg font-bold font-mono text-[#1A1D20]">{stats.total_designs}</p>
              <p className="text-[11px] text-[#59616D] font-semibold uppercase">Total Designs</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F8F9FC] text-[#C00000] flex items-center justify-center shadow-xs border border-slate-200">
              <Layers className="w-5 h-5 text-[#DE3C3C]" />
            </div>
            <div>
              <p className="text-lg font-bold font-mono text-[#1A1D20]">{stats.total_events}</p>
              <p className="text-[11px] text-[#59616D] font-semibold uppercase">Event Categories</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F8F9FC] text-[#C00000] flex items-center justify-center shadow-xs border border-slate-200">
              <MessageSquare className="w-5 h-5 text-[#C00000]" />
            </div>
            <div>
              <p className="text-lg font-bold font-mono text-[#1A1D20]">{stats.unread_messages}</p>
              <p className="text-[11px] text-[#59616D] font-semibold uppercase">New Messages</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Bookings Feed */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-serif font-bold text-[#1A1D20]">Recent Event Bookings</h3>
            <p className="text-xs text-[#59616D]">Latest reservations submitted across Pakistan</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/admin/bookings')}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C00000] hover:text-[#DE3C3C]"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {recentBookings.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No bookings recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="pb-3">Reference</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Event & Design</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#F8F9FC]">
                    <td className="py-3 font-mono font-bold text-[#C00000]">
                      {b.booking_reference}
                    </td>
                    <td className="py-3 text-[#59616D]">
                      <span className="font-semibold text-[#1A1D20] block">{b.customer?.full_name || 'Guest'}</span>
                      <span className="text-[11px] text-[#59616D]">{b.customer_phone}</span>
                    </td>
                    <td className="py-3 text-[#59616D]">
                      <span className="font-bold text-[#1A1D20] block">{b.design_name_snapshot}</span>
                      <span className="text-[11px] text-[#C00000]">{b.event_name_snapshot} ({b.city})</span>
                    </td>
                    <td className="py-3 text-[#59616D] whitespace-nowrap">
                      {formatDate(b.event_date)}
                    </td>
                    <td className="py-3 font-mono font-bold text-[#1A1D20]">
                      {formatPKR(b.total_pkr)}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-900">
                        {b.booking_status}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          b.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {b.payment_status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onNavigate('/admin/bookings')}
                        className="px-2.5 py-1 rounded-lg bg-[#F8F9FC] text-[#C00000] hover:bg-[#C00000] hover:text-white font-bold transition-colors border border-slate-200"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
