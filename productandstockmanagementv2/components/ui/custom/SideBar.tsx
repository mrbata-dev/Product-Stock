'use client'
import clsx from 'clsx'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import { Button } from '../button'
import { LogOut } from 'lucide-react'
import { Skeleton } from '../skeleton'

const sideBarItems = [
  {
    title: 'Analytics',
    href: '/dashboard',
    icon: '📊'
  },
  {
    title: 'Products',
    href: '/dashboard/products',
    icon: '📦'
  },
  // {
  //   title: 'Stock',
  //   href: '/dashboard/stock',
  //   icon: '📋'
  // },
  // {
  //   title: 'Orders',
  //   href: '/dashboard/orders',
  //   icon: '🛒'
  // },
  {
    title: 'Customers',
    href: '/dashboard/customers',
    icon: '👥'
  },
  // {
  //   title: 'Suppliers',
  //   href: '/dashboard/suppliers',
  //   icon: '🏪'
  // },
  // {
  //   title: 'Categories',
  //   href: '/dashboard/categories',
  //   icon: '🏷️'
  // },
  // {
  //   title: 'Warehouses',
  //   href: '/dashboard/warehouses',
  //   icon: '🏭'
  // },
  {
    title: 'Settings',
    href: '/settings',
    icon: '⚙️'
  }
]

const SideBar = () => {
  const{data: session, status} = useSession();
  const userLoading = async()=>{
    if(status == 'loading')
  {
    return(
      <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
    )
  }
  }
  
  
  const path = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-black/80 backdrop-blur-sm text-white border border-gray-700 hover:bg-black transition-all duration-200"
        aria-label="Toggle menu"
      >
        <svg 
          className={`w-6 h-6 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          {isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <nav className={clsx(
        "fixed left-0 top-0 z-50 h-screen bg-black border-r border-gray-800 transition-all duration-300 ease-in-out",
        "lg:w-64 lg:translate-x-0", // Desktop: always visible, 64 width
        "md:w-64", // Tablet: 64 width when open
        "w-72", // Mobile: 72 width when open
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0" // Show/hide on mobile
      )}>
        <aside className='flex flex-col h-full p-4 lg:p-6'>
          {/* Logo Section */}
          <div id="logo" className='mb-8 lg:mb-10'>
            <Image 
              src="/logo.svg" 
              alt="logo" 
              width={120} 
              height={40} 
              priority
              className='w-auto h-8 lg:h-10 brightness-0 invert'
            />
          </div>
          
          {/* Navigation Items */}
          <ul className='flex flex-col space-y-1 lg:space-y-2 flex-1'>
            {sideBarItems.map((item, index) => {
              const isActive = path === item.href
              
              return (
                <li key={index}>
                  <Link 
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)} // Close mobile menu on navigation
                    className={clsx(
                      "flex items-center gap-3 px-3 py-2.5 lg:px-4 lg:py-3 rounded-xl transition-all duration-300 ease-in-out group relative overflow-hidden",
                      isActive 
                        ? "text-white shadow-lg backdrop-blur-md bg-white/10 border border-white/20" 
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {/* Glassmorphism effect for active item */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-xl" />
                    )}
                    
                    {/* Icon */}
                    <span className="text-base lg:text-lg relative z-10 flex-shrink-0">{item.icon}</span>
                    
                    {/* Title */}
                    <span className="font-medium relative z-10 group-hover:translate-x-1 transition-transform duration-200 text-sm lg:text-base">
                      {item.title}
                    </span>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 lg:h-8 bg-white rounded-l-full" />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
          
   {/* Footer/User section */}
<div className="mt-4 flex items-center gap-3">
  {status === "loading" ? (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ) : (
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
      {session?.user?.image ? (
        <Image
          src={session.user.image}
          alt={session.user.name || "User"}
          width={48}
          height={48}
          className="rounded-full"
        />
      ) : (
        <span>{session?.user?.name?.charAt(0) || "U"}</span>
      )}
    </div>
  )}

    <div className="flex flex-col">
      <span className="font-medium text-white text-sm">
        {session?.user?.name || userLoading()}
      </span>
      <span className="text-gray-400 text-xs">
        {session?.user?.email || ""}
      </span>
    </div>
</div>

<Button
  className="text-red-600 cursor-pointer hover:bg-red-500 hover:text-red-100 transform ease-in border-red px-6 py-2 flex items-center justify-center w-full bg-red-300 mt-4"
  onClick={() => signOut()}
>
  <span className="font-semibold text-md text-center">Logout</span> <LogOut />
</Button>

        </aside>
      </nav>

      {/* Spacer for desktop layout */}
      <div className="hidden lg:block lg:w-64 flex-shrink-0" />
    </>
  )
}

export default SideBar