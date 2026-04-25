export interface BenchmarkBar {
	name: string;
	score: number;
	highlight: boolean;
}

export interface BenchmarkDimension {
	label: string;
	subtitle: string;
	bars: BenchmarkBar[];
}

export const PIF_OVERALL: BenchmarkDimension = {
	label: 'Overall PIF-Score',
	subtitle: 'Average across 5 prospects (Scott, Powell Jobs, Gund, Hastings, Smith)',
	bars: [
		{ name: 'Romy', score: 93.5, highlight: true },
		{ name: 'Claude', score: 93.0, highlight: false },
		{ name: 'Gemini', score: 81.9, highlight: false },
		{ name: 'ChatGPT', score: 76.0, highlight: false }
	]
};

export const PIF_DIMENSIONS: BenchmarkDimension[] = [
	{
		label: 'Factual Precision',
		subtitle: 'Percentage of stated facts verified against public records',
		bars: [
			{ name: 'Romy', score: 94, highlight: true },
			{ name: 'Claude', score: 95, highlight: false },
			{ name: 'ChatGPT', score: 88, highlight: false },
			{ name: 'Gemini', score: 83, highlight: false }
		]
	},
	{
		label: 'Discovery Recall',
		subtitle: 'Percentage of known facts the system found',
		bars: [
			{ name: 'Romy', score: 97, highlight: true },
			{ name: 'Claude', score: 92, highlight: false },
			{ name: 'ChatGPT', score: 65, highlight: false },
			{ name: 'Gemini', score: 72, highlight: false }
		]
	},
	{
		label: 'Hallucination Rate',
		subtitle: 'Inverted: higher = fewer fabricated claims',
		bars: [
			{ name: 'Romy', score: 94, highlight: true },
			{ name: 'Claude', score: 95, highlight: false },
			{ name: 'ChatGPT', score: 90, highlight: false },
			{ name: 'Gemini', score: 86, highlight: false }
		]
	},
	{
		label: 'Capacity Estimation',
		subtitle: 'Accuracy and calibration of giving capacity estimate',
		bars: [
			{ name: 'Romy', score: 92, highlight: true },
			{ name: 'Claude', score: 90, highlight: false },
			{ name: 'ChatGPT', score: 72, highlight: false },
			{ name: 'Gemini', score: 60, highlight: false }
		]
	},
	{
		label: 'Source Attribution',
		subtitle: 'Percentage of claims with traceable citations',
		bars: [
			{ name: 'Romy', score: 95, highlight: true },
			{ name: 'Claude', score: 82, highlight: false },
			{ name: 'ChatGPT', score: 82, highlight: false },
			{ name: 'Gemini', score: 72, highlight: false }
		]
	},
	{
		label: 'Structural Completeness',
		subtitle: 'Coverage of sections a fundraiser needs',
		bars: [
			{ name: 'Romy', score: 100, highlight: true },
			{ name: 'Claude', score: 92, highlight: false },
			{ name: 'ChatGPT', score: 75, highlight: false },
			{ name: 'Gemini', score: 70, highlight: false }
		]
	},
	{
		label: 'Actionability',
		subtitle: 'Could a fundraiser make a qualified ask from this report?',
		bars: [
			{ name: 'Romy', score: 95, highlight: true },
			{ name: 'Claude', score: 93, highlight: false },
			{ name: 'ChatGPT', score: 70, highlight: false },
			{ name: 'Gemini', score: 73, highlight: false }
		]
	}
];

export const PIF_WEIGHTS = {
	fp: 0.20,
	dr: 0.10,
	hr: 0.25,
	cea: 0.15,
	sa: 0.10,
	sc: 0.05,
	act: 0.15
};

export const EVAL_PROMPT = `Research MacKenzie Scott as a potential major donor prospect for a mid-sized education nonprofit based in Atlanta, Georgia. Provide a comprehensive donor intelligence report including:

1. Personal and professional background
2. Wealth indicators and asset profile
3. Known philanthropic giving history with specific amounts and recipient organizations
4. Cause areas and giving philosophy
5. Estimated giving capacity for a single gift to an education nonprofit
6. Recommended ask amount and engagement strategy
7. Key connection points and potential red flags

Cite your sources for every factual claim.`;
