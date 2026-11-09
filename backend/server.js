const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const supplierRoutes = require('./routes/supplierRoutes');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get('/api/health', (req, res) => {
  return res.status(200).json({
    status: 'OK',
    message: 'Supplier Directory API is healthy and operational.',
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(1)}s`,
  });
});

// API Routes
app.use('/api/suppliers', supplierRoutes);

// Root informational endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Supplier Directory System Backend API',
    endpoints: {
      health: 'GET /api/health',
      suppliers: {
        getAll: 'GET /api/suppliers',
        getById: 'GET /api/suppliers/:id',
        create: 'POST /api/suppliers',
        update: 'PUT /api/suppliers/:id',
        delete: 'DELETE /api/suppliers/:id',
      },
    },
  });
});

// 404 Not Found Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found at ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Server] Supplier Directory Backend running on http://localhost:${PORT}`);
  console.log(`[Health] http://localhost:${PORT}/api/health`);
  console.log(`[Suppliers API] http://localhost:${PORT}/api/suppliers`);
});

