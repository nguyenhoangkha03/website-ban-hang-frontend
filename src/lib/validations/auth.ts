import { z } from 'zod';

// Regex số điện thoại VN
const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;

// Schema Đăng nhập
export const LoginSchema = z.object({
  phone: z.string()
    .min(1, 'Vui lòng nhập số điện thoại')
    .regex(phoneRegex, 'Số điện thoại không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

// Schema Đăng ký - Bước 1 (Nhập thông tin)
export const RegisterSchema = z.object({
  phone: z.string()
    .min(1, 'Vui lòng nhập số điện thoại')
    .regex(phoneRegex, 'Số điện thoại không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string().min(6, 'Vui lòng xác nhận mật khẩu'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"], // Lỗi sẽ hiện ở ô confirmPassword
});

// Schema Quên mật khẩu
export const ForgotPasswordPhoneSchema = z.object({
  phone: z.string()
    .min(1, 'Vui lòng nhập số điện thoại')
    .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ'),
});

// // Schema Đặt lại mật khẩu
// export const ResetPasswordSchema = z.object({
//   password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
//   confirmPassword: z.string(),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Mật khẩu không khớp",
//   path: ["confirmPassword"],
// });

export const NewPasswordSchema = z.object({
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

// Type inference (Tự động tạo type TS từ schema Zod)
export type LoginFormType = z.infer<typeof LoginSchema>;
export type RegisterFormType = z.infer<typeof RegisterSchema>;
export type ForgotPasswordPhoneType = z.infer<typeof ForgotPasswordPhoneSchema>;
export type NewPasswordType = z.infer<typeof NewPasswordSchema>;