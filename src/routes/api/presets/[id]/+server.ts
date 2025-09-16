import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { preset, publication, packet, project } from '$lib/server/db/schema'
import { eq, and, or, isNull } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const PUT: RequestHandler = async ({ request, params, locals }) => {
	if (!locals.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	try {
		const { name, publicationId, packetId } = await request.json()
		
		if (!name?.trim()) {
			return json({ error: 'Preset name is required' }, { status: 400 })
		}
		
		// Must belong to either a publication or a packet, but not both
		if (!publicationId && !packetId) {
			return json({ error: 'Either publication or packet is required' }, { status: 400 })
		}
		
		if (publicationId && packetId) {
			return json({ error: 'Preset cannot belong to both publication and packet' }, { status: 400 })
		}
		
		// First, verify the existing preset belongs to the user
		const existingPresetRows = await db.select({ 
			id: preset.id,
			publicationId: preset.publicationId,
			packetId: preset.packetId
		})
		.from(preset)
		.leftJoin(publication, eq(preset.publicationId, publication.id))
		.leftJoin(packet, eq(preset.packetId, packet.id))
		.leftJoin(project, or(
			eq(publication.projectId, project.id),
			eq(packet.projectId, project.id)
		))
		.where(
			and(
				eq(preset.id, params.id),
				eq(project.userId, locals.user.id)
			)
		)
		.limit(1)
		
		if (!existingPresetRows.length) {
			return json({ error: 'Preset not found or access denied' }, { status: 404 })
		}
		
		// If publicationId is provided, verify it belongs to the user
		if (publicationId) {
			const publicationRows = await db.select()
				.from(publication)
				.innerJoin(project, eq(publication.projectId, project.id))
				.where(
					and(
						eq(publication.id, publicationId),
						eq(project.userId, locals.user.id)
					)
				)
				.limit(1)
			
			if (!publicationRows.length) {
				return json({ error: 'Publication not found or access denied' }, { status: 404 })
			}
		}
		
		// If projectId is provided, verify it belongs to the user
		if (projectId) {
			const projectRows = await db.select()
				.from(project)
				.innerJoin(project, eq(project.projectId, project.id))
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
		}
		
		// Update the preset
		const [updatedPreset] = await db.update(preset)
			.set({ 
				name: name.trim(),
				publicationId: publicationId || null,
				projectId: projectId || null,
				updatedAt: new Date()
			})
			.where(eq(preset.id, params.id))
			.returning()
		
		if (!updatedPreset) {
			return json({ error: 'Preset not found' }, { status: 404 })
		}
		
		return json(updatedPreset)
	} catch (error) {
		console.error('Error updating preset:', error)
		return json({ error: 'Failed to update preset' }, { status: 500 })
	}
}

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}
	
	try {
		// Verify ownership through either publication or project relationship
		const presetToDelete = await db.select({ id: preset.id })
			.from(preset)
			.leftJoin(publication, eq(preset.publicationId, publication.id))
			.leftJoin(project, eq(preset.projectId, project.id))
			.innerJoin(project, or(
				eq(publication.projectId, project.id),
				eq(project.projectId, project.id)
			))
			.where(
				and(
					eq(preset.id, params.id),
					eq(project.userId, locals.user.id)
				)
			)
			.limit(1)
		
		if (!presetToDelete.length) {
			return json({ error: 'Preset not found or access denied' }, { status: 404 })
		}
		
		// Delete the preset
		const [deletedPreset] = await db.delete(preset)
			.where(eq(preset.id, params.id))
			.returning()
		
		return json({ success: true })
	} catch (error) {
		console.error('Error deleting preset:', error)
		return json({ error: 'Failed to delete preset' }, { status: 500 })
	}
}