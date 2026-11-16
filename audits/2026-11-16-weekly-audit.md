# Weekly Blog Audit — Week of 2026-11-10 → 2026-11-16

**Auditor:** Marketing director, Red Bull CMO bar
**Posts shipped in this strict seven-day window:** **0 of 7 days.**
**Last post that shipped:** *PIF-Bench v2* — 2026-10-11. **Thirty-six days of silence.**
**Last Field Note that shipped:** *The Booth at the Perkins Off Highway 2* — 2026-08-14. **Ninety-four days since the voice was in print.**
**Scope of this audit:** The 2026-11-09 receipt said the next one should be two paragraphs, not fifteen, if the silence held. It held. This is the short version.

---

## The strategic note the eighth zero-posts receipt earns

The trigger has fired once in eleven weeks. The resumption test the audit series has carried since September — *two posts in a single audit window* — has never fired. The pattern is settled: **the Field Notes series was a nine-week August campaign, not a standing property, and the 10-11 benchmark drop was a solo research release, not the start of a second beat.** The site should say so.

Two moves, pick one. No third option this week.

1. **Retire the `/blog` link from the landing.** `src/lib/components/landing/Navbar.svelte:47` and `:119`. One line of code each, reversible the hour a post lands. The landing stops pointing warm traffic at a page whose top card is a research summary and whose Field Notes archive underneath has not been touched in ninety-four days.
2. **Relabel `/blog` as an archive.** If the link stays, rename the landing's blog entry to *"Archive"* or *"Field Notes (Aug 2026)"* so the dates on the page match the label. Honest framing beats a "Blog" link that implies a cadence the site is not keeping.

Verified this morning: newest `date:` in `content/posts/*/index.mdoc` is **2026-10-11**, unchanged. `git log --since='2026-11-09' -- content/posts/` returns zero post commits. `/blog` link still live. The audit series will stop issuing weekly zero-count receipts after this one — the next audit will run only if a new `date:` later than 2026-10-11 lands, or if the founder resolves the navbar question. Both of those are events worth a receipt. A ninth "nothing shipped" is not.
