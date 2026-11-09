/**
 * Validation rules for Supplier Form (India-focused)
 */

export const validateSupplier = (formData, existingSuppliers = [], isEditing = false, currentId = null) => {
  const errors = {};

  const supplierIdValue = formData.supplierId || formData.id || '';

  // 1. Supplier ID validation
  if (!supplierIdValue || !supplierIdValue.trim()) {
    errors.id = "Supplier ID is required.";
  } else if (!/^[A-Za-z0-9-_]+$/.test(supplierIdValue.trim())) {
    errors.id = "ID can only contain letters, numbers, hyphens, and underscores.";
  } else if (!isEditing || (supplierIdValue.trim().toUpperCase() !== currentId?.toUpperCase())) {
    const isDuplicate = existingSuppliers.some(
      (s) => (s.supplierId || s.id || '').toUpperCase() === supplierIdValue.trim().toUpperCase()
    );
    if (isDuplicate) {
      errors.id = "A supplier with this ID already exists.";
    }
  }

  // 2. Name validation
  if (!formData.name || !formData.name.trim()) {
    errors.name = "Supplier name is required.";
  } else if (formData.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  } else if (formData.name.trim().length > 70) {
    errors.name = "Name cannot exceed 70 characters.";
  }

  // 3. City validation (Supports any valid Indian city)
  if (!formData.city || !formData.city.trim()) {
    errors.city = "City is required.";
  } else if (formData.city.trim().length < 2) {
    errors.city = "City name must be at least 2 characters.";
  }

  // 4. Phone validation (Indian Phone Number)
  // Accepts 10-digit mobile numbers starting with 6-9, with optional +91, 91, or 0 prefix
  // Also accepts Indian landlines with STD code (e.g. 0832-2412345 or +91 832 2412345)
  if (!formData.phone || !formData.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else {
    const cleanedPhone = formData.phone.trim().replace(/[\s\-()]/g, '');
    
    // Indian mobile number: optional +91, 91, or 0 prefix, followed by 10 digits starting with 6, 7, 8, or 9
    const indianMobileRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
    // Indian landline with mandatory STD trunk prefix 0 or country code +91
    const indianLandlineRegex = /^(?:\+91|0)[1-9]\d{1,4}\d{6,8}$/;

    if (!indianMobileRegex.test(cleanedPhone) && !indianLandlineRegex.test(cleanedPhone)) {
      errors.phone = "Enter a valid Indian phone number (e.g. +91 98765 43210 or 9876543210).";
    }
  }

  // 5. Email validation
  if (!formData.email || !formData.email.trim()) {
    errors.email = "Email address is required.";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
  }

  // 6. Category validation (with "Other" support)
  if (!formData.category || !formData.category.trim()) {
    errors.category = "Please select a product category.";
  } else if (formData.category === 'Other') {
    // Custom category is required only when 'Other' is selected
    if (!formData.customCategory || !formData.customCategory.trim()) {
      errors.customCategory = "Please specify the custom category name.";
    } else if (formData.customCategory.trim().length < 2) {
      errors.customCategory = "Custom category must be at least 2 characters.";
    } else if (formData.customCategory.trim().length > 50) {
      errors.customCategory = "Custom category cannot exceed 50 characters.";
    }
  }

  // 7. Rating validation
  const ratingNum = parseFloat(formData.rating);
  if (formData.rating === "" || formData.rating === null || formData.rating === undefined || isNaN(ratingNum)) {
    errors.rating = "Rating is required.";
  } else if (ratingNum < 0 || ratingNum > 5.0) {
    errors.rating = "Rating must be between 0.0 and 5.0.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
