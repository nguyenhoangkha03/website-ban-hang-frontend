'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, MapPin, Mail, Loader2, Save, Phone, Edit2, X, Lock, CreditCard } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

// ✅ Import Hook Facade mới (Thay thế các hook api/useUser cũ)
import { useAuth } from '@/hooks/useAuth';
import { UpdateProfileSchema, UpdateProfileFormType } from '@/lib/validations/auth.validation'; // Đảm bảo đúng đường dẫn file validation

export default function UserProfileForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // ✅ Dùng useAuth để lấy data và hàm update (đã bao gồm Store + API)
    const { user, updateProfile, isUpdating, isAuthenticated } = useAuth();
    
    // Check xem có phải đang bị bắt buộc cập nhật không
    const isMissingInfo = searchParams.get('action') === 'update_info';

    const [imageError, setImageError] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Setup Form
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UpdateProfileFormType>({
        resolver: zodResolver(UpdateProfileSchema),
        // ✅ FIX LỖI TYPE: Khởi tạo giá trị rỗng để tránh undefined
        defaultValues: {
            customerName: '',
            phone: '',
            cccd: '',
            email: '',
            address: '',
            province: '',
            district: '',
            // Nếu schema có gender/contactPerson thì thêm vào đây, nếu không thì thôi
            // gender: 'other', 
        }
    });

    // Logic quyền sửa SĐT
    const canEditPhone = !user?.phone || isMissingInfo || (user?.authProvider !== 'PHONE');

    // ✅ Đồng bộ dữ liệu User vào Form
    useEffect(() => {
        if (!isAuthenticated) {
             // router.push('/login'); // Có thể để Page xử lý redirect
             return;
        }

        if (user) {
            if (isMissingInfo) setIsEditing(true);

            // ✅ FIX LỖI TYPE: Convert null/undefined về ''
            reset({
                customerName: user.customerName || '',
                phone: user.phone || '', 
                cccd: user.cccd || '',
                email: user.email || '',
                address: user.address || '',
                province: user.province || '',
                district: user.district || '',
            });
        }
    }, [user, isAuthenticated, reset, isMissingInfo]);   

    const onSubmit = (data: UpdateProfileFormType) => {
        // Gọi API update qua hook useAuth
        updateProfile({
            ...data,
            phone: data.phone!, // Chắc chắn có vì Zod đã validate
            cccd: data.cccd!
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        if (user) {
            reset({
                customerName: user.customerName || '',
                phone: user.phone || '',
                cccd: user.cccd || '',
                email: user.email || '',
                address: user.address || '',
                province: user.province || '',
                district: user.district || '',
            });
        }
    };

    // Loading State
    if (!user) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin text-[#009f4d]" size={40} />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Header Cover */}
            <div className="h-32 bg-gradient-to-r from-[#009f4d] to-green-400 relative"></div>

            <div className="px-8 pb-8">
                {/* Avatar Section */}
                <div className="relative -mt-12 mb-8 flex items-end justify-between flex-wrap gap-4">
                    <div className="flex items-end gap-4">
                        <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-md overflow-hidden flex items-center justify-center text-3xl font-bold text-[#009f4d] bg-green-50 relative shrink-0">
                            {(user?.avatarUrl && !imageError) ? (
                                <img 
                                    src={user.avatarUrl} 
                                    alt="Avatar" 
                                    className="w-full h-full object-cover" 
                                    onError={() => setImageError(true)}
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <span>
                                    {user?.customerName?.charAt(0).toUpperCase() || 'U'}
                                </span>
                            )}
                        </div>
                        <div className="mb-2">
                            <h1 className="text-2xl font-bold text-gray-900 line-clamp-1">{user?.customerName || 'Chưa cập nhật tên'}</h1>
                            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                                <span className={`px-2 py-0.5 rounded text-xs text-white ${user?.authProvider === 'PHONE' ? 'bg-orange-500' : 'bg-blue-500'}`}>
                                    {user?.authProvider || 'MEMBER'}
                                </span>
                                {user?.phone && (
                                    <>
                                        <span>•</span>
                                        <span>{user.phone}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Edit Toggle */}
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:text-[#009f4d] hover:border-green-200 transition-all shadow-sm font-medium"
                        >
                            <Edit2 size={16} /> Cập nhật hồ sơ
                        </button>
                    )}
                </div>

                {/* Cảnh báo thiếu thông tin */}
                {isMissingInfo && (
                    <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md animate-pulse">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700 font-medium">
                                ⚠️ Vui lòng cập nhật <strong>Số điện thoại</strong> và <strong>CCCD</strong> để hoàn tất đăng ký.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 1. Họ và tên */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <User size={16} /> Họ và tên
                            </label>
                            <input
                                {...register('customerName')}
                                disabled={!isEditing}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#009f4d] focus:ring-2 focus:ring-green-500/20 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                            />
                            {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName.message}</p>}
                        </div>

                        {/* 2. Số điện thoại */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Phone size={16} /> Số điện thoại <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    {...register('phone')}
                                    disabled={!isEditing || !canEditPhone} 
                                    className={`w-full px-4 py-2.5 rounded-lg border outline-none pr-10 transition-all
                                        ${(!isEditing || !canEditPhone) 
                                            ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed' 
                                            : 'bg-white border-gray-300 focus:border-[#009f4d] focus:ring-2 focus:ring-green-500/20'
                                        }`}
                                    placeholder="09xx..."
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    {!canEditPhone ? <Lock size={16} /> : (isEditing && <Edit2 size={16} />)}
                                </div>
                            </div>
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                        </div>

                            {/* 3. CCCD (MỚI THÊM) */}
                            <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <CreditCard size={16} /> Căn cước công dân (12 số) <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register('cccd')}
                                disabled={!isEditing}
                                maxLength={12}
                                placeholder="Nhập đủ 12 số CCCD"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#009f4d] focus:ring-2 focus:ring-green-500/20 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                            />
                            {errors.cccd && <p className="text-red-500 text-xs mt-1">{errors.cccd.message}</p>}
                        </div>

                        {/* 4. Email (Read-only) */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Mail size={16} /> Email liên kết
                            </label>
                            <div className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 flex items-center justify-between opacity-80`}>
                                <span>{user?.email || 'Chưa liên kết email'}</span>
                                <Lock size={14} className="text-gray-400"/>
                            </div>
                        </div>
                    </div>

                    {/* Section: Địa chỉ */}
                    <div className="border-t border-gray-100 pt-6 mt-2">
                        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                            <MapPin size={18} className="text-[#009f4d]" /> Địa chỉ giao hàng mặc định
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Địa chỉ chi tiết */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ chi tiết</label>
                                <input
                                    {...register('address')}
                                    disabled={!isEditing}
                                    placeholder="Số nhà, tên đường, thôn/xóm..."
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#009f4d] focus:ring-2 focus:ring-green-500/20 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                                />
                            </div>

                            {/* Tỉnh / Thành */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh / Thành phố</label>
                                <input
                                    {...register('province')}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#009f4d] focus:ring-2 focus:ring-green-500/20 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                                />
                            </div>

                            {/* Quận / Huyện */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quận / Huyện</label>
                                <input
                                    {...register('district')}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#009f4d] focus:ring-2 focus:ring-green-500/20 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    {isEditing && (
                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 animate-in slide-in-from-bottom-2">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
                            >
                                <X size={18} /> Hủy bỏ
                            </button>

                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="bg-[#009f4d] hover:bg-green-700 text-white font-bold py-2.5 px-8 rounded-lg flex items-center gap-2 disabled:opacity-70 shadow-lg shadow-green-600/20 transition-all"
                            >
                                {isUpdating ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                                Lưu thay đổi
                            </button>
                        </div>
                    )}

                </form>
            </div>
        </div>
    );
}