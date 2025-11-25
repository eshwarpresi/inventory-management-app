import React from 'react';
import { formatDate } from '../utils/helpers';
import './InventoryHistory.css';

const InventoryHistory = ({ history, isOpen, onClose, productName }) => {
  if (!isOpen) return null;

  return (
    <div className="sidebar-overlay">
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Inventory History - {productName}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="history-content">
          {history.length === 0 ? (
            <div className="no-history">
              <p>No inventory history found for this product.</p>
            </div>
          ) : (
            <div className="history-list">
              {history.map((record) => (
                <div key={record.id} className="history-item">
                  <div className="history-change">
                    <span className="old-stock">{record.old_stock}</span>
                    <span className="arrow">→</span>
                    <span className="new-stock">{record.new_stock}</span>
                  </div>
                  <div className="history-meta">
                    <span className="changed-by">By {record.changed_by}</span>
                    <span className="timestamp">{formatDate(record.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryHistory;