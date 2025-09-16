import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { product, publication, project } from '$lib/server/db/schema'
import { eq } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ locals }) => {
	if (!locals.session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	const userId = locals.session.user.id
	
	try {
		// Check if user already has products
		const existingProducts = await db.select().from(product).where(eq(product.userId, userId)).limit(1)
		
		if (existingProducts.length > 0) {
			return json({ message: 'User already has default entities' })
		}

		// Create default product
		const [defaultProduct] = await db.insert(product).values({
			name: 'My First Product',
			userId: userId
		}).returning()

		// Create default publication
		const [defaultPublication] = await db.insert(publication).values({
			name: 'Default Publication',
			slug: 'default',
			productId: defaultProduct.id
		}).returning()

		// Create default project  
		const [defaultProject] = await db.insert(project).values({
			name: 'Default Project',
			slug: 'default',
			productId: defaultProduct.id
		}).returning()
		
		return json({ 
			product: defaultProduct,
			publication: defaultPublication, 
			project: defaultProject
		})
	} catch (error) {
		console.error('Error setting up default entities:', error)
		return json({ error: 'Failed to setup default entities' }, { status: 500 })
	}
}