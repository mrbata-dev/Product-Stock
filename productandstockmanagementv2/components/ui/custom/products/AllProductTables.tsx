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
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../../pagination";

const AllProductTables = () => {
    const stockValue = 10;
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
          <TableRow>
            <TableCell>product1</TableCell>
            <TableCell>
              <Image src={"/image.jpg"} alt="image" width={100} height={100} />
            </TableCell>

            <TableCell>Rs.8000.00</TableCell>
            <TableCell>10%</TableCell>
            <TableCell 
            
            >
               <span
    className={clsx(
      "px-4 py-2 rounded-2xl font-semibold",
      stockValue < 5
        ? "bg-red-200 text-red-700"
        : stockValue <= 10
        ? "bg-yellow-200 text-yellow-700"
        : "bg-green-200 text-green-700"
    )}
  >
    {stockValue}
  </span>
            </TableCell>
            <TableCell>Shoe</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <span className="bg-gray-400/30 rounded-md py-1 px-2 cursor-pointer ">
                  {" "}
                  <Eye />
                </span>
                <span className="bg-blue-400/30 rounded-md py-1 px-2 text-blue-600  cursor-pointer">
                  {" "}
                  <Edit />
                </span>
                <span className="bg-red-400/30 rounded-md py-1 px-2 text-red-600 cursor-pointer">
                  {" "}
                  <Trash />
                </span>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>


      {/* Pagination */}
      <Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
    </PaginationItem>
  </PaginationContent>
</Pagination>
    </div>
  );
};

export default AllProductTables;