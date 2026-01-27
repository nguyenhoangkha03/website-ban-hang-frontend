import React, { use, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Sparkles } from 'lucide-react';
import type { StoreProduct } from '@/types/cs-products.type';

const formatCurrency = (value: number) => 
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

interface ProductCardProps {
  product: StoreProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isPopup, setIsPopup] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPopup(true)}
      onMouseLeave={() => setIsPopup(false)}
      onMouseMove={(e) => {
        setPos({
          x: e.clientX,
          y: e.clientY,
        });
      }}
    >
      <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-2xl hover:border-green-200 dark:hover:border-green-700 hover:-translate-y-1 animate-fade-in-up">
        <Link
          href={`/products/${product.id}`}
          className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800"
        >
          <Image
            src={product.image || "/image_404.png"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badge Giảm giá */}
          {product.discountPercentage > 0 && (
            <span className="absolute left-3 top-3 rounded-lg bg-gradient-to-r from-red-600 to-red-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg z-10 animate-bounce-in">
              -{product.discountPercentage}%
            </span>
          )}

          {/* Badge Nổi bật */}
          {product.isFeatured && (
            <span className="absolute right-3 top-3 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-300 px-3 py-1.5 text-xs font-bold text-yellow-900 shadow-lg z-10 flex items-center gap-1 animate-bounce-in">
              <Sparkles size={12} />
              HOT
            </span>
          )}

          {/* Badge Quy cách (Đơn vị tính) */}
          {product.unit && (
            <span className="absolute right-3 bottom-3 rounded-lg bg-white/95 backdrop-blur-sm px-3 py-1.5 text-xs font-bold text-gray-700 shadow-md border border-gray-200 z-10">
              {product.unit}
            </span>
          )}
        </Link>

        {/* 2. THÔNG TIN */}
        <div className="flex flex-1 flex-col p-4 md:p-5">
          {/* Danh mục */}
          <div className="mb-3">
            <span className="inline-block text-[10px] md:text-xs text-primary dark:text-green-400 font-bold uppercase tracking-wider bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded">
              {product.category.name}
            </span>
          </div>

          {/* Tên sản phẩm */}
          <Link href={`/products/${product.id}`}>
            <h3
              className="line-clamp-2 text-sm md:text-base font-bold text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-green-400 min-h-[44px] mb-3 transition-colors leading-snug"
              title={product.name}
            >
              {product.name}
            </h3>
          </Link>

          {/* Giá bán */}
          <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex flex-wrap items-baseline gap-2 mb-3">
              <span className="text-lg md:text-xl font-black text-red-600">
                {formatCurrency(product.salePrice)}
              </span>
              {product.discountPercentage > 0 && (
                <span className="text-sm text-gray-400 line-through decoration-2">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Khuyến mãi / Quà tặng */}
            {product.promotion && (
              <div className="mb-3 flex items-start gap-2 p-2.5 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg border border-red-100 dark:border-red-800 shadow-sm">
                <span className="text-lg flex-shrink-0">🎁</span>
                <span className="text-xs font-semibold text-red-700 dark:text-red-400 leading-tight line-clamp-2">
                  {product.promotion.type === "gift" &&
                  product.promotion.giftName
                    ? `Tặng: ${product.promotion.giftName}`
                    : product.promotion.name}
                </span>
              </div>
            )}
          </div>
          {/* Nút hành động */}
          <div className="grid grid-cols-2 gap-2">
            {/* Nút thêm vào giỏ */}
            <button
              className="flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-green-600 py-3 text-sm font-bold text-white transition-all duration-300 hover:from-green-700 hover:to-green-600 active:scale-95 disabled:from-gray-200 disabled:to-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30"
              disabled={!product.inStock}
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden md:inline">Giỏ hàng</span>
            </button>

            {/* Nút mua nhanh */}
            <button
              className="flex items-center justify-center gap-1.5 rounded-lg border-2 border-primary bg-white py-3 text-sm font-bold text-primary transition-all duration-300 hover:bg-primary hover:text-white active:scale-95 disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed shadow-sm hover:shadow-lg"
              disabled={!product.inStock}
            >
              <span>Mua Nhanh</span>
            </button>
          </div>
        </div>
      </div>
      {isPopup && (
        <div
          className="fixed z-50 w-64 rounded-xl bg-white shadow-xl border p-4 pointer-events-none"
          style={{
            left: pos.x + 12,
            top: pos.y + 12,
          }}
        >
          <video
            src={product.video} 
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-40 object-cover rounded-lg"
          />
          <h4 className="font-bold text-sm mb-1">{product.name}</h4>
        </div>
      )}
    </div>
  );
}