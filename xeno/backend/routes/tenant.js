const express = require('express');
const { 
  getTenantInfo, 
  updateTenantSettings, 
  getTenantStats 
} = require('../controllers/tenantController');
const { auth } = require('../middleware/auth');
const { tenantIsolation, validateTenantAccess } = require('../middleware/tenant');

const router = express.Router();

// Apply middleware to all routes
router.use(auth);
router.use(tenantIsolation);
router.use(validateTenantAccess);

// Routes
router.get('/info', getTenantInfo);
router.put('/settings', updateTenantSettings);
router.get('/stats', getTenantStats);

module.exports = router;