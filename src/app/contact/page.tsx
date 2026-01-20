import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import ContactForm from '@/components/contact/ContactForm';
import ContactInfo from '@/components/contact/ContactInfo';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-gray-500 hover:text-primary transition-colors">
                            Trang chủ
                        </Link>
                        <ChevronRight size={16} className="text-gray-400" />
                        <span className="text-gray-900 font-medium">Liên hệ</span>
                    </div>
                </div>
            </div>

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
            <div className="container mx-auto px-4 py-16">
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
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.3193500642147!2d106.69750731533395!3d10.786834792313928!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4b3330bcc9%3A0x5a8b8b8b8b8b8b8b!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBLaG9hIGjhu41jIFThu7Egbmhpw6puIC0gxJDhuqFpIGjhu41jIFF14buRYyBnaWEgVFAuSENN!5e0!3m2!1svi!2s!4v1234567890123!5m2!1svi!2s"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="absolute inset-0"
                        />
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
                        <a
                            href="tel:1800 66 25"
                            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-green-700 text-white font-bold px-8 py-4 rounded-full transition-all transform hover:scale-105 shadow-lg shadow-green-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>Gọi Ngay: 1800 66 25</span>
                        </a>
                        <a
                            href="mailto:contact@namviet.com"
                            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-primary font-bold px-8 py-4 rounded-full border-2 border-primary transition-all transform hover:scale-105 shadow-lg"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>Gửi Email</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
