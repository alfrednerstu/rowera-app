import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { product } from '$lib/server/db/schema'
import { eq, and } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const PUT: RequestHandler = async ({ request, params, locals }) => {
	if (!locals.session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	try {
		const { name } = await request.json()
		
		if (!name?.trim()) {
			return json({ error: 'Product name is required' }, { status: 400 })
		}
		
		const [product] = await db.update(product)
			.set({ 
				name: name.trim(),
				updatedAt: new Date()
			})
			.where(
				and(
					eq(product.id, params.id),
					eq(product.userId, locals.session.user.id)
				)
			)
			.returning()
		
		if (!product) {
			return json({ error: 'Product not found' }, { status: 404 })
		}
		
		return json(product)
	} catch (error) {
		console.error('Error updating product:', error)
		return json({ error: 'Failed to update product' }, { status: 500 })
	}
}

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	try {
		const [product] = await db.delete(product)
			.where(
				and(
					eq(product.id, params.id),
					eq(product.userId, locals.session.user.id)
				)
			)
			.returning()
		
		if (!product) {
			return json({ error: 'Product not found' }, { status: 404 })
		}
		
		return json({ success: true })
	} catch (error) {
		console.error('Error deleting product:', error)
		return json({ error: 'Failed to delete product' }, { status: 500 })
	}
}