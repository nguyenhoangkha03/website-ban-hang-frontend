'use client';

import { useWishlistStore } from '@/stores/wishlistStore';
import ProductCard from '@/components/product/ProductCard';

export default function WishlistPage() {
  const { items } = useWishlistStore();

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Your Wishlist</h2>

        {items.length === 0 ? (
          <div className="mt-6 text-center">
            <p className="text-lg text-gray-500">Your wishlist is empty.</p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
