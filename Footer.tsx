import React from 'react';
import { Sparkles, Phone, Mail, MapPin, MessageSquare, Shield, Heart } from 'lucide-react';
import { BRAND } from '../lib/constants.js';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#C00000] text-[#F8F9FC] border-t border-[#8F0000]">
      {/* Decorative top lighting ribbon */}
      <div className="h-2 w-full bg-gradient-to-r from-[#8F0000] via-[#F7B32D] to-[#DE3C3C]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#8F0000] border border-[#F7B32D]/60 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#F7B32D]" />
              </div>
              <span className="text-2xl font-serif font-extrabold text-white tracking-wider">
                GLOWORA
              </span>
            </div>

            <p className="text-sm text-white/80 leading-relaxed">
              Pakistan&apos;s premier event lighting decoration service. We craft breathtaking ambient atmospheres for Barat, Mehndi, Waleema, Engagements, Birthdays, and Celebrations.
            </p>

            <div className="pt-2">
              <a
                href={BRAND.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Col 2: Event Categories */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#F7B32D] border-b border-white/20 pb-2">
              Event Categories
            </h4>
            <ul className="space-y-2 text-sm text-white/85">
              {[
                { name: 'Barat Wedding Lights', slug: 'barat' },
                { name: 'Mehndi & Mayun Glow', slug: 'mehndi' },
                { name: 'Waleema Receptions', slug: 'waleema' },
                { name: 'Engagement Backdrops', slug: 'engagement' },
                { name: 'Birthday Light Shows', slug: 'birthday' },
                { name: 'Parties & DJ Rigs', slug: 'parties' },
              ].map((item) => (
                <li key={item.slug}>
                  <button
                    type="button"
                    onClick={() => onNavigate(`/events/${item.slug}`)}
                    className="hover:text-[#F7B32D] hover:translate-x-1 transition-all text-left"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Quick Links & Safety */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#F7B32D] border-b border-white/20 pb-2">
              Client Service
            </h4>
            <ul className="space-y-2 text-sm text-white/85">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/events')}
                  className="hover:text-[#F7B32D] transition-colors"
                >
                  Explore All 6 Categories
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/designs')}
                  className="hover:text-[#F7B32D] transition-colors"
                >
                  Browse 18 Verified Designs
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/account/bookings')}
                  className="hover:text-[#F7B32D] transition-colors"
                >
                  Track Your Booking
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-[#F7B32D] transition-colors"
                >
                  Contact & Inquiries
                </button>
              </li>
            </ul>

            <div className="pt-2 flex items-center gap-2 text-xs text-white/80">
              <Shield className="w-4 h-4 text-[#F7B32D] shrink-0" />
              <span>100% Guaranteed Electrical Safety & Surge Protection</span>
            </div>
          </div>

          {/* Col 4: Contact & Coverage in Pakistan */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#F7B32D] border-b border-white/20 pb-2">
              Direct Contact
            </h4>
            <div className="space-y-3 text-sm text-white/85">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#F7B32D] mt-1 shrink-0" />
                <div>
                  <p className="text-white font-semibold">{BRAND.phone}</p>
                  <p className="text-xs text-white/70">Mon - Sun: 9:00 AM - 11:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#F7B32D] mt-1 shrink-0" />
                <div>
                  <p className="text-white font-semibold">{BRAND.email}</p>
                  <p className="text-xs text-white/70">Official Booking Inquiries</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#F7B32D] mt-1 shrink-0" />
                <div>
                  <p className="text-white font-semibold">{BRAND.address}</p>
                  <p className="text-xs text-white/70">Operating across {BRAND.serviceCoverage}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/75">
          <p>© {new Date().getFullYear()} {BRAND.name} Pakistan. All rights reserved. Built with festive brilliance.</p>
          <div className="flex items-center gap-1 text-white/85">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#F7B32D] fill-[#F7B32D] inline" />
            <span>for Pakistani Celebrations</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
