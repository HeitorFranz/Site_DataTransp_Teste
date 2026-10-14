import { company } from '../data/empresa';

export const prerender = true;

export async function GET(): Promise<Response> {
  return new Response(`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${company.siteUrl}/sitemap.xml\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
