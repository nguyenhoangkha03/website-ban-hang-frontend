'use client';

import { useEffect } from 'react';
import type { FC } from 'react';
import {
  Camera,
  User,
} from 'lucide-react';
import { useUserProfile, useUpdateUserProfile } from '@/hooks/api/useUserProfile';
import { UpdateUserRequest } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import toast from 'react-hot-toast';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const updateProfileSchema = z.object({
  fullName: z.string().min(1, 'Tên không được để trống').optional(),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
});

import Sidebar from '@/components/user-profile/Sidebar';


// --- MAIN PAGE COMPONENT ---
const UserProfilePage: FC = () => {
    const { data: userProfileData, isLoading, isError } = useUserProfile();
    const { mutate: updateUser, isPending: isUpdating } = useUpdateUserProfile();

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<UpdateUserRequest>({
        resolver: zodResolver(updateProfileSchema),
    });

    useEffect(() => {
        if (userProfileData) {
            reset(userProfileData);
        }
    }, [userProfileData, reset]);

    const handleSave = (data: UpdateUserRequest) => {
        updateUser(data, {
            onSuccess: () => {
                toast.success('Hồ sơ đã được cập nhật thành công!');
            },
            onError: () => {
                toast.error('Không thể cập nhật hồ sơ. Vui lòng thử lại.');
            }
        });
    };
    
    if (isLoading) {
        return <div className="flex flex-col lg:flex-row gap-8">
    <div className="w-1/4">
        <Skeleton className="h-32 w-full mb-6" />
        <Skeleton className="h-8 w-full mb-2" />
        <Skeleton className="h-8 w-full mb-2" />
        <Skeleton className="h-8 w-full mb-2" />
    </div>
    <div className="w-3/4">
        <Skeleton className="h-48 w-full mb-6" />
        <Skeleton className="h-12 w-full mb-6" />
        <Skeleton className="h-12 w-full mb-6" />
    </div>
</div>;
    }

    if (isError) {
        return <div className="text-center py-20">Có lỗi xảy ra khi tải thông tin người dùng.</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <Sidebar active="profile" userName={userProfileData?.fullName} />
              <main className="flex-1 bg-white p-8 rounded-lg shadow-sm">
                <h1 className="text-3xl font-bold text-gray-900">Hồ sơ của tôi</h1>
                <p className="text-gray-600 mt-1 mb-8">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>

                <form onSubmit={handleSubmit(handleSave)}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Avatar Section */}
                    <div className="md:col-span-1 flex flex-col items-center text-center">
                       <div className="relative mb-4">
                          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center shadow-xl">
                               <User className="w-24 h-24 text-white" />
                          </div>
                          <button className="absolute bottom-1 right-1 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md hover:bg-blue-700 transition-colors">
                              <Camera className="w-5 h-5"/>
                          </button>
                       </div>
                       <h2 className="text-lg font-semibold">Ảnh đại diện</h2>
                       <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF no bigger than 5MB</p>
                       <button className="mt-4 px-6 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-200">
                          Tải lên
                       </button>
                    </div>

                    {/* Form Fields Section */}
                    <div className="md:col-span-2">
                      <div className="space-y-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                               <div>
                                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Tên thật</label>
                                  <input
                                      type="text"
                                      id="fullName"
                                      {...register('fullName')}
                                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                  />
                                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                              </div>
                              <div>
                                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                  <input
                                      type="email"
                                      id="email"
                                      defaultValue={userProfileData?.email}
                                      disabled
                                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                  />
                              </div>
                          </div>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              <div>
                                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                                  <input
                                      type="tel"
                                      id="phone"
                                      {...register('phone')}
                                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                  />
                              </div>
                              <div>
                                  <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                                  <input
                                      type="date"
                                      id="birthDate"
                                      {...register('birthDate')}
                                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                  />
                              </div>
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
                              <div className="flex items-center gap-6">
                                <Controller
                                  name="gender"
                                  control={control}
                                  render={({ field }) => (
                                    <>
                                     <label className="flex items-center gap-2 cursor-pointer">
                                          <input type="radio" {...field} value="male" checked={field.value === 'male'} className="w-5 h-5 text-blue-600 focus:ring-blue-500"/>
                                          <span>Nam</span>
                                     </label>
                                      <label className="flex items-center gap-2 cursor-pointer">
                                          <input type="radio" {...field} value="female" checked={field.value === 'female'} className="w-5 h-5 text-blue-600 focus:ring-blue-500"/>
                                          <span>Nữ</span>
                                     </label>
                                     <label className="flex items-center gap-2 cursor-pointer">
                                          <input type="radio" {...field} value="other" checked={field.value === 'other'} className="w-5 h-5 text-blue-600 focus:ring-blue-500"/>
                                          <span>Khác</span>
                                     </label>
                                    </>
                                  )}
                                />
                              </div>
                          </div>
                      </div>
                       <div className="flex justify-end mt-8">
                          <button 
                              type="submit"
                              disabled={isUpdating}
                              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all disabled:bg-blue-400 disabled:cursor-not-allowed"
                          >
                              {isUpdating ? 'Đang lưu...' : 'Lưu'}
                          </button>
                      </div>
                    </div>
                  </div>
                </form>
              </main>
            </div>
          </div>
        </div>
    );
};

export default UserProfilePage;