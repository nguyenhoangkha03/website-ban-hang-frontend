// "use client";

// import React from 'react';
// import Link from 'next/link';
// import { ArrowRight, Loader2 } from 'lucide-react';
// import ProductCard from './ProductCard';
// import { useStoreProducts } from '@/hooks/api/useCSProducts'; 
// import { useCsCategoryTree } from '@/hooks/api/useCsCategories'; 

// interface ProductSectionProps {
//   title: string;
//   categorySlug?: string; // Slug danh mục (VD: 'sau-rieng')
//   limit?: number;
//   bgColor?: string; // Màu nền để phân biệt các tầng
// }

// export default function ProductSection({ 
//   title, 
//   categorySlug, 
//   limit = 4,
//   bgColor = 'bg-white' 
// }: ProductSectionProps) {
  
//   // 1. Tìm ID của danh mục dựa vào Slug (Để đảm bảo đúng ID dù DB thay đổi)
//   const { data: categories } = useCsCategoryTree();
  
//   // Tìm object category tương ứng với slug
//   const targetCategory = categories?.find(c => c.slug === categorySlug);
//   const categoryId = targetCategory?.id;

//   // 2. Gọi API lấy sản phẩm (Nếu không có categorySlug thì lấy tất cả - dùng cho mục Sản phẩm mới)
//   const { data, isLoading } = useStoreProducts({
//     page: 1,
//     limit: limit,
//     categoryId: categoryId, 
//     sortBy: 'newest'
//   });

//   const products = data?.data || [];

//   // Nếu đang loading hoặc không có sản phẩm nào thì ẩn section đó đi cho đẹp
//   if (!isLoading && products.length === 0) return null;

//   return (
//     <section className={`py-12 ${bgColor}`}>
//       <div className="container mx-auto px-4">
//         {/* Header của Tầng */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900 md:text-3xl uppercase tracking-tight">
//               {title}
//             </h2>
//             <div className="mt-2 h-1 w-20 bg-green-600 rounded-full"></div>
//           </div>

//           {/* Nút xem tất cả: Trỏ về trang lọc với đúng ID danh mục */}
//           <Link 
//             href={categoryId ? `/products?categoryId=${categoryId}` : '/products'}
//             className="group flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800"
//           >
//             Xem tất cả
//             <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
//           </Link>
//         </div>

//         {/* Lưới sản phẩm */}
//         {isLoading ? (
//           <div className="flex justify-center py-10">
//              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
//             {products.map((product) => (
//               <ProductCard key={product.id} product={product} />
//             ))}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }