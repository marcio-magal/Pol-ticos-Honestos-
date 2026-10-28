import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage = 1,
  hasPrevious = false,
  hasNext = false,
  onPageChange,
  loading = false,
  totalLabel = ''
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 border-t border-slate-200 mt-6">
      <div className="text-xs text-slate-500 font-medium">
        Página <span className="font-bold text-slate-800">{currentPage}</span>
        {totalLabel ? ` • ${totalLabel}` : ''}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={!hasPrevious || loading}
          onClick={() => onPageChange(currentPage - 1)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Anterior</span>
        </button>

        <span className="px-3 py-1 text-xs font-semibold rounded-md bg-blue-50 text-blue-800 border border-blue-200">
          {currentPage}
        </span>

        <button
          type="button"
          disabled={!hasNext || loading}
          onClick={() => onPageChange(currentPage + 1)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
        >
          <span>Próxima</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
