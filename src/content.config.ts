import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),

    // Series membership. Both fields travel together: an article either belongs
    // to a series at a known position, or to neither. Enforced below.
    series: reference('series').optional(),
    seriesOrder: z.number().int().positive().optional(),
  }).refine(
    (data) => (data.series === undefined) === (data.seriesOrder === undefined),
    { message: 'series and seriesOrder must be set together, or neither.' },
  ),
});

const series = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/series' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Ordering for the series index page; lower sorts first.
    order: z.number().int().default(0),
  }),
});

export const collections = { blog, series };
