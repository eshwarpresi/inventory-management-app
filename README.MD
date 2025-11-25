# 🏪 Product Inventory Management System

A full-stack inventory management application built with React, Node.js, and SQLite. Features product CRUD operations, CSV import/export, inventory tracking, and a modern responsive UI.

## 🚀 Live Demo

- **Frontend Application**: https://inventory-management-app-blue-zeta.vercel.app/
- **Backend API**: https://inventory-management-app-itpa.onrender.com
- **API Base URL**: https://inventory-management-app-itpa.onrender.com/api
- **GitHub Repository**: https://github.com/eshwarpresi/inventory-management-app

## 📋 Assignment Requirements Checklist

### ✅ Mandatory Features Implemented

#### Frontend (React)
- ✅ **Product Search & Filtering** - Real-time search with category dropdown
- ✅ **Products Table** - Clean table with image, name, unit, category, brand, stock, status, and actions
- ✅ **Stock Status** - Color-coded labels (Green: In Stock, Red: Out of Stock)
- ✅ **Import/Export** - CSV import with duplicate handling and CSV export functionality
- ✅ **Inline Editing** - Modal-based editing with Save/Cancel functionality
- ✅ **Inventory History** - Slide-in panel showing stock change history
- ✅ **Add New Product** - Modal form for creating new products

#### Backend (Node.js + SQLite)
- ✅ **CSV Import API** - `POST /api/products/import` with duplicate detection
- ✅ **CSV Export API** - `GET /api/products/export` with proper headers
- ✅ **Products API** - `GET /api/products` and `GET /api/products/search`
- ✅ **Update Product API** - `PUT /api/products/:id` with validation
- ✅ **Inventory History** - Automatic tracking of stock changes in `inventory_logs` table

### 🎯 Bonus Features

- ✅ **Professional Responsive UI** - Modern design with gradients and animations
- ✅ **Real-time Statistics Dashboard** - Total products, stock counts, and status overview
- ✅ **75+ Sample Products** - Across 5 categories (Electronics, Furniture, Clothing, Books, Sports)
- ✅ **Advanced Table Features** - Sortable columns, stock indicators, progress bars
- ✅ **Premium User Experience** - Smooth animations, hover effects, and professional styling
- ✅ **Mobile-Friendly Design** - Fully responsive across all devices

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Axios for API calls
- CSS3 with modern features (Grid, Flexbox, Variables)
- Responsive design

**Backend:**
- Node.js
- Express.js
- SQLite3 database
- Multer for file uploads
- CORS enabled
- CSV-parser for import functionality

## 📁 Project Structure
inventory-management-app/
├── backend/
│ ├── models/database.js # Database initialization & sample data
│ ├── routes/products.js # Product CRUD operations
│ ├── routes/inventory.js # Import/export & history APIs
│ ├── middleware/upload.js # File upload handling
│ └── server.js # Express server setup
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── Header.js # Search, filters, import/export buttons
│ │ │ ├── ProductTable.js # Main products table
│ │ │ ├── ProductForm.js # Add/Edit product modal
│ │ │ └── InventoryHistory.js # Stock history sidebar
│ │ ├── services/api.js # API service functions
│ │ ├── utils/helpers.js # Utility functions
│ │ └── App.js # Main application component
│ ├── public/
│ └── package.json
├── README.md
└── .gitignore

text

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm

### Local Development

#### Backend Setup
```bash
cd backend
npm install
npm run dev
Server runs on http://localhost:5000

Frontend Setup
bash
cd frontend
npm install
npm start
App runs on http://localhost:3000

📚 API Documentation
Products Endpoints
Method	Endpoint	Description
GET	/api/products	Get all products
GET	/api/products/search?name=query	Search products by name
POST	/api/products	Create new product
PUT	/api/products/:id	Update product
DELETE	/api/products/:id	Delete product
Import/Export Endpoints
Method	Endpoint	Description
POST	/api/products/import	Import products from CSV
GET	/api/products/export	Export products to CSV
Inventory History
Method	Endpoint	Description
GET	/api/products/:id/history	Get inventory change history
💾 Database Schema
Products Table
sql
id INTEGER PRIMARY KEY
name TEXT UNIQUE NOT NULL
unit TEXT NOT NULL
category TEXT NOT NULL
brand TEXT NOT NULL
stock INTEGER DEFAULT 0
status TEXT DEFAULT 'In Stock'
image TEXT
price DECIMAL(10,2)
description TEXT
created_at DATETIME
updated_at DATETIME
Inventory History Table
sql
id INTEGER PRIMARY KEY
product_id INTEGER
old_stock INTEGER
new_stock INTEGER
changed_by TEXT
timestamp DATETIME
🎨 Features Showcase
Dashboard & Statistics
Real-time product counts and stock overview

Visual status indicators

Professional card-based layout

Product Management
Advanced search with instant results

Category-based filtering

Bulk operations via CSV

Image support with previews

Inventory Tracking
Automatic stock change logging

Historical data visualization

Change attribution tracking

Data Management
CSV import with duplicate detection

CSV export with proper formatting

Data validation and error handling

🚀 Deployment
Backend (Render)
Automatic deployment from GitHub

Node.js environment

SQLite database persistence

Frontend (Vercel)
Automatic deployment from GitHub

Environment variables for API configuration

Optimized production build

🧪 Testing the Application
Visit the Frontend URL and explore the 75+ sample products

Test Search - Use the search bar to find products

Filter by Category - Use the dropdown to filter products

Add New Product - Click "Add New Product" button

Edit Products - Click "Edit" on any product row

Import/Export - Test CSV functionality

View History - Click on any product to see inventory history

👨‍💻 Author
Eshwar Presi

GitHub: @eshwarpresi

Project Repository: Inventory Management App