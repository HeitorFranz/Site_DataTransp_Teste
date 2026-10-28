/*
 * DATA: assistente virtual do site. Respostas prontas, sem IA e sem servidor.
 * Tudo o que o DATA diz vem dos dados do site (empresa.ts e integracoes-detalhes.ts).
 * Pergunta que ele não reconhece vai para o WhatsApp da equipe.
 */
import { company, modules, integrations } from '../data/empresa';
import { integracoesDetalhes } from '../data/integracoes-detalhes';

export interface Acao { label: string; href?: string; reply?: string }
/** dados que a pessoa deixa para a equipe chamar */
export interface Lead { nome: string; empresa: string; telefone: string; assunto: string }
export interface Resposta { textos: string[]; acoes?: Acao[] }

type Passo = 'nome' | 'empresa' | 'telefone' | 'assunto' | 'confirmar';
export interface Contexto {
  nome?: string;
  /** perguntas feitas no chat, para a equipe saber o que a pessoa quer */
  historico: string[];
  fluxo?: { passo: Passo; lead: Partial<Lead> };
}

const so = (n: string) => n.replace(/\D/g, '');
const wa = (msg = 'Olá! Vim pelo site e quero falar com a equipe.') =>
  `https://wa.me/55${so(company.whatsapp)}?text=${encodeURIComponent(msg)}`;

export const acoes = {
  whatsapp: { label: 'Chamar no WhatsApp', href: wa() } as Acao,
  demo: { label: 'Agendar demonstração', href: '/contato#agendar-demonstracao' } as Acao,
  ligar: { label: `Ligar ${company.phone}`, href: `tel:+55${so(company.phone)}` } as Acao,
  instagram: { label: 'Instagram', href: company.instagram } as Acao,
  facebook: { label: 'Facebook', href: company.facebook } as Acao,
};

export const sugestoesIniciais: Acao[] = [
  { label: 'O que o sistema faz?', reply: 'O que o sistema faz?' },
  { label: 'Quanto custa?', reply: 'Quanto custa?' },
  { label: 'Quero uma demonstração', reply: 'Quero uma demonstração' },
  { label: 'Quero que me chamem', reply: 'Quero que a equipe me chame' },
];

/** botão que começa o cadastro para a equipe retornar */
export const pedirRetorno: Acao = { label: 'Quero que me chamem', reply: 'Quero que a equipe me chame' };

const pick = <T,>(lista: T[]) => lista[Math.floor(Math.random() * lista.length)];

/** sem acento, minúsculo, só letras e números */
export const normalizar = (t: string) =>
  t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();

/** horário de Brasília: seg a sex, 8h às 18h */
export function abertoAgora(d = new Date()) {
  const p = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', hourCycle: 'h23' }).formatToParts(d);
  const dia = p.find((x) => x.type === 'weekday')?.value ?? '';
  const hora = Number(p.find((x) => x.type === 'hour')?.value ?? 0);
  return !['Sat', 'Sun'].includes(dia) && hora >= 8 && hora < 18;
}

const horarioTexto = () =>
  abertoAgora()
    ? 'A equipe está on-line agora.'
    : 'Fora do horário agora: respondemos no próximo dia útil.';

const modulo = (slug: string) => modules.find((m) => m.slug === slug)!;
const respModulo = (slug: string): Resposta => {
  const m = modulo(slug);
  return {
    textos: [`${m.title}: ${m.summary}`],
    acoes: [{ label: `Ver ${m.title}`, href: `/funcionalidades/${m.slug}` }, acoes.demo],
  };
};
const respIntegracao = (slug: string): Resposta => {
  const i = integrations.find((x) => x.slug === slug)!;
  const d = integracoesDetalhes[slug];
  return {
    textos: [`${i.title}: ${d?.oQueE ?? 'é uma das integrações do DataTransp.'}`],
    acoes: [{ label: `Ver ${i.title}`, href: `/integracoes/${i.slug}` }, acoes.whatsapp],
  };
};

interface Intencao { chaves: string[]; resposta: () => Resposta; peso?: number }

// chaves já normalizadas; frase com espaço vale mais que palavra solta
// a primeira intenção começa o cadastro para a equipe retornar (tratada em responder)
const intencoes: Intencao[] = [
  { chaves: ['quero que a equipe me chame', 'me chame', 'me chamem', 'me liga', 'me ligue', 'me liguem', 'retorno', 'retornem', 'deixar meu contato', 'deixar contato', 'meu numero', 'meu telefone', 'entrem em contato', 'entre em contato comigo'], peso: 3, resposta: () => ({ textos: [] }) },
  { chaves: ['oi', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'e ai', 'opa', 'eae', 'salve', 'hey'], peso: 0.5, resposta: () => ({
    textos: [pick(['Oi! Como posso ajudar?', 'Olá! Em que posso ajudar?'])],
    acoes: sugestoesIniciais,
  }) },
  { chaves: ['obrigado', 'obrigada', 'valeu', 'vlw', 'agradeco', 'brigado', 'show', 'perfeito', 'otimo'], resposta: () => ({
    textos: [pick(['Por nada! Precisando, é só chamar.', 'Disponha!'])],
    acoes: [acoes.whatsapp],
  }) },
  { chaves: ['tchau', 'ate mais', 'ate logo', 'falou', 'flw', 'adeus'], resposta: () => ({
    textos: ['Até mais! Boa estrada.'],
  }) },
  { chaves: ['quem e voce', 'quem e vc', 'seu nome', 'voce e robo', 'e robo', 'e um robo', 'e humano', 'e gente', 'voce e real'], resposta: () => ({
    textos: ['Sou o DATA, do atendimento da DataTransp. Tiro dúvidas sobre o sistema, preços e demonstração.'],
    acoes: sugestoesIniciais,
  }) },
  { chaves: ['preco', 'precos', 'valor', 'valores', 'quanto custa', 'custa', 'mensalidade', 'plano', 'planos', 'orcamento', 'caro', 'barato', 'tabela'], resposta: () => ({
    textos: [
      'A mensalidade é sob medida: empresa + módulos usados + quantidade de veículos.',
      'Após a demonstração gratuita, você recebe a proposta com o valor.',
    ],
    acoes: [acoes.demo, { label: 'Pedir valor no WhatsApp', href: wa('Olá! Quero saber o valor do DataTransp para a minha frota.') }, pedirRetorno],
  }) },
  { chaves: ['demonstracao', 'demo', 'apresentacao', 'testar', 'teste', 'conhecer o sistema', 'ver o sistema', 'ver funcionando', 'agendar', 'reuniao'], resposta: () => ({
    textos: ['A demonstração é gratuita e feita com a rotina da sua transportadora. Agende pelo formulário ou WhatsApp.'],
    acoes: [acoes.demo, { label: 'Agendar pelo WhatsApp', href: wa('Olá! Quero agendar uma demonstração do DataTransp.') }, pedirRetorno],
  }) },
  { chaves: ['whatsapp', 'whats', 'zap', 'wpp', 'falar com alguem', 'falar com uma pessoa', 'pessoa', 'atendente', 'humano', 'vendedor', 'comercial', 'consultor', 'falar com voces', 'contato'], resposta: () => ({
    textos: [`Claro! Fale com a equipe pelo WhatsApp ${company.whatsapp}. ${horarioTexto()}`],
    acoes: [acoes.whatsapp, acoes.ligar, pedirRetorno],
  }) },
  { chaves: ['telefone', 'ligar', 'ligacao', 'numero', 'fone'], resposta: () => ({
    textos: [`Telefone ${company.phone} · WhatsApp ${company.whatsapp}. ${horarioTexto()}`],
    acoes: [acoes.ligar, acoes.whatsapp],
  }) },
  { chaves: ['email', 'e mail'], resposta: () => ({
    textos: [`E-mail comercial: ${company.email}.`],
    acoes: [{ label: 'Mandar e-mail', href: `mailto:${company.email}` }, acoes.whatsapp],
  }) },
  { chaves: ['horario', 'atendimento', 'aberto', 'funciona que horas', 'que horas', 'sabado', 'domingo', 'fim de semana'], resposta: () => ({
    textos: [`Segunda a sexta, das 8h às 18h. ${horarioTexto()}`],
    acoes: [acoes.whatsapp],
  }) },
  { chaves: ['suporte', 'problema', 'erro', 'travou', 'nao funciona', 'ajuda no sistema', 'sou cliente', 'ja sou cliente', 'chamado', 'bug'], resposta: () => ({
    textos: ['Para suporte, fale com a nossa equipe pelo WhatsApp ou telefone.'],
    acoes: [{ label: 'Suporte no WhatsApp', href: wa('Olá! Sou cliente e preciso de suporte.') }, acoes.ligar],
  }) },
  { chaves: ['endereco', 'onde fica', 'onde voces ficam', 'localizacao', 'sede', 'chapeco', 'cidade', 'visitar'], resposta: () => ({
    textos: [`Sede: ${company.headquarters}. Atendemos todo o Brasil on-line.`],
    acoes: [{ label: 'Ver no mapa', href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.headquarters)}` }],
  }) },
  { chaves: ['instagram', 'insta', 'facebook', 'face', 'rede social', 'redes sociais', 'redes', 'seguir'], resposta: () => ({
    textos: ['Segue a gente nas redes:'],
    acoes: [acoes.instagram, acoes.facebook, acoes.whatsapp].filter((a) => a.href),
  }) },
  { chaves: ['empresa', 'historia', 'desde quando', 'quantos anos', 'fundada', 'fundacao', 'quem sao voces', 'sobre voces', 'xaxim', 'confiavel'], resposta: () => ({
    textos: [`Desde ${company.foundation} no transporte: ${company.experienceYears} anos, com sede em Chapecó (SC), atendendo todo o Brasil.`],
    acoes: [{ label: 'Conhecer a empresa', href: '/empresa' }, { label: 'Ver clientes', href: '/clientes' }],
  }) },
  { chaves: ['funcionalidade', 'funcionalidades', 'modulo', 'modulos', 'o que faz', 'o que o sistema faz', 'recursos', 'sistema faz', 'serve para'], resposta: () => ({
    textos: [`Nota fiscal, financeiro e frota num sistema só. Módulos: ${modules.map((m) => m.title).join(', ')}.`],
    acoes: [...modules.slice(0, 4).map((m) => ({ label: m.title, reply: m.title })), { label: 'Ver todos', href: '/funcionalidades' }],
  }) },
  { chaves: ['fiscal', 'nota', 'notas', 'nfe', 'nf e', 'cte', 'ct e', 'mdfe', 'mdf e', 'nfse', 'conhecimento', 'manifesto', 'xml'], resposta: () => respModulo('fiscal') },
  { chaves: ['financeiro', 'faturamento', 'fatura', 'contas a pagar', 'contas a receber', 'caixa', 'financas'], resposta: () => respModulo('financeiro') },
  { chaves: ['manutencao', 'oficina', 'revisao', 'preventiva', 'mecanica', 'troca de oleo'], resposta: () => respModulo('manutencao') },
  { chaves: ['pneu', 'pneus', 'recapagem', 'borracharia'], resposta: () => respModulo('pneus') },
  { chaves: ['combustivel', 'combustiveis', 'diesel', 'arla', 'bomba', 'tanque', 'consumo', 'media de consumo'], resposta: () => respModulo('combustiveis') },
  { chaves: ['alerta', 'alertas', 'aviso', 'avisos', 'vencimento', 'vencido', 'vencer', 'multa', 'documento vencido'], resposta: () => respModulo('alertas') },
  { chaves: ['bi', 'relatorio', 'relatorios', 'indicador', 'indicadores', 'dashboard', 'painel', 'grafico'], resposta: () => respModulo('bi') },
  { chaves: ['integracao', 'integracoes', 'integra', 'conecta'], resposta: () => ({
    textos: [`Integrações: ${integrations.map((i) => i.title).join(', ')}.`],
    acoes: [{ label: 'Ver integrações', href: '/integracoes' }, acoes.whatsapp],
  }) },
  { chaves: ['edi', 'embarcador'], resposta: () => respIntegracao('edi') },
  { chaves: ['ciot'], resposta: () => respIntegracao('ciot') },
  { chaves: ['sped'], resposta: () => respIntegracao('sped') },
  { chaves: ['boleto', 'boletos', 'cobranca'], resposta: () => respIntegracao('cobranca-eletronica') },
  { chaves: ['pagamento', 'pagamentos', 'pagar fornecedor'], resposta: () => respIntegracao('pagamento-eletronico') },
  { chaves: ['conciliacao', 'extrato', 'banco', 'bancos'], resposta: () => respIntegracao('conciliacao-bancaria') },
  { chaves: ['contabil', 'contabilidade', 'contador'], resposta: () => respIntegracao('contabil') },
  { chaves: ['abastecida', 'abastecidas', 'posto', 'abastecimento'], resposta: () => respIntegracao('abastecidas') },
  { chaves: ['seguro', 'seguradora', 'seguradoras', 'averbacao'], resposta: () => respIntegracao('seguradoras') },
  { chaves: ['treinamento', 'treinar', 'aprender', 'dificil', 'facil de usar', 'implantacao', 'implantar', 'comecar'], resposta: () => ({
    textos: ['A implantação inclui treinamento da sua equipe, e o suporte continua com a gente.'],
    acoes: [acoes.demo, acoes.whatsapp],
  }) },
  { chaves: ['migrar', 'migracao', 'trocar de sistema', 'mudar de sistema', 'outro sistema', 'ja tenho sistema', 'meus dados', 'planilha'], resposta: () => ({
    textos: ['A troca de sistema é acompanhada pela nossa equipe de implantação, etapa por etapa.'],
    acoes: [acoes.demo, { label: 'Perguntar no WhatsApp', href: wa('Olá! Já uso outro sistema e quero entender como seria a troca para o DataTransp.') }],
  }) },
  { chaves: ['cliente', 'clientes', 'quem usa', 'depoimento', 'depoimentos', 'referencia'], resposta: () => ({
    textos: ['Veja o que nossos clientes dizem:'],
    acoes: [{ label: 'Ver clientes', href: '/clientes' }],
  }) },
  { chaves: ['aplicativo', 'app', 'celular', 'motorista', 'reforma tributaria', 'ibs', 'cbs', 'rastreador', 'rastreamento', 'gps', 'telemetria'], resposta: () => ({
    textos: ['Boa pergunta! Nossa equipe comercial te explica isso em detalhes.'],
    acoes: [acoes.whatsapp, pedirRetorno],
  }) },
  { chaves: ['vaga', 'vagas', 'emprego', 'trabalhar', 'curriculo', 'trabalhe conosco'], resposta: () => ({
    textos: [`Vagas: envie seu contato para ${company.email}.`],
    acoes: [{ label: 'Mandar e-mail', href: `mailto:${company.email}` }],
  }) },
  { chaves: ['novidade', 'novidades', 'atualizacao', 'atualizacoes', 'versao'], resposta: () => ({
    textos: ['Novidades do sistema:'],
    acoes: [{ label: 'Ver novidades', href: '/novidades' }, acoes.instagram],
  }) },
];

const naoEntendi = (): Resposta => ({
  textos: [
    'Boa pergunta! Vou te encaminhar para a nossa equipe comercial.',
  ],
  acoes: [acoes.whatsapp, pedirRetorno, ...sugestoesIniciais.slice(0, 2)],
});

const ASSUNTOS: Acao[] = [
  { label: 'Demonstração', reply: 'Demonstração' },
  { label: 'Preços', reply: 'Preços' },
  { label: 'Suporte', reply: 'Suporte' },
  { label: 'Outro assunto', reply: 'Outro assunto' },
];
const PULAR_EMPRESA: Acao = { label: 'Prefiro não informar', reply: 'Prefiro não informar' };
const CONFIRMAR: Acao[] = [
  { label: 'Está certo, pode enviar', reply: 'Está certo, pode enviar' },
  { label: 'Quero corrigir', reply: 'Quero corrigir' },
];

/** começa o cadastro: nome, empresa, WhatsApp e assunto, com confirmação no fim */
function iniciarCadastro(ctx: Contexto): Resposta {
  if (ctx.nome) {
    ctx.fluxo = { passo: 'empresa', lead: { nome: ctx.nome } };
    return { textos: [`Claro, ${ctx.nome}! Qual o nome da sua empresa?`], acoes: [PULAR_EMPRESA] };
  }
  ctx.fluxo = { passo: 'nome', lead: {} };
  return { textos: ['Claro! Qual o seu nome?'] };
}

const nomeBonito = (t: string) => {
  const limpo = t.replace(/^(meu nome (é|e)|me chamo|aqui (é|e)|sou (o|a)?)\s+/i, '').trim();
  const partes = limpo.replace(/[^A-Za-zÀ-ÿ' -]/g, '').trim().split(/\s+/).slice(0, 3).filter(Boolean);
  // "joão da silva" -> "João da Silva"
  return partes
    .map((p, i) => (i > 0 && /^(da|de|do|das|dos|e)$/i.test(p) ? p.toLowerCase() : p[0].toUpperCase() + p.slice(1).toLowerCase()))
    .join(' ');
};
const primeiro = (nome?: string) => (nome ?? '').split(' ')[0];

function resumo(l: Partial<Lead>) {
  return `Nome: ${l.nome}\nEmpresa: ${l.empresa || 'não informada'}\nWhatsApp: ${l.telefone}\nAssunto: ${l.assunto}`;
}

function seguirCadastro(entrada: string, ctx: Contexto): Resposta {
  const f = ctx.fluxo!;
  const n = normalizar(entrada);
  if (/^(cancelar|cancela|deixa pra la|desistir|parar|sair)$/.test(n)) {
    ctx.fluxo = undefined;
    return { textos: ['Tudo bem, cancelado.'], acoes: sugestoesIniciais };
  }

  switch (f.passo) {
    case 'nome': {
      const nome = nomeBonito(entrada);
      if (nome.length < 2) return { textos: ['Pode repetir seu nome, por favor?'] };
      f.lead.nome = ctx.nome = nome;
      f.passo = 'empresa';
      return { textos: [`Prazer, ${primeiro(nome)}! Qual o nome da sua empresa?`], acoes: [PULAR_EMPRESA] };
    }
    case 'empresa': {
      f.lead.empresa = /prefiro nao|nao informar|nao tenho|sem empresa|pular/.test(n) ? '' : entrada.trim().slice(0, 160);
      f.passo = 'telefone';
      return { textos: ['Qual o seu WhatsApp, com DDD?'] };
    }
    case 'telefone': {
      const dig = so(entrada).replace(/^55(?=\d{10,11}$)/, '');
      if (dig.length < 10 || dig.length > 11) {
        return { textos: ['Confere o número, por favor? Ex.: (49) 99999-9999'] };
      }
      f.lead.telefone = dig.length === 11
        ? `(${dig.slice(0, 2)}) ${dig.slice(2, 7)}-${dig.slice(7)}`
        : `(${dig.slice(0, 2)}) ${dig.slice(2, 6)}-${dig.slice(6)}`;
      f.passo = 'assunto';
      return { textos: ['Obrigado! Qual o assunto?'], acoes: ASSUNTOS };
    }
    case 'assunto': {
      if (n === 'outro assunto') return { textos: ['Me conta em poucas palavras.'] };
      f.lead.assunto = entrada.trim().slice(0, 240);
      f.passo = 'confirmar';
      return {
        textos: ['Confere seus dados:', resumo(f.lead)],
        acoes: [...CONFIRMAR, { label: 'Política de Privacidade', href: '/politica-de-privacidade' }],
      };
    }
    case 'confirmar': {
      if (/pode enviar|^(sim|ok|certo|esta certo|confirmo|isso|pode|envia|enviar)\b/.test(n)) {
        ctx.fluxo = undefined;
        return mensagemPronta(f.lead as Lead, ctx);
      }
      if (/corrig|errad|mudar|alterar|^nao/.test(n)) {
        ctx.fluxo = { passo: 'nome', lead: {} };
        ctx.nome = undefined;
        return { textos: ['Sem problema. Qual o seu nome?'] };
      }
      return { textos: ['Posso enviar?'], acoes: CONFIRMAR };
    }
  }
}

/**
 * Mensagem para o WhatsApp da equipe, já escrita com os dados e o que a pessoa perguntou no chat.
 * Quem envia é a própria pessoa (o site não manda WhatsApp sozinho).
 */
export function textoDoPedido(l: Lead, ctx: Contexto) {
  const perguntas = ctx.historico.filter(Boolean).slice(-6);
  return [
    'Olá! Vim pelo chat do site da DataTransp.',
    '',
    `Nome: ${l.nome}`,
    `Empresa: ${l.empresa || 'não informada'}`,
    `WhatsApp: ${l.telefone}`,
    `Assunto: ${l.assunto}`,
    ...(perguntas.length ? ['', 'O que perguntei no chat:', ...perguntas.map((p) => `- ${p}`)] : []),
  ].join('\n');
}

function mensagemPronta(l: Lead, ctx: Contexto): Resposta {
  return {
    textos: [
      `Pronto, ${primeiro(l.nome)}! Toque abaixo para enviar sua mensagem no WhatsApp da nossa equipe.`,
    ],
    acoes: [{ label: 'Enviar no WhatsApp', href: wa(textoDoPedido(l, ctx)) }, ...sugestoesIniciais.slice(0, 2)],
  };
}

export function responder(pergunta: string, contexto: Contexto): Resposta {
  if (contexto.fluxo) return seguirCadastro(pergunta, contexto);
  contexto.historico.push(pergunta.trim().slice(0, 200));
  const texto = ` ${normalizar(pergunta)} `;
  if (!texto.trim()) return naoEntendi();

  // "meu nome é Ana" / "me chamo Ana"
  const nome = pergunta.match(/(?:meu nome (?:é|e)|me chamo)\s+([A-Za-zÀ-ÿ]{2,20})/i)?.[1];
  if (nome) {
    contexto.nome = nome[0].toUpperCase() + nome.slice(1).toLowerCase();
    return { textos: [`Prazer, ${contexto.nome}! Em que posso te ajudar?`], acoes: sugestoesIniciais };
  }

  let melhor: Intencao | undefined;
  let nota = 0;
  for (const it of intencoes) {
    let n = 0;
    for (const c of it.chaves) if (texto.includes(` ${c} `)) n += c.includes(' ') ? 2 : 1;
    n *= it.peso ?? 1;
    if (n > nota) { nota = n; melhor = it; }
  }
  if (melhor === intencoes[0]) {
    contexto.historico.pop(); // "me chamem" não diz nada à equipe
    return iniciarCadastro(contexto);
  }
  return melhor ? melhor.resposta() : naoEntendi();
}

export function saudacaoInicial(): Resposta {
  return {
    textos: [pick(['Oi! Sou o DATA, da DataTransp. Como posso ajudar?', 'Olá! Aqui é o DATA, da DataTransp. Em que posso ajudar?'])],
    acoes: sugestoesIniciais,
  };
}
