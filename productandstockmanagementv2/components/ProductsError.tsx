
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ProductsErrorProps {
  error: Error;
  onRetry: () => void;
}

const ProductsError: React.FC<ProductsErrorProps> = ({ error, onRetry }) => (
  <div className="space-y-6 container mx-auto mt-4">
    <div className="border-gray-400 border-2 rounded-2xl p-8">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Error Loading Products
        </h3>
        <p className="text-gray-600 mb-6 max-w-md">
          {error.message || 'An unexpected error occurred while loading products.'}
        </p>
        <Button 
          onClick={onRetry}
          className="flex items-center gap-2"
          variant="outline"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      </div>
    </div>
  </div>
);

export default ProductsError;