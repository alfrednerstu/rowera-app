import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { presets, publications, products, projects } from '$lib/server/db/schema'
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
				.from(publications)
				.innerJoin(products, eq(publications.productId, products.id))
				.where(
					and(
						eq(publications.id, publicationId),
						eq(products.userId, locals.session.user.id)
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
				return json({ error: 'Project not found or access denied' }, { status: 404 })
			}
		}
		
		const [preset] = await db.insert(presets).values({
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