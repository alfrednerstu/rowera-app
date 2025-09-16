import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { preset, publication, product, project } from '$lib/server/db/schema'
import { eq, and, or, isNull } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const PUT: RequestHandler = async ({ request, params, locals }) => {
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
		
		// First, verify the existing preset belongs to the user
		const existingPreset = await db.select({ 
			id: preset.id,
			publicationId: preset.publicationId,
			projectId: preset.projectId
		})
		.from(preset)
		.leftJoin(publication, eq(preset.publicationId, publication.id))
		.leftJoin(product, or(
			eq(publication.productId, product.id),
			eq(preset.projectId, project.id)
		))
		.leftJoin(project, eq(preset.projectId, project.id))
		.where(
			and(
				eq(preset.id, params.id),
				eq(product.userId, locals.session.user.id)
			)
		)
		.limit(1)
		
		if (!existingPreset.length) {
			return json({ error: 'Preset not found or access denied' }, { status: 404 })
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
		
		// Update the preset
		const [preset] = await db.update(preset)
			.set({ 
				name: name.trim(),
				publicationId: publicationId || null,
				projectId: projectId || null,
				updatedAt: new Date()
			})
			.where(eq(preset.id, params.id))
			.returning()
		
		if (!preset) {
			return json({ error: 'Preset not found' }, { status: 404 })
		}
		
		return json(preset)
	} catch (error) {
		console.error('Error updating preset:', error)
		return json({ error: 'Failed to update preset' }, { status: 500 })
	}
}

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	try {
		// Verify ownership through either publication or project relationship
		const presetToDelete = await db.select({ id: preset.id })
			.from(preset)
			.leftJoin(publication, eq(preset.publicationId, publication.id))
			.leftJoin(project, eq(preset.projectId, project.id))
			.innerJoin(product, or(
				eq(publication.productId, product.id),
				eq(project.productId, product.id)
			))
			.where(
				and(
					eq(preset.id, params.id),
					eq(product.userId, locals.session.user.id)
				)
			)
			.limit(1)
		
		if (!presetToDelete.length) {
			return json({ error: 'Preset not found or access denied' }, { status: 404 })
		}
		
		// Delete the preset
		const [preset] = await db.delete(preset)
			.where(eq(preset.id, params.id))
			.returning()
		
		return json({ success: true })
	} catch (error) {
		console.error('Error deleting preset:', error)
		return json({ error: 'Failed to delete preset' }, { status: 500 })
	}
}