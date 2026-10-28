import React, { useState, useMemo } from 'react';
import {
  Receipt,
  Calendar,
  FileCheck,
  Building,
  Filter,
  Info,
  DollarSign,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { formatDate, formatCurrency, formatCpfCnpj } from '../../utils/formatters.js';
import SourceLink from '../SourceLink.jsx';

export default function ExpensesTab({
  despesas = [],
  loading = false,
  anoSelecionado = '2026',
  onAnoChange,
  isSenado = false
}) {
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');
  const [pagina, setPagina] = useState(1);
  const itensPorPagina = 15;

  // Para o Senado Federal
  if (isSenado) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
          <Receipt className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">
          Cota para o Exercício da Atividade Parlamentar dos Senadores (CEAPS)
        </h3>
        <p className="text-xs text-slate-600 max-w-xl mx-auto leading-relaxed">
          O Senado Federal publica as prestações de contas da CEAPS (indenizações e verbas de gabinete) por meio de seu Portal da Transparência em planilhas consolidadas e relatórios auditados, que não são servidos pelo mesmo endpoint REST em tempo real.
        </p>
        <div className="pt-3">
          <a
            href="https://www6g.senado.leg.br/transparencia/sen/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-xs"
          >
            <span>Consultar Despesas no Portal da Transparência do Senado</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  // Categorias únicas presentes
  const categorias = useMemo(() => {
    const set = new Set();
    despesas.forEach((d) => {
      if (d.tipoDespesa) set.add(d.tipoDespesa);
    });
    return Array.from(set).sort();
  }, [despesas]);

  // Despesas filtradas por categoria
  const filtradas = useMemo(() => {
    if (categoriaFiltro === 'todas') return despesas;
    return despesas.filter((d) => d.tipoDespesa === categoriaFiltro);
  }, [despesas, categoriaFiltro]);

  // Soma dos valores no período selecionado
  const totalPeriodo = useMemo(() => {
    return filtradas.reduce((acc, d) => acc + (Number(d.valorLiquido) || 0), 0);
  }, [filtradas]);

  // Paginação
  const totalPaginas = Math.ceil(filtradas.length / itensPorPagina) || 1;
  const exibidas = filtradas.slice((pagina - 1) * itensPorPagina, pagina * itensPorPagina);

  return (
    <div className="space-y-6">
      {/* Banner de Total Calculado com Explicação do Intervalo */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Cota Parlamentar (CEAP) • Ano {anoSelecionado === 'todas' ? 'da 57ª Legislatura' : anoSelecionado}</span>
            </div>
            <div className="text-2xl md:text-3xl font-extrabold text-white">
              {formatCurrency(totalPeriodo)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1 max-w-lg leading-relaxed">
              Soma calculada com base em <strong>{filtradas.length}</strong> documentos fiscais registrados oficialmente no período consultado.
            </p>
          </div>

          {/* Seletor de Ano */}
          <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
            {['2026', '2025', '2024', '2023'].map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => {
                  setPagina(1);
                  onAnoChange(yr);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  anoSelecionado === yr
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Nota de Isenção e Neutralidade */}
      <div className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 leading-relaxed">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong>Diretriz de Transparência Cívica:</strong> A Cota para o Exercício da Atividade Parlamentar (CEAP) é uma verba pública regulamentada pela Câmara dos Deputados para despesas operacionais do mandato (passagens, combustíveis, telefonia, divulgação). Esta plataforma apenas transcreve os dados declarados e submetidos às notas fiscais oficiais, sem emitir juízos de valor sobre legalidade ou legitimidade de quaisquer fornecedores.
        </div>
      </div>

      {/* Barra de Filtro de Categoria */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={categoriaFiltro}
            onChange={(e) => {
              setCategoriaFiltro(e.target.value);
              setPagina(1);
            }}
            className="w-full sm:w-80 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors cursor-pointer"
          >
            <option value="todas">Todas as categorias de despesa ({despesas.length})</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat} ({despesas.filter((d) => d.tipoDespesa === cat).length})
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Mostrando {exibidas.length} de {filtradas.length} despesas
        </div>
      </div>

      {/* Tabela / Lista de Despesas */}
      {exibidas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
          Nenhuma despesa declarada para o ano {anoSelecionado} ou categoria selecionada.
        </div>
      ) : (
        <div className="space-y-3">
          {exibidas.map((d, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 p-5 shadow-xs transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                  {d.tipoDespesa}
                </span>

                <div className="text-base sm:text-lg font-extrabold text-slate-900">
                  {formatCurrency(d.valorLiquido)}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-100 text-xs">
                <div>
                  <div className="text-slate-400 text-[11px] mb-0.5">Fornecedor / Beneficiário</div>
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5 truncate">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{d.nomeFornecedor || 'Não informado'}</span>
                  </div>
                  {d.cnpjCpfFornecedor && (
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      CNPJ/CPF: {formatCpfCnpj(d.cnpjCpfFornecedor)}
                    </div>
                  )}
                </div>

                <div className="sm:text-right flex flex-col sm:items-end justify-between">
                  <div>
                    <div className="text-slate-400 text-[11px] mb-0.5">Data do Documento</div>
                    <div className="font-medium text-slate-700 flex items-center sm:justify-end gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(d.dataDocumento)}</span>
                    </div>
                  </div>

                  {d.urlDocumento && (
                    <div className="mt-2">
                      <a
                        href={d.urlDocumento}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Abrir Nota Fiscal Oficial (PDF)</span>
                        <ExternalLink className="w-3 h-3 opacity-70" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginação de Despesas */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="text-xs text-slate-500 font-medium">
            Página {pagina} de {totalPaginas}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagina <= 1}
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Anterior</span>
            </button>
            <button
              type="button"
              disabled={pagina >= totalPaginas}
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Próxima</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
