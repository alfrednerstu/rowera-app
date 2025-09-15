import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { publications, products } from '$lib/server/db/schema'
import { eq, and } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const PUT: RequestHandler = async ({ request, params, locals }) => {
	if (!locals.session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	try {
		const { name, slug, productId } = await request.json()
		
		if (!name?.trim()) {
			return json({ error: 'Publication name is required' }, { status: 400 })
		}
		
		if (!slug?.trim()) {
			return json({ error: 'Publication slug is required' }, { status: 400 })
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
		
		// Update the publication with ownership verification through original product
		const [publication] = await db.update(publications)
			.set({ 
				name: name.trim(),
				slug: slug.trim(),
				productId,
				updatedAt: new Date()
			})
			.from(products)
			.where(
				and(
					eq(publications.id, params.id),
					eq(publications.productId, products.id),
					eq(products.userId, locals.session.user.id)
				)
			)
			.returning({
				id: publications.id,
				name: publications.name,
				slug: publications.slug,
				productId: publications.productId,
				createdAt: publications.createdAt,
				updatedAt: publications.updatedAt
			})
		
		if (!publication) {
			return json({ error: 'Publication not found' }, { status: 404 })
		}
		
		return json(publication)
	} catch (error) {
		console.error('Error updating publication:', error)
		return json({ error: 'Failed to update publication' }, { status: 500 })
	}
}

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	try {
		// First verify ownership through product relationship
		const publicationToDelete = await db.select({ id: publications.id })
			.from(publications)
			.innerJoin(products, eq(publications.productId, products.id))
			.where(
				and(
					eq(publications.id, params.id),
					eq(products.userId, locals.session.user.id)
				)
			)
			.limit(1)
		
		if (!publicationToDelete.length) {
			return json({ error: 'Publication not found' }, { status: 404 })
		}
		
		// Delete the publication
		const [publication] = await db.delete(publications)
			.where(eq(publications.id, params.id))
			.returning()
		
		return json({ success: true })
	} catch (error) {
		console.error('Error deleting publication:', error)
		return json({ error: 'Failed to delete publication' }, { status: 500 })
	}
}