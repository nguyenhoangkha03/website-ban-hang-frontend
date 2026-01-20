import { Product, Category, Supplier, ProductType, ProductStatus, ImageType } from '@/types';
import { Order } from '@/hooks/api/useOrders'; // Temporary import

export const sampleCategories: Category[] = [
  { 
    id: 1, 
    categoryCode: 'TTS',
    categoryName: 'Thuốc trừ sâu',
    slug: 'thuoc-tru-sau',
    status: 'active',
  },
  { 
    id: 2, 
    categoryCode: 'PBL',
    categoryName: 'Phân bón lá',
    slug: 'phan-bon-la',
    status: 'active',
  },
  { 
    id: 3, 
    categoryCode: 'PBG',
    categoryName: 'Phân bón gốc',
    slug: 'phan-bon-goc',
    status: 'active',
  },
  { 
    id: 4, 
    categoryCode: 'TDC',
    categoryName: 'Thuốc diệt cỏ',
    slug: 'thuoc-diet-co',
    status: 'active',
  },
  { 
    id: 5, 
    categoryCode: 'GCT',
    categoryName: 'Giống cây trồng',
    slug: 'giong-cay-trong',
    status: 'active',
  },
];

export const sampleSuppliers: Supplier[] = [
    { id: 1, supplierCode: 'SYN', supplierName: 'Syngenta', supplierType: 'foreign', status: 'active' },
    { id: 2, supplierCode: 'BAY', supplierName: 'Bayer', supplierType: 'foreign', status: 'active' },
    { id: 3, supplierCode: 'BDI', supplierName: 'Bình Điền', supplierType: 'local', status: 'active' },
    { id: 4, supplierCode: 'TTC', supplierName: 'Thành Thành Công', supplierType: 'local', status: 'active' },
    { id: 5, supplierCode: 'GCTMN', supplierName: 'Giống cây trồng Miền Nam', supplierType: 'local', status: 'active' },
];


export const sampleProducts: Product[] = [
  {
    id: 1,
    sku: 'TTS-001',
    slug: 'thuoc-tru-sau-sinh-hoc-radiant',
    productName: 'Thuốc trừ sâu sinh học Radiant',
    description: 'Radiant 60SC là thuốc trừ sâu sinh học có nguồn gốc từ thiên nhiên, hiệu quả cao trong việc phòng trừ sâu cuốn lá, sâu đục thân trên lúa.',
    productType: ProductType.GOODS,
    categoryId: 1,
    supplierId: 1,
    unit: 'chai',
    purchasePrice: 100000,
    sellingPriceRetail: 120000,
    sellingPriceWholesale: 110000,
    sellingPriceVip: 105000,
    status: ProductStatus.ACTIVE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    images: [{ 
        id: 1, 
        imageUrl: 'https://images.unsplash.com/photo-1579547945412-484f526b38c8?w=400&h=400&fit=crop',
        imageType: ImageType.GALLERY,
        isPrimary: true,
        displayOrder: 1,
    }],
    category: sampleCategories[0],
    supplier: sampleSuppliers[0],
    rating: 4.8,
    reviews: 250,
    sold: 3000,
    stockQuantity: 150,
  },
  {
    id: 2,
    sku: 'PBL-001',
    slug: 'phan-bon-la-npk-30-10-10',
    productName: 'Phân bón lá NPK 30-10-10',
    description: 'Phân bón lá cao cấp NPK 30-10-10+TE giúp cây trồng phát triển mạnh, tăng năng suất và chất lượng nông sản.',
    productType: ProductType.GOODS,
    categoryId: 2,
    supplierId: 2,
    unit: 'gói',
    purchasePrice: 50000,
    sellingPriceRetail: 65000,
    sellingPriceWholesale: 60000,
    sellingPriceVip: 55000,
    status: ProductStatus.ACTIVE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    images: [{ 
        id: 2, 
        imageUrl: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&h=400&fit=crop',
        imageType: ImageType.GALLERY,
        isPrimary: true,
        displayOrder: 1,
    }],
    category: sampleCategories[1],
    supplier: sampleSuppliers[1],
    rating: 4.9,
    reviews: 500,
    sold: 8000,
    stockQuantity: 100, // Changed from 0 to 100 for testing purposes
  },
  {
    id: 3,
    sku: 'PBG-001',
    slug: 'phan-bon-goc-npk-16-16-8',
    productName: 'Phân bón gốc NPK 16-16-8',
    description: 'Phân bón NPK 16-16-8+TE chuyên dùng cho cây ăn trái, cây công nghiệp, giúp cây ra hoa, đậu trái tốt.',
    productType: ProductType.GOODS,
    categoryId: 3,
    supplierId: 3,
    unit: 'bao',
    purchasePrice: 450000,
    sellingPriceRetail: 500000,
    sellingPriceWholesale: 480000,
    sellingPriceVip: 470000,
    status: ProductStatus.ACTIVE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    images: [{ 
        id: 3, 
        imageUrl: 'https://images.unsplash.com/photo-1587426744783-0a4f6539137c?w=400&h=400&fit=crop',
        imageType: ImageType.GALLERY,
        isPrimary: true,
        displayOrder: 1,
     }],
    category: sampleCategories[2],
    supplier: sampleSuppliers[2],
    rating: 4.7,
    reviews: 150,
    sold: 2000,
    stockQuantity: 50,
  },
  {
    id: 4,
    sku: 'TDC-001',
    slug: 'thuoc-diet-co-glyphosate-480sl',
    productName: 'Thuốc diệt cỏ Glyphosate 480SL',
    description: 'Thuốc diệt cỏ không chọn lọc, hậu nảy mầm, tác động lưu dẫn, diệt trừ hữu hiệu nhiều loại cỏ dại.',
    productType: ProductType.GOODS,
    categoryId: 4,
    supplierId: 4,
    unit: 'chai',
    purchasePrice: 80000,
    sellingPriceRetail: 95000,
    sellingPriceWholesale: 90000,
    sellingPriceVip: 85000,
    status: ProductStatus.ACTIVE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    images: [{ 
        id: 4, 
        imageUrl: 'https://images.unsplash.com/photo-1579547945412-484f526b38c8?w=400&h=400&fit=crop',
        imageType: ImageType.GALLERY,
        isPrimary: true,
        displayOrder: 1,
    }],
    category: sampleCategories[3],
    supplier: sampleSuppliers[3],
    rating: 4.6,
    reviews: 80,
    sold: 1000,
    stockQuantity: 200,
  },
  {
    id: 5,
    sku: 'GCT-001',
    slug: 'giong-lua-lai-f1',
    productName: 'Giống lúa lai F1',
    description: 'Giống lúa lai F1 năng suất cao, chống chịu sâu bệnh tốt, hạt gạo trong, cơm dẻo, thơm.',
    productType: ProductType.GOODS,
    categoryId: 5,
    supplierId: 5,
    unit: 'kg',
    purchasePrice: 20000,
    sellingPriceRetail: 25000,
    sellingPriceWholesale: 22000,
    sellingPriceVip: 21000,
    status: ProductStatus.ACTIVE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    images: [{
        id: 5,
        imageUrl: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&h=400&fit=crop',
        imageType: ImageType.GALLERY,
        isPrimary: true,
        displayOrder: 1,
    }],
    category: sampleCategories[4],
    supplier: sampleSuppliers[4],
    rating: 4.9,
    reviews: 300,
    sold: 5000,
    stockQuantity: 1000,
  },
  {
    id: 6,
    sku: 'NEW-001',
    slug: 'phan-bon-huu-co-sinh-hoc',
    productName: 'Phân bón hữu cơ sinh học A+ (Mới)',
    description: 'Sản phẩm phân bón hữu cơ sinh học thế hệ mới, giúp cải tạo đất, tăng cường vi sinh vật có lợi, cung cấp dưỡng chất cân đối cho cây trồng phát triển bền vững.',
    productType: ProductType.GOODS,
    categoryId: 3, // Reusing Phân bón gốc category
    supplierId: 3, // Reusing Bình Điền supplier
    unit: 'bao',
    purchasePrice: 250000,
    sellingPriceRetail: 300000,
    sellingPriceWholesale: 280000,
    sellingPriceVip: 270000,
    status: ProductStatus.ACTIVE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    images: [{
        id: 6,
        imageUrl: 'https://images.unsplash.com/photo-1587426744783-0a4f6539137c?w=400&h=400&fit=crop',
        imageType: ImageType.GALLERY,
        isPrimary: true,
        displayOrder: 1,
    }],
    category: sampleCategories[2], // Ensure this matches categoryId
    supplier: sampleSuppliers[2], // Ensure this matches supplierId
    rating: 5.0,
    reviews: 10,
    sold: 50,
    stockQuantity: 500, // High stock quantity for testing
  },
];


export const sampleOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'DH-2024-001',
    status: 'delivered',
    date: '2024-07-15T10:30:00Z',
    items: [
      { id: '1-1', name: 'Thuốc trừ sâu sinh học Radiant', quantity: 2, price: 120000, image: 'https://picsum.photos/seed/radiant/200' },
      { id: '1-2', name: 'Phân bón lá NPK 30-10-10', quantity: 1, price: 65000, image: 'https://picsum.photos/seed/npk/200' },
    ],
    total: 305000,
  },
  {
    id: '2',
    orderNumber: 'DH-2024-002',
    status: 'shipping',
    date: '2024-07-20T14:00:00Z',
    items: [
      { id: '2-1', name: 'Giống lúa lai F1', quantity: 10, price: 25000, image: 'https://picsum.photos/seed/f1/200' },
    ],
    total: 250000,
  },
  {
    id: '3',
    orderNumber: 'DH-2024-003',
    status: 'pending',
    date: '2024-07-21T09:15:00Z',
    items: [
      { id: '3-1', name: 'Thuốc diệt cỏ Glyphosate 480SL', quantity: 3, price: 95000, image: 'https://picsum.photos/seed/glyphosate/200' },
      { id: '3-2', name: 'Phân bón gốc NPK 16-16-8', quantity: 1, price: 500000, image: 'https://picsum.photos/seed/npk-goc/200' },
    ],
    total: 785000,
  },
    {
    id: '4',
    orderNumber: 'DH-2024-004',
    status: 'cancelled',
    date: '2024-07-18T11:45:00Z',
    items: [
      { id: '4-1', name: 'Phân bón lá NPK 30-10-10', quantity: 5, price: 65000, image: 'https://picsum.photos/seed/npk-cancelled/200' },
    ],
    total: 325000,
  },
];

export const durianProducts = sampleProducts.slice(0, 2);
export const riceProducts = sampleProducts.slice(2, 4);
export const otherProducts = sampleProducts.slice(4, 6);


/*
 * To create a sample customer account for testing:
 * 1. Navigate to the /register page in your browser.
 * 2. Fill out the registration form with the following details:
 *    - Name: Test Customer
 *    - Email: test@example.com
 *    - Phone: 0123456789
 *    - Password: password123
 *    - Confirm Password: password123
 * 3. Click the "Đăng ký" (Register) button.
 * 4. After successful registration, you will be redirected to the /login page.
 * 5. You can then log in using the email "test@example.com" and password "password123".
 *
 * Note: Direct seeding of user accounts with plaintext passwords in frontend sample data is not secure
 * and would bypass the backend's hashing mechanism. Therefore, creating an account via the registration
 * page is the recommended approach for testing.
 */