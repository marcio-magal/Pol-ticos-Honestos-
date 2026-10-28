import React, { useState } from 'react';
import { Landmark, HelpCircle, ShieldCheck } from 'lucide-react';
import AboutModal from './AboutModal.jsx';

export default function Header({ onGoHome }) {
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            {/* Logo e Nome da Aplicação */}
            <div
              onClick={onGoHome}
              className="flex items-center gap-3 cursor-pointer group"
              title="Voltar para a página inicial"
            >
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Landmark className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg md:text-xl font-extrabold text-slate-900 tracking-tight">
                    Políticos <span className="text-blue-700">"Honestos"</span>
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    <ShieldCheck className="w-3 h-3 text-blue-600" />
                    Dados Abertos
                  </span>
                </div>
                <p className="text-[11px] md:text-xs text-slate-500 hidden sm:block">
                  Pesquisa factual e neutra da atuação parlamentar no Brasil
                </p>
              </div>
            </div>

            {/* Ações do Topo */}
            <div className="flex items-center gap-2 md:gap-3">
              <button
                type="button"
                onClick={() => setIsAboutOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 md:px-3.5 md:py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-slate-500" />
                <span className="hidden xs:inline">Metodologia & Fontes</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </>
  );
}
