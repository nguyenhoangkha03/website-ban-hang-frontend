"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ShoppingCart, Heart, ChevronRight, ShieldCheck, Truck, Package, 
  Gift, Tag, PlayCircle, VideoOff
} from 'lucide-react';

import { useStoreProductDetail } from '@/hooks/api/useCSProducts';
import ProductCard from '@/components/products/ProductCard';

const formatCurrency = (value: number) => 
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

// Helper: Chuyển link YouTube thường thành link Embed
const getYouTubeEmbedUrl = (url: string) => {
  if (!url) return null;
  // Hỗ trợ các dạng link: youtu.be, youtube.com/watch?v=, youtube.com/embed/
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) 
    ? `https://www.youtube.com/embed/${match[2]}` 
    : null;
};

export default function ProductDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const { data: product, isLoading, isError } = useStoreProductDetail(id);
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedPromoId, setSelectedPromoId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (product?.promotion) {
      setSelectedPromoId(product.promotion.id);
    }
  }, [product]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-green-700 font-medium animate-pulse">Đang tải dữ liệu nông nghiệp...</div>;
  if (isError || !product) return <div className="min-h-screen flex items-center justify-center text-red-500">Không tìm thấy sản phẩm</div>;

  const currentImage = product.images[activeImageIndex]?.url || '/placeholder.png';

  // Logic tính giá (Giữ nguyên)
  const currentPromo = product.availablePromotions.find(p => p.id === selectedPromoId);
  let dynamicSalePrice = product.originalPrice;
  let dynamicDiscountPercent = 0;

  if (currentPromo) {
     if (currentPromo.type === 'gift') {
        dynamicSalePrice = product.originalPrice;
        dynamicDiscountPercent = 0;
     } else {
        const discountAmount = currentPromo.value || 0;
        dynamicSalePrice = Math.max(0, product.originalPrice - discountAmount);
        dynamicDiscountPercent = Math.round((discountAmount / product.originalPrice) * 100);
     }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      
      {/* BREADCRUMB */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 overflow-hidden">
        <Link href="/" className="hover:text-green-700 whitespace-nowrap transition-colors">Trang chủ</Link>
        <ChevronRight className="h-4 w-4 flex-shrink-0" />
        <Link href="/products" className="hover:text-green-700 whitespace-nowrap transition-colors">Sản phẩm</Link>
        <ChevronRight className="h-4 w-4 flex-shrink-0" />
        <span className="font-medium text-gray-900 truncate">{product.name}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* === CỘT TRÁI: ẢNH === */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm group">
            <Image
              src={currentImage}
              alt={product.name}
              fill
              className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
              priority
            />
            {dynamicDiscountPercent > 0 && (
              <span className="absolute left-4 top-4 rounded-lg bg-red-600 px-3 py-1 text-sm font-bold text-white shadow-md">
                Giảm {dynamicDiscountPercent}%
              </span>
            )}
          </div>

          {/* Gallery */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 bg-white transition-all ${
                    activeImageIndex === index 
                      ? 'border-green-600 opacity-100 ring-2 ring-green-100' 
                      : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img.url} alt="thumbnail" fill className="object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* === CỘT PHẢI: THÔNG TIN === */}
        <div className="lg:col-span-7 flex flex-col">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight">
            {product.name}
          </h1>
          
          <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
            <span className="bg-green-50 px-2 py-1 rounded text-green-700 font-medium border border-green-100">
               Mã: {product.sku}
            </span>
            <span>|</span>
            <span className={product.inStock ? "text-green-600 font-bold flex items-center gap-1" : "text-red-500 font-bold"}>
               {product.inStock ? <><Package className="h-4 w-4"/> Còn hàng</> : "Hết hàng"}
            </span>
          </div>

          {/* GIÁ & KHUYẾN MÃI */}
          <div className="mt-6 rounded-2xl bg-gradient-to-br from-green-50 to-white p-6 border border-green-100 shadow-sm">
            <div className="flex items-end gap-3 mb-4">
              <span className="text-3xl md:text-4xl font-bold text-red-600">
                {formatCurrency(dynamicSalePrice)}
              </span>
              {dynamicDiscountPercent > 0 && (
                 <span className="text-lg text-gray-400 line-through mb-1">
                   {formatCurrency(product.originalPrice)}
                 </span>
              )}
              {product.unit && (
                 <span className="mb-2 text-sm font-bold text-gray-600 bg-white px-3 py-0.5 rounded border border-gray-200">
                    / {product.unit}
                 </span>
              )}
            </div>

            {/* Chọn khuyến mãi */}
            {product.availablePromotions.length > 0 && (
               <div className="space-y-3 pt-4 border-t border-green-200 border-dashed">
                  <p className="text-sm font-bold text-green-800 flex items-center gap-2">
                     <Gift size={18} className="text-red-500"/> Chọn ưu đãi của bạn:
                  </p>
                  
                  {product.availablePromotions.map((promo) => (
                     <label 
                        key={promo.id} 
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all ${
                           selectedPromoId === promo.id 
                              ? 'border-green-600 bg-white ring-1 ring-green-600 shadow-md' 
                              : 'border-gray-200 bg-white hover:bg-gray-50'
                        }`}
                     >
                        <input 
                           type="radio" 
                           name="promotion_select" 
                           className="mt-1 h-4 w-4 text-green-600 accent-green-600 focus:ring-green-500"
                           checked={selectedPromoId === promo.id}
                           onChange={() => setSelectedPromoId(promo.id)}
                        />
                        <div className="flex-1">
                           <div className="flex items-center gap-2">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                 promo.type === 'gift' ? 'bg-purple-100 text-purple-700' : 'bg-red-100 text-red-700'
                              }`}>
                                 {promo.type === 'gift' ? 'QUÀ TẶNG' : 'GIẢM GIÁ'}
                              </span>
                              <span className="font-bold text-sm text-gray-800">{promo.name}</span>
                           </div>
                           <p className="text-xs text-gray-600 mt-1 pl-1">
                              {promo.type === 'gift' && promo.giftName 
                                 ? `🎁 Nhận ngay: ${promo.giftName}`
                                 : `🔥 Giảm trực tiếp: ${formatCurrency(promo.value || 0)}`
                              }
                           </p>
                        </div>
                     </label>
                  ))}
               </div>
            )}
          </div>

          {/* NÚT MUA HÀNG (Màu xanh chủ đạo) */}
          <div className="mt-8 flex gap-4">
            <button 
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-green-600 py-4 font-bold text-white text-lg shadow-lg shadow-green-200 transition-all hover:bg-green-700 hover:shadow-xl active:scale-[0.98] disabled:bg-gray-300 disabled:shadow-none"
                disabled={!product.inStock}
                onClick={() => console.log("Mua:", { id, promoId: selectedPromoId })}
            >
              <ShoppingCart className="h-6 w-6" />
              {product.inStock ? 'THÊM VÀO GIỎ NGAY' : 'TẠM HẾT HÀNG'}
            </button>
            
            <button className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border-2 border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-colors">
              <Heart className="h-7 w-7" />
            </button>
          </div>

          {/* CAM KẾT */}
          <div className="mt-8 flex gap-6 text-sm text-gray-600 border-t pt-6">
             <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-green-600"/> Chính hãng 100%
             </div>
             <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-green-600"/> Giao hàng tận nơi
             </div>
          </div>
        </div>
      </div>

      {/* === VIDEO GIỚI THIỆU (Youtube) === */}
      <div className="mt-16 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
           <PlayCircle className="text-red-600"/>
           <h2 className="text-lg font-bold text-gray-800 uppercase">Video thực tế / Hướng dẫn sử dụng</h2>
        </div>
        
        <div className="p-6 md:p-8">
           {/* Kiểm tra có video không */}
           {product.videos && product.videos.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                 {product.videos.map((vid, idx) => {
                    const embedUrl = getYouTubeEmbedUrl(vid.url);
                    if (!embedUrl) return null; // Bỏ qua link lỗi

                    return (
                       <div key={idx} className="flex flex-col gap-2">
                          <div className="aspect-video w-full rounded-xl overflow-hidden shadow-md bg-black">
                             <iframe 
                               src={embedUrl} 
                               title={vid.title || product.name}
                               className="w-full h-full"
                               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                               allowFullScreen
                             />
                          </div>
                          {vid.title && <p className="text-sm font-medium text-gray-700 text-center">{vid.title}</p>}
                       </div>
                    )
                 })}
              </div>
           ) : (
              /* TRƯỜNG HỢP KHÔNG CÓ VIDEO */
              <div className="flex flex-col items-center justify-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                 <VideoOff className="h-12 w-12 mb-3 opacity-50"/>
                 <p>Sản phẩm này chưa có video hướng dẫn.</p>
              </div>
           )}
        </div>
      </div>

      {/* MÔ TẢ CHI TIẾT */}
      <div className="mt-8 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="bg-green-600 px-6 py-4">
           <h2 className="text-lg font-bold text-white uppercase">Mô tả chi tiết sản phẩm</h2>
        </div>
        <div className="p-6 md:p-8">
           <div 
             className="prose max-w-none text-gray-700 leading-relaxed"
             dangerouslySetInnerHTML={{ __html: product.description || '<p class="text-gray-400 italic">Đang cập nhật nội dung...</p>' }}
           />
        </div>
      </div>

      {/* SẢN PHẨM LIÊN QUAN */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6 border-l-4 border-green-600 pl-4">
             <h2 className="text-2xl font-bold text-gray-900 uppercase">
                Sản phẩm cùng loại
             </h2>
             <Link href="/products" className="text-green-700 hover:underline text-sm font-bold">Xem thêm →</Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
            {product.relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}