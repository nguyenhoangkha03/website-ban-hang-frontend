import UserProfileForm from '@/components/user/UserProfileForm';
import Container from '@/components/layout/Container'; // Component Container của bạn

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
         <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Menu (Nếu có, để sau này làm) */}
            <div className="w-full md:w-64 flex-shrink-0">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-24">
                   <h3 className="font-bold text-gray-900 mb-4 px-2">Tài khoản</h3>
                   <ul className="space-y-1">
                      <li><a href="/profile" className="block px-3 py-2 bg-green-50 text-green-700 font-medium rounded-lg">Hồ sơ cá nhân</a></li>
                      <li><a href="/orders" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Đơn hàng của tôi</a></li>
                      <li><a href="/debt" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Công nợ</a></li>
                   </ul>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
               <UserProfileForm />
            </div>
         </div>
      </Container>
    </div>
  );
}