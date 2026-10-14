import express, { Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';
import { db } from './db.js';
import type { UserRole } from '../src/types/database.js';

const router = express.Router();

// Simple in-memory session token store (token -> userId)
// In production or Supabase mode, standard JWTs or Supabase tokens can be used.
const sessions = new Map<string, { userId: string; expiresAt: number }>();

function generateSessionToken(userId: string): string {
  const token = `tok_${crypto.randomUUID()}_${Date.now()}`;
  // 7 days expiration
  sessions.set(token, {
    userId,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });
  return token;
}

// Auth Middleware
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    full_name: string;
    phone: string;
  };
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const session = sessions.get(token);

  if (!session || session.expiresAt < Date.now()) {
    if (session) sessions.delete(token);
    res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
    return;
  }

  const user = db.findUserById(session.userId);
  if (!user) {
    res.status(401).json({ error: 'User no longer exists' });
    return;
  }

  req.user = {
    id: user.id,
    email: user.email,
    role: user.role,
    full_name: user.full_name,
    phone: user.phone,
  };

  next();
}

export function adminOnly(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: 'Access denied: Administrator privileges required.' });
    return;
  }
  next();
}

// ----------------- AUTH ROUTES -----------------
router.post('/auth/register', (req: Request, res: Response) => {
  try {
    const { email, password, full_name, phone } = req.body;

    if (!email || !password || !full_name) {
      res.status(400).json({ error: 'Full name, email, and password are required' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' });
      return;
    }

    // Role is strictly forced to 'customer'
    const profile = db.createUser({
      email,
      password,
      full_name,
      phone: phone || '',
      role: 'customer',
    });

    const token = generateSessionToken(profile.id);
    res.status(201).json({
      user: profile,
      token,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Registration failed' });
  }
});

router.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const isValid = db.verifyPassword(user, password);
    if (!isValid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = generateSessionToken(user.id);
    const { password_hash, ...profile } = user;

    res.json({
      user: profile,
      token,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Login failed' });
  }
});

router.get('/auth/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  res.json({ user: req.user });
});

router.post('/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    sessions.delete(token);
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

router.put('/auth/profile', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { full_name, phone, password } = req.body;
    const updated = db.updateUserProfile(req.user.id, {
      full_name,
      phone,
      password,
    });

    res.json({ user: updated, message: 'Profile updated successfully' });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update profile' });
  }
});

router.post('/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }
  // In production, Supabase or email service sends a reset link
  res.json({
    success: true,
    message: `If an account with ${email} exists, password recovery instructions have been sent.`,
  });
});

// ----------------- EVENTS ROUTES -----------------
router.get('/events', (req: Request, res: Response) => {
  const includeInactive = req.query.all === 'true';
  const events = db.getEvents(includeInactive);
  res.json({ events });
});

router.get('/events/:slug', (req: Request, res: Response) => {
  const event = db.getEventBySlug(req.params.slug);
  if (!event) {
    res.status(404).json({ error: 'Event category not found' });
    return;
  }
  const designs = db.getDesigns({ eventId: event.id });
  res.json({ event, designs });
});

router.put('/admin/events/:id', authMiddleware, adminOnly, (req: Request, res: Response) => {
  try {
    const updated = db.updateEvent(req.params.id, req.body);
    res.json({ event: updated, message: 'Event category updated' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------- DESIGNS ROUTES -----------------
router.get('/designs', (req: Request, res: Response) => {
  const { eventSlug, eventId, tier, includeUnavailable } = req.query;
  const designs = db.getDesigns({
    eventSlug: eventSlug as string | undefined,
    eventId: eventId as string | undefined,
    tier: tier as string | undefined,
    includeUnavailable: includeUnavailable === 'true',
  });
  res.json({ designs });
});

router.get('/designs/:id', (req: Request, res: Response) => {
  const design = db.getDesignById(req.params.id) || db.getDesignBySlug(req.params.id);
  if (!design) {
    res.status(404).json({ error: 'Decoration design not found' });
    return;
  }
  res.json({ design });
});

router.post('/admin/designs', authMiddleware, adminOnly, (req: Request, res: Response) => {
  try {
    const newDesign = db.createDesign(req.body);
    res.status(201).json({ design: newDesign, message: 'Design created successfully' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/admin/designs/:id', authMiddleware, adminOnly, (req: Request, res: Response) => {
  try {
    const updated = db.updateDesign(req.params.id, req.body);
    res.json({ design: updated, message: 'Design updated successfully' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/admin/designs/:id', authMiddleware, adminOnly, (req: Request, res: Response) => {
  const success = db.deleteDesign(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Design not found' });
    return;
  }
  res.json({ success: true, message: 'Design deleted successfully' });
});

// ----------------- ADD-ONS ROUTES -----------------
router.get('/add-ons', (req: Request, res: Response) => {
  const addOns = db.getAddOns(req.query.all === 'true');
  res.json({ addOns });
});

router.put('/admin/add-ons/:id', authMiddleware, adminOnly, (req: Request, res: Response) => {
  try {
    const updated = db.updateAddOn(req.params.id, req.body);
    res.json({ addOn: updated, message: 'Add-on updated' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------- BOOKINGS ROUTES -----------------
// Customer Creates Booking — Prices strictly recalculated server-side
router.post('/bookings', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required to book' });
      return;
    }

    const {
      designId,
      eventDate,
      eventTime,
      city,
      area,
      venueAddress,
      latitude,
      longitude,
      customerPhone,
      specialInstructions,
      addOnSelections,
    } = req.body;

    if (!designId || !eventDate || !eventTime || !city || !area || !venueAddress || !customerPhone) {
      res.status(400).json({
        error: 'Please fill in all required booking fields: design, date, time, city, area, venue address, and phone number.',
      });
      return;
    }

    const booking = db.createBooking({
      customerId: req.user.id,
      designId,
      eventDate,
      eventTime,
      city,
      area,
      venueAddress,
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
      customerPhone,
      specialInstructions,
      addOnSelections: Array.isArray(addOnSelections) ? addOnSelections : [],
    });

    res.status(201).json({
      booking,
      message: 'Booking created successfully!',
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to create booking' });
  }
});

// List Bookings — Customer sees only their own; Admin sees all
router.get('/bookings', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (req.user.role === 'admin') {
    const { status, paymentStatus, search } = req.query;
    const bookings = db.getAllBookings({
      status: status as string | undefined,
      paymentStatus: paymentStatus as string | undefined,
      search: search as string | undefined,
    });
    res.json({ bookings });
  } else {
    const bookings = db.getBookingsForUser(req.user.id);
    res.json({ bookings });
  }
});

router.get('/bookings/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const booking = db.getBookingById(req.params.id);
  if (!booking) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }

  // RLS enforcement: customer can only read their own booking
  if (req.user.role !== 'admin' && booking.customer_id !== req.user.id) {
    res.status(403).json({ error: 'Access denied: You do not have permission to view this booking.' });
    return;
  }

  res.json({ booking });
});

// Admin updates booking status / payment status
router.patch('/admin/bookings/:id/status', authMiddleware, adminOnly, (req: Request, res: Response) => {
  try {
    const { booking_status, payment_status } = req.body;
    const updated = db.updateBookingStatus(req.params.id, {
      booking_status,
      payment_status,
    });
    res.json({ booking: updated, message: 'Booking status updated successfully' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Customer cancels their booking
router.post('/bookings/:id/cancel', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const updated = db.cancelBookingByCustomer(req.params.id, req.user.id);
    res.json({ booking: updated, message: 'Booking has been cancelled.' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------- CONTACT MESSAGES -----------------
router.post('/contact', (req: Request, res: Response) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Name, email, and message are required' });
      return;
    }

    const saved = db.createContactMessage({ name, email, phone, message });
    res.status(201).json({
      message: 'Thank you! Your message has been received. Our team will contact you shortly.',
      contactMessage: saved,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/admin/messages', authMiddleware, adminOnly, (_req: Request, res: Response) => {
  const messages = db.getContactMessages();
  res.json({ messages });
});

router.patch('/admin/messages/:id', authMiddleware, adminOnly, (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const updated = db.updateContactMessageStatus(req.params.id, status);
    res.json({ message: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------- ADMIN DASHBOARD STATS -----------------
router.get('/admin/stats', authMiddleware, adminOnly, (_req: Request, res: Response) => {
  const stats = db.getAdminStats();
  res.json({ stats });
});

router.get('/admin/customers', authMiddleware, adminOnly, (_req: Request, res: Response) => {
  const customers = db.getAllCustomers();
  res.json({ customers });
});

export default router;
