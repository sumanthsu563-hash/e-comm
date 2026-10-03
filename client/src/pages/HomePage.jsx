import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ShieldCheck, Sparkles, Store, Layers } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          axiosClient.get('/products?limit=8&sort=-createdAt'),
          axiosClient.get('/categories?limit=6')
        ]);
        setFeaturedProducts(prodRes.data?.data?.products || []);
        setCategories(catRes.data?.data?.categories || []);
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-20 lg:py-28">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Empowering Independent Merchants & Smart Buyers
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-3xl leading-tight">
            Discover Quality Goods from <span className="text-blue-400">Verified Vendors</span>.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl">
            A unified multi-vendor e-commerce marketplace. Direct vendor fulfillment, secure Razorpay checkout, and real-time order tracking.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/25 transition-all text-sm"
            >
              Explore Products
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-gray-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all text-sm"
            >
              <Store className="w-4 h-4 text-emerald-400" />
              Become a Seller
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                Shop by Category
              </h2>
              <p className="text-sm text-gray-500">Explore our curated collections</p>
            </div>
            <Link
              to="/products"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${cat._id}`}
                className="p-5 bg-white border border-gray-200 rounded-2xl text-center hover:border-blue-500 hover:shadow-md transition-all group flex flex-col items-center justify-center"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm group-hover:text-blue-600 transition">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Featured Products
            </h2>
            <p className="text-sm text-gray-500">
              Fresh additions from top-rated merchants
            </p>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            See More <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading marketplace products..." />
        ) : featuredProducts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-gray-300">
            <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">No products listed yet.</p>
            <p className="text-xs text-gray-400 mt-1">
              Be the first merchant to add inventory!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
