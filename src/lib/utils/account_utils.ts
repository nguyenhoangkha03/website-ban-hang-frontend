import { UserProfile } from "@/lib/validations/user.validation";// Đảm bảo import đúng đường dẫn file type bạn tạo lúc nãy

export const AccountUtils = {
  // 1. Helper check xem có phải Social Account không
  isSocialAccount: (provider?: string | null) => {
    if (!provider) return false;
    
    const p = provider.toUpperCase();
    // ✅ THÊM 'ZALO' VÀO ĐÂY
    return p === 'GOOGLE' || p === 'FACEBOOK' || p === 'ZALO';
  },

  // 2. Helper check quyền sửa SĐT
  canUpdatePhone: (user: UserProfile | undefined | null) => {
    if (!user) return false;

    // Logic mới: 
    // - Nếu chưa có SĐT (user.phone is null/empty) -> BẮT BUỘC ĐƯỢC SỬA (để cập nhật lần đầu)
    if (!user.phone) return true;

    // - Nếu là tài khoản Social (Zalo/Google/FB) -> ĐƯỢC SỬA 
    // (Vì họ dùng Zalo ID để login, SĐT chỉ là thông tin liên lạc, có thể đổi được)
    if (AccountUtils.isSocialAccount(user.authProvider)) {
        return true;
    }

    // - Trường hợp còn lại (Legacy: Tài khoản cũ dùng SĐT+Pass)
    // Tùy bạn quyết định: Có cho họ đổi số không? 
    // Nếu hệ thống cũ dùng SĐT làm ID đăng nhập thì thường KHÔNG cho đổi.
    // Nhưng nếu bạn đã bỏ login password rồi thì return true luôn cũng được.
    return false; 
  },
  
  // 3. Helper check xem User đã cập nhật đủ thông tin chưa
  // Dùng để hiện cảnh báo màu vàng ở trang Profile hoặc chặn Checkout
  isProfileComplete: (user: UserProfile | undefined | null) => {
      if (!user) return false;
      // Phải có Tên, SĐT và CCCD
      return !!(user.customerName && user.phone && user.cccd);
  }
};