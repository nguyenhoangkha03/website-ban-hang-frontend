
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
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-80 mt-2" />
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 text-center">
          <div className="relative w-40 h-40 mx-auto">
            <Skeleton className="w-full h-full rounded-full" />
          </div>
          <Skeleton className="h-5 w-24 mt-4 mx-auto" />
          <Skeleton className="h-4 w-48 mt-2 mx-auto" />
          <Skeleton className="h-10 w-24 mt-4 mx-auto rounded-lg" />
        </div>
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Skeleton className="h-5 w-20 mb-1" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
              <div>
                <Skeleton className="h-5 w-20 mb-1" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Skeleton className="h-5 w-20 mb-1" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
              <div>
                <Skeleton className="h-5 w-20 mb-1" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            </div>
            <div>
              <Skeleton className="h-5 w-24 mb-2" />
              <div className="flex space-x-6">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
            <div className="flex justify-end">
              <Skeleton className="h-12 w-24 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
);

const UserProfileSkeleton = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex">
      <SidebarSkeleton />
      <MainContentSkeleton />
    </div>
  );
};

export default UserProfileSkeleton;
