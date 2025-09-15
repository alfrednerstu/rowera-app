import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { products } from '$lib/server/db/schema'
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
		
		const [product] = await db.insert(products).values({
			name: name.trim(),
			userId: locals.session.user.id
		}).returning()
		
		return json(product)
	} catch (error) {
		console.error('Error creating product:', error)
		return json({ error: 'Failed to create product' }, { status: 500 })
	}
}