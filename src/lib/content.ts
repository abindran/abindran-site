import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;
export type Series = CollectionEntry<'series'>;

/** A series plus its articles, already ordered by seriesOrder. */
export interface SeriesWithPosts {
  series: Series;
  posts: Post[];
}

/** Drafts are excluded from production builds but visible while developing. */
const isVisible = (post: Post) => import.meta.env.DEV || !post.data.draft;

const byNewest = (a: Post, b: Post) =>
  b.data.date.valueOf() - a.data.date.valueOf();

/** All publishable posts, newest first. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', isVisible);
  return posts.sort(byNewest);
}

/** Posts that are not part of any series. */
export async function getStandalonePosts(): Promise<Post[]> {
  return (await getPosts()).filter((p) => !p.data.series);
}

/** Every series, each with its posts in reading order. */
export async function getAllSeries(): Promise<SeriesWithPosts[]> {
  const [allSeries, posts] = await Promise.all([
    getCollection('series'),
    getPosts(),
  ]);

  return allSeries
    .map((series) => ({
      series,
      posts: posts
        .filter((p) => p.data.series?.id === series.id)
        .sort((a, b) => (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0)),
    }))
    .sort((a, b) => a.series.data.order - b.series.data.order);
}

/**
 * Series context for a single post: the series itself, its full ordered post
 * list, this post's 1-based position, and its neighbours.
 *
 * Returns null for standalone posts.
 */
export async function getSeriesContext(post: Post) {
  if (!post.data.series) return null;

  const series = await getEntry(post.data.series);
  if (!series) return null;

  const posts = (await getPosts())
    .filter((p) => p.data.series?.id === series.id)
    .sort((a, b) => (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0));

  const index = posts.findIndex((p) => p.id === post.id);

  return {
    series,
    posts,
    position: index + 1,
    total: posts.length,
    prev: index > 0 ? posts[index - 1] : undefined,
    next: index < posts.length - 1 ? posts[index + 1] : undefined,
  };
}

/** Every tag used across visible posts, with counts, most-used first. */
export async function getTags(): Promise<{ tag: string; count: number }[]> {
  const posts = await getPosts();
  const counts = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  return (await getPosts()).filter((p) => p.data.tags.includes(tag));
}

/** Canonical slug for a tag. Used by both the URL builder and the route. */
export const tagSlug = (tag: string) =>
  tag.toLowerCase().replace(/\s+/g, '-');

/** URL builders — the single place that knows what article URLs look like. */
export const urls = {
  post: (post: Post) => `/blog/${post.id}/`,
  series: (series: Series) => `/series/${series.id}/`,
  tag: (tag: string) => `/tags/${tagSlug(tag)}/`,
};
