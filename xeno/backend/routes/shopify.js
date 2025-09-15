const express = require('express');
const { body } = require('express-validator');
const { 
  connectStore, 
  syncData, 
  handleWebhook, 
  getConnectionStatus 
} = require('../controllers/shopifyController');
const { auth } = require('../middleware/auth');
const { tenantIsolation, validateTenantAccess } = require('../middleware/tenant');

const router = express.Router();

// Webhook route (no auth required)
router.post('/webhook', handleWebhook);

// Apply middleware to authenticated routes
router.use(auth);
router.use(tenantIsolation);
router.use(validateTenantAccess);

// Validation
const connectStoreValidation = [
  body('shopifyStoreName').trim().notEmpty().withMessage('Shopify store name is required'),
  body('accessToken').trim().notEmpty().withMessage('Access token is required')
];

// Routes
router.post('/connect', connectStoreValidation, connectStore);
router.post('/sync', syncData);
router.get('/status', getConnectionStatus);

module.exports = router;