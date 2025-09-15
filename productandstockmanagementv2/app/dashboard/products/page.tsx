"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import HeaderContent from "@/components/ui/custom/HeaderContent";
import AllProductTables from "@/components/ui/custom/products/AllProductTables";
import FilterDropdown from "@/components/ui/custom/FilterDropdown";
import { Plus } from "lucide-react";
import Link from "next/link";


interface FilterDropdownProps {
  onFilterChange: (newParams: Record<string, string>) => void;
}


type Product = {
  id: string;
  title: string;
  price: number;
  category: { title: string }[];
  stock: number;
  images: { url: string }[]; 
  slug: string; 
  sku: string; 
 discountPercentage: number;
 createAt: Date;
 updateAt: Date;
};

type ProductData = {
  products: Product[];
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalCount: number;
};

const ProductsLoading = () => (
    <div className="space-y-6 container mx-auto mt-4">
        <div className="border-gray-400 border-2 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
                <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
                <div className="flex items-center gap-6">
                    <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
            </div>
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
                ))}
            </div>
        </div>
    </div>
);

const ProductsPage = () => {
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const query = searchParams.toString();
      try {
        const res = await fetch(`/api/products/getAllProducts?${query}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch products: ${res.status}`);
        }
        const data: ProductData = await res.json();
        setProductData(data);
      } catch (error: unknown) {
        setProductData(null);
        console.warn(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);
  
  const handleFilterChange = useCallback((newParams: Record<string, string>) => {
    const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        currentParams.set(key, value);
      } else {
        currentParams.delete(key);
      }
    });
    router.push(`/dashboard/products?${currentParams.toString()}`);
  }, [router, searchParams]);
  
  if (isLoading && !productData) {
    return <ProductsLoading />;
  }
  
  return (
    <div className="space-y-6 container mx-auto mt-4">
      <div className="border-gray-400 border-2 rounded-2xl p-8">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <HeaderContent title="All Product List" />
          <div className="flex items-center justify-center gap-6">
            <Button className="bg-green-400 hover:bg-green-500 transition-colors">
              <Link
                href="/dashboard/products/new"
                className="flex items-center justify-center gap-2 text-white font-semibold"
                prefetch={false}
              >
                Add Product <Plus size={16} />
              </Link>
            </Button>

            <FilterDropdown onFilterChange={handleFilterChange} />
          </div>
        </div>
        
        {productData ? (
          <AllProductTables
            products={productData.products}
            pagination={{
              currentPage: productData.currentPage,
              totalPages: productData.totalPages,
              hasNextPage: productData.hasNextPage,
              hasPrevPage: productData.hasPrevPage,
              totalCount: productData.totalCount,
            }}
          />
        ) : (
          !isLoading && <p className="text-center">No products found or an error occurred.</p>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;