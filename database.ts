export type UserRole = 'customer' | 'admin';

export type PackageTier = 'Classic' | 'Premium' | 'Luxury';

export type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'rejected';

export type PaymentStatus = 
  | 'unpaid'
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded';

export type ContactMessageStatus = 'new' | 'read' | 'resolved';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface EventCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_active: boolean;
  starting_price_pkr?: number;
  created_at: string;
  updated_at: string;
}

export interface Design {
  id: string;
  event_id: string;
  name: string;
  slug: string;
  tier: PackageTier;
  description: string;
  full_description?: string;
  image_url: string;
  price_pkr: number;
  included_services: string[];
  lighting_equipment?: string[];
  setup_time: string;
  venue_type: string;
  is_available: boolean;
  event?: EventCategory;
  created_at: string;
  updated_at: string;
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price_pkr: number;
  is_active: boolean;
  created_at: string;
}

export interface BookingAddOnItem {
  id?: string;
  add_on_id: string;
  name: string;
  quantity: number;
  unit_price_pkr: number;
  total_pkr: number;
}

export interface Booking {
  id: string;
  booking_reference: string;
  customer_id: string;
  design_id: string;
  event_name_snapshot: string;
  design_name_snapshot: string;
  event_date: string;
  event_time: string;
  city: string;
  area: string;
  venue_address: string;
  latitude?: number | null;
  longitude?: number | null;
  customer_phone: string;
  special_instructions?: string | null;
  subtotal_pkr: number;
  add_on_total_pkr: number;
  total_pkr: number;
  booking_status: BookingStatus;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
  customer?: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
  };
  design?: Design;
  add_ons?: BookingAddOnItem[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: ContactMessageStatus;
  created_at: string;
}

export interface AdminStats {
  total_bookings: number;
  pending_bookings: number;
  confirmed_bookings: number;
  completed_bookings: number;
  cancelled_bookings: number;
  estimated_revenue_pkr: number;
  collected_revenue_pkr: number;
  total_customers: number;
  total_designs: number;
  total_events: number;
  unread_messages: number;
}
