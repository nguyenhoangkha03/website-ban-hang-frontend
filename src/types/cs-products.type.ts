// 1. Các thành phần nhỏ (Sub-types)
export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ProductImage {
  url: string;
  alt?: string;
  isPrimary: boolean;
}

export interface ProductVideo {
  url: string;
  thumbnail?: string;
  title?: string;
}

export interface PromotionInfo {
  id: number;   // ✅ MỚI: Cần ID để làm radio button chọn khuyến mãi
  name: string;
  type: 'percent_discount' | 'fixed_discount' | 'buy_x_get_y' | 'gift' | string;
  value?: number;     // ✅ MỚI: Giá trị giảm (để hiển thị "Giảm 50k")
  giftName?: string;  // ✅ MỚI: Tên quà tặng (để hiển thị "+ Tặng Áo mưa")
  endDate: string;    // ISO Date string
}

// 2. Sản phẩm hiển thị dạng danh sách (Card sản phẩm)
export interface StoreProduct {
  id: number;
  name: string;
  sku: string;
  slug: string;
  image: string;
  video: string;
  
  unit: string; // ✅ MỚI: Đơn vị tính (Chai, Gói, Bao...)

  // Giá & Khuyến mãi
  originalPrice: number;      
  salePrice: number;          
  discountPercentage: number; 
  
  // Trạng thái
  isFeatured: boolean;
  inStock: boolean;
  
  // ❌ ĐÃ XÓA: averageRating, soldCount (Theo yêu cầu của bạn)
  
  category: ProductCategory;
  promotion: PromotionInfo | null; // Khuyến mãi tốt nhất đang áp dụng
}

// 3. Chi tiết sản phẩm (Trang Detail)
export interface StoreProductDetail extends StoreProduct {
  description?: string;
  barcode?: string;
  weight?: number;
  dimensions?: string;
  packagingType?: string;
  
  // Danh sách media
  images: ProductImage[];
  videos: ProductVideo[];
  
  // ✅ MỚI: Danh sách tất cả khuyến mãi để khách chọn lại (nếu muốn)
  availablePromotions: PromotionInfo[];

  // Gợi ý liên quan
  relatedProducts?: StoreProduct[];
}

// 4. Tham số Query (Dùng khi gọi API danh sách)
export interface StoreProductParams {
  page?: number;
  limit?: number;
  search?: string;
  historySearch?: string[];
  categoryId?: number;
  productType?: string; 
  isFeatured?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'bestseller';

  packagingType?: string; 
  minPrice?: number;
  maxPrice?: number;
}

// 5. Cấu trúc Response chuẩn
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductListResponse {
  success: boolean;
  data: StoreProduct[];
  meta: PaginationMeta;
  timestamp: string;
}

export interface ProductDetailResponse {
  success: boolean;
  data: StoreProductDetail;
  timestamp: string;
}