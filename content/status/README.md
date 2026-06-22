# Status updates & incidents

This folder powers the **Incident history** and **Active incidents** sections of the
status page at `/status`. Each incident lives in its own folder as
`content/status/<slug>/index.mdoc` (same layout as `content/posts`).

> This `README.md` is ignored by the site — only `<slug>/index.mdoc` files are rendered.

## Posting an update

Two ways:

1. **Keystatic CMS** — run `npm run cms`, open the local studio, and use the
   **Status updates** collection. Fill in the fields, write the body, save.
2. **By hand** — copy an existing incident folder (e.g.
   `status-monitoring-is-live/`), rename it, and edit `index.mdoc`.

Then commit and push. The page rebuilds and the update appears.

## File format

```
---
title: Brief headline of what happened
date: 2026-06-22T14:30:00.000Z      # when it started (ISO 8601, UTC)
resolved: 2026-06-22T15:10:00.000Z  # when it ended — LEAVE BLANK if still ongoing
severity: major                      # maintenance | minor | major | critical
status: resolved                     # investigating | identified | monitoring | resolved
affected: [app, web]                 # service ids from data/status/services.json (or [])
---
Markdown body. Tell people what's happening and what you're doing about it.

You can post a running timeline by adding bold timestamps, e.g.

**15:10 UTC** — Resolved. The app is responding normally again.

**14:45 UTC** — We identified a slow database query and are rolling back.

**14:30 UTC** — Investigating elevated error rates on the Rōmy App.
```

## Notes

- An incident with **no `resolved` time** is treated as **active** and shown
  prominently at the top of the page; it also escalates the overall status banner
  (e.g. a `critical`/`major` active incident flips the page to "outage").
- `affected` ids must match the `id` fields in `data/status/services.json`.
- Service uptime itself is measured automatically — you don't edit it here.
  See `data/status/history.json` (written by `scripts/uptime-check.mjs`).
