import React from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Sparkles } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  currentPath,
  onNavigate,
}) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-[#0F2A1D]">
        <Sparkles className="w-8 h-8 text-[#6B9071] animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wider text-[#375534]">Verifying secure session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    const encoded = encodeURIComponent(currentPath);
    onNavigate(`/login?redirect=${encoded}`);
    return null;
  }

  return <>{children}</>;
};
