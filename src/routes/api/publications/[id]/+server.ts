import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { publication, project } from '$lib/server/db/schema'
import { eq, and } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const PUT: RequestHandler = async ({ request, params, locals }) => {
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
		
		// Verify that the new product belongs to the user
		const projectResult = await db.select()
			.from(project)
			.where(
				and(
					eq(project.id, projectId),
					eq(project.userId, locals.user.id)
				)
			)
			.limit(1)
		
		if (!project.length) {
			return json({ error: 'Project not found or access denied' }, { status: 404 })
		}
		
		// Update the publication with ownership verification through original product
		const [publication] = await db.update(publication)
			.set({ 
				name: name.trim(),
				slug: slug.trim(),
				projectId,
				updatedAt: new Date()
			})
			.from(project)
			.where(
				and(
					eq(publication.id, params.id),
					eq(publication.projectId, project.id),
					eq(project.userId, locals.user.id)
				)
			)
			.returning({
				id: publication.id,
				name: publication.name,
				slug: publication.slug,
				projectId: publication.projectId,
				createdAt: publication.createdAt,
				updatedAt: publication.updatedAt
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
	if (!locals.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	try {
		// First verify ownership through product relationship
		const publicationToDelete = await db.select({ id: publication.id })
			.from(publication)
			.innerJoin(project, eq(publication.projectId, project.id))
			.where(
				and(
					eq(publication.id, params.id),
					eq(project.userId, locals.user.id)
				)
			)
			.limit(1)
		
		if (!publicationToDelete.length) {
			return json({ error: 'Publication not found' }, { status: 404 })
		}
		
		// Delete the publication
		const [publication] = await db.delete(publication)
			.where(eq(publication.id, params.id))
			.returning()
		
		return json({ success: true })
	} catch (error) {
		console.error('Error deleting publication:', error)
		return json({ error: 'Failed to delete publication' }, { status: 500 })
	}
}