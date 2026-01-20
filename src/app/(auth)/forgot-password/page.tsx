import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center overflow-hidden page-transition-fade-slide-in"
      style={{
        backgroundImage: 'url(/images/image.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* White container wrapper - 2 column layout */}
      <div className="w-full flex lg:mx-auto lg:max-w-6xl bg-zinc-50 rounded-2xl overflow-hidden m-4">

        {/* LEFT SIDE - Image with Text Overlay (Desktop only) */}
        <div className="hidden lg:flex w-1/2 items-center justify-center p-8">
          <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-2xl">
            {/* Background Image */}
            <img
              src="/images/BG.png"
              alt="Rice Green"
              className="w-full h-full object-cover"
            />

            {/* Text Overlay */}
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-8">
              <div className="text-center max-w-sm">
                <img
                  src="/images/logo.png"
                  alt="Logo"
                  className="w-32 h-32 mx-auto mb-4"
                />
                <h2 className="text-4xl font-bold text-white mb-4">
                  Đừng lo lắng!
                </h2>
                <p className="text-lg text-white/90 mb-8">
                  Chúng tôi sẽ giúp bạn lấy lại mật khẩu một cách nhanh chóng và an toàn
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-md">
            <ForgotPasswordForm />
          </div>
        </div>

      </div>
    </div>
  );
}