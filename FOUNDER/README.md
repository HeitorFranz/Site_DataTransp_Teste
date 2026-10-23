# Founder — sistema de análise empresarial

Este conjunto oferece 11 comandos de análise estratégica para uso com Claude Code no repositório. Ele não altera o site nem representa pesquisa de mercado automática por si só.

## Compatibilidade
Os comandos ficam em `.claude/commands/` e são destinados ao Claude Code. Após atualizar/abrir o projeto no Claude Code, use `/founder-board`, `/founder-competitors`, `/founder-consumer`, `/founder-pricing`, `/founder-offer`, `/founder-cfo`, `/founder-marketing`, `/founder-brand`, `/founder-ops`, `/founder-launch` e `/founder-plan`. Se não aparecerem, confirme que a raiz aberta é a raiz do repositório e reinicie a sessão.

## Ordem recomendada
1. `/founder-board`
2. `/founder-competitors` e `/founder-consumer`
3. `/founder-pricing` e `/founder-offer`
4. `/founder-brand`, `/founder-marketing` e `/founder-ops`
5. `/founder-cfo`
6. `/founder-launch`
7. `/founder-plan`

## Contexto DataTransp
O contexto padrão é o site institucional que apresenta o ERP DataTransp a transportadoras e frotistas e busca gerar contatos qualificados e pedidos de demonstração. Consulte sempre `PRODUCT.md` e `README.md` para limites e fatos já confirmados. Preserve marca, conteúdo, rotas, formulários, consentimento, destinos de contato e comportamento existente. A análise Founder não autoriza mudanças no site.

## Evidência e integridade
- Classifique cada afirmação como fato documentado, fonte pública, dado fornecido, estimativa, hipótese ou lacuna.
- Para fontes externas, inclua URL e data de acesso; nunca invente links, preços, depoimentos ou reclamações.
- Personas geradas por IA são simulações, não entrevistas nem compradores reais.
- Projeções financeiras exigem premissas explícitas, fórmulas e cenários.
- O veredicto do plano deve ser Lucrativa, Ainda não ou Incompleto, com justificativa.
- Pergunte antes de sobrescrever arquivos ou executar ações externas.
- Não faça deploy, publique mensagens, altere dados de produção ou exponha segredos.

## Arquivos de trabalho
Com autorização do usuário, os resultados podem ser registrados em `FOUNDER/workspace/` (por exemplo, `competitors.md`, `consumer.md`, `pricing.md`, `offer.md`, `cfo.md`, `marketing.md`, `brand.md`, `ops.md`, `launch.md`, `business-plan.md`). Não crie resultados fictícios para etapas não executadas. Revise arquivos existentes antes de substituir.

## Limites
A qualidade depende dos dados fornecidos, do acesso a fontes públicas e das capacidades da ferramenta. Estes comandos não substituem pesquisa de campo, contabilidade, consultoria jurídica, validação comercial ou decisão humana.