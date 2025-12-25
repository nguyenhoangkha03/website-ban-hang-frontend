import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google"; // Dùng font của Next.js cho tối ưu
import "./globals.css";

// Cấu hình Font chữ giống thiết kế
const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const montserrat = Montserrat({ subsets: ["latin"], variable: '--font-montserrat', weight: ['400', '500', '600', '700', '800'] });

export const metadata: Metadata = {
  title: "Nam Viet - Đồng hành cùng Nhà Nông",
  description: "Giải pháp nông nghiệp toàn diện",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} ${montserrat.variable} font-sans bg-gray-50 text-gray-900`}>
        {children}
      </body>
    </html>
  );
}