import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { page, product } from '$lib/server/db/schema'
import { eq, and } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	try {
		const { name, slug, productId } = await request.json()
		
		if (!name?.trim()) {
			return json({ error: 'Page name is required' }, { status: 400 })
		}
		
		if (!slug?.trim()) {
			return json({ error: 'Page slug is required' }, { status: 400 })
		}
		
		if (!productId) {
			return json({ error: 'Product is required' }, { status: 400 })
		}
		
		// Verify that the product belongs to the user
		const product = await db.select()
			.from(product)
			.where(
				and(
					eq(product.id, productId),
					eq(product.userId, locals.session.user.id)
				)
			)
			.limit(1)
		
		if (!product.length) {
			return json({ error: 'Product not found or access denied' }, { status: 404 })
		}
		
		const [page] = await db.insert(page).values({
			name: name.trim(),
			slug: slug.trim(),
			productId
		}).returning()
		
		return json(page)
	} catch (error) {
		console.error('Error creating page:', error)
		return json({ error: 'Failed to create page' }, { status: 500 })
	}
}