


import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency, formatDate } from '../../utils/helpers';

const RevenueChart = ({ data, loading }) => {
  // ✅ Dummy revenue data (used when no real data is passed)
  const dummyRevenue = [
    { date: "2025-09-01", revenue: 1200 },
    { date: "2025-09-02", revenue: 1800 },
    { date: "2025-09-03", revenue: 950 },
    { date: "2025-09-04", revenue: 2200 },
    { date: "2025-09-05", revenue: 1500 },
    { date: "2025-09-06", revenue: 2750 },
    { date: "2025-09-07", revenue: 1900 },
    { date: "2025-09-08", revenue: 2500 },
    { date: "2025-09-09", revenue: 1300 },
    { date: "2025-09-10", revenue: 2000 },
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

  // ✅ Use provided data if available, otherwise fallback to dummyRevenue
  const chartData = (data && data.length > 0 ? data : dummyRevenue).map(item => ({
    ...item,
    date: formatDate(item.date, { month: 'short', day: 'numeric' })
  }));

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Revenue Over Time</h3>
      </div>
      <div className="card-content">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
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
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ color: '#374151', fontWeight: 500 }}
                formatter={(value) => [formatCurrency(value), 'Revenue']}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {chartData.length === 0 && (
          <div className="flex items-center justify-center h-80 text-gray-500">
            <div className="text-center">
              <p className="text-lg font-medium">No revenue data available</p>
              <p className="text-sm">Revenue will appear here once you start making sales</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;
