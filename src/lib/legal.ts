import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import Markdoc from '@markdoc/markdoc';

const LEGAL_DIR = path.join(process.cwd(), 'content', 'legal');

function slugify(input: string): string {
	return input
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '')
		.trim()
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');
}

function extractText(node: unknown): string {
	if (typeof node === 'string') return node;
	if (Array.isArray(node)) return node.map(extractText).join('');
	if (node && typeof node === 'object') {
		const tag = node as { children?: unknown };
		if (Array.isArray(tag.children)) return tag.children.map(extractText).join('');
	}
	return '';
}

const markdocConfig = {
	nodes: {
		heading: {
			...Markdoc.nodes.heading,
			transform(node: Markdoc.Node, config: Markdoc.Config) {
				const attributes = node.transformAttributes(config);
				const children = node.transformChildren(config);
				const text = extractText(children);
				const id = slugify(text);
				return new Markdoc.Tag(`h${node.attributes.level}`, { ...attributes, id }, children);
			}
		}
	}
};

export interface LegalPageMeta {
	slug: string;
	title: string;
	description: string;
	effective: string;
}

export interface LegalPage extends LegalPageMeta {
	content: string;
}

export async function getLegalPage(slug: string): Promise<LegalPage | null> {
	const filePath = path.join(LEGAL_DIR, `${slug}.mdoc`);
	try {
		const raw = await fs.readFile(filePath, 'utf-8');
		const { data, content: source } = matter(raw);

		const ast = Markdoc.parse(source);
		const transformed = Markdoc.transform(ast, markdocConfig);
		const html = Markdoc.renderers.html(transformed);

		return {
			slug,
			title: data.title ?? slug,
			description: data.description ?? '',
			effective: data.effective ?? '',
			content: html
		};
	} catch {
		return null;
	}
}

export async function getAllLegalPages(): Promise<LegalPageMeta[]> {
	let entries: Awaited<ReturnType<typeof fs.readdir>>;
	try {
		entries = await fs.readdir(LEGAL_DIR, { withFileTypes: true });
	} catch {
		return [];
	}

	const pages: LegalPageMeta[] = [];
	for (const entry of entries) {
		if (!entry.isFile() || !entry.name.endsWith('.mdoc')) continue;
		const slug = entry.name.replace(/\.mdoc$/, '');
		const filePath = path.join(LEGAL_DIR, entry.name);
		try {
			const raw = await fs.readFile(filePath, 'utf-8');
			const { data } = matter(raw);
			pages.push({
				slug,
				title: data.title ?? slug,
				description: data.description ?? '',
				effective: data.effective ?? ''
			});
		} catch {
			// skip
		}
	}
	return pages;
}
