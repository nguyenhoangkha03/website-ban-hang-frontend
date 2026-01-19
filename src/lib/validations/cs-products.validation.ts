import { z } from 'zod';

/**
 * Schema validate params khi lấy danh sách sản phẩm (Public)
 */
export const storeProductQuerySchema = z.object({
  // 1. Phân trang
  page: z.coerce
    .number()
    .int()
    .min(1, 'Trang phải lớn hơn 0')
    .default(1),

  // 2. Giới hạn số lượng
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100, 'Không được lấy quá 100 sản phẩm một lần')
    .default(20),

  // 3. Tìm kiếm
  search: z.string().trim().optional(),

  // 4. Lọc theo danh mục
  categoryId: z.coerce
    .number()
    .int()
    .positive('ID danh mục không hợp lệ')
    .optional(),

  // 5. Lọc theo nhóm sản phẩm (Thành phẩm / Hàng hóa)
  productType: z
    .enum(['finished_product', 'goods'])
    .optional(),

  // 6. Lọc nổi bật
  isFeatured: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),

  // 7. Sắp xếp
  sortBy: z
    .enum(['price_asc', 'price_desc', 'newest', 'bestseller'])
    .default('newest'),

  // 👇 8. MỚI: Lọc theo Quy cách đóng gói (Chai, Bao, Gói...)
  // Các giá trị này phải khớp với Enum trong Database
  packagingType: z
    .enum(['bottle', 'box', 'bag', 'label', 'other'])
    .optional(),

  // 👇 9. MỚI: Lọc theo Khoảng giá (min - max)
  minPrice: z.coerce
    .number()
    .min(0, 'Giá thấp nhất không được âm')
    .optional(),

  maxPrice: z.coerce
    .number()
    .min(0, 'Giá cao nhất không được âm')
    .optional(),
});

/**
 * Schema validate ID khi xem chi tiết
 */
export const storeProductIdSchema = z.object({
  id: z.coerce
    .number()
    .int()
    .positive('ID sản phẩm phải là số dương'),
});

// Xuất type
export type StoreProductQueryInput = z.infer<typeof storeProductQuerySchema>;
export type StoreProductIdInput = z.infer<typeof storeProductIdSchema>;