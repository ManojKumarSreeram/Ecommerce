const pool = require('../config/db');

// Create product
exports.createProduct = async (product) => {
  const { name, description, price, category, image_url } = product;
  const query = `
    INSERT INTO products (name, description, price, category, image_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const result = await pool.query(query, [name, description, price, category, image_url]);
  return result.rows[0];
};

// Get all products (public view)
exports.getAllProducts = async () => {
  const result = await pool.query(`SELECT * FROM products ORDER BY created_at DESC`);
  return result.rows;
};

// Get single product by ID
exports.getProductById = async (id) => {
  const result = await pool.query(`SELECT * FROM products WHERE id = $1`, [id]);
  return result.rows[0];
};

// Update product (admin only)
exports.updateProduct = async (id, data) => {
  const { name, description, price, category, image_url } = data;
  const query = `
    UPDATE products
    SET name = $1, description = $2, price = $3, category = $4, image_url = $5
    WHERE id = $6
    RETURNING *;
  `;
  const result = await pool.query(query, [name, description, price, category, image_url, id]);
  return result.rows[0];
};

// Delete product
exports.deleteProduct = async (id) => {
  const result = await pool.query(`DELETE FROM products WHERE id = $1 RETURNING *`, [id]);
  return result.rows[0];
};
