import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 1. Định nghĩa Routes
const publicRoutes = ["/login", "/signup", "/forgot-password", "/reset-password", "/error-404"];

// Routes chỉ dành cho khách (Chưa đăng nhập)
const guestOnlyRoutes = ["/login", "/register"];
const protectedRoutes = [
  "/profile",
  "/orders"
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ⚠️ QUAN TRỌNG: Logic check Auth mới
  // AccessToken ở RAM (Middleware ko đọc được).
  // Ta check "c_refresh_token" trong Cookie (Backend đã set HttpOnly).
  // Nếu có cookie này => User đã đăng nhập (hoặc phiên vẫn còn).
  const refreshToken = request.cookies.get("c_refresh_token")?.value;
  
  // Có token này nghĩa là "Đã đăng nhập" (ở mức độ Middleware check sơ bộ)
  const isAuthenticated = !!refreshToken;

  // console.log("🔒 Middleware Path:", pathname, "| Auth:", isAuthenticated);

  // Helper check route
  const isGuestOnlyRoute = guestOnlyRoutes.some((route) => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // 1. Đã Login mà cố vào trang Guest (Login/Register) -> Đá về Home
  if (isAuthenticated && isGuestOnlyRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. Chưa Login mà vào trang Protected -> Đá về Login
  if (!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    // Lưu lại trang đang muốn vào để login xong redirect ngược lại
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp).*)",
  ],
};