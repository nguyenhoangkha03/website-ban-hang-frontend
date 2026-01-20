'use client';

import ProductCard from '@/components/product/ProductCard';
import { useProducts } from '@/hooks/api/useProducts';
import { Search, SlidersHorizontal, ArrowUpDown, X, Sparkles, Filter, TrendingUp, Package } from 'lucide-react';
import { useState, useMemo } from 'react';
import FilterSidebar from '@/components/product/FilterSidebar';
import { useDebounce } from '@/hooks/useDebounce';
import { Filters } from '@/types';

type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'rating-desc' | 'newest';


export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    categories: [],     
    priceRange: [0, 1000000],
    rating: 0,
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: products,
    isLoading,
    isError,
  } = useProducts({
    search: debouncedSearchTerm,
    sortBy: sortBy,
    category: filters.categories,
    minPrice: filters.priceRange[0],
    maxPrice: filters.priceRange[1],
  });

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000) count++;
    if (filters.rating > 0) count++;
    return count;
  }, [filters]);

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 1000000],
      rating: 0,
    });
    setSearchTerm('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-10 w-64 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg animate-pulse bg-[length:200%_100%] mb-6"></div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 h-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-xl animate-pulse bg-[length:200%_100%]"></div>
              <div className="flex gap-2">
                <div className="h-12 w-24 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-xl animate-pulse bg-[length:200%_100%]"></div>
                <div className="h-12 w-36 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-xl animate-pulse bg-[length:200%_100%]"></div>
              </div>
            </div>
          </div>

          <div className="lg:grid lg:grid-cols-4 lg:gap-x-8">
            {/* Sidebar Skeleton */}
            <div className="hidden lg:block">
              <div className="space-y-6 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="h-6 w-3/4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse bg-[length:200%_100%]"></div>
                    <div className="space-y-2">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="h-4 w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse bg-[length:200%_100%]"></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Products Grid Skeleton */}
            <div className="lg:col-span-3">
              <div className="h-6 w-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse bg-[length:200%_100%] mb-6"></div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
                    <div className="aspect-square w-full bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse bg-[length:200%_100%]" />
                    <div className="p-5 space-y-3">
                      <div className="h-5 w-3/4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse bg-[length:200%_100%]"></div>
                      <div className="h-4 w-1/2 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse bg-[length:200%_100%]"></div>
                      <div className="h-10 w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg animate-pulse bg-[length:200%_100%]"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="mx-auto h-20 w-20 text-red-500 mb-6 relative">
            <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-75"></div>
            <div className="relative bg-white rounded-full p-4 shadow-lg">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Oops! Có lỗi xảy ra</h3>
          <p className="text-gray-600 mb-6">Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
        {/* Modern Header Section with Gradient */}
        <div className="mb-10">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-20 animate-pulse"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Khám phá Sản phẩm
                  </h1>
                  <p className="text-gray-600 text-sm mt-1">Tìm kiếm và lựa chọn sản phẩm yêu thích của bạn</p>
                </div>
              </div>
              
              {/* Enhanced Search and Controls */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition duration-300"></div>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                    </div>
                    <input
                      type="search"
                      placeholder="Tìm kiếm sản phẩm, danh mục..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full rounded-xl border-2 border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  {/* Enhanced Mobile Filter Button */}
                  <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="lg:hidden relative flex items-center gap-2 px-5 py-3.5 bg-white border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 shadow-sm hover:shadow-md group"
                  >
                    <Filter className="h-5 w-5 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600">Lọc</span>
                    {activeFiltersCount > 0 && (
                      <span className="absolute -top-2 -right-2 flex items-center justify-center h-6 w-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-full shadow-lg animate-bounce">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>

                  {/* Enhanced Sort Dropdown */}
                  <div className="relative group">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="appearance-none px-5 py-3.5 pr-10 bg-white border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="newest">🆕 Mới nhất</option>
                      <option value="name-asc">🔤 Tên A-Z</option>
                      <option value="name-desc">🔤 Tên Z-A</option>
                      <option value="price-asc">💰 Giá tăng dần</option>
                      <option value="price-desc">💰 Giá giảm dần</option>
                      <option value="rating-desc">⭐ Đánh giá cao</option>
                    </select>
                    <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Enhanced Active Filters Summary */}
              {(activeFiltersCount > 0 || searchTerm) && (
                <div className="mt-6 flex items-center gap-2 flex-wrap p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                  <div className="flex items-center gap-2 text-sm font-medium text-indigo-900">
                    <Filter className="h-4 w-4" />
                    <span>Đang lọc:</span>
                  </div>
                  {searchTerm && (
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-indigo-200 text-indigo-900 text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <Search className="h-3.5 w-3.5" />
                      &quot;{searchTerm}&quot;
                      <button
                        onClick={() => setSearchTerm('')}
                        className="ml-1 hover:bg-indigo-100 rounded-full p-1 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  )}
                  {activeFiltersCount > 0 && (
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg shadow-md">
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      {activeFiltersCount} bộ lọc
                    </span>
                  )}
                  <button
                    onClick={clearAllFilters}
                    className="ml-auto text-sm text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-all"
                  >
                    Xóa tất cả ✕
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-x-8">
          {/* Enhanced Desktop Sidebar */}
          <aside className="hidden lg:block">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sticky top-4">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
                <SlidersHorizontal className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-gray-900">Bộ lọc nâng cao</h2>
              </div>
              <FilterSidebar onFilterChange={handleFilterChange} />
            </div>
          </aside>

          {/* Enhanced Mobile Filters Overlay */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
                onClick={() => setShowMobileFilters(false)} 
              />
              <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl overflow-y-auto transform transition-transform">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                        <SlidersHorizontal className="h-5 w-5 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Bộ lọc</h2>
                    </div>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      <X className="h-6 w-6 text-gray-600" />
                    </button>
                  </div>
                  <FilterSidebar onFilterChange={handleFilterChange} />
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Products Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-indigo-600" />
                <p className="text-sm text-gray-700">
                  Hiển thị <span className="font-bold text-indigo-600 text-lg">{products?.length || 0}</span> sản phẩm
                </p>
              </div>
              {products && products.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Đã cập nhật</span>
                </div>
              )}
            </div>

            {products && products.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product, index) => (
                  <div 
                    key={product.id}
                    className="group animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                  <div className="relative mx-auto h-32 w-32 text-gray-300 bg-white rounded-full p-6 shadow-xl">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Không tìm thấy sản phẩm</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Rất tiếc, chúng tôi không tìm thấy sản phẩm phù hợp với tiêu chí của bạn. Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm khác.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
                >
                  <X className="h-5 w-5" />
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}