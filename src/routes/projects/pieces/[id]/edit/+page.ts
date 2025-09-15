import { db } from '$lib/server/db'
import { pieces, projects, products, presets, publications } from '$lib/server/db/schema'
import { error, redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export async function load({ params, parent }) {
	const { session } = await parent()
	
	if (!session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	const piece = await db.select({
		id: pieces.id,
		name: pieces.name,
		slug: pieces.slug,
		projectId: pieces.projectId,
		presetId: pieces.presetId,
		createdAt: pieces.createdAt,
		updatedAt: pieces.updatedAt
	})
	.from(pieces)
	.innerJoin(projects, eq(pieces.projectId, projects.id))
	.innerJoin(products, eq(projects.productId, products.id))
	.where(
		and(
			eq(pieces.id, params.id),
			eq(products.userId, session.user.id)
		)
	)
	.limit(1)
	
	if (!piece.length) {
		throw error(404, 'Piece not found')
	}
	
	// Get user's projects
	const userProjects = await db.select({
		id: projects.id,
		name: projects.name,
		productName: products.name
	})
	.from(projects)
	.innerJoin(products, eq(projects.productId, products.id))
	.where(eq(products.userId, session.user.id))
	
	// Get user's presets
	const userPresets = await db.select({
		id: presets.id,
		name: presets.name,
		publicationName: publications.name
	})
	.from(presets)
	.innerJoin(publications, eq(presets.publicationId, publications.id))
	.innerJoin(products, eq(publications.productId, products.id))
	.where(eq(products.userId, session.user.id))
	
	return {
		piece: piece[0],
		projects: userProjects,
		presets: userPresets
	}
}