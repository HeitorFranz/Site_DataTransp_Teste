/*
 * Explicação curta de cada item de "o que faz" dos módulos (src/data/empresa.ts).
 * Regra: só reescrever em palavras simples o que já está confirmado no cadastro do módulo.
 * Não acrescentar recurso novo aqui sem confirmação da DataTransp.
 * A ordem dos itens segue a ordem de `whatItDoes` de cada módulo.
 */

export const explicacoes: Record<string, string[]> = {
  fiscal: [
    'Os documentos fiscais do transporte são emitidos e recebidos no próprio sistema, sem trocar de programa.',
    'Os documentos entram no sistema sem precisar digitar tudo de novo.',
    'As informações fiscais seguem para o SPED pela integração.',
  ],
  financeiro: [
    'Contas e movimentações da transportadora organizadas em um só lugar.',
    'O faturamento é feito dentro do sistema, junto com o resto da rotina.',
    'Os dados seguem para a contabilidade pela integração.',
  ],
  manutencao: [
    'Cada manutenção da frota fica registrada no sistema.',
    'Consulte o que já foi feito em cada veículo, sem procurar em planilhas.',
  ],
  pneus: [
    'Os pneus da frota são controlados dentro do sistema.',
    'O histórico fica guardado e pode ser consultado quando precisar.',
  ],
  combustiveis: [
    'Veja quanto a frota consome, na média e no total, separado por combustível e Arla.',
    'Quem tem bomba própria acompanha o estoque de combustível e Arla no sistema.',
  ],
  alertas: [
    'Você escolhe quais ocorrências da operação devem gerar um aviso.',
    'Os avisos ficam em destaque na tela principal do sistema.',
    'O sistema avisa quando uma manutenção ou um documento está perto do vencimento.',
  ],
  bi: [
    'Visões já montadas para acompanhar os dados do negócio.',
    'Monte novas visões com as informações que importam para você.',
    'O BI também pode ser usado por empresas que não usam o sistema DataTransp.',
  ],
};
