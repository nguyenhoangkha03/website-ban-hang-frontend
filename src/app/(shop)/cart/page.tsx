'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCartItems, useCartTotals } from '@/stores/cartStore';
import { useUpdateCartItem, useRemoveCartItem } from '@/hooks/api/useCartApi';
import { useProducts } from '@/hooks/api/useProducts';
import ProductCard from '@/components/product/ProductCard';

const ShoppingCartPage: React.FC = () => {
  const cartItems = useCartItems();
  const { totalPrice } = useCartTotals();
  const updateItemMutation = useUpdateCartItem();
  const removeItemMutation = useRemoveCartItem();
  
  // Fetch some products to display as related
  const { data: allFeaturedProducts = [] } = useProducts({ sortBy: 'featured' });
  const relatedProducts = allFeaturedProducts.slice(0, 4);

  const formatPrice = (price: number): string => {
    return price.toLocaleString('vi-VN') + 'đ';
  };
  
  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    updateItemMutation.mutate({ itemId, quantity: newQuantity });
  };
  
  const handleRemoveItem = (itemId: number) => {
    removeItemMutation.mutate(itemId);
  };

  const shipping = totalPrice > 0 ? 15000 : 0;
  const total = totalPrice + shipping;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng ({cartItems.length})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="grid grid-cols-12 gap-4 p-4 border-b text-sm font-medium text-gray-600">
                <div className="col-span-5">Sản phẩm</div>
                <div className="col-span-2 text-center">Đơn giá</div>
                <div className="col-span-2 text-center">Số lượng</div>
                <div className="col-span-2 text-center">Số tiền</div>
                <div className="col-span-1 text-center">Thao tác</div>
              </div>

              {cartItems.map(item => (
                <div key={item.id} className="border-b last:border-b-0">
                  <div className="grid grid-cols-12 gap-4 p-4 items-center">
                    <div className="col-span-5 flex items-center space-x-3">
                      <Image
                        src={item.product.images?.[0]?.imageUrl || '/placeholder.jpg'}
                        alt={item.product.productName}
                        width={80}
                        height={80}
                        className="object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{item.product.productName}</h3>
                        {item.product.supplier && (
                          <p className="text-sm text-gray-500">
                            Cung cấp bởi: 
                            <a href={`/suppliers/${item.product.supplier.id}`} className="text-indigo-600 hover:underline ml-1">
                              {item.product.supplier.supplierName}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="col-span-2 text-center">
                      <p className="font-medium text-gray-900">{formatPrice(item.product.sellingPriceRetail || 0)}</p>
                    </div>

                    <div className="col-span-2 flex items-center justify-center">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={item.quantity <= 1 || updateItemMutation.isPending}
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <input
                          type="text"
                          value={item.quantity}
                          readOnly
                          className="w-12 text-center border-x border-gray-300 h-8"
                        />
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                          disabled={updateItemMutation.isPending}
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    <div className="col-span-2 text-center">
                      <p className="font-bold text-orange-600">
                        {formatPrice((item.product.sellingPriceRetail || 0) * item.quantity)}
                      </p>
                    </div>

                    <div className="col-span-1 text-center">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 hover:bg-red-50 rounded-lg group"
                        disabled={removeItemMutation.isPending}
                      >
                        <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Tóm tắt đơn hàng</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính ({cartItems.length} sản phẩm):</span>
                  <span className="font-medium text-gray-900">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="font-medium text-gray-900">{formatPrice(shipping)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-base font-semibold text-gray-900">Tổng cộng:</span>
                    <span className="text-2xl font-bold text-orange-600">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
              <Link href="/checkout">
                <button
                  disabled={cartItems.length === 0}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Mua Hàng
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartPage;
