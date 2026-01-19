"use client";

import React from 'react';
import { Loader2, SearchX } from 'lucide-react';
import { useStoreProducts } from '@/hooks/api/useCSProducts';
import { useProductFilter } from '@/hooks/api/useProductFilter';
import ProductCard from '@/components/products/ProductCard';
import ProductToolbar from '@/components/products/ProductToolbar';

export default function ProductsPage() {
  const { filters, setPage } = useProductFilter();
  
  // Gọi API (Tự động gửi kèm Token trong Hook nếu có login)
  const { data, isLoading, isError } = useStoreProducts(filters);

  const products = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="bg-white min-h-screen pb-12">
      
      {/* 1. HEADER: Thiết kế lại một chút cho sáng sủa */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 py-8 mb-8 shadow-md">
        <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl md:text-4xl font-bold text-white uppercase tracking-wide">
              Danh mục Vật tư Nông nghiệp
            </h1>
            <p className="text-green-50 text-base mt-2 font-medium">
              🌱 Chính hãng - Hiệu quả - Giao hàng tận nơi 🚛
            </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* 2. TOOLBAR */}
        <ProductToolbar total={meta?.total || 0} />

        {/* 3. NỘI DUNG CHÍNH */}
        {isLoading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
               <Loader2 className="h-10 w-10 animate-spin text-green-600" />
               <span className="text-gray-500 text-sm">Đang tải danh sách...</span>
            </div>
          </div>
        ) : isError ? (
           <div className="py-20 text-center">
             <p className="text-red-500 mb-2">Có lỗi kết nối máy chủ.</p>
             <button 
                onClick={() => window.location.reload()} 
                className="text-green-600 underline hover:text-green-800"
             >
                Tải lại trang
             </button>
           </div>
        ) : products.length > 0 ? (
          <>
            {/* GRID SẢN PHẨM */}
            <div className="grid grid-cols-2 gap-4 md:gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {/* PHÂN TRANG */}
            {meta && meta.totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-3">
                <button
                  onClick={() => setPage(meta.page - 1)}
                  disabled={meta.page === 1}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 hover:border-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  ← Trang trước
                </button>
                <span className="flex items-center px-4 font-bold text-lg text-green-700 bg-green-50 rounded-lg border border-green-100">
                  {meta.page} / {meta.totalPages}
                </span>
                <button
                  onClick={() => setPage(meta.page + 1)}
                  disabled={meta.page === meta.totalPages}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 hover:border-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Trang sau →
                </button>
              </div>
            )}
          </>
        ) : (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
             <SearchX className="h-16 w-16 mb-4 text-gray-300"/>
             <p className="text-lg text-gray-600 font-medium">Không tìm thấy sản phẩm nào phù hợp.</p>
             <p className="text-sm text-gray-400 mt-1">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
          </div>
        )}
      </div>
    </div>
  );
}