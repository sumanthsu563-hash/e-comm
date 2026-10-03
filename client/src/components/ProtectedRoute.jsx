import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return (
      <div className="max-w-xl mx-auto my-12 p-6 bg-red-50 border border-red-200 rounded-2xl text-center">
        <h2 className="text-xl font-bold text-red-700 mb-2">Access Denied</h2>
        <p className="text-sm text-red-600 mb-4">
          Your account role ({user?.role}) does not have permission to access this portal.
        </p>
        <a
          href="/"
          className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition"
        >
          Return to Marketplace
        </a>
      </div>
    );
  }

  return children;
}
