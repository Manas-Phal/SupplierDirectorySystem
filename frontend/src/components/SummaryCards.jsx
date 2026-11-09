import React from 'react';
import { Users, MapPin, Star, Layers } from 'lucide-react';

export default function SummaryCards({ suppliers = [] }) {
  const safeSuppliers = Array.isArray(suppliers) ? suppliers : [];
  const totalSuppliers = safeSuppliers.length;

  const uniqueCities = React.useMemo(() => {
    const cities = new Set(
      safeSuppliers.map((s) => s.city?.trim()).filter(Boolean)
    );
    return cities.size;
  }, [safeSuppliers]);

  const averageRating = React.useMemo(() => {
    if (safeSuppliers.length === 0) return '0.0';
    const sum = safeSuppliers.reduce((acc, curr) => acc + (parseFloat(curr.rating) || 0), 0);
    return (sum / safeSuppliers.length).toFixed(1);
  }, [safeSuppliers]);

  const uniqueCategories = React.useMemo(() => {
    const categories = new Set(
      safeSuppliers.map((s) => s.category?.trim()).filter(Boolean)
    );
    return categories.size;
  }, [safeSuppliers]);

  return (
    <div className="summary-grid" aria-label="Dashboard statistics">
      {/* 1. Total Suppliers */}
      <div className="stat-card">
        <div className="stat-icon blue" aria-hidden="true">
          <Users size={24} />
        </div>
        <div className="stat-info">
          <div className="stat-title">Total Suppliers</div>
          <div className="stat-value">{totalSuppliers}</div>
          <div className="stat-meta">
            <span>Verified enterprise partners</span>
          </div>
        </div>
      </div>

      {/* 2. Total Cities */}
      <div className="stat-card">
        <div className="stat-icon cyan" aria-hidden="true">
          <MapPin size={24} />
        </div>
        <div className="stat-info">
          <div className="stat-title">Total Cities</div>
          <div className="stat-value">{uniqueCities}</div>
          <div className="stat-meta">
            <span>Geographic distribution</span>
          </div>
        </div>
      </div>

      {/* 3. Average Supplier Rating */}
      <div className="stat-card">
        <div className="stat-icon gold" aria-hidden="true">
          <Star size={24} fill="#f59e0b" />
        </div>
        <div className="stat-info">
          <div className="stat-title">Average Rating</div>
          <div className="stat-value">
            {averageRating} <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 500 }}>/ 5.0</span>
          </div>
          <div className="stat-meta">
            <span>Overall vendor quality</span>
          </div>
        </div>
      </div>

      {/* 4. Total Categories (Bonus contextual metric) */}
      <div className="stat-card">
        <div className="stat-icon emerald" aria-hidden="true">
          <Layers size={24} />
        </div>
        <div className="stat-info">
          <div className="stat-title">Product Categories</div>
          <div className="stat-value">{uniqueCategories}</div>
          <div className="stat-meta">
        