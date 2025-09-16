'use client'
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../table";
import { Edit, Eye, Trash } from "lucide-react";
import clsx from "clsx";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../pagination";
import Link from "next/link";

type Product = {
  id: string;
  title: string;
  images: { url: string }[];
  price: number;
  slug: string;
  sku: string;
  discountPercentage: number;
  stock: number;
  category: { title: string }[];
  createAt: Date;
  updateAt: Date;
  isDeleting?: boolean;
};

type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalCount: number;
};

interface AllProductTablesProps {
  products: Product[];
  pagination: PaginationInfo;
  onDelete?: (product: Product) => void; // Add this prop
}

const AllProductTables: React.FC<AllProductTablesProps> = ({
  products,
  pagination,
  onDelete, // Receive the delete handler from parent
}) => {
  // Generate pagination links
  const generatePaginationLinks = () => {
    const links = [];
    const { currentPage, totalPages } = pagination;

    // Always show first page
    if (currentPage > 3) {
      links.push(1);
      if (currentPage > 4) {
        links.push("...");
      }
    }

    // Show pages around current page
    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(totalPages, currentPage + 1);
      i++
    ) {
      links.push(i);
    }

    // Always show last page
    if (currentPage < totalPages - 2) {
      if (currentPage < totalPages - 3) {
        links.push("...");
      }
      links.push(totalPages);
    }

    return links;
  };

  const paginationLinks = generatePaginationLinks();

  return (
    <div className="py-4">
      {/* Clean table design without excessive colors */}
      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 border-b border-gray-200">
              <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Product</TableHead>
              <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Image</TableHead>
              <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Price</TableHead>
              <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</TableHead>
              <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</TableHead>
              <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Category</TableHead>
              <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
              products.map((product) => (
                <TableRow 
                  key={product.id} 
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    product.isDeleting ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <TableCell className="font-medium text-gray-900">
                    {product.title}
                  </TableCell>
                  <TableCell>
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].url}
                        alt={product.title}
                        width={64}
                        height={64}
                        className="rounded-lg object-cover w-16 h-16 border border-gray-200"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-900">
                    ${product.price.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {product.discountPercentage > 0 ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {product.discountPercentage}%
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={clsx(
                        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                        product.stock === 0
                          ? "bg-red-100 text-red-800"
                          : product.stock <= 5
                          ? "bg-yellow-100 text-yellow-800"
                          : product.stock <= 10
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      )}
                    >
                      {product.stock} {product.stock === 1 ? 'unit' : 'units'}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {product.category && product.category.length > 0
                      ? product.category.map(cat => cat.title).join(', ')
                      : "Uncategorized"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-end">
                      <Link
                        href={`/dashboard/products/${product.id}`}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Product"
                      >
                        <Eye size={16} />
                      </Link>
                      <Link 
                        href={`/dashboard/products/update-products/${product.id}`}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Product"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => onDelete && onDelete(product)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Product"
                        disabled={product.isDeleting}
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Eye className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium text-gray-900 mb-1">No products found</p>
                    <p className="text-sm text-gray-500">Try adjusting your filters or add a new product</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Cleaner Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex flex-col items-center space-y-4">
          <Pagination>
            <PaginationContent>
              {pagination.hasPrevPage && (
                <PaginationItem>
                  <PaginationPrevious
                    href={`?page=${pagination.currentPage - 1}`}
                    className="hover:bg-gray-100"
                  />
                </PaginationItem>
              )}

              {paginationLinks.map((link, index) => (
                <PaginationItem key={index}>
                  {link === "..." ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href={`?page=${link}`}
                      isActive={link === pagination.currentPage}
                      className={link === pagination.currentPage ? 'bg-blue-600 text-white hover:bg-blue-700' : 'hover:bg-gray-100'}
                    >
                      {link}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              {pagination.hasNextPage && (
                <PaginationItem>
                  <PaginationNext
                    href={`?page=${pagination.currentPage + 1}`}
                    className="hover:bg-gray-100"
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>

          <div className="text-sm text-gray-600">
            Showing <span className="font-medium">{(pagination.currentPage - 1) * 10 + 1}</span> to{" "}
            <span className="font-medium">{Math.min(pagination.currentPage * 10, pagination.totalCount)}</span> of{" "}
            <span className="font-medium">{pagination.totalCount}</span> products
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProductTables;