import React from 'react';
import { Search, X, Sparkles } from 'lucide-react';

const SUGGESTIONS = [
  'Tabata Amaral',
  'Arthur Lira',
  'Zenaide Maia',
  'Eduardo Bolsonaro',
  'Erika Hilton',
  'Wellington Fagundes',
  'Guilherme Boulos',
  'Damares Alves'
];

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  onClear,
  loading = false
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit?.();
    }
  };

  return (
    <div className="w-full">
      <div className="relative flex items-center">
        <div className="absolute left-4 text-slate-400 pointer-events-none">
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Pesquisar político por nome parlamentar ou civil (ex: Tabata Amaral, Arthur Lira, Zenaide Maia...)"
          className="w-full pl-12 pr-28 py-3.5 bg-white border border-slate-300 rounded-2xl text-slate-900 placeholder-slate-400 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-xs"
        />

        <div className="absolute right-3 flex items-center gap-1.5">
          {value && (
            <button
              type="button"
              onClick={onClear}
              title="Limpar texto"
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-700 text-white rounded-xl text-xs md:text-sm font-semibold hover:bg-blue-800 disabled:opacity-60 transition-colors shadow-xs cursor-pointer"
          >
            {loading ? 'Buscando...' : 'Pesquisar'}
          </button>
        </div>
      </div>

      {/* Sugestões rápidas de pesquisa */}
      <div className="flex flex-wrap items-center gap-1.5 mt-2.5 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 mr-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          Exemplos para pesquisar:
        </span>
        {SUGGESTIONS.map((sug) => (
          <button
            key={sug}
            type="button"
            onClick={() => {
              onChange(sug);
              // Dispara busca imediatamente com o valor sugerido
              setTimeout(() => onSubmit?.(sug), 50);
            }}
            className="px-2 py-0.5 rounded-md bg-slate-100/90 text-slate-700 hover:bg-blue-50 hover:text-blue-800 border border-slate-200/80 transition-colors text-[11px] cursor-pointer"
          >
            {sug}
          </button>
        ))}
      </div>
    </div>
  );
}
