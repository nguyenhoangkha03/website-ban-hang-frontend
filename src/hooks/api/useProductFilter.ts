"use client";

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import type { StoreProductParams } from '@/types/cs-products.type';

export const useProductFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Lấy giá trị hiện tại từ URL (Bổ sung thêm packagingType, minPrice, maxPrice)
  const filters: StoreProductParams = {
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 12,
    search: searchParams.get('search') || undefined,
    categoryId: searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined,
    isFeatured: searchParams.get('isFeatured') === 'true' ? true : undefined,
    sortBy: (searchParams.get('sortBy') as any) || 'newest',
    
    // 👇 MỚI: Lấy quy cách đóng gói và khoảng giá
    packagingType: searchParams.get('packagingType') || undefined, 
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
  };

  // 2. Helper tạo chuỗi query
  const createQueryString = useCallback(
    (name: string, value: string | number | null) => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (value === null || value === undefined || value === '') {
        params.delete(name);
      } else {
        params.set(name, String(value));
      }

      // Luôn reset về trang 1 khi filter thay đổi (trừ khi đang bấm chuyển trang)
      if (name !== 'page') {
        params.set('page', '1');
      }

      return params.toString();
    },
    [searchParams]
  );

  // 3. Các hàm update
  const setPage = (page: number) => {
    router.push(`${pathname}?${createQueryString('page', page)}`, { scroll: false });
  };

  const setSort = (sort: string) => {
    router.push(`${pathname}?${createQueryString('sortBy', sort)}`);
  };

  const setCategory = (id: number | null) => {
    router.push(`${pathname}?${createQueryString('categoryId', id)}`);
  };

  const setSearch = (term: string) => {
    router.push(`${pathname}?${createQueryString('search', term)}`);
  };

  // 👇 MỚI: Hàm lọc theo quy cách (Chai/Bao/Gói)
  const setPackaging = (type: string | null) => {
    router.push(`${pathname}?${createQueryString('packagingType', type)}`);
  };

  // 👇 MỚI: Hàm lọc theo khoảng giá (Cập nhật 2 tham số cùng lúc)
  const setPriceRange = (min: number | null, max: number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (min !== null) params.set('minPrice', String(min));
    else params.delete('minPrice');

    if (max !== null) params.set('maxPrice', String(max));
    else params.delete('maxPrice');

    params.set('page', '1'); // Reset về trang 1

    router.push(`${pathname}?${params.toString()}`);
  };

  return {
    filters,
    setPage,
    setSort,
    setCategory,
    setSearch,
    setPackaging,   // ✅ Xuất hàm mới
    setPriceRange,  // ✅ Xuất hàm mới
  };
};