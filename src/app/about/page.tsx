'use client';

import React from 'react';
import { 
  Leaf, Flag, Eye, Handshake, 
  Sprout, Users, FlaskConical, Globe, 
  ShieldCheck, Award, Mail
} from 'lucide-react';

export default function AboutPage() {
  return (
    // Xóa dark:bg-..., chỉ giữ lại bg-white và font mặc định
    <div className="relative flex min-h-screen w-full flex-col bg-white font-sans overflow-x-hidden text-gray-800">
      
      {/* --- PHẦN 1: HERO BANNER --- */}
      <section className="relative w-full overflow-hidden">
        <div 
          className="flex min-h-[520px] flex-col gap-6 bg-cover bg-center bg-no-repeat items-center justify-center p-4 relative"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.7) 100%), url("https://bbt.1cdn.vn/2022/12/29/z3996741334134_702065666ba43e93d876065e03dcb123.jpg")`
          }}
        >
          <div className="flex flex-col gap-6 text-center max-w-4xl z-10 animate-in fade-in zoom-in duration-1000">
            <h2 className="text-white text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-[-0.033em] drop-shadow-md">
              Gieo Mầm Tin Tưởng, <br/> Gặt Hái Tinh Hoa
            </h2>
            <p className="text-white/95 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto px-4 drop-shadow-sm">
              Trong hơn hai thập kỷ, Nam Việt đã là cầu nối vững chắc giữa vùng đất màu mỡ của Việt Nam và thị trường toàn cầu.
            </p>
            <div className="mt-6">
              {/* Dùng bg-primary để lấy màu xanh chuẩn từ globals.css */}
              <button className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
                Khám phá câu chuyện
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- PHẦN 2: CHÚNG TÔI LÀ AI (Nền Trắng) --- */}
      <section className="w-full px-4 md:px-10 lg:px-20 py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-widest uppercase text-xs md:text-sm">Câu Chuyện Của Chúng Tôi</span>
            <h2 className="text-gray-900 text-3xl md:text-5xl font-bold leading-tight tracking-tight mt-4">Chúng Tôi Là Ai</h2>
            <div className="w-24 h-1.5 bg-primary mx-auto mt-6 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-8 order-2 lg:order-1">
              <h3 className="text-gray-900 text-2xl md:text-3xl font-bold leading-tight">
                Cội Nguồn Sâu Sắc Trong Nông Nghiệp Việt
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Nam Việt được thành lập với một mục tiêu đơn giản nhưng đầy tham vọng: mang những nông sản tốt nhất từ nông dân Việt Nam ra thế giới. Khởi đầu là một hợp tác xã địa phương nhỏ, nay đã phát triển thành nhà xuất khẩu nông sản hàng đầu.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Chúng tôi tin rằng thực phẩm tuyệt vời bắt nguồn từ đất đai màu mỡ và đôi bàn tay tận tụy. Đó là lý do tại sao chúng tôi làm việc trực tiếp với hơn 1.000 hộ nông dân địa phương, cung cấp hỗ trợ kỹ thuật và cam kết thương mại công bằng.
              </p>
              
              {/* Avatar Nông dân */}
              <div className="flex items-center gap-4 mt-4">
                <div className="flex -space-x-3 overflow-hidden">
                  {[1,2,3,4].map(i => (
                    <img 
                      key={i} 
                      className="inline-block h-12 w-12 rounded-full ring-2 ring-white object-cover" 
                      src={`https://images.unsplash.com/photo-${i === 1 ? '1500937386664-56d1dfef3854' : i === 2 ? '1595240292728-660c679a8367' : i === 3 ? '1530463866888-786431945522' : '1625246333195-58197bd47d72'}?q=80&w=100&auto=format&fit=crop`} 
                      alt="Farmer"
                    />
                  ))}
                </div>
                <p className="text-sm font-medium text-gray-500">Đồng hành cùng +1,000 hộ nông dân</p>
              </div>
            </div>
            
            {/* Ảnh minh họa */}
            <div className="relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl group order-1 lg:order-2">
              <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-all duration-500 z-10"></div>
              <div 
                className="w-full h-full bg-cover bg-center transform group-hover:scale-110 transition-transform duration-1000"
                style={{ backgroundImage: `url("https://giacaphe.com/wp-content/uploads/2023/02/sau-rieng-sap-thu-hoach.jpg")` }}
              ></div>
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 backdrop-blur-sm rounded-xl z-20 shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                  <p className="text-primary font-bold text-sm uppercase mb-1">Cơ sở hiện đại</p>
                  <p className="text-gray-900 font-medium">Hệ thống phân loại và đóng gói đạt chuẩn quốc tế tại Cần Thơ.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PHẦN 3: SỨ MỆNH - TẦM NHÌN (Nền màu secondary/xanh nhạt) --- */}
      <section className="w-full px-4 md:px-10 lg:px-20 py-20 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Card 1 */}
            <div className="group bg-white p-10 rounded-2xl shadow-sm border-b-8 border-transparent hover:border-primary flex flex-col gap-6 hover:-translate-y-3 transition-all duration-500">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <Flag size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Sứ Mệnh</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Cung cấp các sản phẩm nông nghiệp an toàn, chất lượng cao cho người tiêu dùng toàn cầu, đồng thời nâng cao đời sống của nông dân Việt Nam.
              </p>
            </div>
            {/* Card 2 */}
            <div className="group bg-white p-10 rounded-2xl shadow-sm border-b-8 border-transparent hover:border-primary flex flex-col gap-6 hover:-translate-y-3 transition-all duration-500">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <Eye size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Tầm Nhìn</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Trở thành đối tác tin cậy nhất Đông Nam Á trong lĩnh vực nông nghiệp hữu cơ và bền vững, thiết lập tiêu chuẩn về chất lượng vào năm 2030.
              </p>
            </div>
            {/* Card 3 */}
            <div className="group bg-white p-10 rounded-2xl shadow-sm border-b-8 border-transparent hover:border-primary flex flex-col gap-6 hover:-translate-y-3 transition-all duration-500">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <Handshake size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Giá Trị Cốt Lõi</h3>
              <div className="text-gray-600 leading-relaxed text-lg">
                <span className="space-y-2 block">
                  <strong>Chính trực:</strong> Trung thực trong mọi giao dịch.<br/>
                  <strong>Chất lượng:</strong> Xuất sắc từ hạt giống đến thành phẩm.<br/>
                  <strong>Bền vững:</strong> Bảo vệ đất đai cho thế hệ mai sau.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PHẦN 4: THỐNG KÊ (Nền Trắng) --- */}
      <section className="w-full px-4 md:px-20 py-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
               { value: '20+', label: 'Năm Kinh Nghiệm' },
               { value: '50+', label: 'Thị Trường Xuất Khẩu' },
               { value: '1k+', label: 'Nông Dân Đối Tác' },
               { value: '5k+', label: 'Tấn Hàng Xuất Khẩu' }
            ].map((stat, idx) => (
              <div 
                key={idx} 
                className="flex flex-col gap-4 rounded-2xl p-10 border border-gray-100 bg-gray-50 items-center text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="text-primary tracking-tighter text-5xl md:text-6xl font-black leading-tight">{stat.value}</p>
                <p className="text-gray-800 text-sm font-bold leading-normal uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PHẦN 5: BAN LÃNH ĐẠO (Nền secondary/xanh nhạt) --- */}
      <section className="w-full px-4 md:px-10 lg:px-20 py-24 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-gray-900 text-3xl md:text-4xl font-black leading-tight">Ban Lãnh Đạo</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
              Một đội ngũ chuyên gia tận tâm, đầy nhiệt huyết trong việc hiện đại hóa nông nghiệp và mang lại chất lượng hàng đầu.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
               { name: "Nguyễn Văn An", role: "Giám Đốc Điều Hành", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop" },
               { name: "Trần Thị Mai", role: "Giám Đốc Vận Hành", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop" },
               { name: "Lê Văn Hùng", role: "Kỹ Sư Nông Nghiệp", img: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=2070&auto=format&fit=crop" },
               { name: "Phạm Minh Tú", role: "Trưởng Phòng Xuất Khẩu", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop" }
            ].map((member, idx) => (
              <div key={idx} className="group flex flex-col items-center bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-transparent hover:border-primary/20">
                <div 
                  className="w-full aspect-[4/5] bg-gray-200 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-700" 
                  style={{ backgroundImage: `url("${member.img}")` }}
                ></div>
                <div className="p-8 text-center w-full">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h4>
                  <p className="text-sm text-primary font-black uppercase tracking-widest">{member.role}</p>
                  <div className="flex justify-center gap-4 mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                          <Mail size={16} />
                      </a>
                      <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                          <Globe size={16} />
                      </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PHẦN 6: CHỨNG CHỈ (Nền Trắng) --- */}
      <div className="w-full py-16 border-y border-gray-100 bg-white overflow-hidden group">
        <div className="flex items-center gap-8 animate-scroll whitespace-nowrap min-w-full">
          {[1, 2].map((groupKey) => (
            <div key={groupKey} className="flex items-center gap-24 min-w-full justify-around shrink-0 opacity-60 hover:opacity-100 transition-opacity">
               <div className="text-2xl font-black text-gray-800 tracking-tighter flex items-center gap-4">
                  <ShieldCheck size={48} className="text-primary" /> ISO 22000
               </div>
               <div className="text-2xl font-black text-gray-800 tracking-tighter flex items-center gap-4">
                  <Globe size={48} className="text-primary" /> GLOBAL G.A.P
               </div>
               <div className="text-2xl font-black text-gray-800 tracking-tighter flex items-center gap-4">
                  <Leaf size={48} className="text-primary" /> USDA ORGANIC
               </div>
               <div className="text-2xl font-black text-gray-800 tracking-tighter flex items-center gap-4">
                  <Award size={48} className="text-primary" /> HACCP
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- PHẦN 7: LỊCH SỬ (Nền secondary) --- */}
      <section className="w-full bg-secondary py-24 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-primary font-bold tracking-widest uppercase text-xs">Hành Trình Của Chúng Tôi</span>
            <h2 className="text-gray-900 text-4xl md:text-5xl font-black leading-tight tracking-tight mt-4">
              Lịch Sử Phát Triển
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
               { year: '2003', icon: <Sprout size={24}/>, title: 'Khởi Đầu', desc: 'Thành lập hợp tác xã đầu tiên tại ĐBSCL với 20 hộ nông dân tâm huyết.' },
               { year: '2010', icon: <Users size={24}/>, title: 'Mở Rộng', desc: 'Mở rộng quy mô lên 500 đối tác, xây dựng nhà máy sơ chế đạt chuẩn ISO.' },
               { year: '2018', icon: <FlaskConical size={24}/>, title: 'Đột Phá Công Nghệ', desc: 'Ứng dụng công nghệ cao vào canh tác và dây chuyền chế biến tự động.' },
               { year: '2023', icon: <Globe size={24}/>, title: 'Vươn Ra Biển Lớn', desc: 'Xuất khẩu chính ngạch sang 50+ quốc gia, đạt chứng nhận Organic USDA.' }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="group relative bg-white rounded-2xl p-8 hover:-translate-y-4 transition-all duration-500 flex flex-col h-full overflow-hidden shadow-sm"
              >
                <div className="flex justify-between items-start mb-8">
                  <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary-dark">{item.year}</span>
                  <div className="w-12 h-12 rounded-full bg-secondary text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    {item.icon}
                  </div>
                </div>
                <div className="relative z-10 flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-gray-500 text-base leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-100">
                  <div className="h-full bg-primary w-0 group-hover:w-full transition-all duration-700 ease-in-out"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}