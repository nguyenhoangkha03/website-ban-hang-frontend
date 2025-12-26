"use client";

import { Suspense } from "react";
import OtpForm from "@/src/components/auth/OtpForm";

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
                <OtpForm />
            </Suspense>
        </div>
    );
}
