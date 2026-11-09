import React, { useState, useEffect, useRef } from 'react';
import { X, Check, AlertCircle, Star, Sparkles, Building2, Loader2 } from 'lucide-react';
import { validateSupplier } from '../utils/validation';
import { CATEGORIES, PREDEFINED_CATEGORIES } from '../data/initialSuppliers';

export default function SupplierModal({
  isOpen,
  onClose,
  onSave,
  supplierToEdit,
  existingSuppliers = [],
  isSubmitting = false,
}) {
  const isEditing = Boolean(supplierToEdit);

  // Generate an ID for new suppliers
  const generateNewId = () => {
    const existingNums = existingSuppliers
      .map((s) => {
        const idVal = s.supplierId || s.id || '';
        const match = idVal.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      })
      .filter((n) => !isNaN(n));
    const nextNum = existingNums.length > 0 ? Math.max(...existingNums) + 1 : 101;
    return `SUP-${nextNum}`;
  };

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    city: '',
    phone: '',
    email: '',
    website: '',
    category: '',
    customCategory: '',
    rating: 4.5,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  // Sync form data on open or switch of supplierToEdit
  useEffect(() => {
    if (isOpen) {
      if (supplierToEdit) {
        const rawCategory = (supplierToEdit.category || '').trim();
        const isPredefined = PREDEFINED_CATEGORIES.includes(rawCategory);

        setFormData({
          id: supplierToEdit.supplierId || supplierToEdit.id || '',
          name: supplierToEdit.name || '',
          city: supplierToEdit.city || '',
          phone: supplierToEdit.phone || '',
          email: supplierToEdit.email || '',
          website: supplierToEdit.website || '',
          category: isPredefined ? rawCategory : 'Other',
          customCategory: isPredefined ? '' : rawCategory,
          rating: supplierToEdit.rating !== undefined ? supplierToEdit.rating : 4.5,
        });
      } else {
        setFormData({
          id: generateNewId(),
          name: '',
          city: '',
          phone: '',
          email: '',
          website: '',
          category: PREDEFINED_CATEGORIES[0] || 'Electronics',
          customCategory: '',
          rating: 4.5,
        });
      }
      setErrors({});
      setTouched({});

      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, supplierToEdit]);

  // Handle ESC key press to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isSubmitting]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };

    // If changing category away from 'Other', clear customCategory error
    if (field === 'category' && value !== 'Other') {
      updated.customCategory = '';
      setErrors((prev) => {
        const next = { ...prev };
        delete next.customCategory;
        return next;
      });
    }

    setFormData(updated);

    if (touched[field]) {
      const { errors: newErrors } = validateSupplier(
        updated,
        existingSuppliers,
        isEditing,
        supplierToEdit?.supplierId || supplierToEdit?.id
      );
      setErrors(newErrors);
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const { errors: newErrors } = validateSupplier(
      formData,
      existingSuppliers,
      isEditing,
      supplierToEdit?.supplierId || supplierToEdit?.id
    );
    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setTouched({
      id: true,
      name: true,
      city: true,
      phone: true,
      email: true,
      category: true,
      customCategory: true,
      rating: true,
    });

    const { isValid, errors: validationErrors } = validateSupplier(
      formData,
      existingSuppliers,
      isEditing,
      supplierToEdit?.supplierId || supplierToEdit?.id
    );

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    // Determine the actual category to save:
    // If 'Other' is chosen, save the custom category entered by the user
    const finalCategory =
      formData.category === 'Other'
        ? formData.customCategory.trim()
        : formData.category.trim();

    onSave({
      supplierId: formData.id.trim().toUpperCase(),
      name: formData.name.trim(),
      city: formData.city.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim().toLowerCase(),
      website: formData.website?.trim() || undefined,
      category: finalCategory,
      rating: parseFloat(formData.rating),
    });
  };

  const ratingValue = parseFloat(formData.rating) || 0;

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-supplier-title"
    >
      <div className="modal-dialog" ref={modalRef}>
        <div className="modal-header">
          <h2 id="modal-supplier-title">
            <Building2 size={20} style={{ color: 'var(--primary)' }} />
            {isEditing
              ? `Edit Supplier (${supplierToEdit.supplierId || supplierToEdit.id})`
              : 'Add New Supplier'}
          </h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            <div className="form-grid">
              {/* Supplier ID */}
              <div className="form-group">
                <label className="form-label" htmlFor="supplier-id">
                  <span>
                    Supplier ID <span className="required-asterisk">*</span>
                  </span>
                  {!isEditing && (
                    <button
                      type="button"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--primary)',
                        cursor: 'pointer',
                        fontSize: '0.74rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '2px',
                        fontWeight: 600,
                      }}
                      onClick={() => handleChange('id', generateNewId())}
                      disabled={isSubmitting}
                    >
                      <Sparkles size={11} /> Auto ID
                    </button>
                  )}
                </label>
                <input
                  id="supplier-id"
                  type="text"
                  className={`form-control ${errors.id && touched.id ? 'input-error' : ''}`}
                  placeholder="e.g. SUP-101"
                  value={formData.id}
                  onChange={(e) => handleChange('id', e.target.value)}
                  onBlur={() => handleBlur('id')}
                  ref={firstInputRef}
                  disabled={isEditing || isSubmitting}
                  title={isEditing ? 'Supplier ID cannot be changed' : ''}
                />
                {errors.id && touched.id ? (
                  <div className="field-error-msg">
                    <AlertCircle size={13} />
                    <span>{errors.id}</span>
                  </div>
                ) : (
                  <div className="field-hint">Unique alphanumeric supplier code</div>
                )}
              </div>

              {/* Category */}
              <div className="form-group">
                <label className="form-label" htmlFor="supplier-category">
                  <span>
                    Category <span className="required-asterisk">*</span>
                  </span>
                </label>
                <select
                  id="supplier-category"
                  className={`form-control ${errors.category && touched.category ? 'input-error' : ''}`}
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  onBlur={() => handleBlur('category')}
                  disabled={isSubmitting}
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && touched.category && (
                  <div className="field-error-msg">
                    <AlertCircle size={13} />
                    <span>{errors.category}</span>
                  </div>
                )}
              </div>

              {/* Specify Custom Category (Appears only when "Other" is selected) */}
              {formData.category === 'Other' && (
                <div className="form-group form-group-full">
                  <label className="form-label" htmlFor="supplier-custom-category">
                    <span>
                      Specify Category <span className="required-asterisk">*</span>
                    </span>
                  </label>
                  <input
                    id="supplier-custom-category"
                    type="text"
                    className={`form-control ${errors.customCategory && touched.customCategory ? 'input-error' : ''}`}
                    placeholder="e.g. Solar Energy, Handicrafts, Spices, Automotive"
                    value={formData.customCategory}
                    onChange={(e) => handleChange('customCategory', e.target.value)}
                    onBlur={() => handleBlur('customCategory')}
                    disabled={isSubmitting}
                  />
                  {errors.customCategory && touched.customCategory ? (
                    <div className="field-error-msg">
                      <AlertCircle size={13} />
                      <span>{errors.customCategory}</span>
                    </div>
                  ) : (
                    <div className="field-hint">
                      Enter a custom industry or product category name
                    </div>
                  )}
                </div>
              )}

              {/* Supplier Name */}
              <div className="form-group form-group-full">
                <label className="form-label" htmlFor="supplier-name">
                  <span>
                    Supplier Name <span className="required-asterisk">*</span>
                  </span>
                </label>
                <input
                  id="supplier-name"
                  type="text"
                  className={`form-control ${errors.name && touched.name ? 'input-error' : ''}`}
                  placeholder="e.g. Apex Industrial Solutions India"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  disabled={isSubmitting}
                />
                {errors.name && touched.name && (
                  <div className="field-error-msg">
                    <AlertCircle size={13} />
                    <span>{errors.name}</span>
                  </div>
                )}
              </div>

              {/* City (India-focused examples) */}
              <div className="form-group">
                <label className="form-label" htmlFor="supplier-city">
                  <span>
                    City <span className="required-asterisk">*</span>
                  </span>
                </label>
                <input
                  id="supplier-city"
                  type="text"
                  className={`form-control ${errors.city && touched.city ? 'input-error' : ''}`}
                  placeholder="e.g. Panaji, Mumbai, Bengaluru"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  onBlur={() => handleBlur('city')}
                  disabled={isSubmitting}
                />
                {errors.city && touched.city && (
                  <div className="field-error-msg">
                    <AlertCircle size={13} />
                    <span>{errors.city}</span>
                  </div>
                )}
              </div>

              {/* Phone (India-focused: +91 98765 43210 or 10 digits) */}
              <div className="form-group">
                <label className="form-label" htmlFor="supplier-phone">
                  <span>
                    Phone <span className="required-asterisk">*</span>
                  </span>
                </label>
                <input
                  id="supplier-phone"
                  type="tel"
                  className={`form-control ${errors.phone && touched.phone ? 'input-error' : ''}`}
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  disabled={isSubmitting}
                />
                {errors.phone && touched.phone ? (
                  <div className="field-error-msg">
                    <AlertCircle size={13} />
                    <span>{errors.phone}</span>
                  </div>
                ) : (
                  <div className="field-hint">Indian 10-digit mobile (e.g. +91 98765 43210)</div>
                )}
              </div>

              {/* Email (Indian placeholder example) */}
              <div className="form-group form-group-full">
                <label className="form-label" htmlFor="supplier-email">
                  <span>
                    Email Address <span className="required-asterisk">*</span>
                  </span>
                </label>
                <input
                  id="supplier-email"
                  type="email"
                  className={`form-control ${errors.email && touched.email ? 'input-error' : ''}`}
                  placeholder="e.g. sales@supplier.in"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  disabled={isSubmitting}
                />
                {errors.email && touched.email && (
                  <div className="field-error-msg">
                    <AlertCircle size={13} />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              {/* Website (optional, enables $exists testing) */}
              <div className="form-group form-group-full">
                <label className="form-label" htmlFor="supplier-website">
                  <span>Website (optional)</span>
                </label>
                <input
                  id="supplier-website"
                  type="url"
                  className="form-control"
                  placeholder="e.g. https://apexcomponents.in"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              {/* Rating */}
              <div className="form-group form-group-full">
                <label className="form-label" htmlFor="supplier-rating">
                  <span>
                    Rating (0.0 to 5.0) <span className="required-asterisk">*</span>
                  </span>
                </label>
                <div className="rating-picker-wrapper">
                  <div className="rating-stars-input" aria-label="Quick star rating selector">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star-picker-btn ${star <= Math.round(ratingValue) ? 'active' : ''}`}
                        onClick={() => handleChange('rating', star.toFixed(1))}
                        title={`Set rating to ${star}.0`}
                        disabled={isSubmitting}
                      >
                        <Star size={22} fill={star <= Math.round(ratingValue) ? '#f59e0b' : 'none'} />
                      </button>
                    ))}
                  </div>

                  <input
                    id="supplier-rating"
                    type="number"
                    min="0"
                    max="5.0"
                    step="0.1"
                    className={`form-control ${errors.rating && touched.rating ? 'input-error' : ''}`}
                    style={{ maxWidth: '100px' }}
                    value={formData.rating}
                    onChange={(e) => handleChange('rating', e.target.value)}
                    onBlur={() => handleBlur('rating')}
                    disabled={isSubmitting}
                  />
                  <span className="rating-number-preview">
                    ★ {parseFloat(formData.rating || 0).toFixed(1)}
                  </span>
                </div>
                {errors.rating && touched.rating && (
                  <div className="field-error-msg">
                    <AlertCircle size={13} />
                    <span>{errors.rating}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="spinner" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>{isEditing ? 'Save Changes' : 'Create Supplier'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
