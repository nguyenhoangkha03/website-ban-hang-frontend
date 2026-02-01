'use client';

import ContactForm from '@/components/contact/ContactForm';
import ContactInfo from '@/components/contact/ContactInfo';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary to-green-700 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wide mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        Liên Hệ Với Chúng Tôi
                    </h1>
                    <p className="text-lg md:text-xl text-green-50 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                        Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy để lại thông tin, chúng tôi sẽ liên hệ lại sớm nhất.
                    </p>
                </div>
            </div>

            {/* Main Content - Two Column Layout */}
            <div className="container mx-auto px-4 py-16 contact-form-section">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left Column - Contact Info */}
                    <div className="animate-in fade-in slide-in-from-left duration-700 delay-200">
                        <ContactInfo />
                    </div>

                    {/* Right Column - Contact Form */}
                    <div className="animate-in fade-in slide-in-from-right duration-700 delay-300">
                        <ContactForm />
                    </div>
                </div>
            </div>

            {/* Google Maps Section */}
            <div className="container mx-auto px-4 pb-16">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
                    <div className="p-6 bg-gradient-to-r from-primary to-green-700 text-white">
                        <h3 className="text-2xl font-bold">Vị Trí Của Chúng Tôi</h3>
                        <p className="text-green-50 mt-1">Ghé thăm cửa hàng để trải nghiệm sản phẩm trực tiếp</p>
                    </div>
                    <div className="relative h-96 lg:h-[500px]">
                        {/* Google Maps Embed - Công ty Nam Việt, Đồng Tháp */}
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2333.4220133956896!2d105.72697524982718!3d10.395151112282386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310a63daef6b3f11%3A0xc7d27c6620a349ca!2zQ8O0bmcgVHkgQ-G7lSBQaOG6p24gSG_DoSBTaW5oIE5hbSBWaeG7h3Q!5e0!3m2!1svi!2s!4v1769264620808!5m2!1svi!2s"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="absolute inset-0"
                            title="Vị trí Công ty Nam Việt - Quốc Lộ 30, ấp Đông Mỹ, xã Mỹ Hội, huyện Cao Lãnh, tỉnh Đồng Tháp"
                        />
                    </div>
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">Công ty Nam Việt</span> - Quốc Lộ 30, ấp Đông Mỹ, xã Mỹ Hội, huyện Cao Lãnh, tỉnh Đồng Tháp
                        </p>
                        <a
                            href="https://maps.app.goo.gl/oX1GxhkySqdzg8gU6"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:text-green-700 font-medium transition-colors"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Xem trên Google Maps
                        </a>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">Cần Hỗ Trợ Ngay?</h3>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        Đội ngũ chăm sóc khách hàng của chúng tôi sẵn sàng hỗ trợ bạn 24/7
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {/* Call Button */}
                        <a
                            href="tel:0886357788"
                            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-green-700 text-white font-bold px-8 py-4 rounded-full transition-all transform hover:scale-105 shadow-lg shadow-green-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>Gọi Ngay: 088 635 7788</span>
                        </a>

                        {/* Scroll to Form Button - với style của nút Email cũ */}
                        <button
                            onClick={() => {
                                const formSection = document.querySelector('.contact-form-section');
                                formSection?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }}
                            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-primary font-bold px-8 py-4 rounded-full border-2 border-primary transition-all transform hover:scale-105 shadow-lg"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Điền Form Liên Hệ</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
