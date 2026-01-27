"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // 1. Import hooks điều hướng
import OtpForm from "@/components/auth/OtpForm";

// 2. Tạo một component con để dùng useSearchParams (để tránh lỗi Suspense boundary)
function OtpFormWrapper() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Lấy sđt từ URL (ví dụ: /verify-otp?phone=0909xxxxxx)
    const phone = searchParams.get("phone") || "";

    const handleVerifySuccess = () => {
        // Xử lý khi verify thành công (ví dụ: về trang chủ)
        router.push("/");
    };

    const handleGoBack = () => {
        // Quay lại trang trước (thường là trang Login hoặc Register)
        router.back();
    };

    // 3. Truyền đủ props vào OtpForm
    return (
        <OtpForm 
            phone={phone} 
            onVerifySuccess={handleVerifySuccess} 
            onGoBack={handleGoBack} 
        />
    );
}

export default function VerifyOtpPage() {
    return (
        <div
            className="min-h-screen bg-white flex items-center justify-center p-4"
            style={{
                backgroundImage: "url(/images/BG.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
            }}
        >
            <Suspense fallback={<div className="text-center">Đang tải...</div>}>
                {/* 4. Gọi Wrapper thay vì gọi OtpForm trực tiếp */}
                <OtpFormWrapper />
            </Suspense>
        </div>
    );
}