import React from 'react';
import { formatPKR } from '../lib/constants.js';
import type { PackageTier } from '../types/database.js';

interface PriceDisplayProps {
  amount: number;
  tier?: PackageTier;
  label?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  amount,
  tier,
  label,
  size = 'md',
  showBadge = true,
}) => {
  const sizeClasses = {
    sm: 'text-base font-semibold',
    md: 'text-xl font-bold',
    lg: 'text-2xl font-extrabold',
    xl: 'text-3xl lg:text-4xl font-extrabold',
  };

  const tierBadgeStyles: Record<PackageTier, string> = {
    Classic: 'bg-white text-[#C00000] border-[#DE3C3C]/40 shadow-xs',
    Premium: 'bg-[#DE3C3C] text-white border-[#DE3C3C]',
    Luxury: 'bg-[#C00000] text-[#F7B32D] border-[#F7B32D]/50 shadow-sm',
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-col">
        {label && <span className="text-xs uppercase tracking-wider text-[#59616D] font-semibold">{label}</span>}
        <span className={`text-[#1A1D20] font-mono tracking-tight ${sizeClasses[size]}`}>
          {formatPKR(amount)}
        </span>
      </div>

      {tier && showBadge && (
        <span
          className={`px-2.5 py-1 text-xs font-bold rounded-full border uppercase tracking-wider ${tierBadgeStyles[tier]}`}
        >
          {tier}
        </span>
      )}
    </div>
  );
};
