
import { Skeleton } from '@/components/ui/skeleton';

const SidebarSkeleton = () => (
  <aside className="w-64 bg-white p-6 shadow-md flex flex-col">
    <div className="text-center mb-12">
      <div className="relative w-32 h-32 mx-auto">
        <Skeleton className="w-full h-full rounded-full" />
      </div>
      <Skeleton className="h-6 w-32 mt-4 mx-auto" />
      <Skeleton className="h-4 w-20 mt-2 mx-auto" />
    </div>
    <nav className="flex-grow">
      <ul>
        <li className="mb-2"><Skeleton className="h-12 w-full rounded-lg" /></li>
        <li className="mb-2"><Skeleton className="h-12 w-full rounded-lg" /></li>
        <li className="mb-2"><Skeleton className="h-12 w-full rounded-lg" /></li>
      </ul>
    </nav>
    <div className="mt-auto">
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  </aside>
);

const MainContentSkeleton = () => (
    <main className="flex-1 p-8">
        <header className="mb-8 flex justify-between items-center">
            <Skeleton className="h-10 w-96" />
            <Skeleton className="h-10 w-40 rounded-lg" />
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Skeleton for Payment Method Card */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 flex flex-col">
                <div className="p-4 flex justify-between items-start">
                    <Skeleton className="w-16 h-16 rounded-xl" />
                    <Skeleton className="h-6 w-6 rounded-lg" />
                </div>
                <div className="flex-grow px-4 pb-4">
                    <Skeleton className="h-5 w-40 mb-2" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>
            {/* Skeleton for Payment Method Card */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 flex flex-col">
                <div className="p-4 flex justify-between items-start">
                    <Skeleton className="w-16 h-16 rounded-xl" />
                    <Skeleton className="h-6 w-6 rounded-lg" />
                </div>
                <div className="flex-grow px-4 pb-4">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-44" />
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                </div>
            </div>
        </div>
    </main>
);

const AccountManagementSkeleton = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex">
      <SidebarSkeleton />
      <MainContentSkeleton />
    </div>
  );
};

export default AccountManagementSkeleton;
