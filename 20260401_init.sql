-- GLOWORA EVENT LIGHTING DECORATION — POSTGRESQL SCHEMA WITH RLS
-- Created for Glowora Pakistan (Lahore, Karachi, Islamabad, etc.)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. EVENTS CATEGORY TABLE
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. DESIGNS TABLE
CREATE TABLE IF NOT EXISTS public.designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tier TEXT NOT NULL CHECK (tier IN ('Classic', 'Premium', 'Luxury')),
  description TEXT NOT NULL,
  full_description TEXT,
  image_url TEXT,
  price_pkr NUMERIC(12,2) NOT NULL CHECK (price_pkr >= 0),
  included_services JSONB NOT NULL DEFAULT '[]'::JSONB,
  lighting_equipment JSONB NOT NULL DEFAULT '[]'::JSONB,
  setup_time TEXT,
  venue_type TEXT,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference TEXT NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  design_id UUID NOT NULL REFERENCES public.designs(id) ON DELETE RESTRICT,
  event_name_snapshot TEXT NOT NULL,
  design_name_snapshot TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  city TEXT NOT NULL,
  area TEXT NOT NULL,
  venue_address TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  customer_phone TEXT NOT NULL,
  special_instructions TEXT,
  subtotal_pkr NUMERIC(12,2) NOT NULL CHECK (subtotal_pkr >= 0),
  add_on_total_pkr NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (add_on_total_pkr >= 0),
  total_pkr NUMERIC(12,2) NOT NULL CHECK (total_pkr >= 0),
  booking_status TEXT NOT NULL DEFAULT 'pending' CHECK (
    booking_status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rejected')
  ),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (
    payment_status IN ('unpaid', 'pending', 'paid', 'failed', 'refunded')
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. ADD-ONS TABLE
CREATE TABLE IF NOT EXISTS public.add_ons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_pkr NUMERIC(12,2) NOT NULL CHECK (price_pkr >= 0),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. BOOKING ADD-ONS JUNCTION TABLE
CREATE TABLE IF NOT EXISTS public.booking_add_ons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  add_on_id UUID NOT NULL REFERENCES public.add_ons(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_pkr NUMERIC(12,2) NOT NULL CHECK (unit_price_pkr >= 0)
);

-- 7. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_designs_event_id ON public.designs(event_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_design_id ON public.bookings(design_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_bookings_ref ON public.bookings(booking_reference);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.add_ons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_add_ons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- HELPER FUNCTIONS FOR SECURITY
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS POLICIES

-- Profiles
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile except role"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  );

-- Events & Designs (Public read active, Admin write)
CREATE POLICY "Public read active events"
  ON public.events FOR SELECT
  USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admin manage events"
  ON public.events FOR ALL
  USING (public.is_admin());

CREATE POLICY "Public read available designs"
  ON public.designs FOR SELECT
  USING (is_available = TRUE OR public.is_admin());

CREATE POLICY "Admin manage designs"
  ON public.designs FOR ALL
  USING (public.is_admin());

-- Add-ons
CREATE POLICY "Public read active add-ons"
  ON public.add_ons FOR SELECT
  USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admin manage add-ons"
  ON public.add_ons FOR ALL
  USING (public.is_admin());

-- Bookings (Customers read own, Admin full manage)
CREATE POLICY "Customers read own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = customer_id OR public.is_admin());

CREATE POLICY "Customers insert bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Admin update bookings"
  ON public.bookings FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Customers read own booking add-ons"
  ON public.booking_add_ons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = booking_id AND (b.customer_id = auth.uid() OR public.is_admin())
    )
  );

-- Contact Messages
CREATE POLICY "Public submit contact message"
  ON public.contact_messages FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Admin read and manage contact messages"
  ON public.contact_messages FOR ALL
  USING (public.is_admin());
