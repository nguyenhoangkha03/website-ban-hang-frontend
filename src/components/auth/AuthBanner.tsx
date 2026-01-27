'use client';

interface AuthBannerProps {
  image: string;
  title: string;
  description: string;
  promptText: string;
  buttonText: string;
  onSwitch: () => void;
  isAnimating: boolean;
  position: 'left' | 'right';
}

export default function AuthBanner({
  image,
  title,
  description,
  promptText,
  buttonText,
  onSwitch,
  isAnimating,
  position
}: AuthBannerProps) {
  // Xác định animation class dựa trên vị trí
  const animationClass = isAnimating
    ? position === 'left' ? 'auth-left-exit' : 'auth-right-exit'
    : 'auth-fade-in';

  return (
    <div className={`hidden lg:flex w-1/2 items-center justify-center p-2 relative ${animationClass}`}>
      <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-2xl">
        {/* Background Image */}
        <img
          src={image}
          alt="Auth Background"
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />

        {/* Text Overlay */}
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">
            {title}
          </h2>
          <p className="text-lg text-white/90 mb-8 font-light">
            {description}
          </p>

          <div className="pt-8 border-t border-white/30 w-full max-w-xs">
            <p className="text-white mb-4 text-sm font-medium opacity-90">{promptText}</p>
            <button
              onClick={onSwitch}
              className="w-full bg-white/10 backdrop-blur-md border-2 border-white text-white font-bold py-3 rounded-xl hover:bg-white hover:text-[#009f4d] transition-all duration-300 transform hover:-translate-y-1"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}