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
						{ label: 'Engineering', value: 'Engineering' },
						{ label: 'Research', value: 'Research' },
						{ label: 'Data Science', value: 'Data Science' },
						{ label: 'Industry', value: 'Industry' },
						{ label: 'Field Notes', value: 'Field Notes' }
					],
					defaultValue: 'Engineering'
				}),
				seo_title: fields.text({
					label: 'SEO title',
					description: 'Search-result title, max 58 chars. " | Rōmy" is appended. Defaults to Title.'
				}),
				description: fields.text({
					label: 'Meta description',
					description: '140–158 chars shown in search results. Defaults to a trimmed Excerpt.',
					multiline: true
				}),
				keywords: fields.array(fields.text({ label: 'Keyword' }), {
					label: 'SEO keywords',
					itemLabel: (props) => props.value
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
