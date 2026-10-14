export const BRAND = {
  name: 'Glowora',
  tagline: 'Light Up Every Moment',
  business: 'Event Lighting Decoration & Celebration Setup Services',
  country: 'Pakistan',
  currency: 'PKR',
  phone: '0335-8765487',
  phoneClean: '03358765487',
  whatsappUrl: 'https://wa.me/923358765487?text=Hi%20Glowora%2C%20I%20would%20like%20to%20inquire%20about%20event%20lighting%20decoration.',
  email: 'glowora@gmail.com',
  address: 'Gulberg III / DHA Phase 5, Lahore, Pakistan',
  serviceCoverage: 'Lahore, Islamabad/Rawalpindi, Karachi, Faisalabad & Multan',
};

export const COLORS = {
  pearlWhite: '#F8F9FC',
  crimson: '#C00000',
  coral: '#DE3C3C',
  gold: '#F7B32D',
  crimsonDark: '#8F0000',
  crimsonDeep: '#660000',
  textDark: '#1A1D20',
};

export const PAKISTANI_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Gujranwala',
  'Sialkot',
  'Peshawar',
  'Quetta',
  'Hyderabad',
  'Bahawalpur',
  'Sargodha',
  'Abbottabad',
];

export const VENUE_TYPES = [
  'Banquet Hall / Marriage Complex',
  'Luxury Farmhouse / Marquee',
  'Home Lawn / Courtyard',
  'Rooftop Terrace',
  'Hotel Grand Ballroom',
  'Outdoor Park / Garden',
  'Private Villa / Residence',
];

export function formatPKR(amount: number): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(amount).replace('PKR', 'PKR ');
}

export function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-PK', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
