// 1. Common Interfaces
export interface CategoryCount {
  products: number;
  children?: number;
}

export interface CategoryParent {
  id: number;
  categoryName: string;
  slug?: string;
}

// 2. Main Category Interface (Dùng cho danh sách phẳng)
export interface PublicCategory {
  id: number;
  categoryCode: string;
  categoryName: string;
  slug: string;
  parentId: number | null;
  description: string | null;
  parent?: CategoryParent | null;
  _count?: CategoryCount;
}

// 3. Category Tree Interface (Dùng cho Sidebar/Menu đa cấp)
export interface PublicCategoryTree extends PublicCategory {
  children?: PublicCategoryTree[]; // Đệ quy: Con lại chứa cấu trúc giống cha
}

// 4. Params Input (Dùng khi gọi API danh sách)
export interface CategoryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  parentId?: number | null; // null để lấy danh mục gốc
  sortBy?: 'categoryName' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// 5. API Response Wrappers
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CategoryListResponse {
  success: boolean;
  data: PublicCategory[];
  meta: PaginationMeta;
  timestamp: string;
}

export interface CategoryTreeResponse {
  success: boolean;
  data: PublicCategoryTree[];
  timestamp: string;
}

export interface CategoryDetailResponse {
  success: boolean;
  data: PublicCategoryTree; // Chi tiết cũng có thể có children
  timestamp: string;
}