import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeader />
      <main className="min-h-screen">
        <AuthGuard>{children}</AuthGuard>
      </main>
      <Footer />
      <Toaster />
    </>
  );
}
