import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Leaf } from 'lucide-react';
import { Product } from '@/types';
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
            {title}
          </h2>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
              {/* Image Area */}
              <div className="relative h-64 bg-gray-50 p-6 flex items-center justify-center">
                <Image 
                  src={product.images?.[0]?.imageUrl ?? '/placeholder.jpg'} 
                  alt={product.productName} 
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply"
                />
              </div>

              {/* Content Area */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-1 tracking-wide">{product.productType}</div>
                <h3 className="font-bold text-gray-800 text-lg mb-4 line-clamp-2 group-hover:text-primary transition-colors">
                  {product.productName}
                </h3>
                
                <div className="mt-auto pt-4">
                  <div className="text-lg font-bold text-primary">
                    {product.sellingPriceRetail ? `${product.sellingPriceRetail.toLocaleString()} VNĐ` : 'Liên hệ'}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link href="/product" className="inline-block px-8 py-3 rounded-md border border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-all duration-300">
            Xem tất cả sản phẩm
          </Link>
        </div>
      </Container>
    </section>
  );
}