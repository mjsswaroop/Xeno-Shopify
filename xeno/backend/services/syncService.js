const cron = require('node-cron');
const { Tenant } = require('../models');
const { shopifyService } = require('./shopifyService');

const syncTenantData = async (tenantId) => {
  try {
    console.log(`Starting scheduled sync for tenant: ${tenantId}`);
    await shopifyService.syncAllData(tenantId);
    console.log(`Scheduled sync completed for tenant: ${tenantId}`);
  } catch (error) {
    console.error(`Scheduled sync failed for tenant ${tenantId}:`, error.message);
  }
};

const syncAllActiveTenants = async () => {
  try {
    const activeTenants = await Tenant.findAll({
      where: { 
        isActive: true,
        shopifyAccessToken: { [require('sequelize').Op.not]: null }
      },
      attributes: ['id', 'name', 'shopifyStoreName']
    });

    console.log(`Found ${activeTenants.length} active tenants for sync`);

    // Sync tenants in parallel (but limit concurrency)
    const concurrencyLimit = 3;
    for (let i = 0; i < activeTenants.length; i += concurrencyLimit) {
      const batch = activeTenants.slice(i, i + concurrencyLimit);
      await Promise.all(
        batch.map(tenant => syncTenantData(tenant.id))
      );
    }
  } catch (error) {
    console.error('Error during scheduled sync of all tenants:', error.message);
  }
};

const startSyncScheduler = () => {
  // Sync every 4 hours
  cron.schedule('0 */4 * * *', () => {
    console.log('Starting scheduled sync for all tenants...');
    syncAllActiveTenants();
  });

  // Daily cleanup and maintenance
  cron.schedule('0 2 * * *', () => {
    console.log('Running daily maintenance tasks...');
    // Add any maintenance tasks here
  });

  console.log('Sync scheduler started');
};

module.exports = {
  syncTenantData,
  syncAllActiveTenants,
  startSyncScheduler
};