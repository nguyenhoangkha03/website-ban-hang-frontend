import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactInfo() {
    const contactDetails = [
        {
            icon: MapPin,
            title: 'Địa chỉ',
            content: 'Công ty Nam Việt, Quốc Lộ 30, ấp Đông Mỹ, xã Mỹ Hội, huyện Cao Lãnh, tỉnh Đồng Tháp',
            color: 'text-red-500',
            bgColor: 'bg-red-50',
        },
        {
            icon: Phone,
            title: 'Hotline',
            content: '088 635 7788 - 0868 759 588',
            link: 'tel:0886357788',
            color: 'text-green-500',
            bgColor: 'bg-green-50',
        },
        {
            icon: Mail,
            title: 'Email',
            content: 'hoasinhnamviet@gmail.com',
            link: 'mailto:hoasinhnamviet@gmail.com',
            color: 'text-blue-500',
            bgColor: 'bg-blue-50',
        },
        {
            icon: Clock,
            title: 'Giờ làm việc',
            content: '7:00 - 17:00 (Thứ 2 - Thứ 7)',
            color: 'text-orange-500',
            bgColor: 'bg-orange-50',
        },
    ];

    const socialLinks = [
        {
            name: 'Facebook',
            url: '#',
            color: 'bg-blue-600 hover:bg-blue-700',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
            ),
        },
        {
            name: 'Instagram',
            url: '#',
            color: 'bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
            ),
        },
        {
            name: 'YouTube',
            url: '#',
            color: 'bg-red-600 hover:bg-red-700',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
            ),
        },
        {
            name: 'Zalo',
            url: '#', // Sẽ cập nhật sau
            color: 'bg-blue-500 hover:bg-blue-600',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111C24 4.975 18.627 0 12 0zm.699 14.832l-3.111-3.305-6.072 3.305L9.93 8.248l3.184 3.305 6-3.305-6.415 6.584z" />
                </svg>
            ),
        },
        {
            name: 'TikTok',
            url: '#', // Sẽ cập nhật sau
            color: 'bg-black hover:bg-gray-800',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
            ),
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
                <div className="flex flex-wrap gap-3">
                    {socialLinks.map((social, index) => (
                        <a
                            key={index}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`w-11 h-11 ${social.color} text-white rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-md`}
                            aria-label={social.name}
                            title={social.name}
                        >
                            {social.icon}
                        </a>
                    ))}
                </div>
                <p className="text-xs text-gray-500 mt-3 italic">
                    * Link Zalo và TikTok sẽ được cập nhật sau
                </p>
            </div>
        </div>
    );
}
