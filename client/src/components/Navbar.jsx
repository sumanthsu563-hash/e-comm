import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ShoppingBag,
  ShoppingCart,
  Search,
  User,
  LogOut,
  Menu,
  X,
  Store,
  ShieldCheck,
  Package
} from 'lucide-react';
import { logoutUser } from '../features/auth/authSlice';
import { selectCartTotalCount } from '../features/cart/cartSlice';

export default function Navbar() {
  const [keyword, setKeyword] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const totalCartCount = useSelector(selectCartTotalCount);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?search=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'seller':
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800">
            <Store className="w-3 h-3" /> Seller
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-purple-100 text-purple-800">
            <ShieldCheck className="w-3 h-3" /> Admin
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-800">
            <User className="w-3 h-3" /> Customer
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-gray-900 leading-none">
                NexStore
              </span>
              <span className="text-[10px] tracking-wider uppercase text-blue-600 font-bold">
                Marketplace
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-lg relative items-center"
          >
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search products, brands, categories..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
          </form>

          {/* Nav Links & Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/products"
              className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition"
            >
              Explore Products
            </Link>

            {/* Shopping Cart Icon with Badge */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-blue-600 transition flex items-center"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {totalCartCount > 99 ? '99+' : totalCartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                <Link
                  to="/orders"
                  className="text-xs font-semibold text-gray-600 hover:text-blue-600 transition flex items-center gap-1"
                >
                  <Package className="w-3.5 h-3.5" /> My Orders
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center gap-2 hover:opacity-80 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 border flex items-center justify-center font-bold text-gray-700 text-sm">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-gray-900 leading-none">
                      {user?.name}
                    </span>
                    <div className="mt-0.5">{getRoleBadge(user?.role)}</div>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition"
                >
                  Join Market
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </form>

          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-gray-700"
          >
            Explore Catalog
          </Link>

          <Link
            to="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2 text-sm font-medium text-gray-700"
          >
            <span className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-blue-600" /> Shopping Cart
            </span>
            {totalCartCount > 0 && (
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {totalCartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="pt-2 border-t border-gray-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{user?.name}</span>
                {getRoleBadge(user?.role)}
              </div>
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 text-sm text-gray-600"
              >
                My Orders
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 text-sm text-gray-600"
              >
                My Account
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left py-1.5 text-sm font-medium text-red-600"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-gray-100 flex gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-sm font-medium border rounded-lg"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-sm font-medium text-white bg-blue-600 rounded-lg"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
