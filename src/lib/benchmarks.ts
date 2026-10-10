// PIF-Bench v2 — October 2026. Every figure below comes from the published runs in
// github.com/getromy-app/pif-bench (leaderboard/packet-2026-10 and leaderboard/live-2026-04-25),
// graded by a blind judge against rubrics written before any system ran. Update them from those
// reports only — never by hand.

export interface BenchmarkBar {
	name: string;
	/** 0–100, the bar's length. */
	score: number;
	highlight: boolean;
}

export interface BenchmarkDimension {
	label: string;
	subtitle: string;
	bars: BenchmarkBar[];
}

export const PIF_VERSION = 'PIF-Bench v2 · October 2026';
export const PIF_REPO = 'https://github.com/getromy-app/pif-bench';

/** Live track: four products' April 2026 reports on four real prospects, re-graded blind. */
export const PIF_LIVE: BenchmarkDimension = {
	label: 'Live track — share of checks met',
	subtitle:
		'Donor reports each product wrote on April 25, 2026 for four real philanthropists, graded on 59 dated, sourced checks. No product met every check for any prospect.',
	bars: [
		{ name: 'Claude.ai', score: 83, highlight: false },
		{ name: 'Rōmy', score: 74, highlight: true },
		{ name: 'Gemini', score: 67, highlight: false },
		{ name: 'ChatGPT', score: 60, highlight: false }
	]
};

/** Packet track: models on 20 synthetic development-office tasks. */
export const PIF_PACKET: BenchmarkDimension = {
	label: 'Packet track — tasks completed with every check met',
	subtitle:
		'20 tasks across prospect research, grants, gift compliance, major gifts, donor data and finance (259 checks), one attempt per model.',
	bars: [
		{ name: 'GPT-6.1 Sol', score: 95, highlight: false },
		{ name: 'Muse Spark 1.3', score: 95, highlight: false },
		{ name: 'Claude Opus 5.5', score: 95, highlight: false },
		{ name: 'Gemini 3.8 Flash', score: 70, highlight: false },
		{ name: 'MiniMax M3', score: 65, highlight: false },
		{ name: 'Gemini 3.1 Pro', score: 55, highlight: false }
	]
};

export const PIF_HEADLINE: BenchmarkDimension[] = [PIF_LIVE, PIF_PACKET];

/** Packet track, all-pass rate by area. */
const area = (label: string, subtitle: string, s: [number, number, number, number, number, number]): BenchmarkDimension => ({
	label,
	subtitle,
	bars: PIF_PACKET.bars.map((b, i) => ({ name: b.name, score: s[i]!, highlight: false }))
});

export const PIF_DIMENSIONS: BenchmarkDimension[] = [
	area('Prospect research', 'Namesake screening, a donor who has died, an ethics-screened profile, a sparse record', [100, 100, 100, 75, 100, 75]),
	area('Foundations & grants', '990-PF fit assessment, RFP compliance, grant-report variances', [100, 100, 100, 33, 33, 33]),
	area('Gift compliance', 'Gala receipts, a DAF grant for a gala table, stock-gift valuation, restricted endowments', [100, 100, 100, 75, 75, 50]),
	area('Major gifts', 'Portfolio moves review, campaign gift range chart, solicitation plan', [100, 67, 67, 67, 67, 67]),
	area('Donor data', 'Duplicates and households, gift-batch reconciliation, LYBUNT/SYBUNT retention', [100, 100, 100, 100, 33, 67]),
	area('Finance & governance', 'Form 990 ratios, the public support test, a conflict-of-interest review', [67, 100, 100, 67, 67, 33])
];

export const PIF_JUDGE = {
	fixtureVerdicts: 662,
	fixtureAccuracy: '100%',
	testRetest: '99.6%'
};

export const EVAL_PROMPT = `Research Agnes Gund as a potential major donor prospect for a nonprofit arts education program serving public school students in New York City. Provide a comprehensive donor intelligence report including:

1. Personal and professional background
2. Wealth indicators and asset profile
3. Known philanthropic giving history with specific amounts and recipient organizations
4. Cause areas and giving philosophy
5. Estimated giving capacity for a single gift to an arts education nonprofit
6. Recommended ask amount and engagement strategy
7. Key connection points and potential red flags

Cite your sources for every factual claim.`;

export const PIF_METHOD_NOTE =
	'Every check is a pass/fail test written before any system ran. Each report was graded blind — system names and citation tags removed, one deliverable at a time — by a judge whose accuracy was measured on planted errors mixed into the same pool (662 of 662 verdicts correct; 99.6% agreement with an independent second judging). All deliverables, verdicts and reasoning are published in the PIF-Bench repository.';
