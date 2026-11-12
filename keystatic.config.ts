import { config, fields, collection } from '@keystatic/core';

export default config({
	storage: { kind: 'local' },
	collections: {
		posts: collection({
			label: 'Blog Posts',
			slugField: 'title',
			path: 'content/posts/*',
			format: { contentField: 'content' },
			schema: {
				title: fields.slug({ name: { label: 'Title' } }),
				date: fields.date({ label: 'Date', validation: { isRequired: true } }),
				excerpt: fields.text({ label: 'Excerpt', multiline: true }),
				tag: fields.select({
					label: 'Tag',
					options: [
						{ label: 'Field Notes', value: 'Field Notes' },
						{ label: 'Engineering', value: 'Engineering' },
						{ label: 'Research', value: 'Research' },
						{ label: 'Data Science', value: 'Data Science' },
						{ label: 'Industry', value: 'Industry' }
					],
					defaultValue: 'Engineering'
				}),
				has_benchmarks: fields.checkbox({
					label: 'Benchmark post (published under /labs)',
					defaultValue: false
				}),
				// Search-only metadata — never shown on the page. See $lib/content.ts.
				seo_title: fields.text({
					label: 'Search title',
					description:
						'The <title> tag: "<Post title>: <what a fundraiser would search for>". 50–65 characters; " | Rōmy" is added automatically.'
				}),
				seo_description: fields.text({
					label: 'Search description',
					description: 'Meta description, 140–160 characters. Plain statement of what the post teaches.',
					multiline: true
				}),
				keywords: fields.array(fields.text({ label: 'Keyword phrase' }), {
					label: 'Search keywords',
					description: '5–8 lowercase phrases a fundraiser would search for.',
					itemLabel: (props) => props.value
				}),
				about: fields.array(fields.text({ label: 'Topic' }), {
					label: 'Topics (schema.org "about")',
					itemLabel: (props) => props.value
				}),
				updated: fields.date({
					label: 'Last substantially updated',
					description: 'Optional. Only set when the post itself changes.'
				}),
				content: fields.markdoc({ label: 'Content' })
			}
		}),
		status: collection({
			label: 'Status updates',
			slugField: 'title',
			path: 'content/status/*',
			format: { contentField: 'content' },
			schema: {
				title: fields.slug({ name: { label: 'Title' } }),
				date: fields.datetime({ label: 'Started', validation: { isRequired: true } }),
				resolved: fields.datetime({ label: 'Resolved (leave blank if ongoing)' }),
				severity: fields.select({
					label: 'Severity',
					options: [
						{ label: 'Maintenance', value: 'maintenance' },
						{ label: 'Minor', value: 'minor' },
						{ label: 'Major', value: 'major' },
						{ label: 'Critical', value: 'critical' }
					],
					defaultValue: 'minor'
				}),
				status: fields.select({
					label: 'Status',
					options: [
						{ label: 'Investigating', value: 'investigating' },
						{ label: 'Identified', value: 'identified' },
						{ label: 'Monitoring', value: 'monitoring' },
						{ label: 'Resolved', value: 'resolved' }
					],
					defaultValue: 'investigating'
				}),
				affected: fields.array(fields.text({ label: 'Service id' }), {
					label: 'Affected services',
					itemLabel: (props) => props.value
				}),
				content: fields.markdoc({ label: 'Update' })
			}
		})
	}
});
