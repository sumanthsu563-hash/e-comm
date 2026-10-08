import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Store,
  Layers,
  Truck,
  Zap,
  Lock,
  Headphones,
  CheckCircle2,
  TrendingUp,
  Star
} from 'lucide-react';
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
          axiosClient.get('/categories?limit=8')
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
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-20 lg:py-32">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-600/30 to-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-[400px] h-[250px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-400/30 text-brand-300 text-xs font-bold mb-8 backdrop-blur-md shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Next-Generation Multi-Vendor Marketplace</span>
          </div>

          {/* Hero Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-4xl leading-[1.1] text-balance">
            Discover Quality Goods From{' '}
            <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              Independent Merchants
            </span>
          </h1>

          {/* Hero Subtitle */}
          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl leading-relaxed">
            Shop directly from verified vendors worldwide. Enjoy fast fulfillment, Razorpay encrypted checkout, and live order updates.
          </p>

          {/* Hero CTAs */}
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-lg shadow-brand-500/30 hover:shadow-glow transition-all text-sm sm:text-base transform hover:-translate-y-0.5"
            >
              Explore Products
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 backdrop-blur-md transition-all text-sm sm:text-base transform hover:-translate-y-0.5"
            >
              <Store className="w-4 h-4 text-emerald-400" />
              Become a Seller
            </Link>
          </div>

          {/* Trust Highlights Strip */}
          <div className="mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-400 text-xs sm:text-sm font-medium">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Verified Merchants</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Lock className="w-4 h-4 text-brand-400" />
              <span>Razorpay Test Security</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Live Socket.io Sync</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Truck className="w-4 h-4 text-cyan-400" />
              <span>Direct Vendor Fulfillment</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
                Browse Collections
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Shop by Popular Categories
              </h2>
            </div>
            <Link
              to="/products"
              className="text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1.5 group"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat, idx) => (
              <Link
                key={cat._id}
                to={`/products?category=${cat._id}`}
                className="group relative p-6 bg-white border border-slate-200/80 rounded-3xl hover:border-brand-400 hover:shadow-card-hover transition-all duration-300 flex items-center gap-4 overflow-hidden"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-50 to-indigo-100/80 text-brand-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all flex-shrink-0">
                  <Layers className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-brand-600 transition truncate">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Explore items &rarr;</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
              Handpicked Deals
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Trending Marketplace Products
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Explore recently added items from top-rated sellers
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-brand-600 text-white text-xs font-bold rounded-xl transition shadow-sm self-start sm:self-auto"
          >
            Browse All ({featuredProducts.length}+)
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading marketplace products..." />
        ) : featuredProducts.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No products listed yet</h3>
            <p className="text-sm text-slate-500 mt-1">
              Be the first vendor to add products to the catalog!
            </p>
            <Link
              to="/register"
              className="mt-4 inline-block px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition"
            >
              Register as Seller
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose NexStore / Core Marketplace Value */}
      <section className="bg-slate-900 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400 block mb-2">
              Marketplace Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Engineered for Buyers & Merchants
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-3">
              NexStore offers an enterprise-grade MERN multi-vendor solution with security, speed, and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/60 p-8 rounded-3xl border border-slate-700/80 backdrop-blur-sm space-y-4 hover:border-brand-500/50 transition">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Multi-Vendor Autonomy</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Independent sellers control their own catalog, pricing, inventory stocks, and order fulfillment workflows.
              </p>
            </div>

            <div className="bg-slate-800/60 p-8 rounded-3xl border border-slate-700/80 backdrop-blur-sm space-y-4 hover:border-emerald-500/50 transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Secure Razorpay Gateway</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Cryptographically verified payment signatures and safe checkout with automatic transaction status validation.
              </p>
            </div>

            <div className="bg-slate-800/60 p-8 rounded-3xl border border-slate-700/80 backdrop-blur-sm space-y-4 hover:border-purple-500/50 transition">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Realtime Socket.io Sync</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Instant push notifications for orders placed, payment received, and item delivery progress updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seller Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-brand-700 via-indigo-700 to-brand-800 text-white p-8 sm:p-14 overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              Sell on NexStore
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Ready to grow your online business?
            </h2>
            <p className="text-brand-100 text-sm sm:text-base leading-relaxed">
              Open your digital storefront in minutes. Access thousands of customers with zero upfront listing fees.
            </p>
            <div className="pt-2">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-brand-700 hover:bg-brand-50 rounded-2xl text-sm font-bold shadow-lg transition transform hover:-translate-y-0.5"
              >
                Register as Merchant <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          {/* Decorative graphic circle */}
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        </div>
      </section>
    </div>
  );
}
