import React from 'react';
import Image from 'next/image';
import { Newspaper, ArrowRight, Calendar } from 'lucide-react';
import Container from './Container';
const news = [
  {
    id: 1,
    title: 'Hội thảo khoa học: Giải pháp dinh dưỡng cho cây sầu riêng',
    excerpt: 'Hội thảo quy tụ nhiều chuyên gia hàng đầu trong lĩnh vực nông nghiệp, chia sẻ các giải pháp dinh dưỡng tiên tiến giúp tăng năng suất và chất lượng cho cây sầu riêng.',
    image: 'https://images.unsplash.com/photo-1587426744783-0a4f6539137c?w=500&q=80',
    category: 'Sự kiện',
    date: '20/07/2024',
  },
  {
    id: 2,
    title: 'Ra mắt sản phẩm mới: Phân bón hữu cơ vi sinh GreenLife',
    excerpt: 'GreenLife là dòng phân bón hữu cơ vi sinh cao cấp, giúp cải tạo đất, tăng cường sức đề kháng cho cây trồng và thân thiện với môi trường.',
    image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=500&q=80',
    category: 'Sản phẩm',
    date: '15/07/2024',
  },
  {
    id: 3,
    title: 'Cảnh báo: Sâu đục thân gây hại trên diện rộng tại Đồng Bằng Sông Cửu Long',
    excerpt: 'Các chuyên gia khuyến cáo bà con nông dân cần thăm đồng thường xuyên và áp dụng các biện pháp phòng trừ tổng hợp để hạn chế thiệt hại do sâu đục thân gây ra.',
    image: 'https://images.unsplash.com/photo-1579547945412-484f526b38c8?w=500&q=80',
    category: 'Cảnh báo',
    date: '10/07/2024',
  },
];

export default function NewsSection() {
  return (
    <section className="py-20 bg-gray-50" id="news">
      <Container>
        <div className="text-center mb-12">
           <div className="flex items-center justify-center gap-2 text-primary mb-3">
             <Newspaper />
             <span className="font-bold uppercase tracking-wider">Tin tức & Sự kiện</span>
           </div>
           <h2 className="text-3xl font-display font-bold text-gray-900 uppercase">Tin tức nổi bật</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item) => (
            <article key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
              <div className="relative h-52 overflow-hidden">
                <Image 
                  src={item.image} 
                  alt={item.title} 
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                  <span className="inline-block bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                    {item.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                  <Calendar size={14} />
                  <span>{item.date}</span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-primary transition-colors cursor-pointer">
                  {item.title}
                </h3>
                
                <p className="text-gray-500 text-sm line-clamp-3 mb-4">
                  {item.excerpt}
                </p>
                
                <a href="#" className="inline-flex items-center text-primary font-bold text-sm hover:underline">
                  Đọc tiếp <ArrowRight size={16} className="ml-1" />
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="#" className="inline-flex items-center text-gray-600 hover:text-primary font-semibold transition-colors">
            Xem tất cả tin tức <ArrowRight className="ml-2" size={20} />
          </a>
        </div>
      </Container>
    </section>
  );
}