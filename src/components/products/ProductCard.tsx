import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import type { StoreProduct } from '@/types/cs-products.type';

// Hàm format tiền tệ
const formatCurrency = (value: number) => 
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

interface ProductCardProps {
  product: StoreProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-lg hover:border-green-300">
      
      {/* 1. HÌNH ẢNH & BADGE */}
      <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={product.image || '/image_404.png'}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Badge Giảm giá */}
        {product.discountPercentage > 0 && (
          <span className="absolute left-2 top-2 rounded bg-red-600 px-2 py-1 text-xs font-bold text-white shadow-sm z-10">
            -{product.discountPercentage}%
          </span>
        )}

        {/* Badge Nổi bật */}
        {product.isFeatured && (
          <span className="absolute right-2 top-2 rounded bg-yellow-400 px-2 py-1 text-xs font-bold text-yellow-900 shadow-sm z-10">
            HOT
          </span>
        )}

        {/* Badge Quy cách (Đơn vị tính) - MỚI */}
        {product.unit && (
          <span className="absolute right-2 bottom-2 rounded bg-white/90 px-2 py-1 text-xs font-semibold text-gray-700 shadow-sm border border-gray-100 z-10">
            {product.unit}
          </span>
        )}

        {/* Hết hàng */}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white font-bold z-20 backdrop-blur-[1px]">
            Hết hàng
          </div>
        )}
      </Link>

      {/* 2. THÔNG TIN */}
      <div className="flex flex-1 flex-col p-3">
        {/* Tên & Danh mục */}
        <div className="mb-2">
          <span className="text-[10px] md:text-xs text-gray-500 uppercase font-semibold tracking-wide">
             {product.category.name}
          </span>
          <Link href={`/products/${product.id}`}>
            <h3 className="line-clamp-2 text-sm font-medium text-gray-900 hover:text-green-700 min-h-[40px] mt-1" title={product.name}>
              {product.name}
            </h3>
          </Link>
        </div>

        {/* ❌ Đã xóa phần Đánh giá & Đã bán */}

        {/* Giá bán */}
        <div className="mt-auto pt-2 border-t border-gray-50">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-base md:text-lg font-bold text-red-600">
              {formatCurrency(product.salePrice)}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-xs text-gray-400 line-through decoration-gray-400">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
          
          {/* Tên Khuyến mãi / Quà tặng */}
          {product.promotion && (
             <div className="mt-2 flex items-start gap-1.5 p-1.5 bg-red-50 rounded border border-red-100">
                <span className="text-base">🎁</span>
                <span className="text-[11px] font-medium text-red-700 leading-tight line-clamp-2">
                   {product.promotion.type === 'gift' && product.promotion.giftName 
                      ? `Tặng: ${product.promotion.giftName}` 
                      : product.promotion.name}
                </span>
             </div>
          )}
        </div>

        {/* Nút thêm vào giỏ */}
        <button 
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-sm font-bold text-white transition-all hover:bg-green-700 active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed shadow-sm hover:shadow"
          disabled={!product.inStock}
        >
          <ShoppingCart className="h-4 w-4" />
          <span className="hidden sm:inline">Thêm vào giỏ</span>
          <span className="sm:hidden">Mua ngay</span>
        </button>
      </div>
    </div>
  );
}