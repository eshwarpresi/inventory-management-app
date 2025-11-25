const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'inventory.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
  // Products table
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    unit TEXT NOT NULL,
    category TEXT NOT NULL,
    brand TEXT NOT NULL,
    stock INTEGER DEFAULT 0,
    status TEXT DEFAULT 'In Stock',
    image TEXT,
    price DECIMAL(10,2) DEFAULT 0,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Inventory history table
  db.run(`CREATE TABLE IF NOT EXISTS inventory_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    old_stock INTEGER NOT NULL,
    new_stock INTEGER NOT NULL,
    changed_by TEXT DEFAULT 'admin',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
  )`);

  // Insert extensive sample data
  db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
    if (row.count === 0) {
      const sampleProducts = [
        // Electronics (15 products)
        ['MacBook Pro 16"', 'piece', 'Electronics', 'Apple', 8, 'In Stock', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300', 2399.99, '16-inch MacBook Pro with M2 Pro chip'],
        ['Dell XPS 13', 'piece', 'Electronics', 'Dell', 12, 'In Stock', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300', 1299.99, 'Ultra-thin laptop with InfinityEdge display'],
        ['Logitech MX Master 3', 'piece', 'Electronics', 'Logitech', 25, 'In Stock', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300', 99.99, 'Advanced wireless mouse for professionals'],
        ['Samsung Odyssey G7', 'piece', 'Electronics', 'Samsung', 6, 'In Stock', 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300', 699.99, '27-inch QHD gaming monitor'],
        ['Apple iPhone 15 Pro', 'piece', 'Electronics', 'Apple', 18, 'In Stock', 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300', 999.99, 'Latest iPhone with A17 Pro chip'],
        ['Sony WH-1000XM5', 'piece', 'Electronics', 'Sony', 14, 'In Stock', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300', 399.99, 'Industry-leading noise canceling headphones'],
        ['iPad Air', 'piece', 'Electronics', 'Apple', 9, 'In Stock', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300', 599.99, 'Powerful tablet with M1 chip'],
        ['Samsung Galaxy Tab S9', 'piece', 'Electronics', 'Samsung', 7, 'In Stock', 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=300', 799.99, 'Premium Android tablet'],
        ['PlayStation 5', 'piece', 'Electronics', 'Sony', 4, 'In Stock', 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=300', 499.99, 'Next-gen gaming console'],
        ['Xbox Series X', 'piece', 'Electronics', 'Microsoft', 5, 'In Stock', 'https://images.unsplash.com/photo-1621259182978-fbf832e8e5bf?w=300', 499.99, 'Powerful gaming console'],
        ['Nintendo Switch', 'piece', 'Electronics', 'Nintendo', 11, 'In Stock', 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=300', 299.99, 'Hybrid gaming console'],
        ['Canon EOS R5', 'piece', 'Electronics', 'Canon', 3, 'In Stock', 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300', 3899.99, 'Professional mirrorless camera'],
        ['DJI Mavic 3', 'piece', 'Electronics', 'DJI', 6, 'In Stock', 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=300', 2199.99, 'Professional drone with Hasselblad camera'],
        ['Apple Watch Series 9', 'piece', 'Electronics', 'Apple', 22, 'In Stock', 'https://images.unsplash.com/photo-1579586337278-3f436c25d4a1?w=300', 399.99, 'Advanced smartwatch'],
        ['Samsung Galaxy Watch', 'piece', 'Electronics', 'Samsung', 16, 'In Stock', 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300', 299.99, 'Premium Android smartwatch'],

        // Furniture (15 products)
        ['Ergonomic Office Chair', 'piece', 'Furniture', 'Herman Miller', 8, 'In Stock', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300', 1499.99, 'Premium ergonomic office chair'],
        ['Standing Desk Pro', 'piece', 'Furniture', 'Uplift', 6, 'In Stock', 'https://images.unsplash.com/photo-1505843490537-8de44ebe280b?w=300', 899.99, 'Electric height-adjustable desk'],
        ['Leather Executive Chair', 'piece', 'Furniture', 'Steelcase', 4, 'In Stock', 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=300', 1299.99, 'Luxury executive leather chair'],
        ['Modern Bookshelf', 'piece', 'Furniture', 'IKEA', 15, 'In Stock', 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=300', 299.99, '5-tier modern bookshelf'],
        ['Gaming Desk', 'piece', 'Furniture', 'Arozzi', 9, 'In Stock', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300', 399.99, 'L-shaped gaming desk'],
        ['Office Conference Table', 'piece', 'Furniture', 'Global', 2, 'In Stock', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=300', 1899.99, '12-person conference table'],
        ['Filing Cabinet', 'piece', 'Furniture', 'Hon', 12, 'In Stock', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300', 199.99, '4-drawer filing cabinet'],
        ['Executive Desk', 'piece', 'Furniture', 'Bush Business', 7, 'In Stock', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=300', 799.99, 'Large executive desk'],
        ['Visitor Chairs', 'piece', 'Furniture', 'Flash Furniture', 20, 'In Stock', 'https://images.unsplash.com/photo-1505798577917-a65157d3320a?w=300', 89.99, 'Set of 4 visitor chairs'],
        ['Office Sofa', 'piece', 'Furniture', 'Modway', 3, 'In Stock', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300', 1299.99, '3-seater office sofa'],
        ['Reception Desk', 'piece', 'Furniture', 'Mayline', 1, 'In Stock', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=300', 2499.99, 'Modern reception desk'],
        ['Office Partitions', 'piece', 'Furniture', 'KI', 25, 'In Stock', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300', 299.99, 'Cubicle partitions set'],
        ['Boardroom Table', 'piece', 'Furniture', 'HNI', 2, 'In Stock', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=300', 3299.99, 'Oval boardroom table'],
        ['Office Storage Cabinet', 'piece', 'Furniture', 'Sauder', 18, 'In Stock', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300', 349.99, 'Multi-purpose storage cabinet'],
        ['Office Side Table', 'piece', 'Furniture', 'Winston', 14, 'In Stock', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300', 149.99, 'Modern side table'],

        // Clothing (15 products)
        ['Men\'s Business Shirt', 'piece', 'Clothing', 'Van Heusen', 45, 'In Stock', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300', 49.99, 'Classic fit cotton shirt'],
        ['Women\'s Blazer', 'piece', 'Clothing', 'Ann Taylor', 28, 'In Stock', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300', 129.99, 'Professional women\'s blazer'],
        ['Designer Jeans', 'piece', 'Clothing', 'Levi\'s', 35, 'In Stock', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300', 89.99, 'Premium denim jeans'],
        ['Running Shoes', 'piece', 'Clothing', 'Nike', 22, 'In Stock', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300', 129.99, 'Air Max running shoes'],
        ['Winter Jacket', 'piece', 'Clothing', 'The North Face', 15, 'In Stock', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300', 199.99, 'Insulated winter jacket'],
        ['Summer Dress', 'piece', 'Clothing', 'Zara', 32, 'In Stock', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300', 59.99, 'Floral print summer dress'],
        ['Leather Boots', 'piece', 'Clothing', 'Timberland', 18, 'In Stock', 'https://images.unsplash.com/photo-1542280756-74b2f55e73ab?w=300', 189.99, 'Premium leather boots'],
        ['Business Suit', 'piece', 'Clothing', 'Hugo Boss', 8, 'In Stock', 'https://images.unsplash.com/photo-1594938373333-0351916fcca6?w=300', 599.99, 'Wool blend business suit'],
        ['Sports T-shirt', 'piece', 'Clothing', 'Adidas', 50, 'In Stock', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300', 29.99, 'Moisture-wicking sports tee'],
        ['Evening Gown', 'piece', 'Clothing', 'Dior', 5, 'In Stock', 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=300', 899.99, 'Designer evening gown'],
        ['Casual Shorts', 'piece', 'Clothing', 'H&M', 40, 'In Stock', 'https://images.unsplash.com/photo-1506629905607-e48b0e67d879?w=300', 24.99, 'Cotton casual shorts'],
        ['Wool Sweater', 'piece', 'Clothing', 'Pendleton', 20, 'In Stock', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300', 119.99, '100% wool sweater'],
        ['Yoga Pants', 'piece', 'Clothing', 'Lululemon', 30, 'In Stock', 'https://images.unsplash.com/photo-1506629905607-e48b0e67d879?w=300', 98.99, 'High-waist yoga pants'],
        ['Formal Shoes', 'piece', 'Clothing', 'Cole Haan', 25, 'In Stock', 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=300', 159.99, 'Leather formal shoes'],
        ['Baseball Cap', 'piece', 'Clothing', 'New Era', 60, 'In Stock', 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=300', 34.99, 'Adjustable baseball cap'],

        // Books (15 products)
        ['The Psychology of Money', 'piece', 'Books', 'Morgan Housel', 25, 'In Stock', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300', 24.99, 'Timeless lessons on wealth'],
        ['Atomic Habits', 'piece', 'Books', 'James Clear', 32, 'In Stock', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300', 27.99, 'Build good habits break bad ones'],
        ['Deep Work', 'piece', 'Books', 'Cal Newport', 18, 'In Stock', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300', 26.99, 'Rules for focused success'],
        ['The Alchemist', 'piece', 'Books', 'Paulo Coelho', 40, 'In Stock', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300', 16.99, 'Classic novel about destiny'],
        ['Thinking, Fast and Slow', 'piece', 'Books', 'Daniel Kahneman', 22, 'In Stock', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300', 29.99, 'Groundbreaking psychology book'],
        ['Sapiens', 'piece', 'Books', 'Yuval Noah Harari', 28, 'In Stock', 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=300', 31.99, 'Brief history of humankind'],
        ['The Intelligent Investor', 'piece', 'Books', 'Benjamin Graham', 15, 'In Stock', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300', 34.99, 'Definitive book on value investing'],
        ['Dune', 'piece', 'Books', 'Frank Herbert', 20, 'In Stock', 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300', 18.99, 'Science fiction masterpiece'],
        ['The Hobbit', 'piece', 'Books', 'J.R.R. Tolkien', 35, 'In Stock', 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=300', 14.99, 'Fantasy adventure classic'],
        ['To Kill a Mockingbird', 'piece', 'Books', 'Harper Lee', 30, 'In Stock', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300', 12.99, 'American literature classic'],
        ['1984', 'piece', 'Books', 'George Orwell', 26, 'In Stock', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300', 13.99, 'Dystopian social science fiction'],
        ['The Great Gatsby', 'piece', 'Books', 'F. Scott Fitzgerald', 24, 'In Stock', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300', 11.99, 'American classic novel'],
        ['Pride and Prejudice', 'piece', 'Books', 'Jane Austen', 33, 'In Stock', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300', 10.99, 'Romantic classic novel'],
        ['The Catcher in the Rye', 'piece', 'Books', 'J.D. Salinger', 19, 'In Stock', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300', 15.99, 'Coming-of-age novel'],
        ['Harry Potter Box Set', 'piece', 'Books', 'J.K. Rowling', 12, 'In Stock', 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=300', 89.99, 'Complete 7-book collection'],

        // Sports (15 products)
        ['Basketball', 'piece', 'Sports', 'Spalding', 30, 'In Stock', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300', 49.99, 'Official NBA game ball'],
        ['Football', 'piece', 'Sports', 'Nike', 25, 'In Stock', 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=300', 39.99, 'Professional soccer ball'],
        ['Tennis Racket', 'piece', 'Sports', 'Wilson', 18, 'In Stock', 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=300', 199.99, 'Professional tennis racket'],
        ['Yoga Mat', 'piece', 'Sports', 'Lululemon', 40, 'In Stock', 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=300', 89.99, 'Premium 5mm yoga mat'],
        ['Dumbbell Set', 'set', 'Sports', 'Bowflex', 8, 'In Stock', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300', 299.99, 'Adjustable dumbbell set'],
        ['Running Shoes', 'piece', 'Sports', 'Brooks', 35, 'In Stock', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300', 129.99, 'Glycerin running shoes'],
        ['Bicycle', 'piece', 'Sports', 'Trek', 6, 'In Stock', 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=300', 899.99, 'Mountain bike 21-speed'],
        ['Golf Clubs Set', 'set', 'Sports', 'Callaway', 5, 'In Stock', 'https://images.unsplash.com/photo-1535131749006-b7f58c99034f?w=300', 799.99, 'Complete golf club set'],
        ['Skateboard', 'piece', 'Sports', 'Element', 22, 'In Stock', 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=300', 79.99, 'Professional skateboard'],
        ['Swimming Goggles', 'piece', 'Sports', 'Speedo', 45, 'In Stock', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300', 24.99, 'Anti-fog swimming goggles'],
        ['Baseball Glove', 'piece', 'Sports', 'Rawlings', 28, 'In Stock', 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=300', 89.99, 'Professional baseball glove'],
        ['Treadmill', 'piece', 'Sports', 'NordicTrack', 4, 'In Stock', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300', 1499.99, 'Commercial grade treadmill'],
        ['Boxing Gloves', 'pair', 'Sports', 'Everlast', 32, 'In Stock', 'https://images.unsplash.com/photo-1599058917765-660d3e5c4102?w=300', 59.99, 'Professional boxing gloves'],
        ['Camping Tent', 'piece', 'Sports', 'Coleman', 15, 'In Stock', 'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?w=300', 199.99, '4-person camping tent'],
        ['Fishing Rod', 'piece', 'Sports', 'Shimano', 20, 'In Stock', 'https://images.unsplash.com/photo-1448387473223-5c37445527e7?w=300', 149.99, 'Spinning fishing rod combo']
      ];

      const stmt = db.prepare(`INSERT INTO products (name, unit, category, brand, stock, status, image, price, description) 
                              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
      
      sampleProducts.forEach(product => {
        stmt.run(product, (err) => {
          if (err) {
            console.error('Error inserting product:', err);
          }
        });
      });
      stmt.finalize(() => {
        console.log('Sample data inserted successfully! Total products: 75');
      });
    }
  });
});

module.exports = db;