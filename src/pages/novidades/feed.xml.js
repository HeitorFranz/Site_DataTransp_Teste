import rss from '@astrojs/rss';
import { meta, newsItems } from '../../data/empresa';

export async function GET(context) {
  return rss({
    title: meta.rssTitle,
    description: meta.rssDescription,
    site: context.site,
    items: newsItems.map((item) => ({
      title: item.title,
      pubDate: new Date(item.date),
      description: item.summary,
      link: `/novidades/${item.slug}`,
    })),
    stylesheet: '/rss/styles.xsl',
    customData: '<language>pt-BR</language>',
  });
}
