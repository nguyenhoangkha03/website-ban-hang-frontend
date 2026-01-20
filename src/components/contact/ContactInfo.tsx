import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactInfo() {
    const contactDetails = [
        {
            icon: MapPin,
            title: 'Địa chỉ',
            content: 'Số 123, Đường ABC, Phường XYZ, Quận 1, TP.HCM',
            color: 'text-red-500',
            bgColor: 'bg-red-50',
        },
        {
            icon: Phone,
            title: 'Hotline',
            content: '1800 66 25',
            link: 'tel:1800 66 25',
            color: 'text-green-500',
            bgColor: 'bg-green-50',
        },
        {
            icon: Mail,
            title: 'Email',
            content: 'contact@namviet.com',
            link: 'mailto:contact@namviet.com',
            color: 'text-blue-500',
            bgColor: 'bg-blue-50',
        },
        {
            icon: Clock,
            title: 'Giờ làm việc',
            content: '8:00 - 17:00 (Thứ 2 - Thứ 7)',
            color: 'text-orange-500',
            bgColor: 'bg-orange-50',
        },
    ];

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Thông Tin Liên Hệ</h3>
                <p className="text-gray-600">
                    Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi qua các kênh dưới đây.
                </p>
            </div>

            <div className="space-y-4">
                {contactDetails.map((detail, index) => {
                    const Icon = detail.icon;
                    const content = detail.link ? (
                        <a
                            href={detail.link}
                            className="text-gray-700 hover:text-primary transition-colors font-medium"
                        >
                            {detail.content}
                        </a>
                    ) : (
                        <p className="text-gray-700">{detail.content}</p>
                    );

                    return (
                        <div
                            key={index}
                            className="flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all group"
                        >
                            <div className={`${detail.bgColor} ${detail.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                                <Icon size={24} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-1">{detail.title}</h4>
                                {content}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Social Links */}
            <div className="mt-8 pt-8 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Kết nối với chúng tôi</h4>
                <div className="flex gap-3">
                    <a
                        href="#"
                        className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                        aria-label="Facebook"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                    </a>
                    <a
                        href="#"
                        className="w-10 h-10 bg-pink-500 text-white rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
                        aria-label="Instagram"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                    </a>
                    <a
                        href="#"
                        className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        aria-label="YouTube"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}
