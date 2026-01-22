// Đảm bảo Interface này có trường authProvider
import { UserProfile } from "@/lib/validations/user.validation";

export const AccountUtils = {
  // Helper check xem có phải Social Account không
  isSocialAccount: (provider?: string | null) => {
    if (!provider) return false; // Nếu không có provider -> Mặc định là Phone hoặc lỗi
    
    const p = provider.toUpperCase();
    return p === 'GOOGLE' || p === 'FACEBOOK';
  },

  // Helper check quyền sửa SĐT
  canUpdatePhone: (user: UserProfile | undefined | null) => {
    if (!user) return false;
    
    // ⚠️ QUAN TRỌNG: Cần kiểm tra xem user object có trường authProvider không.
    // Nếu API Profile không trả về field này, logic sẽ sai (luôn return false).
    
    // 1. Nếu là tài khoản Social (Google/FB) -> CHO PHÉP SỬA
    if (AccountUtils.isSocialAccount(user.authProvider)) {
        return true;
    }

    // 2. Các trường hợp còn lại (PHONE, hoặc không xác định) -> KHÓA
    // (Vì tài khoản SĐT dùng SĐT làm định danh đăng nhập)
    return false; 
  }
};