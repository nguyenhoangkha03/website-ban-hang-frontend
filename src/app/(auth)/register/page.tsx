import RegisterForm from '@/src/components/auth/RegisterForm';
import Header from '@/src/components//layout/Header'; // Import Header để giữ layout nhất quán

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Header /> {/* Giữ header để người dùng có thể quay về */}
      
      <div className="flex-1 flex items-center justify-center p-4">
        <RegisterForm />
      </div>
    </main>
  );
}