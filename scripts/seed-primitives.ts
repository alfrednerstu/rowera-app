import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { primitive, primitiveField } from '../src/lib/server/db/schema'

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set')

const client = postgres(process.env.DATABASE_URL)
const db = drizzle(client)

const primitives = [
	{
		name: 'Heading',
		description: 'Add a heading with selectable level (h1-h6)',
		tags: '<{variant:h1,h2,h3,h4,h5,h6}>{text}</{variant}>',
		category: 'content',
		fields: [
			{ name: 'variant', label: 'Heading Level', type: 'variant', optional: false, order: 0 },
			{ name: 'text', label: 'Heading Text', type: 'text', optional: false, order: 1 }
		]
	},
	{
		name: 'Paragraph',
		description: 'Add a paragraph with rich text formatting',
		tags: '<p>{content}</p>',
		category: 'content',
		fields: [
			{ name: 'content', label: 'Content', type: 'textarea', optional: false, order: 0 }
		]
	},
	{
		name: 'List',
		description: 'Create ordered or unordered lists',
		tags: '<{variant:ul,ol}>\n{repeatable}<li>{item}</li>{/repeatable}\n</{variant}>',
		category: 'content',
		fields: [
			{ name: 'variant', label: 'List Type', type: 'variant', optional: false, order: 0 },
			{ name: 'item', label: 'List Item', type: 'text', optional: false, order: 1 }
		]
	},
	{
		name: 'Blockquote',
		description: 'Add a quote with optional citation',
		tags: '<blockquote><p>{quote}</p><cite>{citation}</cite></blockquote>',
		category: 'content',
		fields: [
			{ name: 'quote', label: 'Quote Text', type: 'textarea', optional: false, order: 0 },
			{ name: 'citation', label: 'Citation', type: 'text', optional: true, order: 1 }
		]
	},
	{
		name: 'Code',
		description: 'Inline code snippet',
		tags: '<code>{code}</code>',
		category: 'content',
		fields: [
			{ name: 'code', label: 'Code', type: 'text', optional: false, order: 0 }
		]
	},
	{
		name: 'Time',
		description: 'Date or time representation',
		tags: '<time datetime="{datetime}">{display}</time>',
		category: 'content',
		fields: [
			{ name: 'datetime', label: 'DateTime (ISO format)', type: 'text', placeholder: '2025-01-01', optional: false, order: 0 },
			{ name: 'display', label: 'Display Text', type: 'text', placeholder: 'January 1, 2025', optional: false, order: 1 }
		]
	},
	{
		name: 'Image',
		description: 'Add an image with optional caption',
		tags: '<figure><img src="{src}" alt="{alt}"><figcaption>{caption}</figcaption></figure>',
		category: 'media',
		fields: [
			{ name: 'src', label: 'Image URL', type: 'url', optional: false, order: 0 },
			{ name: 'alt', label: 'Alt Text', type: 'text', optional: false, order: 1 },
			{ name: 'caption', label: 'Caption', type: 'text', optional: true, order: 2 }
		]
	},
	{
		name: 'Video',
		description: 'Video player',
		tags: '<video src="{src}" controls>{fallback}</video>',
		category: 'media',
		fields: [
			{ name: 'src', label: 'Video URL', type: 'url', optional: false, order: 0 },
			{ name: 'fallback', label: 'Fallback Text', type: 'text', optional: true, order: 1 }
		]
	},
	{
		name: 'Audio',
		description: 'Audio player',
		tags: '<audio src="{src}" controls>{fallback}</audio>',
		category: 'media',
		fields: [
			{ name: 'src', label: 'Audio URL', type: 'url', optional: false, order: 0 },
			{ name: 'fallback', label: 'Fallback Text', type: 'text', optional: true, order: 1 }
		]
	},
	{
		name: 'Button',
		description: 'Add a clickable button',
		tags: '<button>{text}</button>',
		category: 'interactive',
		fields: [
			{ name: 'text', label: 'Button Text', type: 'text', optional: false, order: 0 }
		]
	},
	{
		name: 'Link',
		description: 'Add a hyperlink',
		tags: '<a href="{href}">{text}</a>',
		category: 'interactive',
		fields: [
			{ name: 'href', label: 'URL', type: 'url', optional: false, order: 0 },
			{ name: 'text', label: 'Link Text', type: 'text', optional: false, order: 1 }
		]
	},
	{
		name: 'Accordion',
		description: 'Expandable/collapsible content',
		tags: '<details><summary>{summary}</summary>{content}</details>',
		category: 'interactive',
		fields: [
			{ name: 'summary', label: 'Summary', type: 'text', optional: false, order: 0 },
			{ name: 'content', label: 'Content', type: 'textarea', optional: false, order: 1 }
		]
	},
	{
		name: 'Dialog',
		description: 'Modal dialog box',
		tags: '<dialog>{content}</dialog>',
		category: 'interactive',
		fields: [
			{ name: 'content', label: 'Content', type: 'textarea', optional: false, order: 0 }
		]
	},
	{
		name: 'Section',
		description: 'Thematic grouping of content',
		tags: '<section>{content}</section>',
		category: 'layout',
		fields: [
			{ name: 'content', label: 'Content', type: 'textarea', optional: false, order: 0 }
		]
	},
	{
		name: 'Article',
		description: 'Self-contained composition',
		tags: '<article>{content}</article>',
		category: 'layout',
		fields: [
			{ name: 'content', label: 'Content', type: 'textarea', optional: false, order: 0 }
		]
	},
	{
		name: 'Aside',
		description: 'Tangentially related content',
		tags: '<aside>{content}</aside>',
		category: 'layout',
		fields: [
			{ name: 'content', label: 'Content', type: 'textarea', optional: false, order: 0 }
		]
	},
	{
		name: 'Nav',
		description: 'Navigation menu container',
		tags: '<nav>{content}</nav>',
		category: 'layout',
		fields: [
			{ name: 'content', label: 'Content', type: 'textarea', optional: false, order: 0 }
		]
	},
	{
		name: 'Header',
		description: 'Site or section header',
		tags: '<header>{content}</header>',
		category: 'layout',
		fields: [
			{ name: 'content', label: 'Content', type: 'textarea', optional: false, order: 0 }
		]
	},
	{
		name: 'Footer',
		description: 'Site or section footer',
		tags: '<footer>{content}</footer>',
		category: 'layout',
		fields: [
			{ name: 'content', label: 'Content', type: 'textarea', optional: false, order: 0 }
		]
	},
	{
		name: 'Main',
		description: 'Main content area',
		tags: '<main>{content}</main>',
		category: 'layout',
		fields: [
			{ name: 'content', label: 'Content', type: 'textarea', optional: false, order: 0 }
		]
	}
]

async function seedPrimitives() {
	console.log('Seeding primitives...')

	for (const prim of primitives) {
		try {
			// Insert primitive
			const [newPrimitive] = await db.insert(primitive).values({
				name: prim.name,
				description: prim.description,
				tags: prim.tags,
				category: prim.category
			}).returning()

			console.log(`✓ Created primitive: ${prim.name}`)

			// Insert fields
			if (prim.fields && prim.fields.length > 0) {
				await db.insert(primitiveField).values(
					prim.fields.map(field => ({
						primitiveId: newPrimitive.id,
						name: field.name,
						label: field.label,
						type: field.type,
						description: field.description || null,
						placeholder: field.placeholder || null,
						optional: field.optional,
						order: field.order
					}))
				)
				console.log(`  ✓ Added ${prim.fields.length} fields`)
			}
		} catch (error) {
			console.error(`✗ Error creating primitive ${prim.name}:`, error)
		}
	}

	console.log('\nSeeding complete!')
	process.exit(0)
}

seedPrimitives()
