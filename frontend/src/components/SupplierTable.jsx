import React from 'react';
import {
  Edit3,
  Trash2,
  Star,
  MapPin,
  Phone,
  Mail,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  SearchX,
  Loader2,
  Inbox,
  Globe,
} from 'lucide-react';
import Pagination from './Pagination';

const getCategoryClass = (category) => {
  if (!category) return 'category-default';
  const slug = category.toLowerCase().replace(/\s+/g, '-');
  switch (slug) {
    case 'electronics':
      return 'category-electronics';
    case 'raw-materials':
      return 'category-raw-materials';
    case 'packaging':
      return 'category-packaging';
    case 'textiles':
      return 'category-textiles';
    case 'hardware':
      return 'category-hardware';
    case 'chemicals':
      return 'category-chemicals';
    case 'logistics':
      return 'category-logistics';
    case 'office-supplies':
      return 'category-office-supplies';
    default:
      return 'category-custom';
  }
};

export default function SupplierTable({
  suppliers = [],
  isLoading = false,
  sortField = 'createdAt',
  sortDirection = 'desc',
  onSort,
  onEdit,
  onDelete,
  onResetFilters,
  isFiltered = false,
  onOpenAddModal,
  pagination,
}) {
  const safeSuppliers = Array.isArray(suppliers) ? suppliers : [];

  const handleHeaderClick = (field) => {
    if (onSort) {
      onSort(field);
    }
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown size={14} style={{ opacity: 0.35 }} />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp size={14} style={{ color: 'var(--primary)' }} />
    ) : (
      <ArrowDown size={14} style={{ color: 'var(--primary)' }} />
    );
  };

  return (
    <div className="table-container-card">
      {isLoading ? (
        <div className="table-loading-state" aria-live="polite">
          <Loader2 size={36} className="spinner" style={{ color: 'var(--primary)' }} />
          <p>Loading suppliers from MongoDB...</p>
        </div>
      ) : safeSuppliers.length === 0 ? (
        <div className="table-empty-state">
          <div className="empty-icon-box">
            {isFiltered ? <SearchX size={32} /> : <Inbox size={32} />}
          </div>
          <h3>{isFiltered ? 'No matching suppliers found' : 'No suppliers registered yet'}</h3>
          <p>
            {isFiltered
              ? 'No records matched your search query or filter criteria. Try adjusting your search term or clearing the active filters.'
              : 'Your MongoDB supplier database is currently empty. Start by adding your first enterprise partner.'}
          </p>
          {isFiltered && onResetFilters ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onResetFilters}
            >
              Clear All Filters
            </button>
          ) : onOpenAddModal ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={onOpenAddModal}
            >
              + Add First Supplier
            </button>
          ) : null}
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="supplier-table">
              <thead>
                <tr>
                  <th
                    className="th-sortable"
                    onClick={() => handleHeaderClick('supplierId')}
                    title="Sort by Supplier ID"
                  >
                    <div className="th-inner">
                      <span>Supplier ID</span>
                      {renderSortIcon('supplierId')}
                    </div>
                  </th>

                  <th
                    className="th-sortable"
                    onClick={() => handleHeaderClick('name')}
                    title="Sort by Name"
                  >
                    <div className="th-inner">
                      <span>Name</span>
                      {renderSortIcon('name')}
                    </div>
                  </th>

                  <th
                    className="th-sortable"
                    onClick={() => handleHeaderClick('city')}
                    title="Sort by City"
                  >
                    <div className="th-inner">
                      <span>City</span>
                      {renderSortIcon('city')}
                    </div>
                  </th>

                  <th>
                    <div className="th-inner">
                      <span>Phone</span>
                    </div>
                  </th>

                  <th>
                    <div className="th-inner">
                      <span>Email</span>
                    </div>
                  </th>

                  <th
                    className="th-sortable"
                    onClick={() => handleHeaderClick('category')}
                    title="Sort by Category"
                  >
                    <div className="th-inner">
                      <span>Category</span>
                      {renderSortIcon('category')}
                    </div>
                  </th>

                  <th
                    className="th-sortable"
                    onClick={() => handleHeaderClick('rating')}
                    title="Sort by Rating"
                  >
                    <div className="th-inner">
                      <span>Rating</span>
                      {renderSortIcon('rating')}
                    </div>
                  </th>

                  <th style={{ textAlign: 'right' }}>
                    <div className="th-inner" style={{ justifyContent: 'flex-end' }}>
                      <span>Actions</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {safeSuppliers.map((supplier) => {
                  const displayId = supplier.supplierId || supplier.id || 'N/A';
                  const docId = supplier._id || supplier.id || displayId;
                  const initials = (supplier.name || '')
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase() || 'SP';

                  return (
                    <tr key={docId}>
                      {/* Supplier ID */}
                      <td>
                        <span className="supplier-id-badge">{displayId}</span>
                      </td>

                      {/* Name */}
                      <td>
                        <div className="supplier-name-cell">
                          <div className="supplier-avatar" aria-hidden="true">
                            {initials}
                          </div>
                          <div>
                            <span className="supplier-name-text">{supplier.name}</span>
                            {supplier.website && (
                              <a
                                href={
                                  supplier.website.startsWith('http')
                                    ? supplier.website
                                    : `https://${supplier.website}`
                                }
                                target="_blank"
                                rel="noreferrer"
                                title={`Visit ${supplier.website}`}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '2px',
                                  marginLeft: '8px',
                                  fontSize: '0.75rem',
                                  color: 'var(--primary)',
                                  textDecoration: 'none',
                                }}
                              >
                                <Globe size={12} />
                                <span>Web</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* City */}
                      <td>
                        <div className="contact-cell" style={{ cursor: 'default' }}>
                          <MapPin size={15} className="icon" />
                          <span>{supplier.city}</span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td>
                        <a
                          href={`tel:${supplier.phone}`}
                          className="contact-cell"
                          title={`Call ${supplier.phone}`}
                        >
                          <Phone size={15} className="icon" />
                          <span>{supplier.phone}</span>
                        </a>
                      </td>

                      {/* Email */}
                      <td>
                        <a
                          href={`mailto:${supplier.email}`}
                          className="contact-cell"
                          title={`Email ${supplier.email}`}
                        >
                          <Mail size={15} className="icon" />
                          <span>{supplier.email}</span>
                        </a>
                      </td>

                      {/* Category */}
                      <td>
                        <span
                          className={`category-badge ${getCategoryClass(supplier.category)}`}
                        >
                          {supplier.category}
                        </span>
                      </td>

                      {/* Rating */}
                      <td>
                        <div className="rating-pill">
                          <Star size={13} className="rating-star-icon" />
                          <span>{parseFloat(supplier.rating || 0).toFixed(1)}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div className="action-buttons-group" style={{ justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            className="btn-icon-only edit-btn"
                            onClick={() => onEdit(supplier)}
                            title={`Edit ${supplier.name}`}
                            aria-label={`Edit ${supplier.name}`}
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            type="button"
                            className="btn-icon-only delete-btn"
                            onClick={() => onDelete(supplier)}
                            title={`Delete ${supplier.name}`}
                            aria-label={`Delete ${supplier.name}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {pagination && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              limit={pagination.limit}
              onPageChange={pagination.onPageChange}
              onLimitChange={pagination.onLimitChange}
            />
          )}
        </>
      )}
    </div>
  );
}
