
import { Metadata } from 'next'
import ProductDetailsPage from '@/components/ui/custom/products/ProductDetailsPage'
import { Product } from '@/types/product'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import LoadingPage from '@/components/ui/custom/Loader'

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: { id: string } 
}): Promise<Metadata> {
  try {
    const product = await fetchProduct(params.id)
    
    return {
      title: `${product.title} `,
      description: product.description,
      openGraph: {
        title: product.title,
        description: product.description,
        images: product.images?.[0] ? [product.images[0]] : [],
      },
    }
  } catch {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    }
  }
}

// Server-side data fetching
async function fetchProduct(id: string): Promise<Product> {
  const response = await fetch(
    `${process.env.NEXT_URL}/api/products/${id}`,
    { 
      next: { 
        revalidate: 60, 
        tags: [`product-${id}`] 
      } 
    }
  )
  
  if (!response.ok) {
    throw new Error('Failed to fetch product')
  }
  
  return response.json()
}

// Loading component
function ProductLoading() {
  return (
    <div className='h-svh flex items-center justify-center'>
      <LoadingPage/>
    </div>
  )
}

// Main page component (Server Component)
export default async function SingleProductPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  
  try {
    console.log('Fetching product:', params.id);
    
    const product = await fetchProduct(params.id)
    
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Suspense fallback={<ProductLoading />}>
          <ProductDetailsPage product={product} />
        </Suspense>
      </div>
    )
  } catch (error) {
    console.error('Error loading product:', error)
    notFound() // This will show your 404 page
  }
}

