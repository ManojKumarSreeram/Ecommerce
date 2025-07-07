const productModel = require('../models/productModel');

exports.createProduct = async (req, res) => {
  try {
    const product = await productModel.createProduct(req.body);
    res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

exports.getAllProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const category = req.query.category || '';

  try {
    const result = await productModel.getAllProducts(page, limit, search, category);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const product = await productModel.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching product' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updated = await productModel.updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product updated', product: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await productModel.deleteProduct(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted', product: deleted });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
