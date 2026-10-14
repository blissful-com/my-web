import React, { useState } from 'react';
import {
  Sparkles,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../lib/api.js';
import { BRAND } from '../lib/constants.js';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await api.sendContactMessage({
        name,
        email,
        phone,
        message,
      });
      setSuccessMsg(res.message);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to dispatch message. Please call our hotline.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#8F0000] via-[#C00000] to-[#8F0000] rounded-3xl p-8 sm:p-12 text-white shadow-xl border border-white/20">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#F7B32D] text-xs font-bold uppercase tracking-wider border border-[#F7B32D]/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Connect with Glowora</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
            Get in Touch With Our Lighting Directors
          </h1>
          <p className="text-sm sm:text-base text-white/85 leading-relaxed">
            Planning a grand wedding or customized stage lighting setup? Our team in Pakistan is ready to assist you with floor plans, power requirements, and date bookings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Contact Info & WhatsApp */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
            <h2 className="text-xl font-serif font-bold text-[#1A1D20] pb-3 border-b border-slate-100">
              Official Head Office
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-[#59616D]">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#C00000] text-[#F7B32D] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-[#1A1D20]">{BRAND.phone}</p>
                  <p className="text-xs text-[#59616D]">Primary Call Hotline (9 AM - 11 PM)</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#C00000] text-[#F7B32D] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-[#1A1D20]">{BRAND.email}</p>
                  <p className="text-xs text-[#59616D]">General Queries & Quotes</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#C00000] text-[#F7B32D] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-[#1A1D20]">{BRAND.address}</p>
                  <p className="text-xs text-[#59616D]">Serving {BRAND.serviceCoverage}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#C00000] text-[#F7B32D] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-[#1A1D20]">Event Support 24/7</p>
                  <p className="text-xs text-[#59616D]">Live on-site emergency technicians during event nights</p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="pt-4 border-t border-slate-100">
              <a
                href={BRAND.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 shadow-lg transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Instant WhatsApp Inquiry</span>
              </a>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-[#8F0000] to-[#C00000] text-white rounded-3xl border border-white/20 space-y-2">
            <div className="flex items-center gap-2 text-[#F7B32D]">
              <ShieldCheck className="w-5 h-5" />
              <h4 className="text-sm font-bold uppercase tracking-wider">Fast Response Promise</h4>
            </div>
            <p className="text-xs text-white/85 leading-relaxed">
              We respond to all website inquiries within 30 minutes during active daylight hours. For immediate bookings on dates within 48 hours, please reach us directly on WhatsApp.
            </p>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="space-y-1 pb-3 border-b border-slate-100">
            <h2 className="text-xl font-serif font-bold text-[#1A1D20]">Send Us a Message</h2>
            <p className="text-xs text-[#59616D]">Fill in your celebration details for a swift quotation.</p>
          </div>

          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1D20] mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ayesha Siddiqui"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C00000] text-[#1A1D20]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1D20] mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ayesha@gmail.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C00000] text-[#1A1D20]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1D20] mb-1.5">
                Contact Phone / WhatsApp
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0300-8451290"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C00000] text-[#1A1D20]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1D20] mb-1.5">
                Message / Event Details *
              </label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please share event type (Barat/Mehndi/Birthday), approximate date, venue city, and any custom lighting requests..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#C00000] text-[#1A1D20]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-[#C00000] text-[#F7B32D] hover:bg-[#DE3C3C] hover:text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Dispatching Inquiry...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message to Glowora</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
