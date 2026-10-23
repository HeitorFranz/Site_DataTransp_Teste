/*
 * O que é cada tipo de integração, em linguagem simples (conceito geral do mercado de transporte).
 * Escopo, parceiros e requisitos de cada integração no DataTransp NÃO são descritos aqui:
 * as páginas pedem para confirmar com a equipe, como antes.
 * `modulo` aponta para o módulo do site com o mesmo assunto.
 */

export interface IntegracaoDetalhe {
  oQueE: string;
  paraQue: string[];
  modulo: string;
  /** com quem o DataTransp troca informação nesta integração (só para a ilustração) */
  parceiro: string;
  icone: 'financeiro' | 'fiscal' | 'combustiveis' | 'shield';
}

export const integracoesDetalhes: Record<string, IntegracaoDetalhe> = {
  'cobranca-eletronica': {
    parceiro: 'Banco',
    oQueE: 'Troca de informações de boletos com o banco de forma eletrônica, por arquivo ou conexão direta.',
    paraQue: ['Registrar boletos no banco sem digitar um por um', 'Saber quais boletos já foram pagos', 'Menos trabalho manual no contas a receber'],
    modulo: 'financeiro',
    icone: 'financeiro',
  },
  'pagamento-eletronico': {
    parceiro: 'Banco',
    oQueE: 'Envio de pagamentos para o banco em lote, a partir das contas lançadas no sistema.',
    paraQue: ['Pagar fornecedores sem lançar tudo de novo no banco', 'Receber o retorno de cada pagamento', 'Mais controle no contas a pagar'],
    modulo: 'financeiro',
    icone: 'financeiro',
  },
  'conciliacao-bancaria': {
    parceiro: 'Banco',
    oQueE: 'Comparação entre o extrato do banco e os lançamentos feitos no financeiro.',
    paraQue: ['Encontrar diferenças entre banco e sistema', 'Fechar o caixa com mais segurança', 'Menos conferência na mão'],
    modulo: 'financeiro',
    icone: 'financeiro',
  },
  edi: {
    parceiro: 'Cliente / embarcador',
    oQueE: 'Troca de arquivos em formato padrão com clientes e embarcadores, como notas, conhecimentos, ocorrências e faturas.',
    paraQue: ['Receber dados do cliente sem digitação', 'Devolver informações no formato que o cliente pede', 'Menos erro na troca de documentos'],
    modulo: 'fiscal',
    icone: 'fiscal',
  },
  contabil: {
    parceiro: 'Contabilidade',
    oQueE: 'Envio das informações do sistema para o escritório de contabilidade.',
    paraQue: ['Evitar redigitação na contabilidade', 'Fechamento contábil com os mesmos dados do sistema', 'Menos troca de planilhas por e-mail'],
    modulo: 'financeiro',
    icone: 'financeiro',
  },
  sped: {
    parceiro: 'Fisco (SPED)',
    oQueE: 'O SPED (Sistema Público de Escrituração Digital) reúne as obrigações fiscais que a empresa entrega ao governo em arquivo digital.',
    paraQue: ['Gerar as informações fiscais a partir do que já está no sistema', 'Menos retrabalho na entrega das obrigações', 'Dados fiscais consistentes'],
    modulo: 'fiscal',
    icone: 'fiscal',
  },
  abastecidas: {
    parceiro: 'Abastecimentos',
    oQueE: 'Importação dos abastecimentos feitos pela frota para dentro do controle de consumo.',
    paraQue: ['Juntar os abastecimentos no mesmo lugar', 'Acompanhar o consumo de cada veículo', 'Menos lançamento manual de notas de combustível'],
    modulo: 'combustiveis',
    icone: 'combustiveis',
  },
  seguradoras: {
    parceiro: 'Seguradora',
    oQueE: 'Comunicação com as seguradoras de carga, usada na averbação das cargas transportadas.',
    paraQue: ['Averbar as cargas sem entrar no site da seguradora', 'Manter o seguro da carga em dia', 'Menos risco de esquecer uma averbação'],
    modulo: 'fiscal',
    icone: 'shield',
  },
  ciot: {
    parceiro: 'ANTT',
    oQueE: 'O CIOT (Código Identificador da Operação de Transporte) é exigido pela ANTT em contratações de frete com transportador autônomo.',
    paraQue: ['Gerar o código junto com a operação de transporte', 'Cumprir a exigência da ANTT', 'Menos etapas fora do sistema'],
    modulo: 'fiscal',
    icone: 'fiscal',
  },
};
