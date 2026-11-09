const express = require('express');
const mongoose = require('mongoose');
const Supplier = require('../models/Supplier');

const router = express.Router();

/**
 * Helper to escape regex special characters for safe MongoDB queries
 */
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * @route   GET /api/suppliers
 * @desc    Get suppliers with comprehensive MongoDB query operations
 *          Supports: $or, $and, $not, $nor, $eq, $ne, $gt, $gte, $lt, $lte,
 *          $in, $nin, $exists, $type, $regex, sorting, and pagination
 */
router.get('/', async (req, res) => {
  try {
    const {
      search,
      city,
      category,
      rating,
      ratingOp = 'gte',
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
      matchMode = 'and',
      sortBy,
      order,
      page = 1,
      limit = 10,
    } = req.query;

    const queryConditions = [];

    // 1. Text Search ($or, $regex with case-insensitivity)
    if (search && search.trim()) {
      const sanitizedSearch = escapeRegex(search.trim());
      const regex = new RegExp(sanitizedSearch, 'i');
      queryConditions.push({
        $or: [{ supplierId: regex }, { name: regex }],
      });
    }

    // 2. City Filter ($regex)
    if (city && city.trim() && city.toUpperCase() !== 'ALL') {
      const sanitizedCity = escapeRegex(city.trim());
      queryConditions.push({
        city: new RegExp(`^${sanitizedCity}$`, 'i'),
      });
    }

    // 3. Category Filter ($regex)
    if (category && category.trim() && category.toUpperCase() !== 'ALL') {
      const sanitizedCategory = escapeRegex(category.trim());
      queryConditions.push({
        category: new RegExp(`^${sanitizedCategory}$`, 'i'),
      });
    }

    // 4. Comparison Operators on Rating ($eq, $ne, $gt, $gte, $lt, $lte)
    if (rating !== undefined && rating !== null && rating !== '' && rating !== 'ALL') {
      const numericRating = parseFloat(rating);
      if (!isNaN(numericRating)) {
        const opMap = {
          eq: '$eq',
          ne: '$ne',
          gt: '$gt',
          gte: '$gte',
          lt: '$lt',
          lte: '$lte',
        };
        const mongoOp = opMap[ratingOp?.toLowerCase()] || '$gte';
        queryConditions.push({
          rating: { [mongoOp]: numericRating },
        });
      }
    }

    // 5. Multi-value Inclusion ($in for cities and categories)
    if (cities) {
      const cityList = (Array.isArray(cities) ? cities : cities.split(','))
        .map((c) => c.trim())
        .filter(Boolean);
      if (cityList.length > 0) {
        queryConditions.push({
          city: { $in: cityList.map((c) => new RegExp(`^${escapeRegex(c)}$`, 'i')) },
        });
      }
    }

    if (categories) {
      const catList = (Array.isArray(categories) ? categories : categories.split(','))
        .map((c) => c.trim())
        .filter(Boolean);
      if (catList.length > 0) {
        queryConditions.push({
          category: { $in: catList.map((c) => new RegExp(`^${escapeRegex(c)}$`, 'i')) },
        });
      }
    }

    // 6. Exclusion Comparison Operators ($nin and $ne)
    if (excludeCities) {
      const exCityList = (Array.isArray(excludeCities) ? excludeCities : excludeCities.split(','))
        .map((c) => c.trim())
        .filter(Boolean);
      if (exCityList.length > 0) {
        queryConditions.push({
          city: { $nin: exCityList.map((c) => new RegExp(`^${escapeRegex(c)}$`, 'i')) },
        });
      }
    }

    if (excludeCategories) {
      const exCatList = (Array.isArray(excludeCategories) ? excludeCategories : excludeCategories.split(','))
        .map((c) => c.trim())
        .filter(Boolean);
      if (exCatList.length > 0) {
        queryConditions.push({
          category: { $nin: exCatList.map((c) => new RegExp(`^${escapeRegex(c)}$`, 'i')) },
        });
      }
    }

    // 7. Logical Operator $not (Name pattern exclusion)
    if (excludeName && excludeName.trim()) {
      const sanitized = escapeRegex(excludeName.trim());
      queryConditions.push({
        name: { $not: new RegExp(sanitized, 'i') },
      });
    }

    // 8. Logical Operator $nor (Combined exclusion)
    if ((norCity && norCity.trim()) || (norCategory && norCategory.trim())) {
      const norClauses = [];
      if (norCity && norCity.trim()) {
        norClauses.push({ city: new RegExp(`^${escapeRegex(norCity.trim())}$`, 'i') });
      }
      if (norCategory && norCategory.trim()) {
        norClauses.push({ category: new RegExp(`^${escapeRegex(norCategory.trim())}$`, 'i') });
      }
      if (norClauses.length > 0) {
        queryConditions.push({ $nor: norClauses });
      }
    }

    // 9. Element Operator $exists
    if (existsField && existsField.trim()) {
      const allowedFields = ['website', 'email', 'phone', 'city', 'category', 'rating'];
      const field = existsField.trim();
      if (allowedFields.includes(field)) {
        const isTrue = existsValue === 'true' || existsValue === true || existsValue === '1';
        queryConditions.push({
          [field]: { $exists: isTrue },
        });
      }
    }

    // 10. Element Operator $type
    if (typeField && typeValue) {
      const allowedFields = ['rating', 'name', 'city', 'phone', 'email', 'category', 'createdAt'];
      const allowedTypes = ['number', 'string', 'date', 'bool', 'null'];
      const field = typeField.trim();
      const type = typeValue.trim().toLowerCase();
      if (allowedFields.includes(field) && allowedTypes.includes(type)) {
        queryConditions.push({
          [field]: { $type: type },
        });
      }
    }

    // 11. Logical Operators $and / $or (matchMode)
    let filter = {};
    if (queryConditions.length > 0) {
      if (matchMode?.toLowerCase() === 'or' && queryConditions.length > 1) {
        filter = { $or: queryConditions };
      } else {
        filter = { $and: queryConditions };
      }
    }

    // 12. Sorting
    const sort = {};
    const sortDirection = order && order.toLowerCase() === 'desc' ? -1 : 1;

    if (sortBy === 'name') {
      sort.name = sortDirection;
    } else if (sortBy === 'rating') {
      sort.rating = sortDirection;
    } else if (sortBy === 'supplierId' || sortBy === 'id') {
      sort.supplierId = sortDirection;
    } else if (sortBy === 'city') {
      sort.city = sortDirection;
    } else {
      sort.createdAt = -1;
    }

    // 13. Pagination & Configurable Result Limits
    const totalDocs = await Supplier.countDocuments(filter);

    let pageNum = parseInt(page, 10);
    if (isNaN(pageNum) || pageNum < 1) pageNum = 1;

    let limitNum = limit === 'all' || limit === '0' ? 0 : parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum < 0) limitNum = 10;

    let query = Supplier.find(filter).sort(sort);
    if (limitNum > 0) {
      query = query.skip((pageNum - 1) * limitNum).limit(limitNum);
    }

    const suppliers = await query;
    const totalPages = limitNum > 0 ? Math.ceil(totalDocs / limitNum) : 1;

    return res.status(200).json({
      success: true,
      count: suppliers.length,
      total: totalDocs,
      page: pageNum,
      totalPages: totalPages || 1,
      limit: limitNum,
      data: suppliers,
    });
  } catch (error) {
    console.error('[GET /api/suppliers Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve suppliers.',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/suppliers/:id
 * @desc    Get a single supplier by MongoDB document ID (_id)
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid supplier document ID format.',
      });
    }

    const supplier = await Supplier.findById(id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: `Supplier with ID ${id} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: supplier,
    });
  } catch (error) {
    console.error(`[GET /api/suppliers/:id Error]:`, error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching supplier.',
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/suppliers
 * @desc    Add a new supplier
 */
router.post('/', async (req, res) => {
  try {
    const { supplierId, name, city, phone, email, category, rating, website } = req.body;

    // Validate required fields presence
    if (!supplierId || !name || !city || !phone || !email || !category || rating === undefined) {
      return res.status(400).json({
        success: false,
        message: 'All fields (supplierId, name, city, phone, email, category, rating) are required.',
      });
    }

    // Check duplicate supplierId
    const existing = await Supplier.findOne({
      supplierId: supplierId.trim().toUpperCase(),
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: `A supplier with ID "${supplierId.trim().toUpperCase()}" already exists.`,
      });
    }

    const supplierPayload = {
      supplierId: supplierId.trim().toUpperCase(),
      name: name.trim(),
      city: city.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      category: category.trim(),
      rating: parseFloat(rating),
    };
    if (website && website.trim()) {
      supplierPayload.website = website.trim();
    }

    const newSupplier = new Supplier(supplierPayload);

    const savedSupplier = await newSupplier.save();

    return res.status(201).json({
      success: true,
      message: 'Supplier created successfully.',
      data: savedSupplier,
    });
  } catch (error) {
    console.error('[POST /api/suppliers Error]:', error);

    // Mongoose duplicate key error (code 11000)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Supplier ID already exists in the database.',
      });
    }

    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: messages,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while creating supplier.',
      error: error.message,
    });
  }
});

/**
 * @route   PUT /api/suppliers/:id
 * @desc    Update an existing supplier by MongoDB document ID
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid supplier document ID format.',
      });
    }

    const { supplierId, name, city, phone, email, category, rating, website } = req.body;

    const existingSupplier = await Supplier.findById(id);
    if (!existingSupplier) {
      return res.status(404).json({
        success: false,
        message: `Supplier with ID ${id} not found.`,
      });
    }

    // Check duplicate supplierId if user is modifying supplierId
    if (supplierId && supplierId.trim().toUpperCase() !== existingSupplier.supplierId) {
      const duplicate = await Supplier.findOne({
        supplierId: supplierId.trim().toUpperCase(),
        _id: { $ne: id },
      });
      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: `Supplier ID "${supplierId.trim().toUpperCase()}" is already assigned to another supplier.`,
        });
      }
    }

    const updateData = {};
    if (supplierId) updateData.supplierId = supplierId.trim().toUpperCase();
    if (name) updateData.name = name.trim();
    if (city) updateData.city = city.trim();
    if (phone) updateData.phone = phone.trim();
    if (email) updateData.email = email.trim().toLowerCase();
    if (category) updateData.category = category.trim();
    if (website !== undefined) updateData.website = website ? website.trim() : undefined;
    if (rating !== undefined && rating !== null) updateData.rating = parseFloat(rating);

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      id,
      { $set: updateData },
      { returnDocument: 'after', runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Supplier updated successfully.',
      data: updatedSupplier,
    });
  } catch (error) {
    console.error('[PUT /api/suppliers/:id Error]:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Supplier ID already exists in the database.',
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: messages,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while updating supplier.',
      error: error.message,
    });
  }
});

/**
 * @route   DELETE /api/suppliers/:id
 * @desc    Delete a supplier by MongoDB document ID
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid supplier document ID format.',
      });
    }

    const deletedSupplier = await Supplier.findByIdAndDelete(id);

    if (!deletedSupplier) {
      return res.status(404).json({
        success: false,
        message: `Supplier with ID ${id} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Supplier "${deletedSupplier.name}" (${deletedSupplier.supplierId}) deleted successfully.`,
      data: {
        id: deletedSupplier._id,
        supplierId: deletedSupplier.supplierId,
      },
    });
  } catch (error) {
    console.error('[DELETE /api/suppliers/:id Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting supplier.',
      error: error.message,
    });
  }
});

module.exports = router;

