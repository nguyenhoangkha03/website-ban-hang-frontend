import { UserProfile } from "@/lib/validations/user";

export const AccountUtils = {
  isSocialAccount: (provider?: string) => {
    return provider === 'GOOGLE' || provider === 'FACEBOOK';
  },

  canUpdatePhone: (user: UserProfile | undefined) => {
    if (!user) return false;
    
    // 1. Nếu là tài khoản SĐT (PHONE) -> KHÓA TUYỆT ĐỐI (Vì là định danh đăng nhập)
    if (!AccountUtils.isSocialAccount(user.authProvider)) return false;

    // 2. Nếu là tài khoản Social (Google/FB) -> CHO PHÉP SỬA THOẢI MÁI
    // (Bỏ điều kiện check user.phone.length cũ đi)
    return true; 
  }
};