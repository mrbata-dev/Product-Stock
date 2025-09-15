import NotificationPanel from '@/components/HomePages/notificationPanle'
import { WelcomeMsg } from '@/components/ui/custom/Greeting'
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
        <div className="space-y-6 sm:space-y-8">
          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 dark:border-slate-700/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Total Tasks</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900">24</p>
                </div>
                <div className="p-2 sm:p-3 bg-blue-500 rounded-lg sm:rounded-xl">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 dark:border-slate-700/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Completed</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900">18</p>
                </div>
                <div className="p-2 sm:p-3 bg-green-500 rounded-lg sm:rounded-xl">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 dark:border-slate-700/20 hover:shadow-xl transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">In Progress</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900">6</p>
                </div>
                <div className="p-2 sm:p-3 bg-orange-500 rounded-lg sm:rounded-xl">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
            {/* Main Content Area */}
            <div className="xl:col-span-2 space-y-6">
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

              {/* Recent Activity */}
              <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-sm sm:text-base text-slate-700 dark:text-slate-300 flex-1 min-w-0">
                      Task &quot;Project Review&quot; completed
                    </span>
                    <span className="ml-2 text-xs text-slate-500 flex-shrink-0 hidden sm:inline">2 hours ago</span>
                  </div>
                  <div className="flex items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-sm sm:text-base text-slate-700 dark:text-slate-300 flex-1 min-w-0">
                      New message received
                    </span>
                    <span className="ml-2 text-xs text-slate-500 flex-shrink-0 hidden sm:inline">4 hours ago</span>
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
        </div>
      </main>
    </div>
  )
}

export default Dashboard