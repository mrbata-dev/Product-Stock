"use client"
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Search, Users, Mail, UserCheck, Filter } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: "ADMIN" | "USER" | "MANAGER" | "STAFF";
  isActive: boolean;
  createdAt: Date;
}

const Customers = () => {
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/customer");
        if (!res.ok) throw new Error("Failed to fetch customers");
        const data = await res.json();
        setCustomers(data);
      } catch (error) {
        toast.error("Failed to load customers");
        console.warn(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Filter customers based on search term and role
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || customer.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Get unique roles for filter dropdown
  const uniqueRoles = [...new Set(customers.map(c => c.role))];

  const getRoleColor = (role: string) => {
    const colors = {
      ADMIN: "bg-red-600 text-white border-red-200",
      USER: "bg-blue-500 text-white border-blue-200",
      MANAGER: "bg-green-600 text-white border-green-200",
      STAFF: "bg-blue-100 text-blue-800 border-blue-200",
    };
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getAvatarColor = (role: string) => {
    const colors = {
      ADMIN: "bg-gradient-to-br from-red-500 to-red-700",
      USER: "bg-gradient-to-br from-blue-500 to-blue-700",
      MANAGER: "bg-gradient-to-br from-green-500 to-green-700",
      STAFF: "bg-gradient-to-br from-blue-400 to-blue-600",
    };
    return colors[role as keyof typeof colors] || "bg-gradient-to-br from-gray-500 to-gray-700";
  };

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-gradient-to-r from-blue-200 to-green-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-blue-100 shadow-sm p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-200 to-green-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gradient-to-r from-blue-200 to-green-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gradient-to-r from-green-200 to-blue-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3  rounded-xl shadow-lg">
              <Users className="w-6 h-6 " />
            </div>
            <div>
              <h1 className="text-3xl font-bold ">
                Customers
              </h1>
              <p className="text-gray-600">Manage your customer relationships</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-500 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-900">Total Customers</p>
                <p className="text-3xl font-bold text-white">{customers.length}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl border border-blue-200 p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">Active Filters</p>
                <p className="text-3xl font-bold text-white">{filteredCustomers.length}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-lg">
                <Filter className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-400 to-red-500 rounded-xl border border-red-200 p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-900">Unique Roles</p>
                <p className="text-3xl font-bold text-white">{uniqueRoles.length}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-lg">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
            <input
              type="text"
              placeholder="Search customers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all duration-200 font-medium"
          >
            <option value="all">All Roles</option>
            {uniqueRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Customers List */}
      {filteredCustomers.length === 0 ? (
        <div className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg">
          <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <Users className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {searchTerm || roleFilter !== "all" ? "No customers found" : "No customers yet"}
          </h3>
          <p className="text-gray-600">
            {searchTerm || roleFilter !== "all" 
              ? "Try adjusting your search or filter criteria" 
              : "Get started by adding your first customer"}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 p-6 hover:border-blue-300 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Avatar */}
                  <div className={`w-14 h-14 ${getAvatarColor(customer.role)} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                    {getInitials(customer.name)}
                  </div>
                  
                  {/* Customer Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
                      {customer.name || 'Unknown Name'}
                    </h3>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <div className="p-1 bg-blue-100 rounded-full">
                          <Mail className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium">{customer.email}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getRoleColor(customer.role)} shadow-sm`}>
                        {customer.role}
                      </span>
                      {customer.isActive && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium border border-green-200">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Customers;