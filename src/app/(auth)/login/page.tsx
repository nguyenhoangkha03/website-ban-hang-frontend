import Header from '@/src/components/layout/Header';
import LoginForm from '@/src/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Header /> 
      
      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <LoginForm />
      </div>
    </main>
  );
}