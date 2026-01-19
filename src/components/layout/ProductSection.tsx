import React from 'react';
import { Eye, ShoppingCart, Leaf } from 'lucide-react';
import { Product } from '@/lib/mockData';
import Container from './Container';

interface ProductSectionProps {
  title: string;
  products: Product[];
  bgColor?: string;
  icon?: React.ElementType;
}

export default function ProductSection({ title, products, bgColor = 'bg-white', icon: Icon = Leaf }: ProductSectionProps) {
  return (
    <section className={`py-16 md:py-20 ${bgColor}`}>
      <Container>
        {/* Section Header */}
        <div className="flex items-center justify-center mb-12 gap-3">
          <Icon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
          <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-800 uppercase text-center">
            Giải pháp cho {title}
          </h2>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
              {/* Image Area */}
              <div className="relative h-64 bg-gray-50 p-6 flex items-center justify-center">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply"
                />
                
                {/* Tags */}
                {product.tag && (
                  <span className={`absolute top-3 left-3 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${product.tagColor}`}>
                    {product.tag}
                  </span>
                )}

                {/* Overlay Actions (Desktop) */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content Area */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-1 tracking-wide">{product.type}</div>
                <h3 className="font-bold text-gray-800 text-lg mb-4 line-clamp-2 hover:text-primary cursor-pointer transition-colors">
                  {product.name}
                </h3>
                
                {/* Actions */}
                <div className="mt-auto flex items-center gap-2 pt-4 border-t border-gray-50">
                   <button className="p-2.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-blue-500 hover:text-white transition-colors">
                     <Eye size={18} />
                   </button>
                   <button className="p-2.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-primary hover:text-white transition-colors">
                     <ShoppingCart size={18} />
                   </button>
                   <button className="flex-1 py-2.5 px-4 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors shadow-lg shadow-green-100">
                     Mua ngay
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <button className="inline-block px-8 py-3 rounded-md border border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-all duration-300">
            Xem tất cả sản phẩm {title.toLowerCase()}
          </button>
        </div>
      </Container>
    </section>
  );
}