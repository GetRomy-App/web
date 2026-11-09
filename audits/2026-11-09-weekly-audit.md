# Weekly Blog Audit — Week of 2026-11-03 → 2026-11-09

**Auditor:** Marketing director, Red Bull CMO bar
**Posts shipped in this strict seven-day window:** **0 of 7 days.**
**Last post that shipped:** *PIF-Bench v2* — Sunday, 2026-10-11. **Twenty-nine days of silence since.**
**Last Field Note that shipped:** *The Booth at the Perkins Off Highway 2* — 2026-08-14. **Eighty-seven days since the voice was in print.**
**Last audit written:** 2026-11-02 — zero in-window; named the 10-11 release as a one-off, not a resumption.

---

## The short of it

Nothing to grade. Four weeks past the last byline, thirteen weeks past the last Field Note, and the resumption trigger the audit series has carried since September — *one commit under `content/posts/*/index.mdoc` with a `date:` later than the current head* — **has not fired a second time.** The 10-11 release is now a solo benchmark drop sitting on top of an archive. That is the pattern.

Verified this morning, in order:

- `for f in content/posts/*/index.mdoc; do grep -m1 '^date:' "$f"; done | sort -r | head -1` → **2026-10-11** (`benchmarking-ai-prospect-research`). Unchanged for four weeks.
- `git log --since='2026-11-02' -- content/posts/` → **zero commits** touching post files.
- `ls audits/` → 11 files, latest **`2026-11-02-weekly-audit.md`**. No skipped weeks.
- `grep -nE '/blog' src/lib/components/landing/Navbar.svelte` → `/blog` link still live at **lines 65 and 137**. The ask the audit series has carried since 2026-08-24 — *hide `/blog` until the writer is back, or let a fresh post own the landing* — is now **eleven weeks old and operationally free.**

The window this audit was asked to grade — 2026-11-03 → 2026-11-09 — is empty. There is nothing to score against the Red Bull bar.

---

## What a Red Bull CMO says to the seventh zero-posts receipt in ten audits

Not another gentle restatement of the trigger. The line that ends the pretense:

> **This is no longer a flutter and it is no longer a pause. It is the archive going public.**

The Field Notes series earned a readership — nine straight weekly days in August, a voice the sector did not have anywhere else — and the four months since have answered what happens when that voice stops. **It gets forgotten.** A reader who clicks `/blog` from the landing today lands on a research methodology post written in a different register, with the Field Notes archive underneath it like an obituary of the thing that made the blog worth linking to.

That is the state. The audit series does not need another receipt to confirm it.

---

## The resume trigger, restated and sharpened

Every audit since 09-14 has named the same signal:

> **One commit under `content/posts/*/index.mdoc` with a `date:` in the front-matter later than 2026-10-11.**

**It has fired once in ten weeks.** The next audit should treat anything less than two posts landing in its window as evidence the series is a quarterly beat, not a weekly one — and the strategic question stops being *"when does the writer come back"* and becomes *"should the landing still be pointing readers at a weekly-cadence blog that is publishing monthly at best."*

Two concrete tests the 2026-11-16 audit should run and name on its first page:

1. **Count of new `date:` entries > 2026-10-11.** Zero means week **five** of post-release silence and the 10-11 release is a one-off. One means a flutter. Two or more and the resumption is real.
2. **Tag of any new post.** `tag: "Field Notes"` would mean the voice is back. Another `tag: "Research"` would mean the beat has quietly changed and the landing's framing — *"Field Notes from Rōmy"* or whatever the current label is — needs to match the new reality.

---

## The three stances still on the table

Unchanged from 10-26 and 11-02. Each one a 250-word Field Note the series has every right to write today. The thesis is the title. No research required.

1. **"Your biggest donor is the one your CRM told you not to upgrade."** Gary, Aidan, Bob, Mrs. Eliason all live inside this line. One post. Three names.
2. **"Capacity screening is astrology for finance majors."** Pull the PIF-Bench v2 bullet out of the methodology and let it stand alone. The case is already written; it just needs to be in the voice that sells it.
3. **"We lost on our own benchmark on purpose."** The counter-brief to 10-11. Two hundred words, one pull-quote, the CMO take on the research post in the voice the research post would not use.

---

## Standing operational ask — elevate it

**Unresolved after eleven weeks.** `/blog` is linked from the landing navbar at `src/lib/components/landing/Navbar.svelte:65` and `:137`. This audit's recommendation is **no longer "either hide or pin."** It is this, in order of preference:

1. **Hide the `/blog` link from the landing until two posts have landed in the resumption window.** One line of code. Reversible the moment the writer is back. Stops pointing warm traffic at an archive.
2. **If hiding is not acceptable, retitle the landing's blog section to "Research & Field Notes"** so the 10-11 post reads on-brand at the top of the list rather than as an orphan. This is the cheap, honest acknowledgement that the beat has drifted.

The current state — a `/blog` link labelled "Blog" pointing at a page where the top card is a benchmark PDF summary and the series underneath has not been touched since August — is the worst of both: it costs a landing-page click and it pays nothing in return.

---

## Brand-voice drift watch

Nothing new to flag — no new copy to flag against. The 10-26 note still stands: **keep closers as sharp as openers; the PIF-Bench v2 close softened into generic SaaS reassurance and that is the tic to watch when the next post lands.**

A note to add this week: the audit series itself is starting to sound like the thing it audits. Four straight weekly receipts that begin with *"zero posts shipped"* and end with *"the recommendation stands"* is also a voice problem. **If the writer does not return by 2026-11-16, the next audit should be two paragraphs, not fifteen.** The receipts have been written; they do not need to be rewritten each week to be true.

---

## Bottom line

Twenty-nine days since the last byline. Eighty-seven days since the last Field Note. Seventh zero-posts receipt in the last ten scheduled audits. The 10-11 release was one post, not a return.

**Recommendation to the founder, in one sentence:** **by Friday 2026-11-13, either (a) ship one Field Note — 250 words, the thesis is the title, any of the three stances above — or (b) hide the `/blog` link from the landing navbar.** Not both strategies on the table; pick one. The audit series will stop restating this after one more week and will instead begin writing the strategic note the resumption-silence actually earns: *that the Field Notes beat was a nine-week campaign, not a standing property, and the site should say so.*
