
import { Skeleton } from '@/components/ui/skeleton';

const OrderHistorySkeleton = () => {
  const SKELETON_COUNT = 3;

  return (
    <div className="space-y-6">
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Order Header Skeleton */}
          <div className="p-4 bg-gray-50 flex justify-between items-center border-b border-gray-200">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Order Items Skeleton */}
          <div className="p-6 space-y-4">
            {/* Skeleton for one item */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="w-20 h-20 rounded-lg" />
                <div>
                  <Skeleton className="h-4 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <Skeleton className="h-6 w-24" />
            </div>
            {/* Skeleton for another item */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="w-20 h-20 rounded-lg" />
                <div>
                  <Skeleton className="h-4 w-40 mb-2" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          </div>

          {/* Order Footer Skeleton */}
          <div className="p-4 bg-gray-50 flex justify-between items-center border-t border-gray-200">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-8 w-32" />
            </div>
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderHistorySkeleton;
