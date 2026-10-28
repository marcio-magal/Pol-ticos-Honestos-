import React from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';

/**
 * Link padronizado para as fontes oficiais (Câmara dos Deputados, Senado Federal)
 */
export default function SourceLink({ href, label = 'Conferir na fonte oficial', className = '', showShield = false }) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-blue-700 transition-colors underline-offset-2 hover:underline ${className}`}
      title="Acessar registro oficial original em nova aba"
    >
      {showShield && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
      <span>{label}</span>
      <ExternalLink className="w-3 h-3 opacity-70 shrink-0" />
    </a>
  );
}
