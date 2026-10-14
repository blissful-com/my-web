import React, { useState, useEffect } from 'react';
import { Mail, Phone, Sparkles } from 'lucide-react';
import type { ContactMessage } from '../../types/database.js';
import { api } from '../../lib/api.js';
import { formatDate } from '../../lib/constants.js';

interface AdminMessagesProps {
  onNavigate: (path: string) => void;
}

export const AdminMessages: React.FC<AdminMessagesProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.getContactMessages();
      setMessages(res.messages);
    } catch (err) {
      console.error('Failed to load contact messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleStatusChange = async (id: string, status: ContactMessage['status']) => {
    try {
      await api.updateContactMessageStatus(id, status);
      await fetchMessages();
    } catch (err: any) {
      alert(err.message || 'Failed to update message status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="bg-gradient-to-r from-[#8F0000] via-[#C00000] to-[#8F0000] rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-white/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white">
            Client Inquiry Inbox
          </h1>
          <p className="text-xs sm:text-sm text-white/85 mt-1">
            Review event inquiries, custom requests, and hall lighting questions submitted by Pakistani visitors.
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
            <p className="text-sm font-semibold text-[#59616D]">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <p className="py-16 text-center text-xs text-slate-400">Inbox empty. No inquiries recorded.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {messages.map((m) => (
              <div key={m.id} className="p-6 space-y-3 hover:bg-[#F8F9FC] transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-[#1A1D20]">{m.name}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        m.status === 'new'
                          ? 'bg-amber-100 text-amber-900'
                          : m.status === 'read'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-emerald-100 text-emerald-900'
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#59616D]">
                    <span>{formatDate(m.created_at)}</span>
                    <select
                      value={m.status}
                      onChange={(e) => handleStatusChange(m.id, e.target.value as ContactMessage['status'])}
                      className="px-2 py-1 rounded-lg border border-slate-200 text-[11px] font-bold uppercase bg-white text-[#1A1D20]"
                    >
                      <option value="new">Mark New</option>
                      <option value="read">Mark Read</option>
                      <option value="resolved">Mark Resolved</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#59616D]">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#C00000]" />
                    <a href={`mailto:${m.email}`} className="underline">{m.email}</a>
                  </div>
                  {m.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#C00000]" />
                      <a href={`tel:${m.phone}`} className="font-semibold underline">{m.phone}</a>
                    </div>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-[#1A1D20] bg-[#F8F9FC] p-3.5 rounded-2xl border border-slate-200 leading-relaxed">
                  {m.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
