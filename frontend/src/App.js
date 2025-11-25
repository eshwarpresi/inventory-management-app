import React, { useState, useEffect } from 'react';
import { productAPI } from './services/api';
import Header from './components/Header';
import ProductTable from './components/ProductTable';
import ProductForm from './components/ProductForm';
import InventoryHistory from './components/InventoryHistory';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [inventoryHistory, setInventoryHistory] = useState([]);
  const [selectedProductName, setSelectedProductName] = useState('');

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Extract unique categories from products
  useEffect(() => {
    const uniqueCategories = [...new Set(products.map(p => p.category))];
    setCategories(uniqueCategories);
  }, [products]);

  // Calculate statistics for dashboard - ADD THIS FUNCTION
  const calculateStats = () => {
    const totalProducts = products.length;
    const inStockProducts = products.filter(p => p.status === 'In Stock').length;
    const outOfStockProducts = products.filter(p => p.status === 'Out of Stock').length;
    const totalStockValue = products.reduce((sum, product) => sum + (product.stock * (product.price || 0)), 0);
    const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
    
    return {
      totalProducts,
      inStockProducts,
      outOfStockProducts,
      totalStockValue,
      totalStock
    };
  };

  // Calculate stats whenever products change - ADD THIS
  const stats = calculateStats();

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory !== 'all') params.category = selectedCategory;
      
      const response = await productAPI.getAll(params);
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
      alert('Error loading products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Apply filters when search term or category changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadProducts();
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        // Update existing product
        await productAPI.update(editingProduct.id, productData);
      } else {
        // Create new product
        await productAPI.create(productData);
      }
      
      setShowProductForm(false);
      setEditingProduct(null);
      loadProducts(); // Reload products to get updated data
      alert(`Product ${editingProduct ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      console.error('Error saving product:', error);
      alert(error.response?.data?.error || 'Error saving product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(productId);
        loadProducts();
        alert('Product deleted successfully!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  };

  const handleImport = async (file) => {
    try {
      const response = await productAPI.import(file);
      alert(`Import completed! Added: ${response.data.added}, Skipped: ${response.data.skipped}`);
      loadProducts();
    } catch (error) {
      console.error('Error importing products:', error);
      alert('Error importing products');
    }
  };

  const handleExport = async () => {
    try {
      const response = await productAPI.export();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'products.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting products:', error);
      alert('Error exporting products');
    }
  };

  const handleRowClick = async (productId) => {
    try {
      setSelectedProductId(productId);
      
      // Get product name
      const product = products.find(p => p.id === productId);
      if (product) {
        setSelectedProductName(product.name);
      }
      
      // Load inventory history
      const response = await productAPI.getHistory(productId);
      setInventoryHistory(response.data);
      setShowHistory(true);
    } catch (error) {
      console.error('Error loading inventory history:', error);
    }
  };

  const closeHistory = () => {
    setShowHistory(false);
    setSelectedProductId(null);
  };

  return (
    <div className="App">
      <div className="container">
        {/* ENHANCED HEADER SECTION - UPDATE THIS */}
        <div className="premium-header">
          <h1>Product Inventory Management</h1>
          <p>Manage your products efficiently with real-time insights</p>
        </div>

        {/* DASHBOARD STATS - ADD THIS SECTION */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-number">{stats.totalProducts}</div>
            <div className="stat-label">Total Products</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.inStockProducts}</div>
            <div className="stat-label">In Stock</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.outOfStockProducts}</div>
            <div className="stat-label">Out of Stock</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.totalStock}</div>
            <div className="stat-label">Total Stock</div>
          </div>
        </div>
        
        {/* MAIN CONTENT */}
        <div className="main-content">
          <Header
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            onAddProduct={handleAddProduct}
            onImport={handleImport}
            onExport={handleExport}
            products={products} // ADD THIS PROP
          />

          {loading ? (
            <div className="loading">Loading products...</div>
          ) : (
            <ProductTable
              products={products}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onRowClick={handleRowClick}
              selectedProductId={selectedProductId}
            />
          )}

          <ProductForm
            product={editingProduct}
            onSave={handleSaveProduct}
            onCancel={() => {
              setShowProductForm(false);
              setEditingProduct(null);
            }}
            isOpen={showProductForm}
          />

          <InventoryHistory
            history={inventoryHistory}
            isOpen={showHistory}
            onClose={closeHistory}
            productName={selectedProductName}
          />
        </div>
      </div>
    </div>
  );
}

export default App;