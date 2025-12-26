"use client";

import { Suspense } from "react";
import ResetPasswordForm from "@/src/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
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
            <Suspense
                fallback={<div className="text-center p-4">Đang tải...</div>}
            >
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
