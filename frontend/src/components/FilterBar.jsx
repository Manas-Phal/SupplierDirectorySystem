import React from 'react';
import { Search, ChevronDown, ChevronUp, X, SlidersHorizontal } from 'lucide-react';
import AdvancedFilters from './AdvancedFilters';

const getSortLabel = (field, direction) => {
  const map = {
    'name-asc': 'Name (A → Z)',
    'name-desc': 'Name (Z → A)',
    'rating-desc': 'Rating (High → Low)',
    'rating-asc': 'Rating (Low → High)',
    'supplierId-asc': 'Supplier ID (A → Z)',
    'supplierId-desc': 'Supplier ID (Z → A)',
    'city-asc': 'City (A → Z)',
    'city-desc': 'City (Z → A)',
    'category-asc': 'Category (A → Z)',
    'category-desc': 'Category (Z → A)',
    'createdAt-desc': 'Newest Added First',
    'createdAt-asc': 'Oldest Added First',
  };
  return map[`${field}-${direction}`] || `${field} (${direction})`;
};

export default function FilterBar({
  searchTerm,
  onSearchChange,
  selectedCity,
  onCityChange,
  selectedCategory,
  onCategoryChange,
  selectedRating,
  onRatingChange,
  sortField = 'name',
  sortDirection = 'asc',
  onSortChange,
  availableCities = [],
  availableCategories = [],
  onResetFilters,
  totalResults,
  totalSuppliers,
  // Advanced filters props
  isAdvancedOpen,
  onToggleAdvanced,
  activeAdvancedCount = 0,
  advancedProps = {},
}) {
  const isBasicFiltered = Boolean(
    searchTerm.trim() ||
    selectedCity !== 'ALL' ||
    selectedCategory !== 'ALL' ||
    selectedRating !== 'ALL'
  );

  const isSortChanged = sortField !== 'name' || sortDirection !== 'asc';
  const isAnyFiltered = isBasicFiltered || activeAdvancedCount > 0 || isSortChanged;

  return (
    <div className="controls-card">
      <div className="controls-row">
        {/* Search input */}
        <div className="search-box-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by Supplier ID (e.g. SUP-101) or Name..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search suppliers"
          />
          {searchTerm && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="filters-group">
          {/* City Filter */}
          <div className={`filter-select-wrapper ${selectedCity !== 'ALL' ? 'active-filter' : ''}`}>
            <select
              className="filter-select"
              value={selectedCity}
              onChange={(e) => onCityChange(e.target.value)}
              aria-label="Filter by City"
            >
              <option value="ALL">All Cities</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="select-chevron" />
          </div>

          {/* Category Filter */}
          <div className={`filter-select-wrapper ${selectedCategory !== 'ALL' ? 'active-filter' : ''}`}>
            <select
              className="filter-select"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              aria-label="Filter by Category"
            >
              <option value="ALL">All Categories</option>
              {availableCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="select-chevron" />
          </div>

          {/* Rating Filter */}
          <div className={`filter-select-wrapper ${selectedRating !== 'ALL' ? 'active-filter' : ''}`}>
            <select
              className="filter-select"
              value={selectedRating}
              onChange={(e) => onRatingChange(e.target.value)}
              aria-label="Filter by Minimum Rating"
            >
              <option value="ALL">All Ratings</option>
              <option value="4.5">★ 4.5 & above</option>
              <option value="4.0">★ 4.0 & above</option>
              <option value="3.5">★ 3.5 & above</option>
              <option value="3.0">★ 3.0 & above</option>
            </select>
            <ChevronDown size={16} className="select-chevron" />
          </div>

          {/* Sort By Dropdown */}
          <div className={`filter-select-wrapper ${isSortChanged ? 'active-filter' : ''}`}>
            <select
              className="filter-select"
              value={`${sortField}-${sortDirection}`}
              onChange={(e) => onSortChange && onSortChange(e.target.value)}
              aria-label="Sort Suppliers"
              title="Sort suppliers by rating, name, city, category, or ID"
            >
              <option value="name-asc">Sort: Name (A → Z)</option>
              <option value="name-desc">Sort: Name (Z → A)</option>
              <option value="rating-desc">Sort: Rating (High → Low)</option>
              <option value="rating-asc">Sort: Rating (Low → High)</option>
              <option value="supplierId-asc">Sort: Supplier ID (A → Z)</option>
              <option value="supplierId-desc">Sort: Supplier ID (Z → A)</option>
              <option value="city-asc">Sort: City (A → Z)</option>
              <option value="city-desc">Sort: City (Z → A)</option>
              <option value="category-asc">Sort: Category (A → Z)</option>
              <option value="category-desc">Sort: Category (Z → A)</option>
              <option value="createdAt-desc">Sort: Newest Added First</option>
              <option value="createdAt-asc">Sort: Oldest Added First</option>
            </select>
            <ChevronDown size={16} className="select-chevron" />
          </div>

          {/* Advanced Filters Toggle Button */}
          <button
            type="button"
            className={`btn btn-secondary ${isAdvancedOpen ? 'active-adv-btn' : ''}`}
            onClick={onToggleAdvanced}
            title="Toggle Advanced MongoDB Query Operators"
          >
            <SlidersHorizontal size={15} />
            <span>Advanced</span>
            {activeAdvancedCount > 0 && (
              <span className="adv-btn-badge">{activeAdvancedCount}</span>
            )}
            {isAdvancedOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {/* Reset All Filters */}
          {isAnyFiltered && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onResetFilters}
              title="Clear all filters"
            >
              <X size={15} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Collapsible Advanced Filters Section */}
      <AdvancedFilters
        isOpen={isAdvancedOpen}
        availableCities={availableCities}
        availableCategories={availableCategories}
        activeCount={activeAdvancedCount}
        {...advancedProps}
      />

      {/* Status & Active Chips */}
      <div className="filter-status-row">
        <div>
          Showing <strong>{totalResults}</strong> of <strong>{totalSuppliers}</strong> suppliers
          {isAnyFiltered && <span style={{ color: 'var(--text-muted)' }}> (filtered)</span>}
        </div>

        {isAnyFiltered && (
          <div className="active-filter-chips">
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Active filters:</span>
            {searchTerm && (
              <span className="filter-chip">
                Search: "{searchTerm}"
                <button type="button" onClick={() => onSearchChange('')} aria-label="Remove search filter">
                  <X size={12} />
                </button>
              </span>
            )}
            {selectedCity !== 'ALL' && (
              <span className="filter-chip">
                City: {selectedCity}
                <button type="button" onClick={() => onCityChange('ALL')} aria-label="Remove city filter">
                  <X size={12} />
                </button>
              </span>
            )}
            {selectedCategory !== 'ALL' && (
              <span className="filter-chip">
                Category: {selectedCategory}
                <button type="button" onClick={() => onCategoryChange('ALL')} aria-label="Remove category filter">
                  <X size={12} />
                </button>
              </span>
            )}
            {selectedRating !== 'ALL' && (
              <span className="filter-chip">
                Rating: ≥ {selectedRating}★
                <button type="button" onClick={() => onRatingChange('ALL')} aria-label="Remove rating filter">
                  <X size={12} />
                </button>
              </span>
            )}
            {isSortChanged && (
              <span className="filter-chip">
                Sorted: {getSortLabel(sortField, sortDirection)}
                <button type="button" onClick={() => onSortChange && onSortChange('name-asc')} aria-label="Reset sorting to Name A-Z">
                  <X size={12} />
                </button>
              </span>
            )}

            {/* Advanced Filters active chips */}
            {advancedProps?.advRating && (
              <span className="filter-chip">
                Rating {advancedProps.ratingOp} {advancedProps.advRating}
                <button type="button" onClick={() => advancedProps?.onAdvRatingChange?.('')} aria-label="Remove rating operator filter">
                  <X size={12} />
                </button>
              </span>
            )}

            {advancedProps?.selectedInCities?.length > 0 && (
              <span className="filter-chip">
                Cities in: [{advancedProps.selectedInCities.join(', ')}]
                <button type="button" onClick={() => advancedProps?.onResetInCities?.()} aria-label="Remove in-cities filter">
                  <X size={12} />
                </button>
              </span>
            )}

            {advancedProps?.selectedNinCities?.length > 0 && (
              <span className="filter-chip chip-danger">
                Not in cities: [{advancedProps.selectedNinCities.join(', ')}]
                <button type="button" onClick={() => advancedProps?.onResetNinCities?.()} aria-label="Remove nin-cities filter">
                  <X size={12} />
                </button>
              </span>
            )}

            {advancedProps?.selectedNinCategories?.length > 0 && (
              <span className="filter-chip chip-danger">
                Not in categories: [{advancedProps.selectedNinCategories.join(', ')}]
                <button type="button" onClick={() => advancedProps?.onResetNinCategories?.()} aria-label="Remove nin-categories filter">
                  <X size={12} />
                </button>
              </span>
            )}

            {advancedProps?.excludeName && (
              <span className="filter-chip chip-danger">
                Name $not: "{advancedProps.excludeName}"
                <button type="button" onClick={() => advancedProps?.onExcludeNameChange?.('')} aria-label="Remove exclude-name filter">
                  <X size={12} />
                </button>
              </span>
            )}

            {(advancedProps?.norCity || advancedProps?.norCategory) && (
              <span className="filter-chip chip-danger">
                $nor: [{[advancedProps?.norCity, advancedProps?.norCategory].filter(Boolean).join(' | ')}]
                <button type="button" onClick={() => { advancedProps?.onNorCityChange?.(''); advancedProps?.onNorCategoryChange?.(''); }} aria-label="Remove nor filter">
                  <X size={12} />
                </button>
              </span>
            )}

            {advancedProps?.existsField && (
              <span className="filter-chip">
                {advancedProps.existsField} $exists: {advancedProps.existsValue}
                <button type="button" onClick={() => advancedProps?.onExistsFieldChange?.('')} aria-label="Remove exists filter">
                  <X size={12} />
                </button>
              </span>
            )}

            {advancedProps?.typeField && (
              <span className="filter-chip">
                {advancedProps.typeField} $type: {advancedProps.typeValue}
                <button type="button" onClick={() => advancedProps?.onTypeFieldChange?.('')} aria-label="Remove type filter">
                  <X size={12} />
                </button>
              </span>
            )}

            {advancedProps?.matchMode === 'or' && (
              <span className="filter-chip" style={{ background: '#fef3c7', color: '#92400e', borderColor: '#fde68a' }}>
                Mode: $or (ANY)
                <button type="button" onClick={() => advancedProps?.onMatchModeChange?.('and')} aria-label="Switch to and mode">
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
