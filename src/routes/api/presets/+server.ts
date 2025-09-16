import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { preset, publication, product, project } from '$lib/server/db/schema'
import { eq, and } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	try {
		const { name, publicationId, projectId } = await request.json()
		
		if (!name?.trim()) {
			return json({ error: 'Preset name is required' }, { status: 400 })
		}
		
		// Must belong to either a publication or a project, but not both
		if (!publicationId && !projectId) {
			return json({ error: 'Either publication or project is required' }, { status: 400 })
		}
		
		if (publicationId && projectId) {
			return json({ error: 'Preset cannot belong to both publication and project' }, { status: 400 })
		}
		
		// If publicationId is provided, verify it belongs to the user
		if (publicationId) {
			const publication = await db.select()
				.from(publication)
				.innerJoin(product, eq(publication.productId, product.id))
				.where(
					and(
						eq(publication.id, publicationId),
						eq(product.userId, locals.session.user.id)
					)
				)
				.limit(1)
			
			if (!publication.length) {
				return json({ error: 'Publication not found or access denied' }, { status: 404 })
			}
		}
		
		// If projectId is provided, verify it belongs to the user
		if (projectId) {
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
				return json({ error: 'Project not found or access denied' }, { status: 404 })
			}
		}
		
		const [preset] = await db.insert(preset).values({
			name: name.trim(),
			publicationId: publicationId || null,
			projectId: projectId || null
		}).returning()
		
		return json(preset)
	} catch (error) {
		console.error('Error creating preset:', error)
		return json({ error: 'Failed to create preset' }, { status: 500 })
	}
}