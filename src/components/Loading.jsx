import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading({ message = 'Consultando registros oficiais...', subtitle = 'Conectando diretamente aos servidores de Dados Abertos do Congresso Nacional' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />
        <Loader2 className="w-6 h-6 text-blue-600 absolute inset-0 m-auto animate-pulse" />
      </div>
      <h3 className="text-base font-semibold text-slate-800">{message}</h3>
      {subtitle && (
        <p className="text-xs text-slate-500 max-w-md mt-1.5 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
