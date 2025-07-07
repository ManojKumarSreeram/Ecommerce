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
exports.getAllProducts = async (page = 1, limit = 10, search = '', category = '') => {
  const offset = (page - 1) * limit;

  let query = `SELECT * FROM products WHERE 1=1`;
  let countQuery = `SELECT COUNT(*) FROM products WHERE 1=1`;
  const values = [];
  const countValues = [];

  if (search) {
    query += ` AND name ILIKE $${values.length + 1}`;
    countQuery += ` AND name ILIKE $${countValues.length + 1}`;
    values.push(`%${search}%`);
    countValues.push(`%${search}%`);
  }

  if (category) {
    query += ` AND category ILIKE $${values.length + 1}`;
    countQuery += ` AND category ILIKE $${countValues.length + 1}`;
    values.push(`%${category}%`);
    countValues.push(`%${category}%`);
  }

  query += ` ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
  values.push(limit);
  values.push(offset);

  const data = await pool.query(query, values);
  const count = await pool.query(countQuery, countValues);

  return {
    products: data.rows,
    total: parseInt(count.rows[0].count),
    page,
    limit
  };
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
