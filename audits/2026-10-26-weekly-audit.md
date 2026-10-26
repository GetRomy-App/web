# Weekly Blog Audit — Week of 2026-10-20 → 2026-10-26

**Auditor:** Marketing director, Red Bull CMO bar
**Posts shipped in this strict seven-day window:** **0 of 7 days.**
**Last post that shipped:** *PIF-Bench v2* — Sunday, 2026-10-11. **Fifteen days of silence since.**
**Last audit written:** 2026-10-05 — the fifth consecutive zero-posts receipt.
**Audits written since:** None. The cron produced no file on 2026-10-12 or 2026-10-19.

---

## What changed since 2026-10-05

The resume trigger that every receipt from 2026-09-14 → 2026-10-05 named — *"one commit under `content/posts/*/index.mdoc` with a `date:` in the front-matter later than 2026-08-14"* — **fired** on 2026-10-11 with `benchmarking-ai-prospect-research`. That is the signal those four receipts told the next auditor to watch for. It arrived, and neither of the two scheduled audits that followed (2026-10-12 and 2026-10-19) wrote a file. **This audit is the first since the resumption.**

Verified this morning, in order:

- Front-matter `date:` scan of `content/posts/*/index.mdoc` → newest head **2026-10-11** (`benchmarking-ai-prospect-research`). Previous head **2026-08-14** (`the-booth-at-the-perkins-off-highway-2`). One post in **fifty-eight days**, then fifteen more days of silence.
- `ls audits/` → latest file `2026-10-05-weekly-audit.md`. No `2026-10-12-weekly-audit.md`. No `2026-10-19-weekly-audit.md`.
- `git log --since='2026-10-05' -- content/posts/ src/routes/blog/ README.md` → one commit touching those paths, and it is the 10-18 uptime-bot squash that re-ingested the full tree. Zero human editorial commits in the strict seven-day window.
- `ls audits/STATE.md` → **does not exist.**
- `grep -nE '/blog' src/lib/components/landing/Navbar.svelte` → `/blog` link **still live** at lines 65 and 137. The nine-week-old ask ("hide `/blog` until the writer is back, or let the resumed post own the landing") is now a two-post ask: the top of `/blog` is the Oct 11 research write-up on top of a Field Notes series the casual reader came to click.

The window this audit was asked to grade — 2026-10-20 → 2026-10-26 — is empty.

---

## The one post the audit series still owes a grade

Because the 10-12 and 10-19 audits did not fire, the single post inside the resumption window sits un-audited. Red Bull CMO grading, for the founder's eye, so the next piece in this genre has the receipt to work from:

### *PIF-Bench v2: How Often Does AI Get Nonprofit Development Work Completely Right?* — 2026-10-11

**Average: 3.5 / 5 — at the bar, not over it.** Strongest piece on the blog in six months on *stance*. Weakest in six months on *voice continuity*. Full breakdown:

- **Hook — 2 / 5.** Opens: *"In April we published PIF-Bench, a benchmark of AI donor research, and Rōmy came out on top with a score of 94.1."* That is feature-announcement grammar — ingredients, not identity. Red Bull never opens with "we published." The next sentence saves it — *"because the first version could not carry the weight we were putting on it"* — but by then the scroll has moved. The hook that is *in* the piece and should have been *first*: **"We rebuilt our own benchmark because the version that scored us #1 was built so we could not lose. On the stricter version, no AI product — ours included — got a single prospect report completely right."**

- **Stance — 5 / 5.** This is where the post earns its page. The bullet list in *Why we rebuilt it* is a prosecution of our own prior work:
  > *"It rewarded our own format."*
  > *"The answer key came after the answers."*
  > *"The judge shared a family with one contestant, and the benchmark was built by the team behind another."*

  A rival firm would need three days to write that paragraph. We wrote it about ourselves. That is identity, not product copy, and it is the first time this blog has defended a stance the vendor-marketing crowd cannot copy without losing teeth.

- **Story — 2 / 5.** No people. The series' trademark — Mrs. Eliason, Gary Halstad, Bob Halvorsen, Aidan Merritt — is absent. For a Research-tagged post this is correct in genre, but a reader who came for *The Wednesday Route* and clicked this will feel the voice swap. The failing checks have scenes in them that were not written down: *"a memo on a restricted endowment that never mentions asking the donor"*, *"a solicitation brief that repeats another family's anonymous gift"*. Those are the Mrs. Eliasons of this post, and they are listed, not seen.

- **Tweetable thesis — 4 / 5.** It is in the piece but not surfaced: *"No AI tool got a single prospect report completely right. Ours missed 26% of the checks. We are publishing the misses."* That line should be the pull-quote. It is the whole case.

- **Distribution fit — 3 / 5.** The results tables (*"Every check met: 0 of 4"*) are the strongest screenshot asset the blog has shipped this year. But they sit under ~650 words of methodology, which is where a mobile reader bounces. The *results* should have been above the fold, with method underneath. The two live-track quotes that would land on Twitter — Netflix "co-founded in 1998" when it was 1997, Monumental Sports listed as a current holding after its 2025 sale, Reed Hastings's stake given as 4.8% when it is under 1% — are buried on screen three.

- **CTA tone — 5 / 5.** *"Check our work."* Links to the repo, the methodology, the archived v1, the contributing guide. No newsletter signup, no demo booking. Exactly the right close for a post whose argument is *"benchmarks you cannot audit are worth zero."*

**The one-line lesson for the next benchmark post:** write the results first and bury the methodology. The second-strongest line in the piece — *"The headline from v1 — that one system was '94% accurate' — does not survive a stricter test"* — belongs in paragraph two, not paragraph twenty.

---

## The pattern of the resumption

One post in fifteen days, in a different genre than the series' voice. **One post is not a cadence. It is a flutter.** Three risks worth putting on the record so the next audit can test them:

1. **Series-tag drift.** The nine posts before the 08-14 pause were `tag: "Field Notes"`. The resumption post is `tag: "Research"`. If the writer is back but on a different beat, that is a strategic choice worth stating out loud; if the writer is only back for one benchmark release, then `/blog` now opens with a research write-up on top of a Field Notes series, and a reader who clicked through from *Forty-Two Jars* on social will leave confused.
2. **Methodology-first default.** The 10-11 post defends itself before it sells its case. Red Bull does not defend; it declares. Next time: declare first, defend in the footnotes.
3. **Silence after the resumption.** Fifteen days with no second post is not a resumption; it is a benchmark drop followed by a return to silence. If this audit lands and the writer is still away, the live editorial state is *"one research post, no fiction, no cadence yet."* The next audit should test whether 10-11 was the start of a cadence or an isolated release.

---

## Three angles the next audit expects to see tried

Each a stance, not a topic. Each one the series has already earned the right to say flatly:

1. **"Your biggest donor is the one your CRM told you not to upgrade."** The series owns this stance — Gary, Aidan, Bob, Mrs. Eliason all live inside it — and it has never been named flatly on its own. One Field Note that says it in two lines and uses the three names as receipts.
2. **"Capacity screening is astrology for finance majors."** The capacity-is-a-lookup post from August was close. The PIF-Bench v2 bullet — *"Capacity was scored against 'verified actuals' — but no one knows a living donor's true giving capacity"* — is the thesis standing on its own. Pull it out, two hundred and fifty words, no methodology.
3. **"We lost on our own benchmark on purpose."** A short counter-brief to PIF-Bench v2 — not more methodology, the opposite: *why we would rather be fourth and honest than first and tilted*. The Red Bull-CMO take on 10-11 in the voice that 10-11 declined to use.

---

## Brand-voice drift watch

One tic from the 10-11 post, flagged early so it does not harden:

- *"the kind that reach donors"* / *"a careful researcher could send without corrections"* — the piece half-translates its stance into generic SaaS reassurance in its closing paragraphs. The last two sentences of the piece are a measurable step down in confidence from the first five hundred words. If the next Research post opens with method and closes with hedging, the edge dulls. **Keep closers as sharp as openers.**

The Field Notes voice has no such drift — the baseline on *Forty-Two Jars*, *The Wednesday Route*, *Mrs. Eliason's Blue Pen* and *The Booth at the Perkins Off Highway 2* is unchanged. The drift risk this quarter is specifically the Research tag.

---

## For the cron owner

Two Sundays of audits did not land: 2026-10-12 and 2026-10-19. The cron fired reliably every Sunday from 2026-06-01 through 2026-10-05 (eighteen weeks of receipts, counted). On the two Sundays after the resume trigger fired, no file was written. One of three things happened:

1. The session ran, found a non-empty window for the first time in weeks, and did not finish.
2. The session failed silently (worth checking the dashboard run logs for 2026-10-12 and 2026-10-19).
3. The schedule was manually paused and un-paused without a `STATE.md` note.

Worth a two-minute check of the cron run logs. The four prior receipts explicitly told the next auditor to watch for the signal that fired on 10-11, and no audit caught it until today.

---

## Resume trigger for the audit series (written forward)

- **If next Sunday's session finds a new post dated 2026-10-27 → 2026-11-02 under `content/posts/`:** write a full audit, as the task describes.
- **If next Sunday's session finds no new post:** write a one-page receipt, note that PIF-Bench v2 is now at twenty-plus days without a follow-up, and call whether this is a resumption or a second pause.

---

_Receipt written on 2026-10-26 against `main` at `3d635f8`. File: `audits/2026-10-26-weekly-audit.md`._
