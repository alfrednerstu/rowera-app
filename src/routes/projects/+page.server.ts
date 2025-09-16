import { db } from '$lib/server/db'
import { project, piece, preset, publication, product } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export const load = async ({ locals }) => {
	
	
	if (!locals.session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	// Get all projects that belong to the user's products with product information
	const userProjects = await db.select({
		id: project.id,
		name: project.name,
		slug: project.slug,
		productId: project.productId,
		productName: product.name,
		createdAt: project.createdAt,
		updatedAt: product.updatedAt
	})
	.from(project)
	.innerJoin(product, eq(project.productId, product.id))
	.where(eq(product.userId, locals.session.user.id))
	
	// Get all pieces with project and preset information
	const userPieces = await db.select({
		id: piece.id,
		name: piece.name,
		slug: piece.slug,
		projectId: piece.projectId,
		projectName: project.name,
		presetId: piece.presetId,
		presetName: preset.name,
		createdAt: piece.createdAt,
		updatedAt: piece.updatedAt
	})
	.from(piece)
	.innerJoin(project, eq(piece.projectId, project.id))
	.innerJoin(product, eq(project.productId, product.id))
	.innerJoin(preset, eq(piece.presetId, preset.id))
	.where(eq(product.userId, locals.session.user.id))
	
	// Get all presets that belong to user's projects
	const userPresets = await db.select({
		id: preset.id,
		name: preset.name,
		projectId: preset.projectId,
		projectName: project.name,
		createdAt: preset.createdAt,
		updatedAt: preset.updatedAt
	})
	.from(preset)
	.innerJoin(project, eq(preset.projectId, project.id))
	.innerJoin(product, eq(project.productId, product.id))
	.where(eq(product.userId, locals.session.user.id))
	
	// Get all user's products for forms
	const userProducts = await db.select().from(product).where(eq(product.userId, locals.session.user.id))
	
	return {
		projects: userProjects,
		pieces: userPieces,
		presets: userPresets,
		products: userProducts
	}
}