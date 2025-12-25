'use client';

import React, { useState, forwardRef, useEffect } from 'react';

export interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  showPasswordToggle?: boolean;
  variant?: 'default' | 'floating' | 'minimal' | 'neon';
  animationType?: 'focus' | 'glow' | 'ripple' | 'slide' | 'bounce' | 'gradient' | 'wave' | 'aurora' | 'crystal';
  glowColor?: 'blue' | 'green' | 'purple' | 'red' | 'ocean' | 'sunset' | 'forest' | 'rose' | 'aurora';
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({
    label,
    error,
    success,
    showPasswordToggle = false,
    variant = 'default',
    animationType = 'focus',
    glowColor = 'blue',
    type = 'text',
    className = '',
    onFocus,
    onBlur,
    onChange,
    onKeyDown,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const actualType = type === 'password' && showPassword ? 'text' : type;

    useEffect(() => {
      setHasValue(Boolean(props.value && props.value.toString().length > 0));
    }, [props.value]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(Boolean(e.target.value.length));
      onChange?.(e);
    };

    const colorSchemes = {
      blue: {
        border: 'border-blue-500',
        ring: 'ring-blue-500/20',
        text: 'text-blue-600',
        glow: 'shadow-blue-500/25',
      },
      ocean: {
        border: 'border-cyan-500',
        ring: 'ring-cyan-500/20',
        text: 'text-cyan-600',
        glow: 'shadow-cyan-500/25',
      },
      green: {
        border: 'border-emerald-500',
        ring: 'ring-emerald-500/20',
        text: 'text-emerald-600',
        glow: 'shadow-emerald-500/25',
      },
      purple: {
        border: 'border-violet-500',
        ring: 'ring-violet-500/20',
        text: 'text-violet-600',
        glow: 'shadow-violet-500/25',
      },
      red: {
        border: 'border-rose-500',
        ring: 'ring-rose-500/20',
        text: 'text-rose-600',
        glow: 'shadow-rose-500/25',
      },
    };

    const colors = error 
      ? colorSchemes.red 
      : success 
        ? colorSchemes.green 
        : colorSchemes[glowColor as keyof typeof colorSchemes] || colorSchemes.blue;

    const baseInputClasses = `
      w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ease-out
      bg-white dark:bg-neutral-900
      text-neutral-900 dark:text-neutral-100
      placeholder:text-neutral-400 dark:placeholder:text-neutral-600
      focus:outline-none
      ${isFocused || hasValue ? `${colors.border} ${colors.ring} ring-2` : 'border-neutral-300 dark:border-neutral-700'}
      ${error ? 'border-red-500 ring-2 ring-red-500/20' : ''}
      ${showPasswordToggle && type === 'password' ? 'pr-12' : ''}
      ${className}
    `;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            type={actualType}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            onKeyDown={onKeyDown}
            className={baseInputClasses}
            {...props}
          />

          {showPasswordToggle && type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          )}
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            <span>⚠</span>
            {error}
          </p>
        )}

        {success && (
          <p className="text-green-500 text-sm mt-2 flex items-center gap-1">
            <span>✓</span>
            {success}
          </p>
        )}
      </div>
    );
  }
);

AnimatedInput.displayName = 'AnimatedInput';

export default AnimatedInput;
