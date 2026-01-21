import { z } from 'zod';

// Regex chuẩn cho số điện thoại Việt Nam:
// - Bắt đầu bằng 0 hoặc +84
// - Tiếp theo là các đầu số nhà mạng: 3, 5, 7, 8, 9
// - Theo sau là 8 chữ số
const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;

// 1. Schema Đăng nhập
export const LoginSchema = z.object({
  phone: z
    .string()
    .min(1, 'Vui lòng nhập số điện thoại')
    .regex(phoneRegex, 'Số điện thoại không hợp lệ (VD: 0912345678)'),
  password: z
    .string()
    .min(1, 'Vui lòng nhập mật khẩu') // Login thì không cần lộ hint min 6 ký tự để bảo mật, chỉ cần check not empty
});

// 2. Schema Đăng ký - Bước 1 (Nhập thông tin)
export const RegisterSchema = z.object({
  phone: z
    .string()
    .min(1, 'Vui lòng nhập số điện thoại')
    .regex(phoneRegex, 'Số điện thoại không hợp lệ'),
  password: z
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z
    .string()
    .min(1, 'Vui lòng xác nhận mật khẩu'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"], // Lỗi sẽ hiện ở ô confirmPassword
});

// 3. Schema Quên mật khẩu - Bước 1 (Nhập SĐT)
export const ForgotPasswordPhoneSchema = z.object({
  phone: z
    .string()
    .min(1, 'Vui lòng nhập số điện thoại')
    .regex(phoneRegex, 'Số điện thoại không hợp lệ'),
});

// 4. Schema Đặt lại mật khẩu mới (Dùng cho cả Forgot Password & Change Password)
export const NewPasswordSchema = z.object({
  password: z
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z
    .string()
    .min(1, 'Vui lòng xác nhận mật khẩu'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

// Type inference (Tự động tạo type TypeScript từ schema Zod)
export type LoginFormType = z.infer<typeof LoginSchema>;
export type RegisterFormType = z.infer<typeof RegisterSchema>;
export type ForgotPasswordPhoneType = z.infer<typeof ForgotPasswordPhoneSchema>;
export type NewPasswordType = z.infer<typeof NewPasswordSchema>;