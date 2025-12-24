import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  noPadding?: boolean;
}

export default function Container({ 
  children, 
  className = '', 
  size = 'lg',
  noPadding = false 
}: ContainerProps) {
  
  const sizeClasses = {
    sm: 'max-w-4xl',      // ~896px
    md: 'max-w-5xl',      // ~1024px
    lg: 'max-w-7xl',      // ~1280px - Default
    xl: 'max-w-[1440px]', // 1440px (giống ảnh 2)
    full: 'max-w-full'
  };

  const paddingClasses = noPadding ? '' : 'px-4 lg:px-8';

  return (
    <div className={`${sizeClasses[size]} mx-auto ${paddingClasses} ${className}`}>
      {children}
    </div>
  );
}