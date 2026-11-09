# Supplier Directory System (Frontend)

A modern, clean, and responsive **Supplier Directory Dashboard** built with **React.js**, **Vite**, and custom **CSS**.

---

## 🌟 Features

### 1. Modern Header & Navigation
- Application branding with **"Supplier Directory"** logo and subtitle.
- **"Add Supplier"** quick-action button.
- **"Reset Sample Data"** action to quickly revert demo changes at any time.

### 2. Live Summary Metrics Cards
- **Total Suppliers**: Dynamic count of registered suppliers.
- **Total Cities**: Distinct geographic cities represented.
- **Average Rating**: Real-time aggregated rating across all active suppliers.
- **Product Categories**: Number of active business verticals.

### 3. Comprehensive Search & Multi-Filter Bar
- **Search**: Instant case-insensitive filtering by **Supplier ID** (e.g. `SUP-101`) or **Supplier Name**.
- **City Filter**: Dynamic dropdown listing all cities present in the directory.
- **Category Filter**: Filter suppliers by product category (*Electronics*, *Raw Materials*, *Packaging*, *Textiles*, *Hardware*, *Chemicals*, *Logistics*, etc.).
- **Rating Filter**: Threshold filtering (★ 4.5+, 4.0+, 3.5+, 3.0+).
- **Active Filter Chips**: Clickable tag chips showing active filters with one-click removal.
- **Reset Filters**: One-click reset button to clear search and dropdown selections.
- Real-time result counter: *"Showing X of Y suppliers"*.

### 4. Interactive Supplier Table
- **Columns**:
  - `Supplier ID` (Monospace badge)
  - `Name` (With initials avatar)
  - `City` (With location pin icon)
  - `Phone` (Clickable `tel:` link)
  - `Email` (Clickable `mailto:` link)
  - `Category` (Color-coded category badge)
  - `Rating` (Star badge + score)
  - `Actions` (Edit & Delete)
- **Interactive Column Sorting**: Click on headers (ID, Name, City, Category, Rating) to toggle ascending/descending sort with arrow indicators.
- **Empty State**: Clear search icon and helper text when no matching suppliers are found.

### 5. Add & Edit Supplier Modal with Validation
- Unified responsive modal for adding new suppliers or updating existing records.
- **Form Fields & Validation**:
  - **Supplier ID**: Auto-generates next ID (`SUP-XXX`) or allows custom alphanumeric input; checks for duplicate IDs.
  - **Supplier Name**: Required (minimum 2 characters, maximum 70 characters).
  - **City**: Required text input.
  - **Phone**: Required phone format check (7–15 digits).
  - **Email**: Required RFC-compliant email address validation.
  - **Product Category**: Pre-populated category select dropdown.
  - **Rating**: Interactive 5-star quick picker + numerical input (range: 1.0 to 5.0).
- Inline real-time feedback with error messages and field highlights.
- Accessible keyboard support (`ESC` key to dismiss, focus trap, click outside to close).

### 6. Delete Confirmation Dialog
- Safe deletion flow with warning modal displaying supplier details before removing.

### 7. Toast Feedback Notifications & Persistence
- Non-intrusive alert toasts for adding, editing, and deleting suppliers.
- Automatic persistence to browser `localStorage` so changes stay between page refreshes.

---

## 🎨 Design System
- **Theme**: Professional Blue & White palette (`#0f2b48`, `#1d4ed8`, `#eff6ff`, `#ffffff`).
- **Typography**: Clean, readable **Inter** font hierarchy.
- **Responsiveness**: Fully optimized for desktop, tablet, and mobile screen sizes.

---

## 📁 Project Structure

```
SupplierDirectorySystem/
├── index.html                     # HTML entry point with Inter font & icon
├── package.json                   # Project scripts and dependencies
├── vite.config.js                 # Vite configuration
├── scripts/
│   └── patch-rollup.cjs           # Cross-platform WASM rollup patch
└── src/
    ├── main.jsx                   # React root mount
    ├── App.jsx                    # Core application state & layout orchestrator
    ├── index.css                  # Modern, clean CSS design system
    ├── components/
    │   ├── Header.jsx             # Top bar with title and primary actions
    │   ├── SummaryCards.jsx       # 4 metric cards (Suppliers, Cities, Rating, Categories)
    │   ├── FilterBar.jsx          # Search input and City/Category/Rating filters
    │   ├── SupplierTable.jsx      # Sortable supplier table with action buttons
    │   ├── SupplierModal.jsx      # Add / Edit form modal with validation
    │   ├── DeleteConfirmModal.jsx # Deletion confirmation popup
    │   └── Toast.jsx              # Transient feedback toast notification
    ├── data/
    │   └── initialSuppliers.js    # Realistic initial demo dataset
    └── utils/
        └── validation.js          # Reusable validation rules and error checkers
```

---

## 🚀 How to Run the Application

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm / yarn

### Step 1: Install Dependencies
Open your terminal in the project directory:
```bash
npm install
```

### Step 2: Start the Development Server
```bash
npm run dev
```

The application will launch locally at:
```
http://localhost:3000
```
*(or another available port reported in your terminal)*. Open this URL in your web browser to view and interact with the dashboard.

### Step 3: Production Build (Optional)
To test the production build:
```bash
npm run build
npm run preview
```

