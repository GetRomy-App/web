# Weekly Blog Audit — Week of 2026-09-01 → 2026-09-07

**Auditor:** Marketing director, Red Bull CMO bar
**Posts shipped:** **0 of 7 days.**
**Last post that shipped:** *The Booth at the Perkins Off Highway 2* — Thursday, 2026-08-14. **Twenty-four days of silence.**
**Signal from the founder since the last audit:** **None.** No commit to `main` naming the state, no line in `README.md`, no `audits/STATE.md`. The channel the last audit asked for was left empty.
**Headline:** **The threshold the 08-31 audit named has been crossed.** This audit ships the recommendation the last one held back.

---

## What the last audit asked for, and what arrived

The 08-31 audit closed with one request and one deadline:

> *"Before the next audit fires on 2026-09-07, the audit needs one line from you into a channel it can read (a commit message on `main`, a note in `README.md`, or a one-line file at `audits/STATE.md`) that says one of: `paused-until-YYYY-MM-DD`, `resuming`, or `retired`."*

Verified this morning:

- `git log --since='2026-08-31' -- content/ README.md audits/STATE.md` → **one commit, the uptime bot.** No editorial commit. No README change. No `STATE.md`.
- `ls audits/STATE.md` → **file does not exist.**
- Last post in `content/posts/*/index.mdoc` sorted by front-matter `date:` → **2026-08-14, *The Booth at the Perkins Off Highway 2.*** Unchanged from the last four audits.
- `/blog` index → **still opens with Gary Halstad, alone, at the top.** Fifth Sunday running.

The founder was given a week and three channels to say one word. The week ended and no word came. **The audit series has to treat that as the answer, not as more waiting.**

---

## The recommendation the last audit named

The 08-31 audit put this recommendation on the shelf, conditional on a fifth silent Sunday:

> *"A fifth Sunday of Gary Halstad at the top, alone, is the point at which the audit series has to recommend that the `/blog` index and the RSS feed be taken down until the writer is back."*

Today is that Sunday. **The recommendation ships:**

**Take `/blog` and the RSS feed out of the live navigation this week.** Not delete — take out of the header, out of the footer, out of the sitemap, out of the RSS handler, out of the "From the field" module on the marketing pages. The content stays in the repo. The URL `/{slug}` stays live for anyone who has a link. But a new visitor to `getromy.app` should not be routed to a page whose newest post is twenty-four days old and whose newest post is the same *Country Club Omelet at the Perkins* post the last four audits have flagged as the weakest post the blog has shipped in eleven weeks.

**Why now, and not two weeks ago:** the value of a "From the field" module to a visitor is that it *is* the field, live. A field the visitor learns is a month behind is worse than no field at all — it tells the visitor the company has drifted, and a company that has drifted is not a company they hand a donor file to. The math on a stale index flipped from *ambiguous* to *negative* somewhere around day fourteen; on day twenty-four it is not close. **Every day the module stays up costs more than a day it were down.**

**What the take-down is not:**
- **Not a retirement.** The posts stay in the repo. The `/{slug}` URLs keep resolving. Anyone linking to *The Tuesday the Money Landed* or *Capacity Is a Lookup* keeps their link.
- **Not a `410 Gone`.** No `robots.txt` change. No sitemap removal that would tell Google the archive is dead. This is a **product decision about the front door,** not a content decision about the archive.
- **Not a `no-index` on the archive.** Existing search traffic to the strong old posts (*Capacity Is a Lookup* the strongest at 4.33; *The Tuesday the Money Landed* at 4.7) is a permanent asset. Do not spike it.
- **Not permanent.** The module comes back the morning the writer resumes. **The commit that removes the nav link is the same commit that removes the `paused-until` file when the pause ends.**

**What the take-down is:**
- A `has_active_blog: false` flag in `data/site.json` (or the equivalent single source of truth this repo uses for the marketing pages).
- Header, footer, and hero "From the field" module read that flag and hide the `/blog` link when false.
- `/blog` itself still renders, but with a two-sentence note at the top: *"Field Notes is on a rest. The archive is here. The next post will be announced when it lands."* No apology, no reason, no date the audit does not have.
- The RSS handler at `/blog/rss.xml` (or wherever it lives — verify) returns the archive as it stood on 2026-08-14, and a `<lastBuildDate>` of the same. **Do not push the RSS to a "we are on hiatus" item;** a subscriber who has already unsubscribed does not need to be re-notified, and a subscriber who has not should not be told the thing they subscribed to is on hiatus. Just stop pushing new items.

**One commit. One file changed. Ten minutes of work.** The audit is not asking the founder to write anything. It is asking the founder to move a flag.

---

## The one-line-from-the-founder request is now overdue, not withdrawn

The 08-31 audit asked for `paused-until-YYYY-MM-DD`, `resuming`, or `retired`. **That request is still open.** The take-down above is what the audit series recommends *in the absence* of a signal. It is not a substitute for the signal. **The audit needs the word so the next audit can either stand down or ship the next recommendation** (which, if silence continues into the week of 09-14, is that the audit itself pauses — a weekly cron writing eleven paragraphs into an empty room is a burn rate the founder should not be paying for).

The three options and what each means for the next audit:

- **`paused-until-YYYY-MM-DD`** in a commit message, a README line, or `audits/STATE.md`. → The audit series pauses itself through that date. The takedown recommendation above still stands for the interim, because a visitor who arrives on day thirty-one of a paused blog is not helped by a promise the audit cannot see. **A pause on the audit is not a pause on the front-door decision.**
- **`resuming`** with a first post shipped by 2026-09-11 (Wednesday). → The takedown recommendation is withdrawn. The audit resumes normal grading the following Sunday.
- **`retired`.** → One farewell post from the writer, in the writer's voice. The blog module comes down permanently, the archive stays live, the RSS handler returns a final `<item>` linking the farewell, and the audit series files its own close-out.

**Any of the three is a legitimate answer. None-of-the-above is not.** Twenty-four days of silence, with the deadline named a week ago and passed, is the shape of a decision that was made and not communicated. The audit can no longer act as if the decision is pending.

---

## What this audit is not doing

There is no scoring table this week. There are no posts to grade. There is no *"three angles to try next week"* — an angle is a suggestion to a writer who is writing, and this writer is not. There is no *"brand voice drift"* section — the phrases the last three audits asked to retire are being retired by the same mechanism that is retiring the blog. **The one thing worth carrying forward, when a first post ships:** the Rosa Delgado / gift-processing-manager / 7:41 a.m. Monday post named in seven consecutive audits is still the right post to open with, and *the first paragraph should acknowledge, inside the voice, one sentence, that a beat was missed.* Not an apology to the reader — a nod to the reader. The reader has been keeping the appointment; the blog has not.

---

## Cover check

**Path chosen:** `audits/2026-09-07-weekly-audit.md` at the repo root — the convention used by every prior audit in this series (`audits/2026-06-01-weekly-audit.md` through `audits/2026-08-31-weekly-audit.md`; thirteen files verified with `ls audits/`). The `audits/` directory sits outside `src/routes/`, so SvelteKit routing does not touch it: `src/routes/blog/+page.server.ts` reads via `getAllPosts()` from `$lib/content`, which scans `content/posts/*/index.mdoc` only, and `audits/` at the repo root is unreachable from any route loader. **This report will not publish as a blog post.** Founder-only.
