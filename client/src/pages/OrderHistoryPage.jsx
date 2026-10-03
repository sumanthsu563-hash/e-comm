import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, ArrowRight, ExternalLink } from 'lucide-react';
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
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            Paid
          </span>
        );
      case 'processing':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            Processing
          </span>
        );
      case 'shipped':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
            Shipped
          </span>
        );
      case 'delivered':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
            Delivered
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            Pending
          </span>
        );
    }
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving your orders..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          My Order History
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Track fulfillment status and review past receipts
        </p>
      </div>

      {error ? (
        <div className="p-6 bg-red-50 text-red-700 rounded-2xl border border-red-200 text-sm font-semibold">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-dashed border-gray-300">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800">No orders placed yet</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
            Once you complete a purchase, your order history and live delivery tracking will appear here.
          </p>
          <Link
            to="/products"
            className="mt-4 inline-block px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-gray-900">
                    #{order._id.substring(order._id.length - 8).toUpperCase()}
                  </span>
                  {getStatusBadge(order.status)}
                </div>

                <p className="text-xs text-gray-400">
                  Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                  {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>

                {/* Thumbnails preview */}
                <div className="flex items-center gap-2 pt-1">
                  {order.items?.slice(0, 4).map((item, i) => (
                    <img
                      key={i}
                      src={item.image}
                      alt={item.title}
                      className="w-10 h-10 rounded-lg object-cover bg-gray-100 border border-gray-200"
                    />
                  ))}
                  {order.items?.length > 4 && (
                    <span className="text-xs text-gray-400 font-bold">
                      +{order.items.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                <div className="text-right">
                  <span className="text-xs text-gray-400 uppercase tracking-wider block">
                    Amount Paid
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    ${order.totalAmount?.toFixed(2)}
                  </span>
                </div>

                <Link
                  to={`/order-success/${order._id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition"
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
