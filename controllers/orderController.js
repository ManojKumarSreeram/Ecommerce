const orderModel = require('../models/orderModel');

exports.placeOrder = async (req, res) => {
  const userId = req.user.id;
  try {
    const order = await orderModel.createOrder(userId);
    res.status(201).json({ message: 'Order placed', order });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await orderModel.getUserOrders(req.user.id);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const items = await orderModel.getOrderItems(req.params.orderId);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order items' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.getAllOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch all orders' });
  }
};

