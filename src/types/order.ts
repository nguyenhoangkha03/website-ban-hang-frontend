import { Product } from '.'; // Assuming Product is defined in index.ts

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  warehouseId?: number;
  quantity: number; 
  unitPrice: number;
  discountPercent: number;
  taxRate: number;
  batchNumber?: string;
  expiryDate?: string;
  notes?: string;
  product: Product;
}

export interface Order {
  id: number;
  orderCode: string;
  customerId: number;
  warehouseId?: number;
  orderDate: string; 
  salesChannel: 'retail' | 'wholesale' | 'online' | 'distributor';
  totalAmount: number; 
  discountAmount: number;
  taxAmount: number;
  shippingFee: number;
  paidAmount: number;
  paymentMethod: 'cash' | 'transfer' | 'installment' | 'credit';
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  orderStatus: 'pending' | 'preparing' | 'delivering' | 'completed' | 'cancelled';
  deliveryAddress?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[]; 
}

export interface OrderTimelineStep {
  id: number;
  title: string;
  date?: string;
  iconName: 'CheckCircle' | 'Package' | 'Truck' | 'Home' | 'AlertCircle' | 'XCircle'; // Extended icon options
}

// Type that represents the exact structure returned by the backend's getTrackingInfo method
export interface BackendTrackingInfo {
  id: number; // The sales order ID
  orderStatus: string;
  deliveryAddress?: string;
  totalAmount: number;
  createdAt: string;
  approvedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  deliveries: Array<{ trackingNumber?: string }>;
  details: Array<{
    quantity: number;
    unitPrice: number;
    product: {
      productName: string;
    };
  }>;
  statusHistory: Array<{ status: string; createdAt: string }>;
}

export interface FullOrderDetails {
  id: string; // Order Code (frontend displays orderCode)
  estimatedDelivery: string;
  address: string;
  status: string;
  currentStatusId: number;
  timeline: OrderTimelineStep[];
  products: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  trackingNumber?: string; // Add tracking number here
}