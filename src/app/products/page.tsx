"use client";

import React, { useLayoutEffect, useRef, useState } from 'react';
import { Loader2, SearchX, Package, Search, X } from 'lucide-react';
import { useProducts } from '@/hooks/api/useCSProducts';
import { useProductFilter } from '@/hooks/api/useProductFilter';
import ProductCard from '@/components/products/ProductCard';
import Container from '@/components/layout/Container';
import { useCsCategories } from '@/hooks/api/useCsCategories';
import { useHistoryProductStore } from '@/stores/useHistoryProduct';

export default function ProductsPage() {
  const { data: categoryRaw } = useCsCategories();
  const categories = categoryRaw?.data || [];
  const [category, setCategory] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, isError } = useProducts({
    page: page,
    limit: 20,
    ...(category !== undefined && { categoryId: category }),
    ...(search !== "all" && { search: search  }),
  });
  const addHistorySearch = useHistoryProductStore(state => state.addHistoryProduct)


  
  const products = data?.data || [];
  const meta = data?.meta

  console.log("Quý con cóc", products)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchTerm);
    if (searchTerm.trim() !== "") {
      addHistorySearch(searchTerm);
    }
  };
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <section className="relative bg-gradient-to-br from-primary to-green-700 dark:from-green-800 dark:to-green-900 py-16 md:py-20 pb-24 md:pb-28 overflow-hidden">
        <Container>
          <div className="relative z-10 text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs md:text-sm font-bold px-4 py-2 rounded-full uppercase tracking-wider mb-4">
              <Package size={16} />
              Vật tư Nông nghiệp Chính hãng
            </div>
            <h1 className="font-display font-extrabold text-3xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
              Danh Mục Sản Phẩm
            </h1>
            <p className="text-white text-base md:text-lg max-w-2xl mx-auto font-semibold">
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
              className="fill-gray-50 dark:fill-gray-900"
            />
          </svg>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <Container>
        <div className="py-8 md:py-12">
          {/* TOOLBAR */}
          <div className="mb-10 space-y-5 animate-fade-in-up">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 Tìm kiếm sản phẩm theo tên, thành phần, công dụng..."
                  className="w-full rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-4 pl-14 pr-12 text-base shadow-md transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100 focus:border-primary dark:focus:border-green-500 focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900/30 focus:shadow-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-primary dark:text-green-400" />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setSearch("");
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all duration-200"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </form>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-md overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5">
                <select
                  value={category || ""}
                  onChange={(e) => setCategory(Number(e.target.value))}
                  className="rounded-xl border-2 border-gray-400 bg-white py-2.5 pl-4 pr-10 text-sm font-semibold text-gray-700 focus:border-primary focus:ring-2 focus:ring-green-100 cursor-pointer hover:border-gray-300 transition-all shadow-sm"
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.categoryName}
                    </option>
                  ))}
                </select> 
              </div>
            </div>
          </div>

          {/* CONTENT */}
          {isLoading ? (
            <div className="flex min-h-[500px] items-center justify-center">
              <div className="flex flex-col items-center gap-4 animate-fade-in-up">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <span className="text-gray-600 text-base font-medium">
                  Đang tải danh sách sản phẩm...
                </span>
              </div>
            </div>
          ) : isError ? (
            <div className="py-20 text-center bg-white rounded-2xl border border-gray-100 shadow-sm animate-fade-in-up">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <p className="text-red-600 dark:text-red-400 font-bold text-lg mb-2">
                Có lỗi kết nối máy chủ
              </p>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Vui lòng thử lại sau
              </p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary dark:bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 dark:hover:bg-green-500 transition-all shadow-lg"
              >
                Tải lại trang
              </button>
            </div>
          ) : products.length > 0 ? (
            <div className="min-h-[600px]">
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
            </div>
          ) : (
            /* EMPTY STATE - Improved Design */
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 animate-fade-in-up">
              <SearchX className="h-20 w-20 mb-6 text-gray-300 dark:text-gray-600" />
              <p className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                Không tìm thấy sản phẩm nào
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md text-center">
                Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để tìm sản phẩm
                phù hợp
              </p>
              <button
                onClick={() => (window.location.href = "/products")}
                className="px-6 py-3 bg-primary dark:bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 dark:hover:bg-green-500 transition-all shadow-lg"
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