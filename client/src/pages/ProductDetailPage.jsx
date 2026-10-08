import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axiosClient from '../api/axiosClient';
import LoadingSpinner from '../components/LoadingSpinner';
import { addToCart } from '../features/cart/cartSlice';
import {
  Star,
  Store,
  ShieldCheck,
  Truck,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  ShoppingCart,
  Plus,
  Minus,
  Check,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/products/${id}`);
        setProduct(res.data?.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Loading product details..." />;
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Item Unavailable</h2>
        <p className="text-sm text-slate-500 mb-6">{error || 'This item could not be retrieved.'}</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>
      </div>
    );
  }

  const defaultImage =
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';
  const images = product.images?.length > 0 ? product.images : [{ url: defaultImage }];

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Breadcrumb Navigation */}
      <div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-brand-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-card relative group">
            <img
              src={images[selectedImage]?.url || defaultImage}
              alt={product.title}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            {product.category?.name && (
              <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-slate-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-slate-100">
                {product.category.name}
              </span>
            )}
          </div>

          {/* Thumbnail list */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === idx
                      ? 'border-brand-600 ring-4 ring-brand-500/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`Thumb ${idx}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Buy Box */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-subtle space-y-6">
          {/* Header Title & Rating */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Item #{product._id?.slice(-6).toUpperCase()}</span>
              <span>•</span>
              <span className="text-brand-600 font-semibold">{product.category?.name || 'General'}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {product.title}
            </h1>

            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-current" />
              </div>
              <span className="text-sm font-bold text-slate-900">
                {product.ratings > 0 ? product.ratings.toFixed(1) : '5.0'}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                ({product.numReviews || 0} customer reviews)
              </span>
            </div>
          </div>

          {/* Price & Stock Tag */}
          <div className="flex items-baseline justify-between pt-2 pb-4 border-y border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Selling Price
              </span>
              <span className="text-3xl sm:text-4xl font-black text-slate-900">
                ${product.price?.toFixed(2)}
              </span>
            </div>

            <div>
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> In Stock ({product.stock} units)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Product Overview
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Quantity Selector & Action Button */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Quantity:
              </span>
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || product.stock <= 0}
                  className="p-2 text-slate-600 hover:bg-slate-200 disabled:opacity-30 transition"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-12 text-center text-sm font-bold text-slate-800">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))}
                  disabled={quantity >= product.stock || product.stock <= 0}
                  className="p-2 text-slate-600 hover:bg-slate-200 disabled:opacity-30 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="w-full py-4 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 shadow-md shadow-brand-500/25 hover:shadow-glow disabled:opacity-50 transition text-sm flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Shopping Cart
            </button>

            {addedNotice && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold text-center flex items-center justify-between animate-fade-in">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" /> Added {quantity} item(s) to your cart!
                </span>
                <Link
                  to="/cart"
                  className="underline font-bold text-emerald-900 hover:text-emerald-950"
                >
                  Go to Cart &rarr;
                </Link>
              </div>
            )}
          </div>

          {/* Seller / Vendor Info Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                  Merchant
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  {product.seller?.name || 'Verified Merchant'}
                </h4>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified
            </span>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-600" />
              <span>Free Delivery on orders $100+</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-emerald-600" />
              <span>7-Day Return Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
