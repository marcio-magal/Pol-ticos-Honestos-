import React from 'react';
import { Landmark, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-12 border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Coluna 1: Nome e Propósito */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-extrabold text-base tracking-tight">
              <Landmark className="w-5 h-5 text-blue-500" />
              <span>Políticos <span className="text-blue-400">"Honestos"</span></span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Plataforma cívica e independente de transparência pública. Não julgamos nem ranqueamos políticos; conectamos o cidadão aos registros oficiais da República Federativa do Brasil.
            </p>
            <div className="text-[11px] text-slate-500">
              Inspirado no vídeo educacional <em>"Puxando dados de políticos honestos via API"</em>, de Renato Asse.
            </div>
          </div>

          {/* Coluna 2: Fontes Governamentais Oficiais */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Fontes Oficiais Conectadas
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://dadosabertos.camara.leg.br/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Câmara dos Deputados (API Dados Abertos v2)</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://legis.senado.leg.br/dadosabertos/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Senado Federal (API Dados Abertos)</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-200 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Lei de Acesso à Informação (Lei 12.527/2011)</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Transparência & Neutralidade */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Aviso Institucional
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Esta ferramenta não representa um sítio governamental oficial nem possui qualquer afiliação partidária. Todos os registros apresentados provêm de serviços públicos de dados abertos e estão sujeitos a atualizações, conferências e correções pelos órgãos legislativos emissores.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            Políticos "Honestos" • Dados Abertos para Cidadania Ativa
          </div>
          <div className="flex items-center gap-1">
            <span>Desenvolvido para transparência cívica e consulta pública</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
