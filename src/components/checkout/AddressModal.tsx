
'use client';

import React from 'react';
import { X, Home, Building, MapPin } from 'lucide-react';

export type Address = {
  id: number;
  name: string;
  phone: string;
  address: string;
  type: 'home' | 'office';
};

const mockAddresses: Address[] = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    phone: '0123456789',
    address: '123 Đường ABC, Phường 1, Quận 2, Thành phố Hồ Chí Minh',
    type: 'home',
  },
  {
    id: 2,
    name: 'Công ty TNHH XYZ',
    phone: '0987654321',
    address: 'Tầng 10, Tòa nhà Bitexco, 2 Hải Triều, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh',
    type: 'office',
  },
  {
    id: 3,
    name: 'Trần Thị B',
    phone: '0112233445',
    address: '456 Đường DEF, Phường An Hải Bắc, Quận Sơn Trà, Đà Nẵng',
    type: 'home',
  },
];

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAddress: (address: Address) => void;
  currentAddressId: number;
}

const AddressModal: React.FC<AddressModalProps> = ({ isOpen, onClose, onSelectAddress, currentAddressId }) => {
  if (!isOpen) {
    return null;
  }

  const handleSelect = (address: Address) => {
    onSelectAddress(address);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 m-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Chọn địa chỉ nhận hàng</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {mockAddresses.map((address) => (
            <div
              key={address.id}
              onClick={() => handleSelect(address)}
              className={`p-5 border rounded-lg cursor-pointer transition-all ${
                currentAddressId === address.id
                  ? 'border-orange-500 bg-orange-50 shadow-md'
                  : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                    {address.type === 'home' 
                        ? <Home className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                        : <Building className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                    }
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="font-semibold text-gray-800">{address.name}</span>
                            <span className="text-gray-500">|</span>
                            <span className="text-sm text-gray-600">{address.phone}</span>
                        </div>
                        <p className="text-sm text-gray-600">{address.address}</p>
                    </div>
                </div>
                {currentAddressId === address.id && (
                  <div className="flex-shrink-0 ml-4 flex items-center gap-2 text-orange-600">
                    <MapPin className="w-4 h-4" />
                    <span className="font-semibold text-sm">Hiện tại</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
