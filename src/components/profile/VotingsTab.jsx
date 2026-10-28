import React, { useState } from 'react';
import { Vote, Calendar, CheckCircle2, XCircle, MinusCircle, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { formatDate } from '../../utils/formatters.js';
import SourceLink from '../SourceLink.jsx';

export default function VotingsTab({ votacoes = [], casa = 'Câmara dos Deputados' }) {
  const [filterVoto, setFilterVoto] = useState('todos');

  // Renderiza distintamente o voto individual
  const renderVotoBadge = (voto) => {
    if (!voto) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200" title="Votação simbólica ou sem registro de voto nominal individual">
          <MinusCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>Sem voto individual disponível</span>
        </span>
      );
    }

    const vLower = String(voto).toLowerCase();

    if (vLower === 'sim' || vLower.includes('favorável') || vLower.includes('sim')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Voto: Sim (Favorável)</span>
        </span>
      );
    }

    if (vLower === 'não' || vLower === 'nao' || vLower.includes('contrário')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-300">
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>Voto: Não (Contrário)</span>
        </span>
      );
    }

    if (vLower.includes('absten')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
          <MinusCircle className="w-3.5 h-3.5 text-amber-600" />
          <span>Abstenção</span>
        </span>
      );
    }

    if (vLower.includes('obstru')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-300">
          <AlertCircle className="w-3.5 h-3.5 text-purple-600" />
          <span>Obstrução</span>
        </span>
      );
    }

    // Caso retorne "Votou" (comum no Senado quando votação nominal foi secreta ou geral)
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-300">
        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
        <span>Voto Registrado ({voto})</span>
      </span>
    );
  };

  const filtered = votacoes.filter((v) => {
    const voto = (v.votoIndividual || '').toLowerCase();
    if (filterVoto === 'sim') return voto === 'sim' || voto.includes('favor');
    if (filterVoto === 'nao') return voto === 'não' || voto === 'nao' || voto.includes('contra');
    if (filterVoto === 'abstencao') return voto.includes('absten');
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Banner de Esclarecimento sobre Votações */}
      <div className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 leading-relaxed">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong>Critério oficial de registro de votos:</strong> Apenas votações nominais registram os votos individuais de cada parlamentar. Votações simbólicas ou regimentais não possuem lista nominal de votantes. Conforme a regra de transparência, ausência de voto registrado não pode ser interpretada como ausência física nem como posição partidária.
        </div>
      </div>

      {/* Lista de Votações */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
          Nenhuma votação com voto individual registrada no período consultado.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((v, idx) => {
            const dataVoto = v.data || v.dataSessao || v.dataHoraRegistro;
            const titulo = v.materiaDescricao || v.descricao || v.descricaoVotacao || 'Votação nominal em Plenário';
            const ementa = v.materiaEmenta || v.textoTramitacao || v.descricao;

            return (
              <div
                key={v.id || idx}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 p-5 shadow-xs transition-all"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {titulo}
                      </span>
                      {v.resultado && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          Resultado geral: {v.resultado}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Voto Individual em destaque visual */}
                  <div>
                    {renderVotoBadge(v.votoIndividual)}
                  </div>
                </div>

                {ementa && (
                  <p className="text-xs text-slate-600 leading-relaxed mt-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {ementa}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-3 border-t border-slate-100 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Data da votação: {formatDate(dataVoto)} • {casa}
                  </span>

                  <SourceLink
                    href={v.urlOficial}
                    label="Ver ata e resultado no portal oficial"
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
