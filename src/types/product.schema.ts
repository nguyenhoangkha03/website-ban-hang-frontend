import { z } from 'zod'

export const productSchema = z.object({
  sku: z.string().min(3, 'SKU phải có ít nhất 3 ký tự'),
  name: z.string().min(5, 'Tên sản phẩm phải có ít nhất 5 ký tự'),
  type: z.enum(['raw_material', 'packaging', 'finished_product', 'goods']),
  category: z.string().min(1, 'Vui lòng chọn danh mục'),
  price: z.number().positive('Giá phải lớn hơn 0'),
  originalPrice: z.number().positive('Giá gốc phải lớn hơn 0'),
  stock: z.number().int().nonnegative('Tồn kho không được âm'),
  description: z.string().optional(),
})

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5, 'Đánh giá từ 1-5 sao'),
  content: z.string().min(30, 'Nội dung đánh giá phải có ít nhất 30 ký tự'),
  images: z.array(z.instanceof(File)).max(5, 'Tối đa 5 hình ảnh').optional(),
  videos: z.array(z.instanceof(File)).max(2, 'Tối đa 2 video').optional(),
})

export type ProductFormData = z.infer<typeof productSchema>
export type ReviewFormData = z.infer<typeof reviewSchema>
