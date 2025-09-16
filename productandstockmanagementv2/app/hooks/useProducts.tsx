
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductsResponse } from '@/types/product';

interface UseProductsReturn {
  data: ProductsResponse | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useProducts(): UseProductsReturn {
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const searchParams = useSearchParams();

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const query = searchParams.toString();
      const response = await fetch(`/api/products/getAllProducts?${query}`, {
        // Add cache control for better performance
        next: { revalidate: 30 },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Transform the data to match our interface
      setData({
        products: result.products,
        pagination: {
          currentPage: result.currentPage,
          totalPages: result.totalPages,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage,
          totalCount: result.totalCount,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  return { data, isLoading, error, refetch: fetchProducts };
}