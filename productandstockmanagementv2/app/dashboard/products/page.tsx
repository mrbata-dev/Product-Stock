'use client';

import React, { useCallback, memo, Suspense, useState, useTransition } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import HeaderContent from '@/components/ui/custom/HeaderContent';
import { Plus, Trash2, AlertTriangle, Loader2, X, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import LoadingPage from '@/components/ui/custom/Loader';
import { useProducts } from '@/app/hooks/useProducts';
import ProductsError from '@/components/ProductsError';

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// ============ TYPE DEFINITIONS ============
interface Product {
  id: string;
  title: string;
  price: number;
  category: { id: string; title: string }[];
  stock: number;
  images: { id: string; url: string }[];
  slug: string;
  sku: string;
  discountPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  product: Product | null;
  isDeleting: boolean;
}

interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

// ============ CUSTOM TOAST COMPONENT ============
const Toast = memo<{ notifications: ToastNotification[]; onRemove: (id: string) => void }>(
  ({ notifications, onRemove }) => (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            flex items-center gap-3 p-4 rounded-lg shadow-lg max-w-sm
            animate-in slide-in-from-right duration-200
            ${notification.type === 'success' ? 'bg-green-50 border border-green-200' : ''}
            ${notification.type === 'error' ? 'bg-red-50 border border-red-200' : ''}
            ${notification.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' : ''}
            ${notification.type === 'info' ? 'bg-blue-50 border border-blue-200' : ''}
          `}
        >
          {notification.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
          {notification.type === 'error' && <XCircle className="w-5 h-5 text-red-600" />}
          {notification.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-600" />}
          <p className="flex-1 text-sm font-medium text-gray-900">{notification.message}</p>
          <button
            onClick={() => onRemove(notification.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
);

Toast.displayName = 'Toast';

// ============ DELETE CONFIRMATION MODAL ============
const DeleteConfirmationModal = memo<DeleteConfirmationProps>(({
  isOpen,
  onClose,
  onConfirm,
  product,
  isDeleting
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={!isDeleting ? onClose : undefined}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Delete Product
            </h3>
            <p className="text-sm text-gray-600">
              This action cannot be undone. This will permanently delete the product.
            </p>
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">You are about to delete:</p>
          <p className="font-semibold text-gray-900">{product.title}</p>
          <div className="mt-2 space-y-1">
            <p className="text-xs text-gray-500">SKU: {product.sku}</p>
            <p className="text-xs text-gray-500">Price: ${product.price}</p>
            <p className="text-xs text-gray-500">Stock: {product.stock} units</p>
          </div>
        </div>

        {/* Confirmation Input */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">
            Type <span className="font-mono font-semibold text-red-600">DELETE</span> to confirm
          </p>
          <input
            type="text"
            id="delete-confirmation"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Type DELETE"
            autoComplete="off"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              const input = document.getElementById('delete-confirmation') as HTMLInputElement;
              if (input?.value === 'DELETE') {
                onConfirm();
              } else {
                // Shake animation for invalid input
                input?.classList.add('animate-shake');
                setTimeout(() => input?.classList.remove('animate-shake'), 500);
              }
            }}
            disabled={isDeleting}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Product
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
});

DeleteConfirmationModal.displayName = 'DeleteConfirmationModal';

// ============ LOADING SKELETON ============
const ProductsLoadingSkeleton = () => (
  <div className="space-y-4">
    {/* Table Header Skeleton */}
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 p-4">
        <div className="grid grid-cols-6 gap-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      {/* Table Rows Skeleton */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="border-t border-gray-200 p-4">
          <div className="grid grid-cols-6 gap-4 items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
            </div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
    {/* Pagination Skeleton */}
    <div className="flex justify-between items-center mt-4">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
      <div className="flex gap-2">
        <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  </div>
);

// ============ LAZY LOADED COMPONENTS ============
const AllProductTables = dynamic(
  () => import('@/components/ui/custom/products/AllProductTables'),
  {
    loading: () => <ProductsLoadingSkeleton />,
    ssr: false,
  }
);

const FilterDropdown = dynamic(
  () => import('@/components/ui/custom/FilterDropdown'),
  {
    loading: () => (
      <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
    ),
  }
);

// ============ HEADER COMPONENT ============
const ProductsHeader = memo<{
  onFilterChange: (params: Record<string, string>) => void;
  isRefreshing?: boolean;
  onRefresh?: () => void;
}>(({ onFilterChange, isRefreshing, onRefresh }) => (
  <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
    <div className="flex items-center gap-4">
      <HeaderContent title="All Product List" />
      {isRefreshing && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Refreshing...</span>
        </div>
      )}
    </div>
    <div className="flex items-center justify-center gap-3">
      {onRefresh && (
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-10 w-10"
        >
          <Loader2 className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      )}
      <Button 
        className="bg-green-500 hover:bg-green-600 transition-all duration-200 shadow-sm hover:shadow-md"
        asChild
      >
        <Link
          href="/dashboard/products/new"
          className="flex items-center justify-center gap-2 text-white font-medium"
          prefetch={true}
        >
          <Plus size={18} />
          Add Product
        </Link>
      </Button>
      <FilterDropdown onFilterChange={onFilterChange} />
    </div>
  </div>
));

ProductsHeader.displayName = 'ProductsHeader';

// ============ EMPTY STATE ============
const EmptyState = memo(() => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="p-4 bg-gray-100 rounded-full mb-4">
      <svg
        className="w-12 h-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
    <p className="text-gray-600 mb-8 text-center max-w-sm">
      Start by adding your first product to see it listed here.
    </p>
    <Button asChild className="shadow-sm">
      <Link href="/dashboard/products/new">
        <Plus className="w-4 h-4 mr-2" />
        Add Your First Product
      </Link>
    </Button>
  </div>
));

EmptyState.displayName = 'EmptyState';

// ============ ENHANCED PRODUCT TABLE WRAPPER ============
const EnhancedProductTable = memo<{
  products: Product[];
  pagination: any;
  onDeleteProduct: (product: Product) => void;
  deletingProductId: string | null;
}>(({ products, pagination, onDeleteProduct, deletingProductId }) => {
  // Clone and enhance the products with delete handler
  const enhancedProducts = products.map(product => ({
    ...product,
    isDeleting: deletingProductId === product.id,
  }));

  return (
    <AllProductTables
      products={enhancedProducts}
      pagination={pagination}
      onDelete={onDeleteProduct}
    />
  );
});

EnhancedProductTable.displayName = 'EnhancedProductTable';

// ============ MAIN COMPONENT ============
const ProductsPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data, isLoading, error, refetch } = useProducts();
  const [isPending, startTransition] = useTransition();
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    product: Product | null;
  }>({ isOpen: false, product: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  // Add notification helper
  const addNotification = useCallback((type: ToastNotification['type'], message: string) => {
    const id = Date.now().toString();
    const notification: ToastNotification = { id, type, message, duration: 5000 };
    setNotifications(prev => [...prev, notification]);
    
    // Auto remove after duration
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, notification.duration);
  }, []);

  // Remove notification
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback(
    (newParams: Record<string, string>) => {
      startTransition(() => {
        const currentParams = new URLSearchParams(searchParams.toString());
        
        Object.entries(newParams).forEach(([key, value]) => {
          if (value) {
            currentParams.set(key, value);
          } else {
            currentParams.delete(key);
          }
        });
        
        router.replace(`/dashboard/products?${currentParams.toString()}`, {
          scroll: false,
        });
      });
    },
    [router, searchParams]
  );

  // Handle delete product
  const handleDeleteProduct = useCallback(async () => {
    if (!deleteModal.product) return;

    setIsDeleting(true);
    setDeletingProductId(deleteModal.product.id);

    try {
      const response = await fetch(`/api/products/${deleteModal.product.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      addNotification('success', `Product "${deleteModal.product.title}" deleted successfully`);
      
      // Close modal and refresh data
      setDeleteModal({ isOpen: false, product: null });
      await refetch();
    } catch (error) {
      console.error('Delete error:', error);
      addNotification('error', 'Failed to delete product. Please try again.');
    } finally {
      setIsDeleting(false);
      setDeletingProductId(null);
    }
  }, [deleteModal.product, refetch, addNotification]);

  // Open delete confirmation
  const openDeleteConfirmation = useCallback((product: Product) => {
    setDeleteModal({ isOpen: true, product });
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    addNotification('info', 'Refreshing products...');
    await refetch();
    addNotification('success', 'Products refreshed successfully');
  }, [refetch, addNotification]);

  // Handle different states
  if (error) {
    return <ProductsError error={error} onRetry={refetch} />;
  }

  const isLoadingOrTransitioning = isLoading || isPending;
  const hasProducts = data?.products && data.products.length > 0;

  return (
    <>
      <div className="space-y-6 container mx-auto mt-4">
        <div className="border-gray-200 border rounded-xl shadow-sm bg-white p-6">
          <ProductsHeader 
            onFilterChange={handleFilterChange}
            isRefreshing={isLoadingOrTransitioning}
            onRefresh={handleRefresh}
          />
          
          {isLoading && !data ? (
            <ProductsLoadingSkeleton />
          ) : (
            <Suspense fallback={<ProductsLoadingSkeleton />}>
              <div className={isLoadingOrTransitioning ? 'opacity-60 pointer-events-none' : ''}>
                {hasProducts ? (
                  <EnhancedProductTable
                    products={data.products}
                    pagination={data.pagination}
                    onDeleteProduct={openDeleteConfirmation}
                    deletingProductId={deletingProductId}
                  />
                ) : (
                  <EmptyState />
                )}
              </div>
            </Suspense>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => !isDeleting && setDeleteModal({ isOpen: false, product: null })}
        onConfirm={handleDeleteProduct}
        product={deleteModal.product}
        isDeleting={isDeleting}
      />

      {/* Toast Notifications */}
      <Toast notifications={notifications} onRemove={removeNotification} />

      {/* Add shake animation to global styles */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </>
  );
};

// ============ ERROR BOUNDARY WRAPPER ============
const ProductsPageWithErrorBoundary: React.FC = () => (
  <Suspense fallback={<LoadingPage />}>
    <ProductsPage />
  </Suspense>
);

export default ProductsPageWithErrorBoundary;