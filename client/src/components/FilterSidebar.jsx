import React from 'react';
import { Filter, X, ArrowUpDown, Tag, DollarSign } from 'lucide-react';

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
  return (
    <aside className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2 font-bold text-gray-900">
          <Filter className="w-5 h-5 text-blue-600" />
          <span>Filters</span>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs text-gray-500 hover:text-blue-600 font-medium transition"
        >
          Reset All
        </button>
      </div>

      {/* Sort By */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
          Sort Order
        </label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full text-sm py-2 px-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700"
        >
          <option value="-createdAt">Newest First</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
          <option value="-ratings">Highest Rated</option>
        </select>
      </div>

      {/* Categories */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5">
          <Tag className="w-3.5 h-3.5 text-gray-400" />
          Category
        </label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedCategory('')}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition ${
              !selectedCategory
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat._id)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition ${
                selectedCategory === cat._id
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5">
          <DollarSign className="w-3.5 h-3.5 text-gray-400" />
          Price Range ($)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full text-sm py-1.5 px-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
          />
          <span className="text-gray-400 text-sm">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full text-sm py-1.5 px-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
          />
        </div>
      </div>
    </aside>
  );
}
