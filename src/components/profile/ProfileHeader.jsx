import React, { useState } from 'react';
import {
  ArrowLeft,
  Building2,
  Landmark,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Globe
} from 'lucide-react';
import { formatDate } from '../../utils/formatters.js';

export default function ProfileHeader({ details, onBack }) {
  const [imgError, setImgError] = useState(false);

  const isSenado = details.casa === 'Senado Federal';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs mb-6">
      {/* Botão de retorno e badges de navegação */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para a pesquisa</span>
        </button>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-tight ${
              isSenado
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-blue-50 text-blue-800 border border-blue-200'
            }`}
          >
            {isSenado ? <Landmark className="w-3.5 h-3.5 text-emerald-600" /> : <Building2 className="w-3.5 h-3.5 text-blue-600" />}
            {isSenado ? 'Senado Federal' : 'Câmara dos Deputados'}
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{details.situacao || 'Mandato Ativo'}</span>
          </span>
        </div>
      </div>

      {/* Conteúdo Principal do Político */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Foto Oficial */}
        <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200 shadow-xs shrink-0 mx-auto md:mx-0">
          {details.urlFoto && !imgError ? (
            <img
              src={details.urlFoto}
              alt={details.nome}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
              <User className="w-12 h-12" />
            </div>
          )}
        </div>

        {/* Informações Parlamentares */}
        <div className="flex-1 min-w-0 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              {details.nome}
            </h1>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
              {details.siglaPartido || 'Sem Partido'}
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
              {details.siglaUf}
            </span>
          </div>

          {details.nomeCivil && details.nomeCivil !== details.nome && (
            <p className="text-xs md:text-sm text-slate-500 mb-3">
              Nome civil: <span className="font-medium text-slate-700">{details.nomeCivil}</span>
            </p>
          )}

          <p className="text-xs md:text-sm font-semibold text-slate-700 mb-4">
            {details.cargo} • 57ª Legislatura (2023–2027)
          </p>

          {/* Grid de Detalhes de Contato & Gabinete */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-slate-600 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
            {details.email && (
              <div className="flex items-center gap-2 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <a
                  href={`mailto:${details.email}`}
                  className="truncate text-slate-700 hover:text-blue-700 hover:underline"
                  title={details.email}
                >
                  {details.email}
                </a>
              </div>
            )}

            {(details.telefone || (details.telefones && details.telefones.length > 0)) && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-slate-700">
                  {details.telefone || (details.telefones && details.telefones.join(', '))}
                </span>
              </div>
            )}

            {details.dataNascimento && (
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-slate-700">
                  Nascimento: {formatDate(details.dataNascimento)}
                </span>
              </div>
            )}

            {(details.municipioNascimento || details.naturalidade) && (
              <div className="flex items-center gap-2 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-slate-700 truncate">
                  Naturalidade: {details.municipioNascimento || details.naturalidade} (
                  {details.ufNascimento || details.ufNaturalidade || details.siglaUf})
                </span>
              </div>
            )}

            {details.gabinete && (
              <div className="flex items-center gap-2 truncate col-span-1 sm:col-span-2">
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-slate-700 truncate">
                  Gabinete: Prédio {details.gabinete.predio || 'Principal'}, Sala {details.gabinete.sala || '-'}, Andar {details.gabinete.andar || '-'}
                </span>
              </div>
            )}

            {details.enderecoParlamentar && (
              <div className="flex items-center gap-2 truncate col-span-1 sm:col-span-2">
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-slate-700 truncate">
                  {details.enderecoParlamentar}
                </span>
              </div>
            )}
          </div>

          {/* Links Oficiais Externos */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-xs font-semibold">
            {details.urlOficial && (
              <a
                href={details.urlOficial}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-blue-700 hover:text-blue-900 bg-blue-50/80 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Página oficial no portal do {isSenado ? 'Senado' : 'Congresso'}</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            )}

            {details.urlWebsite && (
              <a
                href={details.urlWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
              >
                <Globe className="w-4 h-4 text-slate-500" />
                <span>Website parlamentar</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
