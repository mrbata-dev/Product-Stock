import NotificationPanel from '@/components/HomePages/notificationPanle'
import { WelcomeMsg } from '@/components/ui/custom/Greeting'
import ProductStats from '@/components/ui/custom/products/ProductStats'
import RecentAddedProduct from '@/components/ui/custom/products/RecentAddedProduct'

import React, { Suspense } from 'react'

const Dashboard = () => {
  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <Suspense fallback={<div className="animate-pulse bg-gray-200 h-8 rounded"></div>}>
            <div className="text-left space-y-4">
              <WelcomeMsg />
            </div>
          </Suspense>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 lg:pb-12">
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 '>
          <div className="space-y-6 sm:space-y-8  ">
            {/* Product Stats Component */}
           <div className="">
              <Suspense fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20">
                      <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              }>
                <ProductStats />
              </Suspense>
              <div className="xl:col-span-2 space-y-6 mt-4">
                  {/* Notifications Panel */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/20">
                    <div className="p-4 sm:p-6 border-b border-slate-200">
                      <h2 className="text-lg sm:text-xl font-semibold text-slate-900 flex items-center">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-12h2v12z" />
                        </svg>
                        Notifications
                      </h2>
                    </div>
                    <Suspense fallback={
                      <div className="p-4 sm:p-6">
                        <div className="animate-pulse space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    }>
                      <div className="p-4 sm:p-6">
                        <NotificationPanel />
                      </div>
                    </Suspense>
                  </div>
                </div>
           </div>
  
            
          </div>
  
          {/* Sidebar */}
              <div className="space-y-6">
                {/* Recent added products */}
                <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 dark:border-slate-700/20">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Recent added products</h3>
                  <div className="space-y-4">
                    <Suspense fallback={
                      <div className="animate-pulse space-y-3">
                        <div className="h-12 bg-gray-200 rounded"></div>
                        <div className="h-12 bg-gray-200 rounded"></div>
                        <div className="h-12 bg-gray-200 rounded"></div>
                      </div>
                    }>
                      <RecentAddedProduct/>
                    </Suspense>
                  </div>
                </div>
              </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard