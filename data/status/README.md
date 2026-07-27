# Rōmy status monitoring

In-house monitoring for [getromy.app/status](https://getromy.app/status). No
Sentry, no Better Stack — a cron workflow, two dependency-free Node scripts,
and GitHub issues as the pager.

This exists because of a hard truth from our operational review: **a homepage
returning 200 proves nothing about the product.** The database, cache, AI
gateway, billing, or email can fail at 2am while the status page stays green
and the first signal is a customer emailing "your product has been broken all
morning." The pipeline below closes that gap.

## How it fits together

```
.github/workflows/uptime.yml        every ~10 min
  └─ scripts/uptime-check.mjs       probe each service:
       ├─ GET service.url           surface check — does the page answer?
       ├─ GET service.healthUrl     deep check — is each dependency healthy?
       └─ writes history.json       per-service AND per-dependency series
  └─ scripts/uptime-alert.mjs       pages a human via GitHub issues
  └─ commit history.json            [skip ci]; the page fetches it live
```

- `services.json` — what to monitor. Each service has a `url` (surface) and
  optionally a `healthUrl` (deep) plus display labels for its dependency
  checks under `components`.
- `history.json` — machine-written by the probe runner. Keys are service ids
  plus one `"<serviceId>:<checkKey>"` series per reported dependency
  (e.g. `app:database`). Committed so the repo is the single source of truth.
- `/status` renders both levels: a row per service, dependency rows beneath
  it, and "Surface checks only" when deep telemetry isn't flowing.

## The health endpoint contract

Every service that wants dependency-level status exposes `GET /api/health`
returning:

```json
{
	"status": "ok",
	"checks": {
		"database": { "ok": true, "ms": 12 },
		"cache": { "ok": true, "ms": 3 },
		"ai_gateway": { "ok": true, "ms": 210 },
		"billing": { "ok": true, "ms": 180, "degraded": true },
		"email": { "ok": false, "note": "provider HTTP 500" }
	},
	"errors": { "count": 3, "threshold": 25, "window": "15m" }
}
```

Semantics:

- **`status`** — the service's own verdict: `"ok"`, `"degraded"`, or
  `"down"`. A reported `"down"` marks the service down on the status page
  _even though its homepage still answers_ — that is the point. Serve
  `"down"` with HTTP 503 (dumb monitors then agree with smart ones);
  `"ok"`/`"degraded"` with HTTP 200. The monitor trusts the body either way.
- **`checks`** — one entry per dependency the service can't work without.
  `ok` is required; `ms` (probe latency), `degraded` (answering but unwell),
  and `note` (short failure label, shown in alerts) are optional. Keys become
  history series and rows on the status page. Check cheaply — a connection
  ping or an authenticated read, never a write.
- **`errors`** — optional error-log telemetry: `count` of application errors
  in the service's own reporting window, and the `threshold` the service
  considers a spike. **The service declares its own threshold** — it knows
  its baseline; the monitor just compares and pages. Omit the block if there
  is nothing to report yet.

Rules of thumb: answer in under ~5s (cache checks briefly server-side —
the endpoint is public), require no auth, and never let one slow dependency
check hang the whole payload.

### Reference implementation

`src/routes/api/health/+server.ts` in this repo is the live endpoint for the
marketing site (one real dependency: Resend, reported as `email`). The Rōmy
app mirrors it at `intel.getromy.app/api/health` with its full set —
`database`, `cache`, `ai_gateway`, `billing`, `email` — plus an `errors`
block fed by its error log. Until that ships, the app's row shows
"Surface checks only"; the moment the endpoint answers, dependency rows and
error-spike paging light up with **no changes needed in this repo**.

## Alerting — how a human gets paged

`scripts/uptime-alert.mjs` runs right after the probes and manages GitHub
issues labelled `status-alert` on this repo. Opening an issue notifies
watchers and everyone in `alerts.mentions` (GitHub email/push — install the
GitHub mobile app and this is a pager). Conditions:

| Condition          | Fires when                                              | Issue                                   |
| ------------------ | ------------------------------------------------------- | --------------------------------------- |
| Service down       | ≥2 consecutive failed probes (a lone blip never pages)  | 🔴 _name_ is down                       |
| Dependency failing | a reported check fails ≥2 consecutive probes            | 🔴 _name_: _check_ check failing        |
| Error spike        | reported `errors.count` ≥ the service's own `threshold` | 🟠 _name_: error rate above threshold   |
| Telemetry lost     | a health endpoint that used to report goes dark         | 🟡 _name_: health telemetry unreachable |

Issues auto-close with a recovery note when the condition clears. Closing an
issue **by hand** counts as acknowledgment: the same condition won't re-open
it for 6 hours. Detection latency is bounded by the 10-minute cron — expect
a page within ~20 minutes of a real failure, instead of the next morning.

## Working on this locally

```sh
node scripts/uptime-check.mjs        # probe real services, update history.json
node scripts/uptime-alert.mjs        # dry run without GITHUB_TOKEN — prints only
```

Set `STATUS_DATA_DIR` to point both scripts at a scratch copy of this
directory, and `GITHUB_API_URL` at a mock server, to exercise the pipeline
without touching production data or real issues.
