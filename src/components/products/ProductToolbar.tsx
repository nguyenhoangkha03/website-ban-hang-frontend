"use client";

import React, { useState } from 'react';
import { useProductFilter } from '@/hooks/api/useProductFilter';
import { Search, X, Filter, SlidersHorizontal } from 'lucide-react';

export default function ProductToolbar({ total }: { total: number }) {
  const { filters, setSearch, setSort, setPackaging, setPriceRange } = useProductFilter();
  
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchTerm);
  };

  // Check if any filters are active
  const hasActiveFilters = filters.packagingType || filters.minPrice || filters.maxPrice;

  const clearAllFilters = () => {
    setPackaging(null);
    setPriceRange(null, null);
  };

  return (
    <div className="mb-10 space-y-5 animate-fade-in-up">
      
      {/* 1. THANH TÌM KIẾM - Larger & More Prominent */}
      <form onSubmit={handleSearchSubmit} className="relative w-full">
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm sản phẩm theo tên, thành phần, công dụng..."
            className="w-full rounded-2xl border-2 border-gray-200 bg-white py-4 pl-14 pr-12 text-base shadow-md transition-all duration-300 placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-green-100 focus:shadow-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
          
          {searchTerm && (
            <button 
              type="button"
              onClick={() => { setSearchTerm(''); setSearch(''); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </form>

      {/* 2. BỘ LỌC - Improved Visual Hierarchy */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5">
          
          {/* Nhóm lọc bên trái */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center text-sm font-bold text-gray-800 mr-2 bg-gray-50 px-3 py-2 rounded-lg">
               <SlidersHorizontal size={16} className="mr-2 text-primary"/> 
               Bộ lọc
            </div>

            {/* Lọc Quy cách */}
            <select
              value={filters.packagingType || ''}
              onChange={(e) => setPackaging(e.target.value || null)}
              className="rounded-xl border-2 border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm font-semibold text-gray-700 focus:border-primary focus:ring-2 focus:ring-green-100 cursor-pointer hover:border-gray-300 transition-all shadow-sm"
            >
              <option value="">📦 Tất cả quy cách</option>
              <option value="bottle">🧴 Chai / Can</option>
              <option value="bag">📦 Gói / Bao</option>
              <option value="box">📦 Hộp / Thùng</option>
            </select>

            {/* Lọc Giá */}
            <select
              defaultValue=""
              onChange={(e) => {
                  const val = e.target.value;
                  if(!val) setPriceRange(null, null);
                  else {
                      const [min, max] = val.split('-').map(Number);
                      setPriceRange(min, max);
                  }
              }}
              className="rounded-xl border-2 border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm font-semibold text-gray-700 focus:border-primary focus:ring-2 focus:ring-green-100 cursor-pointer hover:border-gray-300 transition-all shadow-sm"
            >
              <option value="">💰 Mọi mức giá</option>
              <option value="0-50000">💵 Dưới 50k</option>
              <option value="50000-200000">💵 50k - 200k</option>
              <option value="200000-500000">💵 200k - 500k</option>
              <option value="500000-999999999">💵 Trên 500k</option>
            </select>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200 border border-red-200"
              >
                <X size={16} />
                Xóa bộ lọc
              </button>
            )}
          </div>

          {/* Nhóm bên phải */}
          <div className="flex items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 border-gray-100 pt-4 lg:pt-0">
            <span className="text-sm font-medium text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
              <span className="text-primary font-bold">{total}</span> sản phẩm
            </span>
            
            <div className="flex items-center gap-3">
               <span className="text-sm font-semibold text-gray-500 hidden sm:inline">Sắp xếp:</span>
               <select
                  value={filters.sortBy}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-xl border-2 border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm font-semibold text-gray-700 focus:border-primary focus:ring-2 focus:ring-green-100 cursor-pointer hover:border-gray-300 transition-all shadow-sm"
               >
                  <option value="newest">🆕 Mới nhất</option>
                  <option value="price_asc">💰 Giá tăng dần</option>
                  <option value="price_desc">💰 Giá giảm dần</option>
               </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}