# web

LP for Rōmy 🌴

## Status page

Live uptime + incidents at [`/status`](https://getromy.app/status). It monitors
`intel.getromy.app` (the Rōmy app) and `getromy.app` (this site).

**It runs itself.** A GitHub Action (`.github/workflows/uptime.yml`) probes every
service every ~10 minutes and commits the results to `data/status/history.json`.
Those data commits are tagged `[skip ci]` so they never redeploy the site — the
page live-refreshes the data in the browser instead, so it's always fresh.
The green/red uptime bars are measured automatically; you can't set them by hand.

**It checks more than "the page loads."** Each service can expose a deep-health
endpoint (`/api/health`) reporting every dependency — database, cache, AI
gateway, billing, email — and those checks get their own rows on the page. A
service that says it's down counts as down even while its homepage still
returns 200. **It also pages a human:** sustained failures and error-rate
spikes open a GitHub issue (label `status-alert`) that mentions the on-call
and auto-closes on recovery. Contract and details:
[`data/status/README.md`](data/status/README.md).

**To change what's monitored:** edit `data/status/services.json` (one entry per
service), then commit.

### Posting an incident / disruption

Incidents are the human layer on top of the automatic uptime. Add a file at
`content/status/<slug>/index.mdoc` (or use the CMS: `npm run cms` → **Status
updates**), then commit + push — it deploys and shows up.

```
---
title: Elevated errors on the Rōmy App
date: 2026-06-22T14:30:00.000Z   # when it started (UTC)
resolved:                         # ← LEAVE BLANK while it's ongoing
severity: major                   # maintenance | minor | major | critical
status: investigating             # investigating | identified | monitoring | resolved
affected: [app]                   # service ids (app, web) or checks (app:database)
---
**14:30 UTC** — Investigating elevated errors on the Rōmy App.
```

- A blank `resolved` makes it an **active** incident: it shows at the top and
  flips the overall banner — `critical` → Major outage, `major` → Partial outage,
  `minor` → Degraded, `maintenance` → Scheduled maintenance.
- **Update it** by adding a new bold-timestamp line at the top of the body and
  bumping `status:` (`identified` → `monitoring`).
- **Close it** by filling in `resolved:` and setting `status: resolved` — it moves
  into Incident history.

More detail: [`content/status/README.md`](content/status/README.md).
