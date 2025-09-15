'use client'
import React, { useState, useEffect } from 'react';
import LoadingPage from '../Loader';
import Image from 'next/image';
import Link from 'next/link';

interface ProductImage {
  url: string;
}

interface Product {
  id: string;
  title: string;
  stock: number;
  price: number | null;
  images: ProductImage[];
}

interface ApiResponse {
  products: Product[];
}

const RecentAddedProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        setLoading(true);
        // We set limit to 4 to only get 4 recent products
        const response = await fetch('/api/products/getAllProducts?sort=latest&limit=5');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.products);
      } catch (err) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    console.warn('Unknown error:', err);
    
  }
}finally {
        setLoading(false);
      }
    };

    fetchRecentProducts();
  }, []);

  if (loading) {
    return (
      <div className="p-2 sm:p-4">
        <div className="text-center">
          <LoadingPage />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-2 sm:p-4">
        <div className="text-center text-red-500 text-sm">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <svg className="w-5 h-5 text-red-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {products.length === 0 ? (
        <div className="text-center text-gray-500 py-6 sm:py-8">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-sm sm:text-base">No products found</p>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {products.map((product, index) => (
              <Link key={product.id} href={`/dashboard/products/${product.id}`}>
                <li className="block hover:bg-gray-50 transition-colors duration-200 active:bg-gray-100">
                  <div className="p-3 sm:p-4">
                    <div className="flex items-start sm:items-center space-x-3 sm:space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        {product.images && product.images.length > 0 ? (
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                            <Image
                              width={300}
                              height={300}
                              loading='lazy'
                              src={product.images[0].url}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                            <svg className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow min-w-0">
                        {/* Mobile Layout (stacked) */}
                        <div className="sm:hidden">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="text-sm font-semibold text-gray-800 truncate pr-2 flex-1">
                              {product.title}
                            </h3>
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full flex-shrink-0">
                              #{index + 1}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>Stock: {product.stock}</span>
                            {product.price && (
                              <span className="font-medium text-green-600">
                                ${product.price}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Desktop/Tablet Layout */}
                        <div className="hidden sm:block">
                          <div className="flex items-center justify-between">
                            <div className="flex-grow min-w-0">
                              <h3 className="text-base lg:text-lg font-semibold text-gray-800 truncate pr-4">
                                {product.title}
                              </h3>
                              <div className="flex items-center mt-1 space-x-4">
                                <span className="text-sm text-gray-600">
                                  Stock: {product.stock}
                                </span>
                                {product.price && (
                                  <span className="text-sm font-medium text-green-600">
                                    ${product.price}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {/* Item Number */}
                            <div className="flex-shrink-0 text-right">
                              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                                #{index + 1}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </Link>
            ))}
          </ul>
          
          {/* View All Products Link */}
          <div className="border-t border-gray-100 p-3 sm:p-4 bg-gray-50">
            <Link href="/dashboard/products" className="block w-full">
              <div className="text-center text-blue-600 hover:text-blue-700 text-sm font-medium py-2 transition-colors duration-200">
                View All Products
                <svg className="w-4 h-4 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentAddedProduct;