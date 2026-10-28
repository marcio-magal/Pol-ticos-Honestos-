import React, { useState } from 'react';
import { User, ArrowRight, Building2, Landmark, CheckCircle2 } from 'lucide-react';
import SourceLink from './SourceLink.jsx';

export default function PoliticianCard({ politician, onSelect }) {
  const [imgError, setImgError] = useState(false);

  const isCamara = politician.casa === 'Câmara dos Deputados' || politician.cargo?.includes('Deputado');
  const isSenado = politician.casa === 'Senado Federal' || politician.cargo?.includes('Senador');

  return (
    <div className="group relative flex flex-col justify-between bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 p-5 shadow-xs hover:shadow-md transition-all duration-200">
      <div>
        {/* Top badges: Casa Legislativa & Mandato */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-tight uppercase ${
              isSenado
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/70'
                : 'bg-blue-50 text-blue-800 border border-blue-200/70'
            }`}
          >
            {isSenado ? <Landmark className="w-3 h-3 text-emerald-600" /> : <Building2 className="w-3 h-3 text-blue-600" />}
            {isSenado ? 'Senado Federal' : 'Câmara dos Deputados'}
          </span>

          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Em exercício</span>
          </span>
        </div>

        {/* Político Foto + Nomes */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
            {politician.urlFoto && !imgError ? (
              <img
                src={politician.urlFoto}
                alt={politician.nome}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                <User className="w-7 h-7" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-900 truncate leading-snug group-hover:text-blue-700 transition-colors">
              {politician.nome}
            </h3>
            {politician.nomeCivil && politician.nomeCivil !== politician.nome && (
              <p className="text-[11px] text-slate-500 truncate" title={`Nome Civil: ${politician.nomeCivil}`}>
                {politician.nomeCivil}
              </p>
            )}

            {/* Partido e Estado */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                {politician.siglaPartido || 'S/P'}
              </span>
              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                {politician.siglaUf || 'BR'}
              </span>
            </div>
          </div>
        </div>

        {/* Informações adicionais neutras */}
        <div className="text-xs text-slate-600 bg-slate-50/80 rounded-xl p-3 mb-4 space-y-1 border border-slate-100">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-500">Cargo:</span>
            <span className="font-semibold text-slate-800">{politician.cargo}</span>
          </div>
          {politician.email && (
            <div className="flex justify-between items-center text-[11px] truncate">
              <span className="text-slate-500">Contato:</span>
              <span className="font-medium text-slate-700 truncate max-w-[160px]" title={politician.email}>
                {politician.email}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Ações */}
      <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => onSelect(politician)}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-blue-700 active:bg-blue-800 transition-all shadow-xs group/btn cursor-pointer"
        >
          <span>Consultar atuação</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>

        <div className="flex justify-center">
          <SourceLink href={politician.urlOficial} label="Registro original no portal oficial" />
        </div>
      </div>
    </div>
  );
}
