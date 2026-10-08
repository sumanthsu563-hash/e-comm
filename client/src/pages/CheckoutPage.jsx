import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  MapPin,
  CreditCard,
  ShieldCheck,
  AlertCircle,
  ShoppingBag,
  ArrowLeft,
  Lock,
  Truck,
  CheckCircle2
} from 'lucide-react';
import {
  selectCartItems,
  selectCartSubtotal,
  saveShippingAddress,
  clearCart
} from '../features/cart/cartSlice';
import axiosClient from '../api/axiosClient';

export default function CheckoutPage() {
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const savedAddress = useSelector((state) => state.cart.shippingAddress);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const tax = subtotal * 0.05;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  const [shippingForm, setShippingForm] = useState({
    street: savedAddress?.street || '',
    city: savedAddress?.city || '',
    state: savedAddress?.state || '',
    postalCode: savedAddress?.postalCode || '',
    country: savedAddress?.country || 'India',
    phone: savedAddress?.phone || ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setShippingForm({ ...shippingForm, [e.target.name]: e.target.value });
  };

  const handlePlaceOrderAndPay = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate address fields
    if (
      !shippingForm.street ||
      !shippingForm.city ||
      !shippingForm.state ||
      !shippingForm.postalCode ||
      !shippingForm.phone
    ) {
      setError('Please fill in all required shipping address fields');
      return;
    }

    // Save address in state/localStorage
    dispatch(saveShippingAddress(shippingForm));

    try {
      setLoading(true);

      // 1. Create Order in Backend
      const orderPayload = {
        items: cartItems.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          title: item.title,
          price: item.price,
          image: item.image,
          seller: item.seller
        })),
        shippingAddress: shippingForm
      };

      const orderRes = await axiosClient.post('/orders', orderPayload);
      const createdOrder = orderRes.data?.data;
      const orderId = createdOrder._id;

      // 2. Initialize Razorpay Order
      const paymentRes = await axiosClient.post('/payments/create-order', {
        orderId
      });
      const paymentData = paymentRes.data?.data;

      // 3. Handle Razorpay Checkout Modal
      if (window.Razorpay && !paymentData.isMock) {
        const options = {
          key: paymentData.keyId,
          amount: paymentData.amount,
          currency: paymentData.currency || 'INR',
          name: 'NexStore Marketplace',
          description: `Order #${orderId}`,
          order_id: paymentData.razorpayOrderId,
          prefill: {
            name: user?.name,
            email: user?.email,
            contact: shippingForm.phone
          },
          theme: {
            color: '#4f46e5'
          },
          handler: async (response) => {
            try {
              // 4. Verify signature on backend
              await axiosClient.post('/payments/verify', {
                orderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              });

              dispatch(clearCart());
              navigate(`/order-success/${orderId}`);
            } catch (vErr) {
              setError('Payment verification failed. Please contact support.');
            }
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
            }
          }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        // Simulation / Test Mode Fallback (Direct Verification)
        const mockPaymentId = `pay_mock_${Date.now()}`;
        const mockSignature = `mock_sig_${Date.now()}`;

        await axiosClient.post('/payments/verify', {
          orderId,
          razorpayOrderId: paymentData.razorpayOrderId,
          razorpayPaymentId: mockPaymentId,
          razorpaySignature: mockSignature
        });

        dispatch(clearCart());
        navigate(`/order-success/${orderId}`);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to process checkout. Please check item availability.'
      );
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
        <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500 mb-6">
          Add items to your cart before proceeding to checkout.
        </p>
        <Link
          to="/products"
          className="inline-block px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Breadcrumb & Title */}
      <div>
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-brand-600 transition mb-3"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Checkout & Payment
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Complete your delivery address and authorize payment securely.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrderAndPay} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Address Form */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-subtle space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Delivery Address</h3>
              <p className="text-xs text-slate-400">Where should your package be shipped?</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Street Address *
              </label>
              <input
                type="text"
                name="street"
                required
                value={shippingForm.street}
                onChange={handleInputChange}
                placeholder="Flat 101, Palm Heights, Main Avenue"
                className="w-full text-sm py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                City *
              </label>
              <input
                type="text"
                name="city"
                required
                value={shippingForm.city}
                onChange={handleInputChange}
                placeholder="Mumbai or San Francisco"
                className="w-full text-sm py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                State / Province *
              </label>
              <input
                type="text"
                name="state"
                required
                value={shippingForm.state}
                onChange={handleInputChange}
                placeholder="Maharashtra or CA"
                className="w-full text-sm py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Postal Code *
              </label>
              <input
                type="text"
                name="postalCode"
                required
                value={shippingForm.postalCode}
                onChange={handleInputChange}
                placeholder="400001"
                className="w-full text-sm py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Contact Phone *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={shippingForm.phone}
                onChange={handleInputChange}
                placeholder="+91 9876543210"
                className="w-full text-sm py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-subtle space-y-6 sticky top-24">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Payment Summary</h3>
              <p className="text-xs text-slate-400">Razorpay Encrypted Gateway</p>
            </div>
          </div>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1 divide-y divide-slate-100">
            {cartItems.map((item) => (
              <div key={item.product} className="flex items-center justify-between text-xs pt-2">
                <span className="text-slate-700 truncate max-w-[180px] font-medium">
                  {item.quantity}x {item.title}
                </span>
                <span className="font-bold text-slate-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Items Subtotal</span>
              <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax (5%)</span>
              <span className="font-bold text-slate-900">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping Fee</span>
              <span className="font-bold">
                {shipping === 0 ? (
                  <span className="text-emerald-600 font-extrabold">FREE</span>
                ) : (
                  `$${shipping.toFixed(2)}`
                )}
              </span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between text-base font-black text-slate-900">
              <span>Total Payable</span>
              <span className="text-brand-600 text-xl font-black">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 shadow-md shadow-brand-500/25 hover:shadow-glow disabled:opacity-50 transition text-sm flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            {loading ? 'Processing Payment...' : `Pay $${total.toFixed(2)} with Razorpay`}
          </button>

          <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Test Mode Active • No real card charges
          </p>
        </div>
      </form>
    </div>
  );
}
