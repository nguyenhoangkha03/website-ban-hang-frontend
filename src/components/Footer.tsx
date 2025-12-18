import React from 'react';
import { Facebook, Youtube, Phone, Mail, MapPin, Globe } from 'lucide-react';
import Link from "next/link";
import Image from "next/image";


export default function Footer() {
  return (
    <footer className="bg-white pt-10 border-t-4 border-primary">
      {/* Contact Info Section */}
     <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-12">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="md:w-1/3 pt-10">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 mb-3">
              <img
                src="/images/logo.gif"
                alt="Logo Công ty Nam Việt"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-bold text-xl text-gray-900">CÔNG TY NAM VIỆT</h3>
              <p className="text-xs text-gray-500 uppercase tracking-widest">Nông nghiệp xanh</p>
            </div>
          </div>
        </div>

          <div className="md:w-2/3">
             <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-[100px_1fr] border-b border-gray-200">
                   <div className="bg-gray-100 p-4 font-bold text-gray-700 text-sm flex items-center gap-2">
                     <MapPin size={16} /> Địa chỉ
                   </div>
                   <div className="p-4 text-sm text-gray-600">Quốc Lộ 30, Ấp Đông Mỹ, Xã Mỹ Hội, Huyện Cao Lãnh, Tỉnh Đồng Tháp.</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[100px_1fr] border-b border-gray-200">
                   <div className="bg-gray-100 p-4 font-bold text-gray-700 text-sm flex items-center gap-2">
                     <Phone size={16} /> Hotline
                   </div>
                   <div className="p-4 text-sm font-bold text-primary">088 635 7788 - 0868 759 588</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[100px_1fr] border-b border-gray-200">
                   <div className="bg-gray-100 p-4 font-bold text-gray-700 text-sm flex items-center gap-2">
                     <Globe size={16} /> Website
                   </div>
                   <div className="p-4 text-sm text-gray-600 hover:text-primary cursor-pointer">https://hoasinhnamviet.com/</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[100px_1fr]">
                   <div className="bg-gray-100 p-4 font-bold text-gray-700 text-sm flex items-center gap-2">
                     <Mail size={16} /> Email
                   </div>
                   <div className="p-4 text-sm text-gray-600 hover:text-primary cursor-pointer">hoasinhnamviet@gmail.com</div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links - Background màu xanh full width */}
      <div className="bg-primary text-white py-12">
        {/* Container bên trong để giới hạn nội dung */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-sm">
           {/* Column 1 */}
           <div>
             <h4 className="font-bold text-lg mb-6 relative inline-block">
               Giới thiệu chung
               <span className="absolute -bottom-2 left-0 w-10 h-0.5 bg-yellow-400"></span>
             </h4>
             <ul className="space-y-3 opacity-90">
               <li><a href="#" className="hover:text-yellow-300 transition-colors">Giới thiệu về chúng tôi</a></li>
               <li><a href="#" className="hover:text-yellow-300 transition-colors">Tin tức và sự kiện</a></li>
             </ul>
           </div>

           {/* Column 2 */}
           <div>
             <h4 className="font-bold text-lg mb-6 relative inline-block">
               Danh mục sản phẩm
               <span className="absolute -bottom-2 left-0 w-10 h-0.5 bg-yellow-400"></span>
             </h4>
             <ul className="space-y-3 opacity-90">
               <li><a href="#" className="hover:text-yellow-300 transition-colors">Tất cả sản phẩm</a></li>
               <li><a href="#" className="hover:text-yellow-300 transition-colors">Sản phẩm cho lúa</a></li>
               <li><a href="#" className="hover:text-yellow-300 transition-colors">Sản phẩm cho sầu riêng</a></li>
               <li><a href="#" className="hover:text-yellow-300 transition-colors">Sản phẩm cho cây trồng khác</a></li>
             </ul>
           </div>

            {/* Column 3 */}

           <div>
             <h4 className="font-bold text-lg mb-6 relative inline-block">
               Hệ thống cửa hàng
               <span className="absolute -bottom-2 left-0 w-10 h-0.5 bg-yellow-400"></span>
             </h4>
            <div className="flex gap-4 mb-6">
               
               <span>
                   Hệ thống cửa hàng: 1 Super Center, 5 shop Premium và 78 cửa hàng trên toàn quốc{" "}
                   <Link
                     href="/he-thong-cua-hang"
                     className="text-yellow-300 hover:underline hover:text-yellow-400 transition-colors font-semibold"
                   >
                     Xem tất cả các cửa hàng Nam Việt
                   </Link>
                 </span>
               
            </div>
           </div>

           {/* Column 4 */}

           <div>
             <h4 className="font-bold text-lg mb-6 relative inline-block">
               Chứng nhận
               <span className="absolute -bottom-2 left-0 w-10 h-0.5 bg-yellow-400"></span>
             </h4>
             <div className="flex gap-4 mb-6">
              <ul className="space-y-3 opacity-90">
              <li><a href="#" className="hover:text-yellow-300 transition-colors">Hệ thống quản lý chất lượng tiêu chuẩn ISO 9001:2015</a></li>
              <Image
                src="/images/iso.png"
                alt="Chứng nhận ISO 9001:2015"
                width={120}
                height={120}
                className="object-contain"
              />
              </ul>
             </div>
             {/* <button className="bg-white text-primary px-6 py-2 rounded-full font-bold text-xs uppercase hover:bg-yellow-400 hover:text-white transition-colors">
               Liên hệ hợp tác
             </button> */}
           </div>

          </div>

          {/* Copyright Section */}
          <div className="border-t border-green-500/30 mt-12 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between text-xs text-white opacity-90">
              <div className="mb-2 md:mb-0">
                © Copyright 2024 Nam Viet. All rights reserved.
              </div>
              <div className="text-center md:text-right">
                Địa chỉ: Quốc Lộ 30, Ấp Đông Mỹ, Xã Mỹ Hội, Huyện Cao Lãnh, Tỉnh Đồng Tháp.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}