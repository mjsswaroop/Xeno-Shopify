const tenantIsolation = (req, res, next) => {
  // Add tenant filtering to queries
  const originalQuery = req.query;
  req.query = {
    ...originalQuery,
    tenantId: req.tenantId
  };
  
  // Store original body and add tenantId if it's a POST/PUT request
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    if (req.body && typeof req.body === 'object') {
      req.body.tenantId = req.tenantId;
    }
  }
  
  next();
};

const validateTenantAccess = async (req, res, next) => {
  try {
    const { Tenant } = require('../models');
    
    const tenant = await Tenant.findByPk(req.tenantId);
    
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found.' });
    }
    
    if (!tenant.isActive) {
      return res.status(403).json({ error: 'Tenant account is inactive.' });
    }
    
    req.tenant = tenant;
    next();
  } catch (error) {
    console.error('Tenant validation error:', error);
    res.status(500).json({ error: 'Tenant validation failed.' });
  }
};

module.exports = { tenantIsolation, validateTenantAccess };