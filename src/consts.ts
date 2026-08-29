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

/**
 * Social and contact links. Kept here so the About page and anywhere else that
 * needs them stay in agreement.
 */
export const SOCIAL_LINKS = [
  {
    name: 'Email',
    href: 'mailto:abindranr@gmail.com',
    handle: 'abindranr@gmail.com',
    icon: 'mail',
  },
  {
    name: 'GitHub',
    href: 'https://github.com/abindran',
    handle: '@abindran',
    icon: 'github',
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/abindran-r/',
    handle: 'abindran-r',
    icon: 'linkedin',
  },
  {
    name: 'LeetCode',
    href: 'https://leetcode.com/u/abindranr/',
    handle: '@abindranr',
    icon: 'leetcode',
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/abindran_r/',
    handle: '@abindran_r',
    icon: 'instagram',
  },
] as const;
