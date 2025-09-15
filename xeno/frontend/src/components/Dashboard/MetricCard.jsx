import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendLabel, 
  color = 'blue',
  loading = false 
}) => {
  const colorClasses = {
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600'
  };

  const trendColorClasses = trend >= 0 
    ? 'text-green-600 bg-green-50' 
    : 'text-red-600 bg-red-50';

  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="card-content">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
          </div>
          <div className="mt-4">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-content">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        
        {trend !== undefined && (
          <div className="mt-4 flex items-center">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${trendColorClasses}`}>
              {trend >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {Math.abs(trend)}%
            </span>
            {trendLabel && (
              <span className="ml-2 text-sm text-gray-500">{trendLabel}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;