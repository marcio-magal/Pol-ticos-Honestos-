import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({
  title = 'Falha na comunicação com a fonte oficial',
  message = 'Não foi possível carregar os dados no momento. Isso pode ocorrer por instabilidade temporária no serviço governamental de Dados Abertos.',
  onRetry
}) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-6 my-6 text-slate-800 shadow-xs">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-rose-100 text-rose-700 shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-rose-950">{title}</h4>
          <p className="text-xs text-rose-800 mt-1 leading-relaxed">{message}</p>
          {onRetry && (
            <div className="mt-3.5">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-700 text-white hover:bg-rose-800 transition-colors shadow-xs cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Tentar novamente</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
