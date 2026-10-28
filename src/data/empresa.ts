export const company = {
  name: 'DataTransp',
  legalName: 'DATATRANSP SISTEMAS LTDA',
  cnpj: '07.023.901/0001-48',
  foundation: '1997',
  // anos de experiência calculados no build, a partir da fundação (1997)
  experienceYears: new Date().getFullYear() - 1997,
  teamSize: 9,
  headquarters: 'Rua Nereu Ramos, 75 D, Centro, Chapecó/SC',
  phone: '(49) 3329-8293',
  whatsapp: '(49) 98904-5534',
  email: 'comercial@datatransp.com.br',
  facebook: 'https://facebook.com/DataTransp-Sistemas-347419281960623',
  instagram: 'https://www.instagram.com/datatransp_sistemas/',
  mission:
    'Prover sistemas de informação para transportadoras e frotistas com inovação e excelência.',
  vision: 'Ser a primeira referência em soluções do nosso segmento.',
  values: [
    'Desenvolvimento humano',
    'Ética e respeito',
    'Foco no cliente',
    'Inovação',
  ],
  history:
    `A DataTransp foi fundada em 1997, em Xaxim/SC, e hoje tem sede em Chapecó/SC. O DataTransp é um sistema integrado de gestão para transportadoras e frotistas. Em ${new Date().getFullYear()}, a empresa completa ${new Date().getFullYear() - 1997} anos de experiência.`,
  serviceArea:
    'Atendemos transportadoras e frotistas em todo o Brasil.',
  productName: 'DataTransp',
  siteUrl: 'https://datatransp.com.br',
};

export const navigation = [
  { label: 'Início', href: '/' },
  { label: 'Funcionalidades', href: '/funcionalidades' },
  { label: 'Empresa', href: '/empresa' },
  { label: 'Novidades', href: '/novidades' },
  { label: 'Contato', href: '/contato' },
];

export const modules = [
  {
    slug: 'fiscal',
    title: 'Fiscal',
    category: 'Documentos fiscais',
    summary:
      'Emissão e recepção com importação automática de NF-e, CT-e, MDF-e e NFS-e; SPED por integração.',
    problem: 'Emissão e recepção de documentos fiscais em um fluxo integrado.',
    whatItDoes: [
      'Emissão e recepção de NF-e, CT-e, MDF-e e NFS-e',
      'Importação automática dos documentos fiscais',
      'Integração com SPED',
    ],
    documents: ['NF-e', 'CT-e', 'MDF-e', 'NFS-e'],
    relatedIntegrations: ['SPED'],
    confirmed: true,
    cta: 'Agendar demonstração do módulo fiscal',
  },
  {
    slug: 'financeiro',
    title: 'Financeiro',
    category: 'Gestão financeira',
    summary: 'Gestão financeira e faturamento com integração para a contabilidade.',
    problem: 'Gestão financeira e faturamento integrados à rotina da transportadora.',
    whatItDoes: [
      'Gestão financeira',
      'Faturamento',
      'Integração com a contabilidade',
    ],
    documents: [],
    relatedIntegrations: ['Contábil'],
    confirmed: true,
    cta: 'Ver financeiro em demonstração',
  },
  {
    slug: 'manutencao',
    title: 'Manutenção',
    category: 'Gestão da frota',
    summary: 'Controle de manutenção e histórico de toda a frota sem planilhas por fora.',
    problem: 'Manter o histórico de manutenção e frota organizado sem planilhas por fora.',
    whatItDoes: [
      'Controle de manutenção',
      'Histórico de toda a frota',
    ],
    documents: [],
    relatedIntegrations: [],
    confirmed: true,
    cta: 'Entender mais sobre manutenção',
  },
  {
    slug: 'pneus',
    title: 'Pneus',
    category: 'Gestão da frota',
    summary: 'Controle de pneus e histórico de toda a frota sem planilhas por fora.',
    problem: 'Manter o controle de pneus e o histórico da frota em um só sistema.',
    whatItDoes: [
      'Controle de pneus',
      'Histórico de toda a frota',
    ],
    documents: [],
    relatedIntegrations: [],
    confirmed: true,
    cta: 'Quero saber mais sobre pneus',
  },
  {
    slug: 'combustiveis',
    title: 'Combustíveis e Arla',
    category: 'Gestão da frota',
    summary:
      'Acompanhe o consumo de combustíveis e Arla. Operações com bomba própria também podem controlar o estoque.',
    problem: 'Acompanhar o consumo e o estoque de combustíveis e Arla na operação.',
    whatItDoes: [
      'Acompanhamento do consumo médio e total por combustível e Arla',
      'Controle de estoque para operações com bomba própria',
    ],
    documents: [],
    relatedIntegrations: [],
    confirmed: true,
    cta: 'Conhecer gestão de combustíveis',
  },
  {
    slug: 'alertas',
    title: 'Alertas',
    category: 'Gestão operacional',
    summary:
      'Configure avisos para destacar ocorrências importantes na tela principal do sistema.',
    problem: 'Identificar ocorrências da operação que precisam de atenção.',
    whatItDoes: [
      'Configuração de alertas para ocorrências da operação',
      'Exibição de avisos na tela principal do sistema',
      'Alertas para manutenção e documentos próximos do vencimento',
    ],
    documents: [],
    relatedIntegrations: [],
    confirmed: true,
    cta: 'Conhecer os alertas',
  },
  {
    slug: 'bi',
    title: 'BI',
    category: 'Business Intelligence',
    summary: 'Data Warehouse, visões prontas e personalizadas para explorar dados do negócio.',
    problem: 'Reunir dados em visões claras para apoiar a leitura da operação.',
    whatItDoes: [
      'Visões prontas do sistema',
      'Criação de novas visões',
      'Uso também por empresas que não usam o sistema DataTransp',
    ],
    documents: [],
    relatedIntegrations: [],
    confirmed: true,
    cta: 'Ver o BI em uma demonstração',
  },
];

export const integrations = [
  { slug: 'cobranca-eletronica', title: 'Cobrança Eletrônica' },
  { slug: 'pagamento-eletronico', title: 'Pagamento Eletrônico' },
  { slug: 'conciliacao-bancaria', title: 'Conciliação Bancária' },
  { slug: 'edi', title: 'EDI' },
  { slug: 'contabil', title: 'Contábil' },
  { slug: 'sped', title: 'SPED' },
  { slug: 'abastecidas', title: 'Abastecidas' },
  { slug: 'seguradoras', title: 'Seguradoras' },
  { slug: 'ciot', title: 'CIOT' },
];



export const newsItems: Array<{
  slug: string;
  title: string;
  type: string;
  module: string;
  version?: string;
  date: string;
  summary: string;
  content: string;
}> = [];

export const activityFilters = ['Atualização', 'Novo recurso', 'Adequação fiscal', 'Em breve'];

export const meta = {
  rssTitle: 'DataTransp Novidades',
  rssDescription: 'Atualizações, novos recursos e adequações fiscais do sistema DataTransp.',
};
