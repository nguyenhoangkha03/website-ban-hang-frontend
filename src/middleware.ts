import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 1. Định nghĩa Routes

// Các route chỉ dành cho khách (Chưa đăng nhập)
// ❌ Đã xóa: /register, /forgot-password, /reset-password
const guestOnlyRoutes = ["/login"];

// Các route bắt buộc phải đăng nhập mới được vào
const protectedRoutes = [
  "/profile",
  "/orders",
  "/checkout" // Thường có thêm trang thanh toán
];

// Các route Public (Ai vào cũng được) - Khai báo để dễ quản lý (tùy chọn)
// ✅ Thêm /zalo-callback để Zalo có thể redirect về mà không bị chặn
const publicRoutes = ["/", "/zalo-callback", "/products", "/cart"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ⚠️ LOGIC CHECK AUTH (Giữ nguyên vì backend vẫn set cookie này)
  // Check cookie "c_refresh_token" (HttpOnly)
  const refreshToken = request.cookies.get("c_refresh_token")?.value;
  
  // Có token => Đã đăng nhập (Sơ bộ)
  const isAuthenticated = !!refreshToken;

  // Helper check route
  const isGuestOnlyRoute = guestOnlyRoutes.some((route) => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // =========================================================
  // XỬ LÝ CHUYỂN HƯỚNG
  // =========================================================

  // 1. Đã Login mà cố vào trang Guest (/login) -> Đá về Home
  if (isAuthenticated && isGuestOnlyRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. Chưa Login mà vào trang Protected (/profile...) -> Đá về Login
  if (!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    // Lưu lại trang đang muốn vào để login xong redirect ngược lại
    // (Lưu ý: Với Zalo Login, logic redirect này cần xử lý khéo ở trang Callback)
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Các trường hợp khác (Public route, static file...) -> Cho qua
  return NextResponse.next();
}

export const config = {
  // Matcher giữ nguyên để loại trừ các file tĩnh
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp).*)",
  ],
};