import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { publication, project, publicationContent } from '$lib/server/db/schema'
import { eq, and } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const PUT: RequestHandler = async ({ request, params, locals }) => {
	if (!locals.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const { name, slug, projectId, primitives } = await request.json()

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

		if (!projectResult.length) {
			return json({ error: 'Project not found or access denied' }, { status: 404 })
		}

		// First verify ownership of the publication through its current project
		const currentPublication = await db.select({ id: publication.id })
			.from(publication)
			.innerJoin(project, eq(publication.projectId, project.id))
			.where(
				and(
					eq(publication.id, params.id),
					eq(project.userId, locals.user.id)
				)
			)
			.limit(1)

		if (!currentPublication.length) {
			return json({ error: 'Publication not found or access denied' }, { status: 404 })
		}

		// Update the publication
		const updatedPublication = await db.update(publication)
			.set({
				name: name.trim(),
				slug: slug.trim(),
				projectId,
				updatedAt: new Date()
			})
			.where(eq(publication.id, params.id))
			.returning({
				id: publication.id,
				name: publication.name,
				slug: publication.slug,
				projectId: publication.projectId,
				createdAt: publication.createdAt,
				updatedAt: publication.updatedAt
			})

		if (!updatedPublication.length) {
			return json({ error: 'Publication not found' }, { status: 404 })
		}

		// Update publication content if primitives are provided
		if (primitives) {
			// Delete existing content
			await db.delete(publicationContent).where(eq(publicationContent.publicationId, params.id))

			// Insert new content
			if (primitives.length > 0) {
				await db.insert(publicationContent).values(
					primitives.map((prim, index) => ({
						publicationId: params.id,
						primitiveId: prim.primitiveId,
						order: index,
						content: {}
					}))
				)
			}
		}

		return json(updatedPublication[0])
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
		const deletedPublication = await db.delete(publication)
			.where(eq(publication.id, params.id))
			.returning()
		
		return json({ success: true })
	} catch (error) {
		console.error('Error deleting publication:', error)
		return json({ error: 'Failed to delete publication' }, { status: 500 })
	}
}