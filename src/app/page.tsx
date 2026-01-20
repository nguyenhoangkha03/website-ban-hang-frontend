'use client'; 

import Hero from '@/components/layout/Hero';
import CategorySection from '@/components/layout/CategorySection';
import ProductSection from '@/components/layout/ProductSection';
import AboutSection from '@/components/layout/AboutSection';
import NewsSection from '@/components/layout/NewsSection';

import { durianProducts, riceProducts, otherProducts } from '@/lib/mockData';
import { Flower, Wheat, Sprout } from 'lucide-react';

const PartnersSection = () => (
  <section className="py-12 border-t border-b border-gray-100 bg-white">
    <div className="container mx-auto px-4">
      <h3 className="text-center font-bold text-gray-400 uppercase tracking-widest text-sm mb-8">Đối tác chiến lược</h3>
      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
        <span className="text-2xl font-black text-gray-300 font-display">BIOAGRI</span>
        <span className="text-2xl font-black text-gray-300 font-display">GREENLIFE</span>
        <span className="text-2xl font-black text-gray-300 font-display">AGROTEX</span>
        <span className="text-2xl font-black text-gray-300 font-display">FARMCARE</span>
        <span className="text-2xl font-black text-gray-300 font-display">SUNRICE</span>
      </div>
    </div>
  </section>
);

export default function Home() {
  return (
     // 👇 Không cần thẻ <main> bao quanh nữa vì layout đã có rồi, hoặc giữ lại div cũng được
     <div className="selection:bg-primary selection:text-white">
      
      <Hero />
      <CategorySection />
      
      <div id="products" className="space-y-12 py-12">
        <ProductSection 
          title="Giải pháp cho Sầu Riêng" 
          products={durianProducts} 
          icon={Sprout}
        />
        
        <ProductSection 
          title="Giải pháp cho Cây Lúa" 
          products={riceProducts} 
          bgColor="bg-green-50"
          icon={Wheat}
        />
        
        <ProductSection 
          title="Các Cây Trồng Khác" 
          products={otherProducts} 
          icon={Flower}
        />
      </div>

      <AboutSection />
      <PartnersSection />
      <NewsSection />

    </div>
  );
}