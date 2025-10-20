import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { primitive } from '../src/lib/server/db/schema'
import { eq } from 'drizzle-orm'

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set')

const client = postgres(process.env.DATABASE_URL)
const db = drizzle(client)

const categoryMap: Record<string, string> = {
	'Heading': 'content',
	'Paragraph': 'content',
	'List': 'content',
	'Blockquote': 'content',
	'Code': 'content',
	'Time': 'content',
	'Image': 'media',
	'Video': 'media',
	'Audio': 'media',
	'Button': 'interactive',
	'Link': 'interactive',
	'Accordion': 'interactive',
	'Dialog': 'interactive',
	'Section': 'layout',
	'Article': 'layout',
	'Aside': 'layout',
	'Nav': 'layout',
	'Header': 'layout',
	'Footer': 'layout',
	'Main': 'layout'
}

async function updateCategories() {
	console.log('Updating primitive categories...')

	for (const [name, category] of Object.entries(categoryMap)) {
		try {
			await db.update(primitive)
				.set({ category })
				.where(eq(primitive.name, name))

			console.log(`✓ Updated ${name} to category: ${category}`)
		} catch (error) {
			console.error(`✗ Error updating ${name}:`, error)
		}
	}

	console.log('\nUpdate complete!')
	process.exit(0)
}

updateCategories()
