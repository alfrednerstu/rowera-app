import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { pieces, projects, products, presets, publications } from '$lib/server/db/schema'
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
		.from(projects)
		.innerJoin(products, eq(projects.productId, products.id))
		.where(
			and(
				eq(projects.id, projectId),
				eq(products.userId, locals.session.user.id)
			)
		)
		.limit(1)
		
		if (!project.length) {
			return json({ error: 'Project not found' }, { status: 404 })
		}
		
		// Verify the preset belongs to the user
		const preset = await db.select()
		.from(presets)
		.innerJoin(publications, eq(presets.publicationId, publications.id))
		.innerJoin(products, eq(publications.productId, products.id))
		.where(
			and(
				eq(presets.id, presetId),
				eq(products.userId, locals.session.user.id)
			)
		)
		.limit(1)
		
		if (!preset.length) {
			return json({ error: 'Preset not found' }, { status: 404 })
		}
		
		const [piece] = await db.insert(pieces).values({
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