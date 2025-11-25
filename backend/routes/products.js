const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../models/database');
const fs = require('fs');
const csv = require('csv-parser');
const router = express.Router();

// Get all products
router.get('/', (req, res) => {
  const { category, search } = req.query;
  
  let query = `SELECT * FROM products`;
  let params = [];

  if (search) {
    query += ` WHERE name LIKE ?`;
    params.push(`%${search}%`);
  } else if (category && category !== 'all') {
    query += ` WHERE category = ?`;
    params.push(category);
  }

  query += ` ORDER BY created_at DESC`;

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Search products
router.get('/search', (req, res) => {
  const { name } = req.query;
  
  if (!name) {
    return res.status(400).json({ error: 'Name parameter is required' });
  }

  db.all(
    `SELECT * FROM products WHERE name LIKE ? ORDER BY name`,
    [`%${name}%`],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

// Get product by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get(`SELECT * FROM products WHERE id = ?`, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(row);
  });
});

// Update product
router.put('/:id', [
  body('name').notEmpty().withMessage('Name is required'),
  body('unit').notEmpty().withMessage('Unit is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('brand').notEmpty().withMessage('Brand is required'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { name, unit, category, brand, stock, image } = req.body;

  // Check if name already exists for other products
  db.get(
    `SELECT id FROM products WHERE name = ? AND id != ?`,
    [name, id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (row) {
        return res.status(400).json({ error: 'Product name already exists' });
      }

      // Get current stock before update
      db.get(`SELECT stock FROM products WHERE id = ?`, [id], (err, product) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        const oldStock = product ? product.stock : 0;
        const status = stock > 0 ? 'In Stock' : 'Out of Stock';

        // Update product
        db.run(
          `UPDATE products SET name = ?, unit = ?, category = ?, brand = ?, stock = ?, status = ?, image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
          [name, unit, category, brand, stock, status, image, id],
          function(err) {
            if (err) {
              return res.status(500).json({ error: err.message });
            }

            // Log inventory change if stock changed
            if (oldStock !== stock) {
              db.run(
                `INSERT INTO inventory_history (product_id, old_stock, new_stock, changed_by) VALUES (?, ?, ?, ?)`,
                [id, oldStock, stock, 'admin']
              );
            }

            // Return updated product
            db.get(`SELECT * FROM products WHERE id = ?`, [id], (err, row) => {
              if (err) {
                return res.status(500).json({ error: err.message });
              }
              res.json(row);
            });
          }
        );
      });
    }
  );
});

// Delete product
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM products WHERE id = ?`, [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  });
});

// Create new product
router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('unit').notEmpty().withMessage('Unit is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('brand').notEmpty().withMessage('Brand is required'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, unit, category, brand, stock, image } = req.body;
  const status = stock > 0 ? 'In Stock' : 'Out of Stock';

  db.run(
    `INSERT INTO products (name, unit, category, brand, stock, status, image) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, unit, category, brand, stock, status, image],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Product name already exists' });
        }
        return res.status(500).json({ error: err.message });
      }

      // Get the newly created product
      db.get(`SELECT * FROM products WHERE id = ?`, [this.lastID], (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json(row);
      });
    }
  );
});

module.exports = router;