import React from 'react';
import { useAuth } from '../context/AuthContext.js';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
  onNavigate: (path: string) => void;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children, onNavigate }) => {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-[#0F2A1D]">
        <div className="w-8 h-8 border-4 border-[#375534] border-t-[#f7b32d] rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wider text-[#375534]">Checking administrator authorization...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    onNavigate('/login?redirect=/admin');
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-red-200 shadow-xl text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#0F2A1D] mb-2">Administrator Access Required</h2>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          The requested management portal is restricted to authorized Glowora administrative staff only. Your account ({user?.email}) is registered as a customer.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0F2A1D] text-[#E3EED4] text-xs font-bold uppercase tracking-wider hover:bg-[#375534] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
