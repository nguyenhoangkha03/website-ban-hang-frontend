'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, MapPin, Mail, Loader2, Save, Phone, Edit2, X, Lock } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore'; // ✅ 1. Import Store

import { UpdateProfileSchema, UpdateProfileType } from '@/lib/validations/user.validation';
import { useUserProfile, useUpdateProfile } from '@/hooks/api/useUser';
import { toast } from 'react-hot-toast';

export default function UserProfileForm() {
    // ✅ 2. Lấy dữ liệu user từ LocalStorage (Có ngay lập tức)
    const { user: localUser } = useAuthStore();

    // Lấy dữ liệu mới nhất từ API (Sẽ có sau khoảng 1-2s)
    // Đổi tên biến data -> apiProfile để tránh nhầm lẫn
    const { data: apiProfile, isLoading } = useUserProfile();
    
    const updateMutation = useUpdateProfile();

    const [imageError, setImageError] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // ✅ 3. Hợp nhất dữ liệu: Ưu tiên API, nếu chưa có thì dùng LocalStorage
    // Giúp người dùng không bao giờ thấy trang trắng
    const userProfile = apiProfile || localUser;

    // Setup Form
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<UpdateProfileType>({
        resolver: zodResolver(UpdateProfileSchema),
        // ✅ 4. Điền giá trị mặc định ngay từ đầu bằng LocalUser
        defaultValues: {
            customerName: localUser?.customerName || '',
            phone: localUser?.phone || '',
            email: localUser?.email || '',
            address: '', // LocalStorage thường không lưu cái này để tiết kiệm, chờ API
            province: '',
            district: '',
        }
    });

    const canEditPhone = userProfile?.authProvider !== 'PHONE';

    // Reset image error state when avatar changes
    useEffect(() => {
        setImageError(false);
    }, [userProfile?.avatarUrl]);

    // ✅ 5. Khi API tải xong (apiProfile có data), tự động điền lại Form
    useEffect(() => {
        if (userProfile) {
            console.log("🔄 Đồng bộ dữ liệu mới nhất vào Form...", userProfile);
            reset({
                customerName: userProfile.customerName || '',
                phone: userProfile.phone || '', 
                email: userProfile.email || '',
                // Ưu tiên lấy từ API, nếu không có thì để trống
                address: userProfile.address || '',
                province: userProfile.province || '',
                district: userProfile.district || '',
            });
        }
    }, [userProfile, reset]);   

const onSubmit = (data: UpdateProfileType) => {
        const submitData = { ...data };
        if (!canEditPhone) delete submitData.phone;
        delete submitData.email;

        // Bắt đầu gọi API
        // Mẹo: Dùng toast.promise để hiện Loading đẹp mắt luôn
        const updatePromise = updateMutation.mutateAsync(submitData);

        toast.promise(updatePromise, {
            loading: 'Đang lưu thay đổi...',
            success: (data) => {
                setIsEditing(false); // Tắt chế độ sửa
                return '✅ Cập nhật hồ sơ thành công!'; // Hiện thông báo xanh
            },
            error: (err) => {
                // Logic xử lý lỗi hiển thị đỏ
                const status = err?.response?.status;
                if (status === 409) {
                    return '❌ Số điện thoại đã tồn tại!';
                }
                return '❌ Cập nhật thất bại, vui lòng thử lại.';
            }
        });
        
        // ⚠️ Lưu ý: Vì dùng toast.promise ở trên xử lý hết rồi
        // nên ta có thể bỏ logic trong onError/onSuccess của mutate cũ đi
        // HOẶC giữ cách cũ nhưng thay alert bằng toast.success:
        
        /* CÁCH CŨ CỦA BẠN (SỬA NHANH):
        updateMutation.mutate(submitData, {
            onSuccess: () => {
                setIsEditing(false);
                toast.success("✅ Cập nhật thành công!"); // 👈 Thay alert bằng dòng này
            },
            onError: (error: any) => {
                // ... logic check 409 cũ ...
                if (status === 409) {
                    setError(...)
                } else {
                    toast.error("❌ " + backendMsg); // 👈 Thay alert lỗi bằng dòng này
                }
            }
        });
        */
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Khi hủy, reset về giá trị hiện tại (ưu tiên API)
        reset({
            customerName: userProfile?.customerName || '',
            phone: userProfile?.phone || '',
            email: userProfile?.email || '',
            address: userProfile?.address || '',
            province: userProfile?.province || '',
            district: userProfile?.district || '',
        }); 
    };

    // ✅ 6. Chỉ hiện Loading khi KHÔNG CÓ CẢ 2 nguồn dữ liệu (Lần đầu truy cập chưa login bao giờ)
    if (isLoading && !localUser) {
        return (
            <div className="flex justify-center items-center p-12 h-64">
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
                            {(userProfile?.avatarUrl && !imageError) ? (
                                <img 
                                    src={userProfile.avatarUrl} 
                                    alt="Avatar" 
                                    className="w-full h-full object-cover" 
                                    onError={() => setImageError(true)}
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <span>
                                    {userProfile?.customerName?.charAt(0).toUpperCase() || 'U'}
                                </span>
                            )}
                        </div>
                        <div className="mb-2">
                            <h1 className="text-2xl font-bold text-gray-900 line-clamp-1">{userProfile?.customerName || 'Chưa cập nhật tên'}</h1>
                            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                                <span className={`px-2 py-0.5 rounded text-xs text-white ${userProfile?.authProvider === 'PHONE' ? 'bg-orange-500' : 'bg-blue-500'}`}>
                                    {userProfile?.authProvider || 'MEMBER'}
                                </span>
                                {userProfile?.phone && (
                                    <>
                                        <span>•</span>
                                        <span>{userProfile.phone}</span>
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
                                <Phone size={16} /> Số điện thoại
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
                                    placeholder="Nhập số điện thoại liên hệ..."
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    {!canEditPhone ? <Lock size={16} /> : (isEditing && <Edit2 size={16} />)}
                                </div>
                            </div>
                            
                            {!canEditPhone ? (
                                <p className="text-[11px] text-gray-400 mt-1 italic">Tài khoản đăng nhập bằng SĐT không thể thay đổi số.</p>
                            ) : (
                                isEditing && <p className="text-[11px] text-blue-600 mt-1">Bạn có thể cập nhật số điện thoại liên lạc.</p>
                            )}
                        </div>

                        {/* 3. Email (Read-only) */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Mail size={16} /> Email liên kết
                            </label>
                            <div className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 flex items-center justify-between
                                ${isEditing ? 'opacity-70' : ''}
                            `}>
                                <span>{userProfile?.email || 'Chưa liên kết email'}</span>
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
                                disabled={updateMutation.isPending}
                                className="bg-[#009f4d] hover:bg-green-700 text-white font-bold py-2.5 px-8 rounded-lg flex items-center gap-2 disabled:opacity-70 shadow-lg shadow-green-600/20 transition-all"
                            >
                                {updateMutation.isPending ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                                Lưu thay đổi
                            </button>
                        </div>
                    )}

                </form>
            </div>
        </div>
    );
}