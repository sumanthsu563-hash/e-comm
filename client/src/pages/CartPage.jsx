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
  ShieldCheck
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
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 10;
  const total = subtotal + tax + shipping;

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
        <div className="max-w-md mx-auto text-center bg-white p-10 rounded-3xl border border-gray-200 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
          <p className="text-sm text-gray-500 mb-6">
            Looks like you haven't added anything to your cart yet. Discover quality products from our verified merchants!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
          >
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {cartItems.length} unique item{cartItems.length > 1 ? 's' : ''} in your cart
          </p>
        </div>

        <button
          onClick={() => dispatch(clearCart())}
          className="text-xs text-red-600 hover:text-red-700 font-semibold transition"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.product}
              className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
            >
              {/* Product Thumbnail & Details */}
              <div className="flex items-center gap-4 flex-1">
                <Link
                  to={`/products/${item.product}`}
                  className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Store className="w-3.5 h-3.5 text-blue-600" />
                    <span>{item.sellerName || 'Merchant'}</span>
                  </div>
                  <Link
                    to={`/products/${item.product}`}
                    className="font-semibold text-gray-900 hover:text-blue-600 transition text-base block line-clamp-1"
                  >
                    {item.title}
                  </Link>
                  <span className="text-sm font-bold text-gray-900">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Quantity Stepper & Subtotal */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
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
                    className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-gray-800">
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
                    className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="text-base font-extrabold text-gray-900 w-20 text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>

                <button
                  onClick={() => dispatch(removeFromCart(item.product))}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition"
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
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100">
            Order Summary
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Items Subtotal</span>
              <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Estimated Tax (5%)</span>
              <span className="font-semibold text-gray-900">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping Fee</span>
              <span className="font-semibold text-gray-900">
                {shipping === 0 ? (
                  <span className="text-emerald-600 font-bold">FREE</span>
                ) : (
                  `$${shipping.toFixed(2)}`
                )}
              </span>
            </div>
            {shipping > 0 && (
              <p className="text-[11px] text-gray-400 italic">
                Add ${(100 - subtotal).toFixed(2)} more to qualify for Free Shipping
              </p>
            )}
            <div className="pt-3 border-t border-gray-100 flex justify-between text-base font-bold text-gray-900">
              <span>Total Price</span>
              <span className="text-xl text-blue-600">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition text-sm flex items-center justify-center gap-2"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Encrypted Razorpay Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
