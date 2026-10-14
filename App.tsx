import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { ProtectedRoute } from './components/ProtectedRoute.js';
import { AdminRoute } from './components/AdminRoute.js';
import { ErrorBoundary } from './components/ErrorBoundary.js';

// Customer & Public Pages
import { Home } from './pages/Home.js';
import { Events } from './pages/Events.js';
import { EventDetails } from './pages/EventDetails.js';
import { Designs } from './pages/Designs.js';
import { DesignDetails } from './pages/DesignDetails.js';
import { Login } from './pages/Login.js';
import { Signup } from './pages/Signup.js';
import { ForgotPassword } from './pages/ForgotPassword.js';
import { Booking } from './pages/Booking.js';
import { Checkout } from './pages/Checkout.js';
import { BookingConfirmation } from './pages/BookingConfirmation.js';
import { CustomerBookings } from './pages/CustomerBookings.js';
import { Profile } from './pages/Profile.js';
import { Contact } from './pages/Contact.js';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard.js';
import { AdminEvents } from './pages/admin/AdminEvents.js';
import { AdminDesigns } from './pages/admin/AdminDesigns.js';
import { AdminBookings } from './pages/admin/AdminBookings.js';
import { AdminCustomers } from './pages/admin/AdminCustomers.js';
import { AdminMessages } from './pages/admin/AdminMessages.js';

function AppContent() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname + window.location.search;
  });

  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(window.location.pathname + window.location.search);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route Parser
  const [pathname, search] = currentPath.split('?');
  const searchParams = new URLSearchParams(search || '');

  const renderRoute = () => {
    // 1. Home
    if (pathname === '/' || pathname === '') {
      return <Home onNavigate={navigate} />;
    }

    // 2. Events List
    if (pathname === '/events') {
      return <Events onNavigate={navigate} />;
    }

    // 3. Event Details: /events/:slug
    if (pathname.startsWith('/events/')) {
      const slug = pathname.replace('/events/', '');
      return <EventDetails slug={slug} onNavigate={navigate} />;
    }

    // 4. Designs List: /designs
    if (pathname === '/designs') {
      return <Designs onNavigate={navigate} />;
    }

    // 5. Design Details: /designs/:id
    if (pathname.startsWith('/designs/')) {
      const id = pathname.replace('/designs/', '');
      return <DesignDetails designId={id} onNavigate={navigate} />;
    }

    // 6. Login
    if (pathname === '/login') {
      const redirect = searchParams.get('redirect') || undefined;
      return <Login redirectPath={redirect} onNavigate={navigate} />;
    }

    // 7. Signup
    if (pathname === '/signup') {
      const redirect = searchParams.get('redirect') || undefined;
      return <Signup redirectPath={redirect} onNavigate={navigate} />;
    }

    // 8. Forgot Password
    if (pathname === '/forgot-password') {
      return <ForgotPassword onNavigate={navigate} />;
    }

    // 9. Booking Form: /booking/:designId (Protected)
    if (pathname.startsWith('/booking/')) {
      const designId = pathname.replace('/booking/', '');
      return (
        <ProtectedRoute currentPath={currentPath} onNavigate={navigate}>
          <Booking designId={designId} onNavigate={navigate} />
        </ProtectedRoute>
      );
    }

    // 10. Checkout: /checkout/:bookingId (Protected)
    if (pathname.startsWith('/checkout/')) {
      const bookingId = pathname.replace('/checkout/', '');
      return (
        <ProtectedRoute currentPath={currentPath} onNavigate={navigate}>
          <Checkout bookingId={bookingId} onNavigate={navigate} />
        </ProtectedRoute>
      );
    }

    // 11. Booking Confirmation: /booking-confirmation/:bookingId
    if (pathname.startsWith('/booking-confirmation/')) {
      const bookingId = pathname.replace('/booking-confirmation/', '');
      return <BookingConfirmation bookingId={bookingId} onNavigate={navigate} />;
    }

    // 12. Account & Customer Bookings
    if (pathname === '/account' || pathname === '/account/bookings') {
      return (
        <ProtectedRoute currentPath={currentPath} onNavigate={navigate}>
          <CustomerBookings onNavigate={navigate} />
        </ProtectedRoute>
      );
    }

    // 13. Customer Profile
    if (pathname === '/account/profile') {
      return (
        <ProtectedRoute currentPath={currentPath} onNavigate={navigate}>
          <Profile />
        </ProtectedRoute>
      );
    }

    // 14. Contact
    if (pathname === '/contact') {
      return <Contact />;
    }

    // 15. Admin Routes
    if (pathname === '/admin') {
      return (
        <AdminRoute onNavigate={navigate}>
          <AdminDashboard onNavigate={navigate} />
        </AdminRoute>
      );
    }

    if (pathname === '/admin/bookings') {
      return (
        <AdminRoute onNavigate={navigate}>
          <AdminBookings onNavigate={navigate} />
        </AdminRoute>
      );
    }

    if (pathname === '/admin/designs') {
      return (
        <AdminRoute onNavigate={navigate}>
          <AdminDesigns onNavigate={navigate} />
        </AdminRoute>
      );
    }

    if (pathname === '/admin/events') {
      return (
        <AdminRoute onNavigate={navigate}>
          <AdminEvents onNavigate={navigate} />
        </AdminRoute>
      );
    }

    if (pathname === '/admin/customers') {
      return (
        <AdminRoute onNavigate={navigate}>
          <AdminCustomers onNavigate={navigate} />
        </AdminRoute>
      );
    }

    if (pathname === '/admin/messages') {
      return (
        <AdminRoute onNavigate={navigate}>
          <AdminMessages onNavigate={navigate} />
        </AdminRoute>
      );
    }

    // Fallback: Return Home
    return <Home onNavigate={navigate} />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FC] text-[#1A1D20]">
      <Navbar currentPath={pathname} onNavigate={navigate} />
      <main className="flex-1">{renderRoute()}</main>
      <Footer onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}
