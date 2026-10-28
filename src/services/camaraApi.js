/**
 * Integração oficial com a API de Dados Abertos da Câmara dos Deputados do Brasil
 * Base da API: https://dadosabertos.camara.leg.br/api/v2
 * Documentação Swagger: https://dadosabertos.camara.leg.br/swagger/api.html
 */

const CAMARA_BASE_URL = 'https://dadosabertos.camara.leg.br/api/v2';

/**
 * Consulta lista de deputados com filtros de nome, UF, partido e paginação
 */
export async function fetchDeputados({
  nome = '',
  siglaUf = '',
  siglaPartido = '',
  pagina = 1,
  itens = 16,
  signal
} = {}) {
  const params = new URLSearchParams({
    ordem: 'ASC',
    ordenarPor: 'nome',
    pagina: String(pagina),
    itens: String(itens)
  });

  if (nome && nome.trim()) params.append('nome', nome.trim());
  if (siglaUf) params.append('siglaUf', siglaUf);
  if (siglaPartido) params.append('siglaPartido', siglaPartido);

  const url = `${CAMARA_BASE_URL}/deputados?${params.toString()}`;
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal
  });

  if (!response.ok) {
    throw new Error(`Erro na API da Câmara (${response.status}): ${response.statusText}`);
  }

  const json = await response.json();
  const deputados = (json.dados || []).map((dep) => ({
    id: dep.id,
    nome: dep.nome,
    nomeCivil: dep.nome,
    cargo: 'Deputado Federal',
    casa: 'Câmara dos Deputados',
    siglaPartido: dep.siglaPartido || 'Sem Partido',
    siglaUf: dep.siglaUf,
    urlFoto: dep.urlFoto,
    email: dep.email,
    idLegislatura: dep.idLegislatura,
    fonte: 'Câmara dos Deputados',
    urlOficial: `https://www.camara.leg.br/deputados/${dep.id}`
  }));

  // Extrair links de paginação se disponíveis
  const links = json.links || [];
  const nextLink = links.find((l) => l.rel === 'next');
  const prevLink = links.find((l) => l.rel === 'previous');
  const lastLink = links.find((l) => l.rel === 'last');

  return {
    dados: deputados,
    paginaAtual: Number(pagina),
    temProxima: !!nextLink,
    temAnterior: !!prevLink,
    links
  };
}

/**
 * Consulta detalhes completos de um deputado pelo ID oficial
 */
export async function fetchDeputadoDetalhes(id, { signal } = {}) {
  const url = `${CAMARA_BASE_URL}/deputados/${id}`;
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal
  });

  if (!response.ok) {
    throw new Error(`Erro ao consultar detalhes do deputado (${response.status})`);
  }

  const json = await response.json();
  const d = json.dados;
  const status = d.ultimoStatus || {};

  return {
    id: d.id,
    nome: status.nome || d.nomeCivil,
    nomeCivil: d.nomeCivil,
    cargo: 'Deputado Federal',
    casa: 'Câmara dos Deputados',
    siglaPartido: status.siglaPartido || 'Sem Partido',
    siglaUf: status.siglaUf,
    situacao: status.situacao || 'Titular',
    condicaoEleitoral: status.condicaoEleitoral,
    descricaoStatus: status.descricaoStatus,
    urlFoto: status.urlFoto,
    email: status.email || (status.gabinete && status.gabinete.email),
    telefone: status.gabinete && status.gabinete.telefone,
    gabinete: status.gabinete,
    dataNascimento: d.dataNascimento,
    dataFalecimento: d.dataFalecimento,
    ufNascimento: d.ufNascimento,
    municipioNascimento: d.municipioNascimento,
    escolaridade: d.escolaridade,
    urlWebsite: d.urlWebsite,
    redeSocial: d.redeSocial || [],
    idLegislatura: status.idLegislatura,
    fonte: 'Câmara dos Deputados',
    urlOficial: `https://www.camara.leg.br/deputados/${d.id}`
  };
}

/**
 * Consulta proposições de autoria do deputado
 */
export async function fetchProposicoesDeputado(id, { pagina = 1, itens = 15, siglaTipo = '', ano = '', signal } = {}) {
  const params = new URLSearchParams({
    idDeputadoAutor: String(id),
    ordem: 'DESC',
    ordenarPor: 'id',
    pagina: String(pagina),
    itens: String(itens)
  });

  if (siglaTipo) params.append('siglaTipo', siglaTipo);
  if (ano) params.append('ano', ano);

  const url = `${CAMARA_BASE_URL}/proposicoes?${params.toString()}`;
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal
  });

  if (!response.ok) {
    throw new Error(`Erro ao consultar proposições (${response.status})`);
  }

  const json = await response.json();
  const dados = (json.dados || []).map((p) => ({
    id: p.id,
    siglaTipo: p.siglaTipo,
    numero: p.numero,
    ano: p.ano,
    ementa: p.ementa,
    descricao: `${p.siglaTipo} ${p.numero}/${p.ano}`,
    dataApresentacao: p.dataApresentacao,
    urlOficial: `https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=${p.id}`
  }));

  const links = json.links || [];
  return {
    dados,
    paginaAtual: Number(pagina),
    temProxima: !!links.find((l) => l.rel === 'next'),
    temAnterior: !!links.find((l) => l.rel === 'previous')
  };
}

/**
 * Consulta tramitações de uma proposição
 */
export async function fetchTramitacoesProposicao(proposicaoId, { signal } = {}) {
  const url = `${CAMARA_BASE_URL}/proposicoes/${proposicaoId}/tramitacoes`;
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal
  });

  if (!response.ok) return [];
  const json = await response.json();
  return json.dados || [];
}

/**
 * Consulta despesas da Cota para Exercício da Atividade Parlamentar (CEAP)
 */
export async function fetchDespesasDeputado(id, { ano = '', pagina = 1, itens = 25, signal } = {}) {
  const params = new URLSearchParams({
    ordem: 'DESC',
    ordenarPor: 'dataDocumento',
    pagina: String(pagina),
    itens: String(itens)
  });

  // Se ano for especificado, utiliza; caso contrário filtra pela legislatura atual (57)
  if (ano && ano !== 'todas') {
    params.append('ano', String(ano));
  } else {
    params.append('idLegislatura', '57');
  }

  const url = `${CAMARA_BASE_URL}/deputados/${id}/despesas?${params.toString()}`;
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal
  });

  if (!response.ok) {
    throw new Error(`Erro ao consultar despesas parlamentares (${response.status})`);
  }

  const json = await response.json();
  const dados = (json.dados || []).map((d) => ({
    ano: d.ano,
    mes: d.mes,
    tipoDespesa: d.tipoDespesa,
    dataDocumento: d.dataDocumento,
    numDocumento: d.numDocumento,
    nomeFornecedor: d.nomeFornecedor,
    cnpjCpfFornecedor: d.cnpjCpfFornecedor,
    valorDocumento: d.valorDocumento,
    valorLiquido: d.valorLiquido,
    valorGlosa: d.valorGlosa,
    urlDocumento: d.urlDocumento,
    tipoDocumento: d.tipoDocumento
  }));

  const links = json.links || [];
  return {
    dados,
    paginaAtual: Number(pagina),
    temProxima: !!links.find((l) => l.rel === 'next'),
    temAnterior: !!links.find((l) => l.rel === 'previous')
  };
}

/**
 * Consulta discursos realizados pelo deputado em plenário ou comissões
 */
export async function fetchDiscursosDeputado(id, { dataInicio = '2023-01-01', itens = 15, pagina = 1, signal } = {}) {
  const params = new URLSearchParams({
    dataInicio,
    ordem: 'DESC',
    ordenarPor: 'dataHoraInicio',
    itens: String(itens),
    pagina: String(pagina)
  });

  const url = `${CAMARA_BASE_URL}/deputados/${id}/discursos?${params.toString()}`;
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal
  });

  if (!response.ok) {
    return { dados: [], temProxima: false };
  }

  const json = await response.json();
  const dados = (json.dados || []).map((d) => ({
    dataHoraInicio: d.dataHoraInicio,
    tipoDiscurso: d.tipoDiscurso,
    faseEvento: d.faseEvento ? d.faseEvento.titulo : '',
    sumario: d.sumario,
    transcricao: d.transcricao,
    keywords: d.keywords,
    urlTexto: d.urlTexto,
    urlAudio: d.urlAudio,
    urlVideo: d.urlVideo
  }));

  const links = json.links || [];
  return {
    dados,
    temProxima: !!links.find((l) => l.rel === 'next')
  };
}

/**
 * Consulta eventos e sessões com participação registrada do deputado
 */
export async function fetchEventosDeputado(id, { dataInicio = '2023-01-01', itens = 15, pagina = 1, signal } = {}) {
  const params = new URLSearchParams({
    dataInicio,
    ordem: 'DESC',
    ordenarPor: 'dataHoraInicio',
    itens: String(itens),
    pagina: String(pagina)
  });

  const url = `${CAMARA_BASE_URL}/deputados/${id}/eventos?${params.toString()}`;
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal
  });

  if (!response.ok) {
    return { dados: [] };
  }

  const json = await response.json();
  const dados = (json.dados || []).map((e) => ({
    id: e.id,
    dataHoraInicio: e.dataHoraInicio,
    dataHoraFim: e.dataHoraFim,
    situacao: e.situacao,
    descricaoTipo: e.descricaoTipo,
    descricao: e.descricao,
    local: e.localCamara ? e.localCamara.nome : '',
    urlOficial: `https://www.camara.leg.br/eventos/${e.id}`
  }));

  return { dados };
}

/**
 * Consulta órgãos e comissões legislativas das quais o deputado é membro
 */
export async function fetchOrgaosDeputado(id, { signal } = {}) {
  const url = `${CAMARA_BASE_URL}/deputados/${id}/orgaos`;
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal
  });

  if (!response.ok) return [];
  const json = await response.json();
  return (json.dados || []).map((o) => ({
    id: o.idOrgao,
    sigla: o.siglaOrgao,
    nome: o.nomeOrgao,
    titulo: o.titulo,
    dataInicio: o.dataInicio,
    dataFim: o.dataFim
  }));
}

/**
 * Consulta votações nominais recentes da Câmara dos Deputados
 * e identifica o voto individual do deputado especificado
 */
export async function fetchVotacoesDeputado(idDeputado, { pagina = 1, itens = 8, signal } = {}) {
  try {
    // 1. Busca lista de votações recentes da Câmara
    const params = new URLSearchParams({
      ordem: 'DESC',
      ordenarPor: 'dataHoraRegistro',
      itens: String(itens),
      pagina: String(pagina)
    });

    const url = `${CAMARA_BASE_URL}/votacoes?${params.toString()}`;
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal
    });

    if (!response.ok) return { dados: [], temProxima: false };
    const json = await response.json();
    const votacoes = json.dados || [];

    // 2. Para cada votação, consulta votos nominais para localizar o voto do deputado
    const resultados = await Promise.all(
      votacoes.map(async (v) => {
        let votoIndividual = null;
        let teveVotoNominal = false;

        try {
          const vResp = await fetch(`${CAMARA_BASE_URL}/votacoes/${v.id}/votos`, {
            headers: { Accept: 'application/json' },
            signal
          });
          if (vResp.ok) {
            const vJson = await vResp.json();
            const votos = vJson.dados || [];
            if (votos.length > 0) {
              teveVotoNominal = true;
              const encontrado = votos.find((vt) => String(vt.deputado_.id) === String(idDeputado));
              if (encontrado) {
                votoIndividual = encontrado.tipoVoto; // "Sim", "Não", "Abstenção", etc.
              }
            }
          }
        } catch {
          // Ignora falhas em votação individual específica
        }

        return {
          id: v.id,
          data: v.data,
          dataHoraRegistro: v.dataHoraRegistro,
          siglaOrgao: v.siglaOrgao,
          descricao: v.descricao,
          aprovacao: v.aprovacao === 1 ? 'Aprovado' : v.aprovacao === 0 ? 'Rejeitado' : 'Concluído',
          proposicaoObjeto: v.proposicaoObjeto,
          teveVotoNominal,
          votoIndividual, // null se não votou ou se foi simbólica
          urlOficial: `https://www.camara.leg.br/votacoes/${v.id}`
        };
      })
    );

    const links = json.links || [];
    return {
      dados: resultados,
      temProxima: !!links.find((l) => l.rel === 'next')
    };
  } catch (err) {
    console.error('Erro ao buscar votações:', err);
    return { dados: [], temProxima: false };
  }
}
