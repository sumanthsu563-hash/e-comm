import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Shield, Truck, RefreshCw, Sparkles, Store, Lock, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 mt-auto border-t border-slate-800/80">
      {/* Features highlight bar */}
      <div className="border-b border-slate-800/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Direct Vendor Dispatch</h4>
              <p className="text-xs text-slate-400 mt-0.5">Shipped straight from verified sellers</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Secure Encrypted Payments</h4>
              <p className="text-xs text-slate-400 mt-0.5">Powered by Razorpay test gateway</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Realtime Socket.io Sync</h4>
              <p className="text-xs text-slate-400 mt-0.5">Instant live order state updates</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3 md:col-span-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="text-lg font-black text-white">
              Nex<span className="text-brand-500">Store</span>
            </span>
          </Link>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            A production-ready, multi-vendor marketplace connecting passionate independent merchants with discerning shoppers globally.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
            Marketplace
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/products" className="hover:text-white transition">
                All Products
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-white transition">
                Shopping Cart
              </Link>
            </li>
            <li>
              <Link to="/orders" className="hover:text-white transition">
                Order Tracking
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
            Partners & Vendors
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/register" className="hover:text-white transition">
                Become a Seller
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white transition">
                Merchant Portal
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-white transition">
                Vendor Settings
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-slate-900 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} NexStore Marketplace. Built on MERN Stack.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for merchants & buyers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
