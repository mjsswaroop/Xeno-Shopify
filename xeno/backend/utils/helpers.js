const crypto = require('crypto');

const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
};

const sanitizeShopifyStoreName = (storeName) => {
  return storeName.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');
};

const validateShopifyWebhook = (data, signature, secret) => {
  const hmac = crypto.createHmac('sha256', secret);
  const body = JSON.stringify(data);
  hmac.update(body, 'utf8');
  const calculatedSignature = hmac.digest('base64');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(calculatedSignature)
  );
};

const paginate = (page, limit) => {
  const offset = (parseInt(page) - 1) * parseInt(limit);
  return {
    limit: parseInt(limit),
    offset: Math.max(0, offset)
  };
};

const buildDateFilter = (startDate, endDate, field = 'createdAt') => {
  const filter = {};
  if (startDate || endDate) {
    filter[field] = {};
    if (startDate) filter[field][Op.gte] = new Date(startDate);
    if (endDate) filter[field][Op.lte] = new Date(endDate);
  }
  return filter;
};

module.exports = {
  generateSecureToken,
  formatCurrency,
  formatDate,
  sanitizeShopifyStoreName,
  validateShopifyWebhook,
  paginate,
  buildDateFilter
};