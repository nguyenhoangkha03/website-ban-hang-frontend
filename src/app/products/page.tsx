"use client";

import React from 'react';
import { Loader2, SearchX, Package } from 'lucide-react';
import { useStoreProducts } from '@/hooks/api/useCSProducts';
import { useProductFilter } from '@/hooks/api/useProductFilter';
import ProductCard from '@/components/products/ProductCard';
import ProductToolbar from '@/components/products/ProductToolbar';
import Container from '@/components/layout/Container';

export default function ProductsPage() {
  const { filters, setPage } = useProductFilter();
  
  // Gọi API (Tự động gửi kèm Token trong Hook nếu có login)
  const { data, isLoading, isError } = useStoreProducts(filters);

  const products = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      
      {/* HERO SECTION - Matching Homepage Style */}
      <section className="relative bg-gradient-to-br from-primary to-green-700 py-12 md:py-16 overflow-hidden">
        <Container>
          <div className="relative z-10 text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs md:text-sm font-bold px-4 py-2 rounded-full uppercase tracking-wider mb-4">
              <Package size={16} />
              Vật tư Nông nghiệp Chính hãng
            </div>
            <h1 className="font-display font-extrabold text-3xl md:text-5xl lg:text-6xl text-white leading-tight mb-4">
              Danh Mục Sản Phẩm
            </h1>
            <p className="text-green-50 text-base md:text-lg max-w-2xl mx-auto font-medium">
              🌱 Chất lượng cao - Hiệu quả vượt trội - Giao hàng tận nơi 🚛
            </p>
          </div>
        </Container>

        {/* Decorative Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[80px]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="fill-gray-50"
            />
          </svg>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <Container>
        <div className="py-8 md:py-12">
          
          {/* TOOLBAR */}
          <ProductToolbar total={meta?.total || 0} />

          {/* CONTENT */}
          {isLoading ? (
            <div className="flex min-h-[500px] items-center justify-center">
              <div className="flex flex-col items-center gap-4 animate-fade-in-up">
                 <Loader2 className="h-12 w-12 animate-spin text-primary" />
                 <span className="text-gray-600 text-base font-medium">Đang tải danh sách sản phẩm...</span>
              </div>
            </div>
          ) : isError ? (
             <div className="py-20 text-center bg-white rounded-2xl border border-gray-100 shadow-sm animate-fade-in-up">
               <div className="text-red-500 text-5xl mb-4">⚠️</div>
               <p className="text-red-600 font-bold text-lg mb-2">Có lỗi kết nối máy chủ</p>
               <p className="text-gray-500 mb-4">Vui lòng thử lại sau</p>
               <button 
                  onClick={() => window.location.reload()} 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-green-700 transition-all shadow-lg"
               >
                  Tải lại trang
               </button>
             </div>
          ) : products.length > 0 ? (
            <>
              {/* GRID SẢN PHẨM - Better Responsive Grid */}
              <div className="grid grid-cols-2 gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {/* PHÂN TRANG - Improved Design */}
              {meta && meta.totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 animate-fade-in-up">
                  <button
                    onClick={() => setPage(meta.page - 1)}
                    disabled={meta.page === 1}
                    className="px-6 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-700 bg-white hover:bg-primary hover:text-white hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 disabled:hover:border-gray-200 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    ← Trang trước
                  </button>
                  <div className="flex items-center px-5 py-3 font-black text-lg bg-gradient-to-r from-primary to-green-600 text-white rounded-xl shadow-lg">
                    {meta.page} / {meta.totalPages}
                  </div>
                  <button
                    onClick={() => setPage(meta.page + 1)}
                    disabled={meta.page === meta.totalPages}
                    className="px-6 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-700 bg-white hover:bg-primary hover:text-white hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 disabled:hover:border-gray-200 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    Trang sau →
                  </button>
                </div>
              )}
            </>
          ) : (
            /* EMPTY STATE - Improved Design */
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200 animate-fade-in-up">
               <SearchX className="h-20 w-20 mb-6 text-gray-300"/>
               <p className="text-xl font-bold text-gray-700 mb-2">Không tìm thấy sản phẩm nào</p>
               <p className="text-sm text-gray-500 mb-6 max-w-md text-center">
                 Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để tìm sản phẩm phù hợp
               </p>
               <button 
                 onClick={() => window.location.href = '/products'}
                 className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-green-700 transition-all shadow-lg"
               >
                 Xem tất cả sản phẩm
               </button>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}