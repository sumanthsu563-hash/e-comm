import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, Mail, Shield, Calendar, LogOut, Package, Store, CheckCircle2 } from 'lucide-react';
import { logoutUser } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
        {/* Profile Header Cover with gradient */}
        <div className="h-40 bg-gradient-to-r from-brand-600 via-indigo-600 to-slate-900 relative">
          <div className="absolute -bottom-10 left-8">
            <div className="w-24 h-24 rounded-3xl bg-white p-2 shadow-lg">
              <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center font-black text-3xl shadow-inner">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-14 pb-8 px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black text-slate-900">{user?.name}</h1>
                <span className="inline-flex items-center gap-1 text-[11px] uppercase px-2.5 py-0.5 rounded-full font-extrabold bg-brand-50 text-brand-700 border border-brand-200">
                  {user?.role}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{user?.email}</p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/orders"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
              >
                <Package className="w-4 h-4" /> My Orders
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5 text-brand-600" />
                Access Role
              </div>
              <p className="text-sm font-bold text-slate-900 capitalize">{user?.role} Account</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                Verified Contact
              </div>
              <p className="text-sm font-bold text-slate-900 truncate">{user?.email}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5 text-purple-600" />
                Member Status
              </div>
              <p className="text-sm font-bold text-slate-900">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active Member'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
