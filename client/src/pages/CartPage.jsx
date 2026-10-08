import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Store,
  ShieldCheck,
  Truck,
  Sparkles
} from 'lucide-react';
import {
  selectCartItems,
  selectCartSubtotal,
  updateCartQuantity,
  removeFromCart,
  clearCart
} from '../features/cart/cartSlice';

export default function CartPage() {
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const tax = subtotal * 0.05;
  const freeShippingThreshold = 100;
  const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 10;
  const total = subtotal + tax + shipping;

  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-md mx-auto text-center bg-white p-10 rounded-3xl border border-slate-200/80 shadow-subtle space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Your Cart is Empty</h2>
          <p className="text-sm text-slate-500">
            Looks like you haven't added anything to your cart yet. Discover items from our verified merchants!
          </p>
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-2xl text-sm font-bold shadow-md shadow-brand-500/20 hover:shadow-glow transition"
            >
              Start Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {cartItems.length} unique item{cartItems.length > 1 ? 's' : ''} in your cart
          </p>
        </div>

        <button
          onClick={() => dispatch(clearCart())}
          className="text-xs text-rose-600 hover:text-rose-700 font-bold hover:underline transition"
        >
          Clear Cart
        </button>
      </div>

      {/* Free Shipping Progress Indicator */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-subtle space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1.5 text-brand-700">
            <Truck className="w-4 h-4 text-brand-600" />
            {subtotal >= freeShippingThreshold ? (
              <span className="text-emerald-700 font-extrabold">🎉 You unlocked FREE Shipping!</span>
            ) : (
              <span>
                Add <span className="font-extrabold text-brand-600">${(freeShippingThreshold - subtotal).toFixed(2)}</span> more to unlock Free Delivery
              </span>
            )}
          </span>
          <span className="text-slate-400">{Math.round(progressToFreeShipping)}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              subtotal >= freeShippingThreshold
                ? 'bg-emerald-500'
                : 'bg-gradient-to-r from-brand-500 to-indigo-600'
            }`}
            style={{ width: `${progressToFreeShipping}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.product}
              className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 hover:border-slate-300 transition"
            >
              {/* Product Thumbnail & Details */}
              <div className="flex items-center gap-4 flex-1">
                <Link
                  to={`/products/${item.product}`}
                  className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                    <Store className="w-3 h-3 text-brand-600" />
                    <span className="truncate">{item.sellerName || 'Merchant'}</span>
                  </div>
                  <Link
                    to={`/products/${item.product}`}
                    className="font-bold text-slate-900 hover:text-brand-600 transition text-sm sm:text-base block line-clamp-1"
                  >
                    {item.title}
                  </Link>
                  <span className="text-sm font-bold text-slate-700">
                    ${item.price?.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Quantity Stepper & Subtotal */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-5 border-t sm:border-t-0 pt-3 sm:pt-0">
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() =>
                      dispatch(
                        updateCartQuantity({
                          productId: item.product,
                          quantity: item.quantity - 1
                        })
                      )
                    }
                    disabled={item.quantity <= 1}
                    className="p-2 text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-slate-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      dispatch(
                        updateCartQuantity({
                          productId: item.product,
                          quantity: item.quantity + 1
                        })
                      )
                    }
                    disabled={item.quantity >= item.stock}
                    className="p-2 text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="text-base font-black text-slate-900 w-20 text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>

                <button
                  onClick={() => dispatch(removeFromCart(item.product))}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700"
            >
              <ArrowLeft className="w-4 h-4" /> Continue Browsing
            </Link>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-subtle space-y-6 sticky top-24">
          <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100">
            Order Summary
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Items Subtotal</span>
              <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Estimated Tax (5%)</span>
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

            <div className="pt-4 border-t border-slate-100 flex justify-between text-base font-black text-slate-900">
              <span>Total Amount</span>
              <span className="text-2xl font-black text-brand-600">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full py-4 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 shadow-md shadow-brand-500/25 hover:shadow-glow transition text-sm flex items-center justify-center gap-2"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Encrypted Razorpay Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
