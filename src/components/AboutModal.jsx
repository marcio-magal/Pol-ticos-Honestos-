import React from 'react';
import { X, Info, Shield, CheckCircle, ExternalLink, HelpCircle } from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Sobre a Plataforma Políticos "Honestos"
              </h2>
              <p className="text-xs text-slate-500">
                Objetivo, metodologia cívica e fontes de dados oficiais
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-700 leading-relaxed">
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-950">
            <h4 className="font-bold text-xs uppercase tracking-wider text-amber-800 flex items-center gap-1.5 mb-1.5">
              <HelpCircle className="w-4 h-4" />
              Origem do Nome
            </h4>
            <p className="text-xs leading-relaxed">
              O nome <strong>Políticos "Honestos"</strong> (entre aspas) é uma bem-humorada referência irônica ao conhecido vídeo didático de programação <em>"Puxando dados de políticos honestos via API"</em>, do desenvolvedor e educador Renato Asse.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-blue-600" />
              Compromisso de Neutralidade e Sem Julgamentos
            </h3>
            <p className="text-xs text-slate-600">
              Esta plataforma <strong>não classifica políticos como honestos ou desonestos</strong>, não atribui notas de caráter ou desempenho, não cria rankings de "melhores ou piores" e não emite julgamentos partidários ou ideológicos.
            </p>
            <p className="text-xs text-slate-600 mt-2">
              O papel exclusivo desta ferramenta é facilitar o acesso público, direto e transparente aos registros oficiais do Estado brasileiro, permitindo que cada cidadão investigue, consulte os documentos originais e forme suas próprias conclusões com base em fatos verificáveis.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Fontes Oficiais Conectadas
            </h3>
            <ul className="text-xs space-y-2 text-slate-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-slate-800">Câmara dos Deputados:</strong>{' '}
                  API pública de Dados Abertos (v2). Consulta deputados federais em exercício, projetos de lei (PLs), PECs, discursos em plenário, tramitações e despesas da Cota para Exercício da Atividade Parlamentar (CEAP).
                  <br />
                  <a
                    href="https://dadosabertos.camara.leg.br"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-700 hover:underline inline-flex items-center gap-1 mt-0.5"
                  >
                    dadosabertos.camara.leg.br <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-slate-800">Senado Federal:</strong>{' '}
                  API pública de Dados Abertos do Senado. Consulta os 81 senadores em exercício, matérias de autoria e relatoria, votações nominais registradas e pronunciamentos.
                  <br />
                  <a
                    href="https://legis.senado.leg.br/dadosabertos/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:underline inline-flex items-center gap-1 mt-0.5"
                  >
                    legis.senado.leg.br/dadosabertos <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </li>
            </ul>
          </div>

          <div className="p-3.5 bg-slate-100/80 rounded-xl text-xs text-slate-500 border border-slate-200">
            <strong>Aviso de Transparência:</strong> Este aplicativo não é um canal governamental oficial nem possui afiliação partidária. Todos os dados são transmitidos em tempo real a partir dos serviços abertos de transparência do Congresso Nacional e estão sujeitos a atualizações e retificações pelas respectivas instituições.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Entendido e Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
