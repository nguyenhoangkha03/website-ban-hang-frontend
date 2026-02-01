// src/app/(main)/layout.tsx
import Header from "@/components/layout/Header"; 
import Footer from "@/components/layout/Footer"; 
import MissingInfoBanner from "@/components/layout/MissingInfoBanner";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <MissingInfoBanner /> 
      
      <main className="flex-grow"> 
        {children}
      </main>
      
      <Footer />
    </div>
  );
}