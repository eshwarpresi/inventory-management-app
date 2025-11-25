import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const productAPI = {
  // Get all products
  getAll: (params = {}) => api.get('/products', { params }),
  
  // Search products
  search: (name) => api.get(`/products/search?name=${name}`),
  
  // Get product by ID
  getById: (id) => api.get(`/products/${id}`),
  
  // Create product
  create: (product) => api.post('/products', product),
  
  // Update product
  update: (id, product) => api.put(`/products/${id}`, product),
  
  // Delete product
  delete: (id) => api.delete(`/products/${id}`),
  
  // Import products
  import: (file) => {
    const formData = new FormData();
    formData.append('csvFile', file);
    return api.post('/products/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Export products
  export: () => api.get('/products/export', { responseType: 'blob' }),
  
  // Get inventory history
  getHistory: (id) => api.get(`/products/${id}/history`)
};

export default api;