import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { pages, products } from '$lib/server/db/schema'
import { eq, and } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const PUT: RequestHandler = async ({ request, params, locals }) => {
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
		
		// Verify that the new product belongs to the user
		const product = await db.select()
			.from(products)
			.where(
				and(
					eq(products.id, productId),
					eq(products.userId, locals.session.user.id)
				)
			)
			.limit(1)
		
		if (!product.length) {
			return json({ error: 'Product not found or access denied' }, { status: 404 })
		}
		
		// Update the page with ownership verification through original product
		const [page] = await db.update(pages)
			.set({ 
				name: name.trim(),
				slug: slug.trim(),
				productId,
				updatedAt: new Date()
			})
			.from(products)
			.where(
				and(
					eq(pages.id, params.id),
					eq(pages.productId, products.id),
					eq(products.userId, locals.session.user.id)
				)
			)
			.returning({
				id: pages.id,
				name: pages.name,
				slug: pages.slug,
				productId: pages.productId,
				createdAt: pages.createdAt,
				updatedAt: pages.updatedAt
			})
		
		if (!page) {
			return json({ error: 'Page not found' }, { status: 404 })
		}
		
		return json(page)
	} catch (error) {
		console.error('Error updating page:', error)
		return json({ error: 'Failed to update page' }, { status: 500 })
	}
}

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	try {
		// First verify ownership through product relationship
		const pageToDelete = await db.select({ id: pages.id })
			.from(pages)
			.innerJoin(products, eq(pages.productId, products.id))
			.where(
				and(
					eq(pages.id, params.id),
					eq(products.userId, locals.session.user.id)
				)
			)
			.limit(1)
		
		if (!pageToDelete.length) {
			return json({ error: 'Page not found' }, { status: 404 })
		}
		
		// Delete the page
		const [page] = await db.delete(pages)
			.where(eq(pages.id, params.id))
			.returning()
		
		return json({ success: true })
	} catch (error) {
		console.error('Error deleting page:', error)
		return json({ error: 'Failed to delete page' }, { status: 500 })
	}
}