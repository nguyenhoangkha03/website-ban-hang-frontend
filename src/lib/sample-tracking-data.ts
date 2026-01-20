
// Based on the data structure from Road_map.md

export interface OrderInfo {
  orderNumber: string;
  status: 'processing' | 'confirmed' | 'packaged' | 'shipping' | 'delivered' | 'cancelled';
  statusText: string;
  createdDate: string;
  estimatedDelivery: string;
  total: number;
  shippingFee: number;
  discount: number;
}
export interface ShippingInfo {
  courier: string;
  trackingNumber: string;
  driverName: string;
  driverPhone: string;
}
export interface RecipientInfo {
  name: string;
  phone: string;
  address: string;
}
export interface OrderItem {
  id: number;
  name: string;
  variant: string;
  quantity: number;
  price: number;
  image: string;
}
export interface TrackingStep {
  id: number;
  status: string;
  description: string;
  timestamp: string;
  location?: string;
  completed: boolean;
}

export interface SampleFullOrderDetails {
    orderInfo: OrderInfo;
    shippingInfo: ShippingInfo;
    recipientInfo: RecipientInfo;
    items: OrderItem[];
    trackingSteps: TrackingStep[];
}

export const sampleOrderDetails: SampleFullOrderDetails = {
    orderInfo: {
        orderNumber: "ND2024120001",
        status: "shipping",
        statusText: "Đang giao hàng",
        createdDate: "15/12/2024",
        estimatedDelivery: "18/12/2024",
        total: 1063000,
        shippingFee: 15000,
        discount: 0,
    },
    shippingInfo: {
        courier: "Giao Hàng Nhanh",
        trackingNumber: "GHN123456789",
        driverName: "Nguyễn Văn Tài",
        driverPhone: "0987654321",
    },
    recipientInfo: {
        name: "Nguyễn Văn A",
        phone: "0123456789",
        address: "123 Đường ABC, Phường 1, Quận 2, Thành phố Hồ Chí Minh",
    },
    items: [
        {
            id: 1,
            name: "Thuốc trừ sâu BASTA 150SL",
            variant: "Chai 1L",
            quantity: 2,
            price: 185000,
            image: "https://picsum.photos/seed/basta/200",
        },
        {
            id: 2,
            name: "Phân bón lá NPK 30-10-10",
            variant: "Gói 500g",
            quantity: 5,
            price: 65000,
            image: "https://picsum.photos/seed/npk-la/200",
        }
    ],
    trackingSteps: [
        {
            id: 1,
            status: "Đã đặt hàng",
            description: "Đơn hàng đã được đặt thành công.",
            timestamp: "15/12/2024 14:30",
            completed: true,
        },
        {
            id: 2,
            status: "Đã xác nhận",
            description: "Người bán đã xác nhận đơn hàng của bạn.",
            timestamp: "15/12/2024 15:45",
            completed: true,
        },
        {
            id: 3,
            status: "Đã đóng gói",
            description: "Đơn hàng đã được đóng gói và chuyển cho đơn vị vận chuyển.",
            timestamp: "16/12/2024 09:20",
            location: "Kho Quận 2, TP.HCM",
            completed: true,
        },
        {
            id: 4,
            status: "Đang vận chuyển",
            description: "Đơn hàng đang được giao đến bạn.",
            timestamp: "17/12/2024 08:15",
            location: "Đang trên đường giao",
            completed: true,
        },
        {
            id: 5,
            status: "Giao hàng thành công",
            description: "Đơn hàng sẽ được giao trong hôm nay.",
            timestamp: "Dự kiến 18/12/2024",
            completed: false,
        }
    ]
};
