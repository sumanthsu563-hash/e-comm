import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, Mail, Shield, Calendar, LogOut } from 'lucide-react';
import { logoutUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Profile Header Cover */}
        <div className="h-36 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
          <div className="absolute -bottom-10 left-8">
            <div className="w-24 h-24 rounded-2xl bg-white p-1.5 shadow-md">
              <div className="w-full h-full rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-3xl">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-14 pb-8 px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs uppercase px-2.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800">
                  {user?.role}
                </span>
                <span className="text-sm text-gray-500">• {user?.email}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 transition"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-100">
            <div className="p-4 rounded-xl bg-gray-50">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase mb-1">
                <Shield className="w-4 h-4 text-blue-600" />
                Access Level
              </div>
              <p className="text-sm font-bold text-gray-900 capitalize">{user?.role} Permissions</p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase mb-1">
                <Mail className="w-4 h-4 text-emerald-600" />
                Verified Email
              </div>
              <p className="text-sm font-bold text-gray-900 truncate">{user?.email}</p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase mb-1">
                <Calendar className="w-4 h-4 text-purple-600" />
                Member Since
              </div>
              <p className="text-sm font-bold text-gray-900">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
