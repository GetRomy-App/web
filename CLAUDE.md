# Rōmy — project notes

Landing page and blog for Rōmy. Blog posts live in `content/posts/<slug>/index.mdoc`.

## Editorial rules

These apply to all blog copy (and any user-facing text):

- **Always write the brand name as "Rōmy"** — with the macron over the "o" (ō, U+014D). Never "Romy". This includes possessives ("Rōmy's") and hyphenated forms ("Rōmy-Claude").
- **Don't use God's name needlessly.** Avoid casual interjections like "God, no" or "God, not that." Rephrase with a neutral emphatic ("Goodness, no", "Far from it", "Definitely not").

## SEO rules

- Every page renders its head tags through `src/lib/components/seo/Seo.svelte` — never add `<title>`, description, canonical or OG tags to `+layout.svelte`, or every page inherits them.
- Every post needs `seo_title` (≤ 60 chars: the post title plus the topic people search for), `seo_description` (≤ 160 chars, factual, drawn from the post) and 4–6 `keywords` in its frontmatter. Reuse existing keywords where they fit; shared keywords drive the "Keep reading" links.
- These fields are metadata only. Never change a post's `title`, `excerpt` or body for SEO.
- `/sitemap.xml`, `/rss.xml` and `/llms.txt` are generated from `content/` — don't hand-edit copies into `static/`.
