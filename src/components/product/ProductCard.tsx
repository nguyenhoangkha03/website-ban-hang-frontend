
import React from 'react';
import { Product } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="border rounded-lg p-4">
      <Link href={`/product/${product.id}`}>
        <div>
          <div className="relative h-48">
            <Image 
              src={
                product.images?.[0]?.imageUrl 
                  ? (product.images[0].imageUrl.startsWith('http') || product.images[0].imageUrl.startsWith('/') 
                      ? product.images[0].imageUrl 
                      : `/uploads/${product.images[0].imageUrl}`)
                  : '/placeholder.jpg'
              } 
              alt={product.productName} 
              fill 
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" 
              className="object-cover mb-4" 
            />
          </div>
          <h3 className="font-bold">{product.productName}</h3>
          <p>{product.sellingPriceRetail} VND</p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
