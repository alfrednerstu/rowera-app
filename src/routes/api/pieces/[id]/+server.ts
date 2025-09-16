import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { piece, project, product, preset, publication } from '$lib/server/db/schema'
import { eq, and } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const PUT: RequestHandler = async ({ request, params, locals }) => {
	if (!locals.session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	try {
		const { name, slug, projectId, presetId } = await request.json()
		
		if (!name?.trim() || !slug?.trim() || !projectId || !presetId) {
			return json({ error: 'Name, slug, project, and preset are required' }, { status: 400 })
		}
		
		// Verify the project belongs to the user
		const project = await db.select()
		.from(project)
		.innerJoin(product, eq(project.productId, product.id))
		.where(
			and(
				eq(project.id, projectId),
				eq(product.userId, locals.session.user.id)
			)
		)
		.limit(1)
		
		if (!project.length) {
			return json({ error: 'Project not found' }, { status: 404 })
		}
		
		// Verify the preset belongs to the user
		const preset = await db.select()
		.from(preset)
		.innerJoin(publication, eq(preset.publicationId, publication.id))
		.innerJoin(product, eq(publication.productId, product.id))
		.where(
			and(
				eq(preset.id, presetId),
				eq(product.userId, locals.session.user.id)
			)
		)
		.limit(1)
		
		if (!preset.length) {
			return json({ error: 'Preset not found' }, { status: 404 })
		}
		
		const [piece] = await db.update(piece)
			.set({ 
				name: name.trim(),
				slug: slug.trim(),
				projectId,
				presetId,
				updatedAt: new Date()
			})
			.where(eq(piece.id, params.id))
			.returning()
		
		if (!piece) {
			return json({ error: 'Piece not found' }, { status: 404 })
		}
		
		return json(piece)
	} catch (error) {
		console.error('Error updating piece:', error)
		return json({ error: 'Failed to update piece' }, { status: 500 })
	}
}

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	try {
		const [piece] = await db.delete(piece)
			.where(eq(piece.id, params.id))
			.returning()
		
		if (!piece) {
			return json({ error: 'Piece not found' }, { status: 404 })
		}
		
		return json({ success: true })
	} catch (error) {
		console.error('Error deleting piece:', error)
		return json({ error: 'Failed to delete piece' }, { status: 500 })
	}
}