import React from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  Info,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';

export default function AdvancedFilters({
  isOpen,
  ratingOp,
  onRatingOpChange,
  advRating,
  onAdvRatingChange,
  selectedInCities = [],
  onToggleInCity,
  selectedNinCities = [],
  onToggleNinCity,
  selectedInCategories = [],
  onToggleInCat,
  selectedNinCategories = [],
  onToggleNinCat,
  excludeName,
  onExcludeNameChange,
  norCity,
  onNorCityChange,
  norCategory,
  onNorCategoryChange,
  existsField,
  onExistsFieldChange,
  existsValue,
  onExistsValueChange,
  typeField,
  onTypeFieldChange,
  typeValue,
  onTypeValueChange,
  matchMode,
  onMatchModeChange,
  availableCities = [],
  availableCategories = [],
  onResetAdvanced,
  activeCount = 0,
}) {
  if (!isOpen) return null;

  return (
    <div className="advanced-filters-panel" aria-label="Advanced MongoDB Filters Panel">
      <div className="advanced-filters-header">
        <div className="advanced-filters-title">
          <SlidersHorizontal size={18} style={{ color: 'var(--primary)' }} />
          <span>Advanced MongoDB Query Operators</span>
          {activeCount > 0 && (
            <span className="badge-active-count">{activeCount} active</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {activeCount > 0 && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onResetAdvanced}
              style={{ fontSize: '0.8rem', padding: '5px 12px' }}
            >
              <RotateCcw size={13} />
              <span>Reset Advanced</span>
            </button>
          )}
        </div>
      </div>

      <div className="advanced-filters-grid">
        {/* 1. Comparison Operators on Rating ($eq, $ne, $gt, $gte, $lt, $lte) */}
        <div className="adv-card">
          <div className="adv-card-title">
            <span>Rating Comparison</span>
            <code className="op-tag">$eq $ne $gt $gte $lt $lte</code>
          </div>
          <div className="adv-form-row">
            <select
              className="filter-select"
              value={ratingOp}
              onChange={(e) => onRatingOpChange(e.target.value)}
              aria-label="Rating comparison operator"
              style={{ flex: 1 }}
            >
              <option value="gte">≥ At least ($gte)</option>
              <option value="gt">&gt; Greater than ($gt)</option>
              <option value="eq">= Exactly equal ($eq)</option>
              <option value="ne">≠ Not equal to ($ne)</option>
              <option value="lte">≤ At most ($lte)</option>
              <option value="lt">&lt; Less than ($lt)</option>
            </select>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              className="form-control"
              placeholder="e.g. 4.5"
              value={advRating}
              onChange={(e) => onAdvRatingChange(e.target.value)}
              style={{ maxWidth: '100px' }}
              aria-label="Rating comparison value"
            />
          </div>
          <div className="adv-hint">
            Filter suppliers using exact, range, or unequal score comparisons.
          </div>
        </div>

        {/* 2. Multi-City Inclusion ($in) */}
        <div className="adv-card">
          <div className="adv-card-title">
            <span>Include Cities</span>
            <code className="op-tag">$in</code>
          </div>
          <div className="adv-chips-container">
            {availableCities.length === 0 ? (
              <span className="adv-hint">No cities found in database</span>
            ) : (
              availableCities.map((c) => {
                const isSelected = selectedInCities.includes(c);
                return (
                  <button
                    key={`in-city-${c}`}
                    type="button"
                    className={`adv-chip ${isSelected ? 'selected' : ''}`}
                    onClick={() => onToggleInCity(c)}
                  >
                    {isSelected && <CheckCircle2 size={12} />}
                    <span>{c}</span>
                  </button>
                );
              })
            )}
          </div>
          <div className="adv-hint">Matches suppliers located in any of the selected cities.</div>
        </div>

        {/* 3. Multi-City Exclusion ($nin) */}
        <div className="adv-card">
          <div className="adv-card-title">
            <span>Exclude Cities</span>
            <code className="op-tag">$nin</code>
          </div>
          <div className="adv-chips-container">
            {availableCities.length === 0 ? (
              <span className="adv-hint">No cities found</span>
            ) : (
              availableCities.map((c) => {
                const isSelected = selectedNinCities.includes(c);
                return (
                  <button
                    key={`nin-city-${c}`}
                    type="button"
                    className={`adv-chip chip-danger ${isSelected ? 'selected' : ''}`}
                    onClick={() => onToggleNinCity(c)}
                  >
                    {isSelected && <XCircle size={12} />}
                    <span>{c}</span>
                  </button>
                );
              })
            )}
          </div>
          <div className="adv-hint">Omits suppliers located in any of the selected cities.</div>
        </div>

        {/* 4. Multi-Category Exclusion ($nin / $ne) */}
        <div className="adv-card">
          <div className="adv-card-title">
            <span>Exclude Categories</span>
            <code className="op-tag">$nin</code>
          </div>
          <div className="adv-chips-container">
            {availableCategories.map((cat) => {
              const isSelected = selectedNinCategories.includes(cat);
              return (
                <button
                  key={`nin-cat-${cat}`}
                  type="button"
                  className={`adv-chip chip-danger ${isSelected ? 'selected' : ''}`}
                  onClick={() => onToggleNinCat(cat)}
                >
                  {isSelected && <XCircle size={12} />}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
          <div className="adv-hint">Hides suppliers belonging to these product categories.</div>
        </div>

        {/* 5. Logical Negation ($not) on Name */}
        <div className="adv-card">
          <div className="adv-card-title">
            <span>Exclude Name Pattern</span>
            <code className="op-tag">$not</code>
          </div>
          <div className="adv-form-row">
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Solutions, Pack, Ltd"
              value={excludeName}
              onChange={(e) => onExcludeNameChange(e.target.value)}
              aria-label="Exclude name pattern"
            />
          </div>
          <div className="adv-hint">
            Excludes any supplier whose name matches this pattern via <code>&#123; name: &#123; $not: /pattern/i &#125; &#125;</code>.
          </div>
        </div>

        {/* 6. Logical Disjunctive Exclusion ($nor) */}
        <div className="adv-card">
          <div className="adv-card-title">
            <span>Disjunctive Exclusion</span>
            <code className="op-tag">$nor</code>
          </div>
          <div className="adv-form-row">
            <select
              className="filter-select"
              value={norCity}
              onChange={(e) => onNorCityChange(e.target.value)}
              style={{ flex: 1 }}
              aria-label="NOR City filter"
            >
              <option value="">Neither City...</option>
              {availableCities.map((city) => (
                <option key={`nor-city-${city}`} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <select
              className="filter-select"
              value={norCategory}
              onChange={(e) => onNorCategoryChange(e.target.value)}
              style={{ flex: 1 }}
              aria-label="NOR Category filter"
            >
              <option value="">NOR Category...</option>
              {availableCategories.map((cat) => (
                <option key={`nor-cat-${cat}`} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="adv-hint">
            Excludes records matching either clause via <code>$nor: [&#123; city &#125;, &#123; category &#125;]</code>.
          </div>
        </div>

        {/* 7. Element Operator ($exists) */}
        <div className="adv-card">
          <div className="adv-card-title">
            <span>Field Existence Filter</span>
            <code className="op-tag">$exists</code>
          </div>
          <div className="adv-form-row">
            <select
              className="filter-select"
              value={existsField}
              onChange={(e) => onExistsFieldChange(e.target.value)}
              style={{ flex: 1 }}
              aria-label="Field for existence check"
            >
              <option value="">No field filter</option>
              <option value="website">website</option>
              <option value="email">email</option>
              <option value="phone">phone</option>
              <option value="city">city</option>
              <option value="rating">rating</option>
            </select>
            {existsField && (
              <select
                className="filter-select"
                value={existsValue}
                onChange={(e) => onExistsValueChange(e.target.value)}
                style={{ maxWidth: '140px' }}
                aria-label="Field existence state"
              >
                <option value="true">Must Exist (true)</option>
                <option value="false">Must Not Exist (false)</option>
              </select>
            )}
          </div>
          <div className="adv-hint">
            Query documents where the target field exists or does not exist in MongoDB.
          </div>
        </div>

        {/* 8. Element Operator ($type) */}
        <div className="adv-card">
          <div className="adv-card-title">
            <span>BSON Field Type Filter</span>
            <code className="op-tag">$type</code>
          </div>
          <div className="adv-form-row">
            <select
              className="filter-select"
              value={typeField}
              onChange={(e) => onTypeFieldChange(e.target.value)}
              style={{ flex: 1 }}
              aria-label="Field for type check"
            >
              <option value="">No type filter</option>
              <option value="rating">rating</option>
              <option value="name">name</option>
              <option value="city">city</option>
              <option value="createdAt">createdAt</option>
            </select>
            {typeField && (
              <select
                className="filter-select"
                value={typeValue}
                onChange={(e) => onTypeValueChange(e.target.value)}
                style={{ maxWidth: '140px' }}
                aria-label="BSON expected type"
              >
                <option value="number">Type: number</option>
                <option value="string">Type: string</option>
                <option value="date">Type: date</option>
              </select>
            )}
          </div>
          <div className="adv-hint">
            Verifies field conforms to BSON data type via <code>&#123; [field]: &#123; $type &#125; &#125;</code>.
          </div>
        </div>

        {/* 9. Logical Combination Mode ($and vs $or) */}
        <div className="adv-card" style={{ gridColumn: '1 / -1' }}>
          <div className="adv-card-title">
            <span>Filter Combination Mode</span>
            <code className="op-tag">$and / $or</code>
          </div>
          <div className="adv-match-mode-row">
            <label className="radio-label">
              <input
                type="radio"
                name="matchMode"
                value="and"
                checked={matchMode === 'and'}
                onChange={() => onMatchModeChange('and')}
              />
              <span>
                <strong>Match ALL criteria ($and)</strong> — Documents must satisfy every active filter
              </span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="matchMode"
                value="or"
                checked={matchMode === 'or'}
                onChange={() => onMatchModeChange('or')}
              />
              <span>
                <strong>Match ANY criterion ($or)</strong> — Documents satisfying any active filter are returned
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

