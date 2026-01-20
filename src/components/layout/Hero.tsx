import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Container from './Container';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-900 pt-12 pb-32 md:pb-48 overflow-hidden">
      <Container>
        <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
          
          {/* Left Content */}
          <div className="space-y-6 animate-fade-in-up">
            <span className="inline-block bg-green-200 dark:bg-green-900/50 text-green-800 dark:text-green-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Giải pháp nông nghiệp bền vững
            </span>
            <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-gray-900 dark:text-white leading-tight">
              Đồng hành cùng <br />
              <span className="text-primary dark:text-green-400">Nhà Nông Việt</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-lg leading-relaxed">
              Cung cấp các sản phẩm phân bón, thuốc bảo vệ thực vật chất lượng cao cho Sầu riêng, Lúa và các loại cây trồng chủ lực.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="bg-primary dark:bg-green-600 hover:bg-primary-dark dark:hover:bg-green-500 text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-green-600/20 dark:shadow-green-500/30 transition-all transform hover:-translate-y-1">
                Xem sản phẩm
              </button>
              <button className="bg-white dark:bg-gray-800 border-2 border-primary dark:border-green-500 text-primary dark:text-green-400 hover:bg-green-50 dark:hover:bg-gray-700 px-8 py-3.5 rounded-full font-bold transition-all">
                Liên hệ tư vấn
              </button>
            </div>
          </div>

          {/* Right Image Carousel */}
          <div className="relative">
             <div className="aspect-[4/3] md:aspect-square lg:aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-700 relative group">
                <img 
                  src="https://images.unsplash.com/photo-1592419044706-39796d40f98c?auto=format&fit=crop&q=80&w=1200" 
                  alt="Farmer smiling" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                
                {/* Carousel Controls (Mock) */}
                <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 text-white hover:text-gray-800 dark:hover:text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100">
                  <ChevronLeft size={24} />
                </button>
                <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 text-white hover:text-gray-800 dark:hover:text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100">
                  <ChevronRight size={24} />
                </button>
             </div>
             
             {/* Decorative Blobs */}
             <div className="absolute -z-10 top-10 -right-10 w-32 h-32 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
             <div className="absolute -z-10 -bottom-10 -left-10 w-32 h-32 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          </div>
        </div>
      </Container>

      {/* Curved Bottom Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-[calc(100%+1.3px)] h-[80px] md:h-[120px]"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-primary dark:fill-gray-800"
          ></path>
        </svg>
      </div>
    </section>
  );
}