'use client';
import React from 'react';
import Container from './Container';
import { useCategories } from '@/hooks/api/useCategories';
import { Category } from '@/types';
import { Sprout, Flower, Wheat, Bug, Droplets } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const iconMap: { [key: string]: React.ElementType } = {
  'Thuốc trừ sâu': Bug,
  'Phân bón lá': Droplets,
  'Phân bón gốc': Sprout,
  'Thuốc diệt cỏ': Wheat,
  'Giống cây trồng': Flower,
};

import Link from 'next/link';

const CategoryCard = ({ category }: { category: Category }) => {
  const Icon = iconMap[category.categoryName] || Sprout;
  return (
    <Link 
      href={`/product?category=${category.slug}`}
      className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group block"
    >
      <div className="w-16 h-16 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-300">
        <Icon className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-300" />
      </div>
      <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-primary transition-colors">{category.categoryName}</h3>
      <p className="text-gray-500 text-sm">{category.description || `Các sản phẩm cho ${category.categoryName}`}</p>
    </Link>
  );
};

const CategorySkeleton = () => (
    <div className="bg-white rounded-xl p-8 text-center shadow-lg">
        <Skeleton className="w-16 h-16 mx-auto rounded-full mb-4" />
        <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
        <Skeleton className="h-4 w-1/2 mx-auto" />
    </div>
)

export default function CategorySection() {
  const { data: categories, isLoading, isError } = useCategories();

  return (
    <section className="relative z-20 -mt-24 md:-mt-32 pb-16 bg-primary">
      <Container>
        <div className="text-center text-white mb-8 md:mb-12">
           <span className="block mb-2 opacity-90"><i className="lucide-sprout inline-block w-6 h-6"></i></span>
           <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-wide">Danh mục sản phẩm Nam Viet</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <CategorySkeleton key={i} />)
          ) : isError ? (
            <div className="col-span-full text-center text-white">
                <p>Không thể tải danh mục sản phẩm.</p>
            </div>
          ) : (
            categories?.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))
          )}
        </div>
      </Container>
    </section>
  );
}