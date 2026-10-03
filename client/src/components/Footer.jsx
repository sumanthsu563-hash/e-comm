import React from 'react';
import { ShoppingBag, Shield, Truck, RefreshCw } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300 mt-auto">
      {/* Features highlight bar */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Direct Vendor Dispatch</h4>
              <p className="text-xs text-gray-400">Shipped directly from verified merchants</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Secure Payments</h4>
              <p className="text-xs text-gray-400">Powered by Razorpay test encryption</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Realtime Updates</h4>
              <p className="text-xs text-gray-400">Live order state tracking with Socket.io</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <ShoppingBag className="w-4 h-4 text-blue-500" />
          <span className="font-semibold text-gray-400">NexStore Multi-Vendor Marketplace</span>
        </div>
        <p>© {new Date().getFullYear()} NexStore. Production-grade MERN Stack Architecture.</p>
      </div>
    </footer>
  );
}
