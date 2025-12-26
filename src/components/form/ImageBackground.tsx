'use client';

import React, { useState } from 'react';

interface ImageBackgroundProps {
  imageSrc: string;
  fallbackImage?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  className?: string;
  brightness?: number;
  parallax?: boolean;
  gradientOverlay?: string;
}

const ImageBackground: React.FC<ImageBackgroundProps> = ({
  imageSrc,
  fallbackImage,
  overlay = true,
  overlayOpacity = 0.3,
  className = '',
  brightness = 1.2,
  parallax = false,
  gradientOverlay = 'from-black/30 via-transparent to-black/40'
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const finalImageSrc = imageError && fallbackImage ? fallbackImage : imageSrc;

  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
      {/* Background Image */}
      <div 
        className={`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-1000 ${
          parallax ? 'bg-fixed' : ''
        } ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
        style={{ 
          backgroundImage: `url(${finalImageSrc})`,
          filter: `brightness(${brightness}) contrast(1.1) saturate(1.1)`,
          transform: parallax ? 'translate3d(0, 0, 0)' : 'none'
        }}
      />

      {/* Loading placeholder */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-700 to-blue-800 animate-pulse" />
      )}

      {/* Preload image to trigger onLoad */}
      <img
        src={finalImageSrc}
        alt="background"
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        className="hidden"
      />

      {/* Gradient Overlay */}
      {overlay && (
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${gradientOverlay}`}
          style={{ opacity: overlayOpacity }}
        />
      )}
    </div>
  );
};

export default ImageBackground;
