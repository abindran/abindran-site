# Favicon source files

Original exports from RealFaviconGenerator. **Kept in git, deliberately outside
`public/`** — Astro copies `public/` into `dist/` verbatim, and these are large
enough that shipping them would waste ~2.5MB per deploy on files nothing links.

Note the `.svg` files are not vectors: each is a base64-encoded PNG
(1278×1230 and 1254×1254) wrapped in SVG markup, which is what the generator
produces from a raster upload.

## What actually ships

Derived from these and living in `public/`:

| File | Purpose |
|---|---|
| `favicon.ico` | Universal fallback; browsers request this path automatically |
| `light-favicon-32.png` | `prefers-color-scheme: light` |
| `dark-favicon-32.png` | `prefers-color-scheme: dark` |
| `apple-touch-icon.png` | 180×180 for iOS home screen |

## Regenerating

```sh
sips -Z 32  assets/favicon-source/light-favicon.svg --out public/light-favicon-32.png
sips -Z 32  assets/favicon-source/dark-favicon.svg  --out public/dark-favicon-32.png
sips -Z 180 assets/favicon-source/light-favicon.svg --out public/apple-touch-icon.png
```

`sips` cannot read the SVG wrapper directly — extract the embedded PNG first, or
re-export at the target size from the original artwork.
