// const express = require('express');
// const { body } = require('express-validator');
// const { register, login, getProfile } = require('../controllers/authController');
// const { auth } = require('../middleware/auth');

// const router = express.Router();

// // Validation middleware
// const registerValidation = [
//   body('email').isEmail().normalizeEmail(),
//   body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
//   body('firstName').trim().notEmpty().withMessage('First name is required'),
//   body('lastName').trim().notEmpty().withMessage('Last name is required'),
//   body('shopifyStoreName').trim().notEmpty().withMessage('Shopify store name is required'),
//   body('tenantName').optional().trim()
// ];

// const loginValidation = [
//   body('email').isEmail().normalizeEmail(),
//   body('password').notEmpty().withMessage('Password is required')
// ];

// // Routes
// router.post('/register', registerValidation, register);
// router.post('/login', loginValidation, login);
// router.get('/profile', auth, getProfile);

// module.exports = router;

const express = require('express');
const { body, validationResult } = require('express-validator');
const { register, login, getProfile } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Validation middleware - Updated to match frontend field names
const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('storeName').trim().isLength({ min: 3 }).withMessage('Store name must be at least 3 characters')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Validation error handler middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({
      error: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path || error.param,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// Test route for debugging
router.post('/test', (req, res) => {
  console.log('Test endpoint hit with data:', req.body);
  res.json({ 
    message: 'Backend is working',
    receivedData: req.body,
    timestamp: new Date().toISOString()
  });
});

// Routes
router.post('/register', registerValidation, handleValidationErrors, register);
router.post('/login', loginValidation, handleValidationErrors, login);
router.get('/profile', auth, getProfile);

module.exports = router;