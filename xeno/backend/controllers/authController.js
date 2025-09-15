


const jwt = require('jsonwebtoken');
const { User, Tenant } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const register = async (req, res) => {
  let createdTenant = null;
  let createdUser = null;
  
  try {
    console.log('=== REGISTRATION ATTEMPT ===');
    console.log('Request body:', req.body);
    
    // Check if models are properly loaded
    console.log('Models check:');
    console.log('User model:', !!User);
    console.log('Tenant model:', !!Tenant);
    
    // Check JWT_SECRET
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    // Updated to handle frontend field names
    const { email, password, name, storeName } = req.body;
    
    // Validate required fields
    if (!email || !password || !name || !storeName) {
      console.log('Missing required fields:', { email: !!email, password: !!password, name: !!name, storeName: !!storeName });
      return res.status(400).json({ error: 'All fields are required.' });
    }
    
    // Split name into firstName and lastName
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    console.log('Processed data:', {
      email,
      firstName,
      lastName,
      storeName,
      passwordProvided: !!password
    });

    // Check if user already exists
    console.log('Step 1: Checking for existing user...');
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log('User already exists');
      return res.status(400).json({ error: 'User already exists with this email.' });
    }
    console.log('No existing user found');

    // Check if tenant already exists
    console.log('Step 2: Checking for existing tenant...');
    const existingTenant = await Tenant.findOne({ 
      where: { 
        [Op.or]: [
          { shopifyStoreName: storeName },
          { name: storeName }
        ]
      }
    });
    if (existingTenant) {
      console.log('Store already exists');
      return res.status(400).json({ error: 'Store already connected.' });
    }
    console.log('No existing tenant found');

    // Create tenant first
    console.log('Step 3: Creating tenant...');
    createdTenant = await Tenant.create({
      name: storeName,
      shopifyStoreName: storeName
    });
    console.log('Tenant created successfully:', createdTenant.id);

    // Create user
    console.log('Step 4: Creating user...');
    createdUser = await User.create({
      email,
      password,
      firstName,
      lastName,
      tenantId: createdTenant.id,
      role: 'admin'
    });
    console.log('User created successfully:', createdUser.id);

    // Generate token
    console.log('Step 5: Generating token...');
    const token = generateToken(createdUser.id);
    console.log('Token generated successfully');

    // Update last login (make this non-blocking)
    console.log('Step 6: Updating last login...');
    createdUser.update({ lastLoginAt: new Date() }).catch(updateError => {
      console.error('Warning: Could not update last login (non-critical):', updateError.message);
    });

    // Prepare response data BEFORE sending
    const responseData = {
      message: 'Registration successful',
      token,
      user: {
        id: createdUser.id,
        email: createdUser.email,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        role: createdUser.role,
        tenantId: createdUser.tenantId
      }
    };

    console.log('Step 7: Sending success response');
    console.log('Response data prepared:', { userId: responseData.user.id, hasToken: !!responseData.token });
    
    // Send response
    return res.status(201).json(responseData);

  } catch (error) {
    console.error('=== REGISTRATION ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Clean up on error - but only if we created something
    if (createdUser && createdTenant) {
      console.log('Cleaning up created records due to error...');
      try {
        await createdUser.destroy();
        await createdTenant.destroy();
        console.log('Cleanup completed');
      } catch (cleanupError) {
        console.error('Cleanup failed (this might cause duplicates):', cleanupError.message);
      }
    } else if (createdTenant && !createdUser) {
      // Only tenant was created, clean it up
      try {
        await createdTenant.destroy();
        console.log('Tenant cleanup completed');
      } catch (cleanupError) {
        console.error('Tenant cleanup failed:', cleanupError.message);
      }
    }
    
    // Log additional error details
    if (error.original) {
      console.error('Original error:', error.original);
    }
    if (error.sql) {
      console.error('SQL query:', error.sql);
    }
    if (error.parent) {
      console.error('Parent error:', error.parent);
    }
    
    // Handle specific database errors
    if (error.name === 'SequelizeValidationError') {
      console.error('Sequelize validation errors:', error.errors);
      return res.status(400).json({
        error: 'Validation error',
        errors: error.errors.map(e => ({
          field: e.path,
          message: e.message,
          value: e.value
        }))
      });
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      console.error('Unique constraint error:', error.errors);
      return res.status(400).json({
        error: 'User already exists',
        field: error.errors[0]?.path
      });
    }
    
    if (error.name === 'SequelizeConnectionError') {
      console.error('Database connection error');
      return res.status(500).json({
        error: 'Database connection failed'
      });
    }
    
    if (error.name === 'SequelizeDatabaseError') {
      console.error('Database error details:', {
        message: error.message,
        sql: error.sql,
        parameters: error.parameters
      });
      return res.status(500).json({
        error: 'Database operation failed'
      });
    }
    
    // Check if headers were already sent
    if (res.headersSent) {
      console.error('Headers already sent, cannot send error response');
      return;
    }
    
    return res.status(500).json({ 
      error: 'Registration failed. Please try again.',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const login = async (req, res) => {
  try {
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Email:', req.body.email);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Login validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    console.log('Finding user...');
    // Find user with tenant info
    const user = await User.findOne({ 
      where: { email: email.toLowerCase() },
      include: [{ model: Tenant, as: 'Tenant' }]
    });

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    console.log('User found:', user.id);

    if (!user.isActive) {
      console.log('User account is deactivated');
      return res.status(401).json({ error: 'Account is deactivated.' });
    }

    console.log('Validating password...');
    // Validate password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      console.log('Invalid password');
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    console.log('Password valid, generating token...');
    // Generate token
    const token = generateToken(user.id);

    // Update last login (non-blocking)
    user.update({ lastLoginAt: new Date() }).catch(err => {
      console.error('Could not update last login:', err.message);
    });

    console.log('Login successful');
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenantId: user.tenantId,
        tenant: {
          id: user.Tenant.id,
          name: user.Tenant.name,
          shopifyStoreName: user.Tenant.shopifyStoreName,
          isActive: user.Tenant.isActive
        }
      }
    });
  } catch (error) {
    console.error('=== LOGIN ERROR ===');
    console.error('Error:', error);
    
    if (res.headersSent) {
      return;
    }
    
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Tenant, as: 'Tenant' }],
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenantId: user.tenantId,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
        tenant: {
          id: user.Tenant.id,
          name: user.Tenant.name,
          shopifyStoreName: user.Tenant.shopifyStoreName,
          isActive: user.Tenant.isActive,
          lastSyncAt: user.Tenant.lastSyncAt
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    
    if (res.headersSent) {
      return;
    }
    
    res.status(500).json({ error: 'Failed to fetch profile.' });
  }
};

module.exports = {
  register,
  login,
  getProfile
};