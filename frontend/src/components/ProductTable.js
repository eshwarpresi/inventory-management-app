import React, { useState } from 'react';
import './ProductTable.css';

const ProductTable = ({ 
  products, 
  onEdit, 
  onDelete, 
  onRowClick,
  selectedProductId 
}) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (sortField === 'stock' || sortField === 'price') {
      aValue = parseFloat(aValue) || 0;
      bValue = parseFloat(bValue) || 0;
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const getStockLevel = (stock) => {
    if (stock === 0) return 'out-of-stock';
    if (stock < 10) return 'low-stock';
    if (stock < 25) return 'medium-stock';
    return 'high-stock';
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>Products List ({products.length} items)</h2>
        <div className="table-actions">
          <div className="table-info">
            Showing {sortedProducts.length} of {products.length} products
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="enhanced-table">
          <thead>
            <tr>
              <th className="column-image">Image</th>
              <th className="column-name sortable" onClick={() => handleSort('name')}>
                Name {getSortIcon('name')}
              </th>
              <th className="column-unit sortable" onClick={() => handleSort('unit')}>
                Unit {getSortIcon('unit')}
              </th>
              <th className="column-category sortable" onClick={() => handleSort('category')}>
                Category {getSortIcon('category')}
              </th>
              <th className="column-brand sortable" onClick={() => handleSort('brand')}>
                Brand {getSortIcon('brand')}
              </th>
              <th className="column-stock sortable" onClick={() => handleSort('stock')}>
                Stock {getSortIcon('stock')}
              </th>
              <th className="column-status">Status</th>
              <th className="column-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product) => (
              <tr 
                key={product.id} 
                className={`table-row ${selectedProductId === product.id ? 'selected' : ''} ${getStockLevel(product.stock)}`}
                onClick={() => onRowClick(product.id)}
              >
                <td className="column-image">
                  <div className="product-image-container">
                    <img 
                      src={product.image || '/placeholder-image.png'} 
                      alt={product.name}
                      className="product-image"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAzNEMzMy4zMTM3IDM0IDM2IDMxLjMxMzcgMzYgMjhDMzYgMjQuNjg2MyAzMy4zMTM3IDIyIDMwIDIyQzI2LjY4NjMgMjIgMjQgMjQuNjg2MyAyNCAyOEMyNCAzMS4zMTM3IDI2LjY4NjMgMzQgMzAgMzRaIiBmaWxsPSIjOEM5M0FCIi8+CjxwYXRoIGQ9Ik0zNiAzNkg0NkM0Ny4xMDQ2IDM2IDQ4IDM1LjEwNDYgNDggMzRWMTZDMzYgMTYgMzYgMzYgMzYgMzZaIiBmaWxsPSIjOEM5M0FCIi8+Cjwvc3ZnPgo=';
                      }}
                    />
                  </div>
                </td>
                <td className="column-name">
                  <div className="product-name">{product.name}</div>
                  {product.description && (
                    <div className="product-description">{product.description}</div>
                  )}
                </td>
                <td className="column-unit">
                  <span className="unit-badge">{product.unit}</span>
                </td>
                <td className="column-category">
                  <span className="category-tag">{product.category}</span>
                </td>
                <td className="column-brand">
                  <span className="brand-name">{product.brand}</span>
                </td>
                <td className="column-stock">
                  <div className="stock-info">
                    <span className={`stock-level ${getStockLevel(product.stock)}`}>
                      {product.stock}
                    </span>
                    {product.stock > 0 && (
                      <div className="stock-bar">
                        <div 
                          className={`stock-fill ${getStockLevel(product.stock)}`}
                          style={{ 
                            width: `${Math.min(100, (product.stock / 100) * 100)}%` 
                          }}
                        ></div>
                      </div>
                    )}
                  </div>
                </td>
                <td className="column-status">
                  <span className={`status-badge ${product.status === 'In Stock' ? 'in-stock' : 'out-of-stock'}`}>
                    {product.status}
                  </span>
                </td>
                <td className="column-actions">
                  <div className="action-buttons">
                    <button 
                      className="btn-action btn-edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(product);
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className="btn-action btn-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(product.id);
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {products.length === 0 && (
        <div className="no-products">
          <div className="no-products-icon">📦</div>
          <h3>No products found</h3>
          <p>Add some products or import from CSV to get started.</p>
        </div>
      )}
    </div>
  );
};

export default ProductTable;