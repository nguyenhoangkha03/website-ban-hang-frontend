import { useQuery } from '@tanstack/react-query';
import { FullOrderDetails, OrderTimelineStep, BackendTrackingInfo } from '@/types/order'; // Import BackendTrackingInfo
import axiosInstance from '@/lib/axios';

const transformSalesOrderToFullOrderDetails = (backendData: BackendTrackingInfo): FullOrderDetails => {
  const timeline: OrderTimelineStep[] = backendData.statusHistory.map((history, index) => {
    let iconName: OrderTimelineStep['iconName'] = 'Package'; // Default icon
    if (history.status === 'Đã đặt') iconName = 'CheckCircle';
    else if (history.status === 'Đang xử lý') iconName = 'CheckCircle';
    else if (history.status === 'Đang vận chuyển') iconName = 'Truck';
    else if (history.status === 'Đã giao hàng') iconName = 'Home';
    else if (history.status === 'Đã hủy') iconName = 'XCircle'; // Custom icon for cancelled

    return {
      id: index + 1, // Use index for ID for timeline steps
      title: history.status,
      date: history.createdAt,
      iconName: iconName,
    };
  });

  // Determine currentStatusId based on the latest status in the timeline
  const currentStatusId = timeline.length > 0 ? timeline[timeline.length - 1].id : 0;

  return {
    id: backendData.id.toString(), // Frontend's FullOrderDetails expects string ID, backend's is number
    estimatedDelivery: 'N/A', // Placeholder: backend needs to provide this
    address: backendData.deliveryAddress || 'N/A',
    status: backendData.orderStatus,
    currentStatusId,
    timeline,
    products: backendData.details.map(item => ({
      name: item.product.productName,
      quantity: Number(item.quantity),
      price: Number(item.unitPrice),
    })),
    total: Number(backendData.totalAmount),
    trackingNumber: backendData.deliveries[0]?.trackingNumber, // Get tracking number from deliveries
  };
};

const fetchOrderTracking = async (orderId: string): Promise<BackendTrackingInfo> => {
  const response = await axiosInstance.get(`/sales-orders/${orderId}/tracking`, { withCredentials: true }); // Corrected endpoint
  return response.data.data;
};

export const useOrderTracking = (orderId: string | null) => {
  return useQuery<FullOrderDetails, Error>({
    queryKey: ['orderTracking', orderId],
    queryFn: async () => {
      const backendData = await fetchOrderTracking(orderId!);
      return transformSalesOrderToFullOrderDetails(backendData);
    },
    enabled: !!orderId,
    retry: 1,
  });
};
