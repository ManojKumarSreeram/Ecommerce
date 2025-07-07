const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Customer only (but no role check here)
router.use(authenticateToken);

router.post('/place', orderController.placeOrder);
router.get('/', orderController.getMyOrders);
router.get('/:orderId', orderController.getOrderDetails);
const { authorizeRole } = require('../middleware/authMiddleware');

// Admin-only routes
router.get('/admin/all', authorizeRole('admin'), orderController.getAllOrders);
router.get('/admin/details/:orderId', authorizeRole('admin'), orderController.getOrderDetails);


module.exports = router;
