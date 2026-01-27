import ForgotPasswordSection from "@/components/auth/ForgotPasswordSection";

export default function ForgotPasswordPage() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: 'url(/images/BG.png)', // Đảm bảo có ảnh này
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <ForgotPasswordSection />
    </div>
  );
}