# Weekly Blog Audit — 2026-05-25

**Reviewer:** Marketing Director (Red Bull CMO bar)
**Window:** posts shipped 2026-05-18 → 2026-05-24 (7 posts, one/day)
**Bar:** does it sell identity, adrenaline, and a worldview — not "does it describe the feature cleanly."

> Note on scope: the `git log -- src/routes/blog/` command in the brief returns nothing — posts actually live in `content/posts/<slug>/index.mdoc` and render through `src/routes/blog/[slug]`. A bulk macron-branding commit (f99c826, 05-22) touched all 25 posts, so a naive `--name-only` lists the whole archive. The seven below are the posts genuinely *added* this week (`--diff-filter=A`).

---

## 1. One-line verdict per post

| Date | Post | Avg | Verdict |
|---|---|---|---|
| 05-18 | The Trustee Who Said She'd Make Calls | **4.1** | Real stance on a tired topic ("the board did not break — the job we hand it is the wrong shape"), but the longest, most sermon-paced post of the week. Earns the read, then overstays it. |
| 05-19 | The Donor Who Outlasted Four of You | **4.5** | "Is Carol still there?" = "Do you still know me?" One of the two sharpest emotional turns of the week. Exemplary. |
| 05-20 | The Volunteer You Never Looked Up | **4.6** | "A volunteer is a major donor paying in a currency your database can't count." Best single thesis-line of the week. Exemplary. |
| 05-21 | The Room Was the Point | **4.5** | "The most expensive first date in town — and you keep grading it like a vending machine." A genuine reframe of a sacred-cow event. Exemplary. |
| 05-22 | On Asking Too Little | **4.8** | "Renée got the yes before the iced tea arrived." Best hook, tightest body, sharpest aphorisms. **Week's best.** |
| 05-23 | The First Gift Is a Question | **4.3** | "Four out of five isn't a retention problem. It's a problem of manners." Strong, but the template is now visibly load-bearing. |
| 05-24 | The Donor Nobody Owns | **3.8** | Above bar on craft, but the thinnest *scene* of the week and the fourth identical "secretly-wealthy overlooked donor" reveal. **Week's worst** — by formula fatigue, not by writing. |

**Every post cleared 3.5.** This is a writer operating well above the SaaS-blog baseline. The problem this week is not any single post. It's that there were seven of them and they are, structurally, the same post.

---

## 2. Patterns across the week

**We are not feature-listing — we have the opposite problem. We have one story and one stance, told seven times.**

1. **One template, xeroxed.** All seven posts run the identical skeleton:
   *Named character (age + job + one tender detail) → a scene with exact dollar figures and dates → "We've been thinking about [Name] a lot lately." → a "here's the thing nobody tells you" reframe → a bolded standalone aphorism → "What we want from a tool / Rōmy's job is not to…" → "The boring revolution, again" → "A small assignment, with love ♡".*
   On 05-18 this structure is invisible. By 05-24 a regular reader can predict the next header before scrolling to it. A Red Bull reader never feels the mold.

2. **One stance wearing seven name tags.** Walter, Ruth, Pilar, Diane, Ellen, the trustee, the volunteer — they are all *"the person your CRM is too dumb to see; software surfaces them, the human keeps the relationship."* That's a strong stance. It is also the *only* stance we took all week. Distribution-wise we shipped one idea five times and two adjacent ideas twice.

3. **The capacity reveal is now a punchline you can see coming.** Four of seven posts resolve with the *exact same* twist: the overlooked donor "sold a business," "sits on a foundation board," and "gave six figures to her alma mater / three organizations exactly like yours."
   - Ruth (05-20): "Her husband ran an HVAC company… She sold the business in 2018… capable of a six-figure gift."
   - Walter (05-22): "the business sale was in the trade press… six-figure gifts to three organizations exactly like Renée's."
   - Diane (05-23): "sits on two foundation boards and has given five figures to three organizations exactly like yours."
   - Ellen (05-24): "sold a business, sits on a foundation board, and has given six figures to her alma mater."
   The surprise that made Ruth land is gone by Ellen, because we've now run the reveal four times in five days.

4. **Two different Walters in one week.** The donor in 05-19 is *Walter Brenner*; the donor in 05-22 is also a *Walter*. In a brand universe this tightly drawn, naming two unrelated major donors "Walter" four days apart is a continuity slip readers *will* notice.

5. **The tool-pitch boilerplate has hardened into a single paragraph.** "a sourced picture… confirmed capacity, documented giving to organizations like yours… every claim hyperlinked to where it came from" appears near-verbatim in 05-20, 05-21, 05-22, 05-23, 05-24. It reads like a paste.

---

## 3. The week's best post — *On Asking Too Little* (05-22)

Red Bull terms: **it picks a fight in the first six words and never lets you sit down.**

- **Hook is one line and it's a dare:** "Renée got the yes before the iced tea arrived." No setup, no name-tag inventory — just tension. You read on to find out why a *yes* is a problem.
- **It attacks the reader's instinct, not a feature.** "We never learn to be suspicious of the yes." "You didn't ask Walter for a gift. You asked him for a tip." That reframes the reader's last easy win into a quiet failure — that's identity-level, not how-to.
- **The aphorisms are screenshot-ready and ~150 words apart:** "A yes that comes too fast… is a receipt for a number you picked out of fear." / "Confidence isn't a personality trait. It's just preparation you happened to do."
- **Tightest body of the week** — no sag, mobile-skimmable, every section pays.

This is the one to mirror: shorter, one clean blade of an idea, hook that's a provocation rather than a portrait.

---

## 4. The week's worst post — *The Donor Nobody Owns* (05-24)

Not badly written — *exhausted*. It's the fourth "secretly-wealthy overlooked donor" reveal in five days, and it has the least *scene* of the bunch. Ruth has the welcome-table coffee and the Portage Path house; Walter has the phone pause; Ellen has… exposition about portfolio thresholds. The character is the thinnest precisely when the formula needed the strongest character to disguise it.

**What it should have been:** not the fourth quiet-loyal-lady portrait, but the post that finally *names the structural villain* — the org chart gap with no owner — and leads with stakes instead of another sad December check.

**Rewritten hook (lead with the money and the fight, not the portrait):**

> There is a donor in your file worth a third of your revenue, and nobody in your building can tell you her name.
> She's too big for the mail robot and too small for the gift officer's lunch list — so she falls into the one role your org has never once staffed.
> She is the donor nobody owns, and right now that job opening is costing you more than any vacancy on your team.

That opens on tension (a third of revenue, nameless) and an unstaffed-role accusation — then you can *still* introduce Ellen, but as the face of a structural crime instead of the fourth instance of a pattern.

---

## 5. Three angles to try next week (stances, not topics)

Each is a defendable point of view — and deliberately *not* another "overlooked donor your CRM missed."

1. **"Stewardship is the lie we tell ourselves to avoid asking."**
   Orgs over-thank and under-ask because gratitude is emotionally safe and the ask is terrifying. The thank-you-note industrial complex is often just avoidance in a nice envelope. (Note: this productively *contradicts* 05-22's "ask for right" — let the blog argue with itself instead of nodding at itself.)

2. **"Your monthly donors are quietly firing you."**
   Sustainer giving feels like the loyal core, but it's the *most* neglected relationship in the file precisely because the money shows up on autopilot and never asks for attention. The silent cancel is the most expensive churn you don't track. New mechanism, new villain — not a hidden-capacity reveal.

3. **"Donor-advised funds turned generosity into a waiting room."**
   Billions parked in DAFs while the programs starve. The donor already *gave* — to a holding account you'll never meet. A real worldview fight with a sacred cow, and the adrenaline this week's posts (all internal, all gentle) didn't have.

---

## 6. Brand-voice drift watch — tics to retire

The voice is excellent and *that's the danger*: its signature moves have become reflexes. Flagging the ones leaning into self-parody:

- **"We've been thinking about [Name] a lot lately."** — 7 of 7. Was a heartbeat; is now a tell. Rotate it out of at least half of next month's posts.
- **"The boring revolution, again"** + **"Loud revolutions [X]. The boring one [Y]."** — 7 of 7. By day three it's a catchphrase, not a payoff. Retire or vary hard.
- **"A small assignment, with love ♡"** — 7 of 7. The ♡ is becoming a brand crutch. Keep the assignment, kill the auto-pilot framing.
- **"…(and why it isn't your fault)"** section header — 05-22, 05-23, 05-24. Three days running.
- **"The number nobody wants to look at"** — *identical* header on 05-23 and 05-24, consecutive days.
- **"Here's the thing nobody tells you."** — recurring connective tissue across multiple posts.
- **The "sold a business / foundation board / six-figures-elsewhere" reveal** — 4 of 7. The single most-overused beat; it has stopped surprising.
- **"The pen stays human. The [coffee/Saturday/swans] stays human."** — 05-20, 05-21 (+ variant 05-19). Cute once.
- **Two "Walter"s in one week** — tighten the name bible so the brand universe stays coherent.

**Bottom line:** the writing is well above bar; the *editorial discipline* is below it. We have a house style so strong it's collapsing into a house *formula*. Next week: fewer portraits, more provocations. Pick more fights. Break the template on purpose at least twice. The reader should not be able to guess the next header.
