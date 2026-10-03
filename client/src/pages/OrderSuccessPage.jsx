import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight, Package, Truck, ShieldCheck } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import LoadingSpinner from '../components/LoadingSpinner';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axiosClient.get(`/orders/${id}`);
        setOrder(res.data?.data);
      } catch (err) {
        console.error('Failed to load confirmed order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Fetching order receipt..." />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 sm:p-12 text-center space-y-8">
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs uppercase px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold">
            Payment Verified & Order Confirmed
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-3">
            Thank you for your purchase!
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            An email confirmation with full receipt details has been dispatched.
          </p>
        </div>

        {order && (
          <div className="bg-gray-50 rounded-2xl p-6 text-left space-y-4 border border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between pb-4 border-b border-gray-200 text-sm gap-2">
              <div>
                <span className="text-xs text-gray-400 block uppercase font-bold">Order ID</span>
                <span className="font-mono font-bold text-gray-800">{order._id}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block uppercase font-bold">Payment ID</span>
                <span className="font-mono text-gray-700">{order.paymentInfo?.id || 'Completed'}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block uppercase font-bold">Total Paid</span>
                <span className="font-bold text-blue-600">${order.totalAmount?.toFixed(2)}</span>
              </div>
            </div>

            {/* Purchased Items */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Purchased Items ({order.items?.length})
              </span>
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 line-clamp-1">{item.title}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Shipping Address */}
            <div className="pt-4 border-t border-gray-200 text-xs text-gray-600">
              <span className="font-bold text-gray-700 block mb-1">Delivering to:</span>
              <p>
                {order.shippingAddress?.street}, {order.shippingAddress?.city},{' '}
                {order.shippingAddress?.state} {order.shippingAddress?.postalCode},{' '}
                {order.shippingAddress?.country}
              </p>
              <p className="mt-0.5 text-gray-500">Phone: {order.shippingAddress?.phone}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/orders"
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
          >
            View My Orders
          </Link>
          <Link
            to="/products"
            className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
