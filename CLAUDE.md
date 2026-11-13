# Rōmy — project notes

Landing page and blog for Rōmy. Blog posts live in `content/posts/<slug>/index.mdoc`.

## Editorial rules

These apply to all blog copy (and any user-facing text):

- **Always write the brand name as "Rōmy"** — with the macron over the "o" (ō, U+014D). Never "Romy". This includes possessives ("Rōmy's") and hyphenated forms ("Rōmy-Claude").
- **Don't use God's name needlessly.** Avoid casual interjections like "God, no" or "God, not that." Rephrase with a neutral emphatic ("Goodness, no", "Far from it", "Definitely not").

## SEO / GEO

- Every page sets its title, description, canonical, social tags and JSON-LD through `src/lib/components/Seo.svelte` (helpers in `src/lib/seo.ts`). The root layout only carries sitewide tags — don't put a title or canonical there.
- Each post's frontmatter takes optional `seo_title`, `seo_description` (≤ 160 characters) and `keywords`. They only feed search/social metadata; `title` and `excerpt` stay the on-page copy. New posts should set all three.
- `/llms.txt`, `/llms-full.txt`, `/rss.xml` and `/sitemap.xml` are generated from the content at build time. The hand-written top of `llms.txt` lives in `content/site/llms-intro.md`.
