import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  limit = 10,
  onPageChange,
  onLimitChange,
}) {
  const isAll = limit === 0 || limit === 'all';
  const limitNum = isAll ? totalItems : parseInt(limit, 10) || 10;

  const startItem = totalItems === 0 ? 0 : isAll ? 1 : (currentPage - 1) * limitNum + 1;
  const endItem = isAll ? totalItems : Math.min(currentPage * limitNum, totalItems);

  return (
    <div className="pagination-bar" aria-label="Table pagination navigation">
      <div className="pagination-info">
        Showing <strong>{startItem}</strong> – <strong>{endItem}</strong> of{' '}
        <strong>{totalItems}</strong> suppliers
      </div>

      <div className="pagination-controls">
        <div className="pagination-limit-wrapper">
          <label htmlFor="limit-select" className="pagination-limit-label">
            Rows per page:
          </label>
          <select
            id="limit-select"
            className="pagination-limit-select"
            value={limit}
            onChange={(e) => onLimitChange(e.target.value)}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="all">All</option>
          </select>
        </div>

        {!isAll && totalPages > 1 && (
          <div className="pagination-buttons">
            <button
              type="button"
              className="btn-page"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
              <span>Prev</span>
            </button>

            <span className="pagination-page-indicator">
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>

            <button
              type="button"
              className="btn-page"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              aria-label="Next page"
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

