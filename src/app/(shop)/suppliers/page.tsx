'use client';

import React from 'react';
import { useSuppliers } from '@/hooks/api/useSuppliers';
import Link from 'next/link';
import { Building, Globe, MapPin, Phone } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const SupplierCard = ({ supplier }: { supplier: import('@/types').Supplier }) => (
  <Link href={`/suppliers/${supplier.id}`} passHref>
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer border">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Building className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
              {supplier.supplierName}
            </h2>
            <p className="text-sm text-gray-500">{supplier.supplierCode}</p>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          {supplier.contactName && (
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{supplier.contactName}</span>
            </div>
          )}
          {supplier.address && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{supplier.address}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-600">
            <Globe className="w-4 h-4" />
            <span className="capitalize">{supplier.supplierType}</span>
          </div>
        </div>
      </div>
    </div>
  </Link>
);

const SupplierListPage = () => {
  const { data: suppliers, isLoading, isError } = useSuppliers();

  if (isError) {
    return <div className="text-center py-10 text-red-500">Failed to load suppliers.</div>;
  }

  const renderSkeletons = () => (
    Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="bg-white rounded-lg shadow-md p-6 border">
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="w-12 h-12 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    ))
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Our Suppliers
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Partners who help us deliver the best products to you.
          </p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? renderSkeletons() : suppliers?.map(supplier => (
            <SupplierCard key={supplier.id} supplier={supplier} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupplierListPage;
