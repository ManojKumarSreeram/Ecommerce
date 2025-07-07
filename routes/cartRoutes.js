const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.use(authenticateToken); // All cart routes require login

router.post('/add', cartController.addToCart);
router.get('/', cartController.getCart);
router.put('/update', cartController.updateCartItem);
router.delete('/remove', cartController.removeCartItem);

module.exports = router;
