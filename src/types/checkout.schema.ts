import { z } from 'zod'

export const addressSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Số điện thoại không hợp lệ'),
  address: z.string().min(10, 'Địa chỉ phải có ít nhất 10 ký tự'),
  ward: z.string().min(1, 'Vui lòng chọn phường/xã'),
  district: z.string().min(1, 'Vui lòng chọn quận/huyện'),
  city: z.string().min(1, 'Vui lòng chọn tỉnh/thành phố'),
  isDefault: z.boolean().optional(),
})

export const checkoutSchema = z.object({
  addressId: z.number().min(1, 'Vui lòng chọn địa chỉ giao hàng'),
  paymentMethod: z.enum(['cod', 'credit', 'momo', 'zalopay', 'banking']).default('cod'),
  note: z.string().optional(),
  voucherCode: z.string().optional(),
})

export type AddressFormData = z.infer<typeof addressSchema>
export type CheckoutFormData = z.infer<typeof checkoutSchema>
