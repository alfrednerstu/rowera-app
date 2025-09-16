import { db } from '$lib/server/db'
import { piece, project, product, preset, publication } from '$lib/server/db/schema'
import { error, redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export const load = async ({ params, locals }) => {
	
	
	if (!locals.session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	const piece = await db.select({
		id: piece.id,
		name: piece.name,
		slug: piece.slug,
		projectId: piece.projectId,
		presetId: piece.presetId,
		createdAt: piece.createdAt,
		updatedAt: piece.updatedAt
	})
	.from(piece)
	.innerJoin(project, eq(piece.projectId, project.id))
	.innerJoin(product, eq(project.productId, product.id))
	.where(
		and(
			eq(piece.id, params.id),
			eq(product.userId, locals.session.user.id)
		)
	)
	.limit(1)
	
	if (!piece.length) {
		throw error(404, 'Piece not found')
	}
	
	// Get user's projects
	const userProjects = await db.select({
		id: project.id,
		name: project.name,
		productName: product.name
	})
	.from(project)
	.innerJoin(product, eq(project.productId, product.id))
	.where(eq(product.userId, locals.session.user.id))
	
	// Get user's presets
	const userPresets = await db.select({
		id: preset.id,
		name: preset.name,
		publicationName: publication.name
	})
	.from(preset)
	.innerJoin(publication, eq(preset.publicationId, publication.id))
	.innerJoin(product, eq(publication.productId, product.id))
	.where(eq(product.userId, locals.session.user.id))
	
	return {
		piece: piece[0],
		projects: userProjects,
		presets: userPresets
	}
}