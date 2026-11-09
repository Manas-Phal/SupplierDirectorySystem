/**
 * API Service for Supplier Directory System
 * Communicates with the Express + MongoDB backend at http://localhost:5000/api
 */

const API_BASE_URL = 'http://localhost:5000/api/suppliers';
const HEALTH_URL = 'http://localhost:5000/api/health';

/**
 * Helper to parse response or extract structured backend error messages
 */
async function handleResponse(response) {
  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  if (!response.ok) {
    const errorMsg =
      data?.message ||
      (Array.isArray(data?.errors) ? data.errors.join(', ') : null) ||
      `HTTP Error ${response.status}: ${response.statusText}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Fetch suppliers from MongoDB with query parameters
 * Supports comprehensive MongoDB operators:
 * - Logical: $or, $and, $not, $nor
 * - Comparison: $eq, $ne, $gt, $gte, $lt, $lte, $in, $nin
 * - Element: $exists, $type
 * - Evaluation: $regex
 * - Pagination: page, limit
 * - Sorting: sortBy, order
 */
export async function getSuppliers({
  search,
  city,
  category,
  rating,
  ratingOp,
  cities,
  categories,
  excludeCities,
  excludeCategories,
  excludeName,
  norCity,
  norCategory,
  existsField,
  existsValue,
  typeField,
  typeValue,
  matchMode,
  sortBy,
  order,
  page,
  limit,
} = {}) {
  const params = new URLSearchParams();

  if (search && search.trim()) {
    params.append('search', search.trim());
  }
  if (city && city !== 'ALL') {
    params.append('city', city.trim());
  }
  if (category && category !== 'ALL') {
    params.append('category', category.trim());
  }
  if (rating !== undefined && rating !== null && rating !== 'ALL' && rating !== '') {
    params.append('rating', rating);
    if (ratingOp) {
      params.append('ratingOp', ratingOp);
    }
  }

  // Multi-inclusion ($in)
  if (cities && cities.length > 0) {
    params.append('cities', Array.isArray(cities) ? cities.join(',') : cities);
  }
  if (categories && categories.length > 0) {
    params.append('categories', Array.isArray(categories) ? categories.join(',') : categories);
  }

  // Exclusion ($nin, $ne)
  if (excludeCities && excludeCities.length > 0) {
    params.append('excludeCities', Array.isArray(excludeCities) ? excludeCities.join(',') : excludeCities);
  }
  if (excludeCategories && excludeCategories.length > 0) {
    params.append('excludeCategories', Array.isArray(excludeCategories) ? excludeCategories.join(',') : excludeCategories);
  }

  // Logical $not
  if (excludeName && excludeName.trim()) {
    params.append('excludeName', excludeName.trim());
  }

  // Logical $nor
  if (norCity && norCity.trim()) {
    params.append('norCity', norCity.trim());
  }
  if (norCategory && norCategory.trim()) {
    params.append('norCategory', norCategory.trim());
  }

  // Element $exists
  if (existsField && existsField.trim()) {
    params.append('existsField', existsField.trim());
    params.append('existsValue', existsValue ? 'true' : 'false');
  }

  // Element $type
  if (typeField && typeField.trim() && typeValue && typeValue.trim()) {
    params.append('typeField', typeField.trim());
    params.append('typeValue', typeValue.trim());
  }

  // Match Mode ($and vs $or)
  if (matchMode && matchMode !== 'and') {
    params.append('matchMode', matchMode);
  }

  // Sorting
  if (sortBy) {
    params.append('sortBy', sortBy);
  }
  if (order) {
    params.append('order', order);
  }

  // Pagination
  if (page) {
    params.append('page', page);
  }
  if (limit !== undefined && limit !== null) {
    params.append('limit', limit);
  }

  const queryString = params.toString();
  const url = queryString ? `${API_BASE_URL}?${queryString}` : API_BASE_URL;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const body = await handleResponse(res);
  return {
    data: body.data || [],
    total: body.total !== undefined ? body.total : (body.data || []).length,
    page: body.page || 1,
    totalPages: body.totalPages || 1,
    limit: body.limit !== undefined ? body.limit : (body.data || []).length,
    count: body.count || (body.data || []).length,
  };
}

/**
 * Fetch a single supplier by MongoDB document ID
 */
export async function getSupplierById(id) {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const body = await handleResponse(res);
  return body.data;
}

/**
 * Create a new supplier in MongoDB
 */
export async function createSupplier(supplierData) {
  const res = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(supplierData),
  });
  const body = await handleResponse(res);
  return body.data;
}

/**
 * Update an existing supplier in MongoDB by document ID
 */
export async function updateSupplier(id, supplierData) {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(supplierData),
  });
  const body = await handleResponse(res);
  return body.data;
}

/**
 * Delete a supplier from MongoDB by document ID
 */
export async function deleteSupplier(id) {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const body = await handleResponse(res);
  return body;
}

/**
 * Check backend health
 */
export async function checkBackendHealth() {
  const res = await fetch(HEALTH_URL, {
    method: 'GET',
  });
  return handleResponse(res);
}
