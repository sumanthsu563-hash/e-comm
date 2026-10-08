import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Star, Store, ShieldCheck, ShoppingCart, Check, Heart, Eye } from 'lucide-react';
import { addToCart } from '../features/cart/cartSlice';

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const dispatch = useDispatch();

  const defaultImage =
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';
  const imageUrl = product.images?.[0]?.url || defaultImage;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0) {
      dispatch(addToCart({ product, quantity: 1 }));
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-3xl border border-slate-200/80 hover:border-brand-300 hover:shadow-card-hover transition-all duration-300 flex flex-col h-full overflow-hidden"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <Link to={`/products/${product._id}`} className="block w-full h-full">
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.stock <= 0 ? (
            <span className="inline-flex items-center text-[10px] font-extrabold uppercase tracking-wider bg-rose-600/90 text-white px-2.5 py-1 rounded-full shadow-sm backdrop-blur-sm">
              Out of Stock
            </span>
          ) : product.stock <= 5 ? (
            <span className="inline-flex items-center text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-white px-2.5 py-1 rounded-full shadow-sm">
              Only {product.stock} Left
            </span>
          ) : null}

          {product.category?.name && (
            <span className="inline-flex items-center text-[11px] font-semibold bg-white/95 text-slate-700 px-2.5 py-0.5 rounded-full shadow-sm border border-slate-100 backdrop-blur-md">
              {product.category.name}
            </span>
          )}
        </div>

        {/* Quick Action Overlay on Card Hover */}
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
          <button
            onClick={handleQuickAdd}
            disabled={product.stock <= 0}
            className={`flex-1 py-2.5 px-3 rounded-2xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-1.5 ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900/90 hover:bg-brand-600 text-white backdrop-blur-md hover:shadow-brand-500/25'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" /> Quick Add
              </>
            )}
          </button>

          <Link
            to={`/products/${product._id}`}
            title="Quick View"
            className="p-2.5 bg-white/90 hover:bg-white text-slate-700 hover:text-brand-600 rounded-2xl shadow-lg backdrop-blur-md transition-colors"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Info Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Seller / Store Tag */}
          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 mb-1.5">
            <Store className="w-3 h-3 text-brand-600 flex-shrink-0" />
            <span className="truncate">{product.seller?.name || 'Verified Vendor'}</span>
            <ShieldCheck className="w-3 h-3 text-emerald-500 ml-0.5 flex-shrink-0" />
          </div>

          {/* Product Title */}
          <Link
            to={`/products/${product._id}`}
            className="font-bold text-slate-900 hover:text-brand-600 transition-colors line-clamp-2 text-sm leading-snug"
          >
            {product.title}
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-bold text-slate-800">
              {product.ratings > 0 ? product.ratings.toFixed(1) : 'New'}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              ({product.numReviews || 0})
            </span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Price
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-slate-900">
                ${product.price?.toFixed(2)}
              </span>
            </div>
          </div>

          <Link
            to={`/products/${product._id}`}
            className="px-3.5 py-1.5 text-xs font-bold text-brand-600 bg-brand-50/80 hover:bg-brand-600 hover:text-white rounded-xl transition-all duration-200"
          >
            View Item
          </Link>
        </div>
      </div>
    </div>
  );
}
