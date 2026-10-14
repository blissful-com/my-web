import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import type {
  EventCategory,
  Design,
  AddOn,
  Booking,
  BookingAddOnItem,
  ContactMessage,
  Profile,
  AdminStats,
} from '../src/types/database.js';

interface UserRecord extends Profile {
  password_hash: string;
}

interface DatabaseSchema {
  users: UserRecord[];
  events: EventCategory[];
  designs: Design[];
  add_ons: AddOn[];
  bookings: Booking[];
  contact_messages: ContactMessage[];
}

const DATA_DIR = path.resolve(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial high-definition, verified event lighting photography
const INITIAL_EVENTS: EventCategory[] = [
  {
    id: 'evt-birthday',
    name: 'Birthday',
    slug: 'birthday',
    description: 'Vibrant fairy-light canopies, glowing neon signs, balloon glow arches, and warm mood lighting for unforgettable birthdays.',
    image_url: '/src/assets/images/pakistani_bday_lights_1791809408074.jpg',
    is_active: true,
    starting_price_pkr: 22000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'evt-mehndi',
    name: 'Mehndi',
    slug: 'mehndi',
    description: 'Festive marigold-warm lighting, royal dholak stage halos, hanging Moroccan lanterns, and colorful dancefloor washes.',
    image_url: '/src/assets/images/pakistani_mehndi_decor_1791809329657.jpg',
    is_active: true,
    starting_price_pkr: 25000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'evt-engagement',
    name: 'Engagement',
    slug: 'engagement',
    description: 'Romantic starry curtain backdrops, delicate warm fairy strings, crystal statement luminaires, and intimate stage glows.',
    image_url: '/src/assets/images/pakistani_engagement_lights_1791809440535.jpg',
    is_active: true,
    starting_price_pkr: 24000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'evt-parties',
    name: 'Parties',
    slug: 'parties',
    description: 'Electrifying neon light sculptures, dynamic sound-reactive LED beams, club-grade uplighters, and rooftop glow ambiences.',
    image_url: '/src/assets/images/pakistani_party_lights_1791809478064.jpg',
    is_active: true,
    starting_price_pkr: 18000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'evt-barat',
    name: 'Barat',
    slug: 'barat',
    description: 'Grand royal wedding entrances, grand bridal stage chandeliers, majestic pathway floodlights, and golden palace glow.',
    image_url: '/src/assets/images/pakistani_wedding_lights_1791809277119.jpg',
    is_active: true,
    starting_price_pkr: 28000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'evt-waleema',
    name: 'Waleema',
    slug: 'waleema',
    description: 'Sophisticated champagne & ivory illumination, crystal hanging chandeliers, soft banquet warm washes, and elegant VIP ambiance.',
    image_url: '/src/assets/images/pakistani_waleema_decor_1791809350753.jpg',
    is_active: true,
    starting_price_pkr: 26000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// 18 Initial Designs — 3 distinct designs for each event category
const INITIAL_DESIGNS: Design[] = [
  // --- 1. BIRTHDAY (3 Designs) ---
  {
    id: 'des-bday-1',
    event_id: 'evt-birthday',
    name: 'Birthday Spark',
    slug: 'birthday-spark',
    tier: 'Classic',
    price_pkr: 22000,
    description: 'Charming warm fairy-light backdrop with balloon garland accent illumination and glowing centerpiece spots.',
    full_description: 'Perfect for cozy home living rooms, garden setups, and cafe celebrations. Birthday Spark delivers a delightful warm-white fairy-light curtain (10x8 ft), dual focus uplights for the cake cutting table, and LED micro-string fairy lights wound around balloon clusters.',
    image_url: '/src/assets/images/pakistani_bday_lights_1791809408074.jpg',
    included_services: [
      '10x8 ft Dense Fairy Light Curtain',
      'Dual Warm LED Spotlights for Cake Table',
      'LED Glow Base Under Cake Table',
      'On-site Wiring & Concealed Safety Cable Management',
      'Professional Setup & Dismantling',
    ],
    lighting_equipment: [
      'Warm White 3000K Fairy Net',
      '2x 30W Warm LED Cake Floods',
      'Stabilized Surge Protector Extension System',
    ],
    setup_time: '2 - 3 Hours',
    venue_type: 'Home, Apartment Rooftop, Private Lounge',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'des-bday-2',
    event_id: 'evt-birthday',
    name: 'Birthday Elegance',
    slug: 'birthday-elegance',
    tier: 'Premium',
    price_pkr: 42000,
    description: 'Custom glowing neon birthday sign, dual circular truss halo lighting, and ambient perimeter uplighting.',
    full_description: 'Take your birthday memories to the next tier with our custom neon signage ("Happy Birthday" or custom age), paired with dual golden circular truss ring illuminators, four architectural perimeter uplights, and warm cascading ceiling fairy strands.',
    image_url: '/src/assets/images/pakistani_bday_lights_1791809408074.jpg',
    included_services: [
      'Custom Script Neon LED Signboard',
      'Dual Circular Ring Glow Truss Frame',
      '4x Smart RGBW Architectural Uplights',
      'Ceiling Fairy Droplets / Curtain Grid',
      'Dedicated Lighting Standby Tech for 4 Hours',
    ],
    lighting_equipment: [
      'Custom Neon Flex Signage',
      '4x 54W RGBW LED Par Cans',
      'Circular Metal Truss with Warm Fairy Wrapping',
      'Heavy-duty Master Power Distribution Board',
    ],
    setup_time: '3 - 4 Hours',
    venue_type: 'Banquet Hall, Rooftop, Farmhouse Lawn',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'des-bday-3',
    event_id: 'evt-birthday',
    name: 'Birthday Wonderland',
    slug: 'birthday-wonderland',
    tier: 'Luxury',
    price_pkr: 78000,
    description: 'Immersive ceiling fairy light canopy, illuminated tunnel entrance, 3D neon marquee numbers, and synchronized mood fades.',
    full_description: 'The ultimate VIP birthday spectacle. Transforms any garden, farmhouse, or banquet hall into an enchanted wonderland featuring a complete 40-foot illuminated fairy light ceiling canopy, illuminated entrance tunnel, 4-foot giant light-up marquee numbers, 8 ambient color-wash par cans, and cold spark machine integration for the cake cutting moment.',
    image_url: '/src/assets/images/pakistani_neon_party_1791809757832.jpg',
    included_services: [
      'Complete Starry Ceiling Light Canopy (up to 40x25 ft)',
      'Illuminated Fairy Light Walkway / Tunnel Entrance',
      '4-Foot Tall Light-Bulb Marquee Numbers or Initials',
      '8x Wireless DMX Uplights with Automated Scene Transitions',
      'Cold Spark Pyro Controller Setup for Cake Moment',
      'Full-time Lead Lighting Engineer Throughout Event',
    ],
    lighting_equipment: [
      'Over 2,500 High-Lumen Warm LED Bulbs',
      '4-Foot Vintage Edison Bulb Marquee Letters',
      '8x DMX RGBW Battery Wash Fixtures',
      'Commercial Rigging & Truss Support Structure',
    ],
    setup_time: '5 - 6 Hours',
    venue_type: 'Luxury Farmhouse, Grand Lawn, Hotel Ballroom',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // --- 2. MEHNDI (3 Designs) ---
  {
    id: 'des-mehndi-1',
    event_id: 'evt-mehndi',
    name: 'Mehndi Glow',
    slug: 'mehndi-glow',
    tier: 'Classic',
    price_pkr: 25000,
    description: 'Festive marigold-warm fairy curtain, stage backdrop illumination, and warm dholak seating corner lights.',
    full_description: 'An authentic festive lighting setup designed for traditional Mehndi nights. Features amber and warm-white fairy lights interwoven through marigold floral structures, 2 warm stage fill spotlights, and charming floor uplighting around the bridal jhoola (swing) or sofa.',
    image_url: '/src/assets/images/pakistani_canopy_lawn_1791809702293.jpg',
    included_services: [
      'Warm Amber & Golden Fairy Curtain Backdrop (12x10 ft)',
      'Bridal Jhoola / Sofa Accent Glow Fixtures',
      '2x Focused Warm Halogen-Tone LED Stage Floods',
      'Floor Ambient Pathway Lighting',
      'Complete Installation & Cable Concealment',
    ],
    lighting_equipment: [
      '2400K Warm Golden Festive String Nets',
      '2x Adjustable Warm White LED Flood Cans',
      'Industrial Grade Extension Boards with Safety Cutoff',
    ],
    setup_time: '2.5 - 3.5 Hours',
    venue_type: 'Home Lawn, Courtyard, Community Hall',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'des-mehndi-2',
    event_id: 'evt-mehndi',
    name: 'Royal Mehndi Lights',
    slug: 'royal-mehndi-lights',
    tier: 'Premium',
    price_pkr: 48000,
    description: 'Suspended vintage Moroccan lanterns, dancefloor dynamic wash uplights, and lush golden tree wrapping.',
    full_description: 'Infuse your Mehndi night with royal Mughal grandeur. Features a cluster of 12 intricately crafted Moroccan filigree lanterns hanging from overhead frames, tree fairy wrapping (up to 2 garden trees), 6 high-output dancefloor wash par cans that cycle through celebratory colors, and stage halo framing.',
    image_url: '/src/assets/images/pakistani_mehndi_decor_1791809329657.jpg',
    included_services: [
      '12x Suspended Ornate Moroccan Brass/Black Lanterns',
      'Tree Fairy Wrapping with Heavy-Duty Micro Drops',
      '6x High-Power Dancefloor Color-Wash LED Units',
      'Dedicated Stage Framing Uplight Bars',
      'On-site Lighting Operator for Dance Performances',
    ],
    lighting_equipment: [
      'Handcrafted Filigree Lanterns with Edison Filament Bulbs',
      '6x 60W Quad-Color RGBW Par Cans',
      'Outdoor Weatherproof Heavy Gauge Cables',
    ],
    setup_time: '4 - 5 Hours',
    venue_type: 'Marquee, Farmhouse Garden, Banquet Lawn',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'des-mehndi-3',
    event_id: 'evt-mehndi',
    name: 'Mehndi Night Royale',
    slug: 'mehndi-night-royale',
    tier: 'Luxury',
    price_pkr: 88000,
    description: 'Grand overhead fairy light canopy across entire lawn, illuminated dancefloor truss, moving head beam lights, and pyro sparks.',
    full_description: 'The pinnacle of Pakistani wedding Mehndi celebrations. We build a sprawling 60x40 ft starry fairy sky across your venue, an engineered overhead aluminum lighting truss above the dance floor equipped with 4 intelligent moving heads, stage chandelier drops, and 4 wireless cold spark machines for the bride & groom entrance.',
    image_url: '/src/assets/images/pakistani_dholak_decor_1791809593525.jpg',
    included_services: [
      'Full Garden / Marquee Starry Sky Fairy Light Ceiling (up to 60x40 ft)',
      'Engineered Dancefloor Overhead Lighting Truss Structure',
      '4x DMX Computer-Controlled Intelligent Moving Head Beams',
      '8x Moroccan Lantern Clusters & Vintage Hanging Filament Accents',
      '4x Wireless Cold Spark Pyrotechnic Machines for Grand Entrance',
      'Lead Lighting Director & Console Programmer on Site All Night',
    ],
    lighting_equipment: [
      '3,500+ Weatherproof Heavy-Duty Outdoor Fairy Bulbs',
      '4x 100W LED Moving Head Spot / Beam Fixtures',
      'F34 Aluminum Global Box Truss Rigging',
      'DMX 512 Lighting Console Controller',
    ],
    setup_time: '6 - 7 Hours',
    venue_type: 'Grand Farmhouse, Luxury Marquee, Hotel Lawn',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // --- 3. ENGAGEMENT (3 Designs) ---
  {
    id: 'des-eng-1',
    event_id: 'evt-engagement',
    name: 'Forever Glow',
    slug: 'forever-glow',
    tier: 'Classic',
    price_pkr: 24000,
    description: 'Romantic dual-arch warm fairy backdrop, ring-ceremony highlight beam, and candle-glow floor lanterns.',
    full_description: 'Celebrate the promise of forever in an intimate, dreamy atmosphere. Features dual circular or geometric arch framing illuminated with continuous warm-white fairy micro-filaments, gentle ring-exchange spotlighting, and 8 rustic wooden floor lanterns with safe flickering LED candles.',
    image_url: '/src/assets/images/pakistani_engagement_lights_1791809440535.jpg',
    included_services: [
      'Illuminated Dual Geometric Stage Arch Backdrop',
      '8x Rustic Floor Glass & Timber Candle Lanterns',
      'Dual Precision Stage Spotlights (Warm 3000K)',
      'Concealed Safety Cabling',
      'Professional Crew Setup & Strike Down',
    ],
    lighting_equipment: [
      'Warm White Continuous Fairy Web',
      'Flicker-Flame Amber Safety LED Candle Modules',
      '2x 40W Focusable Warm Pin-Spot Projectors',
    ],
    setup_time: '2.5 - 3.5 Hours',
    venue_type: 'Home Garden, Intimate Hall, Rooftop Terrace',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'des-eng-2',
    event_id: 'evt-engagement',
    name: 'Elegant Promise',
    slug: 'elegant-promise',
    tier: 'Premium',
    price_pkr: 45000,
    description: 'Suspended crystal mini-chandeliers, illuminated floral walkway, and custom "Better Together" neon backdrop sign.',
    full_description: 'An elevated, picture-perfect engagement setting. Features three suspended crystal chandeliers glistening above the main stage, an illuminated 20-foot guest walkway lined with warm fairy bollards, and an aesthetic neon cursive sign ("Better Together" or "Engaged") designed for memorable photographs.',
    image_url: '/src/assets/images/pakistani_engagement_lights_1791809440535.jpg',
    included_services: [
      '3x Authentic Multi-Tier Crystal Mini-Chandeliers',
      '20-Foot Fairy-Lit Guest Arrival Walkway',
      'Custom Script Neon LED Signboard',
      '6x Warm Amber Architectural Perimeter Wall Washers',
      'On-site Lighting Technician for 4 Hours',
    ],
    lighting_equipment: [
      'Facet Cut Glass Crystal Chandeliers',
      'Warm White Neon Flex Signage',
      '6x 48W High-CRI LED Wall Washes',
    ],
    setup_time: '3.5 - 4.5 Hours',
    venue_type: 'Banquet Hall, Boutique Hotel, Farmhouse Courtyard',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'des-eng-3',
    event_id: 'evt-engagement',
    name: 'Luxury Engagement Lights',
    slug: 'luxury-engagement-lights',
    tier: 'Luxury',
    price_pkr: 82000,
    description: 'Panoramic starry night canopy, grand crystal statement centerpiece, illuminated stage platform, and dry ice fog walk.',
    full_description: 'A breathtaking high-society engagement ambiance. Features an extensive 45x30 ft starry night fairy light ceiling, an imposing 4-foot centerpiece crystal chandelier, illuminated stage skirting that casts a soft radiant halo beneath the couple, and a romantic low-lying cloud fog walk during the ring exchange.',
    image_url: '/src/assets/images/pakistani_canopy_lawn_1791809702293.jpg',
    included_services: [
      'Panoramic 45x30 ft Starry Night Fairy Canopy',
      '4-Foot Grand Luxury Bohemian Crystal Chandelier',
      'Illuminated Stage Platform Underglow Skirting',
      'Heavy-Duty Dry Ice Cloud Walk Machine (for Ring Ceremony)',
      '8x Wireless DMX Architectural Uplighters with Custom Amber-Cream Palette',
      'Dedicated Lighting Director & Technician Crew',
    ],
    lighting_equipment: [
      '2,800+ Premium Warm 2700K Fairy Diodes',
      'Grand Crystal Statement Chandelier with Dimmer Pack',
      'Low-Lying Cryogenic Fog Generator Unit',
      'Master Power Regulation Unit',
    ],
    setup_time: '5 - 6 Hours',
    venue_type: 'Five-Star Hotel Ballroom, Grand Estate, Marquee',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // --- 4. PARTIES (3 Designs) ---
  {
    id: 'des-party-1',
    event_id: 'evt-parties',
    name: 'Party Pulse',
    slug: 'party-pulse',
    tier: 'Classic',
    price_pkr: 18000,
    description: 'Dynamic RGB sound-activated par cans, warm bistro string lights, and glowing DJ table illumination.',
    full_description: 'Turn any social gathering, anniversary, or reunion into an electric celebration. Features 4 sound-reactive RGB LED wash fixtures that pulse to the beat of your music, warm bistro festoon globes across the terrace or room, and DJ booth edge lighting.',
    image_url: '/src/assets/images/pakistani_party_lights_1791809478064.jpg',
    included_services: [
      '4x Sound-Reactive RGB Color LED Par Cans',
      '50-Foot Warm Vintage Festoon / Bistro Globe String',
      'DJ Table / Buffet Station Glow Accent Light',
      'Quick Clean Setup & Strike Down',
    ],
    lighting_equipment: [
      '4x 36W Multi-Color Auto-Sync Wash Units',
      'E27 Warm Filament Festoon Belts',
      'Heavy-Duty Surge Protected Extension Blocks',
    ],
    setup_time: '1.5 - 2 Hours',
    venue_type: 'Rooftop, Backyard, Private Lounge, Basement',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'des-party-2',
    event_id: 'evt-parties',
    name: 'Celebration Glow',
    slug: 'celebration-glow',
    tier: 'Premium',
    price_pkr: 38000,
    description: 'Custom neon party quote, dual moving beam lights, laser effects, and full perimeter color washing.',
    full_description: 'An exhilarating nightlife visual package for graduation bashes, milestone anniversaries, and house parties. Includes a custom aesthetic neon sign, two intelligent rotating beam lights, a dual-aperture club laser with geometric patterns, and 8 wall-washer cans that coat the room in vibrant hues.',
    image_url: '/src/assets/images/pakistani_party_lights_1791809478064.jpg',
    included_services: [
      'Custom Neon LED Feature Sign ("Party Mode" or "Good Vibes")',
      '2x DMX Controlled Moving Head Spot Fixtures',
      'Dual Emerald/Cyan Geometric Laser Projector',
      '8x Full-Room Perimeter Wash Lights',
      'Dedicated Technician for 4 Hours',
    ],
    lighting_equipment: [
      '2x 60W Moving Head Light Fixtures with Gobo Wheels',
      'FDA Safe Aerial Geometric Club Laser',
      '8x High-Output RGBWA LED Par Fixtures',
    ],
    setup_time: '3 - 4 Hours',
    venue_type: 'Rooftop Lounge, Banquet Hall, Farmhouse',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'des-party-3',
    event_id: 'evt-parties',
    name: 'Ultimate Party Lights',
    slug: 'ultimate-party-lights',
    tier: 'Luxury',
    price_pkr: 68000,
    description: 'Full nightclub stage truss setup, 4 moving heads, dual lasers, haze smoke machine, and synchronized DMX lightshow.',
    full_description: 'A genuine festival-grade production. We install an engineered overhead aluminum lighting truss with 4 computerized moving heads, high-powered multi-beam lasers, professional water-based haze atmosphere machine that makes every light beam slice through the air, and live light-jockey (LJ) control.',
    image_url: '/src/assets/images/pakistani_neon_party_1791809757832.jpg',
    included_services: [
      'Heavy-Duty Aluminum Goalpost / Box Truss System',
      '4x 100W High-Speed Moving Head Beam Fixtures',
      'Professional Atmospheric Haze Machine for Visible Light Beams',
      'RGB Multi-Tunnel Animation Laser Array',
      '12x Perimeter Pixel-Bar Uplighters',
      'Live Console Lighting Jockey (LJ) on Site All Night',
    ],
    lighting_equipment: [
      '4x 100W Sharpy-Style Beam Moving Heads',
      'Commercial Continuous Output Water-Hazer',
      'Avolites / Sunlite DMX Stage Controller Interface',
    ],
    setup_time: '4.5 - 5.5 Hours',
    venue_type: 'Large Farmhouse, Open Ground, Event Complex',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // --- 5. BARAT (3 Designs) ---
  {
    id: 'des-barat-1',
    event_id: 'evt-barat',
    name: 'Royal Barat',
    slug: 'royal-barat',
    tier: 'Classic',
    price_pkr: 28000,
    description: 'Regal golden stage backdrop, bride & groom spotlighting, and festive entrance arch lighting.',
    full_description: 'A dignified, traditional Barat wedding illumination. Features a cascading golden fairy curtain backdrop (15x12 ft) behind the royal wedding stage, high-CRI warm stage spots to ensure wedding photographers capture sharp, flattering portraits, and welcoming entrance archway fairy illumination.',
    image_url: '/src/assets/images/pakistani_wedding_lights_1791809277119.jpg',
    included_services: [
      '15x12 ft Golden Cascading Fairy Light Stage Curtain',
      'Dual High-CRI 95+ Warm LED Portrait Spotlights',
      'Main Entrance Gate Archway Festive Wrap',
      'Stage Front Halo Uplighting',
      'Setup, Wiring Concealment & Safe Power Boards',
    ],
    lighting_equipment: [
      '2700K High-Density Fairy Curtains',
      '2x 50W Studio-Grade CRI 95 Photo-Safe Floodlights',
      'Commercial Weatherproof Distribution Cables',
    ],
    setup_time: '3 - 4 Hours',
    venue_type: 'Community Hall, Marriage Lawn, Banquet Hall',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'des-barat-2',
    event_id: 'evt-barat',
    name: 'Grand Wedding Glow',
    slug: 'grand-wedding-glow',
    tier: 'Premium',
    price_pkr: 54000,
    description: 'Grand crystal chandelier stage setup, 30-foot illuminated red carpet aisle, and warm architectural uplighting.',
    full_description: 'An opulent royal Barat aesthetic designed for traditional Pakistani weddings. Features a majestic triple crystal chandelier hanging ensemble suspended above the royal bridal stage, 30 feet of illuminated carpet runway lined with golden lantern towers, and 8 architectural warm wall washers illuminating the hall facades.',
    image_url: '/src/assets/images/pakistani_barat_stage_1791809647242.jpg',
    included_services: [
      '3x Ornate Bohemian Crystal Hanging Chandeliers on Stage',
      '30-Foot Barat Aisle with 10x Illuminated Golden Lantern Pillars',
      '8x Warm Architectural Amber-Gold Wall Washers',
      'Studio Quality Follow-Spot for Groom & Baraat Arrival',
      '2x Dedicated Lighting Technicians on Duty',
    ],
    lighting_equipment: [
      'Solid Glass Multi-Tier Chandeliers with Dimmer Rig',
      '10x Brass Handcrafted Royal Lantern Towers',
      '8x 54W High-Power Warm Architectural Par Units',
      'Manual Iris Follow-Spotlight',
    ],
    setup_time: '4.5 - 5.5 Hours',
    venue_type: 'Marquee, Luxury Banquet Hall, Farmhouse',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'des-barat-3',
    event_id: 'evt-barat',
    name: 'Imperial Barat Lights',
    slug: 'imperial-barat-lights',
    tier: 'Luxury',
    price_pkr: 98000,
    description: 'Complete palace-style fairy light exterior facade, 50-foot tunnel entrance, 5 crystal chandeliers, and cold pyro sparks.',
    full_description: 'The monumental Barat masterwork fit for royalty. Illuminates the entire venue entrance facade in thousands of cascading fairy drops, creates a breathtaking 50-foot illuminated walk-through tunnel of light for the Baraat procession, suspends a cluster of 5 grand crystal chandeliers over the bridal stage, and deploys 6 synchronized cold spark machines for the bride & groom entrance.',
    image_url: '/src/assets/images/pakistani_house_lights_1791809521738.jpg',
    included_services: [
      '50-Foot Golden Archway Tunnel of Light Entrance',
      'Exterior Building / Venue Facade Fairy Drapes (up to 80 ft width)',
      '5x Grand Bohemian Multi-Tier Crystal Chandeliers',
      '6x Wireless Cold Pyro Spark Fountains for Couple Entrance',
      '12x High-Output Smart Architectural Ambient Color Fixtures',
      'Lead Project Engineer & 3 Technicians on Site Full Event',
    ],
    lighting_equipment: [
      'Over 4,500 Heavy-Duty Commercial LED Bulbs & Fairy Nets',
      '5x Full Crystal Chandeliers on Heavy Rigging Hoists',
      '6x Cold Spark Units (100% Indoor & Marquee Safe)',
      'Three-Phase Industrial Power Distribution Unit',
    ],
    setup_time: '7 - 8 Hours',
    venue_type: 'Grand Marquee, Five-Star Hotel, Private Estate',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // --- 6. WALEEMA (3 Designs) ---
  {
    id: 'des-wal-1',
    event_id: 'evt-waleema',
    name: 'Waleema Serenity',
    slug: 'waleema-serenity',
    tier: 'Classic',
    price_pkr: 26000,
    description: 'Serene warm-ivory fairy backdrop, soft floral stage wash, and candlelit guest table accents.',
    full_description: 'An understated, refined lighting aesthetic honoring the graceful tradition of the Waleema reception. Features an elegant 14x10 ft ivory-warm fairy curtain, soft diffusion stage lighting that produces gentle, flattering photography shadows, and warm ambient floor lanterns.',
    image_url: '/src/assets/images/pakistani_waleema_decor_1791809350753.jpg',
    included_services: [
      '14x10 ft Ivory & Warm-White Fairy Net Backdrop',
      'Soft Diffusion Stage Wash for Natural Photography Tones',
      '8x Warm Floor Lantern Accents with LED Candles',
      'Neat Cable Concealment & Safety Testing',
      'Professional Setup & Dismantling Team',
    ],
    lighting_equipment: [
      'Soft 2700K Ivory Silk Fairy Strands',
      '2x 45W Frosted Lens Stage Soft-Boxes',
      'Heavy-Duty Surge Protected Extension Boards',
    ],
    setup_time: '2.5 - 3.5 Hours',
    venue_type: 'Banquet Hall, Hotel Hall, Garden Lawn',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'des-wal-2',
    event_id: 'evt-waleema',
    name: 'Elegant Reception',
    slug: 'elegant-reception',
    tier: 'Premium',
    price_pkr: 50000,
    description: 'Cascading floral-lighting chandeliers, VIP table amber spot pin-lights, and perimeter champagne washes.',
    full_description: 'Sophisticated modern elegance for memorable wedding receptions. Features dual suspended crystal chandeliers woven with floral elements, 8 pinpoint spotlights aimed directly onto VIP and family dining tables to make tableware sparkle, and champagne-toned wall washing throughout the reception hall.',
    image_url: '/src/assets/images/pakistani_waleema_decor_1791809350753.jpg',
    included_services: [
      '2x Suspended Luxury Crystal Chandeliers',
      '8x Magnetic Pin-Spot Lights for VIP Dining Tables',
      '8x Architectural Champagne-Tone Wall Washers',
      'Stage Portrait Floodlights with Dimming Control',
      'Dedicated Lighting Standby Technician for 4.5 Hours',
    ],
    lighting_equipment: [
      'Czech Cut Crystal Fixtures with Dimmable Warm LED Lamps',
      '8x Ultra-Narrow Beam 15W Pinspot Fixtures',
      '8x RGBW 48W High-Output Wall Washes',
    ],
    setup_time: '4 - 5 Hours',
    venue_type: 'Hotel Ballroom, Luxury Marquee, Banquet Pavilion',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'des-wal-3',
    event_id: 'evt-waleema',
    name: 'Royal Waleema Glow',
    slug: 'royal-waleema-glow',
    tier: 'Luxury',
    price_pkr: 92000,
    description: 'Grand crystal chandelier ceiling cluster, 50x30 ft starry fairy sky, stage halo illumination, and fog walk.',
    full_description: 'The pinnacle of Waleema reception luxury in Pakistan. We create an awe-inspiring ceiling ensemble of four monumental crystal chandeliers, a 50x30 ft starry night fairy canopy, soft halo edge lighting around the bride and groom dais, low-lying dry ice fog for the entrance, and 12 wireless architectural uplights calibrated to a regal champagne-gold tone.',
    image_url: '/src/assets/images/pakistani_wedding_lights_1791809277119.jpg',
    included_services: [
      '4x Grand Crystal Chandeliers Suspended in Central Cluster',
      '50x30 ft Starry Sky Ceiling Fairy Light Canopy',
      'Illuminated Dais Stage Perimeter Underglow',
      'Dry Ice Low-Lying Cloud Fog Machine for Grand Entrance',
      '12x Wireless DMX Architectural Uplighters in Custom Champagne Glow',
      'Lead Lighting Engineer & 2 Technicians On-Site Full Reception',
    ],
    lighting_equipment: [
      '4x Heavy Multi-Tier Crystal Chandeliers with Steel Rigging',
      '3,200+ Premium Warm LED Starlight Nodes',
      'Cryogenic Ground Fog Generator Unit',
      'Commercial Power Distribution System',
    ],
    setup_time: '6 - 7 Hours',
    venue_type: 'Grand Hotel Ballroom, Premium Marquee, Royal Club',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Add-ons as requested in Part 4 & 13
const INITIAL_ADD_ONS: AddOn[] = [
  {
    id: 'addon-sparks',
    name: 'Cold Firework Pyro Sparks (4 Units)',
    description: '100% smokeless, indoor & marquee safe cold pyrotechnic spark fountains for grand entrances and cake cutting.',
    price_pkr: 8500,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'addon-dryice',
    name: 'Heavy Low-Lying Dry Ice Fog (Cloud Walk)',
    description: 'Magical knee-deep cloud fog that stays on the floor for couple walks, ring exchange, or first dance.',
    price_pkr: 6000,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'addon-tunnel',
    name: '20-Foot Golden Fairy Light Tunnel Entrance',
    description: 'Spectacular illuminated walk-through archway tunnel for guest entry photography.',
    price_pkr: 14000,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'addon-chandeliers',
    name: 'Crystal Chandelier Trio Suspension',
    description: 'Set of 3 glistening Czech-style crystal chandeliers suspended with dimmer control over stage or dining.',
    price_pkr: 12500,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'addon-neon',
    name: 'Custom Glowing Neon Name Signboard',
    description: 'Personalized neon flex sign with couple names, birthday name, or custom celebratory phrase.',
    price_pkr: 7500,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'addon-uplighting',
    name: 'Ambient RGBW Par Can Uplighting (8 Units)',
    description: 'Eight high-power architectural LED wash fixtures to illuminate hall walls, garden trees, or stage pillars.',
    price_pkr: 9000,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'addon-technician',
    name: 'Dedicated On-Site Lighting Master Technician',
    description: 'Full-time certified electrical technician present throughout the event to manage switches, cues, and safety.',
    price_pkr: 5000,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

// Default sample messages for admin inbox
const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Ayesha Siddiqui',
    email: 'ayesha.s@gmail.com',
    phone: '0300-8451290',
    message: 'Hello Glowora team! We have a Barat event scheduled next month at Royal Palm Lahore. Can you provide custom crystal chandeliers and a 40ft light tunnel? Please share details.',
    status: 'new',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'msg-2',
    name: 'Bilal Farooq',
    email: 'bilal.farooq@outlook.com',
    phone: '0321-4567890',
    message: 'Hi, I would like to book the Mehndi Night Royale package for a farmhouse in DHA Phase 7. Is the cold spark fountain safe for wooden stage setups?',
    status: 'read',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

class DatabaseEngine {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.events) && Array.isArray(parsed.designs)) {
          return parsed;
        }
      } catch (err) {
        console.error('Error loading database file, initializing fresh store:', err);
      }
    }

    // Default admin user
    const adminPasswordHash = bcrypt.hashSync('admin123456', 10);
    const customerPasswordHash = bcrypt.hashSync('customer123', 10);

    const initialUsers: UserRecord[] = [
      {
        id: 'usr-admin-1',
        email: 'admin@glowora.pk',
        full_name: 'Glowora Master Admin',
        phone: '0335-8765487',
        role: 'admin',
        password_hash: adminPasswordHash,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'usr-cust-1',
        email: 'client@glowora.pk',
        full_name: 'Hamza Malik',
        phone: '0300-1234567',
        role: 'customer',
        password_hash: customerPasswordHash,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    // Initial sample bookings
    const initialBookings: Booking[] = [
      {
        id: 'bk-sample-1',
        booking_reference: 'GLW-2026-4891',
        customer_id: 'usr-cust-1',
        design_id: 'des-barat-2',
        event_name_snapshot: 'Barat',
        design_name_snapshot: 'Grand Wedding Glow',
        event_date: '2026-11-20',
        event_time: '19:30',
        city: 'Lahore',
        area: 'DHA Phase 6',
        venue_address: 'Raya Fairways Banquet Complex, Hall A, DHA Phase 6',
        customer_phone: '0300-1234567',
        special_instructions: 'Please coordinate with the hall manager for early 3 PM power setup. Warm champagne lighting preferred.',
        subtotal_pkr: 54000,
        add_on_total_pkr: 14500,
        total_pkr: 68500,
        booking_status: 'confirmed',
        payment_status: 'paid',
        created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
        updated_at: new Date(Date.now() - 3600000 * 12).toISOString(),
        add_ons: [
          {
            add_on_id: 'addon-sparks',
            name: 'Cold Firework Pyro Sparks (4 Units)',
            quantity: 1,
            unit_price_pkr: 8500,
            total_pkr: 8500,
          },
          {
            add_on_id: 'addon-dryice',
            name: 'Heavy Low-Lying Dry Ice Fog (Cloud Walk)',
            quantity: 1,
            unit_price_pkr: 6000,
            total_pkr: 6000,
          },
        ],
      },
      {
        id: 'bk-sample-2',
        booking_reference: 'GLW-2026-7230',
        customer_id: 'usr-cust-1',
        design_id: 'des-mehndi-2',
        event_name_snapshot: 'Mehndi',
        design_name_snapshot: 'Royal Mehndi Lights',
        event_date: '2026-11-18',
        event_time: '20:00',
        city: 'Lahore',
        area: 'Bedian Road',
        venue_address: 'Green Meadows Farmhouse, Bedian Road near Ring Road Interchange',
        customer_phone: '0300-1234567',
        special_instructions: 'Moroccan lantern clusters required across both lawn trees. Sound to light sync for dance performance.',
        subtotal_pkr: 48000,
        add_on_total_pkr: 12500,
        total_pkr: 60500,
        booking_status: 'pending',
        payment_status: 'unpaid',
        created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
        updated_at: new Date(Date.now() - 3600000 * 6).toISOString(),
        add_ons: [
          {
            add_on_id: 'addon-chandeliers',
            name: 'Crystal Chandelier Trio Suspension',
            quantity: 1,
            unit_price_pkr: 12500,
            total_pkr: 12500,
          },
        ],
      },
    ];

    const initialDb: DatabaseSchema = {
      users: initialUsers,
      events: INITIAL_EVENTS,
      designs: INITIAL_DESIGNS,
      add_ons: INITIAL_ADD_ONS,
      bookings: initialBookings,
      contact_messages: INITIAL_MESSAGES,
    };

    this.saveDatabase(initialDb);
    return initialDb;
  }

  private saveDatabase(dataToSave?: DatabaseSchema) {
    const toSave = dataToSave || this.data;
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(toSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  // --- Users & Profiles ---
  public findUserByEmail(email: string): UserRecord | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): UserRecord | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public createUser(userData: {
    email: string;
    password: string;
    full_name: string;
    phone: string;
    role?: 'customer' | 'admin';
  }): Profile {
    const existing = this.findUserByEmail(userData.email);
    if (existing) {
      throw new Error('User with this email already exists');
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(userData.password, salt);

    const newUser: UserRecord = {
      id: `usr-${crypto.randomUUID()}`,
      email: userData.email.toLowerCase().trim(),
      full_name: userData.full_name.trim(),
      phone: userData.phone.trim(),
      role: userData.role === 'admin' ? 'admin' : 'customer', // customers cannot elevate themselves
      password_hash: hash,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.data.users.push(newUser);
    this.saveDatabase();

    const { password_hash, ...profile } = newUser;
    return profile;
  }

  public verifyPassword(user: UserRecord, passwordAttempt: string): boolean {
    return bcrypt.compareSync(passwordAttempt, user.password_hash);
  }

  public updateUserProfile(
    userId: string,
    updates: { full_name?: string; phone?: string; password?: string }
  ): Profile {
    const user = this.findUserById(userId);
    if (!user) throw new Error('User not found');

    if (updates.full_name) user.full_name = updates.full_name.trim();
    if (updates.phone) user.phone = updates.phone.trim();
    if (updates.password && updates.password.length >= 6) {
      user.password_hash = bcrypt.hashSync(updates.password, 10);
    }
    user.updated_at = new Date().toISOString();

    this.saveDatabase();
    const { password_hash, ...profile } = user;
    return profile;
  }

  public getAllCustomers(): Profile[] {
    return this.data.users
      .filter((u) => u.role === 'customer')
      .map(({ password_hash, ...rest }) => rest);
  }

  // --- Events ---
  public getEvents(includeInactive = false): EventCategory[] {
    return this.data.events
      .filter((e) => includeInactive || e.is_active)
      .map((e) => {
        // calculate dynamic starting price from active designs
        const designs = this.data.designs.filter(
          (d) => d.event_id === e.id && (includeInactive || d.is_available)
        );
        const minPrice = designs.length > 0
          ? Math.min(...designs.map((d) => d.price_pkr))
          : e.starting_price_pkr || 20000;
        return {
          ...e,
          starting_price_pkr: minPrice,
        };
      });
  }

  public getEventBySlug(slug: string): EventCategory | undefined {
    const event = this.data.events.find((e) => e.slug.toLowerCase() === slug.toLowerCase());
    if (!event) return undefined;
    const designs = this.data.designs.filter((d) => d.event_id === event.id && d.is_available);
    const minPrice = designs.length > 0
      ? Math.min(...designs.map((d) => d.price_pkr))
      : event.starting_price_pkr || 20000;
    return {
      ...event,
      starting_price_pkr: minPrice,
    };
  }

  public getEventById(id: string): EventCategory | undefined {
    return this.data.events.find((e) => e.id === id);
  }

  public updateEvent(id: string, updates: Partial<EventCategory>): EventCategory {
    const index = this.data.events.findIndex((e) => e.id === id);
    if (index === -1) throw new Error('Event not found');

    this.data.events[index] = {
      ...this.data.events[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.saveDatabase();
    return this.data.events[index];
  }

  // --- Designs ---
  public getDesigns(filter?: {
    eventId?: string;
    eventSlug?: string;
    tier?: string;
    includeUnavailable?: boolean;
  }): Design[] {
    let result = this.data.designs;

    if (!filter?.includeUnavailable) {
      result = result.filter((d) => d.is_available);
    }

    if (filter?.eventId) {
      result = result.filter((d) => d.event_id === filter.eventId);
    }

    if (filter?.eventSlug) {
      const evt = this.data.events.find((e) => e.slug.toLowerCase() === filter.eventSlug?.toLowerCase());
      if (evt) {
        result = result.filter((d) => d.event_id === evt.id);
      } else {
        return [];
      }
    }

    if (filter?.tier && filter.tier !== 'all') {
      result = result.filter((d) => d.tier.toLowerCase() === filter.tier?.toLowerCase());
    }

    return result.map((d) => {
      const event = this.data.events.find((e) => e.id === d.event_id);
      return { ...d, event };
    });
  }

  public getDesignById(id: string): Design | undefined {
    const design = this.data.designs.find((d) => d.id === id);
    if (!design) return undefined;
    const event = this.data.events.find((e) => e.id === design.event_id);
    return { ...design, event };
  }

  public getDesignBySlug(slug: string): Design | undefined {
    const design = this.data.designs.find((d) => d.slug.toLowerCase() === slug.toLowerCase());
    if (!design) return undefined;
    const event = this.data.events.find((e) => e.id === design.event_id);
    return { ...design, event };
  }

  public createDesign(designData: Omit<Design, 'id' | 'created_at' | 'updated_at'>): Design {
    const newDesign: Design = {
      ...designData,
      id: `des-${crypto.randomUUID()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.designs.push(newDesign);
    this.saveDatabase();
    return newDesign;
  }

  public updateDesign(id: string, updates: Partial<Design>): Design {
    const index = this.data.designs.findIndex((d) => d.id === id);
    if (index === -1) throw new Error('Design not found');

    this.data.designs[index] = {
      ...this.data.designs[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.saveDatabase();
    return this.data.designs[index];
  }

  public deleteDesign(id: string): boolean {
    const index = this.data.designs.findIndex((d) => d.id === id);
    if (index === -1) return false;
    this.data.designs.splice(index, 1);
    this.saveDatabase();
    return true;
  }

  // --- Add-ons ---
  public getAddOns(includeInactive = false): AddOn[] {
    return this.data.add_ons.filter((a) => includeInactive || a.is_active);
  }

  public getAddOnById(id: string): AddOn | undefined {
    return this.data.add_ons.find((a) => a.id === id);
  }

  public updateAddOn(id: string, updates: Partial<AddOn>): AddOn {
    const index = this.data.add_ons.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Add-on not found');

    this.data.add_ons[index] = {
      ...this.data.add_ons[index],
      ...updates,
    };
    this.saveDatabase();
    return this.data.add_ons[index];
  }

  // --- Bookings ---
  // Server-side trusted price calculation & human-readable booking reference generator
  public createBooking(input: {
    customerId: string;
    designId: string;
    eventDate: string;
    eventTime: string;
    city: string;
    area: string;
    venueAddress: string;
    latitude?: number | null;
    longitude?: number | null;
    customerPhone: string;
    specialInstructions?: string | null;
    addOnSelections: Array<{ addOnId: string; quantity: number }>;
  }): Booking {
    const design = this.getDesignById(input.designId);
    if (!design) {
      throw new Error('Selected decoration design does not exist');
    }
    if (!design.is_available) {
      throw new Error('This decoration design is currently marked unavailable');
    }

    const event = this.getEventById(design.event_id);
    const eventName = event ? event.name : 'Celebration Event';

    // Calculate trusted prices entirely from server database records
    const subtotal_pkr = Number(design.price_pkr);
    let add_on_total_pkr = 0;
    const computedAddOns: BookingAddOnItem[] = [];

    for (const sel of input.addOnSelections) {
      if (sel.quantity > 0) {
        const item = this.getAddOnById(sel.addOnId);
        if (item && item.is_active) {
          const itemTotal = Number(item.price_pkr) * sel.quantity;
          add_on_total_pkr += itemTotal;
          computedAddOns.push({
            add_on_id: item.id,
            name: item.name,
            quantity: sel.quantity,
            unit_price_pkr: Number(item.price_pkr),
            total_pkr: itemTotal,
          });
        }
      }
    }

    const total_pkr = subtotal_pkr + add_on_total_pkr;

    // Generate human-friendly booking reference like GLW-2026-8912
    const currentYear = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const booking_reference = `GLW-${currentYear}-${randomSuffix}`;

    const newBooking: Booking = {
      id: `bk-${crypto.randomUUID()}`,
      booking_reference,
      customer_id: input.customerId,
      design_id: design.id,
      event_name_snapshot: eventName,
      design_name_snapshot: design.name,
      event_date: input.eventDate,
      event_time: input.eventTime,
      city: input.city,
      area: input.area,
      venue_address: input.venueAddress,
      latitude: input.latitude || null,
      longitude: input.longitude || null,
      customer_phone: input.customerPhone,
      special_instructions: input.specialInstructions || null,
      subtotal_pkr,
      add_on_total_pkr,
      total_pkr,
      booking_status: 'pending',
      payment_status: 'unpaid',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      add_ons: computedAddOns,
    };

    this.data.bookings.unshift(newBooking);
    this.saveDatabase();
    return this.enrichBooking(newBooking);
  }

  private enrichBooking(b: Booking): Booking {
    const customer = this.findUserById(b.customer_id);
    const design = this.getDesignById(b.design_id);
    return {
      ...b,
      customer: customer ? {
        id: customer.id,
        full_name: customer.full_name,
        email: customer.email,
        phone: customer.phone,
      } : undefined,
      design,
    };
  }

  public getBookingsForUser(userId: string): Booking[] {
    return this.data.bookings
      .filter((b) => b.customer_id === userId)
      .map((b) => this.enrichBooking(b));
  }

  public getAllBookings(filter?: {
    status?: string;
    paymentStatus?: string;
    search?: string;
  }): Booking[] {
    let result = this.data.bookings;

    if (filter?.status && filter.status !== 'all') {
      result = result.filter((b) => b.booking_status === filter.status);
    }

    if (filter?.paymentStatus && filter.paymentStatus !== 'all') {
      result = result.filter((b) => b.payment_status === filter.paymentStatus);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter((b) =>
        b.booking_reference.toLowerCase().includes(q) ||
        b.design_name_snapshot.toLowerCase().includes(q) ||
        b.event_name_snapshot.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.customer_phone.includes(q)
      );
    }

    return result.map((b) => this.enrichBooking(b));
  }

  public getBookingById(id: string): Booking | undefined {
    const b = this.data.bookings.find((item) => item.id === id || item.booking_reference === id);
    return b ? this.enrichBooking(b) : undefined;
  }

  public updateBookingStatus(
    id: string,
    updates: {
      booking_status?: Booking['booking_status'];
      payment_status?: Booking['payment_status'];
    }
  ): Booking {
    const index = this.data.bookings.findIndex((b) => b.id === id);
    if (index === -1) throw new Error('Booking not found');

    const booking = this.data.bookings[index];
    if (updates.booking_status) booking.booking_status = updates.booking_status;
    if (updates.payment_status) booking.payment_status = updates.payment_status;
    booking.updated_at = new Date().toISOString();

    this.saveDatabase();
    return this.enrichBooking(booking);
  }

  public cancelBookingByCustomer(bookingId: string, customerId: string): Booking {
    const index = this.data.bookings.findIndex((b) => b.id === bookingId);
    if (index === -1) throw new Error('Booking not found');

    const booking = this.data.bookings[index];
    if (booking.customer_id !== customerId) {
      throw new Error('Unauthorized to cancel this booking');
    }

    if (booking.booking_status === 'completed' || booking.booking_status === 'in_progress') {
      throw new Error('Cannot cancel an event that is currently in progress or completed');
    }

    booking.booking_status = 'cancelled';
    booking.updated_at = new Date().toISOString();
    this.saveDatabase();
    return this.enrichBooking(booking);
  }

  // --- Contact Messages ---
  public createContactMessage(msg: {
    name: string;
    email: string;
    phone?: string;
    message: string;
  }): ContactMessage {
    const newMsg: ContactMessage = {
      id: `msg-${crypto.randomUUID()}`,
      name: msg.name.trim(),
      email: msg.email.trim(),
      phone: msg.phone?.trim() || '',
      message: msg.message.trim(),
      status: 'new',
      created_at: new Date().toISOString(),
    };

    this.data.contact_messages.unshift(newMsg);
    this.saveDatabase();
    return newMsg;
  }

  public getContactMessages(): ContactMessage[] {
    return this.data.contact_messages;
  }

  public updateContactMessageStatus(id: string, status: ContactMessage['status']): ContactMessage {
    const msg = this.data.contact_messages.find((m) => m.id === id);
    if (!msg) throw new Error('Message not found');
    msg.status = status;
    this.saveDatabase();
    return msg;
  }

  // --- Admin Statistics ---
  public getAdminStats(): AdminStats {
    const total_bookings = this.data.bookings.length;
    const pending_bookings = this.data.bookings.filter((b) => b.booking_status === 'pending').length;
    const confirmed_bookings = this.data.bookings.filter((b) => b.booking_status === 'confirmed').length;
    const completed_bookings = this.data.bookings.filter((b) => b.booking_status === 'completed').length;
    const cancelled_bookings = this.data.bookings.filter((b) => b.booking_status === 'cancelled').length;

    // Total estimated pipeline value vs actual collected payments
    const estimated_revenue_pkr = this.data.bookings
      .filter((b) => b.booking_status !== 'cancelled' && b.booking_status !== 'rejected')
      .reduce((sum, b) => sum + Number(b.total_pkr), 0);

    const collected_revenue_pkr = this.data.bookings
      .filter((b) => b.payment_status === 'paid')
      .reduce((sum, b) => sum + Number(b.total_pkr), 0);

    const total_customers = this.data.users.filter((u) => u.role === 'customer').length;
    const total_designs = this.data.designs.length;
    const total_events = this.data.events.length;
    const unread_messages = this.data.contact_messages.filter((m) => m.status === 'new').length;

    return {
      total_bookings,
      pending_bookings,
      confirmed_bookings,
      completed_bookings,
      cancelled_bookings,
      estimated_revenue_pkr,
      collected_revenue_pkr,
      total_customers,
      total_designs,
      total_events,
      unread_messages,
    };
  }
}

export const db = new DatabaseEngine();
