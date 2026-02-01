'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    User, MapPin, Mail, Loader2, Save, Phone,
    Edit2, X, Lock, CreditCard, Eye, EyeOff, AlertCircle
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { UpdateProfileSchema, UpdateProfileFormType } from '@/lib/validations/auth.validation';
import { toast } from 'sonner';

export default function UserProfileForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, updateProfileAsync, isUpdating, isAuthenticated } = useAuth();

    // Check mode cập nhật
    const isMissingInfoMode = searchParams.get('action') === 'update_info';

    const [imageError, setImageError] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showCCCD, setShowCCCD] = useState(false);

    // Setup Form
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setError,
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

    // --- LOGIC CHECK THIẾU THÔNG TIN (HIGHLIGHT ĐỎ) ---
    // Chỉ highlight khi đang ở mode 'update_info' VÀ dữ liệu gốc (user) bị thiếu
    const isPhoneMissing = isMissingInfoMode && (!user?.phone || user.phone.trim() === '');
    const isCCCDMissing = isMissingInfoMode && (!user?.cccd || user.cccd.trim() === '');

    // Check địa chỉ: Coi là thiếu nếu 1 trong 3 trường chính bị trống
    const isAddressMissing = isMissingInfoMode && (
        !user?.address || !user?.province || !user?.district
    );

    // --- LOGIC QUYỀN HẠN ---
    const canEditPhone = !user?.phone || isMissingInfoMode || (user?.authProvider !== 'PHONE');
    const canEditEmail = user?.authProvider !== 'GOOGLE';
    const currentCCCD = watch('cccd');
    const inputTypeCCCD = (!currentCCCD || showCCCD) ? 'text' : 'password';

    // --- HELPER: Class CSS cho Input ---
    // Giúp code gọn hơn, tự động chuyển màu đỏ nếu thiếu
    const getInputClass = (isMissing: boolean, isDisabled: boolean) => {
        if (isMissing) {
            return 'border-red-500 bg-red-50 text-red-900 placeholder:text-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10';
        }
        if (isDisabled) {
            return 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed';
        }
        return 'bg-white border-gray-200 focus:border-[#009f4d] focus:ring-4 focus:ring-green-500/10 focus:bg-white';
    };

    useEffect(() => {
        if (!isAuthenticated) return;

        if (user) {
            // Nếu thiếu thông tin -> Tự động bật chế độ Edit
            if (isMissingInfoMode) setIsEditing(true);

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
    }, [user, isAuthenticated, reset, isMissingInfoMode]);

    const onSubmit = async (data: UpdateProfileFormType) => {
        try {
            await updateProfileAsync({
                ...data,
                phone: data.phone!,
                cccd: data.cccd!,
                email: canEditEmail ? data.email : user?.email
            });

            setIsEditing(false);
            toast.success('Cập nhật hồ sơ thành công!');

            // Nếu đang ở mode update_info, xóa params trên URL để tắt banner đỏ
            if (isMissingInfoMode) {
                router.replace('/profile');
            }

        } catch (error: any) {
            console.error("Lỗi cập nhật:", error);
            const errorMessage = error?.response?.data?.message || error?.message || "Có lỗi xảy ra";
            toast.error(errorMessage);

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
            // ✅ CHUYỂN ĐỔI NULL -> ''
            reset({
                customerName: user.customerName || '',
                phone: user.phone || '',
                cccd: user.cccd || '',
                email: user.email || '',
                address: user.address || '',
                province: user.province || '',
                district: user.district || '',
                // Nếu có các trường khác như gender thì thêm vào, ví dụ:
                // gender: user.gender || undefined, 
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
                {/* Avatar Section */}
                <div className="relative -mt-10 mb-8 flex items-end justify-between flex-wrap gap-4">
                    <div className="flex items-end gap-6">
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

                        <div className="mb-3 pt-4">
                            <h1 className="text-2xl font-bold text-gray-900 line-clamp-1">
                                {user?.customerName || 'Chưa cập nhật tên'}
                            </h1>
                            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mt-1">
                                <span className="px-2.5 py-0.5 rounded-md text-xs text-white font-bold shadow-sm bg-[#009f4d]">
                                    {user?.authProvider || 'MEMBER'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-[#009f4d] hover:border-green-200 transition-all shadow-sm font-medium mb-3"
                        >
                            <Edit2 size={16} /> Cập nhật hồ sơ
                        </button>
                    )}
                </div>

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
                                className={getInputClass(false, !isEditing) + " w-full px-4 py-3 rounded-xl border outline-none transition-all font-medium"}
                            />
                            {errors.customerName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.customerName.message}</p>}
                        </div>

                        {/* 2. Số điện thoại (CÓ LOGIC TÔ ĐỎ) */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Phone size={18} className={isPhoneMissing ? "text-red-500" : "text-gray-400"} />
                                Số điện thoại <span className="text-red-500">*</span>
                                {isPhoneMissing && <span className="text-xs text-red-500 font-normal italic ml-auto">(Bắt buộc)</span>}
                            </label>
                            <div className="relative">
                                <input
                                    {...register('phone')}
                                    disabled={!isEditing || !canEditPhone}
                                    className={`${getInputClass(isPhoneMissing, !isEditing || !canEditPhone)} w-full px-4 py-3 rounded-xl border outline-none pr-10 transition-all font-medium`}
                                    placeholder="09xx..."
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    {isPhoneMissing ? <AlertCircle size={18} className="text-red-500 animate-pulse" /> :
                                        (!canEditPhone ? <Lock size={16} /> : (isEditing && <Edit2 size={16} />))}
                                </div>
                            </div>
                            {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone.message}</p>}
                        </div>

                        {/* 3. CCCD (CÓ LOGIC TÔ ĐỎ) */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <CreditCard size={18} className={isCCCDMissing ? "text-red-500" : "text-gray-400"} />
                                Căn cước công dân <span className="text-red-500">*</span>
                                {isCCCDMissing && <span className="text-xs text-red-500 font-normal italic ml-auto">(Vui lòng bổ sung)</span>}
                            </label>
                            <div className="relative">
                                <input
                                    {...register('cccd')}
                                    type={inputTypeCCCD}
                                    disabled={!isEditing}
                                    maxLength={12}
                                    placeholder="Nhập đủ 12 số CCCD"
                                    className={`${getInputClass(isCCCDMissing, !isEditing)} w-full px-4 py-3 rounded-xl border outline-none pr-12 transition-all font-medium tracking-wide`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCCCD(!showCCCD)}
                                    className="absolute right-0 top-0 h-full px-4 text-gray-400 hover:text-gray-600 transition-colors"
                                    tabIndex={-1}
                                >
                                    {isCCCDMissing ? <AlertCircle size={20} className="text-red-500" /> : (showCCCD ? <EyeOff size={20} /> : <Eye size={20} />)}
                                </button>
                            </div>
                            {errors.cccd && <p className="text-red-500 text-xs mt-1 ml-1">{errors.cccd.message}</p>}
                        </div>

                        {/* 4. Email */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Mail size={18} className="text-gray-400" /> Email liên kết
                            </label>
                            <div className="relative">
                                <input
                                    {...register('email')}
                                    disabled={!isEditing || !canEditEmail}
                                    placeholder="example@gmail.com"
                                    className={`${getInputClass(false, !isEditing || !canEditEmail)} w-full px-4 py-3 rounded-xl border outline-none pr-10 transition-all font-medium`}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    {!canEditEmail ? <Lock size={16} /> : (isEditing && <Edit2 size={16} />)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section: Địa chỉ (CÓ LOGIC TÔ ĐỎ) */}
                    <div className="border-t border-gray-100 pt-8 mt-4">
                        <h3 className={`text-sm font-bold mb-6 uppercase tracking-wider flex items-center gap-2 ${isAddressMissing ? 'text-red-600 animate-pulse' : 'text-gray-900'}`}>
                            <MapPin size={18} className={isAddressMissing ? "text-red-600" : "text-[#009f4d]"} />
                            Địa chỉ giao hàng
                            {isAddressMissing && <span className="text-xs text-red-500 normal-case font-medium ml-2 border border-red-200 bg-red-50 px-2 py-0.5 rounded-full">Thiếu thông tin</span>}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Địa chỉ chi tiết */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ chi tiết <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input
                                        {...register('address')}
                                        disabled={!isEditing}
                                        placeholder="Số nhà, tên đường, thôn/xóm..."
                                        className={`${getInputClass(isAddressMissing && !user?.address, !isEditing)} w-full px-4 py-3 rounded-xl border outline-none transition-all`}
                                    />
                                    {(isAddressMissing && !user?.address) && <AlertCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500" />}
                                </div>
                            </div>

                            {/* Tỉnh / Thành */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tỉnh / Thành phố <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input
                                        {...register('province')}
                                        disabled={!isEditing}
                                        className={`${getInputClass(isAddressMissing && !user?.province, !isEditing)} w-full px-4 py-3 rounded-xl border outline-none transition-all`}
                                    />
                                    {(isAddressMissing && !user?.province) && <AlertCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500" />}
                                </div>
                            </div>

                            {/* Quận / Huyện */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quận / Huyện <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input
                                        {...register('district')}
                                        disabled={!isEditing}
                                        className={`${getInputClass(isAddressMissing && !user?.district, !isEditing)} w-full px-4 py-3 rounded-xl border outline-none transition-all`}
                                    />
                                    {(isAddressMissing && !user?.district) && <AlertCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500" />}
                                </div>
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