import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { projects, products } from '$lib/server/db/schema'
import { eq, and } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const PUT: RequestHandler = async ({ request, params, locals }) => {
	if (!locals.session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	try {
		const { name, slug, productId } = await request.json()
		
		if (!name?.trim() || !slug?.trim() || !productId) {
			return json({ error: 'Name, slug, and product are required' }, { status: 400 })
		}
		
		// Verify the product belongs to the user
		const product = await db.select().from(products).where(
			and(
				eq(products.id, productId),
				eq(products.userId, locals.session.user.id)
			)
		).limit(1)
		
		if (!product.length) {
			return json({ error: 'Product not found' }, { status: 404 })
		}
		
		const [project] = await db.update(projects)
			.set({ 
				name: name.trim(),
				slug: slug.trim(),
				productId,
				updatedAt: new Date()
			})
			.where(eq(projects.id, params.id))
			.returning()
		
		if (!project) {
			return json({ error: 'Project not found' }, { status: 404 })
		}
		
		return json(project)
	} catch (error) {
		console.error('Error updating project:', error)
		return json({ error: 'Failed to update project' }, { status: 500 })
	}
}

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	try {
		const [project] = await db.delete(projects)
			.where(eq(projects.id, params.id))
			.returning()
		
		if (!project) {
			return json({ error: 'Project not found' }, { status: 404 })
		}
		
		return json({ success: true })
	} catch (error) {
		console.error('Error deleting project:', error)
		return json({ error: 'Failed to delete project' }, { status: 500 })
	}
}