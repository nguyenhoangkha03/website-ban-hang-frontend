import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { AccountUtils } from "@/lib/utils/account_utils";

// ✅ Import các API hooks từ file useAuthApi (đã tách biệt)
import { 
  useLoginZalo, 
  useLogout, 
  useUpdateProfile,
  useSocialLogin,
  useSyncSocialAccount
} from "@/hooks/api/useAuthApi"; 

export function useAuth() {
  const router = useRouter();
  
  // 1. Lấy State từ Store (RAM)
  const { 
    user, 
    accessToken, 
    isAuthenticated, 
    login, 
    setUser,
    setAccessToken
  } = useAuthStore();

  // 2. Khởi tạo các API Mutations (React Query)
  const loginZaloMutation = useLoginZalo();
  const logoutMutation = useLogout();
  const updateProfileMutation = useUpdateProfile();
  const socialLoginMutation = useSocialLogin();
  const syncSocialMutation = useSyncSocialAccount();

  // =========================================================================
  // ACTIONS (Bọc lại để Component gọi cho gọn)
  // =========================================================================

  // Hàm Logout chuẩn: Gọi API -> Xóa Store -> Redirect
  const logout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  // Hàm Login Zalo
  const loginZalo = useCallback((code: string) => {
    loginZaloMutation.mutate(code);
  }, [loginZaloMutation]);

  // Hàm Login Google/Facebook
  const loginSocial = useCallback((provider: 'google' | 'facebook') => {
    socialLoginMutation.mutate(provider);
  }, [socialLoginMutation]);

  // Hàm Update Profile
  const updateProfileAsync = updateProfileMutation.mutateAsync;

  // =========================================================================
  // HELPERS / GUARDS (Check quyền)
  // =========================================================================

  // Check nếu chưa login thì đá về login
  const requireAuth = useCallback(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return false;
    }
    return true;
  }, [isAuthenticated, router]);

  // Check nếu đã login thì đá về Home (dùng cho trang Login)
  const redirectIfAuthenticated = useCallback(() => {
    if (isAuthenticated) {
      router.push("/");
      return true;
    }
    return false;
  }, [isAuthenticated, router]);

  // Check hồ sơ đủ chưa (SĐT + CCCD) - Đặc thù của Customer App
  const checkProfileCompleteness = useCallback(() => {
    if (!user) return false;
    const isComplete = AccountUtils.isProfileComplete(user);
    if (!isComplete) {
       router.push("/profile?action=update_info&msg=missing_info");
       return false;
    }
    return true;
  }, [user, router]);

  return {
    // --- STATE ---
    user,
    accessToken, // Bên Admin gọi là 'token', bên mình thống nhất là 'accessToken'
    isAuthenticated,
    // Kiểm tra nhanh xem user có đang thiếu thông tin không
    isProfileMissing: user ? !AccountUtils.isProfileComplete(user) : false,

    // --- ACTIONS ---
    login, // Action store raw (ít dùng trực tiếp)
    setUser,
    setAccessToken,
    
    // Các hàm Action chính (Đã bao gồm gọi API)
    loginZalo,
    loginSocial,
    logout,
    updateProfileAsync,
    
    // --- LOADING STATES (Rất quan trọng để disable nút bấm/hiện spinner) ---
    isLoading: loginZaloMutation.isPending || logoutMutation.isPending || updateProfileMutation.isPending || socialLoginMutation.isPending,
    isUpdating: updateProfileMutation.isPending,
    isLoggingOut: logoutMutation.isPending,

    // --- HELPERS ---
    requireAuth,
    redirectIfAuthenticated,
    checkProfileCompleteness
  };
}