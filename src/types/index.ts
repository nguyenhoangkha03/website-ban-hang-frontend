// Enums from Prisma Schema
export enum ProductType {
    RAW_MATERIAL = 'raw_material',
    PACKAGING = 'packaging',
    FINISHED_PRODUCT = 'finished_product',
    GOODS = 'goods',
}

export enum ProductStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    DISCONTINUED = 'discontinued',
}

export enum ImageType {
    THUMBNAIL = 'thumbnail',
    GALLERY = 'gallery',
    MAIN = 'main',
}


// Interfaces based on Prisma Schema
export interface Category {
  id: number;
  categoryCode: string;
  categoryName: string;
  slug: string;
  parentId?: number | null;
  description?: string;
  status: 'active' | 'inactive';
}

export interface Supplier {
    id: number;
    supplierCode: string;
    supplierName: string;
    supplierType: 'local' | 'foreign';
    contactName?: string;
    phone?: string;
    email?: string;
    address?: string;
    taxCode?: string;
    paymentTerms?: string;
    notes?: string;
    status: 'active' | 'inactive';
}

export interface ProductImage {
    id: number;
    imageUrl: string;
    imageType: ImageType;
    altText?: string;
    isPrimary: boolean;
    displayOrder: number;
}

export interface Product {
  // Fields from Prisma
  id: number; // Changed from string
  sku: string;
  slug?: string;
  productName: string;
  productType: ProductType;
  categoryId?: number;
  supplierId?: number;
  unit: string;
  barcode?: string;
  weight?: number;
  dimensions?: string;
  description?: string;
  purchasePrice?: number;
  sellingPriceRetail?: number;
  sellingPriceWholesale?: number;
  sellingPriceVip?: number;
  taxRate?: number;
  minStockLevel?: number;
  expiryDate?: string; // Using string for DateTime
  status: ProductStatus;
  createdAt: string; // Using string for DateTime
  updatedAt: string; // Using string for DateTime

  // Frontend-specific / nested fields (kept for compatibility)
  category?: Category; // Nested object
  supplier?: Supplier; // Nested object
  images?: ProductImage[]; // Aligned with new ProductImage type

  // Extra fields from original frontend type
  rating?: number;
  reviews?: number;
  discount?: number;
  sold?: number;
  originalPrice?: number;
  stockQuantity: number;
}


// Other interfaces - updated where necessary
export interface SalesOrderItem {
  id: number;
  productId: number; // Changed from string
  quantity: number;
  unitPrice: number;
}

export interface SalesOrder {
  id: number;
  customerId: number; // Changed from string
  items: SalesOrderItem[];
  paymentMethod: string;
  orderStatus: string;
  orderDate: string;
}

export interface CreateSalesOrderPayload {
  customerId: number; // Changed from string
  items: Omit<SalesOrderItem, 'id'>[];
  paymentMethod: string;
}

export interface UserProfile {
  id: number; // Changed from string
  employeeCode: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  roleId: number;
  status: 'active' | 'inactive' | 'locked';
  createdAt?: string;
  updatedAt?: string;

  // Kept for potential compatibility, but prefer new fields
  username?: string;
  avatar?: string;
  birthDate?: string;
  role?: string;
}

export interface UpdateUserRequest {

  fullName?: string;

  phone?: string;

  birthDate?: string;

  gender?: 'male' | 'female' | 'other';

  avatar?: string;

}



export interface CustomerProfile {

  id: number;

  customerCode: string;

  customerName: string;

  customerType: 'individual' | 'company';

  classification: 'retail' | 'wholesale' | 'vip' | 'distributor';

  gender?: 'male' | 'female' | 'other';

  contactPerson?: string;

  phone: string;

  email?: string;

  avatarUrl?: string;

  address?: string;

  province?: string;

  district?: string;

  taxCode?: string;

  creditLimit: number;

  currentDebt: number;

  status: 'active' | 'inactive' | 'blacklisted';

  notes?: string;

  createdAt: string;

  updatedAt: string;

}



export interface UpdateCustomerRequest {

    customerName?: string;

    gender?: 'male' | 'female' | 'other';

    contactPerson?: string;

    phone?: string;

    email?: string;

    avatarUrl?: string;

    address?: string;

    province?: string;

    district?: string;

}



export * from './order';



export interface Filters {

  categories: string[];

  priceRange: [number, number];

  rating: number;

}


