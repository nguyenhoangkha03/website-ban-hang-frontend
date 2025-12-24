import React from 'react';
import { Newspaper, ArrowRight, Calendar } from 'lucide-react';
import { news } from '../../lib/mockData';
import Container from './Container';

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
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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