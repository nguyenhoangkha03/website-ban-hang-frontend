import { z } from 'zod';

// Schema dữ liệu hiển thị (GET)
export interface UserProfile {
  id: number;
  customerCode: string;
  customerName: string;
  phone: string; // Quan trọng
  email?: string | null;
  avatarUrl?: string | null;
  address?: string | null;
  province?: string | null;
  district?: string | null;
  creditLimit?: number;
  currentDebt?: number;
  authProvider?: 'PHONE' | 'GOOGLE' | 'FACEBOOK';
}

// Schema Form cập nhật (PUT)
export const UpdateProfileSchema = z.object({
  customerName: z.string().min(1, 'Tên không được để trống'),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  // Phone không cho sửa ở đây, nhưng vẫn cần khai báo trong type form để hiển thị
  phone: z.string().optional(), 
  address: z.string().optional(),
  province: z.string().optional(),
  district: z.string().optional(),
});

export type UpdateProfileType = z.infer<typeof UpdateProfileSchema>;