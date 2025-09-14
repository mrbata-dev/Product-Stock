'use client'
import ProductDetailsPage from '@/components/ui/custom/products/ProductDetailsPage';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Product } from '@/types/product';

const SingleProductPages = () => {

    const params = useParams();
    // const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/products/${params.id}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch product');
          }
          
          const data = await response.json();
          setProduct(data);
        } catch (err) {
          console.error('Error fetching product:', err);
          setError('Failed to load product details');
        } finally {
          setLoading(false);
        }
      };
  
      if (params.id) {
        fetchProduct();
      }
    }, [params.id]);
//  API 

 console.log(product);
 
return (
    <div className='flex items-center justify-center min-h-screen'>
      {loading && (
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-500 text-lg">Loading product...</p>
        </div>
      )}
      {error && (
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      )}
      {!loading && !error && <ProductDetailsPage product={product}/>}
    </div>
  )
}

export default SingleProductPages
