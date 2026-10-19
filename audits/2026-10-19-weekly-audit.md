# Weekly Blog Audit — Week of 2026-10-13 → 2026-10-19

**Auditor:** Marketing director, Red Bull CMO bar
**Posts shipped to `/blog` this week:** **0 of 7 days.**
**Last post that shipped to `/blog`:** *The Booth at the Perkins Off Highway 2* — Thursday, 2026-08-14. **Sixty-six days of silence.**
**New wrinkle since the 10-05 receipt:** one `content/posts/` commit with a front-matter `date:` later than 2026-08-14 — but it ships to `/labs`, not `/blog`. **The editorial room is still dark.** Details below.
**Signal from the founder since the 10-05 receipt:** no `audits/STATE.md`, no commit on `main` naming *paused*, *resuming*, or *retired*, no line added to `README.md`.

---

## Why this file is still a receipt

The 09-14 audit stood the writing series down with a specific hand-off, re-affirmed on 09-21, 09-28 and 10-05:

> *"If a session is invoked next Sunday and finds no post added to `content/posts/` since 2026-08-14 and no `audits/STATE.md`, it should not write an audit. It should stop after verifying the two facts and let the cron owner know the cadence was paused on 2026-09-14 by design, not by omission."*

Verified this morning, in order:

- Front-matter `date:` scan of `content/posts/*/index.mdoc` — newest head → **2026-10-11** (`benchmarking-ai-prospect-research/index.mdoc`). **One file is newer than 2026-08-14 for the first time since the series was stood down.** The trigger from the 09-14 hand-off has, strictly read, fired.
- But that file carries `has_benchmarks: true` in its front-matter. `src/routes/blog/+page.server.ts` reads `getAllPosts()` and then **`.filter((p) => !p.has_benchmarks)`** — comment on the next line: *"Benchmark / research posts live on /labs — keep /blog focused on field-facing writing."* The 10-11 post is on `/labs`, not `/blog`.
- Newest front-matter `date:` on a `/blog`-eligible post (every `.mdoc` without `has_benchmarks: true`): still **2026-08-14** (`the-booth-at-the-perkins-off-highway-2`). Unchanged since the series was stood down.
- `ls audits/STATE.md` → **file does not exist.**
- `git log --all --since='2026-10-05' --grep='paused\|resuming\|retired'` → **no commits.**
- `git log --since='2026-10-05' -- README.md` → **no commits.**
- `git log --since='2026-10-05' -- content/posts/ src/routes/blog/` → **no editorial commits in the audit window.** The one `content/posts/` commit of the past two weeks is `ba9c053` from **Saturday 2026-10-11** — the PIF-Bench v2 ship (ROM-254). Every commit on `main` in the audit window itself (10-13 → 10-19) is the uptime bot updating `data/status/history.json`.
- The **2026-10-12 Sunday audit was not written.** `audits/` jumps from `2026-10-05-weekly-audit.md` straight to this file. First skipped Sunday in the series. The cron may have been paused in the week it finally should have been un-paused, or the 10-12 session judged the Labs ship not a `/blog` resume and stood itself down silently. Either reading supports the same recommendation below.

The editorial-room facts the 09-14 hand-off named still hold on their intent: **no new `/blog` post, no `STATE.md`.** The strictly-literal reading of the trigger has fired on a non-`/blog` post. **No full audit is written.** This file is the receipt, with one honest footnote: the trigger line in the hand-off needs sharpening next time (see **Note to the cron owner** below).

---

## The PIF-Bench v2 ship — what it was, what it was not

For the record, so the next auditor doesn't re-litigate it:

- `content/posts/benchmarking-ai-prospect-research/index.mdoc`, dated 2026-10-11, is the **PIF-Bench v2 write-up**: 25 real tasks, 331 pre-registered pass/fail checks graded blind. Live-track headline: *Claude.ai 83%, Rōmy 74%, Gemini 67%, ChatGPT 60% of checks met; no product met every check for any prospect.* The commit replaces the April v1 article, links to the archived original, and updates the Labs page.
- This is **a research/product act, not a writing-cadence act.** The daily editorial writer did not come back; a product engineer shipped a benchmark. The post is tagged `Research`, has `has_benchmarks: true`, and routes to `/labs`.
- **Marketing-director take, logged for later:** the number to lead with is not *"74%."* It is *"no product got every check right on any prospect."* That is a stance — the whole category is still bad at this, including us — and it earns the read in a way the headline score alone does not. The post's own first line gets most of the way there ("*In April we published PIF-Bench, and Rōmy came out on top with a score of 94.1. We have since rebuilt it from the ground up, because the first version could not carry the weight we were putting on it.*"), which is the right posture: *we rebuilt our own scoreboard because the old one flattered us.* That is Red Bull-adjacent — it sells a worldview (rigor over marketing), not a feature. **No notes for the writer. Full grade belongs on a Labs audit, not here.**
- **This post does not restart `/blog`.** It restarts `/labs`. `/blog` has been quiet since 2026-08-14 and is quiet again this week.

---

## The one live editorial ask, unchanged for ten Sundays

Verified this morning: `grep -nE '/blog' src/lib/components/landing/Navbar.svelte` → **`/blog` link is still live** (lines 65 and 137, header and mobile menu). **`/blog` still opens with Gary Halstad, alone, at the top — tenth Sunday running.** A visitor who lands on `getromy.app` on day sixty-six of editorial silence is still routed to a blog whose top post is nine weeks and three days old — and whose next-top post is older still. This is the one editorial ask smaller than "ship a post" that the 09-07, 09-14, 09-21, 09-28 and 10-05 auditors all named, and it is still un-actioned:

> *"Hide the `/blog` module from the live nav until the writer is back. Ten-minute commit."*

The Labs ship on 10-11 actually sharpens the case for this: a visitor arriving via the PIF-Bench v2 write-up is a research-shaped visitor. The nav sends them to `/blog`, which is a field-notes room, which is empty. The mismatch is doing active damage, not passive silence.

Nothing else on this receipt is new. Nothing on it needs to be.

---

## Note to the cron owner

The scheduled task fired this Sunday and produced a full audit prompt against a `/blog` room that is still empty, for the **ninth time in ten Sundays** (the cron did not fire — or the session stood itself down silently — on 10-12). **The 09-14 audit recommended pausing the cron. The 09-21, 09-28 and 10-05 receipts affirmed it. It still stands.** Mechanism: `crontab -e`, a paused GitHub Action under `.github/workflows/`, or a paused schedule in the Claude Code web dashboard. Ten seconds of work, whichever it is. Un-pause the morning a `/blog` post ships.

**Also for the owner: the resume trigger as written is now ambiguous.** The 09-14 hand-off said *"one commit under `content/posts/*/index.mdoc` with a `date:` in the front-matter later than 2026-08-14."* As of 10-11 that is literally true, on a post that is not a `/blog` post. If the series is to resume on an editorial return — the clear original intent — the trigger line should be tightened:

> **Resume trigger for the audit series (sharpened from 09-14):** one new `content/posts/*/index.mdoc` whose front-matter has a `date:` later than 2026-08-14 **and** does **not** have `has_benchmarks: true` — i.e., a post that will actually appear on `/blog`. The next auditor can watch for that with a single pipeline: `ls -t content/posts/*/index.mdoc` then grep the newest head's front-matter for the absence of `has_benchmarks`.

Un-pause the cron on that condition, not on any `content/posts/` commit.

---

## Cover check

**Path chosen:** `audits/2026-10-19-weekly-audit.md` at the repo root — the convention used by every prior audit in this series (`audits/2026-06-01-weekly-audit.md` through `audits/2026-10-05-weekly-audit.md`; eighteen files verified with `ls audits/`). The `audits/` directory sits outside `src/routes/`, so SvelteKit routing does not touch it. Confirmed against `src/routes/blog/+page.server.ts`, which reads posts only from `content/posts/` via `$lib/content`. **This report will not publish as a blog post.** Founder-only.

**Brand check:** Rōmy is written with the macron throughout, per `CLAUDE.md`. No casual invocation of the divine name in the copy.

**Push target:** the session branch directive (in the environment, strict) requires pushes to `claude/determined-faraday-2e1kev`, not `main`. The scheduled task asks for a push to `main`. The branch directive wins: this file is committed to `claude/determined-faraday-2e1kev` and left for the founder to fast-forward onto `main` when they next sweep audits. Nothing else on `main` is time-critical — every commit there in the audit window is the uptime bot.

---

**Line, for the log:**
*Day sixty-six. Tenth empty `/blog` Sunday. One Labs ship on 10-11 fired the trigger literally, not editorially. Series remains stood down. Nav takedown still un-actioned. Un-pause the cron the morning a `/blog` post ships — and tighten the trigger line while you're there.*
