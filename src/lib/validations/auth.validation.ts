import { z } from 'zod';

// Regex chuẩn cho số điện thoại Việt Nam (Giữ nguyên của bạn)
const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;

// Regex cho Căn cước công dân (12 chữ số)
const cccdRegex = /^[0-9]{12}$/;

// ========================================================
// 1. Schema Cập nhật hồ sơ (Quan trọng nhất)
// Dùng cho trang /profile khi người dùng nhập SĐT và CCCD
// ========================================================
export const UpdateProfileSchema = z.object({
  customerName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').optional(),
  
  phone: z.string()
    .min(1, 'Vui lòng nhập số điện thoại')
    .regex(phoneRegex, 'Số điện thoại không hợp lệ'),

  cccd: z.string()
    .min(1, 'Vui lòng nhập CCCD')
    .regex(cccdRegex, 'CCCD phải bao gồm đúng 12 chữ số'),

  // ✅ THÊM CÁC TRƯỜNG CÒN THIẾU VÀO ĐÂY:
  
  // Email: Cho phép rỗng hoặc phải đúng định dạng email
  email: z.string()
    .email('Email không hợp lệ')
    .optional()
    .or(z.literal('')), 

  address: z.string().optional(),
  
  // Hai trường này lúc nãy thiếu nên bị báo lỗi
  province: z.string().optional(),
  district: z.string().optional(),

  gender: z.enum(['male', 'female', 'other']).optional(),
});

// ========================================================
// 2. Schema Login Zalo (Dùng để validate query param nếu cần)
// ========================================================
export const LoginZaloSchema = z.object({
  code: z.string().min(1, "Mã xác thực Zalo không hợp lệ"),
});

// ========================================================
// 3. Schema Kiểm tra SĐT (Nếu bạn dùng form kiểm tra riêng)
// ========================================================
export const CheckPhoneSchema = z.object({
  phone: z
    .string()
    .min(1, 'Vui lòng nhập số điện thoại')
    .regex(phoneRegex, 'Số điện thoại không hợp lệ'),
});

// ========================================================
// Type inference (Tự động tạo type TypeScript)
// ========================================================
export type UpdateProfileFormType = z.infer<typeof UpdateProfileSchema>;
export type LoginZaloFormType = z.infer<typeof LoginZaloSchema>;
export type CheckPhoneFormType = z.infer<typeof CheckPhoneSchema>;