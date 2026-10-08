import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight, Package, Truck, ShieldCheck, Sparkles } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import LoadingSpinner from '../components/LoadingSpinner';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
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
    return <LoadingSpinner message="Fetching verified receipt..." />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card p-6 sm:p-12 text-center space-y-8">
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 text-xs uppercase px-3.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-extrabold tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Order Confirmed & Paid
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
            Thank you for your order!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto">
            Your payment was securely verified. Merchants have been notified for immediate packaging and dispatch.
          </p>
        </div>

        {order && (
          <div className="bg-slate-50 rounded-2xl p-6 text-left space-y-5 border border-slate-200/80">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Order ID</span>
                <span className="font-mono font-bold text-slate-900">#{order._id?.slice(-8).toUpperCase()}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Payment Ref</span>
                <span className="font-mono text-slate-700">{order.paymentInfo?.id || 'Razorpay Verified'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Total Amount</span>
                <span className="font-black text-brand-600 text-sm">${order.totalAmount?.toFixed(2)}</span>
              </div>
            </div>

            {/* Purchased Items */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Purchased Items ({order.items?.length})
              </span>
              <div className="divide-y divide-slate-100">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs sm:text-sm py-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-11 h-11 rounded-xl object-cover bg-white border border-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-900 line-clamp-1">{item.title}</p>
                        <p className="text-[11px] text-slate-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-black text-slate-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="pt-4 border-t border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-700 block uppercase text-[10px] tracking-wider">Delivery Destination:</span>
              <p className="font-medium">
                {order.shippingAddress?.street}, {order.shippingAddress?.city},{' '}
                {order.shippingAddress?.state} {order.shippingAddress?.postalCode},{' '}
                {order.shippingAddress?.country}
              </p>
              <p className="text-slate-400">Recipient Phone: {order.shippingAddress?.phone}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            to="/orders"
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-2xl text-xs font-bold hover:from-brand-700 hover:to-indigo-700 shadow-md shadow-brand-500/20 transition"
          >
            Track Order Status
          </Link>
          <Link
            to="/products"
            className="w-full sm:w-auto px-6 py-3.5 border border-slate-300 text-slate-700 rounded-2xl text-xs font-bold hover:bg-slate-50 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
