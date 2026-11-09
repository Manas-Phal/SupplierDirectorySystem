import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import FilterBar from './components/FilterBar';
import SupplierTable from './components/SupplierTable';
import SupplierModal from './components/SupplierModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import { PREDEFINED_CATEGORIES } from './data/initialSuppliers';
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from './services/api';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  // 1. Core State
  const [suppliers, setSuppliers] = useState([]);
  const [totalDatabaseCount, setTotalDatabaseCount] = useState(0);
  const [totalMatchingCount, setTotalMatchingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  // 2. Search, Filter & Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedRating, setSelectedRating] = useState('ALL');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // 3. Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState('10');
  const [totalPages, setTotalPages] = useState(1);

  // 4. Advanced Filters State (MongoDB Operators)
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [ratingOp, setRatingOp] = useState('gte'); // eq, ne, gt, gte, lt, lte
  const [advRating, setAdvRating] = useState('');
  const [selectedInCities, setSelectedInCities] = useState([]); // $in
  const [selectedNinCities, setSelectedNinCities] = useState([]); // $nin
  const [selectedInCategories, setSelectedInCategories] = useState([]); // $in
  const [selectedNinCategories, setSelectedNinCategories] = useState([]); // $nin
  const [excludeName, setExcludeName] = useState(''); // $not
  const [debouncedExcludeName, setDebouncedExcludeName] = useState('');
  const [norCity, setNorCity] = useState(''); // $nor
  const [norCategory, setNorCategory] = useState(''); // $nor
  const [existsField, setExistsField] = useState(''); // $exists
  const [existsValue, setExistsValue] = useState('true');
  const [typeField, setTypeField] = useState(''); // $type
  const [typeValue, setTypeValue] = useState('number');
  const [matchMode, setMatchMode] = useState('and'); // $and vs $or

  // Accumulated cities to keep dropdown choices intact across filter states
  const [knownCities, setKnownCities] = useState([]);

  // 5. Modal States & Operation Loaders
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState(null);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 6. Notification Toast
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  // Debounce search input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Debounce excludeName input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedExcludeName(excludeName);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [excludeName]);

  // Compute active advanced filters count
  const activeAdvancedCount = useMemo(() => {
    let count = 0;
    if (advRating.trim()) count++;
    if (selectedInCities.length > 0) count++;
    if (selectedNinCities.length > 0) count++;
    if (selectedInCategories.length > 0) count++;
    if (selectedNinCategories.length > 0) count++;
    if (debouncedExcludeName.trim()) count++;
    if (norCity || norCategory) count++;
    if (existsField.trim()) count++;
    if (typeField.trim()) count++;
    if (matchMode === 'or') count++;
    return count;
  }, [
    advRating,
    selectedInCities,
    selectedNinCities,
    selectedInCategories,
    selectedNinCategories,
    debouncedExcludeName,
    norCity,
    norCategory,
    existsField,
    typeField,
    matchMode,
  ]);

  const isBasicFiltered = Boolean(
    searchTerm.trim() ||
    selectedCity !== 'ALL' ||
    selectedCategory !== 'ALL' ||
    selectedRating !== 'ALL'
  );

  const isFiltered = isBasicFiltered || activeAdvancedCount > 0;

  // 7. Fetch Suppliers from Express Backend
  const loadSuppliers = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      // Determine effective rating and operator
      let effectiveRating = selectedRating !== 'ALL' ? selectedRating : undefined;
      let effectiveRatingOp = 'gte';

      if (advRating.trim()) {
        effectiveRating = advRating.trim();
        effectiveRatingOp = ratingOp;
      }

      const res = await getSuppliers({
        search: debouncedSearch,
        city: selectedCity,
        category: selectedCategory,
        rating: effectiveRating,
        ratingOp: effectiveRatingOp,
        cities: selectedInCities,
        categories: selectedInCategories,
        excludeCities: selectedNinCities,
        excludeCategories: selectedNinCategories,
        excludeName: debouncedExcludeName,
        norCity,
        norCategory,
        existsField,
        existsValue,
        typeField,
        typeValue,
        matchMode,
        sortBy: sortField,
        order: sortDirection,
        page: currentPage,
        limit: pageSize,
      });

      setSuppliers(Array.isArray(res?.data) ? res.data : []);
      setTotalMatchingCount(typeof res?.total === 'number' ? res.total : 0);
      setTotalPages(typeof res?.totalPages === 'number' ? res.totalPages : 1);
      setConnectionError(null);

      // Accumulate unique cities for dropdown options
      if (Array.isArray(res?.data) && res.data.length > 0) {
        setKnownCities((prev) => {
          const list = Array.isArray(prev) ? prev : [];
          const combined = new Set([...list, ...res.data.map((s) => s.city?.trim()).filter(Boolean)]);
          return Array.from(combined).sort();
        });
      }

      // Update total unfiltered count if no filters are active
      if (!isFiltered) {
        setTotalDatabaseCount(typeof res?.total === 'number' ? res.total : 0);
      }
    } catch (err) {
      console.error('[Error fetching suppliers]:', err);
      const errorMessage =
        err.message || 'Unable to connect to backend server. Make sure MongoDB and Express are running.';
      setConnectionError(errorMessage);
      showToast(errorMessage, 'danger');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [
    debouncedSearch,
    selectedCity,
    selectedCategory,
    selectedRating,
    advRating,
    ratingOp,
    selectedInCities,
    selectedInCategories,
    selectedNinCities,
    selectedNinCategories,
    debouncedExcludeName,
    norCity,
    norCategory,
    existsField,
    existsValue,
    typeField,
    typeValue,
    matchMode,
    sortField,
    sortDirection,
    currentPage,
    pageSize,
    isFiltered,
    showToast,
  ]);

  // Load suppliers on filter, search, sort, or pagination changes
  useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  // Initial load of master counts and cities when app boots
  useEffect(() => {
    getSuppliers({ limit: 0 })
      .then((res) => {
        if (res && typeof res.total === 'number') {
          setTotalDatabaseCount(res.total);
        }
        if (res && Array.isArray(res.data)) {
          const cities = new Set(res.data.map((s) => s.city?.trim()).filter(Boolean));
          setKnownCities(Array.from(cities).sort());
        }
      })
      .catch((err) => {
        console.warn('[Initial supplier load non-fatal warning]:', err.message);
      });
  }, []);

  // Available categories: predefined list + any custom categories in data
  const availableCategories = useMemo(() => {
    const list = Array.isArray(suppliers) ? suppliers : [];
    const customCats = list
      .map((s) => s.category?.trim())
      .filter((cat) => cat && cat !== 'Other');
    const set = new Set([...PREDEFINED_CATEGORIES, ...customCats]);
    return Array.from(set).sort();
  }, [suppliers]);

  // 8. Action Handlers

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleOpenAddModal = () => {
    setSupplierToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (supplier) => {
    setSupplierToEdit(supplier);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
    setSupplierToEdit(null);
  };

  // Add / Edit Supplier via backend API
  const handleSaveSupplier = async (supplierData) => {
    setIsSubmitting(true);
    try {
      if (supplierToEdit) {
        const docId = supplierToEdit._id;
        await updateSupplier(docId, supplierData);
        showToast(`Supplier "${supplierData.name}" (${supplierData.supplierId}) updated successfully.`);
      } else {
        await createSupplier(supplierData);
        showToast(`Supplier "${supplierData.name}" (${supplierData.supplierId}) added to directory.`);
      }

      handleCloseModal();
      await loadSuppliers();
    } catch (err) {
      console.error('[Supplier Save Error]:', err);
      showToast(err.message || 'Failed to save supplier. Please check your data.', 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePromptDelete = (supplier) => {
    setSupplierToDelete(supplier);
  };

  // Delete Supplier via backend API
  const handleConfirmDelete = async (mongoId) => {
    setIsDeleting(true);
    try {
      await deleteSupplier(mongoId);
      showToast(`Supplier removed from MongoDB successfully.`, 'danger');
      setSupplierToDelete(null);
      await loadSuppliers();
    } catch (err) {
      console.error('[Supplier Delete Error]:', err);
      showToast(err.message || 'Failed to delete supplier.', 'danger');
    } finally {
      setIsDeleting(false);
    }
  };

  // Reset Advanced Filters
  const handleResetAdvanced = () => {
    setRatingOp('gte');
    setAdvRating('');
    setSelectedInCities([]);
    setSelectedNinCities([]);
    setSelectedInCategories([]);
    setSelectedNinCategories([]);
    setExcludeName('');
    setDebouncedExcludeName('');
    setNorCity('');
    setNorCategory('');
    setExistsField('');
    setExistsValue('true');
    setTypeField('');
    setTypeValue('number');
    setMatchMode('and');
    setCurrentPage(1);
  };

  // Reset All Filters (Basic + Advanced)
  const handleResetFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setSelectedCity('ALL');
    setSelectedCategory('ALL');
    setSelectedRating('ALL');
    handleResetAdvanced();
    setCurrentPage(1);
  };

  // In / Nin toggle helpers
  const handleToggleInCity = (city) => {
    setSelectedInCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
    setCurrentPage(1);
  };

  const handleToggleNinCity = (city) => {
    setSelectedNinCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
    setCurrentPage(1);
  };

  const handleToggleInCat = (cat) => {
    setSelectedInCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    setCurrentPage(1);
  };

  const handleToggleNinCat = (cat) => {
    setSelectedNinCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    setCurrentPage(1);
  };

  const handleManualRefresh = () => {
    loadSuppliers(true);
  };

  // Pack advanced props for FilterBar
  const advancedProps = {
    ratingOp,
    onRatingOpChange: (val) => { setRatingOp(val); setCurrentPage(1); },
    advRating,
    onAdvRatingChange: (val) => { setAdvRating(val); setCurrentPage(1); },
    selectedInCities,
    onToggleInCity: handleToggleInCity,
    onResetInCities: () => { setSelectedInCities([]); setCurrentPage(1); },
    selectedNinCities,
    onToggleNinCity: handleToggleNinCity,
    onResetNinCities: () => { setSelectedNinCities([]); setCurrentPage(1); },
    selectedInCategories,
    onToggleInCat: handleToggleInCat,
    onResetInCategories: () => { setSelectedInCategories([]); setCurrentPage(1); },
    selectedNinCategories,
    onToggleNinCat: handleToggleNinCat,
    onResetNinCategories: () => { setSelectedNinCategories([]); setCurrentPage(1); },
    excludeName,
    onExcludeNameChange: (val) => setExcludeName(val),
    norCity,
    onNorCityChange: (val) => { setNorCity(val); setCurrentPage(1); },
    norCategory,
    onNorCategoryChange: (val) => { setNorCategory(val); setCurrentPage(1); },
    existsField,
    onExistsFieldChange: (val) => { setExistsField(val); setCurrentPage(1); },
    existsValue,
    onExistsValueChange: (val) => { setExistsValue(val); setCurrentPage(1); },
    typeField,
    onTypeFieldChange: (val) => { setTypeField(val); setCurrentPage(1); },
    typeValue,
    onTypeValueChange: (val) => { setTypeValue(val); setCurrentPage(1); },
    matchMode,
    onMatchModeChange: (val) => { setMatchMode(val); setCurrentPage(1); },
    onResetAdvanced: handleResetAdvanced,
  };

  return (
    <div className="app-container">
      {/* 1. Header with application name */}
      <Header
        onOpenAddModal={handleOpenAddModal}
        onRefresh={handleManualRefresh}
        isRefreshing={isRefreshing}
      />

      <main className="main-content">
        {/* Backend Connection Warning Banner */}
        {connectionError && (
          <div className="connection-error-banner" role="alert">
            <div className="connection-error-content">
              <AlertCircle size={20} className="connection-error-icon" />
              <div>
                <strong>Backend Connection Error:</strong> {connectionError}
                <div style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '2px' }}>
                  Ensure MongoDB Community Server and Express (port 5000) are running.
                </div>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => loadSuppliers()}
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              <RefreshCw size={13} />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* 2. Dashboard summary cards */}
        <SummaryCards suppliers={suppliers} />

        {/* 3 & 4. Search bar, Filter dropdowns & Advanced Filters */}
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCity={selectedCity}
          onCityChange={(c) => { setSelectedCity(c); setCurrentPage(1); }}
          selectedCategory={selectedCategory}
          onCategoryChange={(c) => { setSelectedCategory(c); setCurrentPage(1); }}
          selectedRating={selectedRating}
          onRatingChange={(r) => { setSelectedRating(r); setCurrentPage(1); }}
          availableCities={knownCities}
          availableCategories={availableCategories}
          onResetFilters={handleResetFilters}
          totalResults={totalMatchingCount}
          totalSuppliers={totalDatabaseCount || totalMatchingCount}
          isAdvancedOpen={isAdvancedOpen}
          onToggleAdvanced={() => setIsAdvancedOpen((prev) => !prev)}
          activeAdvancedCount={activeAdvancedCount}
          advancedProps={advancedProps}
        />

        {/* 5. Supplier table with Actions & Pagination */}
        <SupplierTable
          suppliers={suppliers}
          isLoading={isLoading}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onEdit={handleOpenEditModal}
          onDelete={handlePromptDelete}
          onResetFilters={handleResetFilters}
          isFiltered={isFiltered}
          onOpenAddModal={handleOpenAddModal}
          pagination={{
            page: currentPage,
            totalPages,
            total: totalMatchingCount,
            limit: pageSize,
            onPageChange: handlePageChange,
            onLimitChange: handlePageSizeChange,
          }}
        />
      </main>

      {/* Footer */}
      <footer className="footer">
        <div>
          Supplier Directory System &bull; MongoDB Query Operator Suite &bull;{' '}
          {Array.isArray(suppliers) ? suppliers.length : 0} of {totalMatchingCount} Shown
        </div>
      </footer>

      {/* 6. Add / Edit Modal */}
      <SupplierModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveSupplier}
        supplierToEdit={supplierToEdit}
        existingSuppliers={suppliers}
        isSubmitting={isSubmitting}
      />

      {/* 7. Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(supplierToDelete)}
        supplier={supplierToDelete}
        onClose={() => !isDeleting && setSupplierToDelete(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* 8. Feedback Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
