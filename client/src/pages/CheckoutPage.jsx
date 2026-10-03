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
  CheckCircle2,
  Lock
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
            color: '#2563eb'
          },
          handler: async (response) => {
            try {
              // 4. Verify signature on backend
              const verifyRes = await axiosClient.post('/payments/verify', {
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
      <div className="max-w-md mx-auto my-20 p-8 text-center bg-white rounded-3xl border border-gray-200 shadow-sm">
        <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
        <p className="text-sm text-gray-500 mb-6">
          Add items to your cart before proceeding to checkout.
        </p>
        <Link
          to="/products"
          className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-blue-600 transition mb-3"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Secure Checkout
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Review shipping information and finalize your payment via Razorpay.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrderAndPay} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Shipping Address Form */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Shipping Address</h3>
              <p className="text-xs text-gray-400">Where should our merchants deliver?</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                name="street"
                required
                value={shippingForm.street}
                onChange={handleInputChange}
                placeholder="123 Market Street, Apt 4B"
                className="w-full text-sm py-2 px-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                name="city"
                required
                value={shippingForm.city}
                onChange={handleInputChange}
                placeholder="Mumbai or New York"
                className="w-full text-sm py-2 px-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                State / Province *
              </label>
              <input
                type="text"
                name="state"
                required
                value={shippingForm.state}
                onChange={handleInputChange}
                placeholder="Maharashtra / NY"
                className="w-full text-sm py-2 px-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Postal Code *
              </label>
              <input
                type="text"
                name="postalCode"
                required
                value={shippingForm.postalCode}
                onChange={handleInputChange}
                placeholder="400001"
                className="w-full text-sm py-2 px-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={shippingForm.phone}
                onChange={handleInputChange}
                placeholder="+91 9876543210"
                className="w-full text-sm py-2 px-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Payment & Order Summary */}
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Payment Summary</h3>
              <p className="text-xs text-gray-400">Razorpay Encrypted Gateway</p>
            </div>
          </div>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item.product} className="flex items-center justify-between text-xs">
                <span className="text-gray-700 truncate max-w-[180px]">
                  {item.quantity}x {item.title}
                </span>
                <span className="font-semibold text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (5%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="pt-2 border-t border-gray-100 flex justify-between text-base font-extrabold text-gray-900">
              <span>Total Payable</span>
              <span className="text-blue-600 text-xl">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 disabled:opacity-50 transition text-sm flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            {loading ? 'Processing Payment...' : `Pay $${total.toFixed(2)} with Razorpay`}
          </button>

          <p className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Test Mode Active • No real charges will be made
          </p>
        </div>
      </form>
    </div>
  );
}
