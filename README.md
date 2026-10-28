# Políticos "Honestos" — Plataforma de Pesquisa sobre a Atuação Política Brasileira

Plataforma web independente e neutra de pesquisa cidadã, desenvolvida para facilitar a consulta da atuação pública de deputados federais e senadores brasileiros diretamente nas fontes oficiais abertas do Congresso Nacional.

O nome do projeto é uma referência bem-humorada e irônica ao vídeo educacional de programação [“Puxando dados de políticos honestos via API”](https://www.youtube.com), do desenvolvedor Renato Asse. A plataforma **não classifica políticos como honestos ou desonestos**, não atribui notas de caráter, não cria rankings subjetivos de melhores ou piores nem emite julgamentos ideológicos ou partidários. Seu propósito exclusivo é disponibilizar dados oficiais e verificáveis para que qualquer cidadão examine as fontes e forme suas próprias conclusões.

---

## 1. Objetivo e Princípios

- **Transparência Pública e Acesso à Informação:** Democratizar o acesso aos dados legislativos garantidos pela Lei de Acesso à Informação (Lei nº 12.527/2011).
- **Estrita Neutralidade:** Ausência de índices sintéticos ou moralizantes. Não há conclusões automáticas como "bom político" ou "menos atuante".
- **Fidelidade às Fontes Oficiais:** Todos os registros exibidos possuem referências rastreáveis e links diretos para os portais oficiais da Câmara dos Deputados e do Senado Federal.
- **Rigor Documental:** Votações nominais registram exclusivamente os votos confirmados de cada parlamentar (sem deduções arbitrárias por bancada); propostas mantêm seu status oficial de tramitação; despesas da cota parlamentar (CEAP) são exibidas com as notas fiscais originais emitidas pelos fornecedores.

---

## 2. Funcionalidades Implementadas

### 2.1. Página Inicial de Pesquisa
- **Campo de busca flexível:** Pesquisa parlamentares por nome completo ou partes do nome parlamentar/civil, tolerante a acentos e maiúsculas/minúsculas.
- **Sugestões rápidas:** Atalhos rápidos para parlamentares com grande volume de dados registrados.
- **Filtro por Casa Legislativa / Cargo:**
  - *Todos*: busca integrada simultânea na Câmara e no Senado;
  - *Deputados Federais*: consulta restrita à Câmara dos Deputados;
  - *Senadores*: consulta aos 81 senadores da República.
- **Filtros por Estado (UF):** Seleção entre todas as 27 unidades da federação (26 estados + DF).
- **Filtro por Partido Político:** Filtragem pelos principais partidos com representação no Congresso (PL, PT, UNIÃO, PP, PSD, MDB, PSB, PDT, etc.).
- **Cartões Informativos:** Foto oficial com salvaguarda para imagens ausentes, partido, UF, mandato, casa legislativa e links imediatos para consulta.
- **Paginação:** Navegação fluida entre páginas de resultados.

### 2.2. Perfil Individual do Político
- **Cabeçalho com Identificação e Contato:**
  - Fotografia oficial em alta resolução;
  - Nome parlamentar e nome civil completo;
  - Cargo, legislatura e situação do mandato (titular/exercício);
  - Email oficial, telefone do gabinete, endereço físico em Brasília, data de nascimento e naturalidade;
  - Link com selo de verificação para a página oficial do parlamentar.
- **Aba 1: Visão Geral:**
  - Cards de contagem factual de proposições, votações nominais, discursos, despesas declaradas e participação em comissões;
  - Resumo das atividades e proposições mais recentes;
  - Nota metodológica transparente explicando que quantidade não equivale a mérito isolado.
- **Aba 2: Projetos e Proposições:**
  - Listagem das propostas de autoria e coautoria (Projetos de Lei - PL, Propostas de Emenda Constitucional - PEC, Requerimentos - REQ, Medidas Provisórias - MPV);
  - Ementa oficial completa;
  - Identificação de autor principal vs. coautor;
  - Data de apresentação e número/ano;
  - Campo de busca interna por palavras-chave na ementa;
  - Filtro por tipo de proposição;
  - Link para conferir a tramitação na íntegra no portal oficial.
- **Aba 3: Votações Nominais:**
  - Matérias submetidas a deliberação com votação nominal registrada;
  - Distinção visual e objetiva dos votos:
    - **Sim** (Favorável)
    - **Não** (Contrário)
    - **Abstenção**
    - **Obstrução**
    - **Ausência de voto individual** (em votações simbólicas ou sem quórum registrado, informando com precisão a limitação da fonte sem deduções injustas);
  - Resultado geral da matéria (Aprovado / Rejeitado);
  - Link para a ata oficial da votação.
- **Aba 4: Atividades e Discursos:**
  - Pronunciamentos em plenário e comissões;
  - Sumário oficial e indexação de temas/palavras-chave;
  - Visualizador de transcrição oficial completa (com expansão/recolhimento);
  - Lista de comissões temáticas das quais o parlamentar é membro titular ou suplente (CCJ, Comissão de Educação, Saúde, etc.);
  - Link para a publicação no Diário Oficial e registros de áudio/vídeo quando disponíveis.
- **Aba 5: Despesas Parlamentares (CEAP):**
  - Para Deputados Federais:
    - Consulta detalhada da Cota para Exercício da Atividade Parlamentar;
    - Seletor de anos (2026, 2025, 2024, 2023 ou legislatura completa);
    - Filtro por categoria (Passagens, Combustíveis, Consultorias, Telefonia, Escritório, Divulgação);
    - **Cálculo transparente do total acumulado** com explicação expressa do intervalo considerado;
    - Nome do fornecedor, número do documento e CNPJ/CPF formatado;
    - Link direto para a nota fiscal oficial em PDF arquivada na Câmara.
  - Para Senadores:
    - Informação clara sobre o modelo de prestação de contas do Senado (CEAPS) e link direto para o Portal da Transparência do Senado Federal.
- **Aba 6: Linha do Tempo da Atuação:**
  - Timeline cronológica unificada integrando proposições apresentadas, votações, discursos e despesas recentes;
  - Ordenação do acontecimento mais recente para os anteriores;
  - Badges temáticos e links de verificação individual.

---

## 3. Fontes de Dados e Links Oficiais

Todas as requisições são feitas em tempo real diretamente para as APIs públicas do Poder Legislativo:

1. **Câmara dos Deputados do Brasil:**
   - Base da API: `https://dadosabertos.camara.leg.br/api/v2`
   - Documentação Swagger: `https://dadosabertos.camara.leg.br/swagger/api.html`
   - Endpoints utilizados: `/deputados`, `/deputados/{id}`, `/proposicoes`, `/deputados/{id}/despesas`, `/deputados/{id}/discursos`, `/deputados/{id}/eventos`, `/deputados/{id}/orgaos`, `/votacoes`, `/votacoes/{id}/votos`.

2. **Senado Federal do Brasil:**
   - Portal de Dados Abertos: `https://www12.senado.leg.br/dados-abertos`
   - Documentação de Serviços: `https://legis.senado.leg.br/dadosabertos/`
   - Endpoints utilizados: `/senador/lista/atual`, `/senador/{codigo}`, `/senador/{codigo}/autorias`, `/senador/{codigo}/votacoes`, `/senador/{codigo}/discursos`, `/senador/{codigo}/comissoes`.

---

## 4. Tecnologias Utilizadas

- **React (v19)** — Construção dos componentes de interface e controle de estado.
- **Vite (v8)** — Ferramenta de build rápido e servidor de desenvolvimento leve.
- **JavaScript (ES2022 / ESNext)** — Linguagem do código da aplicação, sem dependência de banco de dados intermediário.
- **Tailwind CSS (v4)** — Estilização moderna, responsiva, sóbria e acessível.
- **Lucide React** — Biblioteca de ícones vetoriais leves e consistentes.
- **Fetch API nativa** — Requisições HTTP diretas do navegador aos endpoints governamentais abertos com suporte a CORS.

---

## 5. Como Executar Localmente

### Pré-requisitos
- Node.js versão 18 ou superior.
- npm versão 9 ou superior.

### Passo a passo

1. Clone o repositório ou baixe os arquivos do projeto:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd politicos-honestos
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Abra seu navegador em:
   ```
   http://localhost:3000
   ```

---

## 6. Como Gerar a Versão de Produção

Para gerar o pacote estático otimizado para deploy:

```bash
npm run build
```

Os arquivos de produção serão gerados na pasta `dist/`.

Para testar a versão de produção localmente:
```bash
npm run preview
```

### Hospedagem Gratuita (Vercel ou Netlify)
Por ser uma aplicação Single Page Application (SPA) em React estático com Vite, o projeto pode ser publicado diretamente na [Vercel](https://vercel.com) ou na [Netlify](https://netlify.com) sem custos de infraestrutura nem necessidade de servidor backend próprio.

---

## 7. Organização dos Arquivos

```
politicos-honestos/
├── index.html                           # Ponto de entrada HTML com metatags cívicas
├── metadata.json                        # Metadados da aplicação
├── package.json                         # Dependências e scripts npm
├── vite.config.ts                       # Configuração do Vite e Tailwind
├── src/
│   ├── main.tsx                         # Ponto de entrada React DOM
│   ├── App.tsx                          # Orquestrador de rotas e navegação
│   ├── index.css                        # Estilos globais e fontes do Tailwind v4
│   ├── services/
│   │   ├── camaraApi.js                 # Cliente da API da Câmara dos Deputados
│   │   └── senadoApi.js                 # Cliente da API do Senado Federal
│   ├── utils/
│   │   └── formatters.js                # Formatadores de moeda, datas, CPFs e UFs
│   ├── components/
│   │   ├── Header.jsx                   # Cabeçalho com marca e gatilho do modal
│   │   ├── Footer.jsx                   # Rodapé com créditos e links legais
│   │   ├── SearchBar.jsx                # Barra de busca por nome e sugestões
│   │   ├── Filters.jsx                  # Seletor de Casa, UF e Partido
│   │   ├── PoliticianCard.jsx           # Card do político com foto e badges
│   │   ├── Pagination.jsx               # Navegação paginada
│   │   ├── Loading.jsx                  # Estados de carregamento com feedback
│   │   ├── ErrorMessage.jsx             # Tratamento de erro com botão de retry
│   │   ├── EmptyState.jsx               # Estado para busca sem resultados
│   │   ├── SourceLink.jsx               # Link padronizado para fontes oficiais
│   │   ├── AboutModal.jsx               # Modal sobre a inspiração e neutralidade
│   │   └── profile/
│   │       ├── ProfileHeader.jsx        # Cabeçalho com dados biográficos e contato
│   │       ├── OverviewTab.jsx          # Resumo numérico e destaques
│   │       ├── PropositionsTab.jsx      # Proposições com filtros e ementas
│   │       ├── VotingsTab.jsx           # Votações nominais e votos individuais
│   │       ├── SpeechesTab.jsx          # Discursos com transcrição e comissões
│   │       ├── ExpensesTab.jsx          # Despesas da CEAP com notas fiscais (PDF)
│   │       └── TimelineTab.jsx          # Linha do tempo cronológica consolidada
└── README.md                            # Documentação completa do projeto
```

---

## 8. Como os Dados São Consultados e Apresentados

1. **Consulta Direta às APIs Públicas:** O navegador realiza requisições `fetch` diretamente aos servidores de dados abertos da Câmara e do Senado.
2. **Tratamento de Nulos e Inconsistências:** Dados não disponibilizados são assinalados explicitamente como *"Não informado"* ou *"Sem voto individual disponível"*, evitando qualquer suposição ou inferência arbitrária.
3. **Respeito aos Critérios Oficiais:**
   - Apenas votações nominais registram o voto de cada deputado ou senador.
   - Proposições mantêm sua classificação original (PL, PEC, etc.) e sua fase atual de tramitação.
   - Despesas da cota parlamentar exibem o valor líquido, fornecedor identificado com CNPJ/CPF e link direto para a cópia do documento fiscal original.

---

## 9. Limitações Conhecidas

- **Instabilidades Governamentais Temporárias:** Como as requisições são feitas em tempo real às APIs governamentais, lentidões ou indisponibilidades momentâneas nos servidores do Congresso podem afetar o tempo de resposta. A aplicação implementa tratamento de erro com botão de nova tentativa.
- **Votações Simbólicas:** Matérias aprovadas por acordo de liderança ou votação simbólica não geram registros nominais individuais na base de dados de nenhum dos órgãos legislativos.
- **Despesas do Senado (CEAPS):** Ao contrário da Câmara dos Deputados (que provê endpoint REST granular por nota fiscal de cada deputado), o Senado Federal agrupa as despesas da CEAPS em relatórios mensais no Portal da Transparência; por isso, a aplicação direciona para o portal oficial do Senado na respectiva aba.
- **Escopo Inicial:** Atualmente, a plataforma contempla os 513 deputados federais e os 81 senadores da 57ª Legislatura (2023–2027). A integração de deputados estaduais, vereadores e do TSE para dados eleitorais está prevista para versões futuras.

---

## 10. Uso de Inteligência Artificial

Em consonância com as boas práticas de integridade e transparência:

- Este projeto foi desenvolvido com o auxílio do assistente de inteligência artificial do **Google AI Studio**.
- A IA foi utilizada para a estruturação da arquitetura de componentes React, elaboração dos clientes de API para normalização dos dados governamentais, configuração da tipografia e estilização com Tailwind CSS, além da redação desta documentação técnica.
- Todas as fontes de dados integradas foram verificadas diretamente contra as especificações reais do Swagger da Câmara dos Deputados e do portal de Dados Abertos do Senado Federal. Nenhum dado fictício ou simulado foi injetado.

---

## 11. Créditos e Agradecimentos

- **Renato Asse:** Pelo vídeo histórico *“Puxando dados de políticos honestos via API”*, que inspirou o nome do projeto e estimulou milhares de programadores a explorarem APIs públicas de dados abertos no Brasil.
- **Câmara dos Deputados do Brasil** — Diretoria de Inovação e Tecnologia da Informação / Dados Abertos.
- **Senado Federal do Brasil** — Secretaria de Tecnologia da Informação / Dados Abertos.
