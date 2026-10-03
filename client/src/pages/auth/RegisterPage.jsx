import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, Lock, Mail, User, Store, AlertCircle } from 'lucide-react';
import { registerUser, clearAuthError } from '../../features/auth/authSlice';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthError());
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email && password) {
      dispatch(registerUser({ name, email, password, role }));
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white mx-auto shadow-md shadow-blue-500/20">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h2 className="mt-4 text-3xl font-extrabold text-gray-900 tracking-tight">
          Create an Account
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Join thousands of buyers and independent merchants on NexStore.
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
            {/* Account Type Toggle */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                I want to join as:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`flex flex-col items-center p-3 rounded-xl border text-center transition ${
                    role === 'customer'
                      ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-semibold ring-2 ring-blue-500/20'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <User className="w-5 h-5 mb-1 text-blue-600" />
                  <span className="text-xs">Customer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('seller')}
                  className={`flex flex-col items-center p-3 rounded-xl border text-center transition ${
                    role === 'seller'
                      ? 'border-emerald-600 bg-emerald-50/50 text-emerald-700 font-semibold ring-2 ring-emerald-500/20'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Store className="w-5 h-5 mb-1 text-emerald-600" />
                  <span className="text-xs">Merchant / Seller</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe or Acme Inc."
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              </div>
            </div>

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
                  minLength="6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
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
              {loading ? 'Creating account...' : 'Complete Registration'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
