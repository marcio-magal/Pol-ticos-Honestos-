import React from 'react';
import {
  FileText,
  Vote,
  Mic,
  Receipt,
  Users,
  Info,
  Calendar,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { formatDate } from '../../utils/formatters.js';
import SourceLink from '../SourceLink.jsx';

export default function OverviewTab({
  details,
  proposicoes = [],
  votacoes = [],
  discursos = [],
  despesas = [],
  comissoes = [],
  onSelectTab
}) {
  const isSenado = details.casa === 'Senado Federal';

  return (
    <div className="space-y-6">
      {/* Cards de Métricas Fatuais Documentadas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Proposições */}
        <div
          onClick={() => onSelectTab('proposicoes')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-blue-600 mb-2">
            <FileText className="w-5 h-5" />
            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-xl md:text-2xl font-extrabold text-slate-900">
            {proposicoes.length > 0 ? proposicoes.length : '0'}
          </div>
          <div className="text-xs font-semibold text-slate-600 mt-0.5">
            Projetos & Proposições
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Registradas como autor</div>
        </div>

        {/* Votações */}
        <div
          onClick={() => onSelectTab('votacoes')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-indigo-600 mb-2">
            <Vote className="w-5 h-5" />
            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-xl md:text-2xl font-extrabold text-slate-900">
            {votacoes.length > 0 ? votacoes.length : '0'}
          </div>
          <div className="text-xs font-semibold text-slate-600 mt-0.5">
            Votações Nominais
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Com voto individual</div>
        </div>

        {/* Discursos */}
        <div
          onClick={() => onSelectTab('discursos')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <Mic className="w-5 h-5" />
            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-xl md:text-2xl font-extrabold text-slate-900">
            {discursos.length > 0 ? discursos.length : '0'}
          </div>
          <div className="text-xs font-semibold text-slate-600 mt-0.5">
            Pronunciamentos
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Em plenário e comissões</div>
        </div>

        {/* Despesas (se for Câmara) ou Comissões */}
        {!isSenado ? (
          <div
            onClick={() => onSelectTab('despesas')}
            className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-emerald-600 mb-2">
              <Receipt className="w-5 h-5" />
              <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-xl md:text-2xl font-extrabold text-slate-900">
              {despesas.length > 0 ? despesas.length : '0'}
            </div>
            <div className="text-xs font-semibold text-slate-600 mt-0.5">
              Notas da Cota (CEAP)
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Na legislatura atual</div>
          </div>
        ) : (
          <div
            onClick={() => onSelectTab('discursos')}
            className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-emerald-600 mb-2">
              <Users className="w-5 h-5" />
              <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-xl md:text-2xl font-extrabold text-slate-900">
              {comissoes.length > 0 ? comissoes.length : '0'}
            </div>
            <div className="text-xs font-semibold text-slate-600 mt-0.5">
              Comissões Temáticas
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Membro no Senado</div>
          </div>
        )}

        {/* Órgãos / Comissões */}
        <div
          onClick={() => onSelectTab('discursos')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between text-violet-600 mb-2">
            <Users className="w-5 h-5" />
            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-xl md:text-2xl font-extrabold text-slate-900">
            {comissoes.length > 0 ? comissoes.length : '0'}
          </div>
          <div className="text-xs font-semibold text-slate-600 mt-0.5">
            Órgãos & Comissões
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Participação legislativa</div>
        </div>
      </div>

      {/* Nota de Esclarecimento Metodológico e Factual */}
      <div className="flex items-start gap-3 p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl text-xs text-blue-900 leading-relaxed">
        <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Critério estritamente factual:</span> Os números e registros acima correspondem às consultas aos endpoints oficiais da {details.casa}. Esta plataforma não gera índices sintéticos de desempenho nem atribui rótulos de "mais atuante" ou "menos atuante", pois quantidade de propostas ou discursos não expressa mérito ou relevância de forma isolada.
        </div>
      </div>

      {/* Grid de Destaques Recentes: Proposições e Discursos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimas Proposições */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Últimas Proposições Apresentadas</span>
              </h3>
              <button
                type="button"
                onClick={() => onSelectTab('proposicoes')}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900 cursor-pointer"
              >
                Ver todas ({proposicoes.length})
              </button>
            </div>

            {proposicoes.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                Nenhuma proposição recente retornada pela API oficial.
              </p>
            ) : (
              <div className="space-y-3">
                {proposicoes.slice(0, 3).map((p, idx) => (
                  <div
                    key={p.id || idx}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-150 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-blue-800">
                        {p.descricao || `${p.siglaTipo || p.sigla} ${p.numero}/${p.ano}`}
                      </span>
                      {p.dataApresentacao && (
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(p.dataApresentacao)}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-700 line-clamp-2 leading-relaxed">
                      {p.ementa || 'Ementa não disponibilizada.'}
                    </p>
                    <div className="mt-2 flex justify-end">
                      <SourceLink href={p.urlOficial} label="Detalhes na fonte oficial" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Últimos Discursos / Pronunciamentos */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Mic className="w-4 h-4 text-amber-600" />
                <span>Pronunciamentos Recentes</span>
              </h3>
              <button
                type="button"
                onClick={() => onSelectTab('discursos')}
                className="text-xs font-semibold text-amber-700 hover:text-amber-900 cursor-pointer"
              >
                Ver todos ({discursos.length})
              </button>
            </div>

            {discursos.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                Nenhum discurso recente registrado no período consultado.
              </p>
            ) : (
              <div className="space-y-3">
                {discursos.slice(0, 3).map((d, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-150 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-amber-800">
                        {d.tipoDiscurso || 'Discurso'}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(d.dataHoraInicio || d.dataPronunciamento)}
                      </span>
                    </div>
                    <p className="text-slate-700 line-clamp-2 leading-relaxed">
                      {d.sumario || d.transcricao || 'Sem sumário registrado.'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
