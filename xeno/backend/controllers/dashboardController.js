const { Customer, Order, Product, Tenant } = require('../models');
const { Op } = require('sequelize');
const db = require('../models');

const getDashboardMetrics = async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        shopifyCreatedAt: {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        }
      };
    }

    // Get basic counts
    const [totalCustomers, totalProducts, totalOrders] = await Promise.all([
      Customer.count({ where: { tenantId } }),
      Product.count({ where: { tenantId } }),
      Order.count({ where: { tenantId, ...dateFilter } })
    ]);

    // Get revenue metrics
    const revenueResult = await Order.findOne({
      where: { tenantId, ...dateFilter },
      attributes: [
        [db.sequelize.fn('SUM', db.sequelize.col('totalPrice')), 'totalRevenue'],
        [db.sequelize.fn('AVG', db.sequelize.col('totalPrice')), 'avgOrderValue']
      ]
    });

    const totalRevenue = parseFloat(revenueResult?.dataValues?.totalRevenue || 0);
    const avgOrderValue = parseFloat(revenueResult?.dataValues?.avgOrderValue || 0);

    // Get orders by date for chart
    const ordersChart = await Order.findAll({
      where: { tenantId, ...dateFilter },
      attributes: [
        [db.sequelize.fn('DATE', db.sequelize.col('shopifyCreatedAt')), 'date'],
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'orders'],
        [db.sequelize.fn('SUM', db.sequelize.col('totalPrice')), 'revenue']
      ],
      group: [db.sequelize.fn('DATE', db.sequelize.col('shopifyCreatedAt'))],
      order: [[db.sequelize.fn('DATE', db.sequelize.col('shopifyCreatedAt')), 'ASC']]
    });

    // Get top customers
    const topCustomers = await Customer.findAll({
      where: { tenantId },
      attributes: ['id', 'firstName', 'lastName', 'email', 'totalSpent', 'ordersCount'],
      order: [['totalSpent', 'DESC']],
      limit: 5
    });

    res.json({
      metrics: {
        totalCustomers,
        totalProducts,
        totalOrders,
        totalRevenue,
        avgOrderValue
      },
      charts: {
        ordersChart: ordersChart.map(item => ({
          date: item.dataValues.date,
          orders: parseInt(item.dataValues.orders),
          revenue: parseFloat(item.dataValues.revenue || 0)
        })),
        topCustomers: topCustomers.map(customer => ({
          id: customer.id,
          name: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || customer.email,
          email: customer.email,
          totalSpent: parseFloat(customer.totalSpent),
          ordersCount: customer.ordersCount
        }))
      }
    });
  } catch (error) {
    console.error('Dashboard metrics error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard metrics.' });
  }
};

const getRevenueAnalytics = async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const { period = '30d' } = req.query;
    
    let startDate;
    switch (period) {
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    const analytics = await Order.findAll({
      where: { 
        tenantId,
        shopifyCreatedAt: { [Op.gte]: startDate }
      },
      attributes: [
        [db.sequelize.fn('DATE', db.sequelize.col('shopifyCreatedAt')), 'date'],
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'orderCount'],
        [db.sequelize.fn('SUM', db.sequelize.col('totalPrice')), 'revenue'],
        [db.sequelize.fn('AVG', db.sequelize.col('totalPrice')), 'avgOrderValue']
      ],
      group: [db.sequelize.fn('DATE', db.sequelize.col('shopifyCreatedAt'))],
      order: [[db.sequelize.fn('DATE', db.sequelize.col('shopifyCreatedAt')), 'ASC']]
    });

    res.json({
      analytics: analytics.map(item => ({
        date: item.dataValues.date,
        orderCount: parseInt(item.dataValues.orderCount),
        revenue: parseFloat(item.dataValues.revenue || 0),
        avgOrderValue: parseFloat(item.dataValues.avgOrderValue || 0)
      }))
    });
  } catch (error) {
    console.error('Revenue analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch revenue analytics.' });
  }
};

module.exports = {
  getDashboardMetrics,
  getRevenueAnalytics
};