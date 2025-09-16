import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { page, product } from '$lib/server/db/schema'
import { eq, and } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	try {
		const { title, slug, productId } = await request.json()
		
		if (!title?.trim()) {
			return json({ error: 'Page title is required' }, { status: 400 })
		}
		
		if (!slug?.trim()) {
			return json({ error: 'Page slug is required' }, { status: 400 })
		}
		
		if (!productId) {
			return json({ error: 'Product is required' }, { status: 400 })
		}
		
		// Verify that the product belongs to the user
		const productRows = await db.select()
			.from(product)
			.where(
				and(
					eq(product.id, productId),
					eq(product.userId, locals.user.id)
				)
			)
			.limit(1)
		
		if (!productRows.length) {
			return json({ error: 'Product not found or access denied' }, { status: 404 })
		}
		
		const [newPage] = await db.insert(page).values({
			title: title.trim(),
			slug: slug.trim(),
			productId,
			userId: locals.user.id,
			content: null
		}).returning()
		
		return json(newPage)
	} catch (error) {
		console.error('Error creating page:', error)
		return json({ error: 'Failed to create page' }, { status: 500 })
	}
}