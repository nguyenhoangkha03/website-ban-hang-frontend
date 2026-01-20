'use client';

import { useState } from 'react';
import type { FC } from 'react';
import {
  CreditCard,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Landmark,
  AlertCircle
} from 'lucide-react';
import { useGetPaymentMethods, useDeletePaymentMethod, PaymentMethod } from '@/hooks/api/usePaymentMethods';
import { toast } from 'react-hot-toast';
import Sidebar from '@/components/user-profile/Sidebar'; // Import shared sidebar
import { useUserProfile } from '@/hooks/api/useUserProfile'; // Import user profile hook

// --- HELPER FUNCTIONS & COMPONENTS ---

const getCardLogo = (provider: string) => {
    const lowerProvider = provider.toLowerCase();
    if (lowerProvider.includes('vietcombank')) return { logo: '🏦', color: 'bg-green-600' };
    if (lowerProvider.includes('techcombank')) return { logo: '🏦', color: 'bg-red-600' };
    if (lowerProvider.includes('visa')) return { logo: '💳', color: 'bg-blue-800' };
    if (lowerProvider.includes('mastercard')) return { logo: '💳', color: 'bg-gray-700' };
    if (lowerProvider.includes('mb bank')) return { logo: '🏦', color: 'bg-blue-900' };
    return { logo: '🏦', color: 'bg-gray-500' };
};

const PaymentCard: FC<{ method: PaymentMethod; onDelete: (id: number) => void; }> = ({ method, onDelete }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { logo, color } = getCardLogo(method.provider);

    const handleEdit = () => {
      setIsMenuOpen(false);
      alert(`Chức năng chỉnh sửa cho: ${method.id}`);
    };

    const handleDelete = () => {
      setIsMenuOpen(false);
      if (confirm('Bạn có chắc muốn xóa phương thức thanh toán này?')) {
        onDelete(method.id);
      }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow relative">
            <div className="p-5">
                <div className="absolute top-3 right-3">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-lg hover:bg-gray-100">
                        <MoreVertical className="w-5 h-5 text-gray-500" />
                    </button>
                    {isMenuOpen && (
                         <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10 border border-gray-200">
                            <button onClick={handleEdit} className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                               <Pencil className="w-4 h-4 text-blue-600" /> Chỉnh sửa
                            </button>
                            <button onClick={handleDelete} className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100">
                               <Trash2 className="w-4 h-4" /> Xóa
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-5">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-white text-3xl shadow-md ${color} transform transition-transform hover:scale-110`}>
                        {logo}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{method.provider}</h3>
                        <p className="text-sm text-gray-500">
                           **** **** **** {method.type === 'bank' ? method.accountNumber : method.cardNumber}
                        </p>
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between items-center rounded-b-xl">
                 <p className="text-sm text-gray-500">{method.type === 'bank' ? 'Tài khoản ngân hàng' : 'Thẻ tín dụng'}</p>
                 {method.isDefault && <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">Mặc định</span>}
            </div>
        </div>
    )
}

const EmptyState = () => (
    <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center text-center p-12 bg-gray-50 rounded-lg border-2 border-dashed">
        <Landmark className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-800">Chưa có phương thức thanh toán</h3>
        <p className="text-gray-500 mt-2">Thêm tài khoản ngân hàng hoặc thẻ để thanh toán nhanh hơn.</p>
         <button className="mt-6 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5" />
            Thêm ngay
        </button>
    </div>
);

const LoadingState = () => (
    <>
        {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
                <div className="flex items-center gap-5 animate-pulse">
                    <div className="w-16 h-16 rounded-xl bg-gray-200"></div>
                    <div className="space-y-2">
                        <div className="h-5 w-32 bg-gray-200 rounded"></div>
                        <div className="h-4 w-40 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        ))}
    </>
)

// --- MAIN PAGE COMPONENT ---
const PaymentMethodsPage: FC = () => {
    const { data: paymentMethods, isLoading, isError } = useGetPaymentMethods();
    const { data: userProfileData } = useUserProfile();
    const deleteMutation = useDeletePaymentMethod();

    const handleDelete = (id: number) => {
        deleteMutation.mutate(id, {
            onSuccess: () => {
                toast.success('Đã xóa phương thức thanh toán!');
            },
            onError: (error) => {
                toast.error('Xóa thất bại. Vui lòng thử lại.');
                console.error(error);
            }
        });
    };

    return (
        <div className="bg-gray-50 min-h-screen">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <Sidebar active="payment" userName={userProfileData?.fullName} />
              <main className="flex-1">
                 <h1 className="text-4xl font-bold text-gray-900 mb-6">Quản lý Tài khoản & Thẻ</h1>
                 <div className="flex items-center gap-4 mb-8">
                    <button className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-all">
                        <Plus className="w-5 h-5" />
                        Thêm tài khoản ngân hàng
                    </button>
                     <button className="flex items-center gap-2 px-5 py-3 bg-white text-gray-700 font-medium border-2 border-gray-200 rounded-lg shadow-sm hover:border-gray-300 transition-all">
                        <CreditCard className="w-5 h-5" />
                        Thêm thẻ tín dụng
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:col-span-2">
                    {isError && (
                        <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center text-center p-12 bg-red-50 rounded-lg border-2 border-dashed border-red-200">
                            <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
                            <h3 className="text-xl font-semibold text-red-800">Không thể tải dữ liệu</h3>
                            <p className="text-red-600 mt-2">Đã có lỗi xảy ra. Vui lòng thử lại sau.</p>
                        </div>
                    )}
                 </div>

                 <div className="grid grid-cols-1 md:col-span-2 lg:grid-cols-2 gap-6">
                    {isLoading && <LoadingState />}
                    {paymentMethods && paymentMethods.length > 0 && !isLoading ? (
                        paymentMethods.map(method => (
                            <PaymentCard key={method.id} method={method} onDelete={handleDelete} />
                        ))
                    ) : null}
                    {paymentMethods && paymentMethods.length === 0 && !isLoading && !isError && (
                        <EmptyState />
                    )}
                 </div>
                 
                <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-6 rounded-lg">
                    <h4 className="font-semibold text-blue-900">💡 Lưu ý bảo mật</h4>
                    <p className="text-sm mt-1 leading-relaxed">
                        Thông tin tài khoản ngân hàng và thẻ của bạn được mã hóa và bảo mật tuyệt đối. Chúng tôi không bao giờ lưu trữ mã CVV/CVC.
                    </p>
                </div>
              </main>
            </div>
          </div>
        </div>
      );
};

export default PaymentMethodsPage;
