import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { product, publication, project } from '$lib/server/db/schema'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	try {
		const { name } = await request.json()
		
		if (!name?.trim()) {
			return json({ error: 'Product name is required' }, { status: 400 })
		}
		
		const [newProduct] = await db.insert(product).values({
			name: name.trim(),
			userId: locals.session.user.id
		}).returning()

		// Create default publication
		const [defaultPublication] = await db.insert(publication).values({
			name: 'Default Publication',
			slug: 'default',
			productId: newProduct.id
		}).returning()

		// Create default project  
		const [defaultProject] = await db.insert(project).values({
			name: 'Default Project',
			slug: 'default',
			productId: newProduct.id
		}).returning()
		
		return json({ 
			product: newProduct, 
			defaultPublication, 
			defaultProject 
		})
	} catch (error) {
		console.error('Error creating product:', error)
		return json({ error: 'Failed to create product' }, { status: 500 })
	}
}