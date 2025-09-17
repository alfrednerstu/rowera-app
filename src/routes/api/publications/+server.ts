import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { publication, project } from '$lib/server/db/schema'
import { eq, and } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	try {
		const { name, slug, projectId } = await request.json()
		
		if (!name?.trim()) {
			return json({ error: 'Publication name is required' }, { status: 400 })
		}
		
		if (!slug?.trim()) {
			return json({ error: 'Publication slug is required' }, { status: 400 })
		}
		
		if (!projectId) {
			return json({ error: 'Project is required' }, { status: 400 })
		}
		
		// Verify that the project belongs to the user
		const projectRows = await db.select()
			.from(project)
			.where(
				and(
					eq(project.id, projectId),
					eq(project.userId, locals.user.id)
				)
			)
			.limit(1)
		
		if (!projectRows.length) {
			return json({ error: 'Project not found or access denied' }, { status: 404 })
		}
		
		const [newPublication] = await db.insert(publication).values({
			name: name.trim(),
			slug: slug.trim(),
			projectId
		}).returning()
		
		return json(newPublication)
	} catch (error) {
		console.error('Error creating publication:', error)
		return json({ error: 'Failed to create publication' }, { status: 500 })
	}
}