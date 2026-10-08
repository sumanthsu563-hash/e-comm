import React from 'react';
import { Filter, RotateCcw, ArrowUpDown, Tag, DollarSign, Check } from 'lucide-react';

export default function FilterSidebar({
  categories = [],
  selectedCategory,
  setSelectedCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  sort,
  setSort,
  onResetFilters
}) {
  const hasActiveFilters = Boolean(selectedCategory || minPrice || maxPrice || sort !== '-createdAt');

  const pricePresets = [
    { label: 'Under $25', min: '', max: '25' },
    { label: '$25 to $100', min: '25', max: '100' },
    { label: 'Over $100', min: '100', max: '' },
  ];

  return (
    <aside className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-subtle space-y-6 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5 font-extrabold text-slate-900 text-base">
          <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Filter className="w-4 h-4" />
          </div>
          <span>Filter Products</span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-bold transition px-2 py-1 rounded-lg hover:bg-rose-50"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* Sort By */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-brand-500" />
          Sort Order
        </label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full text-sm py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold text-slate-700 shadow-inner"
        >
          <option value="-createdAt">Newest Arrivals</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
          <option value="-ratings">Customer Ratings</option>
        </select>
      </div>

      {/* Categories */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          <Tag className="w-3.5 h-3.5 text-brand-500" />
          Categories
        </label>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedCategory('')}
            className={`w-full text-left px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-between ${
              !selectedCategory
                ? 'bg-brand-50 text-brand-700 border border-brand-200 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span>All Categories</span>
            {!selectedCategory && <Check className="w-3.5 h-3.5 text-brand-600" />}
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat._id)}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-between ${
                selectedCategory === cat._id
                  ? 'bg-brand-50 text-brand-700 border border-brand-200 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="truncate">{cat.name}</span>
              {selectedCategory === cat._id && <Check className="w-3.5 h-3.5 text-brand-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range & Presets */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          <DollarSign className="w-3.5 h-3.5 text-brand-500" />
          Price Range ($)
        </label>

        {/* Quick price chips */}
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          {pricePresets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setMinPrice(preset.min);
                setMaxPrice(preset.max);
              }}
              className="py-1 px-1.5 text-[11px] font-semibold bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 text-center truncate"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full text-xs sm:text-sm py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-inner"
            min="0"
          />
          <span className="text-slate-400 font-bold text-sm">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full text-xs sm:text-sm py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-inner"
            min="0"
          />
        </div>
      </div>
    </aside>
  );
}
