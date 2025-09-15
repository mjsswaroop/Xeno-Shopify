

import React from 'react';
import { User, Mail, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const TopCustomers = ({ data, loading }) => {
  // ✅ Dummy customers (used when no real data is passed)
  const dummyCustomers = [
    { id: 1, name: "Manoj", email: "alice@example.com", ordersCount: 12, totalSpent: 3200 },
    { id: 2, name: "Nikhil", email: "bob@example.com", ordersCount: 9, totalSpent: 2500 },
    { id: 3, name: "Nihal", email: "charlie@example.com", ordersCount: 7, totalSpent: 1800 },
    { id: 4, name: "Vysh", email: "diana@example.com", ordersCount: 6, totalSpent: 1500 },
    { id: 5, name: "Nandy", email: "ethan@example.com", ordersCount: 5, totalSpent: 1200 },
  ];

  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="card-header">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="card-content space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ✅ Use provided data if available, otherwise fall back to dummyCustomers
  const customersData = (data && data.length > 0 ? data : dummyCustomers);

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Top Customers</h3>
      </div>
      <div className="card-content">
        {customersData && customersData.length > 0 ? (
          <div className="space-y-4">
            {customersData.map((customer, index) => (
              <div key={customer.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      #{index + 1}
                    </span>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {customer.name || 'Anonymous Customer'}
                    </p>
                  </div>
                  
                  <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                    {customer.email && (
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <ShoppingBag className="h-3 w-3" />
                      <span>{customer.ordersCount} orders</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(customer.totalSpent)}
                  </p>
                  <p className="text-xs text-gray-500">spent</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No customers yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Customer data will appear here once you start receiving orders.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopCustomers;
