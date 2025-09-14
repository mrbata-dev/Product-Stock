import { Button } from "@/components/ui/button";
import HeaderContent from "@/components/ui/custom/HeaderContent";
import AllProductTables from "@/components/ui/custom/products/AllProductTables";
import FilterDropdown from "@/components/ui/custom/FilterDropdown";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

type SearchParams = {
  page?: string;
  limit?: string;
  category?: string;
  gender?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  discount?: string;
  stock?: string;
  sort?: string;

};

// Memoized parameter processing function
const createFilteredParams = (params: SearchParams): Record<string, string> => {
  const filteredParams: Record<string, string> = {};
  
  // Only include defined values and skip empty strings
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      filteredParams[key] = value;
    }
  });
  
  return filteredParams;
};

// Optimized fetch function with proper caching and error handling
const fetchProducts = async (searchParams: SearchParams) => {
  const filteredParams = createFilteredParams(searchParams);
  const query = new URLSearchParams(filteredParams);
  
  try {
    const res = await fetch(
      `${process.env.NEXT_URL}/api/products/getAllProducts?${query}`,
      {

        next: { 
          revalidate: 60,
          tags: ['products'] 
        },
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (!res.ok) {
      // More detailed error handling
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        `Failed to fetch products: ${res.status} - ${errorData.message || res.statusText}`
      );
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Separate loading component
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



// Main products content component
const ProductsContent = async ({ searchParams }: { searchParams: SearchParams }) => {
  const productData = await fetchProducts(searchParams);
  
  return (
    <div className="space-y-6 container mx-auto mt-4">
      <div className="border-gray-400 border-2 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
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
            <Suspense fallback={<div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>}>
              <FilterDropdown />
            </Suspense>
          </div>
        </div>
        
        <Suspense fallback={<div className="h-96 bg-gray-100 rounded animate-pulse"></div>}>
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
        </Suspense>
      </div>
    </div>
  );
};

// Main component with error boundary
const Products = async ({ searchParams }: { searchParams: SearchParams }) => {
  // Await searchParams once for better performance
  const params = await Promise.resolve(searchParams);
  
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent searchParams={params} />
    </Suspense>
  );
};

export default Products;