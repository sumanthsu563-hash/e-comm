import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import { ShoppingBag, Search, X, Sparkles, Filter } from 'lucide-react';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // State initialized from URL query params
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '-createdAt');
  const [page, setPage] = useState(parseInt(searchParams.get('page'), 10) || 1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, limit: 12 });

  // Fetch Categories once
  useEffect(() => {
    axiosClient
      .get('/categories?limit=50')
      .then((res) => setCategories(res.data?.data?.categories || []))
      .catch((err) => console.error('Failed to load categories:', err));
  }, []);

  // Synchronize URL search params whenever filters change
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (selectedCategory) params.set('category', selectedCategory);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (sort) params.set('sort', sort);
    params.set('page', page);
    params.set('limit', 12);

    setSearchParams(params);

    try {
      const res = await axiosClient.get(`/products?${params.toString()}`);
      setProducts(res.data?.data?.products || []);
      setPagination(
        res.data?.data?.pagination || { total: 0, totalPages: 1, page, limit: 12 }
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, minPrice, maxPrice, sort, page, setSearchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSort('-createdAt');
    setPage(1);
  };

  const selectedCategoryObj = categories.find((c) => c._id === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Marketplace Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Explore All Products
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showing <span className="font-bold text-slate-800">{pagination.total}</span> items from verified merchants
          </p>
        </div>

        {/* Real-time search */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Filter catalog by name..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            {search && (
              <button
                onClick={() => {
                  setSearch('');
                  setPage(1);
                }}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="md:hidden p-2.5 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-700 flex items-center justify-center flex-shrink-0"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {(selectedCategory || minPrice || maxPrice || search) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase mr-1">Active:</span>

          {search && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold rounded-full">
              Query: "{search}"
              <button onClick={() => setSearch('')}>
                <X className="w-3 h-3 hover:text-brand-900" />
              </button>
            </span>
          )}

          {selectedCategoryObj && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold rounded-full">
              Category: {selectedCategoryObj.name}
              <button onClick={() => setSelectedCategory('')}>
                <X className="w-3 h-3 hover:text-brand-900" />
              </button>
            </span>
          )}

          {(minPrice || maxPrice) && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold rounded-full">
              Price: ${minPrice || '0'} - ${maxPrice || '∞'}
              <button onClick={() => { setMinPrice(''); setMaxPrice(''); }}>
                <X className="w-3 h-3 hover:text-brand-900" />
              </button>
            </span>
          )}

          <button
            onClick={handleResetFilters}
            className="text-xs text-rose-600 hover:underline font-bold ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Grid: Filters + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className={`lg:col-span-1 ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
          <FilterSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={(val) => {
              setSelectedCategory(val);
              setPage(1);
            }}
            minPrice={minPrice}
            setMinPrice={(val) => {
              setMinPrice(val);
              setPage(1);
            }}
            maxPrice={maxPrice}
            setMaxPrice={(val) => {
              setMaxPrice(val);
              setPage(1);
            }}
            sort={sort}
            setSort={(val) => {
              setSort(val);
              setPage(1);
            }}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Product Cards Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <LoadingSpinner message="Filtering products..." />
          ) : error ? (
            <div className="p-8 text-center bg-rose-50 text-rose-700 rounded-3xl border border-rose-200">
              <p className="font-bold">{error}</p>
              <button
                onClick={fetchProducts}
                className="mt-3 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition"
              >
                Try Again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="p-16 text-center bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No products match your criteria</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                Try loosening your search terms, expanding the price range, or selecting all categories.
              </p>
              <div className="pt-2">
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 text-xs font-bold text-brand-600 bg-brand-50 border border-brand-200 rounded-xl hover:bg-brand-100 transition"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
