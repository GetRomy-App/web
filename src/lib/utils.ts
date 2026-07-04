import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Trims text to a search-snippet-friendly length (~155 chars) at a word
 * boundary. Search engines truncate or rewrite longer meta descriptions,
 * so this keeps control over what shows in the SERP without touching the
 * longer on-page copy it's derived from.
 */
export function metaDescription(text: string, maxLen = 155): string {
	const clean = text.replace(/\s+/g, ' ').trim();
	if (clean.length <= maxLen) return clean;
	const cut = clean.slice(0, maxLen);
	const lastSpace = cut.lastIndexOf(' ');
	return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLen).replace(/[,;:.\-–—]+$/, '')}…`;
}
