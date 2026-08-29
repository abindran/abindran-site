// Site-wide constants. Single source of truth for anything that appears in
// metadata, feeds, or structured data.

export const SITE = {
  title: 'Abindran',
  description:
    'Notes on systems programming, web architecture, and the things that break in between.',
  author: 'Abindran',
  // Used for canonical URLs, RSS, sitemap, and Open Graph. Must match the
  // deployed origin exactly — a mismatch silently produces wrong canonicals.
  url: 'https://abindran.com',
  locale: 'en',
} as const;

export const NAV_LINKS = [
  { href: '/blog', label: 'Writing' },
  { href: '/series', label: 'Series' },
  { href: '/about', label: 'About' },
] as const;

/**
 * Footer sitemap columns. Structural links only — the Series column is built
 * from the content collection at build time, so it never goes stale.
 */
export const FOOTER_COLUMNS = [
  {
    title: 'Writing',
    links: [
      { href: '/blog', label: 'All articles' },
      { href: '/series', label: 'Series' },
      { href: '/tags', label: 'Tags' },
    ],
  },
  {
    title: 'Site',
    links: [
      { href: '/', label: 'Home' },
      { href: '/about', label: 'About' },
      { href: '/rss.xml', label: 'RSS feed' },
      { href: '/sitemap-index.xml', label: 'Sitemap' },
    ],
  },
] as const;

/** Series listed individually in the footer before collapsing to an index link. */
export const FOOTER_SERIES_LIMIT = 4;
