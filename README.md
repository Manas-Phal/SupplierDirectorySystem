# Supplier Directory System

A full-stack web application for managing, searching, and evaluating enterprise suppliers.

---

## 📁 Repository Structure

```
SupplierDirectorySystem/
├── frontend/                  # React + Vite frontend application
│   ├── src/                   # React components, styles, data, utilities
│   ├── dist/                  # Production build output
│   ├── index.html             # HTML entry point
│   ├── vite.config.js         # Vite configuration
│   ├── package.json           # Frontend dependencies & scripts
│   └── README.md              # Frontend documentation
│
└── backend/                   # Node.js + Express + MongoDB REST API
    ├── config/                # Database connection (Mongoose)
    ├── models/                # Mongoose models (Supplier)
    ├── routes/                # API route definitions (/api/suppliers)
    ├── .env                   # Environment configuration (PORT, MONGODB_URI)
    ├── server.js              # Express app entry point
    └── package.json           # Backend dependencies & scripts
```

---

## 🚀 Running the Project

### 1. Backend (Node.js + Express + MongoDB)

Make sure local MongoDB Community Server is running:
```powershell
net start MongoDB
```

Start the backend API server:
```powershell
cd backend
npm run dev
```
- API Base URL: `http://localhost:5000`
- Health Endpoint: `http://localhost:5000/api/health`
- Suppliers API: `http://localhost:5000/api/suppliers`

---

### 2. Frontend (React + Vite)

In a separate terminal window:
```powershell
cd frontend
npm run dev
```
- Dashboard URL: `http://localhost:3000`
