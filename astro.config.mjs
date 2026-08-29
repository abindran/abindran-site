// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

import { remarkReadingTime } from './src/lib/reading-time.mjs';

// https://astro.build/config
export default defineConfig({
  // Required for canonical URLs, sitemap, and RSS. Keep in sync with SITE.url
  // in src/consts.ts.
  site: 'https://abindran.com',
  trailingSlash: 'ignore',

  integrations: [sitemap()],

  markdown: {
    // Astro 7 defaults to the Sätteri processor; remark/rehype plugins require
    // opting back into the unified pipeline explicitly.
    processor: unified({
      remarkPlugins: [remarkReadingTime],
      rehypePlugins: [
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'append',
            properties: { class: 'heading-anchor', ariaHidden: 'true', tabIndex: -1 },
            content: { type: 'text', value: '#' },
          },
        ],
      ],
    }),
    shikiConfig: {
      // Dual themes: Shiki emits both, CSS variables select one per scheme.
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      wrap: false,
    },
  },
});
