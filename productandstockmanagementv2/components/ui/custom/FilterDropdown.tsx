// components/ui/custom/products/FilterDropdown.tsx
'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Filter } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

const FilterDropdown = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilter = (sortValue: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    if (sortValue) {
      current.set('sort', sortValue);
    } else {
      current.delete('sort');
    }
    
    // Reset to page 1 when applying filters
    current.set('page', '1');
    
    const search = current.toString();
    const query = search ? `?${search}` : '';
    
    router.push(`/dashboard/products${query}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='flex items-center justify-between gap-2 border-2 border-green-500 rounded-md px-8 z-50 cursor-pointer py-1.5 font-semibold text-green-600 hover:bg-green-50 transition-colors'>
        <span>Filter</span>
        <Filter />
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className='bg-white shadow-2xl px-4 py-2 rounded-md border min-w-[150px] z-50'>
        <DropdownMenuItem 
          className='cursor-pointer hover:bg-gray-100 px-3 py-2 rounded text-sm'
          onClick={() => handleFilter('latest')}
        >
          Latest Product
        </DropdownMenuItem>
        <DropdownMenuSeparator className='my-1 border-t' />
        <DropdownMenuItem 
          className='cursor-pointer hover:bg-gray-100 px-3 py-2 rounded text-sm'
          onClick={() => handleFilter('price-low')}
        >
          Price: Low to High
        </DropdownMenuItem>
        <DropdownMenuSeparator className='my-1 border-t' />
        <DropdownMenuItem 
          className='cursor-pointer hover:bg-gray-100 px-3 py-2 rounded text-sm'
          onClick={() => handleFilter('price-high')}
        >
          Price: High to Low
        </DropdownMenuItem>
        <DropdownMenuSeparator className='my-1 border-t' />
        <DropdownMenuItem 
          className='cursor-pointer hover:bg-gray-100 px-3 py-2 rounded text-sm'
          onClick={() => handleFilter('')}
        >
          Clear Filter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default FilterDropdown