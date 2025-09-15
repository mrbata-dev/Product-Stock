"use client";

import React, { useEffect, useState } from 'react';
import { Package, AlertTriangle } from 'lucide-react';

interface ProductStatsData {
  totalProducts: number;
  // totalOrders: number;
  lowStockItems: number;
  // totalRevenue: number;
}

const ProductStats: React.FC = () => {
  const [stats, setStats] = useState<ProductStatsData>({
    totalProducts: 0,
    // totalOrders: 0,
    lowStockItems: 0,
    // totalRevenue: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all stats in parallel
        const [productsRes,  lowStockRes] = await Promise.all([
          fetch('/api/products/stats/total'),
          // fetch('/api/orders/stats/total'),
          fetch('/api/products/stats/low-stock'),
          // fetch('/api/orders/stats/revenue')
        ]);

        const [productsData,  lowStockData] = await Promise.all([
          productsRes.ok ? productsRes.json() : { count: 0 },
          // ordersRes.ok ? ordersRes.json() : { count: 0 },
          lowStockRes.ok ? lowStockRes.json() : { count: 0 },
          // revenueRes.ok ? revenueRes.json() : { total: 0 }
        ]);

        setStats({
          totalProducts: productsData.count || 0,
          // totalOrders: ordersData.count || 0,
          lowStockItems: lowStockData.count || 0,
          // totalRevenue: revenueData.total || 0
        });
      } catch (error) {
        console.error('Error fetching product stats:', error);
        // Keep default values on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // const formatCurrency = (amount: number): string => {
  //   return new Intl.NumberFormat('en-US', {
  //     style: 'currency',
  //     currency: 'USD',
  //     minimumFractionDigits: 0,
  //     maximumFractionDigits: 0,
  //   }).format(amount);
  // };

  const statsConfig = [
    {
      title: 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    // {
    //   title: 'Total Orders',
    //   value: stats.totalOrders.toLocaleString(),
    //   icon: ShoppingBag,
    //   bgColor: 'bg-green-500',
    //   textColor: 'text-green-600'
    // },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems.toLocaleString(),
      icon: AlertTriangle,
      bgColor: 'bg-orange-500',
      textColor: 'text-orange-600'
    },
    // {
    //   title: 'Total Revenue',
    //   value: formatCurrency(stats.totalRevenue),
    //   icon: TrendingUp,
    //   bgColor: 'bg-purple-500',
    //   textColor: 'text-purple-600'
    // }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20">
            <div className="animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2  gap-4 sm:gap-6 w-full">
      {statsConfig.map((stat, index) => {
        const IconComponent = stat.icon;
        
        return (
          <div
            key={index}
            className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 x` hover:shadow-xl transition-all duration-300 group "
          >
            <div className="flex items-center justify-between ">
              <div className="flex-1 ">
                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl sm:text-3xl font-bold  group-hover:scale-105 transition-transform duration-200">
                  {stat.value}
                </p>
              </div>
              <div className={`p-2 sm:p-3 ${stat.bgColor} rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform duration-200`}>
                <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            
            {/* Optional: Add trend indicator */}
            <div className="mt-3 pt-3 border-t border-slate-200/50">
              <div className="flex items-center text-xs text-slate-500">
                <div className={`w-2 h-2 rounded-full ${stat.bgColor} mr-2`}></div>
                <span>Updated now</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductStats;