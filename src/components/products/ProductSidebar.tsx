// "use client";

// import React from 'react';
// import Link from 'next/link';
// import { useSearchParams } from 'next/navigation';
// import { useCsCategoryTree } from '@/hooks/api/useCsCategories';
// import { ChevronRight, Filter } from 'lucide-react';

// export default function ProductSidebar() {
//   const { data: categories } = useCsCategoryTree();
//   const searchParams = useSearchParams();
//   const currentCatId = Number(searchParams.get('categoryId'));

//   return (
//     <div className="w-full">
//       <div className="flex items-center gap-2 mb-4 font-bold text-gray-800 uppercase text-sm border-b pb-2">
//         <Filter size={16} /> Danh mục sản phẩm
//       </div>

//       <ul className="space-y-1">
//         {/* Nút "Tất cả" */}
//         <li>
//           <Link
//             href="/products"
//             className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
//               !currentCatId ? 'bg-green-50 text-green-700 font-bold' : 'text-gray-600 hover:bg-gray-50'
//             }`}
//           >
//             <span>Tất cả sản phẩm</span>
//           </Link>
//         </li>

//         {/* Danh sách danh mục từ API */}
//         {categories?.map((cat) => {
//           const isActive = currentCatId === cat.id;
//           // Kiểm tra xem có con nào đang active không để mở rộng menu cha
//           const hasActiveChild = cat.children?.some(child => child.id === currentCatId);

//           return (
//             <li key={cat.id}>
//               <Link
//                 href={`/products?categoryId=${cat.id}`}
//                 className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
//                   isActive || hasActiveChild 
//                     ? 'bg-green-50 text-green-700 font-bold' 
//                     : 'text-gray-600 hover:bg-gray-50'
//                 }`}
//               >
//                 <span>{cat.categoryName}</span>
//                 {cat.children && cat.children.length > 0 && (
//                   <ChevronRight size={14} className={`transform transition-transform ${hasActiveChild ? 'rotate-90' : ''}`} />
//                 )}
//               </Link>

//               {/* Danh mục con (Nếu có) */}
//               {cat.children && cat.children.length > 0 && (
//                 <ul className={`ml-4 mt-1 border-l border-gray-200 pl-2 space-y-1 ${hasActiveChild ? 'block' : 'hidden md:block'}`}>
//                   {cat.children.map((child) => (
//                     <li key={child.id}>
//                       <Link
//                         href={`/products?categoryId=${child.id}`}
//                         className={`block px-3 py-1.5 text-xs rounded-md transition-colors ${
//                           currentCatId === child.id
//                             ? 'text-green-600 font-bold bg-green-50/50'
//                             : 'text-gray-500 hover:text-green-600'
//                         }`}
//                       >
//                         {child.categoryName}
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// }