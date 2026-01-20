"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Import useRouter
import Link from 'next/link'; // Import Link
import Image from 'next/image';
import { useProductById } from '@/hooks/api/useProducts';
import { useAddItemToCart } from '@/hooks/api/useCartApi';
import { ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight, Star, Truck, Shield, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth'; // Import useAuth
import { toast } from 'sonner'; // Import toast


export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [buyNowTriggered, setBuyNowTriggered] = useState(false); // New state to track if buy now was clicked

  const { isAuthenticated } = useAuth(); // Get authentication status
  const router = useRouter(); // Initialize router

  const { data: product, isLoading, isError } = useProductById(id);
  const addItemMutation = useAddItemToCart();
  
  useEffect(() => {
    if (addItemMutation.isSuccess && !buyNowTriggered) {
      const timer = setTimeout(() => {
        addItemMutation.reset();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [addItemMutation, buyNowTriggered]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">😞</div>
          <h2 className="text-2xl font-bold text-gray-900">Không tìm thấy sản phẩm</h2>
          <p className="text-gray-600">Sản phẩm không tồn tại hoặc đã bị xóa</p>
          <button className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  const images = product.images || [];
  const hasMultipleImages = images.length > 1;
  const isInStock = product.stockQuantity && product.stockQuantity > 0;

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    if (!isInStock) return;
    
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      router.push('/login');
      return;
    }
    addItemMutation.mutate({ productId: product.id, quantity });
  };

  const handleBuyNow = () => {
    if (!isInStock) return;
    
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để mua sản phẩm ngay');
      router.push('/login');
      return;
    }
    setBuyNowTriggered(true); // Set trigger before mutation
    addItemMutation.mutate({ productId: product.id, quantity }, {
      onSuccess: () => {
        router.push('/cart');
      }
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-700">Trang chủ</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/products" className="text-gray-500 hover:text-gray-700">Sản phẩm</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{product.productName}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group">
                <Image
                  src={images[selectedImage]?.imageUrl || 'https://placehold.co/600x600/e2e8f0/e2e8f0'}
                  alt={product.productName}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                
                {/* Image Navigation */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {hasMultipleImages && (
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {selectedImage + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {hasMultipleImages && (
                <div className="grid grid-cols-4 gap-4">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === idx
                          ? 'border-indigo-600 ring-2 ring-indigo-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Image
                        src={img.imageUrl}
                        alt={`${product.productName} ${idx + 1}`}
                        fill
                        sizes="10vw"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-3xl font-bold text-gray-900 flex-1">
                    {product.productName}
                  </h1>
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-2 rounded-full transition-colors ${
                      isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Supplier Info */}
                {product.supplier && (
                  <div className="mb-4">
                    <span className="text-sm text-gray-500">Cung cấp bởi: </span>
                    <a href={`/suppliers/${product.supplier.id}`} className="text-sm font-medium text-indigo-600 hover:underline">
                      {product.supplier.supplierName}
                    </a>
                  </div>
                )}

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(4.0 - 128 đánh giá)</span>
                </div>

                {/* Price & Stock */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-bold text-indigo-600">
                            {(product.sellingPriceRetail || 0).toLocaleString('vi-VN')}₫
                        </span>
                        {product.sellingPriceRetail && product.sellingPriceRetail < (product.sellingPriceRetail || 0) * 1.2 && (
                        <>
                            <span className="text-xl text-gray-400 line-through">
                                {((product.sellingPriceRetail || 0) * 1.2).toLocaleString('vi-VN')}₫
                            </span>
                            <span className="bg-red-100 text-red-600 px-2 py-1 rounded-md text-sm font-semibold">
                                -17%
                            </span>
                        </>
                        )}
                    </div>
                    {isInStock ? (
                        <div className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">Còn hàng</div>
                    ) : (
                        <div className="px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-full">Hết hàng</div>
                    )}
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-b border-gray-200 py-6">
                <h3 className="font-semibold text-gray-900 mb-3">Mô tả sản phẩm</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description || 'Chưa có mô tả cho sản phẩm này.'}
                </p>
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Số lượng
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border-2 border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors"
                      disabled={!isInStock}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center border-x-2 border-gray-300 py-2 focus:outline-none"
                      min="1"
                      disabled={!isInStock}
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors"
                      disabled={!isInStock}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">Còn {product.stockQuantity || 0} sản phẩm</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!isInStock || addItemMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-600/30 disabled:bg-gray-400 disabled:shadow-none disabled:scale-100"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {isInStock ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                </button>
                
                <button
                  onClick={handleBuyNow}
                  disabled={!isInStock || addItemMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-indigo-50 transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-300"
                >
                  Mua ngay
                </button>

                <button
                  onClick={() => alert('Chia sẻ sản phẩm')}
                  className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  Chia sẻ
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6">
                <div className="text-center">
                  <div className="bg-indigo-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Truck className="w-6 h-6 text-indigo-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Giao hàng</p>
                  <p className="text-xs text-gray-600">Miễn phí</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Bảo hành</p>
                  <p className="text-xs text-gray-600">12 tháng</p>
                </div>
                <div className="text-center">
                  <div className="bg-orange-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <RefreshCw className="w-6 h-6 text-orange-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Đổi trả</p>
                  <p className="text-xs text-gray-600">7 ngày</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}