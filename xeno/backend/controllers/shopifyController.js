const { shopifyService } = require('../services/shopifyService');
const { Tenant } = require('../models');

const connectStore = async (req, res) => {
  try {
    const { shopifyStoreName, accessToken } = req.body;
    const tenantId = req.tenantId;

    if (!shopifyStoreName || !accessToken) {
      return res.status(400).json({ 
        error: 'Shopify store name and access token are required.' 
      });
    }

    // Update tenant with Shopify credentials
    const tenant = await Tenant.findByPk(tenantId);
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found.' });
    }

    await tenant.update({
      shopifyStoreName,
      shopifyAccessToken: accessToken
    });

    // Test connection and sync data
    try {
      await shopifyService.syncAllData(tenantId);
      
      res.json({ 
        message: 'Shopify store connected successfully and data sync initiated.',
        tenant: {
          id: tenant.id,
          name: tenant.name,
          shopifyStoreName: tenant.shopifyStoreName,
          isActive: tenant.isActive
        }
      });
    } catch (syncError) {
      console.error('Initial sync error:', syncError);
      res.json({ 
        message: 'Shopify store connected but initial sync failed. Data will be synced automatically.',
        warning: 'Please check your Shopify access token permissions.',
        tenant: {
          id: tenant.id,
          name: tenant.name,
          shopifyStoreName: tenant.shopifyStoreName,
          isActive: tenant.isActive
        }
      });
    }
  } catch (error) {
    console.error('Connect store error:', error);
    res.status(500).json({ error: 'Failed to connect Shopify store.' });
  }
};

const syncData = async (req, res) => {
  try {
    const tenantId = req.tenantId;
    
    const tenant = await Tenant.findByPk(tenantId);
    if (!tenant || !tenant.shopifyAccessToken) {
      return res.status(400).json({ error: 'Shopify store not connected.' });
    }

    await shopifyService.syncAllData(tenantId);
    
    res.json({ message: 'Data synchronization completed successfully.' });
  } catch (error) {
    console.error('Sync data error:', error);
    res.status(500).json({ error: 'Data synchronization failed.' });
  }
};

const handleWebhook = async (req, res) => {
  try {
    const signature = req.get('X-Shopify-Hmac-Sha256');
    const body = req.body;
    const topic = req.get('X-Shopify-Topic');
    const shopDomain = req.get('X-Shopify-Shop-Domain');

    // Find tenant by shop domain
    const tenant = await Tenant.findOne({ 
      where: { shopifyStoreName: shopDomain.replace('.myshopify.com', '') }
    });

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found.' });
    }

    // Verify webhook signature (implement based on your webhook secret)
    // This is a simplified version - implement proper verification in production

    await shopifyService.handleWebhookData(tenant.id, topic, body);
    
    res.status(200).json({ message: 'Webhook processed successfully.' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed.' });
  }
};

const getConnectionStatus = async (req, res) => {
  try {
    const tenant = await Tenant.findByPk(req.tenantId);
    
    res.json({
      isConnected: !!tenant.shopifyAccessToken,
      storeName: tenant.shopifyStoreName,
      lastSyncAt: tenant.lastSyncAt,
      isActive: tenant.isActive
    });
  } catch (error) {
    console.error('Connection status error:', error);
    res.status(500).json({ error: 'Failed to fetch connection status.' });
  }
};

module.exports = {
  connectStore,
  syncData,
  handleWebhook,
  getConnectionStatus
};