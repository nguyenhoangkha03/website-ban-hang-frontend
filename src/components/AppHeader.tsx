'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X, Heart } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useCartTotals } from '@/stores/cartStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import UserNav from './user-profile/UserNav';

import { useAddItemToCart } from '@/hooks/api/useCartApi';
export default function AppHeader() {
  const { totalItems } = useCartTotals();
  const { items: wishlistItems } = useWishlistStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const navLinks = useMemo(() => {
    return [
      { href: '/', label: 'Trang chủ' },
      { href: '/product', label: 'Sản phẩm' },
      { href: '/suppliers', label: 'Nhà Cung Cấp' },
      { href: '/orders', label: 'Đơn hàng' },
      { href: '/cart', label: 'Giỏ hàng' },
    ];
  }, []);

  // Define text and background colors based on the page
  const headerClasses = isHomePage 
    ? 'bg-transparent text-white' 
    : 'bg-white/80 backdrop-blur-sm text-gray-800 border-b border-gray-200';
  
  const linkClasses = isHomePage 
    ? 'text-white hover:bg-white/10' 
    : 'text-gray-700 hover:text-primary hover:bg-gray-100';

  const logoTextClasses = isHomePage ? 'text-white' : 'text-gray-900';
  const logoIconContainerClasses = isHomePage ? 'bg-white' : 'bg-primary';
  const logoIconClasses = isHomePage ? 'text-primary' : 'text-white';


  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${headerClasses}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${logoIconContainerClasses}`}>
              <ShoppingCart className={`w-6 h-6 ${logoIconClasses}`} />
            </div>
            <span className={`text-2xl font-bold ${logoTextClasses}`}>
              Nông Nghiệp Shop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className={`font-medium transition-colors px-3 py-2 rounded-md text-sm ${linkClasses}`}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex-1 flex justify-end items-center gap-2">
            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Link href="/wishlist" className={`relative p-2 rounded-lg transition-colors ${linkClasses}`}>
                <Heart className="w-6 h-6" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
              <Link href="/cart" className={`relative p-2 rounded-lg transition-colors ${linkClasses}`}>
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>

              <UserNav />

              <button
                className={`md:hidden p-2 rounded-lg transition-colors ${linkClasses}`}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200 py-4 px-4">
          <nav className="flex flex-col gap-2">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="px-4 py-2.5 text-gray-800 hover:bg-gray-100 rounded-lg font-semibold transition-colors" onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
