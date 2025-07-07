const pool = require('../config/db');

// Add to cart (create or update quantity)
exports.addToCart = async (userId, productId, quantity) => {
  const existing = await pool.query(
    `SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2`,
    [userId, productId]
  );

  if (existing.rows.length > 0) {
    // Update quantity
    return await pool.query(
      `UPDATE cart_items SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3 RETURNING *`,
      [quantity, userId, productId]
    );
  } else {
    // Insert new item
    return await pool.query(
      `INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *`,
      [userId, productId, quantity]
    );
  }
};

// Get all cart items for a user
exports.getCart = async (userId) => {
  const query = `
    SELECT c.id AS cart_item_id, p.*, c.quantity
    FROM cart_items c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = $1
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

// Update quantity of a specific item
exports.updateCartItem = async (userId, productId, quantity) => {
  const query = `
    UPDATE cart_items
    SET quantity = $1
    WHERE user_id = $2 AND product_id = $3
    RETURNING *;
  `;
  const result = await pool.query(query, [quantity, userId, productId]);
  return result.rows[0];
};

// Remove item from cart
exports.removeCartItem = async (userId, productId) => {
  const result = await pool.query(
    `DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2 RETURNING *`,
    [userId, productId]
  );
  return result.rows[0];
};
