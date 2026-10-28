import { company, integrations, modules, newsItems } from '../data/empresa';

export const prerender = true;

const publicPages = [
  '/',
  '/empresa',
  '/clientes',
  '/funcionalidades',
  '/integracoes',
  '/contato',
  '/politica-de-privacidade',
  '/politica-de-cookies',
  '/termos-de-uso',
];

function xmlEscape(value: string): string {
  return value.replace(/[<>&'"]/g, (character) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;',
  })[character] ?? character);
}

export async function GET(): Promise<Response> {
  const paths = [
    ...publicPages,
    // /novidades fica fora do índice enquanto não houver publicação (noindex na página)
    ...(newsItems.length ? ['/novidades'] : []),
    ...modules.filter((module) => module.confirmed).map((module) => `/funcionalidades/${module.slug}`),
    ...integrations.map((integration) => `/integracoes/${integration.slug}`),
    ...newsItems.map((item) => `/novidades/${item.slug}`),
  ];
  const urls = paths.map((path) => `<url><loc>${xmlEscape(new URL(path, company.siteUrl).toString())}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
