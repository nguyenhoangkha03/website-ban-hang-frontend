'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Send } from 'lucide-react';
import { useState } from 'react';

// Validation Schema
const ContactFormSchema = z.object({
    name: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
    email: z.string().email('Email không hợp lệ'),
    phone: z.string().regex(/^0\d{9}$/, 'Số điện thoại phải có 10 số và bắt đầu bằng 0'),
    message: z.string().min(10, 'Tin nhắn phải có ít nhất 10 ký tự'),
});

type ContactFormType = z.infer<typeof ContactFormSchema>;

export default function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactFormType>({
        resolver: zodResolver(ContactFormSchema),
    });

    const onSubmit = async (data: ContactFormType) => {
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log('Contact form data:', data);
        setIsSubmitting(false);
        setSubmitSuccess(true);
        reset();

        // Reset success message after 3s
        setTimeout(() => setSubmitSuccess(false), 3000);
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Gửi Tin Nhắn</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Name */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register('name')}
                        className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-green-100'
                            }`}
                        placeholder="Nguyễn Văn A"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        {...register('email')}
                        className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-green-100'
                            }`}
                        placeholder="email@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register('phone')}
                        className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-green-100'
                            }`}
                        placeholder="0912345678"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>

                {/* Message */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nội dung tin nhắn <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        {...register('message')}
                        rows={5}
                        className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all resize-none ${errors.message ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-green-100'
                            }`}
                        placeholder="Nhập nội dung bạn muốn gửi..."
                    />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                </div>

                {/* Success Message */}
                {submitSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-in fade-in">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Gửi tin nhắn thành công! Chúng tôi sẽ liên hệ lại sớm.</span>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-green-700 text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 transition-all transform hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 shadow-lg shadow-green-200"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            <span>Đang gửi...</span>
                        </>
                    ) : (
                        <>
                            <Send size={20} />
                            <span>Gửi Tin Nhắn</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
