import React from 'react';
import { categories } from '../lib/mockData';
import Container from './Container';

export default function CategorySection() {
  return (
    <section className="relative z-20 -mt-24 md:-mt-32 pb-16 bg-primary">
      <Container>
        <div className="text-center text-white mb-8 md:mb-12">
           <span className="block mb-2 opacity-90"><i className="lucide-sprout inline-block w-6 h-6"></i></span>
           <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-wide">Danh mục sản phẩm Nam Viet</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
            >
              <div className="w-16 h-16 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-300">
                <cat.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-primary transition-colors">{cat.name}</h3>
              <p className="text-gray-500 text-sm">{cat.subtitle}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}