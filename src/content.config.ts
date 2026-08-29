import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  // Function form so the schema can use `image()`, which resolves a relative
  // path in frontmatter into ImageMetadata (dimensions included) at build time.
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),

    // Cover image. Alt text travels with it — a decorative-only cover is a
    // valid choice, but it has to be a deliberate one (coverAlt: '').
    cover: image().optional(),
    coverAlt: z.string().optional(),

    // Series membership. Both fields travel together: an article either belongs
    // to a series at a known position, or to neither. Enforced below.
    series: reference('series').optional(),
    seriesOrder: z.number().int().positive().optional(),
  })
    .refine(
      (data) => (data.series === undefined) === (data.seriesOrder === undefined),
      { message: 'series and seriesOrder must be set together, or neither.' },
    )
    .refine((data) => data.cover === undefined || data.coverAlt !== undefined, {
      message:
        'A post with a cover must also set coverAlt (use an empty string if the image is decorative).',
    }),
});

const series = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/series' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    // Ordering for the series index page; lower sorts first.
    order: z.number().int().default(0),
    cover: image().optional(),
    coverAlt: z.string().optional(),
  }).refine((data) => data.cover === undefined || data.coverAlt !== undefined, {
    message: 'A series with a cover must also set coverAlt.',
  }),
});

export const collections = { blog, series };
