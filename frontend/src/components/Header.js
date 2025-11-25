import React, { useRef } from 'react';
import './Header.css';

const Header = ({ 
  searchTerm, 
  onSearchChange, 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  onAddProduct, 
  onImport, 
  onExport,
  products 
}) => {
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImport(file);
    }
    e.target.value = '';
  };

  return (
    <div className="premium-header-container">
      {/* Search and Filters */}
      <div className="header-controls">
        <div className="controls-left">
          <div className="search-container">
            <div className="search-icon">🔍</div>
            <input
              type="text"
              placeholder="Search products by name, brand, or category..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="category-filter premium-select"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          
          <button 
            onClick={onAddProduct}
            className="btn-add-premium"
          >
            <span className="btn-icon">+</span>
            Add New Product
          </button>
        </div>
        
        <div className="controls-right">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".csv"
            style={{ display: 'none' }}
          />
          <button 
            onClick={handleImportClick}
            className="btn-import-premium"
          >
            <span className="btn-icon">📥</span>
            Import CSV
          </button>
          <button 
            onClick={onExport}
            className="btn-export-premium"
          >
            <span className="btn-icon">📤</span>
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;