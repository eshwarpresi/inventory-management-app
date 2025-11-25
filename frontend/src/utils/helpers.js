// Format date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

// Generate CSV template
export const generateCSVTemplate = () => {
  const headers = ['name', 'unit', 'category', 'brand', 'stock', 'status', 'image'];
  const sampleData = [
    ['Product 1', 'piece', 'Electronics', 'Brand A', '10', 'In Stock', ''],
    ['Product 2', 'piece', 'Furniture', 'Brand B', '0', 'Out of Stock', '']
  ];
  
  let csvContent = headers.join(',') + '\n';
  sampleData.forEach(row => {
    csvContent += row.join(',') + '\n';
  });
  
  return csvContent;
};

// Download CSV
export const downloadCSV = (content, filename) => {
  const blob = new Blob([content], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};