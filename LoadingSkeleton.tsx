import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white/80 rounded-2xl overflow-hidden shadow-sm border border-[#6B9071]/20 animate-pulse">
      <div className="aspect-[4/3] bg-[#375534]/15 w-full" />
      <div className="p-5 space-y-3">
        <div className="h-6 bg-[#375534]/15 rounded w-3/4" />
        <div className="h-4 bg-[#375534]/10 rounded w-full" />
        <div className="h-4 bg-[#375534]/10 rounded w-2/3" />
        <div className="pt-3 border-t border-[#6B9071]/15 flex justify-between items-center">
          <div className="h-6 bg-[#375534]/20 rounded w-1/3" />
          <div className="h-9 bg-[#375534]/25 rounded-xl w-1/3" />
        </div>
      </div>
    </div>
  );
};

export const GridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {Array.from({ length: count }).map((_, idx) => (
        <CardSkeleton key={idx} />
      ))}
    </div>
  );
};
