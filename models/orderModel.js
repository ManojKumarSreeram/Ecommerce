const pool = require('../config/db');

exports.createOrder = async (userId) => {
  // 1. Get cart items
  const cartItems = await pool.query(
    `SELECT c.product_id, c.quantity, p.price
     FROM cart_items c
     JOIN products p ON c.product_id = p.id
     WHERE c.user_id = $1`,
    [userId]
  );

  if (cartItems.rows.length === 0) {
    throw new Error('Cart is empty');
  }

  // 2. Calculate total
  const totalAmount = cartItems.rows.reduce((sum, item) => {
    return sum + item.quantity * parseFloat(item.price);
  }, 0);

  // 3. Start transaction
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 4. Insert into orders
    const orderRes = await client.query(
      `INSERT INTO orders (user_id, total_amount) VALUES ($1, $2) RETURNING *`,
      [userId, totalAmount]
    );
    const order = orderRes.rows[0];

    // 5. Insert into order_items
    for (const item of cartItems.rows) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.product_id, item.quantity, item.price]
      );
    }

    // 6. Clear cart
    await client.query(`DELETE FROM cart_items WHERE user_id = $1`, [userId]);

    await client.query('COMMIT');
    return order;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

// Get user orders
exports.getUserOrders = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
};

// Get order items by order ID
exports.getOrderItems = async (orderId) => {
  const result = await pool.query(
    `SELECT oi.*, p.name, p.image_url
     FROM order_items oi
     JOIN products p ON oi.product_id = p.id
     WHERE oi.order_id = $1`,
    [orderId]
  );
  return result.rows;
};

exports.getAllOrders = async () => {
  const result = await pool.query(`
    SELECT o.*, u.email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `);
  return result.rows;
};
