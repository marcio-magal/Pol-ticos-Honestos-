import React, { useState, useMemo } from 'react';
import { FileText, Search, Filter, Calendar, ExternalLink, Tag } from 'lucide-react';
import { formatDate, normalizeText } from '../../utils/formatters.js';
import SourceLink from '../SourceLink.jsx';

export default function PropositionsTab({ proposicoes = [], loading = false }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('todos');

  // Tipos únicos presentes na lista
  const uniqueTypes = useMemo(() => {
    const set = new Set();
    proposicoes.forEach((p) => {
      const t = p.siglaTipo || p.sigla;
      if (t) set.add(t);
    });
    return Array.from(set).sort();
  }, [proposicoes]);

  // Filtragem local por termo e por tipo
  const filtered = useMemo(() => {
    return proposicoes.filter((p) => {
      const t = p.siglaTipo || p.sigla || '';
      if (typeFilter !== 'todos' && t !== typeFilter) return false;

      if (!searchTerm.trim()) return true;
      const termNorm = normalizeText(searchTerm);
      const descNorm = normalizeText(p.descricao || `${p.numero}/${p.ano}`);
      const ementaNorm = normalizeText(p.ementa || '');

      return descNorm.includes(termNorm) || ementaNorm.includes(termNorm);
    });
  }, [proposicoes, searchTerm, typeFilter]);

  return (
    <div className="space-y-4">
      {/* Barra de Filtros e Busca de Proposições */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrar por número ou palavra-chave..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors cursor-pointer"
          >
            <option value="todos">Todos os tipos de proposição ({proposicoes.length})</option>
            {uniqueTypes.map((t) => (
              <option key={t} value={t}>
                {t} ({proposicoes.filter((p) => (p.siglaTipo || p.sigla) === t).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Proposições */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
          Nenhuma proposição corresponde aos filtros de busca especificados.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p, idx) => {
            const sigla = p.siglaTipo || p.sigla || 'PROPOSIÇÃO';
            const num = p.numero ? `${p.numero}/${p.ano}` : '';

            return (
              <div
                key={p.id || idx}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 p-5 shadow-xs transition-all"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                      <Tag className="w-3 h-3 text-blue-600" />
                      {p.descricao || `${sigla} ${num}`}
                    </span>

                    {p.autorPrincipal !== undefined && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.autorPrincipal
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {p.autorPrincipal ? 'Autor Principal' : 'Coautor'}
                      </span>
                    )}
                  </div>

                  {p.dataApresentacao && (
                    <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Apresentado em: {formatDate(p.dataApresentacao)}
                    </span>
                  )}
                </div>

                <p className="text-xs md:text-sm text-slate-800 leading-relaxed font-normal mt-2">
                  {p.ementa || 'Ementa não disponibilizada no serviço de dados abertos.'}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-3 border-t border-slate-100">
                  <span className="text-[11px] text-slate-500">
                    ID Oficial: <span className="font-mono text-slate-700">{p.id}</span>
                  </span>

                  <SourceLink
                    href={p.urlOficial}
                    label="Consultar tramitação no portal oficial"
                    showShield
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
