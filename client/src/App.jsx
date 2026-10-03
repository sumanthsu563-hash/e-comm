import { useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axiosClient from './api/axiosClient';
import socket from './api/socketClient';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { fetchCurrentUser } from './features/auth/authSlice';
import { setOrders, updateOrderStatus } from './features/order/orderSlice';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import HomePage from './pages/HomePage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProfilePage from './pages/ProfilePage';
import ShopPage from './pages/ShopPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

export default function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCurrentUser());

    const handleForceLogout = () => {
      dispatch({ type: 'auth/logout/fulfilled' });
    };

    window.addEventListener('auth:logout', handleForceLogout);
    return () => window.removeEventListener('auth:logout', handleForceLogout);
  }, [dispatch]);

  useEffect(() => {
    const handleStatusUpdate = ({ orderId, status }) => {
      dispatch(updateOrderStatus({ orderId, status }));
      toast.success(`Order #${orderId.slice(-8)} status: ${status}`);
    };

    socket.on('orderStatusUpdated', handleStatusUpdate);
    return () => socket.off('orderStatusUpdated', handleStatusUpdate);
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(setOrders([]));
      return;
    }

    axiosClient
      .get('/orders')
      .then((res) => dispatch(setOrders(res.data?.data?.orders || [])))
      .catch((err) => console.error('Failed to fetch orders', err));
  }, [dispatch, isAuthenticated]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 text-gray-900 selection:bg-blue-500 selection:text-white">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ShopPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/order-success/:id" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster position="top-right" />
    </Router>
  );
}
