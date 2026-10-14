import React, { useState } from 'react';
import { Sparkles, ImageOff } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: '4/3' | '16/9' | '1/1' | 'auto';
  className?: string;
  fallbackText?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'Event lighting decoration by Glowora',
  className = '',
  aspectRatio = '4/3',
  fallbackText = 'Glowora Lighting Setup',
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const aspectClass =
    aspectRatio === '4/3'
      ? 'aspect-[4/3]'
      : aspectRatio === '16/9'
      ? 'aspect-[16/9]'
      : aspectRatio === '1/1'
      ? 'aspect-square'
      : '';

  return (
    <div className={`relative overflow-hidden bg-[#375534]/15 ${aspectClass} ${className}`}>
      {/* Loading Skeleton */}
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0F2A1D]/10 animate-pulse z-0">
          <Sparkles className="w-6 h-6 text-[#6B9071] animate-spin opacity-50" />
        </div>
      )}

      {/* Error Fallback */}
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0F2A1D]/20 text-[#0F2A1D] p-4 text-center">
          <ImageOff className="w-8 h-8 text-[#6B9071] mb-2 opacity-70" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#375534]">{fallbackText}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover object-center transition-all duration-500 ${
            loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          {...rest}
        />
      )}
    </div>
  );
};
