import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const guestOnlyRoutes = ["/login", "/register"];
const protectedRoutes = ["/profile", "/orders", "/checkout"];

// ✅ ĐỊNH NGHĨA RÕ RÀNG CÁC TRANG PUBLIC
const publicRoutes = ["/zalo-callback", "/", "/products", "/news", "/contact", "/about"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Nếu là route public (ví dụ: zalo-callback) -> CHO QUA NGAY LẬP TỨC
  // Logic này giúp tránh mọi vòng lặp redirect không đáng có
  if (publicRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.next();
  }

  // 2. Check Auth
  const refreshToken = request.cookies.get("c_refresh_token")?.value;
  const isAuthenticated = !!refreshToken;

  const isGuestOnlyRoute = guestOnlyRoutes.some((route) => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // 3. Đã Login mà vào trang Guest -> Đá về Home
  if (isAuthenticated && isGuestOnlyRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 4. Chưa Login mà vào trang Protected -> Đá về Login
  if (!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};