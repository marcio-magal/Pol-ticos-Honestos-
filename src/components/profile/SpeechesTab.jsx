import React, { useState } from 'react';
import { Mic, Calendar, ChevronDown, ChevronUp, Tag, Users, FileText, ExternalLink } from 'lucide-react';
import { formatDate } from '../../utils/formatters.js';
import SourceLink from '../SourceLink.jsx';

export default function SpeechesTab({ discursos = [], comissoes = [], casa = 'Câmara dos Deputados' }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Seção 1: Comissões e Órgãos em que atua */}
      {comissoes.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
            <Users className="w-4 h-4 text-violet-600" />
            <span>Participação em Comissões e Órgãos Legislativos</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {comissoes.map((c, idx) => (
              <div
                key={c.id || idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="font-bold text-violet-800 bg-violet-100 px-1.5 py-0.5 rounded text-[10px]">
                      {c.sigla || 'COMISSÃO'}
                    </span>
                    <span className="text-slate-500 text-[11px] truncate">
                      {c.participacao || c.titulo || 'Membro'}
                    </span>
                  </div>
                  <p className="font-medium text-slate-800 line-clamp-2 leading-snug">
                    {c.nome}
                  </p>
                </div>
                {c.dataInicio && (
                  <div className="text-[10px] text-slate-400 mt-2">
                    Desde {formatDate(c.dataInicio)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seção 2: Pronunciamentos e Discursos */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Mic className="w-4 h-4 text-amber-600" />
          <span>Discursos e Pronunciamentos Registrados ({discursos.length})</span>
        </h3>

        {discursos.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
            Nenhum discurso registrado nos serviços oficiais para o período consultado.
          </div>
        ) : (
          discursos.map((d, idx) => {
            const id = d.codigo || idx;
            const isExpanded = expandedId === id;
            const dataDiscurso = d.dataHoraInicio || d.dataPronunciamento;

            return (
              <div
                key={id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-amber-300 p-5 shadow-xs transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                      {d.tipoDiscurso || 'Discurso'}
                    </span>
                    {d.faseEvento && (
                      <span className="text-[11px] font-medium text-slate-500">
                        {d.faseEvento}
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {formatDate(dataDiscurso)}
                  </span>
                </div>

                {/* Sumário Oficial */}
                {d.sumario && (
                  <p className="text-xs md:text-sm text-slate-800 leading-relaxed font-normal mt-2">
                    {d.sumario}
                  </p>
                )}

                {/* Keywords / Temas abordados */}
                {d.keywords && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2 border-t border-slate-100">
                    <Tag className="w-3 h-3 text-slate-400 shrink-0" />
                    {d.keywords.split(',').slice(0, 5).map((kw, kIdx) => (
                      <span
                        key={kIdx}
                        className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-medium"
                      >
                        {kw.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Transcrição completa com toggle */}
                {d.transcricao && (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => toggleExpand(id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 cursor-pointer"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" />
                          <span>Ocultar transcrição oficial</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" />
                          <span>Ler transcrição completa do discurso</span>
                        </>
                      )}
                    </button>

                    {isExpanded && (
                      <div className="mt-2.5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-mono leading-relaxed max-h-96 overflow-y-auto whitespace-pre-wrap">
                        {d.transcricao}
                      </div>
                    )}
                  </div>
                )}

                {/* Link Oficial */}
                <div className="flex justify-end pt-3 mt-3 border-t border-slate-100">
                  <SourceLink
                    href={d.urlTexto || d.urlTextoBinario}
                    label="Consultar publicação no Diário Oficial"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
