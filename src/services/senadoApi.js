/**
 * Integração oficial com a API de Dados Abertos do Senado Federal do Brasil
 * Portal de Dados Abertos: https://www12.senado.leg.br/dados-abertos
 * Documentação: https://legis.senado.leg.br/dadosabertos/
 */

import { normalizeText } from '../utils/formatters.js';

const SENADO_BASE_URL = 'https://legis.senado.leg.br/dadosabertos';

// Cache em memória para a lista atual de senadores (evita refetch excessivo dos 81 senadores)
let senadoresCache = null;
let senadoresCacheTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

/**
 * Consulta e filtra a lista de senadores em exercício
 */
export async function fetchSenadores({
  nome = '',
  siglaUf = '',
  siglaPartido = '',
  pagina = 1,
  itens = 16,
  signal
} = {}) {
  const now = Date.now();
  let todosSenadores = [];

  if (senadoresCache && (now - senadoresCacheTime < CACHE_TTL_MS)) {
    todosSenadores = senadoresCache;
  } else {
    const url = `${SENADO_BASE_URL}/senador/lista/atual`;
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal
    });

    if (!response.ok) {
      throw new Error(`Erro na API do Senado Federal (${response.status})`);
    }

    const json = await response.json();
    const listaRaw =
      json.ListaParlamentarEmExercicio?.Parlamentares?.Parlamentar || [];

    const listaArray = Array.isArray(listaRaw) ? listaRaw : [listaRaw];

    todosSenadores = listaArray.map((item) => {
      const iden = item.IdentificacaoParlamentar || {};
      const mandato = item.Mandato || {};

      // Formatar URL da foto para HTTPS se vier como HTTP
      let foto = iden.UrlFotoParlamentar || '';
      if (foto.startsWith('http://')) {
        foto = foto.replace('http://', 'https://');
      }

      return {
        id: iden.CodigoParlamentar,
        nome: iden.NomeParlamentar,
        nomeCivil: iden.NomeCompletoParlamentar || iden.NomeParlamentar,
        cargo: 'Senador Federal',
        casa: 'Senado Federal',
        siglaPartido: iden.SiglaPartidoParlamentar || 'Sem Partido',
        siglaUf: iden.UfParlamentar,
        urlFoto: foto,
        email: iden.EmailParlamentar,
        urlOficial: iden.UrlPaginaParlamentar || `https://www25.senado.leg.br/web/senadores/senador/-/perfil/${iden.CodigoParlamentar}`,
        bloco: iden.Bloco ? iden.Bloco.NomeBloco : '',
        mandatoDescricao: mandato.DescricaoParticipacao || 'Titular',
        primeiraLegislatura: mandato.PrimeiraLegislaturaDoMandato?.NumeroLegislatura,
        segundaLegislatura: mandato.SegundaLegislaturaDoMandato?.NumeroLegislatura,
        fonte: 'Senado Federal'
      };
    });

    senadoresCache = todosSenadores;
    senadoresCacheTime = now;
  }

  // Filtragem no cliente com suporte a nome tolerante a acentos
  let filtrados = todosSenadores;

  if (nome && nome.trim()) {
    const termo = normalizeText(nome);
    filtrados = filtrados.filter((s) => {
      const nomeNorm = normalizeText(s.nome);
      const civilNorm = normalizeText(s.nomeCivil);
      return nomeNorm.includes(termo) || civilNorm.includes(termo);
    });
  }

  if (siglaUf) {
    filtrados = filtrados.filter(
      (s) => s.siglaUf?.toUpperCase() === siglaUf.toUpperCase()
    );
  }

  if (siglaPartido) {
    filtrados = filtrados.filter(
      (s) => s.siglaPartido?.toUpperCase() === siglaPartido.toUpperCase()
    );
  }

  // Paginação local
  const offset = (pagina - 1) * itens;
  const paginados = filtrados.slice(offset, offset + itens);

  return {
    dados: paginados,
    total: filtrados.length,
    paginaAtual: Number(pagina),
    temProxima: offset + itens < filtrados.length,
    temAnterior: pagina > 1
  };
}

/**
 * Consulta detalhes completos de um senador pelo Código Parlamentar
 */
export async function fetchSenadorDetalhes(codigo, { signal } = {}) {
  const url = `${SENADO_BASE_URL}/senador/${codigo}`;
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal
  });

  if (!response.ok) {
    throw new Error(`Erro ao consultar detalhes do senador (${response.status})`);
  }

  const json = await response.json();
  const parl = json.DetalheParlamentar?.Parlamentar || {};
  const iden = parl.IdentificacaoParlamentar || {};
  const dadosBasicos = parl.DadosBasicosParlamentar || {};

  let foto = iden.UrlFotoParlamentar || '';
  if (foto.startsWith('http://')) {
    foto = foto.replace('http://', 'https://');
  }

  // Telefones
  let tels = [];
  if (parl.Telefones?.Telefone) {
    const rawTels = parl.Telefones.Telefone;
    const arrayTels = Array.isArray(rawTels) ? rawTels : [rawTels];
    tels = arrayTels.map((t) => t.NumeroTelefone).filter(Boolean);
  }

  return {
    id: iden.CodigoParlamentar,
    nome: iden.NomeParlamentar,
    nomeCivil: iden.NomeCompletoParlamentar || iden.NomeParlamentar,
    cargo: iden.FormaTratamento ? iden.FormaTratamento.trim() : 'Senador Federal',
    casa: 'Senado Federal',
    siglaPartido: iden.SiglaPartidoParlamentar || 'Sem Partido',
    siglaUf: iden.UfParlamentar,
    urlFoto: foto,
    email: iden.EmailParlamentar,
    telefones: tels,
    enderecoParlamentar: dadosBasicos.EnderecoParlamentar,
    dataNascimento: dadosBasicos.DataNascimento,
    naturalidade: dadosBasicos.Naturalidade,
    ufNaturalidade: dadosBasicos.UfNaturalidade,
    urlOficial: iden.UrlPaginaParlamentar || `https://www25.senado.leg.br/web/senadores/senador/-/perfil/${iden.CodigoParlamentar}`,
    fonte: 'Senado Federal'
  };
}

/**
 * Consulta matérias de autoria e coautoria do senador
 */
export async function fetchMateriasSenador(codigo, { signal } = {}) {
  const url = `${SENADO_BASE_URL}/senador/${codigo}/autorias?v=7`;
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal
  });

  if (!response.ok) return [];

  const json = await response.json();
  const rawList =
    json.MateriasAutoriaParlamentar?.Parlamentar?.Autorias?.Autoria || [];
  const arrayList = Array.isArray(rawList) ? rawList : [rawList];

  return arrayList.map((item) => {
    const mat = item.Materia || {};
    return {
      id: mat.Codigo,
      descricao: mat.DescricaoIdentificacao || `${mat.Sigla} ${mat.Numero}/${mat.Ano}`,
      sigla: mat.Sigla,
      numero: mat.Numero,
      ano: mat.Ano,
      ementa: mat.Ementa,
      dataApresentacao: mat.Data,
      autorPrincipal: item.IndicadorAutorPrincipal === 'Sim',
      outrosAutores: item.IndicadorOutrosAutores === 'Sim',
      urlOficial: `https://www25.senado.leg.br/web/atividade/materias/-/materia/${mat.Codigo}`
    };
  });
}

/**
 * Consulta votações nominais do senador com resultado e voto individual
 */
export async function fetchVotacoesSenador(codigo, { ano = '2026', signal } = {}) {
  const url = `${SENADO_BASE_URL}/senador/${codigo}/votacoes?ano=${ano}`;
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal
  });

  if (!response.ok) return [];

  const json = await response.json();
  const rawList =
    json.VotacaoParlamentar?.Parlamentar?.Votacoes?.Votacao || [];
  const arrayList = Array.isArray(rawList) ? rawList : [rawList];

  return arrayList.map((v) => {
    const mat = v.Materia || {};
    const sessao = v.SessaoPlenaria || {};
    const tram = v.Tramitacao?.IdentificacaoTramitacao || {};

    return {
      id: v.CodigoSessaoVotacao || v.Sequencial,
      descricaoVotacao: v.DescricaoVotacao,
      resultado: v.DescricaoResultado || 'Concluído',
      votoIndividual: v.SiglaDescricaoVoto, // "Sim", "Não", "Abstenção", "Votou", etc.
      votacaoSecreta: v.IndicadorVotacaoSecreta === 'Sim',
      totalSim: v.TotalVotosSim,
      totalNao: v.TotalVotosNao,
      totalAbstencao: v.TotalVotosAbstencao,
      dataSessao: sessao.DataSessao,
      horaInicioSessao: sessao.HoraInicioSessao,
      materiaDescricao: mat.DescricaoIdentificacao,
      materiaEmenta: mat.Ementa,
      textoTramitacao: tram.TextoTramitacao,
      urlOficial: mat.Codigo ? `https://www25.senado.leg.br/web/atividade/materias/-/materia/${mat.Codigo}` : 'https://www25.senado.leg.br/web/atividade/votacoes'
    };
  });
}

/**
 * Consulta pronunciamentos e discursos recentes do senador
 */
export async function fetchDiscursosSenador(codigo, { signal } = {}) {
  const url = `${SENADO_BASE_URL}/senador/${codigo}/discursos?v=5`;
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal
  });

  if (!response.ok) return [];

  const json = await response.json();
  const rawList =
    json.DiscursosParlamentar?.Parlamentar?.Pronunciamentos?.Pronunciamento || [];
  const arrayList = Array.isArray(rawList) ? rawList : [rawList];

  return arrayList.map((d) => {
    const tipo = d.TipoUsoPalavra?.Descricao || 'Discurso';
    const sessao = d.SessaoPlenaria || {};

    return {
      codigo: d.CodigoPronunciamento,
      tipoDiscurso: tipo,
      dataPronunciamento: d.DataPronunciamento,
      dataHoraInicio: d.DataPronunciamento,
      sumario: d.TextoResumo,
      transcricao: d.Indexacao, // resumo indexado oficial do Senado
      urlTexto: d.UrlTexto,
      urlTextoBinario: d.UrlTextoBinario,
      numeroSessao: sessao.NumeroSessao,
      dataSessao: sessao.DataSessao
    };
  });
}

/**
 * Consulta comissões em que o senador atua
 */
export async function fetchComissoesSenador(codigo, { signal } = {}) {
  const url = `${SENADO_BASE_URL}/senador/${codigo}/comissoes?v=5`;
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal
  });

  if (!response.ok) return [];

  const json = await response.json();
  const rawList =
    json.MembroComissaoParlamentar?.Parlamentar?.MembroComissoes?.Comissao || [];
  const arrayList = Array.isArray(rawList) ? rawList : [rawList];

  return arrayList.map((c) => ({
    id: c.CodigoComissao,
    sigla: c.IdentificacaoComissao?.SiglaComissao,
    nome: c.IdentificacaoComissao?.NomeComissao,
    participacao: c.DescricaoParticipacao,
    dataInicio: c.DataInicio,
    dataFim: c.DataFim
  }));
}
