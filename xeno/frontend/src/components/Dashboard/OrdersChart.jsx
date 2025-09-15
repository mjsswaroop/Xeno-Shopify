


import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { formatDate } from '../../utils/helpers';

const OrdersChart = ({ data, loading }) => {
  // ✅ Dummy orders data (used when no real data is passed)
  const dummyOrders = [
    { date: "2025-09-01", orders: 12 },
    { date: "2025-09-02", orders: 18 },
    { date: "2025-09-03", orders: 9 },
    { date: "2025-09-04", orders: 22 },
    { date: "2025-09-05", orders: 15 },
    { date: "2025-09-06", orders: 27 },
    { date: "2025-09-07", orders: 19 },
    { date: "2025-09-08", orders: 25 },
    { date: "2025-09-09", orders: 13 },
    { date: "2025-09-10", orders: 20 },
  ];

  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="card-header">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="card-content">
          <div className="h-80 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  // ✅ Use provided data if available, otherwise fall back to dummyOrders
  const chartData = (data && data.length > 0 ? data : dummyOrders).map(item => ({
    ...item,
    date: formatDate(item.date, { month: 'short', day: 'numeric' })
  }));

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Orders Over Time</h3>
      </div>
      <div className="card-content">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ color: '#374151', fontWeight: 500 }}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {chartData.length === 0 && (
          <div className="flex items-center justify-center h-80 text-gray-500">
            <div className="text-center">
              <p className="text-lg font-medium">No order data available</p>
              <p className="text-sm">Orders will appear here once you start receiving them</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersChart;
