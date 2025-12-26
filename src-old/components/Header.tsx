import React from 'react';
import { Phone, User, ShoppingCart, Menu, Sun } from 'lucide-react';
import { navLinks } from '../../src/lib/mockData';
import Container from './Container';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <Container>
        <div className="h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
             <div className="w-19 h-19 mb-3">
              <img
                src="/images/logo.gif"
                alt="Logo Công ty Nam Việt"
                className="w-full h-full object-contain"
              />
            </div>

             <span className="font-display font-bold text-2xl text-primary tracking-tight">NAM VIET</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-semibold uppercase tracking-wide transition-colors duration-200 ${
                  link.active ? 'text-primary' : 'text-gray-600 hover:text-primary'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full shadow-md hover:bg-primary-dark transition-colors cursor-pointer">
               <Phone size={18} />
               <span className="font-bold text-sm">1800 66 25</span>
            </div>
            
            <button className="p-2 text-gray-500 hover:text-primary transition-colors">
              <User size={20} />
            </button>
            
            <button className="p-2 text-gray-500 hover:text-primary transition-colors relative">
              <ShoppingCart size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <button className="p-2 text-gray-500 hover:text-primary transition-colors">
               <Sun size={20} />
            </button>

            <button className="md:hidden p-2 text-gray-600">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
}