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
  MessageSquare
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
      <div className="max-w-xl mx-auto my-16 p-8 text-center bg-white rounded-3xl border border-gray-200 shadow-sm">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Item Unavailable</h2>
        <p className="text-sm text-gray-500 mb-6">{error || 'This item could not be retrieved.'}</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
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
    setTimeout(() => setAddedNotice(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb back */}
      <div>
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden border border-gray-200">
            <img
              src={images[selectedImage]?.url || defaultImage}
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Thumbnail list */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${
                    selectedImage === idx
                      ? 'border-blue-600 ring-2 ring-blue-600/20'
                      : 'border-gray-200 hover:border-gray-400'
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
        <div className="space-y-6">
          {/* Category Tag */}
          {product.category?.name && (
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
              {product.category.name}
            </span>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {product.title}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <span className="text-sm font-bold text-gray-800">
              {product.ratings > 0 ? product.ratings.toFixed(1) : 'New Product'}
            </span>
            <span className="text-sm text-gray-400">
              • {product.numReviews || 0} reviews
            </span>
          </div>

          {/* Price */}
          <div className="pt-2">
            <span className="text-4xl font-extrabold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
          </div>

          {/* Stock Status */}
          <div>
            {product.stock > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" /> In Stock ({product.stock} units available)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 px-3 py-1.5 rounded-full border border-red-200">
                Out of Stock
              </span>
            )}
          </div>

          {/* Description */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">
              Description
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Quantity Selector & Action */}
          <div className="pt-6 border-t border-gray-100 space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Quantity:</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                disabled={product.stock <= 0}
                className="py-1.5 px-3 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from(
                  { length: Math.min(10, product.stock || 1) },
                  (_, i) => i + 1
                ).map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 disabled:opacity-50 transition duration-150 text-sm"
            >
              Add to Shopping Cart
            </button>

            {addedNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium text-center flex items-center justify-center gap-2">
                <span>Added to cart!</span>
                <Link to="/cart" className="underline font-bold text-emerald-900 hover:text-emerald-950">
                  View Cart & Checkout &rarr;
                </Link>
              </div>
            )}
          </div>

          {/* Seller Card */}
          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Merchant / Vendor</p>
                <h4 className="text-sm font-bold text-gray-900">
                  {product.seller?.name || 'Verified Merchant'}
                </h4>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified
            </span>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section Placeholder (for Phase 5) */}
      <div className="pt-12 border-t border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
          </div>
          <span className="text-xs font-medium text-gray-400">
            Verified Purchases Only
          </span>
        </div>

        <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-200">
          <p className="text-sm text-gray-600 font-medium">
            No customer reviews yet for this product.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Customers who purchase this product can leave verified ratings and reviews.
          </p>
        </div>
      </div>
    </div>
  );
}
