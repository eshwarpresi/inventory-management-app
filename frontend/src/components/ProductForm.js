import React, { useState, useEffect } from 'react';
import './ProductForm.css';

const ProductForm = ({ product, onSave, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    category: '',
    brand: '',
    stock: 0,
    image: '',
    price: 0,
    description: ''
  });

  const categories = ['Electronics', 'Furniture', 'Clothing', 'Books', 'Sports', 'Other'];
  const units = ['piece', 'kg', 'liter', 'meter', 'box', 'set', 'pair'];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        unit: product.unit || '',
        category: product.category || '',
        brand: product.brand || '',
        stock: product.stock || 0,
        image: product.image || '',
        price: product.price || 0,
        description: product.description || ''
      });
    } else {
      setFormData({
        name: '',
        unit: '',
        category: '',
        brand: '',
        stock: 0,
        image: '',
        price: 0,
        description: ''
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stock' || name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content premium-form">
        <div className="form-header">
          <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
          <p>{product ? 'Update product details' : 'Create a new product in your inventory'}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="premium-form-content">
          <div className="form-grid">
            {/* Product Basic Info */}
            <div className="form-section">
              <h3 className="section-title">Basic Information</h3>
              
              <div className="form-group premium-input">
                <label className="input-label">
                  Product Name *
                  <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="premium-input-field"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="form-group premium-input">
                <label className="input-label">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="premium-textarea"
                  placeholder="Enter product description"
                  rows="3"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="form-section">
              <h3 className="section-title">Product Details</h3>
              
              <div className="form-row">
                <div className="form-group premium-input">
                  <label className="input-label">
                    Category *
                    <span className="required-star">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="premium-select"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group premium-input">
                  <label className="input-label">
                    Unit *
                    <span className="required-star">*</span>
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="premium-select"
                    required
                  >
                    <option value="">Select Unit</option>
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group premium-input">
                  <label className="input-label">
                    Brand *
                    <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="premium-input-field"
                    placeholder="Enter brand name"
                    required
                  />
                </div>

                <div className="form-group premium-input">
                  <label className="input-label">
                    Price ($)
                  </label>
                  <div className="price-input-container">
                    <span className="currency-symbol">$</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="premium-input-field price-input"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory & Media */}
            <div className="form-section">
              <h3 className="section-title">Inventory & Media</h3>
              
              <div className="form-row">
                <div className="form-group premium-input">
                  <label className="input-label">
                    Stock Quantity *
                    <span className="required-star">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="premium-input-field"
                    placeholder="0"
                    min="0"
                    required
                  />
                  <div className="stock-indicator">
                    <div className={`stock-status ${formData.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                      {formData.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </div>
                  </div>
                </div>

                <div className="form-group premium-input">
                  <label className="input-label">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="premium-input-field"
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.image && (
                    <div className="image-preview">
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        className="preview-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions premium-actions">
            <button 
              type="button" 
              onClick={onCancel} 
              className="btn-cancel-premium"
            >
              <span className="btn-icon">←</span>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-save-premium"
            >
              <span className="btn-icon">💾</span>
              {product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;