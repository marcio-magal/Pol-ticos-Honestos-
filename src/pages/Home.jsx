import React, { useState, useEffect, useCallback, useRef } from 'react';
import SearchBar from '../components/SearchBar.jsx';
import Filters from '../components/Filters.jsx';
import PoliticianCard from '../components/PoliticianCard.jsx';
import Pagination from '../components/Pagination.jsx';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { fetchDeputados } from '../services/camaraApi.js';
import { fetchSenadores } from '../services/senadoApi.js';
import { ShieldCheck, Info, Sparkles, Building2, Landmark, CheckCircle } from 'lucide-react';

export default function Home({ onSelectPolitician }) {
  // Estados de busca e filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [tipo, setTipo] = useState('todos'); // 'todos' | 'deputados' | 'senadores'
  const [uf, setUf] = useState('');
  const [partido, setPartido] = useState('');
  const [pagina, setPagina] = useState(1);

  // Estados de dados e requisição
  const [politicos, setPoliticos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [temProxima, setTemProxima] = useState(false);
  const [temAnterior, setTemAnterior] = useState(false);
  const [totalCount, setTotalCount] = useState(null);

  const abortControllerRef = useRef(null);

  // Executa consulta às APIs oficiais
  const buscarPoliticos = useCallback(
    async (termoPesquisa = searchTerm, paginaAtual = pagina) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setLoading(true);
      setError(null);

      try {
        if (tipo === 'deputados') {
          // Consulta apenas a Câmara
          const res = await fetchDeputados({
            nome: termoPesquisa,
            siglaUf: uf,
            siglaPartido: partido,
            pagina: paginaAtual,
            itens: 16,
            signal
          });
          setPoliticos(res.dados);
          setTemProxima(res.temProxima);
          setTemAnterior(res.temAnterior);
          setTotalCount(null);
        } else if (tipo === 'senadores') {
          // Consulta apenas o Senado
          const res = await fetchSenadores({
            nome: termoPesquisa,
            siglaUf: uf,
            siglaPartido: partido,
            pagina: paginaAtual,
            itens: 16,
            signal
          });
          setPoliticos(res.dados);
          setTemProxima(res.temProxima);
          setTemAnterior(res.temAnterior);
          setTotalCount(res.total);
        } else {
          // 'todos': consulta simultaneamente Câmara e Senado
          const [camaraRes, senadoRes] = await Promise.allSettled([
            fetchDeputados({
              nome: termoPesquisa,
              siglaUf: uf,
              siglaPartido: partido,
              pagina: paginaAtual,
              itens: 10,
              signal
            }),
            fetchSenadores({
              nome: termoPesquisa,
              siglaUf: uf,
              siglaPartido: partido,
              pagina: paginaAtual,
              itens: 6,
              signal
            })
          ]);

          const listaDeputados =
            camaraRes.status === 'fulfilled' ? camaraRes.value.dados : [];
          const listaSenadores =
            senadoRes.status === 'fulfilled' ? senadoRes.value.dados : [];

          // Mescla resultados de forma organizada
          const unificados = [...listaDeputados, ...listaSenadores];

          // Ordena alfabeticamente
          unificados.sort((a, b) => a.nome.localeCompare(b.nome));

          setPoliticos(unificados);
          const proxCamara =
            camaraRes.status === 'fulfilled' ? camaraRes.value.temProxima : false;
          const proxSenado =
            senadoRes.status === 'fulfilled' ? senadoRes.value.temProxima : false;
          setTemProxima(proxCamara || proxSenado);
          setTemAnterior(paginaAtual > 1);
          setTotalCount(null);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Erro na pesquisa:', err);
          setError(
            'Não foi possível se comunicar com os serviços oficiais de Dados Abertos. Verifique sua conexão e tente novamente.'
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [searchTerm, tipo, uf, partido, pagina]
  );

  // Dispara busca quando os filtros mudam ou página muda
  useEffect(() => {
    buscarPoliticos(searchTerm, pagina);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipo, uf, partido, pagina]);

  const handleSearchSubmit = (novoTermo) => {
    const termo = novoTermo !== undefined ? novoTermo : searchTerm;
    setPagina(1);
    buscarPoliticos(termo, 1);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setTipo('todos');
    setUf('');
    setPartido('');
    setPagina(1);
  };

  const handlePageChange = (novaPagina) => {
    setPagina(novaPagina);
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-blue-950 via-slate-900 to-slate-900 text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-4 backdrop-blur-xs">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Dados Abertos Governamentais Oficiais</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-4">
            Pesquise a atuação de políticos brasileiros com dados verificáveis.
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-8 max-w-2xl">
            Consulte projetos de lei apresentados, histórico de votações nominais, discursos em plenário, gastos da cota parlamentar e atividades públicas diretamente nas fontes oficiais do Congresso Nacional.
          </p>

          {/* Barra de Pesquisa */}
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onSubmit={handleSearchSubmit}
            onClear={() => {
              setSearchTerm('');
              buscarPoliticos('', 1);
            }}
            loading={loading}
          />
        </div>

        {/* Estatísticas Fatuais Rápidas de Cobertura */}
        <div className="relative z-10 mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-900/60 text-blue-400">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-white">513 Deputados Federais</div>
              <div className="text-slate-400 text-[11px]">Câmara dos Deputados</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-900/60 text-emerald-400">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-white">81 Senadores</div>
              <div className="text-slate-400 text-[11px]">Senado Federal</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
            <div className="p-2 rounded-xl bg-indigo-900/60 text-indigo-400">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-white">57ª Legislatura</div>
              <div className="text-slate-400 text-[11px]">Mandato 2023–2027</div>
            </div>
          </div>
        </div>
      </section>

      {/* Barra de Filtros */}
      <Filters
        tipo={tipo}
        onTipoChange={(novoTipo) => {
          setTipo(novoTipo);
          setPagina(1);
        }}
        uf={uf}
        onUfChange={(novaUf) => {
          setUf(novaUf);
          setPagina(1);
        }}
        partido={partido}
        onPartidoChange={(novoPartido) => {
          setPartido(novoPartido);
          setPagina(1);
        }}
        onReset={handleClearFilters}
      />

      {/* Cabeçalho de Resultados */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <span>Parlamentares Encontrados</span>
          {!loading && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">
              {politicos.length} nesta página {totalCount ? `de ${totalCount}` : ''}
            </span>
          )}
        </h3>

        <div className="text-xs text-slate-500 font-medium">
          {tipo === 'todos' && 'Consultando Câmara e Senado simultaneamente'}
          {tipo === 'deputados' && 'Fonte: API Dados Abertos da Câmara dos Deputados'}
          {tipo === 'senadores' && 'Fonte: API Dados Abertos do Senado Federal'}
        </div>
      </div>

      {/* Área de Resultados */}
      {loading ? (
        <Loading
          message="Consultando a lista oficial de parlamentares..."
          subtitle="Obtendo registros atualizados diretamente da base governamental de dados abertos"
        />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => buscarPoliticos(searchTerm, pagina)} />
      ) : politicos.length === 0 ? (
        <EmptyState onClear={handleClearFilters} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {politicos.map((p) => (
              <PoliticianCard
                key={`${p.casa}-${p.id}`}
                politician={p}
                onSelect={onSelectPolitician}
              />
            ))}
          </div>

          {/* Paginação */}
          <Pagination
            currentPage={pagina}
            hasPrevious={temAnterior}
            hasNext={temProxima}
            onPageChange={handlePageChange}
            loading={loading}
            totalLabel={
              totalCount ? `${totalCount} senadores encontrados` : undefined
            }
          />
        </>
      )}

      {/* Informações Institucionais e Metodologia no rodapé da página */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 text-xs text-slate-600 leading-relaxed shadow-2xs space-y-3">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <Info className="w-4 h-4 text-blue-600" />
          <span>Sobre a procedência dos dados e neutralidade cívica</span>
        </div>
        <p>
          A aplicação <strong>Políticos "Honestos"</strong> não é afiliada a partidos políticos, governos ou gabinetes parlamentares. O nome é uma homenagem irônica e descontraída ao clássico vídeo de programação do desenvolvedor Renato Asse.
        </p>
        <p>
          Esta plataforma não emite selos de aprovação, notas de honestidade ou rankings de conduta. O objetivo é unicamente democratizar o acesso aos dados oficiais disponibilizados sob a Lei de Acesso à Informação (Lei nº 12.527/2011), para que você, cidadão, examine os registros originais e formule sua própria visão crítica.
        </p>
      </section>
    </div>
  );
}
