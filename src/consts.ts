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
