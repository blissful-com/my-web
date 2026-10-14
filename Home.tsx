import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Calendar,
  Clock,
  CheckCircle2,
  ChevronRight,
  Star,
  HelpCircle,
  PhoneCall,
  Flame,
  Award,
  Layers,
  Check,
} from 'lucide-react';
import type { EventCategory, Design } from '../types/database.js';
import { api } from '../lib/api.js';
import { EventCard } from '../components/EventCard.js';
import { DesignCard } from '../components/DesignCard.js';
import { GridSkeleton } from '../components/LoadingSkeleton.js';
import { BRAND, formatPKR } from '../lib/constants.js';

interface HomeProps {
  onNavigate: (path: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [events, setEvents] = useState<EventCategory[]>([]);
  const [featuredDesigns, setFeaturedDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeHeroIdx, setActiveHeroIdx] = useState<number>(0);

  // High-definition Pakistani cultural event lighting photos for hero showcase
  const heroShowcasePhotos = [
    {
      title: 'Royal Barat Bridal Stage & Chandeliers',
      tag: 'Barat Stage',
      features: 'Crystal Chandeliers • Gold Drape Lights • Royal Sofa Dais',
      url: '/src/assets/images/pakistani_wedding_lights_1791809277119.jpg',
    },
    {
      title: '50ft Illuminated Golden Fairy Light Tunnel',
      tag: 'Baraat Entrance',
      features: 'Cold Spark Fountains • Red Carpet • Fairy Arches',
      url: '/src/assets/images/pakistani_light_tunnel_1791809378044.jpg',
    },
    {
      title: 'Vibrant Mehndi Lawn Fairy Light Canopy & Jhula',
      tag: 'Mehndi Night',
      features: 'Yellow Fairy Canopy • Marigolds • Traditional Jhula',
      url: '/src/assets/images/pakistani_mehndi_decor_1791809329657.jpg',
    },
    {
      title: 'Waleema Ballroom Crystal Chandeliers & Cloud Fog',
      tag: 'Waleema Reception',
      features: 'Cascading Chandeliers • Starry Ceiling • Low-Fog Cloud',
      url: '/src/assets/images/pakistani_waleema_decor_1791809350753.jpg',
    },
  ];

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [eventsRes, designsRes] = await Promise.all([
          api.getEvents(),
          api.getDesigns(),
        ]);
        if (isMounted) {
          setEvents(eventsRes.events);
          const featured = designsRes.designs.filter((d) =>
            ['des-barat-2', 'des-mehndi-2', 'des-bday-2', 'des-wal-2', 'des-eng-3', 'des-party-2'].includes(d.id)
          ).slice(0, 6);
          setFeaturedDesigns(featured.length > 0 ? featured : designsRes.designs.slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Services as concise keywords only
  const serviceKeywords = [
    'Fairy Light Canopies',
    'Crystal Chandeliers',
    'Cold Pyro Sparks',
    'Dry Ice Fog Walk',
    'Custom Neon Signs',
    'Moving Head Beams',
    'Moroccan Lanterns',
    'Vintage Festoon Bulbs',
    'RGBW Wall Washes',
    'Barat Light Tunnel',
    'DMX Stage Controllers',
    'On-Site Electrical Techs',
  ];

  const serviceCategories = [
    {
      category: 'Canopy & Ambient Lighting',
      icon: '✨',
      keywords: [
        'Fairy Light Canopies',
        'Moroccan Lanterns',
        'Festoon Warm Bulbs',
        'Starry Ceiling Drapes',
        'Tree Fairy Wrapping',
        'Golden Amber Washes',
      ],
    },
    {
      category: 'Stage & Chandeliers',
      icon: '💎',
      keywords: [
        'Crystal Chandeliers',
        'RGBW Backdrop Washes',
        'Moving Head Spot Beams',
        'Stage Truss Lighting',
        'Follow Spotlight',
        'Laser Show Accents',
      ],
    },
    {
      category: 'Special Effects (SFX)',
      icon: '🔥',
      keywords: [
        'Cold Pyro Sparks (Indoor Safe)',
        'Cryo Dry Ice Clouds',
        'Heavy Fog Entryways',
        'Customized Neon Signs',
        'Bubble Smoke Effects',
        'Cold Spark Fountains',
      ],
    },
    {
      category: 'Entrance & Walkways',
      icon: '🏛️',
      keywords: [
        '50ft Barat Light Tunnel',
        'VIP Red Carpet Washes',
        'Pillar Floral Spotlights',
        'Pathway Lantern Arrays',
        'Archway Fairy Twinkle',
        'Welcome Gate Floodlights',
      ],
    },
    {
      category: 'Power & Safety Infrastructure',
      icon: '⚡',
      keywords: [
        'Heavy-Duty Surge Protectors',
        'Fireproof Rubber Cables',
        'Cable Ramp Protectors',
        'Industrial Distribution Boxes',
        'Voltage Stabilizers',
        'Backup Switchgear',
      ],
    },
    {
      category: 'Execution & Operations',
      icon: '🛠️',
      keywords: [
        'On-Site Master Electrician',
        '4-Hour Early Setup',
        'Live DMX Cue Operations',
        'Pre-Event Lux & Audio Check',
        'Punctual Strike-Down',
        'Pakistan-Wide Coverage',
      ],
    },
  ];

  const faqs = [
    {
      q: 'How far in advance should I book my event lighting in Pakistan?',
      a: 'Advance booking of 2 to 4 weeks is advised for wedding season; 3 to 7 days for intimate events.',
    },
    {
      q: 'Do you handle power safety and voltage fluctuations?',
      a: 'Yes. Industrial boards, surge protectors, and safety breakers are included with all setups.',
    },
    {
      q: 'Can you customize the lighting colors to match my theme?',
      a: 'Yes. RGBW washes allow exact shade matching to floral decor and wedding themes.',
    },
    {
      q: 'Are cold spark fountains safe for indoor halls?',
      a: '100% smokeless, cool-touch, and approved for indoor banquets and wooden stages.',
    },
    {
      q: 'Which cities in Pakistan does Glowora operate in?',
      a: 'Lahore, Islamabad, Rawalpindi, Karachi, Faisalabad, Multan, and surrounding areas.',
    },
  ];

  return (
    <div className="relative min-h-screen text-[#1A1D20] overflow-hidden">
      {/* 
        ========================================================================
        HOMEPAGE BACKGROUND: BEAUTIFUL PAKISTANI FAIRY LIGHT CANOPY PICTURE
        ========================================================================
      */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <img
          src="/src/assets/images/pakistani_canopy_lawn_1791809702293.jpg"
          alt="Pakistani outdoor wedding lawn lighting decoration background"
          className="w-full h-full object-cover object-center opacity-15 filter contrast-110 saturate-125"
        />
        {/* Soft elegant tint overlay with brand colors */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F8F9FC]/85 via-[#F8F9FC]/92 to-[#F8F9FC]/98" />
      </div>

      <div className="relative z-10 space-y-12 sm:space-y-16 pb-14">
        {/* 
          ------------------------------------------------------------------------
          1. HERO SECTION: SPLIT 2-COLUMN LAYOUT
          - Left: Text & CTA (Paragraph removed as requested)
          - Right: HD Pakistani lighting decoration picture covering half area
          ------------------------------------------------------------------------
        */}
        <section className="relative overflow-hidden text-white pt-6 pb-10 lg:py-12 shadow-xl bg-gradient-to-br from-[#720000] via-[#8F0000] to-[#5C0000] border-b border-[#F7B32D]/30">
          {/* Subtle festive ambient golden glow in backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(247,179,45,0.2)_0%,transparent_60%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.35)_0%,transparent_70%)] pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              
              {/* LEFT SIDE: Heading, Keywords, CTAs, Stats (luxuryevent paragraph removed) */}
              <div className="lg:col-span-6 space-y-4 text-left">
                {/* Small Refined Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-[#F7B32D]/60 text-[#F7B32D] text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-md">
                  <Sparkles className="w-3.5 h-3.5 animate-glow text-[#F7B32D]" />
                  <span>Pakistan Event Lighting & Decor</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-extrabold text-white tracking-tight leading-snug drop-shadow-md">
                  Turn Every Celebration Into a{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F7B32D] via-amber-200 to-[#F7B32D]">
                    Magical Experience.
                  </span>
                </h1>

                {/* NOTE: Paragraph completely removed as requested */}

                {/* Services: Keywords Only Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {['Fairy Canopies', 'Crystal Chandeliers', 'Cold Sparks', 'Dry Ice', 'Neon Signs', 'Moving Heads', 'Light Tunnels'].map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-full bg-black/35 backdrop-blur-sm border border-white/20 text-[10px] font-semibold text-[#F7B32D]"
                    >
                      ✦ {kw}
                    </span>
                  ))}
                </div>

                {/* Compact CTA Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigate('/events')}
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#F7B32D] text-[#8F0000] font-bold text-[11px] uppercase tracking-wider hover:bg-white shadow-lg hover:shadow-[#F7B32D]/40 transition-all hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span>Explore Events</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('/designs')}
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#DE3C3C] text-white hover:bg-[#8F0000] border border-[#F7B32D]/40 font-bold text-[11px] uppercase tracking-wider shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#F7B32D]" />
                    <span>Book Decoration</span>
                  </button>
                </div>

                {/* Compact Stats */}
                <div className="pt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-white/20">
                  <div>
                    <p className="text-lg sm:text-xl font-extrabold text-[#F7B32D] font-mono">18+</p>
                    <p className="text-[9px] text-white/80 uppercase font-semibold mt-0.5">Verified Designs</p>
                  </div>
                  <div>
                    <p className="text-lg sm:text-xl font-extrabold text-[#F7B32D] font-mono">6</p>
                    <p className="text-[9px] text-white/80 uppercase font-semibold mt-0.5">Event Categories</p>
                  </div>
                  <div>
                    <p className="text-lg sm:text-xl font-extrabold text-[#F7B32D] font-mono">100%</p>
                    <p className="text-[9px] text-white/80 uppercase font-semibold mt-0.5">Safety Certified</p>
                  </div>
                  <div>
                    <p className="text-lg sm:text-xl font-extrabold text-[#F7B32D] font-mono">PKR</p>
                    <p className="text-[9px] text-white/80 uppercase font-semibold mt-0.5">Transparent Rates</p>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: HD Picture covering half area (Front & Center) */}
              <div className="lg:col-span-6 space-y-3">
                {/* Main HD Featured Picture */}
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[#F7B32D]/70 shadow-2xl shadow-black/60 group bg-black/40">
                  <div className="aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden">
                    <img
                      src={(heroShowcasePhotos[activeHeroIdx] || heroShowcasePhotos[0])?.url}
                      alt={(heroShowcasePhotos[activeHeroIdx] || heroShowcasePhotos[0])?.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-100 contrast-105"
                    />
                  </div>

                  {/* Subtle lighting vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />

                  {/* Top Floating Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <div className="bg-[#8F0000]/95 backdrop-blur-md px-3 py-1 rounded-full border border-[#F7B32D]/70 text-[#F7B32D] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                      <Sparkles className="w-3 h-3 text-[#F7B32D]" />
                      <span>{(heroShowcasePhotos[activeHeroIdx] || heroShowcasePhotos[0])?.tag}</span>
                    </div>

                    <div className="bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/25 text-white text-[9px] font-bold tracking-wide">
                      HD Cultural Decor
                    </div>
                  </div>

                  {/* Bottom Details Overlay on HD Picture */}
                  <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-4 text-left">
                    <h3 className="text-sm sm:text-base font-serif font-bold text-white drop-shadow-md">
                      {(heroShowcasePhotos[activeHeroIdx] || heroShowcasePhotos[0])?.title}
                    </h3>
                    <p className="text-[10px] text-[#F7B32D] font-medium flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-[#F7B32D]" />
                      <span>{(heroShowcasePhotos[activeHeroIdx] || heroShowcasePhotos[0])?.features}</span>
                    </p>
                  </div>
                </div>

                {/* Interactive HD Photo Selector (4 Pakistani Lighting Setups) */}
                <div className="grid grid-cols-4 gap-2">
                  {heroShowcasePhotos.map((photo, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveHeroIdx(i)}
                      className={`relative rounded-xl overflow-hidden aspect-[4/3] border transition-all cursor-pointer ${
                        activeHeroIdx === i
                          ? 'border-[#F7B32D] ring-2 ring-[#F7B32D]/80 scale-102 shadow-md'
                          : 'border-white/20 opacity-70 hover:opacity-100 hover:border-white/50'
                      }`}
                    >
                      <img
                        src={photo.url}
                        alt={photo.tag}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] sm:text-[9px] text-white font-semibold py-0.5 text-center truncate px-1">
                        {photo.tag}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 
          ------------------------------------------------------------------------
          2. SERVICES TICKER: STRICTLY KEYWORDS ONLY
          ------------------------------------------------------------------------
        */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-md p-3.5 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#C00000] animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C00000]">
                Services Keywords:
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 justify-center md:justify-start">
              {serviceKeywords.map((service, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 rounded-lg bg-[#F8F9FC] border border-slate-200 text-[#1A1D20] text-[10px] font-semibold hover:border-[#C00000] hover:text-[#C00000] transition-colors"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 
          ------------------------------------------------------------------------
          3. SIX EVENT CATEGORIES: COMPACT TYPOGRAPHY
          ------------------------------------------------------------------------
        */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-2">
            <div>
              <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#C00000] mb-0.5">
                <Sparkles className="w-3 h-3 text-[#F7B32D]" />
                <span>Event Categories</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1D20]">
                Choose Your Celebration
              </h2>
              <p className="text-[11px] text-[#59616D] mt-0.5 max-w-lg">
                Six signature event categories with starting prices and tailored tiers.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('/events')}
              className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#C00000] hover:text-[#DE3C3C] transition-colors"
            >
              <span>View All Categories</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <GridSkeleton count={6} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map((evt) => (
                <EventCard
                  key={evt.id}
                  event={evt}
                  onSelect={() => onNavigate(`/events/${evt.slug}`)}
                />
              ))}
            </div>
          )}
        </section>

        {/* 
          ------------------------------------------------------------------------
          4. FEATURED DESIGNS SHOWCASE (COMPACT FONTS & HD CARDS)
          ------------------------------------------------------------------------
        */}
        <section className="bg-white/90 backdrop-blur-sm py-10 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-2">
              <div>
                <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#C00000] mb-0.5">
                  <Star className="w-3 h-3 text-[#F7B32D] fill-[#F7B32D]" />
                  <span>Featured Setups</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1D20]">
                  Popular Decoration Packages
                </h2>
                <p className="text-[11px] text-[#59616D] mt-0.5 max-w-lg">
                  Curated Classic, Premium, and Luxury packages for weddings and celebrations.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('/designs')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#C00000] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#DE3C3C] transition-colors shadow-sm"
              >
                <span>Explore All 18 Designs</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {loading ? (
              <GridSkeleton count={3} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {featuredDesigns.map((design) => (
                  <DesignCard
                    key={design.id}
                    design={design}
                    onBook={(d) => onNavigate(`/booking/${d.id}`)}
                    onViewDetails={(d) => onNavigate(`/designs/${d.id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 
          ------------------------------------------------------------------------
          5. SERVICES & BOOKING STEPS: STRICTLY KEYWORDS ONLY
          ------------------------------------------------------------------------
        */}
        <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C00000]">
              How It Works
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1D20]">
              3-Step Booking Process
            </h2>
            <p className="text-[11px] text-[#59616D]">
              Transparent reservation in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Step 1: Keywords Only */}
            <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <div className="w-8 h-8 rounded-lg bg-[#C00000] text-[#F7B32D] flex items-center justify-center font-bold text-xs mb-3 border border-[#F7B32D]/40">
                  01
                </div>
                <h3 className="text-sm font-bold font-serif text-[#1A1D20] mb-2">
                  Select Event & Design
                </h3>
                {/* STRICTLY KEYWORDS ONLY */}
                <div className="flex flex-wrap gap-1">
                  {['6 Categories', 'Classic Tier', 'Premium Tier', 'Luxury Tier', 'Transparent PKR', 'Fixed Pricing'].map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-[#F8F9FC] text-[10px] font-medium text-[#1A1D20] border border-slate-200">
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[10px] font-semibold text-[#C00000]">
                Instant server calculation
              </div>
            </div>

            {/* Step 2: Keywords Only */}
            <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <div className="w-8 h-8 rounded-lg bg-[#DE3C3C] text-white flex items-center justify-center font-bold text-xs mb-3">
                  02
                </div>
                <h3 className="text-sm font-bold font-serif text-[#1A1D20] mb-2">
                  Venue & Add-Ons
                </h3>
                {/* STRICTLY KEYWORDS ONLY */}
                <div className="flex flex-wrap gap-1">
                  {['Date & Time', 'Pakistani Cities', 'Full Address', 'Cold Sparks', 'Dry Ice Fog', 'Neon Signs', 'Tunnel Entrance'].map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-[#F8F9FC] text-[10px] font-medium text-[#1A1D20] border border-slate-200">
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[10px] font-semibold text-[#C00000]">
                Custom package options
              </div>
            </div>

            {/* Step 3: Keywords Only */}
            <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <div className="w-8 h-8 rounded-lg bg-[#C00000] text-[#F7B32D] flex items-center justify-center font-bold text-xs mb-3 border border-[#F7B32D]/40">
                  03
                </div>
                <h3 className="text-sm font-bold font-serif text-[#1A1D20] mb-2">
                  Setup & Illuminate
                </h3>
                {/* STRICTLY KEYWORDS ONLY */}
                <div className="flex flex-wrap gap-1">
                  {['4-Hour Early Setup', 'Concealed Wiring', 'Safety Tested', 'On-Site Master Tech', 'Live Event Support', 'Post-Event Strike'].map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-[#F8F9FC] text-[10px] font-medium text-[#1A1D20] border border-slate-200">
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[10px] font-semibold text-[#C00000]">
                Certified technicians
              </div>
            </div>
          </div>
        </section>

        {/* 
          ------------------------------------------------------------------------
          6. SERVICES SECTION: STRICTLY KEYWORDS ONLY & PAKISTANI DECORATION VISUALS
          ------------------------------------------------------------------------
        */}
        <section className="bg-gradient-to-br from-[#8F0000] via-[#C00000] to-[#8F0000] text-white py-12 border-y border-[#8F0000] shadow-inner relative overflow-hidden">
          {/* Subtle decoration light bokeh background in services section */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <img
              src="/src/assets/images/pakistani_canopy_lawn_1791809702293.jpg"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-[#F7B32D] text-[10px] font-bold uppercase tracking-wider border border-[#F7B32D]/30">
                  <Award className="w-3 h-3" />
                  <span>Our Services</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  Decoration & Lighting Services (Keywords)
                </h2>
                
                {/* All Services Listed as Pure Keywords Organized by Categories */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {serviceCategories.map((group, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-black/25 border border-white/15 backdrop-blur-xs space-y-2"
                    >
                      <div className="flex items-center gap-1.5 border-b border-white/10 pb-1.5">
                        <span className="text-xs">{group.icon}</span>
                        <h4 className="text-[11px] font-bold text-[#F7B32D] uppercase tracking-wide">
                          {group.category}
                        </h4>
                      </div>

                      {/* Pure Keywords Only */}
                      <div className="flex flex-wrap gap-1">
                        {group.keywords.map((kw, kIdx) => (
                          <span
                            key={kIdx}
                            className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] sm:text-[10px] text-white/95 font-medium border border-white/10 hover:bg-[#F7B32D] hover:text-[#8F0000] transition-colors"
                          >
                            • {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* HD Pakistani Event Decoration Pictures Mosaic */}
              <div className="lg:col-span-5 relative">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-2.5">
                    <div className="rounded-xl overflow-hidden aspect-[4/3] border border-[#F7B32D]/50 shadow-lg">
                      <img
                        src="/src/assets/images/pakistani_barat_stage_1791809647242.jpg"
                        alt="Royal Barat stage crystal chandelier lighting"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-xl overflow-hidden aspect-square border border-[#F7B32D]/50 shadow-lg">
                      <img
                        src="/src/assets/images/pakistani_mehndi_decor_1791809329657.jpg"
                        alt="Mehndi fairy canopy decor"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-5">
                    <div className="rounded-xl overflow-hidden aspect-square border border-[#F7B32D]/50 shadow-lg">
                      <img
                        src="/src/assets/images/pakistani_waleema_decor_1791809350753.jpg"
                        alt="Waleema ambient reception glow"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-xl overflow-hidden aspect-[4/3] border border-[#F7B32D]/50 shadow-lg">
                      <img
                        src="/src/assets/images/pakistani_house_lights_1791809521738.jpg"
                        alt="Pakistani Shaadi house exterior fairy lights lariyan"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Decorative Glow Badge */}
                <div className="absolute -bottom-3 -left-3 bg-[#C00000] border border-[#F7B32D] p-2 rounded-xl shadow-xl flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#F7B32D]" />
                  <div>
                    <p className="text-[10px] font-bold text-white uppercase">Cold Sparks</p>
                    <p className="text-[8px] text-white/80">Indoor Safe</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 
          ------------------------------------------------------------------------
          7. CUSTOMER TESTIMONIALS (COMPACT FONTS & KEYWORDS)
          ------------------------------------------------------------------------
        */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-6 space-y-1">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#DE3C3C]/15 text-[#C00000] text-[10px] font-bold uppercase tracking-wider">
              <Star className="w-3 h-3 text-[#F7B32D] fill-[#F7B32D]" />
              <span>Customer Feedback</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1D20]">
              Celebration Reviews
            </h2>
            <p className="text-[10px] text-[#59616D] italic">
              * Sample customer reviews from Pakistani weddings & events.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: 'Zainab & Bilal Tariq',
                event: 'Barat Wedding — DHA Lahore',
                text: 'The 50ft fairy light tunnel gave all guests an unforgettable entry. Flawless champagne stage lighting.',
                keywords: ['50ft Light Tunnel', 'Champagne Tone', 'Punctual Setup'],
              },
              {
                name: 'Dr. Usman Qureshi',
                event: 'Mehndi Night — Islamabad',
                text: 'Moroccan lanterns and tree fairy wrapping transformed our lawn. Technician was on standby throughout.',
                keywords: ['Tree Fairy Wrap', 'Moroccan Lanterns', 'Standby Tech'],
              },
              {
                name: 'Mahnoor Shah',
                event: 'Birthday Wonderland — Karachi',
                text: 'Neon marquee numbers and cold sparks made the cake moment magical. Transparent PKR rates.',
                keywords: ['Neon Marquee', 'Cold Pyro Sparks', 'Fair Rates'],
              },
            ].map((rev, idx) => (
              <div
                key={idx}
                className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-2.5"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-[#F7B32D] fill-[#F7B32D]" />
                    ))}
                  </div>
                  <p className="text-[11px] text-[#59616D] leading-relaxed italic">
                    &ldquo;{rev.text}&rdquo;
                  </p>
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {rev.keywords.map((kw, i) => (
                      <span key={i} className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-[#F8F9FC] text-[#C00000] border border-slate-200">
                        ✦ {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <h4 className="text-[11px] font-bold text-[#1A1D20]">{rev.name}</h4>
                  <p className="text-[10px] text-[#C00000] font-medium">{rev.event}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 
          ------------------------------------------------------------------------
          8. FAQS (COMPACT FONTS)
          ------------------------------------------------------------------------
        */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-5 space-y-1">
            <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#C00000]">
              <HelpCircle className="w-3 h-3 text-[#F7B32D]" />
              <span>Answers</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1D20]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200 overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-3 sm:p-3.5 flex items-center justify-between gap-3 font-bold text-[#1A1D20] text-xs sm:text-[13px] hover:text-[#C00000]"
                >
                  <span>{faq.q}</span>
                  <ChevronRight
                    className={`w-3.5 h-3.5 text-[#C00000] transition-transform duration-200 shrink-0 ${
                      openFaq === idx ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-3.5 pb-3.5 text-[11px] text-[#59616D] leading-relaxed border-t border-slate-100 pt-2">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 
          ------------------------------------------------------------------------
          9. CONTACT BANNER (COMPACT FONTS & KEYWORDS)
          ------------------------------------------------------------------------
        */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#8F0000] via-[#C00000] to-[#8F0000] rounded-2xl p-6 sm:p-8 text-center text-white relative overflow-hidden shadow-xl border border-[#F7B32D]/40">
            <div className="relative z-10 max-w-xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#8F0000]/80 text-[#F7B32D] text-[10px] font-bold uppercase tracking-wider border border-[#F7B32D]/40">
                <Sparkles className="w-3 h-3" />
                <span>Let&apos;s Design Your Dream Event</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                Ready to Light Up Your Special Night?
              </h2>

              {/* City keywords */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] text-white/90">
                <span>Lahore</span> • <span>Karachi</span> • <span>Islamabad</span> • <span>Faisalabad</span> • <span>Multan</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate('/events')}
                  className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#F7B32D] text-[#8F0000] font-bold text-[11px] uppercase tracking-wider hover:bg-white shadow-md transition-all cursor-pointer"
                >
                  Browse All Events
                </button>

                <a
                  href={`tel:${BRAND.phone}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] uppercase tracking-wider border border-white/25 transition-all"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#F7B32D]" />
                  <span>Call {BRAND.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
