import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
// ✅ Import hook API đã viết để tái sử dụng, tránh lặp code gọi axios
import { useLogout } from "@/hooks/api/useAuthApi"; 

export function useAuth() {
  const router = useRouter();
  const authStore = useAuthStore();
  
  // 1. Khởi tạo mutation logout từ React Query
  // Hook này đã bao gồm logic: Gọi API -> Xóa Store (onSuccess) -> Redirect (onSuccess)
  const logoutMutation = useLogout();

  // 2. Hàm Logout Wrapper
  // Component chỉ cần gọi hàm này, không cần quan tâm logic bên dưới
  const logout = useCallback(() => {
    // Kích hoạt mutation
    logoutMutation.mutate(); 
  }, [logoutMutation]);

  // 3. Helper: Bắt buộc đăng nhập
  const requireAuth = useCallback(() => {
    if (!authStore.isAuthenticated) {
      router.push("/login");
      return false;
    }
    return true;
  }, [authStore.isAuthenticated, router]);

  // 4. Helper: Redirect nếu đã đăng nhập
  const redirectIfAuthenticated = useCallback(() => {
    if (authStore.isAuthenticated) {
      router.push("/");
      return true;
    }
    return false;
  }, [authStore.isAuthenticated, router]);

  return {
    // State
    user: authStore.user,
    accessToken: authStore.accessToken,
    isAuthenticated: authStore.isAuthenticated,

    // Actions
    login: authStore.login,
    setAccessToken: authStore.setAccessToken,
    logout, // ✅ Hàm logout này giờ gọi qua hook API, rất sạch
    
    // Trạng thái loading khi đang logout (nếu cần hiển thị spinner)
    isLoggingOut: logoutMutation.isPending, 

    // Helpers
    requireAuth,
    redirectIfAuthenticated,
  };
}