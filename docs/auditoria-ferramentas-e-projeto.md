# Auditoria de ferramentas e do site DataTransp

Data: 23/10/2026. Projeto: `DataTransp_Project/site` (Astro 7 + ilhas React 19, CSS próprio, deploy na Vercel).
Nenhum commit, push ou deploy foi feito nesta auditoria.

## A. Resumo

- O site já estava em bom estado técnico: build e `astro check` sem erros, nenhum link interno quebrado
  (870 links em 27 páginas), todas as páginas com `<title>` único e `meta description`.
- A página inicial tinha 2 falhas de acessibilidade (Lighthouse 92) e cerca de 385 KB de imagens
  maiores que o necessário. Os dois problemas foram corrigidos: a inicial agora tem 100 em
  acessibilidade, boas práticas, SEO e navegação por agentes, e o desperdício de imagem caiu para cerca de 66 KB.
- Logo do cabeçalho/rodapé: 344 KB (PNG 2169 px) → 11 KB (WebP 400 px, com versão 800 px para telas de alta densidade).
- Ícone da aba: 438 KB → 2 KB.

## B. Inventário (estado verificado)

| Ferramenta | Tipo | Estado verificado | Uso nesta auditoria |
| --- | --- | --- | --- |
| Claude Code 2.1.304 | CLI | funcionando | todo o trabalho |
| chrome-devtools | MCP (usuário) | conectado e testado | Lighthouse, trace de desempenho, console, testes de interação |
| context7 | MCP (usuário) | conectado e testado | documentação do GSAP SplitText (opção `aria`) |
| Playwright | MCP (usuário) | conectado; ferramentas só aparecem numa sessão nova | não usado (chrome-devtools cobriu os testes) |
| shadcn | MCP (projeto, `.mcp.json`) | conectado; chave definida | não usado: o site não usa Tailwind/shadcn (decisão do dono: CSS próprio) |
| Magic (21st.dev) | MCP (projeto, `.mcp.json`) | conectado; chave definida | não usado: gera componentes em Tailwind, incompatível com o CSS do projeto |
| PostHog | MCP (usuário) | adicionado, **falta login** | não usado |
| claude-mem | plugin + MCP | conectado | memória entre sessões |
| ui-ux-pro-max | plugin (skill) | ativo | paleta e regras de UI (sessão anterior) |
| frontend-design | plugin (skill) | instalado, desativado no projeto | usado na sessão anterior |
| GSAP skills (8) | skills do usuário | disponíveis | referência para animações |
| Ponytail, Claude SEO | plugins | **não instalados** (bloqueados pela segurança; o dono instala com `/plugin`) | — |
| Perplexity, Firecrawl | MCP | **não configurados** (precisam de chave do dono) | — |
| Composio | CLI/MCP | **não configurado** (precisa de conta) | — |
| Graphify | ferramenta | baixado em `C:\Users\Heito\Downloads\graphify`, **não compilado** | só analisa código na linguagem V; não serve para este site |
| Compilador V | ferramenta | baixado em `C:\Users\Heito\v`; build com gcc 15 falhou; build com tcc interrompido pelo dono | — |
| Hooks do projeto | `.claude/settings.json` | ativos | protege `.env*`/lockfile, `astro check` a cada edição, build no fim de cada turno |
| Subagente `visual-qa` | `.claude/agents` | disponível | não usado nesta rodada |

Dependências do site (`package.json`): astro, @astrojs/react, @astrojs/rss, react, react-dom, gsap, lenis,
framer-motion (menu animado), nodemailer (formulário de contato). `npm install` relatou 0 vulnerabilidades.

## C. Ferramentas escolhidas e por quê

- **chrome-devtools (Lighthouse + trace)**: mede de verdade acessibilidade, SEO e desempenho no celular;
  foi ele que encontrou os dois erros de acessibilidade e o peso do logo.
- **context7**: confirmou na documentação oficial do GSAP que `aria: 'none'` resolve o ARIA inválido do SplitText.
- **sharp** (já vinha com o Astro): gerou as versões leves do logo, do ícone e da foto, e lê o tamanho real dos logos dos clientes no build.

## D. Ferramentas não usadas

- **shadcn e Magic**: produzem componentes Tailwind; o projeto usa CSS próprio por decisão do dono. Adotar exigiria trocar o sistema de estilos.
- **PostHog**: analytics exige aviso de cookies/LGPD e conta configurada; decisão do dono.
- **Firecrawl, Perplexity, Composio**: sem chave/conta; não há tarefa do site que dependa deles agora.
- **Graphify**: só lê código V.

## E. Problemas encontrados

| # | Problema | Onde | Estado |
| --- | --- | --- | --- |
| 1 | `aria-label` proibido em `<span>`/`<p>` (criado pelo SplitText) | topo da inicial | corrigido |
| 2 | Contraste 3,47:1 no botão verde do WhatsApp (mínimo 4,5:1) | treinamento | corrigido (novo verde `#15803d`, 5,0:1) |
| 3 | Logo PNG de 344 KB exibido com 134–200 px | todas as páginas | corrigido |
| 4 | Ícone da aba de 438 KB, não quadrado | todas as páginas | corrigido (48 px + ícone de 180 px para celular) |
| 5 | Foto do executivo de 900 px servida também para celular | inicial | corrigido (versão 450 px via `srcset`) |
| 6 | 17 imagens sem largura/altura (logos dos clientes) | inicial | corrigido (tamanho lido no build) |
| 7 | Fonte Archivo baixava eixos de itálico e largura que nenhum CSS usa | todas as páginas | corrigido (só eixo de peso) |
| 8 | `sharp` usado no código sem estar no `package.json` | build | corrigido (devDependency) |
| 9 | CSS e Google Fonts bloqueiam a primeira pintura (~0,5 s estimado no preview local, sem compressão) | todas | pendente: na Vercel o CSS vai comprimido e em cache; avaliar fontes locais (self-host) |
| 10 | `og:image` usa o logo PNG grande (não é imagem 1200×630) | SEO social | pendente: precisa de uma arte de compartilhamento aprovada pelo dono |

## F. Alterações

- `src/components/Brand.astro`: logo em WebP com `srcset` (400/800 px).
- `src/pages/funcionalidades/[slug].astro`: logo do painel em WebP 800 px.
- `src/layouts/SiteLayout.astro`: novo ícone da aba + `apple-touch-icon`; URL das fontes só com o eixo de peso.
- `src/components/home/JoinSection.astro`: `srcset` da foto do executivo.
- `src/components/home/ClientsSection.astro`: largura/altura reais nos logos.
- `src/scripts/home-motion.ts`: SplitText com `aria: 'none'`.
- `src/styles/home.css`: verde do WhatsApp com contraste AA.
- `package.json`/`package-lock.json`: `sharp` como devDependency.
- Novos arquivos: `public/brand/datatransp-logo-400.webp`, `datatransp-logo-800.webp`, `favicon-48.png`,
  `apple-touch-icon.png`, `public/images/home/executivo-450.webp`.
- Os PNGs originais continuam em `public/brand/` (o logo PNG ainda é usado no `og:image` e nos dados estruturados).

## G. Testes (resultados reais)

| Teste | Antes | Depois |
| --- | --- | --- |
| `npm run build` | ok, 27 páginas | ok, 27 páginas |
| `npm run typecheck` | 0 erros | 0 erros |
| Lighthouse celular — inicial | A11y 92, BP 100, SEO 100, Agentes 50 | **100 / 100 / 100 / 100** |
| Lighthouse celular — /contato, /clientes, /funcionalidades | 100 em todas | não alterado |
| Trace celular (4× CPU, 4G) — inicial | LCP 738 ms, CLS 0,01, 385 KB de imagem a mais | LCP 702 ms, CLS 0,01, 66 KB |
| Links internos (27 páginas) | 0 quebrados | — |
| Celular 390 px | — | sem rolagem lateral; logo nítido |
| Setas dos depoimentos | — | "1–3 de 11" → "2–4 de 11"; seta anterior desativada no início |
| `prefers-reduced-motion` | — | caminhão parado, texto do topo visível, nenhum texto invisível |
| Console | 1 aviso (imagens sem tamanho) | sem erros nem avisos |

Não testado: envio real do formulário (não se envia formulário de verdade em teste) e o site publicado na Vercel
(as mudanças ainda não foram publicadas).

## H. Pendências que dependem do dono

1. Fazer login no PostHog (`/mcp` num terminal `claude`), se quiser analytics.
2. Instalar Ponytail e Claude SEO com `/plugin marketplace add` + `/plugin install`.
3. Chaves de Perplexity e Firecrawl, se for usar.
4. Decidir se continua a instalação do compilador V (só serve para o Graphify).
5. Autorizar commit, push e deploy.

## I. Próximos passos sugeridos

1. Publicar e rodar o Lighthouse no endereço da Vercel para medir com compressão real.
2. Criar uma imagem de compartilhamento 1200×630 para `og:image`.
3. Avaliar hospedar as fontes no próprio site para tirar o Google Fonts do caminho crítico.
4. Rodar `/seo audit` (Claude SEO) depois de instalado.
