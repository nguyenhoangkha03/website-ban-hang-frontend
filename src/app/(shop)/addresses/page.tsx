'use client';

import React from 'react';
import { Home, Building, PlusCircle } from 'lucide-react';
import Sidebar from '@/components/user-profile/Sidebar';
import { useUserProfile } from '@/hooks/api/useUserProfile';

type Address = {
  id: number;
  name: string;
  phone: string;
  address: string;
  type: 'home' | 'office';
  isDefault: boolean;
};

const mockAddresses: Address[] = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    phone: '0123456789',
    address: '123 Đường ABC, Phường 1, Quận 2, Thành phố Hồ Chí Minh',
    type: 'home',
    isDefault: true,
  },
  {
    id: 2,
    name: 'Công ty TNHH XYZ',
    phone: '0987654321',
    address: 'Tầng 10, Tòa nhà Bitexco, 2 Hải Triều, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh',
    type: 'office',
    isDefault: false,
  },
  {
    id: 3,
    name: 'Trần Thị B',
    phone: '0112233445',
    address: '456 Đường DEF, Phường An Hải Bắc, Quận Sơn Trà, Đà Nẵng',
    type: 'home',
    isDefault: false,
  },
];

const AddressesPage = () => {
  const { data: userProfileData } = useUserProfile();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <Sidebar active="addresses" userName={userProfileData?.fullName} />
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Sổ địa chỉ</h1>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700">
                <PlusCircle className="w-5 h-5" />
                Thêm địa chỉ mới
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
              {mockAddresses.map((address) => (
                <div key={address.id} className="p-4 border rounded-lg flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {address.type === 'home' 
                      ? <Home className="w-6 h-6 text-gray-500 flex-shrink-0 mt-1" />
                      : <Building className="w-6 h-6 text-gray-500 flex-shrink-0 mt-1" />
                    }
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-gray-800">{address.name}</span>
                        {address.isDefault && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                            Mặc định
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Địa chỉ: {address.address}</p>
                      <p className="text-sm text-gray-600">Điện thoại: {address.phone}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4 flex flex-col items-end gap-2">
                     <button className="text-sm text-blue-600 hover:underline">Sửa</button>
                     <button className="text-sm text-red-600 hover:underline">Xóa</button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AddressesPage;
