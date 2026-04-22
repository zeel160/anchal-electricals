const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

// @GET /api/products - Public (with search, filter, pagination)
router.get('/', async (req, res) => {
  try {
    const { search, category, brand, minPrice, maxPrice, page = 1, limit = 20, sort = '-createdAt' } = req.query;
    const query = { isActive: true };
    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (brand) query.brand = new RegExp(brand, 'i');
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    const total = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sort).skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/products/categories
router.get('/categories', async (req, res) => {
  const cats = await Product.distinct('category');
  res.json({ success: true, categories: cats });
});

// @GET /api/products/low-stock (admin)
router.get('/low-stock', protect, async (req, res) => {
  const products = await Product.find({ $expr: { $lte: ['$stock', '$minStock'] }, isActive: true });
  res.json({ success: true, products });
});

// @GET /api/products/:id
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, product });
});

// @POST /api/products (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @PUT /api/products/:id (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @DELETE /api/products/:id (admin - soft delete)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ success: true, message: 'Product removed' });
});

module.exports = router;
