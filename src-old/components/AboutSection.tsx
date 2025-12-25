import React from 'react';
import { CheckCircle2, Sprout } from 'lucide-react';
import Container from './Container';

export default function AboutSection() {
  return (
    <section className="py-20 bg-white relative overflow-hidden" id="about">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-green-50 skew-x-12 translate-x-32 -z-0"></div>

      <Container className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Image Group */}
          <div className="lg:w-1/2 relative">
             <div className="relative w-80 h-80 sm:w-96 sm:h-96 mx-auto">
               <div className="absolute inset-0 rounded-full border-8 border-green-100 overflow-hidden shadow-2xl">
                 <img 
                   src="/images/anhgioithieu2.png" 
                   alt="Nam Viet Team" 
                   className="w-full h-full object-cover"
                 />
               </div>
                {/* Badge */}
                <div
                  className="absolute left-1/2 bottom-0 
                            translate-x-[-50%] translate-y-[110%]
                            bg-primary text-white px-6 py-4
                            rounded-2xl shadow-xl
                            flex items-center gap-3 min-w-[240px] text-center"
                >
                  <span className="text-3xl font-display font-bold">10+</span>
                  <div className="text-xs font-bold leading-tight uppercase whitespace-nowrap">
                    Năm kinh nghiệm đồng hành cùng nhà nông
                  </div>
                </div>

             </div>
          </div>

          {/* Right Content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="inline-flex items-center justify-center lg:justify-start gap-2 text-primary font-bold mb-4">
              <Sprout size={24} />
              <span className="uppercase tracking-wider">Giới thiệu về Nam Viet</span>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-2">
              "CÔNG NGHỆ XANH CHO THỰC PHẨM SẠCH"
            </h2>
            
            <div className="w-20 h-1 bg-primary mx-auto lg:mx-0 mb-6 rounded-full"></div>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              Công ty Nam Viet là đơn vị tiên phong trong việc cung cấp các giải pháp nông nghiệp bền vững tại Việt Nam. Chúng tôi chuyên nghiên cứu và phân phối các dòng sản phẩm phân bón, thuốc bảo vệ thực vật thế hệ mới, an toàn cho môi trường và sức khỏe người tiêu dùng.
            </p>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              Với đội ngũ kỹ sư nông nghiệp giàu kinh nghiệm, Nam Viet cam kết mang lại hiệu quả kinh tế cao nhất cho bà con nông dân.
            </p>

            <div className="space-y-4 mb-10 text-left max-w-md mx-auto lg:mx-0">
               <div className="flex items-start gap-3">
                 <CheckCircle2 className="text-primary flex-shrink-0 mt-1" size={20} />
                 <span className="text-gray-700 font-medium">Sản phẩm chất lượng cao, nguồn gốc rõ ràng.</span>
               </div>
               <div className="flex items-start gap-3">
                 <CheckCircle2 className="text-primary flex-shrink-0 mt-1" size={20} />
                 <span className="text-gray-700 font-medium">Tư vấn kỹ thuật tận tâm, bám sát đồng ruộng.</span>
               </div>
            </div>

            <button className="bg-primary hover:bg-primary-dark text-white px-10 py-3 rounded-full font-bold shadow-lg shadow-green-200 transition-colors">
              Tìm hiểu thêm
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}