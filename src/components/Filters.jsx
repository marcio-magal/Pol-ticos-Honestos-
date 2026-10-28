import React from 'react';
import { Filter, RotateCcw, Landmark, Building2, Users } from 'lucide-react';
import { BRAZIL_STATES, COMMON_PARTIES } from '../utils/formatters.js';

export default function Filters({
  tipo,
  onTipoChange,
  uf,
  onUfChange,
  partido,
  onPartidoChange,
  onReset
}) {
  const hasActiveFilters = tipo !== 'todos' || uf !== '' || partido !== '';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-2xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Seletor de Casa / Tipo de Político */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Casa Legislativa / Cargo</span>
          </label>
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80">
            <button
              type="button"
              onClick={() => onTipoChange('todos')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                tipo === 'todos'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>Todos</span>
            </button>

            <button
              type="button"
              onClick={() => onTipoChange('deputados')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                tipo === 'deputados'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-blue-700'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Deputados Federais</span>
            </button>

            <button
              type="button"
              onClick={() => onTipoChange('senadores')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                tipo === 'senadores'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Senadores</span>
            </button>
          </div>
        </div>

        {/* Dropdowns de Estado (UF) e Partido */}
        <div className="flex flex-wrap sm:flex-nowrap items-end gap-3 flex-1 lg:max-w-md">
          {/* UF */}
          <div className="w-full sm:w-1/2 flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Estado (UF)
            </label>
            <select
              value={uf}
              onChange={(e) => onUfChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors cursor-pointer"
            >
              <option value="">Todos os estados</option>
              {BRAZIL_STATES.map((st) => (
                <option key={st.sigla} value={st.sigla}>
                  {st.sigla} - {st.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Partido */}
          <div className="w-full sm:w-1/2 flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Partido Político
            </label>
            <select
              value={partido}
              onChange={(e) => onPartidoChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors cursor-pointer"
            >
              <option value="">Todos os partidos</option>
              {COMMON_PARTIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Botão Limpar Filtros */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              title="Restaurar filtros padrões"
              className="h-[38px] px-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-rose-700 bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl transition-colors cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Limpar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
