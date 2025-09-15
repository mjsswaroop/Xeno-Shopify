const { Tenant, User, Customer, Order, Product } = require('../models');

const getTenantInfo = async (req, res) => {
  try {
    const tenant = await Tenant.findByPk(req.tenantId, {
      include: [
        {
          model: User,
          attributes: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive']
        }
      ]
    });

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found.' });
    }

    res.json({
      tenant: {
        id: tenant.id,
        name: tenant.name,
        shopifyStoreName: tenant.shopifyStoreName,
        isActive: tenant.isActive,
        lastSyncAt: tenant.lastSyncAt,
        settings: tenant.settings,
        users: tenant.Users
      }
    });
  } catch (error) {
    console.error('Get tenant info error:', error);
    res.status(500).json({ error: 'Failed to fetch tenant information.' });
  }
};

const updateTenantSettings = async (req, res) => {
  try {
    const { name, settings } = req.body;
    const tenant = await Tenant.findByPk(req.tenantId);

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found.' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (settings) updateData.settings = { ...tenant.settings, ...settings };

    await tenant.update(updateData);

    res.json({
      message: 'Tenant settings updated successfully.',
      tenant: {
        id: tenant.id,
        name: tenant.name,
        shopifyStoreName: tenant.shopifyStoreName,
        isActive: tenant.isActive,
        settings: tenant.settings
      }
    });
  } catch (error) {
    console.error('Update tenant settings error:', error);
    res.status(500).json({ error: 'Failed to update tenant settings.' });
  }
};

const getTenantStats = async (req, res) => {
  try {
    const tenantId = req.tenantId;

    const stats = await Promise.all([
      Customer.count({ where: { tenantId } }),
      Order.count({ where: { tenantId } }),
      Product.count({ where: { tenantId } }),
      User.count({ where: { tenantId } })
    ]);

    res.json({
      stats: {
        totalCustomers: stats[0],
        totalOrders: stats[1],
        totalProducts: stats[2],
        totalUsers: stats[3]
      }
    });
  } catch (error) {
    console.error('Get tenant stats error:', error);
    res.status(500).json({ error: 'Failed to fetch tenant statistics.' });
  }
};

module.exports = {
  getTenantInfo,
  updateTenantSettings,
  getTenantStats
};