import { Button } from '@/components/ui/button'
import HeaderContent from '@/components/ui/custom/HeaderContent'
import AllProductTables from '@/components/ui/custom/products/AllProductTables'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Filter, Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Products = () => {
  return (
    <div className='space-y-6 container mx-auto mt-4  '>
      <div className='border-gray-400 border-2 rounded-2xl p-8'>
         <div className='flex items-center justify-between'>
          <HeaderContent title='All Product List'/>
          <div className='flex items-center justify-center gap-6'>
            <Button
            className='bg-green-400 '
            >
              <Link href={'/dashboard/products/new'} 
              className='flex items-center justify-center gap-2 text-white font-medium font-semibold'
              >Add Product <Plus/></Link>
            </Button>
  
            {/* Filter product */}
              <DropdownMenu >
            
                <DropdownMenuTrigger className='flex items-center justify-between gap-2 border-2 border-green-500 rounded-md px-8 cursor-pointer py-1.5 font-semibold  text-green'><span >Filter</span><Filter/></DropdownMenuTrigger>
                {/*  */}
                <DropdownMenuContent className='bg-white shadow-2xl px-4 py-8 '>
                  <DropdownMenuSeparator className='outline-0 space-y-2 cursor-pointer'>
                    <DropdownMenuItem>Latest Product</DropdownMenuItem>
                    <DropdownMenuItem>Last Month</DropdownMenuItem>
                    <DropdownMenuItem>By Price</DropdownMenuItem>
                  </DropdownMenuSeparator>
                </DropdownMenuContent>
            
              </DropdownMenu>
          </div>
         </div>
         {/* Tables */}
         <AllProductTables/>
      </div>
    </div>
  )
}

export default Products
