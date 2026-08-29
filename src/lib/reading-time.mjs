import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';

/**
 * Remark plugin: computes reading time from the parsed Markdown AST and writes
 * it into frontmatter, so it is available on `remarkPluginFrontmatter` after
 * render() without re-parsing the body anywhere else.
 */
export function remarkReadingTime() {
  return function (tree, { data }) {
    const stats = getReadingTime(toString(tree));
    data.astro.frontmatter.readingTime = Math.max(1, Math.round(stats.minutes));
    data.astro.frontmatter.wordCount = stats.words;
  };
}
