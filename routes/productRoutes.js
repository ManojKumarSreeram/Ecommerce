const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// All users must be logged in to access products
router.get('/', authenticateToken, productController.getAllProducts);
router.get('/:id', authenticateToken, productController.getProductById);

// Admin routes
router.post('/', authenticateToken, authorizeRole('admin'), productController.createProduct);
router.put('/:id', authenticateToken, authorizeRole('admin'), productController.updateProduct);
router.delete('/:id', authenticateToken, authorizeRole('admin'), productController.deleteProduct);

module.exports = router;
