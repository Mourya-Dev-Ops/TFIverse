'use client';

import { useState } from 'react';

interface SmartImageProps {
  src: string | undefined;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  onLoad?: () => void;
}

export default function SmartImage({ 
  src, 
  alt, 
  fallbackSrc = '/images/placeholder.png',
  className = '',
  onLoad
}: SmartImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && fallbackSrc !== imgSrc) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={onLoad}
      loading="lazy"
    />
  );
}
