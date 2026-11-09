import React from 'react';
import { Building2, Plus, RefreshCw } from 'lucide-react';

export default function Header({ onOpenAddModal, onRefresh, isRefreshing = false }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <div className="brand-icon-wrapper" aria-hidden="true">
            <Building2 size={24} />
          </div>
          <div className="brand-text">
            <h1>
              Supplier Directory
              <span className="brand-badge">System</span>
            </h1>
            <p>Manage, evaluate, and connect with verified enterprise suppliers</p>
          </div>
        </div>

        <div className="header-actions">
          {onRefresh && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh suppliers from database"
            >
              <RefreshCw size={15} className={isRefreshing ? 'spinner' : ''} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          )}

          <button
            type="button"
            className="btn btn-primary"
            onClick={onOpenAddModal}
            id="btn-add-supplier"
          >
            <Plus size={18} />
            <span>Add Supplier</span>
          </button>
        </div>
      </div>
    </header>
  );
}
