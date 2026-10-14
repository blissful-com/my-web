import type {
  EventCategory,
  Design,
  AddOn,
  Booking,
  ContactMessage,
  Profile,
  AdminStats,
} from '../types/database.js';

const TOKEN_KEY = 'glowora_auth_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  // --- Auth ---
  register: (payload: { email: string; password: string; full_name: string; phone: string }) =>
    request<{ user: Profile; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }) =>
    request<{ user: Profile; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getMe: () => request<{ user: Profile }>('/auth/me'),

  logout: () =>
    request<{ success: boolean }>('/auth/logout', {
      method: 'POST',
    }),

  updateProfile: (payload: { full_name?: string; phone?: string; password?: string }) =>
    request<{ user: Profile; message: string }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  forgotPassword: (email: string) =>
    request<{ success: boolean; message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  // --- Events ---
  getEvents: (all = false) =>
    request<{ events: EventCategory[] }>(`/events${all ? '?all=true' : ''}`),

  getEventBySlug: (slug: string) =>
    request<{ event: EventCategory; designs: Design[] }>(`/events/${slug}`),

  updateEvent: (id: string, updates: Partial<EventCategory>) =>
    request<{ event: EventCategory; message: string }>(`/admin/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  // --- Designs ---
  getDesigns: (filter?: { eventSlug?: string; eventId?: string; tier?: string }) => {
    const params = new URLSearchParams();
    if (filter?.eventSlug) params.set('eventSlug', filter.eventSlug);
    if (filter?.eventId) params.set('eventId', filter.eventId);
    if (filter?.tier && filter.tier !== 'all') params.set('tier', filter.tier);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return request<{ designs: Design[] }>(`/designs${qs}`);
  },

  getDesignById: (id: string) =>
    request<{ design: Design }>(`/designs/${id}`),

  createDesign: (design: Partial<Design>) =>
    request<{ design: Design; message: string }>('/admin/designs', {
      method: 'POST',
      body: JSON.stringify(design),
    }),

  updateDesign: (id: string, updates: Partial<Design>) =>
    request<{ design: Design; message: string }>(`/admin/designs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  deleteDesign: (id: string) =>
    request<{ success: boolean; message: string }>(`/admin/designs/${id}`, {
      method: 'DELETE',
    }),

  // --- Add-ons ---
  getAddOns: (all = false) =>
    request<{ addOns: AddOn[] }>(`/add-ons${all ? '?all=true' : ''}`),

  updateAddOn: (id: string, updates: Partial<AddOn>) =>
    request<{ addOn: AddOn; message: string }>(`/admin/add-ons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  // --- Bookings ---
  createBooking: (payload: {
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
  }) =>
    request<{ booking: Booking; message: string }>('/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getBookings: (filter?: { status?: string; paymentStatus?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (filter?.status && filter.status !== 'all') params.set('status', filter.status);
    if (filter?.paymentStatus && filter.paymentStatus !== 'all')
      params.set('paymentStatus', filter.paymentStatus);
    if (filter?.search) params.set('search', filter.search);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return request<{ bookings: Booking[] }>(`/bookings${qs}`);
  },

  getBookingById: (id: string) =>
    request<{ booking: Booking }>(`/bookings/${id}`),

  updateBookingStatus: (
    id: string,
    updates: { booking_status?: Booking['booking_status']; payment_status?: Booking['payment_status'] }
  ) =>
    request<{ booking: Booking; message: string }>(`/admin/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),

  cancelBooking: (id: string) =>
    request<{ booking: Booking; message: string }>(`/bookings/${id}/cancel`, {
      method: 'POST',
    }),

  // --- Contact ---
  sendContactMessage: (payload: { name: string; email: string; phone?: string; message: string }) =>
    request<{ message: string; contactMessage: ContactMessage }>('/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getContactMessages: () =>
    request<{ messages: ContactMessage[] }>('/admin/messages'),

  updateContactMessageStatus: (id: string, status: ContactMessage['status']) =>
    request<{ message: ContactMessage }>(`/admin/messages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // --- Admin ---
  getAdminStats: () =>
    request<{ stats: AdminStats }>('/admin/stats'),

  getAdminCustomers: () =>
    request<{ customers: Profile[] }>('/admin/customers'),
};
