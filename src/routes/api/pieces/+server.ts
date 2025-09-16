import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { piece, project, product, preset, publication } from '$lib/server/db/schema'
import { eq, and } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, locals }) => {
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
		
		const [piece] = await db.insert(piece).values({
			name: name.trim(),
			slug: slug.trim(),
			projectId,
			presetId
		}).returning()
		
		return json(piece)
	} catch (error) {
		console.error('Error creating piece:', error)
		return json({ error: 'Failed to create piece' }, { status: 500 })
	}
}