# ✨ GLOWORA — Premium Event Lighting Decoration Booking Website (Pakistan)

> **"Light Up Every Moment"**  
> Luxury event lighting decoration and celebration setup services across Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, and Multan.

---

## 🎨 Color Palette & Design Tokens

Implemented strictly per brand specifications:

| Token | Hex Value | Role in Design System |
| :--- | :--- | :--- |
| `--color-forest-dark` | `#0F2A1D` | Primary headers, footers, badges, and luxury emphasis |
| `--color-forest` | `#375534` | Primary brand accent, cards, buttons, borders |
| `--color-sage` | `#6B9071` | Secondary buttons, subtle dividers, highlights |
| `--color-sage-light` | `#AEC3B0` | Muted typography, tags, borders |
| `--color-cream` | `#E3EED4` | Main background and card container fills |
| `--color-gold` | `#f7b32d` | Celebratory fairy-light shimmers, marquee stars, active badges |

---

## 🌟 Key Features

1. **Six Signature Event Categories**:
   - **Birthday** (`/events/birthday`)
   - **Mehndi** (`/events/mehndi`)
   - **Engagement** (`/events/engagement`)
   - **Parties** (`/events/parties`)
   - **Barat** (`/events/barat`)
   - **Waleema** (`/events/waleema`)

2. **18 Authentic Tailored Designs (3 Per Category)**:
   - Each category contains distinct **Classic** (PKR 15k-25k), **Premium** (PKR 30k-50k), and **Luxury** (PKR 60k-100k) tiers with itemized equipment, setup duration, and venue recommendations.

3. **Secure Full-Stack Booking Flow**:
   - **Server-Side Trusted Price Recalculation**: The frontend submits only selected `designId` and `addOnSelections`; the backend fetches authoritative database prices and computes the subtotal and total.
   - **Preserved Login Flow**: Unauthenticated users clicking "Book This Design" are redirected to `/login?redirect=...` and immediately returned to the booking form after signing in without losing their selected package.
   - **Unique Human-Friendly References**: Generated as `GLW-2026-XXXX`.
   - **Celebration Confetti**: Rendered on booking confirmation passes.

4. **Role-Based Access Control (RBAC)**:
   - Customers can only inspect their own bookings and update allowed profile fields.
   - Administrator portal (`/admin`) enforces authorized admin roles and grants complete control over bookings, prices, designs, categories, and inquiries.

5. **Pakistani Banking & Payment Workflow**:
   - Meezan Bank IBAN, Raast, and Cash-on-Site setup agreements.
   - Payment status is strictly decoupled from booking confirmation status.

---

## 🔑 Demo Credentials For Instant Testing

Quick test buttons are available directly on the login screen:

- **Administrator**:
  - Email: `admin@glowora.pk`
  - Password: `admin123456`
  - Capabilities: Full access to `/admin`, stats, price edits, booking approvals.

- **Sample Customer**:
  - Email: `client@glowora.pk`
  - Password: `customer123`
  - Capabilities: Booking creation, viewing personal order history, profile settings.

- **New Customers**: Can register at `/signup` with any email, full name, and Pakistani mobile number (`0300-XXXXXXX`).

---

## 📁 Project Structure

```
├── server.ts                    # Full-stack server entrypoint mounting Express & Vite
├── server/
│   ├── db.ts                    # Persistent database engine with JSON storage & transactions
│   └── routes.ts                # REST API endpoints with auth & role middleware
├── src/
│   ├── components/              # Navbar, Footer, EventCard, DesignCard, PriceDisplay, etc.
│   ├── context/                 # AuthContext
│   ├── lib/                     # API client, brand constants, Pakistani cities
│   ├── pages/                   # Home, Events, Designs, Booking, Checkout, Confirmation
│   │   └── admin/               # AdminDashboard, AdminBookings, AdminDesigns, AdminEvents, etc.
│   ├── types/                   # TypeScript interfaces matching PostgreSQL schema
│   ├── App.tsx                  # Main client-side router and route guards
│   ├── index.css                # Tailwind CSS v4 variables and custom animations
│   └── main.tsx
└── supabase/
    ├── migrations/20260401_init.sql  # Complete PostgreSQL schema with RLS policies
    └── seed.sql                      # SQL seed data for 6 events and 18 designs
```

---

## 🚀 Running and Deploying

```bash
# Development (starts Express + Vite on port 3000)
npm run dev

# Lint / Type Check
npm run lint

# Production Build
npm run build
npm start
```
