'use client';

import React from 'react';
import ReactQueryProvider from './ReactQueryProvider';
import { CartProvider } from './CartProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
      <ReactQueryProvider>
        <CartProvider>{children}</CartProvider>
      </ReactQueryProvider>
  );
}