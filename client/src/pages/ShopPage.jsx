import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import { ShoppingBag, Search } from 'lucide-react';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // State initialized from URL query params
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Marketplace Catalog
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Showing {pagination.total} available items from verified merchants
          </p>
        </div>

        {/* Real-time search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search catalog..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
        </div>
      </div>

      {/* Main Grid: Filters + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
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
            <div className="p-8 text-center bg-red-50 text-red-700 rounded-2xl border border-red-200">
              <p className="font-semibold">{error}</p>
              <button
                onClick={fetchProducts}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold"
              >
                Try Again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="p-16 text-center bg-white rounded-3xl border border-dashed border-gray-300">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-800">No products found</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                No items match your active filters. Try adjusting price range, category, or search keywords.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition"
              >
                Clear all filters
              </button>
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
