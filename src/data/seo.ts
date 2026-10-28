/*
 * Títulos, descrições e H1 das páginas de módulo, com os termos que o cliente busca no Google.
 * Só usam o que o módulo faz de fato (resumo em empresa.ts); nada de recurso a confirmar.
 */
export const seoModulos: Record<string, { title: string; description: string; h1: string }> = {
  fiscal: {
    title: 'Emissor de NF-e, CT-e e MDF-e para transportadoras | DataTransp',
    description: 'Módulo Fiscal do DataTransp: emissão e recepção de NF-e, CT-e, MDF-e e NFS-e, com importação automática e integração com o SPED. Agende uma demonstração.',
    h1: 'Emissão de NF-e, CT-e, MDF-e e NFS-e',
  },
  financeiro: {
    title: 'Sistema financeiro para transportadoras | DataTransp',
    description: 'Gestão financeira e faturamento da transportadora integrados à contabilidade, no mesmo sistema da emissão fiscal e da frota. Agende uma demonstração.',
    h1: 'Gestão financeira e faturamento da transportadora',
  },
  manutencao: {
    title: 'Controle de manutenção de frota | DataTransp',
    description: 'Controle de manutenção e histórico de toda a frota no DataTransp, sem planilhas por fora. Sistema para transportadoras e frotistas.',
    h1: 'Controle de manutenção da frota',
  },
  pneus: {
    title: 'Controle de pneus para frotas de caminhão | DataTransp',
    description: 'Controle de pneus e histórico de toda a frota no DataTransp, sem planilhas por fora. Sistema para transportadoras e frotistas.',
    h1: 'Controle de pneus da frota',
  },
  combustiveis: {
    title: 'Controle de combustível e Arla para frotas | DataTransp',
    description: 'Acompanhe o consumo de combustível e Arla da frota. Quem tem bomba própria também controla o estoque no DataTransp.',
    h1: 'Controle de combustível e Arla',
  },
  alertas: {
    title: 'Alertas de manutenção e vencimentos da frota | DataTransp',
    description: 'Avisos configuráveis na tela principal do DataTransp para manutenções e documentos perto do vencimento. Sistema para transportadoras.',
    h1: 'Alertas de manutenção e documentos',
  },
  bi: {
    title: 'BI para transportadoras: indicadores e relatórios | DataTransp',
    description: 'BI do DataTransp com visões prontas e personalizadas para acompanhar os números da transportadora e da frota. Agende uma demonstração.',
    h1: 'BI para transportadoras',
  },
};
