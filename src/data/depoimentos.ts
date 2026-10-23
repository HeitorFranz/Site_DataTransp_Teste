/*
 * Depoimentos de clientes exibidos na home e na página Clientes.
 *
 * COMO EDITAR
 * - Para adicionar um depoimento, copie um bloco { ... } e troque os campos.
 * - Para tirar um depoimento, apague o bloco inteiro.
 * - A ordem da lista é a ordem em que aparecem.
 * - logo: arquivo dentro de public/clientes/ (de preferência .webp ou .png sem fundo).
 *   Deixe sem `logo` quando a empresa não autorizou o uso; aparecem as iniciais.
 * - nome e cargo: preencha só para quem autorizou ser identificado.
 * - cor: a cor principal da marca (usada no destaque do card).
 * - nota: a resposta de "Satisfação geral" na pesquisa.
 *
 * Fonte: pesquisa de satisfação de outubro de 2026 (planilha "Depoimentos DataTransp").
 * Ficaram de fora quem não autorizou publicar (Agrotrans, Transportes DR), quem pediu
 * anonimato (Bizari) e quem não escreveu depoimento (Transnorato).
 */

export type Nota = 'Excelente' | 'Muito boa' | 'Boa' | 'Regular';

export interface Depoimento {
  empresa: string;
  texto: string;
  cor: string;
  nota: Nota;
  clienteHa: string;
  logo?: string;
  logoExtra?: string;
  nome?: string;
  cargo?: string;
}

export const depoimentos: Depoimento[] = [
  {
    empresa: 'Transportes Constanci e Betanin',
    nome: 'Caroline Constanci Bettanin',
    cargo: 'Diretora Financeira',
    logo: '/clientes/tr-constanci.webp',
    logoExtra: '/clientes/tr-betanin.webp',
    cor: '#1f45b5',
    nota: 'Muito boa',
    clienteHa: 'mais de 3 anos',
    texto:
      'A implantação do sistema foi de extrema importância para a gestão da empresa, contribuiu para a integração das informações, facilitou a tomada de decisões e permitiu o acompanhamento dos resultados de forma eficiente e ágil. Hoje conhecemos cada número dela e conseguimos controlar cada entrada e saída com extrema exatidão.',
  },
  {
    empresa: 'Transportes Tombini',
    cargo: 'Sócio Diretor',
    logo: '/clientes/transportes-tombini.webp',
    cor: '#393a8c',
    nota: 'Muito boa',
    clienteHa: 'mais de 3 anos',
    texto:
      'O Datatransp é uma ferramenta de gestão muito importante. Chegamos a começar uma conversão para outro sistema, mas achamos que talvez tudo que precisássemos nós já tínhamos e o sistema nos fornece um resultado muito correto em números. Hoje os sistemas têm muito gráfico, muita firula, mas não entregam um resultado com precisão.',
  },
  {
    empresa: 'Mac Express Transporte de Cargas',
    logo: '/clientes/mac-express.webp',
    cor: '#1d1d1f',
    nota: 'Excelente',
    clienteHa: 'mais de 3 anos',
    texto: 'O DataTransp é um sistema muito utilizado pela nossa empresa e bem fácil de operar. Super indico para quem nos pergunta sobre esse sistema.',
  },
  {
    empresa: 'VS Operador Logístico',
    nome: 'Jefferson',
    cargo: 'TI',
    logo: '/clientes/vs-operador-logistico.webp',
    cor: '#a72b2f',
    nota: 'Muito boa',
    clienteHa: 'mais de 3 anos',
    texto: 'Você tem um rápido retorno quando precisa de suporte.',
  },
  {
    empresa: 'Larifo Transportes',
    logo: '/clientes/larifo-transportes.webp',
    cor: '#1b8fd8',
    nota: 'Muito boa',
    clienteHa: 'mais de 3 anos',
    texto:
      'O DataTransp contribui para uma gestão mais organizada, ágil e eficiente, facilitando o acompanhamento das operações, o controle das informações e a tomada de decisões.',
  },
  {
    empresa: 'Fama Transportes',
    logo: '/clientes/fama-transportes.webp',
    cor: '#0d3a80',
    nota: 'Muito boa',
    clienteHa: 'mais de 3 anos',
    texto:
      'O sistema facilita muito a análise de dados, integração com a contabilidade, e registros históricos de toda a frota, não necessitando de várias planilhas por fora.',
  },
  {
    empresa: 'VT Transportes e Logística',
    logo: '/clientes/vt-transportes.webp',
    cor: '#3c9a2d',
    nota: 'Muito boa',
    clienteHa: 'mais de 3 anos',
    texto:
      'O DataTransp é uma ferramenta importante para a gestão de uma transportadora, pois permite centralizar informações operacionais, fiscais e financeiras em um único sistema, proporcionando maior organização, controle e agilidade nos processos.',
  },
  {
    empresa: 'Coperaguas Cooperativa Agroindustrial',
    cargo: 'Coordenador de transporte',
    logo: '/clientes/coperaguas.webp',
    cor: '#23746a',
    nota: 'Boa',
    clienteHa: 'mais de 3 anos',
    texto: 'Sistema de fácil manuseio, informações claras.',
  },
  {
    empresa: 'Transportes Froner',
    cor: '#102746',
    nota: 'Muito boa',
    clienteHa: 'mais de 3 anos',
    texto:
      'Nós utilizamos o DataTransp e atualmente ele supre as nossas necessidades. É um sistema prático, seguro e que facilita muito o dia a dia da transportadora. Otimizou nossa gestão e nos deu muito mais controle. Recomendo.',
  },
  {
    empresa: 'Agrotop Transportes',
    cor: '#5a7d1f',
    nota: 'Excelente',
    clienteHa: '1 a 3 anos',
    texto: 'Facilitou o fechamento mensal e agilizou muito para gerar o CT-e e o MDF-e.',
  },
  {
    empresa: 'Transportes Joana',
    cor: '#102746',
    nota: 'Muito boa',
    clienteHa: 'mais de 3 anos',
    texto: 'Sistema bom de trabalhar.',
  },
];

