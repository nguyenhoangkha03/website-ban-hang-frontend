import AuthLayout from "@/components/auth/AuthLayout";

export default function RegisterPage() {
    return (
        <div className="page-transition-fade-slide-in">
            <AuthLayout initialMode="register" />
        </div>
    );
}
