'use client';

import React, { forwardRef } from 'react';

export interface EnhancedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  gradient?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    loadingText,
    leftIcon,
    rightIcon,
    fullWidth = false,
    gradient = false,
    rounded = 'lg',
    disabled,
    className = '',
    ...props
  }, ref) => {
    const sizeClasses = {
      xs: 'h-8 px-3 text-xs font-medium',
      sm: 'h-9 px-4 text-sm font-medium',
      md: 'h-11 px-6 text-base font-medium',
      lg: 'h-12 px-8 text-lg font-semibold',
      xl: 'h-14 px-10 text-xl font-semibold'
    };

    const roundedClasses = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full'
    };

    const baseClasses = `
      inline-flex items-center justify-center gap-2
      font-medium text-center transition-all duration-200 ease-out
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      transform hover:scale-105 active:scale-95
      ${sizeClasses[size]}
      ${roundedClasses[rounded]}
      ${fullWidth ? 'w-full' : ''}
    `;

    const variantClasses = {
      primary: gradient
        ? `
          bg-gradient-to-r from-blue-600 to-blue-700 
          hover:from-blue-700 hover:to-blue-800 
          text-white shadow-lg hover:shadow-lg hover:shadow-blue-500/25
          focus:ring-blue-500
        `
        : `
          bg-blue-600 hover:bg-blue-700 
          text-white shadow-lg hover:shadow-lg hover:shadow-blue-500/25
          focus:ring-blue-500
        `,
      secondary: `
        bg-neutral-100 hover:bg-neutral-200 
        dark:bg-neutral-800 dark:hover:bg-neutral-700
        text-neutral-900 dark:text-neutral-100
        shadow-sm hover:shadow-md
        focus:ring-neutral-500
      `,
      outline: `
        border-2 border-blue-600 hover:border-blue-700
        text-blue-600 hover:text-blue-700 hover:bg-blue-50
        dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20
        focus:ring-blue-500
      `,
      ghost: `
        text-blue-600 hover:text-blue-700 hover:bg-blue-50
        dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20
        focus:ring-blue-500
      `,
      danger: `
        bg-red-600 hover:bg-red-700 
        text-white shadow-lg hover:shadow-error
        focus:ring-red-500
      `,
      success: `
        bg-gradient-to-r from-blue-600 to-blue-700 
        hover:from-blue-700 hover:to-blue-800
        text-white shadow-lg hover:shadow-lg hover:shadow-blue-500/25
        focus:ring-blue-500
      `
    };

    const LoadingSpinner = () => (
      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
    );

    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          ${baseClasses}
          ${variantClasses[variant]}
          ${isDisabled ? 'hover:scale-100 active:scale-100' : ''}
          ${className}
        `}
        {...props}
      >
        {loading ? (
          <LoadingSpinner />
        ) : leftIcon ? (
          <span className="flex-shrink-0">{leftIcon}</span>
        ) : null}

        <span className={loading ? 'opacity-70' : ''}>
          {loading && loadingText ? loadingText : children}
        </span>

        {!loading && rightIcon && (
          <span className="flex-shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

EnhancedButton.displayName = 'EnhancedButton';

export default EnhancedButton;
