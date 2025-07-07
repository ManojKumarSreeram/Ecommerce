const cartModel = require('../models/cartModel');

exports.addToCart = async (req, res) => {
  const userId = req.user.id;
  const { product_id, quantity } = req.body;

  try {
    const result = await cartModel.addToCart(userId, product_id, quantity);
    res.status(200).json({ message: 'Cart updated', item: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await cartModel.getCart(req.user.id);
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve cart' });
  }
};

exports.updateCartItem = async (req, res) => {
  const userId = req.user.id;
  const { product_id, quantity } = req.body;

  try {
    const updated = await cartModel.updateCartItem(userId, product_id, quantity);
    if (!updated) return res.status(404).json({ error: 'Cart item not found' });
    res.json({ message: 'Quantity updated', item: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update cart' });
  }
};

exports.removeCartItem = async (req, res) => {
  const userId = req.user.id;
  const { product_id } = req.body;

  try {
    const removed = await cartModel.removeCartItem(userId, product_id);
    if (!removed) return res.status(404).json({ error: 'Cart item not found' });
    res.json({ message: 'Item removed from cart', item: removed });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove item' });
  }
};
