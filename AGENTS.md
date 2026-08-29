## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

---

# Personal Developer Blog — Project Context

## 0. Working agreement

This began as a learning project with a strict "explain, do not implement" contract. That mode
was retired once the fundamentals were in place. Current expectations:

- **Implementation is fine.** Write code, and explain non-obvious decisions as you go.
- **Explain why, not just how.** Every technical decision needs a rationale that can be evaluated.
- **Challenge bad decisions.** Do not accept a poor choice just because it was proposed.
- **Prefer simple, production-quality solutions.** No unnecessary abstractions or dependencies.
- **Verify current documentation** when a framework, library, or API may have changed. See §7 —
  this has already caught several wrong assumptions in this repo.

## 1. Context

- Strong on HTML, CSS, and JavaScript. Do not explain web fundamentals.
- Comfortable in a terminal and with git.
- Astro-specific behaviour (build-time vs runtime, content layer, islands) is worth calling out
  explicitly when it drives a decision.

---

## 2. Project goal

A **personal developer blog** that is professional, fast, SEO-friendly, responsive, accessible,
easy to maintain, and easy to publish to. It must support **long-form technical articles** and
**article series** as a first-class concept.

### Series requirement

A series is not a tag. Given a series like "C Programming" with 15 articles, a reader must be
able to see that an article belongs to a series, open a series landing page, see all articles in
order, see the current article's position, navigate previous/next, and understand their progress
(e.g. `8 / 15`).

This requirement drove the CMS decision. Do not let it get modelled away as a tag.

---

## 3. Decisions — LOCKED

Do not re-litigate these without a concrete new reason. Rationale is included so you can tell
when a reason is genuinely new.

| Decision | Choice | Why |
|---|---|---|
| Framework | **Astro 7** | Zero JS by default; best-in-class content pipeline; correct shape for a content site |
| Node | **22.x** (pinned via `.node-version`) | Astro 7 minimum |
| Package manager | **pnpm 11.x** (pinned via `packageManager` in `package.json`) | Content-addressable store; pnpm 11 security defaults |
| Language | **TypeScript, strict** | Its real value here is validating the CMS/content boundary at build time |
| Content source | **Markdown/MDX files in git**, via Astro Content Collections | See §4 |
| Hosting | **Cloudflare Workers** with static assets | Unlimited bandwidth on free tier; no overage bill on a traffic spike; Cloudflare's own recommendation for new projects over Pages |
| Domain | **abindran.com** — registered at Namecheap, nameservers pointed at Cloudflare, mapped to the Worker | Registrar separate from host — retain control if the host account is ever locked. Apex is canonical |
| Search | **Pagefind** (Phase 8, hooks laid in Phase 6) | See §4 |
| Markdown default | Plain `.md`; `.mdx` only per-article when a component is genuinely needed | MDX turns content into code — slower builds, portability liability as a default |
| Typecheck gate | `build` script is `astro check && astro build` | `astro build` only transpiles TypeScript, it does not typecheck; without this, a bad prop type built and deployed clean. `&&` means a failed check produces no `dist/` at all |
| Styling | **SCSS**, hand-written, no framework | A blog is a typography problem with ~8 components. Colour lives in CSS custom properties (runtime-swappable for dark mode); the type scale, spacing, and breakpoints are Sass variables (compile-time only) |
| URL architecture | **Flat** `/blog/<slug>` | Series membership is page content, not path structure. Moving an article between series, or renaming a series, never breaks a URL. `/series/<slug>` and `/tags/<slug>` exist as their own indexes |
| Series representation | Its own **content collection**, referenced via `reference('series')` | A series owns metadata (title, description, order) that belongs to no single article. `seriesOrder` gives position; `8 / 15` is computed, never typed by hand |
| Markdown processor | `unified()` from `@astrojs/markdown-remark` | Astro 7 defaults to Sätteri; remark/rehype plugins require opting back into unified explicitly. Needed for reading-time and heading anchors |
| Dark mode | `prefers-color-scheme` only, no toggle | No JS, no flash-of-wrong-theme, no persistence layer. Revisit only if a toggle is actually wanted |

### Rejected, with reasons

- **Hashnode** — a platform, not a CMS. Fixed content model, so no custom taxonomy or metadata.
  Canonical-URL split across two domains.
- **Contentful** — restrictive free tier with a history of tightening; proprietary rich-text JSON
  is a poor fit for code-heavy articles.
- **Sanity** — genuinely good, strong runner-up. Loses on Portable Text being awkward for long
  code-heavy writing, and on paying hosted-database complexity for a scale this blog will not
  reach. Would be correct for a multi-author publication.
- **Strapi / Directus / Payload / headless WordPress** — all require a server, database, backups,
  and patching. Violates the "no backend to maintain" constraint outright.
- **Cloudflare Pages** — still supported, but Workers has feature parity and gets the roadmap.
  No reason to start a multi-year project on the deprioritised branch.
- **Vercel / Netlify** — Vercel's free tier restricts commercial use and meters bandwidth;
  Netlify moved to a credit model. Both risk a bill on a traffic spike, which is the exact day
  this blog is being written for.
- **A component library (shadcn/ui etc.) as a "design system"** — a blog is a typography problem
  with ~8 components, not a component-heavy app. Off-the-shelf components are the fastest route
  to looking like a template. shadcn also forces a React dependency that may not be needed.

---

## 4. Architecture

### Publishing pipeline

```
Write Markdown in editor
        ↓
Git repo  (content is version-controlled text)
        ↓
git push → Cloudflare detects → pnpm install && pnpm build
        ↓
Static HTML on Cloudflare's edge
        ↓
Custom domain
```

No CMS API, no build-time network dependency, no vendor. "CMS is down" is not a failure mode
that exists in this design.

### Layers — each knows only the layer below it

```
4. Pages & components (.astro)
   Touches only Article / Series objects. No knowledge of the content source.
3. Domain model
   Article, Series, Topic, Tag, Author. MY vocabulary, not a vendor's.
2. Data layer   ← THE BOUNDARY
   A loader + a Zod schema. Fetches, validates, maps source fields → domain model.
   The ONLY place that knows where content comes from.
1. Content source
   Markdown files in git (or, someday, an API)
```

Layer 2 is implemented with Astro's Content Layer API — `glob()` loader for local files, an
object loader if a remote source is ever needed. Every collection declares a Zod schema; every
page queries via `getCollection()`. **Swap the loader, keep the schema, and nothing above layer 2
changes.** This is what makes the project CMS-independent. Hold this boundary strictly.

A Zod schema is runtime code and throws at build time on its own — that half of the boundary
enforces itself. The static TypeScript types Astro generates *from* that schema do not; they are
only checked if `astro check` runs, which is why the typecheck gate in §3 exists.

### Editing UI — deliberately deferred

Content is files, so a web editing UI is a **separable, reversible** decision that requires zero
content migration. Do not add one until I have written 2–3 real articles and decided I want one.
Candidates when that time comes: Decap CMS (mature, needs an OAuth broker since Netlify's Git
Gateway is deprecated), Sveltia CMS (modern Decap-compatible replacement), Keystatic (TypeScript
config, slow-moving project), TinaCMS.

### Search — Pagefind

Runs *after* `astro build`, indexing the generated HTML in `dist/`. Index is chunked, so the
browser downloads only what a query needs — bandwidth scales with the query, not the corpus.
Fully static, no API key, no service dependency, queries never leave the browser.

It depends only on the HTML output, so it is decoupled from the content source entirely.

**Cost to plan for:** a build step (`astro build && pagefind --site dist`), and
`data-pagefind-body` on the article element plus `data-pagefind-ignore` on tag lists — otherwise
nav and footer text pollute every result. **Add those attributes in Phase 6** when the article
layout is built, so Phase 8 is a small retrofit.

If a `⌘K` command palette is wanted, that is the one component where React genuinely earns its
place. Otherwise Pagefind's prebuilt UI is fine and the site ships with no framework JS.

---

## 5. Open decisions — do NOT pre-empt

- **React.** Not installed, and nothing so far has needed it. Copy-code button, theme toggle, and
  TOC scroll-spy all work without it. Introduce it only for a component that genuinely needs
  stateful interaction, as a single island. Possibly never.
- **Radix primitives.** Only if a genuinely hard a11y problem appears (dialog, combobox).
- **Search.** Pagefind, planned. `data-pagefind-body` / `data-pagefind-ignore` attributes are not
  yet added to the article layout — see §4.
- **Linting/formatting.** Still unset. Worth doing before the codebase grows further.
- **`www` redirect.** `abindran.com` is canonical. If `www.abindran.com` also resolves, it must
  301 to the apex — both resolving independently splits SEO. Configure as a Cloudflare redirect
  rule; nothing in this repo can enforce it.

---

## 6. Roadmap and current state

```
Phase 0   Decisions locked                           ✅ DONE
Phase 1   Environment + DEPLOYED skeleton            ✅ DONE
Phase 2   Astro fundamentals                         ✅ DONE
Phase 3   Content layer: collections, Zod, Markdown  ✅ DONE
Phase 4   Content model + URL architecture           ✅ DONE
Phase 5   Styling & typography                       ✅ DONE
Phase 6   Article experience                         ✅ MOSTLY (no TOC)
Phase 7   SEO & platform                             ✅ DONE
Phase 8   Interactivity: islands, Pagefind           ← NEXT
Phase 9   Editing UI — optional
Phase 10  Performance & accessibility audit, polish
```

**MVP = Phases 1–7.** Comments, related articles, and interactive demos are Version 2 or later.

### Infrastructure

- Node 22.22, pnpm 11.24.0, both pinned in the repo
- `.node-version` with the correct filename (`.node_version`, no hyphen, was a typo that meant
  nothing on the build machine actually read it)
- `pnpm-workspace.yaml` holds only `allowBuilds` — no `packages:` key. `@parcel/watcher` is
  explicitly denied (`false`) rather than left undecided; it is a native watcher pulled in by
  sass that only sass's own `--watch` uses, and leaving it unresolved makes `pnpm install` exit 1
- `build` script is `astro check && astro build`; verified by deliberately breaking a prop type
  and watching the build fail with exit code 1 before `astro build` ran
- Cloudflare Workers deploy on push; `wrangler.jsonc` committed

### Architecture as built

- `src/content.config.ts` — two collections, `blog` and `series`. `blog` uses `.refine()` so
  `series` and `seriesOrder` must be set together or not at all
- `src/lib/content.ts` — the domain layer. All queries, sorting, series resolution, tag counting,
  and URL construction live here. **Pages never call `getCollection()` directly.** Swapping the
  loader would touch only this file and `content.config.ts`
- `src/lib/reading-time.mjs` — remark plugin; writes `readingTime` into frontmatter at build time
- `src/styles/` — `_tokens.scss` (colour custom properties + Sass scale), `_reset.scss`,
  `_prose.scss` (long-form typography, Shiki dual-theme switching), `global.scss`
- `src/components/` — `Header`, `Footer`, `PostCard`, `SeriesBox`, `Pager`, `FormattedDate`
- Routes: `/`, `/blog`, `/blog/<slug>`, `/series`, `/series/<slug>`, `/tags`, `/tags/<slug>`,
  `/about`, `/404`, `/rss.xml`, `/sitemap-index.xml`

### Content authoring

Frontmatter fields on a blog post: `title`, `description` (both required), `date`, optional
`updated`, `tags` (defaults `[]`), `draft` (defaults `false`), and optionally `series` +
`seriesOrder` together.

Dates must be **unquoted** in YAML (`date: 2026-08-29`). `z.coerce.date()` accepts quoted strings
too, but unquoted is the intended form — see §7.

Drafts are visible in `astro dev` and excluded from production builds and RSS.

`abindran.com` is live and mapped to the Worker. The domain appears in three files that must
always agree — `src/consts.ts` (`SITE.url`), `astro.config.mjs` (`site`), and
`public/robots.txt` (sitemap line). A mismatch silently produces wrong canonicals, sitemap
entries, and RSS links, and nothing in the build catches it.

---

## 7. Lessons from this project — apply these

Two rules earned from real incidents. Enforce them on both of us.

**1. Check versions first.** An earlier bug was diagnosed confidently and incorrectly because the
explanation assumed a pnpm version I was not running. The explanation fit the symptom perfectly
and was still false. A single `--version` would have killed it instantly.

> When debugging, the question is not "does this explain what I'm seeing?" — plenty of wrong
> theories do. It is "what would have to be true for this to hold, and have I verified it?"

**2. No unexplained configuration.** If I cannot explain a config line, either find out what it
does or delete it and see what breaks. Unexplained config accumulates until nobody dares remove
anything. Do not hand me config to paste without explaining every line.

A corollary that applies to tooling recommendations: **"free and best" is a claim with a
timestamp.** Product landscapes move. Verify before recommending. (Corepack, currently used to
pin pnpm, is being removed from Node — fine on Node 22, will need replacing around Node 26.)

**3. A tool's success message describes intent; its state file describes what happened.**
`pnpm install` printing "Already up to date" did not prove a workspace config edit was honoured —
reading `node_modules/.modules.yaml` did. Prefer the state file when the two could disagree.

### Version-specific gotchas already hit in this repo

- **YAML types are upstream of Zod.** `date: 2026-08-29` parses to a `Date`; `date: "2026-08-29"`
  parses to a `string`, and `z.date()` rejects it. Zod validates the type YAML produced — it does
  not parse text. `z.coerce.date()` converts first, which is why it is used here.
- **Astro 7 changed the default Markdown processor** to Sätteri. `markdown.remarkPlugins` and
  `markdown.rehypePlugins` are deprecated and require `@astrojs/markdown-remark`; pass plugins to
  `unified({...})` via `markdown.processor` instead.
- **`import { z } from 'astro:content'` is deprecated** in Astro 7 and removed in Astro 8. Use
  `astro/zod`.
- **`export const getStaticPaths: GetStaticPaths = ...` does not infer prop types.** Use
  `(async () => {...}) satisfies GetStaticPaths` plus
  `InferGetStaticPropsType<typeof getStaticPaths>`, or every `Astro.props` field is `unknown`.
- **`key` is not a valid attribute in `.astro` templates.** There is no client-side reconciliation
  step, so there is nothing for a key to identify. `astro check` rejects it on native elements.

---

## 8. Immediate next step

Phase 8. Nothing is in progress.

Known follow-ups, roughly in order of value:

1. **Pagefind search.** Add `data-pagefind-body` to the article element and `data-pagefind-ignore`
   to nav/footer/tag lists, then `astro build && pagefind --site dist`.
2. **Table of contents.** `render()` returns `headings`; the CSS for heading anchors already
   exists. No JS needed unless scroll-spy is wanted.
3. **OG images.** No `og:image` is emitted, so link previews are bare text.
4. **Linting/formatting.** Still unset (§5).
5. **Real content.** `src/content/blog/` currently holds three sample posts and one sample series;
   all are placeholder writing and should be replaced.
