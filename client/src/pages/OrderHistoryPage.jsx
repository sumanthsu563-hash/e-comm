import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import LoadingSpinner from '../components/LoadingSpinner';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get('/orders');
        setOrders(res.data?.data?.orders || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Paid & Confirmed
          </span>
        );
      case 'processing':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
            Merchant Processing
          </span>
        );
      case 'shipped':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            In Transit / Shipped
          </span>
        );
      case 'delivered':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200 flex items-center gap-1.5">
            <CheckCircle className="w-3 h-3 text-teal-500" />
            Delivered
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            Pending Payment
          </span>
        );
    }
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving your orders..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          My Order History
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Track real-time fulfillment status and view receipt records
        </p>
      </div>

      {error ? (
        <div className="p-6 bg-rose-50 text-rose-700 rounded-3xl border border-rose-200 text-sm font-semibold">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-dashed border-slate-300 shadow-subtle space-y-3">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No orders placed yet</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Once you complete a purchase, your order history and live delivery tracking will appear here.
          </p>
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition shadow-sm"
            >
              Start Shopping <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-brand-200 hover:shadow-card transition"
            >
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                    #{order._id.substring(order._id.length - 8).toUpperCase()}
                  </span>
                  {getStatusBadge(order.status)}
                </div>

                <p className="text-xs text-slate-400 font-medium">
                  Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                  {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>

                {/* Thumbnails preview */}
                <div className="flex items-center gap-2 pt-1">
                  {order.items?.slice(0, 5).map((item, i) => (
                    <img
                      key={i}
                      src={item.image}
                      alt={item.title}
                      title={item.title}
                      className="w-11 h-11 rounded-xl object-cover bg-slate-100 border border-slate-200"
                    />
                  ))}
                  {order.items?.length > 5 && (
                    <span className="text-xs text-slate-500 font-bold px-2 py-1 bg-slate-100 rounded-lg">
                      +{order.items.length - 5}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Total Charged
                  </span>
                  <span className="text-xl font-black text-slate-900">
                    ${order.totalAmount?.toFixed(2)}
                  </span>
                </div>

                <Link
                  to={`/order-success/${order._id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-brand-600 bg-brand-50 border border-brand-200 rounded-xl hover:bg-brand-100 transition"
                >
                  View Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
