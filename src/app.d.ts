// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			seo?: import('$lib/seo').SeoData;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
