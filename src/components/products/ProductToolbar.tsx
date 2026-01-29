"use client";

import React, { useState } from 'react';
import { useProductFilter } from '@/hooks/api/useProductFilter';
import { Search, X } from 'lucide-react';
import { useHistoryProductStore } from '@/stores/useHistoryProduct';
import { useCsCategories } from '@/hooks/api/useCsCategories';


export default function ProductToolbar() {
  const {data, isLoading, isError} = useCsCategories()
  const { filters,setCategory, setSearch } = useProductFilter();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const addHistorySearch = useHistoryProductStore(state => state.addHistoryProduct)

  const categories = data?.data || [];


  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchTerm);
    if (searchTerm.trim() !== ''){
      addHistorySearch(searchTerm);
    }
  };



  return (
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
            value={filters.categoryId || ""}
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
  );
}