import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Store, ShieldCheck } from 'lucide-react';

export default function ProductCard({ product }) {
  const defaultImage =
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';
  const imageUrl = product.images?.[0]?.url || defaultImage;

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      {/* Thumbnail */}
      <Link
        to={`/products/${product._id}`}
        className="relative block aspect-square overflow-hidden bg-gray-100"
      >
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {product.stock <= 0 ? (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
            Out of Stock
          </div>
        ) : product.stock <= 5 ? (
          <div className="absolute top-3 left-3 bg-amber-500 text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
            Only {product.stock} Left
          </div>
        ) : null}

        {product.category?.name && (
          <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm border border-gray-100">
            {product.category.name}
          </span>
        )}
      </Link>

      {/* Info Body */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Seller Info */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1.5">
          <Store className="w-3.5 h-3.5 text-blue-600" />
          <span className="truncate">Sold by: {product.seller?.name || 'Verified Vendor'}</span>
        </div>

        {/* Title */}
        <Link
          to={`/products/${product._id}`}
          className="font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors text-base"
        >
          {product.title}
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-2 mb-3">
          <div className="flex items-center text-amber-400">
            <Star className="w-4 h-4 fill-current" />
          </div>
          <span className="text-xs font-bold text-gray-800">
            {product.ratings > 0 ? product.ratings.toFixed(1) : 'New'}
          </span>
          <span className="text-xs text-gray-400">
            ({product.numReviews || 0} reviews)
          </span>
        </div>

        {/* Price & Action */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 uppercase tracking-wider block">Price</span>
            <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          </div>

          <Link
            to={`/products/${product._id}`}
            className="px-3.5 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
