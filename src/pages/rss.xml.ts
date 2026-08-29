import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts, urls } from '../lib/content';
import { SITE } from '../consts';

export async function GET(context: APIContext) {
  const posts = (await getPosts()).filter((p) => !p.data.draft);

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: urls.post(post),
      categories: post.data.tags,
    })),
    customData: `<language>en-us</language>`,
  });
}
