import { z } from 'zod';

// Regex chuẩn
const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
const cccdRegex = /^[0-9]{12}$/;

// ==========================================
// 1. Interface dữ liệu hiển thị (GET /profile)
// ==========================================
export interface UserProfile {
  id: number;
  customerCode: string;
  customerName: string;
  
  // ⚠️ Sửa: Có thể null nếu mới đăng nhập Zalo lần đầu
  phone?: string | null; 
  
  // ✅ Thêm: Căn cước công dân
  cccd?: string | null;

  email?: string | null;
  avatarUrl?: string | null;
  address?: string | null;
  province?: string | null;
  district?: string | null;
  
  creditLimit?: number;
  currentDebt?: number;
  
  // ✅ Thêm: ZALO
  authProvider?: 'PHONE' | 'GOOGLE' | 'FACEBOOK' | 'ZALO';
}

// ==========================================
// 2. Schema Form cập nhật (PUT /profile)
// ==========================================
export const UpdateProfileSchema = z.object({
  customerName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  
  // ✅ Phone: Giờ đây bắt buộc phải validate kỹ vì user sẽ nhập vào
  phone: z.string()
    .min(1, 'Vui lòng nhập số điện thoại')
    .regex(phoneRegex, 'Số điện thoại không hợp lệ (VD: 0912345678)'),

  // ✅ CCCD: Bắt buộc nhập 12 số
  cccd: z.string()
    .min(1, 'Vui lòng nhập CCCD')
    .regex(cccdRegex, 'CCCD phải bao gồm đúng 12 chữ số'),

  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  
  address: z.string().optional(),
  province: z.string().optional(),
  district: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  contactPerson: z.string().optional(),
});

// Type inference cho React Hook Form
export type UpdateProfileType = z.infer<typeof UpdateProfileSchema>;