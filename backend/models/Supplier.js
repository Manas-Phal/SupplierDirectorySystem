const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema(
  {
    supplierId: {
      type: String,
      required: [true, 'Supplier ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, 'Supplier name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot exceed 5'],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexing for faster search & filter
supplierSchema.index({ name: 'text' });
supplierSchema.index({ city: 1 });
supplierSchema.index({ category: 1 });
supplierSchema.index({ rating: 1 });

const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;

