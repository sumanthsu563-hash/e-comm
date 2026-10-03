import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, Lock, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { loginUser, clearAuthError } from '../../features/auth/authSlice';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  // Redirect target if intercepted by ProtectedRoute
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    dispatch(clearAuthError());
    if (isAuthenticated) {
      navigate(redirect, { replace: true });
    }
  }, [isAuthenticated, navigate, redirect, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      dispatch(loginUser({ email, password }));
    }
  };

  const handleDemoFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white mx-auto shadow-md shadow-blue-500/20">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h2 className="mt-4 text-3xl font-extrabold text-gray-900 tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Sign in to access your orders, store inventory, or platform operations.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-100 sm:rounded-2xl sm:px-10 border border-gray-100">
          {error && (
            <div className="mb-5 flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md shadow-blue-500/20 disabled:opacity-50 transition duration-150"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2 text-center">
              Quick Fill Demo Accounts
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoFill('seller1@test.com', 'password123')}
                className="py-1.5 px-2 text-xs font-medium border border-emerald-200 bg-emerald-50 text-emerald-800 rounded-lg hover:bg-emerald-100 transition"
              >
                Seller Demo
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('admin@test.com', 'password123')}
                className="py-1.5 px-2 text-xs font-medium border border-purple-200 bg-purple-50 text-purple-800 rounded-lg hover:bg-purple-100 transition"
              >
                Admin Demo
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-blue-600 hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
