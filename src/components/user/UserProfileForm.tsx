'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  User, MapPin, Mail, Loader2, Save, Phone, 
  Edit2, X, Lock, CreditCard, Eye, EyeOff 
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { UpdateProfileSchema, UpdateProfileFormType } from '@/lib/validations/auth.validation';
import { toast } from 'sonner'; // Hoặc thư viện toast bạn đang dùng

export default function UserProfileForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, updateProfileAsync, isUpdating, isAuthenticated } = useAuth();
    
    const isMissingInfo = searchParams.get('action') === 'update_info';

    const [imageError, setImageError] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    // State cho việc hiện/ẩn CCCD
    const [showCCCD, setShowCCCD] = useState(false);

    // Setup Form
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setError, // Thêm setError để hiển thị lỗi field cụ thể nếu cần
        formState: { errors },
    } = useForm<UpdateProfileFormType>({
        resolver: zodResolver(UpdateProfileSchema),
        defaultValues: {
            customerName: '',
            phone: '',
            cccd: '',
            email: '',
            address: '',
            province: '',
            district: '',
        }
    });

    // --- LOGIC QUYỀN HẠN ---
    // 1. SĐT: Cho sửa nếu chưa có, hoặc không phải login bằng SĐT (cũ)
    const canEditPhone = !user?.phone || isMissingInfo || (user?.authProvider !== 'PHONE');
    
    // 2. Email: Google KHÔNG được sửa, còn lại (Zalo, FB, Phone) ĐƯỢC sửa
    const canEditEmail = user?.authProvider !== 'GOOGLE';

    // --- LOGIC HIỂN THỊ CCCD ---
    // Lấy giá trị CCCD hiện tại trong form
    const currentCCCD = watch('cccd');
    // Nếu không có CCCD (trống) HOẶC user bật nút xem -> Hiện text. Còn lại hiện password.
    const inputTypeCCCD = (!currentCCCD || showCCCD) ? 'text' : 'password';

    useEffect(() => {
        if (!isAuthenticated) return;

        if (user) {
            if (isMissingInfo) setIsEditing(true);

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

   const onSubmit = async (data: UpdateProfileFormType) => {
    try {
        // ✅ Thêm await: Bắt buộc chờ Backend trả lời
        await updateProfileAsync({
            ...data,
            phone: data.phone!,
            cccd: data.cccd!,
            // Chỉ gửi email nếu được phép sửa
            email: canEditEmail ? data.email : user?.email 
        });

        // ✅ Chỉ chạy xuống đây nếu thành công (Backend trả về 200 OK)
        setIsEditing(false); // Lúc này mới đóng Form
        toast.success('Cập nhật hồ sơ thành công!');
        
    } catch (error: any) {
        // ❌ Nếu Backend báo lỗi (409 Trùng SĐT...), code sẽ nhảy vào đây
        // Form vẫn mở (isEditing = true) để người dùng sửa lại
        console.error("Lỗi cập nhật:", error);

        // Hiển thị thông báo lỗi từ backend
        // Giả sử backend trả về lỗi dạng { message: "..." } hoặc { error: "..." }
        const errorMessage = error?.response?.data?.message || error?.message || "Có lỗi xảy ra khi cập nhật";
        toast.error(errorMessage);

        // Nếu lỗi liên quan đến field cụ thể (ví dụ backend trả về field nào lỗi), 
        // bạn có thể dùng setError để highlight field đó.
        // Ví dụ đơn giản:
        if (errorMessage.toLowerCase().includes('số điện thoại')) {
             setError('phone', { type: 'manual', message: errorMessage });
        }
        if (errorMessage.toLowerCase().includes('cccd')) {
             setError('cccd', { type: 'manual', message: errorMessage });
        }
    }
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
            <div className="h-40 bg-gradient-to-r from-[#009f4d] to-green-400 relative"></div>

            <div className="px-8 pb-8">
                {/* Avatar Section - Đã chỉnh lại margin để đẩy xuống thấp hơn */}
                <div className="relative -mt-10 mb-8 flex items-end justify-between flex-wrap gap-4">
                    <div className="flex items-end gap-6">
                        {/* Avatar */}
                        <div className="w-28 h-28 rounded-full border-[5px] border-white bg-white shadow-lg overflow-hidden flex items-center justify-center text-4xl font-bold text-[#009f4d] bg-green-50 relative shrink-0 z-10">
                            {(user?.avatarUrl && !imageError) ? (
                                <img 
                                    src={user.avatarUrl} 
                                    alt="Avatar" 
                                    className="w-full h-full object-cover" 
                                    onError={() => setImageError(true)}
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <span>{user?.customerName?.charAt(0).toUpperCase() || 'U'}</span>
                            )}
                        </div>
                        
                        {/* Tên & Badge - Đẩy xuống thấp hơn và thêm padding top */}
                        <div className="mb-3 pt-4">
                            <h1 className="text-2xl font-bold text-gray-900 line-clamp-1">
                                {user?.customerName || 'Chưa cập nhật tên'}
                            </h1>
                            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mt-1">
                                <span className={`px-2.5 py-0.5 rounded-md text-xs text-white font-bold shadow-sm 
                                    ${user?.authProvider === 'ZALO' ? 'bg-blue-500' : 
                                      user?.authProvider === 'GOOGLE' ? 'bg-red-500' : 
                                      user?.authProvider === 'FACEBOOK' ? 'bg-[#1877F2]' : 'bg-orange-500'}`}>
                                    {user?.authProvider || 'MEMBER'}
                                </span>
                                {user?.phone && (
                                    <>
                                        <span className="text-gray-300">•</span>
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
                            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-[#009f4d] hover:border-green-200 transition-all shadow-sm font-medium mb-3"
                        >
                            <Edit2 size={16} /> Cập nhật hồ sơ
                        </button>
                    )}
                </div>

                {/* Cảnh báo thiếu thông tin */}
                {isMissingInfo && (
                    <div className="mb-8 bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg animate-pulse flex items-start gap-3">
                        <div className="text-orange-500 mt-0.5"><Lock size={20}/></div>
                        <div>
                            <h4 className="font-bold text-orange-800 text-sm">Thông tin chưa đầy đủ</h4>
                            <p className="text-sm text-orange-700 mt-1">
                                Vui lòng cập nhật <strong>Số điện thoại</strong> và <strong>CCCD</strong> để hoàn tất bảo mật tài khoản.
                            </p>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* 1. Họ và tên */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <User size={18} className="text-gray-400" /> Họ và tên
                            </label>
                            <input
                                {...register('customerName')}
                                disabled={!isEditing}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#009f4d] focus:ring-4 focus:ring-green-500/10 outline-none disabled:bg-gray-100 disabled:text-gray-500 transition-all font-medium"
                            />
                            {errors.customerName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.customerName.message}</p>}
                        </div>

                        {/* 2. Số điện thoại */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Phone size={18} className="text-gray-400" /> Số điện thoại <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    {...register('phone')}
                                    disabled={!isEditing || !canEditPhone} 
                                    className={`w-full px-4 py-3 rounded-xl border outline-none pr-10 transition-all font-medium
                                        ${(!isEditing || !canEditPhone) 
                                            ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed' 
                                            : 'bg-white border-gray-200 focus:border-[#009f4d] focus:ring-4 focus:ring-green-500/10'
                                        }`}
                                    placeholder="09xx..."
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    {!canEditPhone ? <Lock size={16} /> : (isEditing && <Edit2 size={16} />)}
                                </div>
                            </div>
                            {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone.message}</p>}
                        </div>

                        {/* 3. CCCD (CÓ ICON MẮT & BẢO MẬT) */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <CreditCard size={18} className="text-gray-400" /> Căn cước công dân <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    {...register('cccd')}
                                    type={inputTypeCCCD} // Tự động đổi type text/password
                                    disabled={!isEditing}
                                    maxLength={12}
                                    placeholder="Nhập đủ 12 số CCCD"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#009f4d] focus:ring-4 focus:ring-green-500/10 outline-none disabled:bg-gray-100 disabled:text-gray-500 transition-all font-medium pr-12 tracking-wide"
                                />
                                {/* Nút con mắt */}
                                <button 
                                    type="button"
                                    onClick={() => setShowCCCD(!showCCCD)}
                                    className="absolute right-0 top-0 h-full px-4 text-gray-400 hover:text-gray-600 transition-colors"
                                    tabIndex={-1} // Không tab vào nút này
                                >
                                    {showCCCD ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.cccd && <p className="text-red-500 text-xs mt-1 ml-1">{errors.cccd.message}</p>}
                        </div>

                        {/* 4. Email (UPDATE LOGIC MỚI) */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Mail size={18} className="text-gray-400" /> Email liên kết
                            </label>
                            <div className="relative">
                                <input
                                    {...register('email')}
                                    disabled={!isEditing || !canEditEmail}
                                    placeholder="example@gmail.com"
                                    className={`w-full px-4 py-3 rounded-xl border outline-none pr-10 transition-all font-medium
                                        ${(!isEditing || !canEditEmail) 
                                            ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed' 
                                            : 'bg-white border-gray-200 focus:border-[#009f4d] focus:ring-4 focus:ring-green-500/10'
                                        }`}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    {!canEditEmail ? <Lock size={16} /> : (isEditing && <Edit2 size={16} />)}
                                </div>
                            </div>
                            
                            {/* Chú thích nhỏ bên dưới */}
                            <div className="mt-2 flex items-center gap-2 text-xs">
                                {canEditEmail ? (
                                    <span className="text-blue-600 flex items-center gap-1">
                                        <Edit2 size={10} /> Bạn có thể cập nhật email liên hệ
                                    </span>
                                ) : (
                                    <span className="text-gray-400 flex items-center gap-1 italic">
                                        <Lock size={10} /> Tài khoản Google không thể thay đổi email
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Section: Địa chỉ */}
                    <div className="border-t border-gray-100 pt-8 mt-4">
                        <h3 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider flex items-center gap-2">
                            <MapPin size={18} className="text-[#009f4d]" /> Địa chỉ giao hàng
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Địa chỉ chi tiết */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ chi tiết</label>
                                <input
                                    {...register('address')}
                                    disabled={!isEditing}
                                    placeholder="Số nhà, tên đường, thôn/xóm..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#009f4d] focus:ring-4 focus:ring-green-500/10 outline-none disabled:bg-gray-100 disabled:text-gray-500 transition-all"
                                />
                            </div>

                            {/* Tỉnh / Thành */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tỉnh / Thành phố</label>
                                <input
                                    {...register('province')}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#009f4d] focus:ring-4 focus:ring-green-500/10 outline-none disabled:bg-gray-100 disabled:text-gray-500 transition-all"
                                />
                            </div>

                            {/* Quận / Huyện */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quận / Huyện</label>
                                <input
                                    {...register('district')}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#009f4d] focus:ring-4 focus:ring-green-500/10 outline-none disabled:bg-gray-100 disabled:text-gray-500 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    {isEditing && (
                        <div className="flex justify-end gap-4 pt-8 border-t border-gray-100 animate-in slide-in-from-bottom-2">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all flex items-center gap-2"
                            >
                                <X size={20} /> Hủy bỏ
                            </button>

                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="bg-[#009f4d] hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 disabled:opacity-70 shadow-lg shadow-green-600/20 transition-all transform hover:scale-[1.02] active:scale-95"
                            >
                                {isUpdating ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                Lưu thay đổi
                            </button>
                        </div>
                    )}

                </form>
            </div>
        </div>
    );
}