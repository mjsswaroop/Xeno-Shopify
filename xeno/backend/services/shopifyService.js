const axios = require('axios');
const { Customer, Order, Product, Tenant } = require('../models');

class ShopifyService {
  constructor() {
    this.apiVersion = '2023-10';
  }

  async getShopifyClient(tenantId) {
    const tenant = await Tenant.findByPk(tenantId);
    if (!tenant || !tenant.shopifyAccessToken) {
      throw new Error('Shopify credentials not found for tenant');
    }

    return {
      baseURL: `https://${tenant.shopifyStoreName}.myshopify.com/admin/api/${this.apiVersion}`,
      headers: {
        'X-Shopify-Access-Token': tenant.shopifyAccessToken,
        'Content-Type': 'application/json'
      }
    };
  }

  async syncCustomers(tenantId) {
    try {
      const client = await this.getShopifyClient(tenantId);
      let hasMore = true;
      let params = { limit: 250 };

      while (hasMore) {
        const response = await axios.get(`${client.baseURL}/customers.json`, {
          headers: client.headers,
          params
        });

        const customers = response.data.customers;
        
        for (const shopifyCustomer of customers) {
          await this.upsertCustomer(tenantId, shopifyCustomer);
        }

        // Check for pagination
        const linkHeader = response.headers.link;
        if (linkHeader && linkHeader.includes('rel="next"')) {
          const nextLink = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
          if (nextLink) {
            const url = new URL(nextLink[1]);
            params = Object.fromEntries(url.searchParams);
          } else {
            hasMore = false;
          }
        } else {
          hasMore = false;
        }
      }

      console.log(`Customers sync completed for tenant: ${tenantId}`);
    } catch (error) {
      console.error('Error syncing customers:', error.message);
      throw error;
    }
  }

  async syncProducts(tenantId) {
    try {
      const client = await this.getShopifyClient(tenantId);
      let hasMore = true;
      let params = { limit: 250 };

      while (hasMore) {
        const response = await axios.get(`${client.baseURL}/products.json`, {
          headers: client.headers,
          params
        });

        const products = response.data.products;
        
        for (const shopifyProduct of products) {
          await this.upsertProduct(tenantId, shopifyProduct);
        }

        // Check for pagination
        const linkHeader = response.headers.link;
        if (linkHeader && linkHeader.includes('rel="next"')) {
          const nextLink = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
          if (nextLink) {
            const url = new URL(nextLink[1]);
            params = Object.fromEntries(url.searchParams);
          } else {
            hasMore = false;
          }
        } else {
          hasMore = false;
        }
      }

      console.log(`Products sync completed for tenant: ${tenantId}`);
    } catch (error) {
      console.error('Error syncing products:', error.message);
      throw error;
    }
  }

  async syncOrders(tenantId) {
    try {
      const client = await this.getShopifyClient(tenantId);
      let hasMore = true;
      let params = { limit: 250, status: 'any' };

      while (hasMore) {
        const response = await axios.get(`${client.baseURL}/orders.json`, {
          headers: client.headers,
          params
        });

        const orders = response.data.orders;
        
        for (const shopifyOrder of orders) {
          await this.upsertOrder(tenantId, shopifyOrder);
        }

        // Check for pagination
        const linkHeader = response.headers.link;
        if (linkHeader && linkHeader.includes('rel="next"')) {
          const nextLink = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
          if (nextLink) {
            const url = new URL(nextLink[1]);
            params = Object.fromEntries(url.searchParams);
          } else {
            hasMore = false;
          }
        } else {
          hasMore = false;
        }
      }

      console.log(`Orders sync completed for tenant: ${tenantId}`);
    } catch (error) {
      console.error('Error syncing orders:', error.message);
      throw error;
    }
  }

  async upsertCustomer(tenantId, shopifyCustomer) {
    try {
      const customerData = {
        shopifyId: shopifyCustomer.id,
        tenantId,
        email: shopifyCustomer.email,
        firstName: shopifyCustomer.first_name,
        lastName: shopifyCustomer.last_name,
        phone: shopifyCustomer.phone,
        acceptsMarketing: shopifyCustomer.accepts_marketing,
        totalSpent: parseFloat(shopifyCustomer.total_spent || 0),
        ordersCount: shopifyCustomer.orders_count || 0,
        state: shopifyCustomer.state,
        tags: shopifyCustomer.tags,
        addresses: shopifyCustomer.addresses || [],
        shopifyCreatedAt: shopifyCustomer.created_at,
        shopifyUpdatedAt: shopifyCustomer.updated_at
      };

      await Customer.upsert(customerData, {
        conflictFields: ['shopifyId', 'tenantId']
      });
    } catch (error) {
      console.error(`Error upserting customer ${shopifyCustomer.id}:`, error.message);
    }
  }

  async upsertProduct(tenantId, shopifyProduct) {
    try {
      const productData = {
        shopifyId: shopifyProduct.id,
        tenantId,
        title: shopifyProduct.title,
        description: shopifyProduct.body_html,
        vendor: shopifyProduct.vendor,
        productType: shopifyProduct.product_type,
        handle: shopifyProduct.handle,
        status: shopifyProduct.status,
        tags: shopifyProduct.tags,
        variants: shopifyProduct.variants || [],
        images: shopifyProduct.images || [],
        options: shopifyProduct.options || [],
        shopifyCreatedAt: shopifyProduct.created_at,
        shopifyUpdatedAt: shopifyProduct.updated_at
      };

      await Product.upsert(productData, {
        conflictFields: ['shopifyId', 'tenantId']
      });
    } catch (error) {
      console.error(`Error upserting product ${shopifyProduct.id}:`, error.message);
    }
  }

  async upsertOrder(tenantId, shopifyOrder) {
    try {
      // Find customer by shopify ID if exists
      let customerId = null;
      if (shopifyOrder.customer && shopifyOrder.customer.id) {
        const customer = await Customer.findOne({
          where: { 
            shopifyId: shopifyOrder.customer.id,
            tenantId 
          }
        });
        customerId = customer ? customer.id : null;
      }

      const orderData = {
        shopifyId: shopifyOrder.id,
        tenantId,
        customerId,
        orderNumber: shopifyOrder.order_number,
        email: shopifyOrder.email,
        totalPrice: parseFloat(shopifyOrder.total_price || 0),
        subtotalPrice: parseFloat(shopifyOrder.subtotal_price || 0),
        totalTax: parseFloat(shopifyOrder.total_tax || 0),
        currency: shopifyOrder.currency,
        financialStatus: shopifyOrder.financial_status,
        fulfillmentStatus: shopifyOrder.fulfillment_status,
        lineItems: shopifyOrder.line_items || [],
        shippingAddress: shopifyOrder.shipping_address,
        billingAddress: shopifyOrder.billing_address,
        discountCodes: shopifyOrder.discount_codes || [],
        tags: shopifyOrder.tags,
        shopifyCreatedAt: shopifyOrder.created_at,
        shopifyUpdatedAt: shopifyOrder.updated_at
      };

      await Order.upsert(orderData, {
        conflictFields: ['shopifyId', 'tenantId']
      });
    } catch (error) {
      console.error(`Error upserting order ${shopifyOrder.id}:`, error.message);
    }
  }

  async syncAllData(tenantId) {
    try {
      console.log(`Starting full sync for tenant: ${tenantId}`);
      
      await Promise.all([
        this.syncCustomers(tenantId),
        this.syncProducts(tenantId),
        this.syncOrders(tenantId)
      ]);

      // Update tenant last sync time
      await Tenant.update(
        { lastSyncAt: new Date() },
        { where: { id: tenantId } }
      );

      console.log(`Full sync completed for tenant: ${tenantId}`);
    } catch (error) {
      console.error(`Full sync failed for tenant ${tenantId}:`, error.message);
      throw error;
    }
  }

  async handleWebhookData(tenantId, topic, data) {
    try {
      switch (topic) {
        case 'customers/create':
        case 'customers/update':
          await this.upsertCustomer(tenantId, data);
          break;
        case 'products/create':
        case 'products/update':
          await this.upsertProduct(tenantId, data);
          break;
        case 'orders/create':
        case 'orders/updated':
          await this.upsertOrder(tenantId, data);
          break;
        default:
          console.log(`Unhandled webhook topic: ${topic}`);
      }
    } catch (error) {
      console.error(`Webhook processing error for ${topic}:`, error.message);
      throw error;
    }
  }
}

const shopifyService = new ShopifyService();
module.exports = { shopifyService };