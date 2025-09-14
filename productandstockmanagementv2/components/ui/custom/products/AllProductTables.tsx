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
import Image from "next/image";
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
import toast from "react-hot-toast";

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
}

const AllProductTables: React.FC<AllProductTablesProps> = ({
  products,
  pagination,
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
  // products.forEach(product => {
  //   console.log(product.slug, product.sku);
  // });


  // Deleted Products
  const deletedProducts = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
  
      if (!res.ok) {
        throw new Error('Failed to delete product');
      }
  
      toast.success('Product deleted successfully');
 
  
    } catch (error) {
      toast.error('Unable to delete product!');
      console.log(error);
    }
  };
  
  return (
    <div className="py-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="tableHead">Product Name</TableHead>
            <TableHead className="tableHead">Product Image</TableHead>
            <TableHead className="tableHead">Price</TableHead>
            <TableHead className="tableHead">Discount Percentage</TableHead>
            <TableHead className="tableHead">Stock</TableHead>
            <TableHead className="tableHead">Category</TableHead>
            <TableHead className="tableHead">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length > 0 ? (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.title}</TableCell>
                <TableCell>
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.title}
                      width={80}
                      height={80}
                      loading="lazy"
                      className="rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-[100px] h-[100px] bg-gray-200 rounded-md flex items-center justify-center">
                      No Image
                    </div>
                  )}
                </TableCell>
                <TableCell>Rs.{product.price.toFixed(2)}</TableCell>
                <TableCell>{product.discountPercentage}%</TableCell>
                <TableCell>
                  <span
                    className={clsx(
                      "px-4 py-2 rounded-2xl font-semibold",
                      product.stock < 5
                        ? "bg-red-200 text-red-700"
                        : product.stock <= 10
                        ? "bg-yellow-200 text-yellow-700"
                        : "bg-green-200 text-green-700"
                    )}
                  >
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell>
                  {product.category && product.category.length > 0
                    ? product.category[0].title
                    : "No Category"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <span className="bg-gray-400/30 rounded-md py-1 px-2 cursor-pointer hover:bg-gray-400/50 transition-colors">
                      <Link
                        href={`/dashboard/products/${product.id}`}
                      >
                        <Eye size={16} />
                      </Link>
                    </span>
                    <span className="bg-blue-400/30 rounded-md py-1 px-2 text-blue-600 cursor-pointer hover:bg-blue-400/50 transition-colors">
                     <Link 
                     href={`/dashboard/products/update-products/${product.id}`}
                     > <Edit size={16} /></Link>
                    </span>
                    <span className="bg-red-400/30 rounded-md py-1 px-2 text-red-600 cursor-pointer hover:bg-red-400/50 transition-colors"
                    onClick={() => deletedProducts(product.id)}
                    >
                      <Trash size={16} />
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No products found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              {pagination.hasPrevPage && (
                <PaginationItem>
                  <PaginationPrevious
                    href={`?page=${pagination.currentPage - 1}`}
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
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>

          <div className="text-center text-sm text-gray-600 mt-4">
            Showing {(pagination.currentPage - 1) * 10 + 1} to{" "}
            {Math.min(pagination.currentPage * 10, pagination.totalCount)} of{" "}
            {pagination.totalCount} products
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProductTables;
