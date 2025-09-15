const express = require('express');
const { getDashboardMetrics, getRevenueAnalytics } = require('../controllers/dashboardController');
const { auth } = require('../middleware/auth');
const { tenantIsolation, validateTenantAccess } = require('../middleware/tenant');

const router = express.Router();

// Apply middleware to all routes
router.use(auth);
router.use(tenantIsolation);
router.use(validateTenantAccess);

// Routes
router.get('/metrics', getDashboardMetrics);
router.get('/analytics/revenue', getRevenueAnalytics);

module.exports = router;