// PostToolUse hook: after Claude edits site source in src/, look for copy the owner
// does not allow (CLAUDE.md "Content rules"): "ERP", client/staff/state counts,
// team size, and robot/AI wording. Comments and the chat's keyword lists are skipped.
// Exit code 2 sends stderr back to Claude so it rewrites the text.
import { readFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

let raw = '';
for await (const chunk of process.stdin) raw += chunk;

const input = JSON.parse(raw || '{}');
const filePath = input.tool_input?.file_path ?? '';
if (!/\.(astro|ts|tsx|md|mdx)$/.test(filePath)) process.exit(0);

const siteDir = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const target = relative(siteDir, resolve(filePath)).replaceAll('\\', '/');
if (!target.startsWith('src/')) process.exit(0);

const rules = [
  { re: /\bERP\b/, why: 'chame o produto só de "DataTransp", nunca "ERP"' },
  { re: /\b\d[\d.]*\s*(\+\s*)?(clientes|transportadoras atendidas|empresas atendidas)\b/i, why: 'não mostre quantidade de clientes' },
  { re: /\b\d+\s*(colaboradores|funcion[áa]rios|pessoas na equipe)\b/i, why: 'não mostre tamanho da equipe' },
  { re: /\b\d+\s+estados\b|\bestados\s*\+\s*DF\b/i, why: 'não liste estados; diga "em todo o Brasil"' },
  { re: /teamSize/, why: 'não use company.teamSize no site', skip: (t) => t === 'src/data/empresa.ts' },
  // (?![a-z]) em vez de \b: \b não funciona depois de "ô"; e evita pegar "robots"
  { re: /rob[ôo](?![a-z])|\bIA\b|intelig[êe]ncia artificial|assistente virtual|chatbot/i, why: 'sem falar em robô ou IA: o texto deve soar humano e comercial' },
];

// linhas de comentário e listas de palavras-chave do DATA não são texto exibido
const ignorar = (line) => /^\s*(\/\/|\/?\*|<!--)/.test(line) || /chaves\s*:/.test(line);

const lines = readFileSync(filePath, 'utf8').split(/\r?\n/);
const found = [];
lines.forEach((line, i) => {
  if (ignorar(line)) return;
  for (const rule of rules) {
    if (rule.skip?.(target)) continue;
    const m = line.match(rule.re);
    if (m) found.push(`${target}:${i + 1}: "${m[0]}" (${rule.why})`);
  }
});

if (found.length > 0) {
  console.error(`Regras de conteúdo do site (CLAUDE.md) violadas:\n${found.join('\n')}\nReescreva esse texto.`);
  process.exit(2);
}
