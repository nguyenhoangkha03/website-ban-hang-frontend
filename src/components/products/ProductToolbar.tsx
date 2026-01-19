"use client";

import React, { useState } from 'react';
import { useProductFilter } from '@/hooks/api/useProductFilter';
import { Search, X, Filter } from 'lucide-react'; // Thêm icon Filter cho đẹp

export default function ProductToolbar({ total }: { total: number }) {
  // Lấy full các hàm từ hook mới
  const { filters, setSearch, setSort, setPackaging, setPriceRange } = useProductFilter();
  
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchTerm);
  };

  return (
    <div className="mb-8 space-y-4">
      
      {/* 1. THANH TÌM KIẾM */}
      <form onSubmit={handleSearchSubmit} className="relative w-full shadow-sm">
        <input
          type="text"
          placeholder="Tìm tên thuốc, thành phần, công dụng..."
          className="w-full rounded-full border border-gray-300 py-3 pl-12 pr-10 text-base shadow-sm transition-all focus:border-green-600 focus:ring-2 focus:ring-green-100"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        
        {searchTerm && (
          <button 
            type="button"
            onClick={() => { setSearchTerm(''); setSearch(''); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </form>

      {/* 2. CÁC BỘ LỌC */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        
        {/* Nhóm lọc bên trái */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center text-sm font-medium text-gray-700 mr-2">
             <Filter size={16} className="mr-1.5"/> Bộ lọc:
          </div>

          {/* Lọc Quy cách */}
          <select
            value={filters.packagingType || ''}
            onChange={(e) => setPackaging(e.target.value || null)} // Gửi null nếu chọn "Tất cả"
            className="rounded-lg border-gray-200 bg-gray-50 py-2 pl-3 pr-8 text-sm font-medium text-gray-700 focus:border-green-500 focus:ring-green-500 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <option value="">📦 Tất cả quy cách</option>
            <option value="bottle">Chai / Can</option>
            <option value="bag">Gói / Bao</option>
            <option value="box">Hộp / Thùng</option>
          </select>

          {/* Lọc Giá */}
          <select
            // Logic hiển thị value cho select giá hơi phức tạp vì nó là range
            // Tạm thời để defaultValue là "" và chỉ xử lý onChange
            defaultValue=""
            onChange={(e) => {
                const val = e.target.value;
                if(!val) setPriceRange(null, null);
                else {
                    const [min, max] = val.split('-').map(Number);
                    setPriceRange(min, max);
                }
            }}
            className="rounded-lg border-gray-200 bg-gray-50 py-2 pl-3 pr-8 text-sm font-medium text-gray-700 focus:border-green-500 focus:ring-green-500 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <option value="">💰 Mọi mức giá</option>
            <option value="0-50000">Dưới 50k</option>
            <option value="50000-200000">50k - 200k</option>
            <option value="200000-500000">200k - 500k</option>
            <option value="500000-999999999">Trên 500k</option>
          </select>
        </div>

        {/* Nhóm bên phải */}
        <div className="flex items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 border-gray-100 pt-3 lg:pt-0">
          <span className="text-sm text-gray-500">
            Hiển thị <b>{total}</b> kết quả
          </span>
          
          <div className="flex items-center gap-2">
             <span className="text-sm text-gray-400 hidden sm:inline">Sắp xếp:</span>
             <select
                value={filters.sortBy}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-lg border-gray-200 py-2 pl-3 pr-8 text-sm focus:border-green-500 focus:ring-green-500 cursor-pointer"
             >
                <option value="newest">Mới nhất</option>
                <option value="price_asc">Giá tăng dần</option>
                <option value="price_desc">Giá giảm dần</option>
             </select>
          </div>
        </div>
      </div>
    </div>
  );
}