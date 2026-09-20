export interface SeoData {
	/** Full <title> text, e.g. "Post Title — Rōmy Blog". */
	title: string;
	description: string;
	/** Route path starting with '/', used to build canonical + og:url. */
	path: string;
	type?: 'website' | 'article';
	keywords?: string;
	/** Absolute image URL; defaults to the site og-image when omitted. */
	image?: string;
}
