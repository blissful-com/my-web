import React, { useState } from 'react';
import {
  Sparkles,
  Menu,
  X,
  User,
  ShieldCheck,
  Calendar,
  LogOut,
  Phone,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { BRAND } from '../lib/constants.js';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Designs', path: '/designs' },
    { name: 'How It Works', path: '/#how-it-works' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLinkClick = (path: string) => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    if (path.startsWith('/#')) {
      if (currentPath !== '/') {
        onNavigate('/');
        setTimeout(() => {
          const el = document.getElementById(path.replace('/#', ''));
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const el = document.getElementById(path.replace('/#', ''));
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      onNavigate(path);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    onNavigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#C00000] text-white border-b border-[#8F0000] shadow-lg">
      {/* Top emergency / booking hotline ticker */}
      <div className="bg-[#8F0000] py-1.5 px-4 text-xs font-medium text-white/90 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F7B32D] animate-ping" />
            <span className="text-[11px] font-bold text-[#F7B32D] uppercase tracking-wider">
              Wedding Season Booking Active
            </span>
            <span className="hidden sm:inline text-white/40">|</span>
            <span className="hidden sm:inline text-white/90 text-xs">Available across Lahore, Islamabad, Karachi & Faisalabad</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <a
              href={`tel:${BRAND.phone}`}
              className="flex items-center gap-1.5 text-white hover:text-[#F7B32D] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#F7B32D]" />
              <span>{BRAND.phone}</span>
            </a>
            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex px-2 py-0.5 rounded bg-[#25D366] text-white text-[10px] font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              WhatsApp Support
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div
            onClick={() => handleLinkClick('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#8F0000] border border-[#F7B32D]/60 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-6 h-6 text-[#F7B32D] animate-glow" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-serif font-extrabold tracking-wider text-white">
                  GLOWORA
                </span>
                <span className="text-xs font-bold px-1.5 py-0.2 rounded bg-[#F7B32D] text-[#8F0000]">
                  PK
                </span>
              </div>
              <span className="text-[10px] tracking-widest text-[#F8F9FC]/80 uppercase font-medium">
                {BRAND.tagline}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.name}
                  onClick={() => handleLinkClick(link.path)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#8F0000] text-[#F7B32D] shadow-inner'
                      : 'text-[#F8F9FC] hover:text-[#F7B32D] hover:bg-[#DE3C3C]/60'
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
          </nav>

          {/* User / CTA Area */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#8F0000] hover:bg-[#8F0000]/90 text-white border border-white/20 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#C00000] flex items-center justify-center text-[#F7B32D] font-bold text-xs border border-[#F7B32D]/40">
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold leading-tight truncate max-w-[120px]">
                      {user.full_name}
                    </span>
                    <span className="text-[10px] text-[#F7B32D] capitalize">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-white/70" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#8F0000] border border-white/20 shadow-2xl py-2 z-50 text-white">
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-xs text-white/70">Signed in as</p>
                      <p className="text-xs font-bold text-[#F7B32D] truncate">{user.email}</p>
                    </div>

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleLinkClick('/admin')}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-[#F7B32D] hover:bg-[#C00000] transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleLinkClick('/account/bookings')}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#C00000] transition-colors"
                    >
                      <Calendar className="w-4 h-4 text-[#F7B32D]" />
                      <span>My Bookings</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLinkClick('/account/profile')}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#C00000] transition-colors"
                    >
                      <User className="w-4 h-4 text-white/70" />
                      <span>Profile Settings</span>
                    </button>

                    <div className="border-t border-white/10 my-1" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-200 hover:bg-[#C00000] transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleLinkClick('/login')}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:text-[#F7B32D] transition-colors"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => handleLinkClick('/signup')}
                  className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F7B32D] text-[#8F0000] hover:bg-white shadow-md transition-all hover:scale-105"
                >
                  Sign Up
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => handleLinkClick('/designs')}
              className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#DE3C3C] text-white hover:bg-[#8F0000] border border-[#F7B32D]/40 shadow-md transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F7B32D]" />
              <span>Book Decoration</span>
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-white hover:bg-[#8F0000] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#8F0000] border-b border-white/10 px-4 pt-2 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleLinkClick(link.path)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  currentPath === link.path
                    ? 'bg-[#C00000] text-[#F7B32D]'
                    : 'text-white hover:bg-[#C00000]/60'
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 space-y-2">
            {isAuthenticated && user ? (
              <>
                <div className="px-4 py-2 bg-[#C00000]/70 rounded-xl mb-2">
                  <p className="text-xs font-bold text-white">{user.full_name}</p>
                  <p className="text-[11px] text-white/70">{user.email}</p>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => handleLinkClick('/admin')}
                    className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-[#F7B32D] bg-[#C00000]"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Dashboard</span>
                  </button>
                )}

                <button
                  onClick={() => handleLinkClick('/account/bookings')}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#C00000]/50"
                >
                  <Calendar className="w-4 h-4 text-[#F7B32D]" />
                  <span>My Bookings</span>
                </button>

                <button
                  onClick={() => handleLinkClick('/account/profile')}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#C00000]/50"
                >
                  <User className="w-4 h-4 text-white/80" />
                  <span>Profile Settings</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-200 hover:bg-rose-950/40"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => handleLinkClick('/login')}
                  className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-center border border-white/40 text-white"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleLinkClick('/signup')}
                  className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-center bg-[#F7B32D] text-[#8F0000]"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
