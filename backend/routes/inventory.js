const express = require('express');
const db = require('../models/database');
const fs = require('fs');
const csv = require('csv-parser');
const upload = require('../middleware/upload');
const router = express.Router();

// Import products from CSV
router.post('/import', upload.single('csvFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No CSV file uploaded' });
  }

  const results = [];
  const added = [];
  const skipped = [];
  const duplicates = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => {
      results.push(data);
    })
    .on('end', () => {
      let processed = 0;

      if (results.length === 0) {
        fs.unlinkSync(req.file.path);
        return res.json({ added: 0, skipped: 0, duplicates: [] });
      }

      results.forEach((product) => {
        const { name, unit, category, brand, stock, status, image } = product;

        // Check if product already exists
        db.get(
          `SELECT id FROM products WHERE LOWER(name) = LOWER(?)`,
          [name],
          (err, row) => {
            if (err) {
              console.error(err);
            }

            if (row) {
              // Product already exists
              skipped.push(name);
              duplicates.push({ name, existingId: row.id });
            } else {
              // Insert new product
              const productStatus = stock > 0 ? 'In Stock' : 'Out of Stock';
              db.run(
                `INSERT INTO products (name, unit, category, brand, stock, status, image) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [name, unit, category, brand, parseInt(stock) || 0, productStatus, image],
                function(err) {
                  if (err) {
                    console.error(err);
                    skipped.push(name);
                  } else {
                    added.push(name);
                  }
                }
              );
            }

            processed++;
            if (processed === results.length) {
              // Clean up uploaded file
              fs.unlinkSync(req.file.path);
              
              res.json({
                added: added.length,
                skipped: skipped.length,
                duplicates: duplicates
              });
            }
          }
        );
      });
    })
    .on('error', (error) => {
      fs.unlinkSync(req.file.path);
      res.status(500).json({ error: 'Error parsing CSV file' });
    });
});

// Export products to CSV
router.get('/export', (req, res) => {
  db.all(`SELECT * FROM products ORDER BY name`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Create CSV content
    let csvContent = 'name,unit,category,brand,stock,status,image\n';
    
    rows.forEach(product => {
      const row = [
        `"${product.name}"`,
        `"${product.unit}"`,
        `"${product.category}"`,
        `"${product.brand}"`,
        product.stock,
        `"${product.status}"`,
        `"${product.image || ''}"`
      ].join(',');
      
      csvContent += row + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="products.csv"');
    res.send(csvContent);
  });
});

// Get inventory history for a product
router.get('/:id/history', (req, res) => {
  const { id } = req.params;

  db.all(
    `SELECT * FROM inventory_history WHERE product_id = ? ORDER BY timestamp DESC`,
    [id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

module.exports = router;