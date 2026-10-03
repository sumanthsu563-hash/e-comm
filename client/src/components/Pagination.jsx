import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
            currentPage === p
              ? 'bg-blue-600 text-white shadow-sm'
              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
