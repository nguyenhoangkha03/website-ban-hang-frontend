import { Metadata } from 'next';
import UserProfileForm from '@/components/user/UserProfileForm'; // Import component vừa sửa ở trên
// Nếu bạn có Container component thì import, nếu không thì dùng div thường
// import Container from '@/components/layout/Container'; 

export const metadata: Metadata = {
  title: 'Hồ sơ cá nhân | Nam Việt',
  description: 'Quản lý thông tin tài khoản và đơn hàng của bạn.',
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Container Wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex flex-col md:flex-row gap-8">
            
            {/* Sidebar Menu (Sidebar bên trái) */}
            <div className="w-full md:w-64 flex-shrink-0">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-24">
                   <h3 className="font-bold text-gray-900 mb-4 px-2 uppercase text-xs tracking-wider text-gray-500">Tài khoản</h3>
                   <ul className="space-y-1">
                      <li>
                        <a href="/profile" className="block px-3 py-2 bg-[#009f4d]/10 text-[#009f4d] font-bold rounded-lg border border-[#009f4d]/20">
                            Hồ sơ cá nhân
                        </a>
                      </li>
                      <li>
                        <a href="/orders" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
                            Đơn hàng của tôi
                        </a>
                      </li>
                      <li>
                        <a href="/debt" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
                            Công nợ
                        </a>
                      </li>
                   </ul>
                </div>
            </div>

            {/* Main Content (Form bên phải) */}
            <div className="flex-1">
               <UserProfileForm />
            </div>
         </div>
      </div>
    </div>
  );
}