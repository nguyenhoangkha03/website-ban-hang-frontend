'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { MapPin, Truck } from 'lucide-react';
import { useCartItems, useCartTotals } from '@/stores/cartStore';
import { useRouter } from 'next/navigation';
import { useCreateOrder } from '@/hooks/api/useSalesOrder';
import AddressModal, { Address } from '@/components/checkout/AddressModal';
import { useShippingOptions } from '@/hooks/api/useShippingOptions';
import { useCustomerProfile } from '@/hooks/api/useCustomerProfile';
import { ShippingProvider } from '@/types/shipping';

const initialAddress: Address = {
  id: 1,
  name: 'Nguyễn Văn A',
  phone: '0123456789',
  address: '123 Đường ABC, Phường 1, Quận 2, Thành phố Hồ Chí Minh',
  type: 'home',
};

const CheckoutPage: React.FC = () => {
  const items = useCartItems();
  const { totalPrice } = useCartTotals();
  const router = useRouter();
  const createOrderMutation = useCreateOrder();
  const { data: customerProfile } = useCustomerProfile(); // Use the hook here
  
  const [note, setNote] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address>(initialAddress);
  const [selectedShipping, setSelectedShipping] = useState<ShippingProvider | null>(null);

  const { data: shippingOptions, isLoading: isLoadingShipping, error: shippingError } = useShippingOptions();

  const effectiveSelectedShipping = selectedShipping || (shippingOptions?.[0] || null);

  

  const formatPrice = (price: number | undefined | null): string => {
    if (price === undefined || price === null) {
      return '0đ';
    }
    return price.toLocaleString('vi-VN') + 'đ';
  };

  const shippingFee = effectiveSelectedShipping?.cost ?? 0;
  const discount = 0;
  const total = totalPrice + shippingFee - discount;

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      alert('Giỏ hàng của bạn đang trống.');
      return;
    }
    if (!effectiveSelectedShipping) {
      alert('Vui lòng chọn một phương thức vận chuyển.');
      return;
    }
    // Ensure customerProfile is loaded before placing order
    if (!customerProfile) {
      alert('Vui lòng đăng nhập để đặt hàng.');
      router.push('/login'); // Redirect to login if not logged in
      return;
    }

    const orderPayload = {
      customerId: customerProfile.id, // Use customer ID from profile
      paymentMethod: 'cash' as const,
      shippingFee: shippingFee,
      notes: note,
      warehouseId: 1, // Hardcoded for now
      shippingAddress: `${selectedAddress.name}, ${selectedAddress.phone}, ${selectedAddress.address}`,
      // Add shippingProviderId if your backend supports it
      // shippingProviderId: selectedShipping.id, 
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.product.sellingPriceRetail || 0,
      })),
    };

    createOrderMutation.mutate(orderPayload, {
      onSuccess: (data) => {
        alert('Đơn hàng của bạn đã được đặt thành công!');
        if (data && data.data && data.data.id) {
          router.push(`/tracking?orderId=${data.data.id}`);
        } else {
          console.error('Order ID not found in API response:', data);
          alert('Không thể lấy được ID đơn hàng. Vui lòng thử lại.');
        }
      },
      onError: (error) => {
        console.error('Failed to create order:', error);
        alert('Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
      },
    });
  };

  const renderShippingOptions = () => {
    if (isLoadingShipping) {
      return (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg animate-pulse bg-gray-100">
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              </div>
              <div className="h-3 bg-gray-300 rounded w-1/2 mt-2"></div>
            </div>
          ))}
        </div>
      );
    }

    if (shippingError) {
      return <p className="text-red-600">Lỗi khi tải các phương thức vận chuyển.</p>;
    }

    return (
      <div className="space-y-4">
        {shippingOptions?.map((option) => (
          <div
            key={option.id}
            onClick={() => setSelectedShipping(option)}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              effectiveSelectedShipping?.id === option.id
                ? 'ring-2 ring-orange-500 border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="font-semibold text-gray-800">{option.name}</div>
              <div className="font-bold text-gray-900">{formatPrice(option.cost)}</div>
            </div>
            <p className="text-sm text-gray-500 mt-1">{option.estimatedDelivery}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectAddress={setSelectedAddress}
        currentAddressId={selectedAddress.id}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thanh Toán</h1>
          <p className="text-gray-600 mb-8">Vui lòng kiểm tra lại thông tin đơn hàng trước khi tiếp tục.</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Địa chỉ nhận hàng</h2>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Thay đổi
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <MapPin className="w-6 h-6 text-orange-600 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-900">{selectedAddress.name}</span>
                    <span className="text-gray-500 mx-2">|</span>
                    <span className="text-gray-700">SĐT: {selectedAddress.phone}</span>
                    <p className="text-gray-600 text-sm mt-1">{selectedAddress.address}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Truck className="w-6 h-6 mr-3 text-orange-600" />
                  Phương thức vận chuyển
                </h2>
                {renderShippingOptions()}
              </div>

              {/* Products & Note */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Sản phẩm</h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 pb-4 border-b last:border-b-0">
                      <Image
                        src={item.product.images?.[0]?.imageUrl || '/placeholder.jpg'}
                        alt={item.product.productName}
                        width={80}
                        height={80}
                        className="object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{item.product.productName}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">× {item.quantity}</span>
                          <span className="font-semibold text-gray-900">{formatPrice(item.product.sellingPriceRetail)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Lưu ý cho người bán..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24 space-y-6">
                <h3 className="font-bold text-gray-900 mb-4">Tổng kết đơn hàng</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tổng tiền hàng</span>
                    <span className="font-medium text-gray-900">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="font-medium text-gray-900">{formatPrice(shippingFee)}</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold text-gray-900">Tổng thanh toán</span>
                      <span className="text-2xl font-bold text-orange-600">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  disabled={createOrderMutation.isPending || items.length === 0}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {createOrderMutation.isPending ? 'Đang xử lý...' : 'Đặt Hàng'}
                </button>
                <div className="text-xs text-gray-500 text-center">
                  Nhấn &quot;Đặt hàng&quot; đồng nghĩa với việc bạn đồng ý tuân theo{' '}
                  <a href="#" className="text-orange-600 hover:underline">
                    Điều khoản E-commerce
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
