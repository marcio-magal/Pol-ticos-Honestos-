import React, { useMemo } from 'react';
import {
  Clock,
  FileText,
  Vote,
  Mic,
  Receipt,
  Calendar,
  ExternalLink,
  Info
} from 'lucide-react';
import { formatDate } from '../../utils/formatters.js';
import SourceLink from '../SourceLink.jsx';

export default function TimelineTab({
  proposicoes = [],
  votacoes = [],
  discursos = [],
  despesas = []
}) {
  // Constrói e ordena cronologicamente todos os eventos verificados
  const timelineEvents = useMemo(() => {
    const list = [];

    // 1. Proposições
    proposicoes.forEach((p) => {
      if (p.dataApresentacao) {
        list.push({
          tipo: 'proposicao',
          data: p.dataApresentacao,
          titulo: p.descricao || `${p.siglaTipo || p.sigla} ${p.numero}/${p.ano}`,
          descricao: p.ementa,
          urlOficial: p.urlOficial,
          tag: 'Proposição Apresentada',
          cor: 'blue'
        });
      }
    });

    // 2. Votações
    votacoes.forEach((v) => {
      const d = v.data || v.dataSessao || v.dataHoraRegistro;
      if (d) {
        list.push({
          tipo: 'votacao',
          data: d,
          titulo: v.materiaDescricao || v.descricao || 'Votação nominal em Plenário',
          descricao: `Voto registrado: ${v.votoIndividual || 'Não nominal'} • Resultado: ${v.resultado || 'Concluído'}`,
          urlOficial: v.urlOficial,
          tag: 'Votação em Plenário',
          cor: 'indigo'
        });
      }
    });

    // 3. Discursos
    discursos.forEach((disc) => {
      const d = disc.dataHoraInicio || disc.dataPronunciamento;
      if (d) {
        list.push({
          tipo: 'discurso',
          data: d,
          titulo: disc.tipoDiscurso || 'Discurso / Pronunciamento',
          descricao: disc.sumario || disc.transcricao,
          urlOficial: disc.urlTexto || disc.urlTextoBinario,
          tag: 'Pronunciamento Parlamentar',
          cor: 'amber'
        });
      }
    });

    // 4. Despesas (seleciona as maiores ou mais recentes para não poluir)
    despesas.slice(0, 10).forEach((desp) => {
      if (desp.dataDocumento) {
        list.push({
          tipo: 'despesa',
          data: desp.dataDocumento,
          titulo: desp.tipoDespesa,
          descricao: `${desp.nomeFornecedor || 'Fornecedor'} • Valor: R$ ${desp.valorLiquido?.toFixed(2)}`,
          urlOficial: desp.urlDocumento,
          tag: 'Despesa Declarada (CEAP)',
          cor: 'emerald'
        });
      }
    });

    // Ordenar do mais recente para o mais antigo
    return list.sort((a, b) => {
      const dateA = new Date(a.data).getTime() || 0;
      const dateB = new Date(b.data).getTime() || 0;
      return dateB - dateA;
    });
  }, [proposicoes, votacoes, discursos, despesas]);

  const getIcon = (tipo) => {
    switch (tipo) {
      case 'proposicao':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'votacao':
        return <Vote className="w-4 h-4 text-indigo-600" />;
      case 'discurso':
        return <Mic className="w-4 h-4 text-amber-600" />;
      case 'despesa':
        return <Receipt className="w-4 h-4 text-emerald-600" />;
      default:
        return <Calendar className="w-4 h-4 text-slate-500" />;
    }
  };

  const getBadgeColor = (tipo) => {
    switch (tipo) {
      case 'proposicao':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'votacao':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'discurso':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'despesa':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner de Esclarecimento sobre a Linha do Tempo */}
      <div className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 leading-relaxed">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong>Construção factual da linha do tempo:</strong> Os acontecimentos abaixo reúnem em ordem cronológica os registros extraídos das APIs oficiais do Congresso Nacional. A ausência de registros em datas específicas reflete apenas os dados disponibilizados pelos serviços e não constitui prova de inatividade do parlamentar.
        </div>
      </div>

      {timelineEvents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
          Nenhum evento registrado no período para construir a linha do tempo.
        </div>
      ) : (
        <div className="relative pl-6 md:pl-8 space-y-6 before:absolute before:left-3 md:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {timelineEvents.map((evt, idx) => (
            <div key={idx} className="relative group">
              {/* Marcador do Ponto na Linha */}
              <div className="absolute -left-[30px] md:-left-[35px] top-1.5 w-6 h-6 rounded-full bg-white border-2 border-slate-300 group-hover:border-blue-600 flex items-center justify-center shadow-xs transition-colors">
                <div className="w-2 h-2 rounded-full bg-slate-400 group-hover:bg-blue-600 transition-colors" />
              </div>

              {/* Card do Evento */}
              <div className="bg-white rounded-2xl border border-slate-200/90 group-hover:border-blue-300 p-4 md:p-5 shadow-xs transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${getBadgeColor(
                        evt.tipo
                      )}`}
                    >
                      {getIcon(evt.tipo)}
                      <span>{evt.tag}</span>
                    </span>
                  </div>

                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {formatDate(evt.data)}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mt-1 mb-1 leading-snug">
                  {evt.titulo}
                </h4>

                {evt.descricao && (
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {evt.descricao}
                  </p>
                )}

                {evt.urlOficial && (
                  <div className="flex justify-end pt-2.5 mt-2.5 border-t border-slate-100">
                    <SourceLink href={evt.urlOficial} label="Consultar registro original" showShield />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
