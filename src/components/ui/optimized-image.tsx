'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  onLoad,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={cn('relative', className)} style={{ width, height }}>
      {/* Show blur placeholder while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded" />
      )}
      
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn("object-cover transition-opacity duration-300", 
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        loading={priority ? 'eager' : 'lazy'}
        quality={80} // Lower quality for faster load
        onLoadingComplete={() => {
          setIsLoaded(true);
          onLoad?.();
        }}
        {...props}
      />
    </div>
  );
}