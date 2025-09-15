// // import React, { useState } from 'react';
// import { useApi } from '../../hookes/useApi';
// import MetricCard from './MetricCard';
// import OrdersChart from './OrdersChart';
// import RevenueChart from './RevenueChart';
// import TopCustomers from './TopCustomers';
// import { Calendar, TrendingUp, Users, ShoppingCart, DollarSign, RefreshCw } from 'lucide-react';
// import { formatCurrency, formatNumber, getDateRange } from '../../utils/helpers';
// import toast from 'react-hot-toast';


// import React, { useState, useEffect } from 'react';

// const Dashboard = () => {
//   const [dateRange, setDateRange] = useState('30d');

//   // Instead of useApi (which probably checks token)
//   const metrics = {
//     metrics: {
//       totalRevenue: 12000,
//       totalOrders: 350,
//       totalCustomers: 120,
//       avgOrderValue: 45,
//     },
//     charts: {
//       ordersChart: [],
//       topCustomers: []
//     }
//   };

//   const analytics = {
//     analytics: []
//   };

//   const handleLogout = () => {
//     // Clear any stored authentication data
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     sessionStorage.clear();
    
//     // Navigate to login page
//     window.location.href = '/login';
//     // Or if using React Router: navigate('/login');
//   };

//   const handleDateRangeChange = (newRange) => {
//     setDateRange(newRange);
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
//         <button onClick={handleLogout} className="btn-outline text-red-600 border-red-600 hover:bg-red-50">
//           Logout
//         </button>
//       </div>

//       {/* Metric Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <MetricCard
//           title="Total Revenue"
//           value={formatCurrency(metrics.metrics.totalRevenue)}
//           icon={DollarSign}
//           trend={12.5}
//           trendLabel="vs last period"
//           color="green"
//         />
//         <MetricCard
//           title="Total Orders"
//           value={formatNumber(metrics.metrics.totalOrders)}
//           icon={ShoppingCart}
//           trend={8.2}
//           trendLabel="vs last period"
//           color="blue"
//         />
//         <MetricCard
//           title="Total Customers"
//           value={formatNumber(metrics.metrics.totalCustomers)}
//           icon={Users}
//           trend={5.1}
//           trendLabel="vs last period"
//           color="purple"
//         />
//         <MetricCard
//           title="Avg Order Value"
//           value={formatCurrency(metrics.metrics.avgOrderValue)}
//           icon={TrendingUp}
//           trend={-2.4}
//           trendLabel="vs last period"
//           color="orange"
//         />
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <OrdersChart data={metrics.charts.ordersChart} loading={false} />
//         <RevenueChart data={analytics.analytics} loading={false} />
//       </div>

//       {/* Top Customers */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2">
//           <TopCustomers data={metrics.charts.topCustomers} loading={false} />
//         </div>
//         <div className="card">
//           <div className="card-header">
//             <h3 className="card-title">Quick Actions</h3>
//           </div>
//           <div className="card-content space-y-3">
//             <button className="btn-primary w-full">Sync Shopify Data</button>
//             <button className="btn-outline w-full">Export Analytics</button>
//             <button className="btn-outline w-full">View Reports</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;



import React, { useState, useEffect } from 'react';
// import { useApi } from '../../hookes/useApi';
import MetricCard from './MetricCard';
import OrdersChart from './OrdersChart';
import RevenueChart from './RevenueChart';
import TopCustomers from './TopCustomers';
import { Calendar, TrendingUp, Users, ShoppingCart, DollarSign, RefreshCw, Download, FileText, Loader } from 'lucide-react';
// import { formatCurrency, formatNumber, getDateRange } from '../../utils/helpers';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [isLoading, setIsLoading] = useState({
    sync: false,
    export: false,
    reports: false
  });

  // Mock data - replace with actual API calls
  const [metrics, setMetrics] = useState({
    metrics: {
      totalRevenue: 12000,
      totalOrders: 350,
      totalCustomers: 120,
      avgOrderValue: 45,
    },
    charts: {
      ordersChart: [],
      topCustomers: []
    }
  });

  const analytics = {
    analytics: []
  };

  // Mock helper functions - replace with your actual imports
  const formatCurrency = (amount) => `$${amount.toLocaleString()}`;
  const formatNumber = (num) => num.toLocaleString();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    window.location.href = '/login';
  };

  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
  };

  // 1. Sync Shopify Data functionality
  const handleSyncShopifyData = async () => {
    setIsLoading(prev => ({ ...prev, sync: true }));
    
    try {
      toast.loading('Syncing Shopify data...', { id: 'sync-toast' });
      
      // Mock API call - replace with actual Shopify sync endpoint
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      // Mock data update - replace with actual API response
      setMetrics(prev => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          totalRevenue: prev.metrics.totalRevenue + Math.floor(Math.random() * 1000),
          totalOrders: prev.metrics.totalOrders + Math.floor(Math.random() * 10),
        }
      }));
      
      /* 
      Real implementation would be:
      const response = await fetch('/api/sync-shopify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Sync failed');
      
      const updatedData = await response.json();
      setMetrics(updatedData);
      */
      
      toast.success('Shopify data synced successfully!', { id: 'sync-toast' });
      
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Failed to sync Shopify data. Please try again.', { id: 'sync-toast' });
    } finally {
      setIsLoading(prev => ({ ...prev, sync: false }));
    }
  };

  // 2. Export Analytics functionality
  const handleExportAnalytics = async () => {
    setIsLoading(prev => ({ ...prev, export: true }));
    
    try {
      toast.loading('Preparing analytics export...', { id: 'export-toast' });
      
      // Mock export data preparation
      const exportData = {
        dateRange,
        metrics: metrics.metrics,
        exportDate: new Date().toISOString(),
        charts: metrics.charts
      };
      
      // Method 1: Download as JSON
      const downloadJSON = () => {
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `analytics-export-${dateRange}-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
      };

      // Method 2: Download as CSV
      const downloadCSV = () => {
        const csvContent = [
          ['Metric', 'Value', 'Date Range'],
          ['Total Revenue', exportData.metrics.totalRevenue, dateRange],
          ['Total Orders', exportData.metrics.totalOrders, dateRange],
          ['Total Customers', exportData.metrics.totalCustomers, dateRange],
          ['Average Order Value', exportData.metrics.avgOrderValue, dateRange]
        ].map(row => row.join(',')).join('\n');
        
        const dataBlob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `analytics-export-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
      };

      // For demo, we'll download CSV
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing
      downloadCSV();
      
      /* 
      Real implementation might be:
      const response = await fetch(`/api/export-analytics?dateRange=${dateRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics-${dateRange}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
      */
      
      toast.success('Analytics exported successfully!', { id: 'export-toast' });
      
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export analytics. Please try again.', { id: 'export-toast' });
    } finally {
      setIsLoading(prev => ({ ...prev, export: false }));
    }
  };

  // 3. View Reports functionality
  const handleViewReports = async () => {
    setIsLoading(prev => ({ ...prev, reports: true }));
    
    try {
      toast.loading('Loading reports...', { id: 'reports-toast' });
      
      // Simulate loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Option 1: Navigate to reports page
      // window.location.href = '/reports';
      // Or with React Router: navigate('/reports');
      
      // Option 2: Open reports in new tab
      // window.open('/reports', '_blank');
      
      // Option 3: Show modal with reports (for demo)
      const showReportsModal = () => {
        const modalHtml = `
          <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 2rem; border-radius: 8px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
              <h2 style="margin-top: 0;">Analytics Reports</h2>
              <div style="margin: 1rem 0;">
                <h3>Sales Report (${dateRange})</h3>
                <p>Total Revenue: ${formatCurrency(metrics.metrics.totalRevenue)}</p>
                <p>Total Orders: ${formatNumber(metrics.metrics.totalOrders)}</p>
                <p>Conversion Rate: 3.2%</p>
                <p>Growth Rate: +12.5%</p>
              </div>
              <div style="margin: 1rem 0;">
                <h3>Customer Analysis</h3>
                <p>Total Customers: ${formatNumber(metrics.metrics.totalCustomers)}</p>
                <p>New Customers: 45</p>
                <p>Returning Customers: 75</p>
                <p>Customer Lifetime Value: $285</p>
              </div>
              <button onclick="this.parentElement.parentElement.remove()" style="background: #3b82f6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Close</button>
            </div>
          </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
      };
      
      showReportsModal();
      
      /* 
      Real implementation might be:
      const response = await fetch(`/api/reports?dateRange=${dateRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to load reports');
      
      // Navigate to reports page with data
      navigate('/reports', { state: { data: await response.json(), dateRange } });
      */
      
      toast.success('Reports loaded successfully!', { id: 'reports-toast' });
      
    } catch (error) {
      console.error('Reports error:', error);
      toast.error('Failed to load reports. Please try again.', { id: 'reports-toast' });
    } finally {
      setIsLoading(prev => ({ ...prev, reports: false }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <button onClick={handleLogout} className="btn-outline text-red-600 border-red-600 hover:bg-red-50">
          Logout
        </button>
      </div>

      {/* Date Range Selector */}
      <div className="flex gap-2 mb-4">
        {['7d', '30d', '90d', '1y'].map((range) => (
          <button
            key={range}
            onClick={() => handleDateRangeChange(range)}
            className={`px-3 py-1 rounded text-sm ${
              dateRange === range 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
          </button>
        ))}
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(metrics.metrics.totalRevenue)}
          icon={DollarSign}
          trend={12.5}
          trendLabel="vs last period"
          color="green"
        />
        <MetricCard
          title="Total Orders"
          value={formatNumber(metrics.metrics.totalOrders)}
          icon={ShoppingCart}
          trend={8.2}
          trendLabel="vs last period"
          color="blue"
        />
        <MetricCard
          title="Total Customers"
          value={formatNumber(metrics.metrics.totalCustomers)}
          icon={Users}
          trend={5.1}
          trendLabel="vs last period"
          color="purple"
        />
        <MetricCard
          title="Avg Order Value"
          value={formatCurrency(metrics.metrics.avgOrderValue)}
          icon={TrendingUp}
          trend={-2.4}
          trendLabel="vs last period"
          color="orange"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrdersChart data={metrics.charts.ordersChart} loading={false} />
        <RevenueChart data={analytics.analytics} loading={false} />
      </div>

      {/* Top Customers and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TopCustomers data={metrics.charts.topCustomers} loading={false} />
        </div>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="card-content space-y-3">
            {/* Sync Shopify Data Button */}
            <button 
              onClick={handleSyncShopifyData}
              disabled={isLoading.sync}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading.sync ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Sync Shopify Data
                </>
              )}
            </button>
            
            {/* Export Analytics Button */}
            <button 
              onClick={handleExportAnalytics}
              disabled={isLoading.export}
              className="btn-outline w-full flex items-center justify-center gap-2"
            >
              {isLoading.export ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Export Analytics
                </>
              )}
            </button>
            
            {/* View Reports Button */}
            <button 
              onClick={handleViewReports}
              disabled={isLoading.reports}
              className="btn-outline w-full flex items-center justify-center gap-2"
            >
              {isLoading.reports ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  View Reports
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;