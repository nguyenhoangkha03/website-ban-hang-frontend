'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useSupplierById } from '@/hooks/api/useSuppliers';
import { useProducts } from '@/hooks/api/useProducts';
import ProductCard from '@/components/product/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Building, Globe, Mail, MapPin, Phone } from 'lucide-react';

const SupplierDetailPage = () => {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';

  const { data: supplier, isLoading: isLoadingSupplier, isError: isErrorSupplier } = useSupplierById(id);
  const { data: supplierProducts, isLoading: isLoadingProducts } = useProducts({ supplierId: id });

  if (isLoadingSupplier) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Skeleton className="h-16 w-1/2 mb-4" />
        <Skeleton className="h-4 w-3/4 mb-8" />
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Skeleton className="h-8" />
          <Skeleton className="h-8" />
          <Skeleton className="h-8" />
          <Skeleton className="h-8" />
        </div>
        <Skeleton className="h-10 w-32 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
        </div>
      </div>
    );
  }

  if (isErrorSupplier || !supplier) {
    return <div className="text-center py-20 text-red-500">Failed to load supplier details or supplier not found.</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Supplier Header */}
        <header className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
              <Building className="w-12 h-12 text-blue-600" />
            </div>
            <div className="flex-grow">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
                {supplier.supplierName}
              </h1>
              <p className="text-lg text-gray-500">{supplier.notes || 'A trusted partner in our supply chain.'}</p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                  <span>{supplier.phone || 'Not available'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                  <span>{supplier.email || 'Not available'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 sm:col-span-2">
                  <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
                  <span>{supplier.address || 'Not available'}</span>
                </div>
                 <div className="flex items-center gap-3 text-gray-700">
                  <Globe className="w-5 h-5 text-blue-500 shrink-0" />
                  <span className="capitalize">{supplier.supplierType}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Products from this supplier */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Products from {supplier.supplierName}
          </h2>
          {isLoadingProducts ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
            </div>
          ) : supplierProducts && supplierProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {supplierProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-600">No products found for this supplier.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierDetailPage;