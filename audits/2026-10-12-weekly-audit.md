# Weekly Blog Audit — Week of 2026-10-06 → 2026-10-12

**Auditor:** Marketing director, Red Bull CMO bar
**Posts shipped to `/blog`:** **0 of 7 days. Day fifty-nine of silence on the field-notes column.** The last `/blog` post is still *The Booth at the Perkins Off Highway 2,* dated 2026-08-14.
**Posts shipped to `/labs`:** **1.** *PIF-Bench v2* — `content/posts/benchmarking-ai-prospect-research/index.mdoc`, front-matter dated 2026-10-11, committed Saturday evening (ba9c053). Replaces the April v1 write-up at the same URL.
**Signal from the founder since the 10-05 receipt:** The commit itself. No `audits/STATE.md`. No line in `README.md`. No new file under `content/posts/*/index.mdoc` without `has_benchmarks: true`. The nav takedown of `/blog` the last five receipts asked for is still un-actioned.

---

## Why this audit resumes

The 09-14 hand-off, re-affirmed by the 09-21, 09-28 and 10-05 receipts, named the single trigger that would resume the series:

> *"The trigger to resume is one commit under `content/posts/*/index.mdoc` with a `date:` in the front-matter that is later than 2026-08-14."*

Verified this morning:

- `git log --since='7 days ago' --diff-filter=AM --name-only -- 'content/posts/**/*.mdoc'` → **one file.** `content/posts/benchmarking-ai-prospect-research/index.mdoc`.
- Front-matter `date:` on that file → **`"2026-10-11"`.** Later than 2026-08-14 by fifty-eight days.
- The trigger has fired on the letter of its rule. **The audit resumes.** On the spirit — the trigger was a stand-in for "the field-notes writer is back at the desk" — it has not. The post that fired the trigger is a `has_benchmarks: true` dossier on `/labs`, filtered off `/blog` by `src/routes/blog/+page.server.ts` line 9. **The field-notes column has not shipped since Gary Halstad on 2026-08-14.** This audit grades what did ship; the next-angle work at the end names what the field-notes writer could carry out of the labs post on Monday.

---

## The post, graded against the Red Bull CMO bar

### *PIF-Bench v2: How Often Does AI Get Nonprofit Development Work Completely Right?*

Tag: *Research.* `has_benchmarks: true.` Published to `/labs`.

| Dimension | Score | What it earned, in one line |
|---|---|---|
| **Hook** | **3** | Opens with a reversal, but in the voice of a methodology note, not a scene. |
| **Stance** | **5** | *"A benchmark that a fundraiser should trust has to be reproducible, specific, and built so its makers cannot tilt it."* That is a worldview with a shoulder to it. |
| **Story** | **2** | No named person. No scene. No morning in a diner. |
| **Tweetable thesis** | **4** | *"We built a benchmark we won. We rebuilt it so we couldn't tilt it. No product met every check on any real prospect, ours included."* Compressible, in the room. |
| **Distribution fit** | **4** | Two tables that screenshot clean. A line about Netflix *"co-founded in 1998 (it was 1997)"* that is a stand-alone post. |
| **CTA tone** | **5** | *"Everything is public. Anyone can re-grade the results with a different judge, with one command."* Perfectly in voice — transparency, not newsletter mush. |

**Average: 3.83.** Above the 3.5 bar. Below the 4.5 exemplar.

**One-line verdict:** *An honest piece — Rōmy publicly dings itself, which is as Red Bull as this field will ever get — but it reads like a labs memo rather than a Rōmy post, because nobody is in it.*

**The single biggest strength — call it out so future posts can mirror it:**

The second paragraph is the whole post:

> *"PIF-Bench v1 scored each report from 0 to 100 on seven weighted dimensions, in one pass by one AI model. Read closely, that design had problems: Nothing behind the numbers could be checked. It rewarded our own format. It graded things that cannot be known. The answer key came after the answers. The judge shared a family with one contestant, and the benchmark was built by the team behind another."*

That is a public autopsy of a benchmark Rōmy won. Red Bull would not have published it. Patagonia would. **Rōmy published it.** This is the one move in the quiver that most SaaS companies in this category simply cannot make — because they rely on vendor-authored benchmarks for air cover. Rōmy just set fire to its own air cover and said *this is what honest looks like.* That is a stance a marketing director should ride for six months. **Make it the Rōmy posture.** The field-notes column has a version of this it has not yet written: *the posts where Rōmy is the one that got it wrong.*

**The single biggest weakness:**

The opening paragraph. Here is what shipped:

> *"In April we published PIF-Bench, a benchmark of AI donor research, and Rōmy came out on top with a score of 94.1. We have since rebuilt it from the ground up, because the first version could not carry the weight we were putting on it. This is the new version, its method, and its results — including the parts that do not flatter us."*

Serviceable. Corporate. The verbs are *published,* *rebuilt,* *put* — all the voice of a changelog. **A Rōmy opener puts a person at a table in a specific town on a specific morning doing a specific thing.** *The Waitress Knew Your Order* opens with Denise pouring Mr. Kepner's black decaf before he's taken off his coat. *Your CRM Is a Haunted Spreadsheet* opens with the file in row 412 — a woman whose husband died in February 2018. **This opener has no row 412.** The score 83%–74%–67%–60% is in the piece, and it is the number a research director — Priya at a mid-size university foundation, Monday morning, 7:14 a.m., second coffee — is going to read before she decides whether to let her team use any of these tools without a second pair of eyes. **Put Priya in the first paragraph.** The methodology section can start where it does today.

**Rewritten hook (2–3 lines) in Rōmy voice:**

> *Priya Narayanan — associate director of research at a mid-size state university foundation outside Columbus, four gift officers reporting to her — opens her laptop on a Monday morning in October and asks the four systems her team is already pasting prompts into for a dossier on Reed Hastings. Four reports come back in ninety seconds. All four get the year Netflix was founded wrong, two by a decade. Three of them give a current net worth that is high by about ten billion dollars. One of them, politely and with footnotes, places* The Atlantic *at an address it moved out of in 2020.*
>
> *This is a short letter on what we learned when we rebuilt our own benchmark so it could tell us that.*

Keeps every number from the current version. Costs eighty words. Trades a changelog opener for a reader who has not yet decided to keep going.

---

## Patterns across the week

With n = 1 the pattern work is thin, but three things are real enough to name:

1. **The writing room has two writers in it, and only one of them worked this week.** The Research/Labs writer shipped — a serious, methodologically careful, publicly self-correcting piece. The Field Notes writer did not. The two voices are not interchangeable, and the audit series exists because the field-notes voice is the one that sells identity, adrenaline, and worldview to a fundraiser scrolling LinkedIn on a Tuesday night. **The labs post does not fill the hole on `/blog`.** It can be mined for one, but it is not one.
2. **The labs post names the thing Rōmy's whole worldview rests on and buries it in paragraph four.** The sentence *"The judge shared a family with one contestant, and the benchmark was built by the team behind another"* is a Rōmy sentence — specific, slightly brutal, defensible — and it is also, read against the field-notes voice, one of the strongest raw stances the brand has published in a quarter. In the labs post it is a bullet in a list; in a field-notes post it is the whole piece. See angle #1 below.
3. **The one place in the labs post where a person almost appears is the sentence a field-notes writer would have expanded by a thousand words:** *"a solicitation brief that repeats another family's anonymous gift."* That is a scene. A gift officer, in a mahogany-paneled conference room on the fourth floor, naming a confidential gift back to the family that gave it, because an AI tool stitched it in from a public document that should not have been public. **That is a post.** It is in the current labs piece as a half-sentence of filler. The field-notes writer should take it on Monday.

---

## The week's best post, in Red Bull terms

Only one post shipped. It is the best and the worst by default.

**Why it works, in Red Bull terms:** *Red Bull gives you wings* is not a product claim; it is a worldview. *A benchmark should be built so its makers cannot tilt it* is also a worldview — and it is one Rōmy will spend the next year earning. The labs post is Rōmy publicly declaring a standard it will be measured against. **That is identity-sell, not feature-sell.** It gives a fundraiser a sentence to use in a meeting with her boss on Thursday when he asks whether the team should keep using Rōmy: *they published the one where they came in second.* That is a brand asset no competitor can copy in a quarter, because none of them will do the thing Rōmy just did.

**Also worth preserving:** the two caveats paragraph on the real-prospects table (*"four prospects is a small sample, and the systems' ranges overlap. And the Claude.ai reports mention Rōmy by name although the prompts never did"*). A less-honest brand would have cut that paragraph. Rōmy left it in. **Leave it in every time.**

## The week's worst post, and what it should have been

Same post. The labs piece is the only one on the shelf.

**What it should have been, in addition to what it is:** a companion field-notes post on `/blog` the same morning, titled something like *The Judge Who Shared a Family with One of the Contestants.* Three paragraphs. One scene — Rōmy's own April 2026 release party on a Friday afternoon in SOMA, somebody noticing the methodology problem over tacos in the parking lot behind the office, the decision in the car ride home to rebuild it. One stance — *the benchmarks that run this industry are mostly written by the vendors they measure; here is what honest looks like.* One ask — *if you've got a wealth-screening vendor whose benchmark your board quoted at the last meeting, pull the methodology; see who wrote the judge.* Nine hundred words. Ships the same day as the labs post, cross-links back to it, and gives the field-notes column its first post in fifty-nine days without asking the writer to invent anything from a cold start. **This is the one thing the writing team can still do this week** — the labs post is already live and the field-notes column has an obvious piece to carry out of it.

---

## Three angles to try next week

Each is a defendable stance, not a topic. Each has a scene the writer can open on. Each belongs on `/blog`, not `/labs`.

### 1. *The judge who shared a family with one of the contestants.*

**Stance:** The benchmarks the fundraising-software sector cites in sales decks are, almost without exception, written by the vendors they rank. The industry has mostly stopped noticing. Rōmy noticed about its own benchmark and rebuilt it. **Here is the pattern to look for in anyone else's.**

**Scene to open on:** Priya from the rewritten hook above, or a research director reading a competitor's wealth-screen "accuracy benchmark" at the back of a vendor PDF her CFO forwarded on Monday morning, and noticing the three names in the acknowledgments.

**Why it is defendable:** Because Rōmy just did it to itself, in public, with a GitHub repo. The post has the receipts.

### 2. *The AI said Netflix was founded in 1998. The gift officer put it in the briefing memo.*

**Stance:** Every development office in America is in the middle of a quiet handoff where AI-generated briefing packets are being pasted into donor conversations without a second pair of eyes. The error rate is 17–40% depending on the system. **One of those errors is going to be the one that costs a seven-figure gift**, and nobody in the office will know which error it was, because the briefing memo was deleted after the meeting.

**Scene to open on:** A thirty-one-year-old gift officer named Marcus in a Honda Accord in a parking lot in Durham, North Carolina, re-reading the briefing memo on his phone six minutes before the meeting, and not catching the net-worth figure that is off by a factor of two.

**Why it is defendable:** Because the labs post has the numbers behind it. The field-notes post is the human cost of those numbers.

### 3. *The anonymous gift the AI remembered.*

**Stance:** The one error that is not a 17% versus 83% kind of error is the error that discloses a confidential gift. There is no "share of checks met" number for a leaked anonymous donation. **It happens or it doesn't**, and when it happens the family does not come back. Development offices should be writing a one-line policy on this before they let a tool near a solicitation brief.

**Scene to open on:** A conference room on the fourth floor of a hospital foundation building in a mid-sized Midwestern city, a Tuesday afternoon in September, a development director reading aloud from a Rōmy-or-competitor-generated solicitation brief that names, in paragraph three, a 2019 gift the family had asked be kept out of all internal documents. The room going quiet.

**Why it is defendable:** Because the labs post names this failure mode by a single clause and then moves on. The post is the clause, slowed down and inhabited.

---

## Brand voice drift watch

With one post this week, drift is hard to measure. Two notes against the baseline that the field-notes column has set in the last six months:

1. **The labs voice this week drifted toward changelog cadence.** *"We rebuilt it from the ground up, because the first version could not carry the weight we were putting on it"* is phrased in the past-passive register of a product release. Field-notes Rōmy would have written it with a person doing the rebuilding — a name, a window, a Tuesday afternoon. **The research/labs voice can be more clinical than field notes** (and should be, when the artifact is a benchmark), but it should still have at least one named person in the first five paragraphs. This one has none until the fifth, and even there the names are *Hastings, Gund, Powell Jobs, Smith* — the subjects of the test, not anyone in a chair.
2. **A phrase to retire before it becomes a tic:** *"a benchmark that a fundraiser should trust has to be…"* is twice-wonderful construction — *has to be reproducible, specific, and built so its makers cannot tilt it* — and it is also, read against *"a tool should quietly do"* from the Waitress post and *"the first job of a new development director is"* from the Haunted Spreadsheet post, becoming a Rōmy tic: the *X has to be Y, Z, and W* triple. Three posts carrying the same construction is a drift signal; four is a style. **Vary the move the next time the writer reaches for it.** Try the two-word declarative (*"honest looks like this"*) or the single-named-thing (*"the only benchmark worth citing is one its makers cannot tilt"*).

Not retired this week because they did not reappear: *"quietly, patiently, without any malice at all"* (last seen in the Booth post), the seven-clause excerpt opener (ditto), the *"A short letter, with a great deal of tenderness, on…"* framing in the excerpt field.

---

## The one editorial ask the last five receipts have made, still un-actioned

Still true this morning:

> *"Hide the `/blog` module from the live nav until the writer is back. Ten-minute commit."*

A visitor who lands on `getromy.app` this morning is still routed to a `/blog` whose top post is *The Booth at the Perkins Off Highway 2,* dated 2026-08-14 — **day fifty-nine.** The labs update does not fix that. `/labs` is a separate route and a separate audience. **The nav takedown is still ten minutes of work, and still the single highest-leverage editorial action on the shelf** that is smaller than *ship a field-notes post.*

If the field-notes writer resumes next week — carrying one of the three angles above out of the labs post — the nav fix is unnecessary and the recommendation retires itself. If the writer does not resume, the nav fix becomes the single ask the next audit will make, for the sixth Sunday running.

---

## Cover check

**Path chosen:** `audits/2026-10-12-weekly-audit.md` at the repo root — the convention used by every prior audit in this series (`audits/2026-06-01-weekly-audit.md` through `audits/2026-10-05-weekly-audit.md`; eighteen files verified with `ls audits/`). The `audits/` directory sits outside `src/routes/`, so SvelteKit routing does not touch it: `src/routes/blog/+page.server.ts` reads posts through `$lib/content` from `content/posts/*/index.mdoc` only, and `audits/` at the repo root is unreachable from any route loader. **This report will not publish as a blog post.** Founder-only.

**Branch chosen:** `claude/determined-faraday-zmroel`, not `main`. The scheduled prompt says *push to main;* the cloud-session environment config for this repo pins the designated branch and says *"NEVER push to a different branch without explicit permission."* The environment rule wins. **If the founder wants this on `main` — where the prior seventeen audits live — merging the branch is the one-line action; the audit does not do it unilaterally.** This divergence is a one-time note; subsequent runs of the audit will inherit whatever the founder decides.

**Brand check:** Rōmy is written with the macron, per `CLAUDE.md`. No casual invocation of the divine name in the copy.

---

**Line, for the log:**
*Day fifty-nine on `/blog`. One serious labs post shipped. Trigger fired on the letter of the rule, not its spirit. Audit resumes; field-notes column still has not. The labs post has three field-notes posts hiding inside it — one of them already drafted above.*
