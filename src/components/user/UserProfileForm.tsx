'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, MapPin, Mail, Loader2, Save, Phone, Edit2, X, Lock } from 'lucide-react';

import { UpdateProfileSchema, UpdateProfileType } from '@/src/lib/validations/user';
import { useUserProfile, useUpdateProfile } from '@/src/hooks/api/useUser';
import { AccountUtils } from '@/src/lib/utils/account_utils';

export default function UserProfileForm() {
    const { data: userProfile, isLoading } = useUserProfile();
    const updateMutation = useUpdateProfile();

    // State for managing edit mode and image loading errors
    const [imageError, setImageError] = useState(false); // New state for image error handling
    const [isEditing, setIsEditing] = useState(false);

    // Setup Form
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UpdateProfileType>({
        resolver: zodResolver(UpdateProfileSchema),
    });

    const allowEditPhone = AccountUtils.canUpdatePhone(userProfile);

    // Reset image error state when user profile (and potentially avatarUrl) changes
    useEffect(() => {
        setImageError(false);
    }, [userProfile?.avatarUrl]);

    // Populate form data when API loads
    useEffect(() => {
        if (userProfile) {
            console.log("Dữ liệu profile tải về:", userProfile); 
            reset({
                customerName: userProfile.customerName || '',
                phone: userProfile.phone || '', 
                email: userProfile.email || '',
                address: userProfile.address || '',
                province: userProfile.province || '',
                district: userProfile.district || '',
            });
        }
    }, [userProfile, reset]);   

    const onSubmit = (data: UpdateProfileType) => {
        const submitData = { ...data };

        // Remove email field to prevent sending it to backend
        delete submitData.email;
        if (!allowEditPhone) {
            delete submitData.phone;
        }

        updateMutation.mutate(submitData, {
            onSuccess: () => setIsEditing(false)
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
        reset(); // Reset to old data on cancel
    };

    if (isLoading) {
        return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-green-600" size={32} /></div>;
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Header Cover */}
            <div className="h-32 bg-gradient-to-r from-green-600 to-emerald-500 relative"></div>

            <div className="px-8 pb-8">
                {/* Avatar Section */}
                <div className="relative -mt-12 mb-8 flex items-end justify-between flex-wrap gap-4">
                    <div className="flex items-end gap-4">
                        <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-md overflow-hidden flex items-center justify-center text-3xl font-bold text-green-700 bg-green-50 relative">
                            {/* Logic to display: Has URL AND No Error -> Show Image */}
                            {(userProfile?.avatarUrl && !imageError) ? (
                                <img 
                                    src={userProfile.avatarUrl} 
                                    alt="Avatar" 
                                    className="w-full h-full object-cover" 
                                    onError={() => setImageError(true)} // Set error state on load failure
                                    referrerPolicy="no-referrer" // Improve Google image loading
                                />
                            ) : (
                                // No URL or Image Error -> Show Initial
                                <span>
                                    {userProfile?.customerName?.charAt(0).toUpperCase() || 'U'}
                                </span>
                            )}
                        </div>
                        <div className="mb-2">
                            <h1 className="text-2xl font-bold text-gray-900">{userProfile?.customerName || 'Chưa cập nhật tên'}</h1>
                            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                                <span>{userProfile?.customerCode}</span>
                                <span>•</span>
                                <span>{userProfile?.phone}</span>
                            </div>
                        </div>
                    </div>

                    {/* Edit Mode Toggle Button (Hidden when editing) */}
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:text-green-600 hover:border-green-200 transition-all shadow-sm font-medium"
                        >
                            <Edit2 size={16} /> Cập nhật thông tin
                        </button>
                    )}
                </div>

                {/* Input Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Customer Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <User size={16} /> Họ và tên
                            </label>
                            <input
                                {...register('customerName')}
                                disabled={!isEditing} // Lock when not editing
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                            />
                            {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName.message}</p>}
                        </div>

                        {/* Phone Number - IMPORTANT: Always Disabled or ReadOnly based on logic */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Phone size={16} /> Số điện thoại
                            </label>

                            <div className="relative">
                                <input
                                    {...register('phone')}
                                    disabled={!isEditing || !allowEditPhone}
                                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none pr-10
                        ${(!isEditing || !allowEditPhone)
                                            ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed'
                                            : 'bg-white border-gray-300'
                                    }`}
                                    placeholder="Nhập số điện thoại..."
                                />

                                {/* Indicator Icon at end of input */}
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    {!allowEditPhone ? <Lock size={16} /> : <Edit2 size={16} />}
                                </div>
                            </div>

                            {/* Guideline Message */}
                            {!allowEditPhone && (
                                <p className="text-xs text-gray-400 mt-1">SĐT đăng nhập không thể thay đổi.</p>
                            )}
                            {allowEditPhone && isEditing && (
                                <p className="text-xs text-blue-600 mt-1">Bạn có thể thay đổi SĐT liên hệ.</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Mail size={16} /> Email
                            </label>
                            <div className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 flex items-center justify-between">
                                <span>{userProfile?.email || 'Chưa cập nhật'}</span>
                                {/* Account Type Badge */}
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                                    {userProfile?.authProvider || 'LINKED'}
                                </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Email được liên kết với tài khoản đăng nhập.</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                            <MapPin size={18} /> Địa chỉ giao hàng
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ chi tiết</label>
                                <input
                                    {...register('address')}
                                    disabled={!isEditing}
                                    placeholder="Số nhà, tên đường..."
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh / Thành phố</label>
                                <input
                                    {...register('province')}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quận / Huyện</label>
                                <input
                                    {...register('district')}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons: Only visible when editing */}
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
                                className="bg-[#009f4d] hover:bg-green-700 text-white font-bold py-2.5 px-8 rounded-lg flex items-center gap-2 disabled:opacity-70 shadow-lg shadow-green-100 transition-all"
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