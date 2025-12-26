'use client';

import React from 'react';

interface FormLoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  children: React.ReactNode;
}

const FormLoadingOverlay: React.FC<FormLoadingOverlayProps> = ({
  isLoading,
  message = 'Loading...',
  children,
}) => {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="opacity-50">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/30 dark:bg-black/30 rounded-lg backdrop-blur-sm">
        <div className="text-center">
          <div className="inline-flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          {message && (
            <p className="mt-4 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormLoadingOverlay;
