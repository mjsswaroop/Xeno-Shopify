module.exports = {
  apiVersion: '2023-10',
  scopes: [
    'read_products',
    'read_customers',
    'read_orders',
    'read_analytics',
    'read_checkouts'
  ],
  webhookEndpoints: [
    'orders/create',
    'orders/updated',
    'customers/create',
    'customers/update',
    'products/create',
    'products/update',
    'checkouts/create',
    'checkouts/update'
  ]
};