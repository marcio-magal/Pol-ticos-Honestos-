import React from 'react';
import { SearchX, FilterX } from 'lucide-react';

export default function EmptyState({
  title = 'Nenhum político encontrado',
  description = 'Tente ajustar os termos de pesquisa pelo nome, ou limpe os filtros de partido e estado para ampliar a consulta.',
  onClear
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white/60 my-6">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        <SearchX className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-slate-800">{title}</h3>
      <p className="text-xs text-slate-500 max-w-md mt-1.5 leading-relaxed">
        {description}
      </p>
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          <FilterX className="w-3.5 h-3.5" />
          <span>Limpar todos os filtros</span>
        </button>
      )}
    </div>
  );
}
