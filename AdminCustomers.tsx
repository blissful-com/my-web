import React, { useState, useEffect } from 'react';
import { Users, Phone, Mail, Calendar, MessageSquare, Sparkles } from 'lucide-react';
import type { Profile } from '../../types/database.js';
import { api } from '../../lib/api.js';
import { formatDate } from '../../lib/constants.js';

interface AdminCustomersProps {
  onNavigate: (path: string) => void;
}

export const AdminCustomers: React.FC<AdminCustomersProps> = ({ onNavigate }) => {
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadCustomers() {
      try {
        const res = await api.getAdminCustomers();
        if (isMounted) setCustomers(res.customers);
      } catch (err) {
        console.error('Failed to load customers:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadCustomers();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="bg-gradient-to-r from-[#8F0000] via-[#C00000] to-[#8F0000] rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-white/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white">
            Customer Directory
          </h1>
          <p className="text-xs sm:text-sm text-white/85 mt-1">
            Authorized view of verified client accounts registered on Glowora.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('/admin')}
          className="px-4 py-2 rounded-xl bg-white/10 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/20 border border-white/20 transition-colors"
        >
          Overview
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <Sparkles className="w-8 h-8 text-[#C00000] animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-[#59616D]">Loading customers...</p>
          </div>
        ) : customers.length === 0 ? (
          <p className="py-16 text-center text-xs text-slate-400">No registered customers found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9FC] border-b border-slate-200 text-[#1A1D20] uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-4 px-5">Customer Name</th>
                  <th className="py-4 px-4">Contact Phone</th>
                  <th className="py-4 px-4">Email Address</th>
                  <th className="py-4 px-4">Registration Date</th>
                  <th className="py-4 px-5 text-right">Quick WhatsApp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F8F9FC] transition-colors">
                    <td className="py-4 px-5">
                      <p className="font-bold text-[#1A1D20] text-sm">{c.full_name}</p>
                      <span className="text-[10px] text-[#C00000] font-mono">{c.id}</span>
                    </td>
                    <td className="py-4 px-4 text-[#59616D] font-medium">
                      {c.phone || 'N/A'}
                    </td>
                    <td className="py-4 px-4 text-[#59616D]">
                      {c.email}
                    </td>
                    <td className="py-4 px-4 text-slate-400 whitespace-nowrap">
                      {formatDate(c.created_at)}
                    </td>
                    <td className="py-4 px-5 text-right">
                      {c.phone ? (
                        <a
                          href={`https://wa.me/92${c.phone.replace(/[^0-9]/g, '').replace(/^0/, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] text-white font-bold hover:opacity-90 transition-opacity"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
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
