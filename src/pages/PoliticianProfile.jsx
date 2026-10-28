import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Vote,
  Mic,
  Receipt,
  Clock,
  LayoutDashboard,
  RefreshCw
} from 'lucide-react';
import ProfileHeader from '../components/profile/ProfileHeader.jsx';
import OverviewTab from '../components/profile/OverviewTab.jsx';
import PropositionsTab from '../components/profile/PropositionsTab.jsx';
import VotingsTab from '../components/profile/VotingsTab.jsx';
import SpeechesTab from '../components/profile/SpeechesTab.jsx';
import ExpensesTab from '../components/profile/ExpensesTab.jsx';
import TimelineTab from '../components/profile/TimelineTab.jsx';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

import {
  fetchDeputadoDetalhes,
  fetchProposicoesDeputado,
  fetchDespesasDeputado,
  fetchDiscursosDeputado,
  fetchOrgaosDeputado,
  fetchVotacoesDeputado
} from '../services/camaraApi.js';

import {
  fetchSenadorDetalhes,
  fetchMateriasSenador,
  fetchVotacoesSenador,
  fetchDiscursosSenador,
  fetchComissoesSenador
} from '../services/senadoApi.js';

export default function PoliticianProfile({ politician, onBack }) {
  const [activeTab, setActiveTab] = useState('visao-geral');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados dos dados do perfil
  const [details, setDetails] = useState(politician);
  const [proposicoes, setProposicoes] = useState([]);
  const [votacoes, setVotacoes] = useState([]);
  const [discursos, setDiscursos] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [comissoes, setComissoes] = useState([]);
  const [anoDespesa, setAnoDespesa] = useState('2026');

  const isSenado = politician.casa === 'Senado Federal' || politician.cargo?.includes('Senador');

  // Carrega dados iniciais da API
  const loadPoliticianData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (isSenado) {
        // Carrega dados do Senado Federal
        const [detalhesResp, materiasResp, votacoesResp, discursosResp, comissoesResp] =
          await Promise.allSettled([
            fetchSenadorDetalhes(politician.id),
            fetchMateriasSenador(politician.id),
            fetchVotacoesSenador(politician.id, { ano: '2026' }),
            fetchDiscursosSenador(politician.id),
            fetchComissoesSenador(politician.id)
          ]);

        if (detalhesResp.status === 'fulfilled') {
          setDetails((prev) => ({ ...prev, ...detalhesResp.value }));
        }
        if (materiasResp.status === 'fulfilled') {
          setProposicoes(materiasResp.value || []);
        }
        if (votacoesResp.status === 'fulfilled') {
          setVotacoes(votacoesResp.value || []);
        }
        if (discursosResp.status === 'fulfilled') {
          setDiscursos(discursosResp.value || []);
        }
        if (comissoesResp.status === 'fulfilled') {
          setComissoes(comissoesResp.value || []);
        }
      } else {
        // Carrega dados da Câmara dos Deputados
        const [detalhesResp, proposicoesResp, despesasResp, discursosResp, orgaosResp, votacoesResp] =
          await Promise.allSettled([
            fetchDeputadoDetalhes(politician.id),
            fetchProposicoesDeputado(politician.id, { itens: 20 }),
            fetchDespesasDeputado(politician.id, { ano: anoDespesa, itens: 35 }),
            fetchDiscursosDeputado(politician.id, { itens: 15 }),
            fetchOrgaosDeputado(politician.id),
            fetchVotacoesDeputado(politician.id, { itens: 8 })
          ]);

        if (detalhesResp.status === 'fulfilled') {
          setDetails((prev) => ({ ...prev, ...detalhesResp.value }));
        }
        if (proposicoesResp.status === 'fulfilled') {
          setProposicoes(proposicoesResp.value?.dados || []);
        }
        if (despesasResp.status === 'fulfilled') {
          setDespesas(despesasResp.value?.dados || []);
        }
        if (discursosResp.status === 'fulfilled') {
          setDiscursos(discursosResp.value?.dados || []);
        }
        if (orgaosResp.status === 'fulfilled') {
          setComissoes(orgaosResp.value || []);
        }
        if (votacoesResp.status === 'fulfilled') {
          setVotacoes(votacoesResp.value?.dados || []);
        }
      }
    } catch (err) {
      console.error('Erro ao carregar dados do político:', err);
      setError('Não foi possível sincronizar os registros parlamentares no momento.');
    } finally {
      setLoading(false);
    }
  }, [politician.id, isSenado, anoDespesa]);

  useEffect(() => {
    loadPoliticianData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [loadPoliticianData]);

  // Recarrega despesas quando o ano muda
  const handleAnoDespesaChange = async (novoAno) => {
    setAnoDespesa(novoAno);
    if (!isSenado) {
      try {
        const resp = await fetchDespesasDeputado(politician.id, { ano: novoAno, itens: 40 });
        setDespesas(resp.dados || []);
      } catch (err) {
        console.error('Erro ao atualizar ano de despesa:', err);
      }
    }
  };

  const tabs = [
    { id: 'visao-geral', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'proposicoes', label: `Proposições (${proposicoes.length})`, icon: FileText },
    { id: 'votacoes', label: `Votações (${votacoes.length})`, icon: Vote },
    { id: 'discursos', label: `Discursos & Atividades (${discursos.length})`, icon: Mic },
    {
      id: 'despesas',
      label: isSenado ? 'Despesas (CEAPS)' : `Despesas CEAP (${despesas.length})`,
      icon: Receipt
    },
    { id: 'linha-tempo', label: 'Linha do Tempo', icon: Clock }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Cabeçalho do Perfil */}
      <ProfileHeader details={details} onBack={onBack} />

      {/* Navegação por Abas */}
      <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar mb-6 gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs md:text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'border-blue-600 text-blue-700 bg-white shadow-2xs rounded-t-xl'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Conteúdo Principal da Aba */}
      {loading ? (
        <Loading
          message={`Consultando dados oficiais de ${details.nome}...`}
          subtitle={`Acessando proposições, discursos e registros em ${details.casa}`}
        />
      ) : error ? (
        <ErrorMessage message={error} onRetry={loadPoliticianData} />
      ) : (
        <div className="min-h-[400px]">
          {activeTab === 'visao-geral' && (
            <OverviewTab
              details={details}
              proposicoes={proposicoes}
              votacoes={votacoes}
              discursos={discursos}
              despesas={despesas}
              comissoes={comissoes}
              onSelectTab={setActiveTab}
            />
          )}

          {activeTab === 'proposicoes' && (
            <PropositionsTab proposicoes={proposicoes} loading={loading} />
          )}

          {activeTab === 'votacoes' && (
            <VotingsTab votacoes={votacoes} casa={details.casa} />
          )}

          {activeTab === 'discursos' && (
            <SpeechesTab
              discursos={discursos}
              comissoes={comissoes}
              casa={details.casa}
            />
          )}

          {activeTab === 'despesas' && (
            <ExpensesTab
              despesas={despesas}
              loading={loading}
              anoSelecionado={anoDespesa}
              onAnoChange={handleAnoDespesaChange}
              isSenado={isSenado}
            />
          )}

          {activeTab === 'linha-tempo' && (
            <TimelineTab
              proposicoes={proposicoes}
              votacoes={votacoes}
              discursos={discursos}
              despesas={despesas}
            />
          )}
        </div>
      )}
    </div>
  );
}
