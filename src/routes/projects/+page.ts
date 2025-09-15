import { db } from '$lib/server/db'
import { projects, pieces, presets, publications, products } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export async function load({ parent }) {
	const { session } = await parent()
	
	if (!session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	// Get all projects that belong to the user's products with product information
	const userProjects = await db.select({
		id: projects.id,
		name: projects.name,
		slug: projects.slug,
		productId: projects.productId,
		productName: products.name,
		createdAt: projects.createdAt,
		updatedAt: projects.updatedAt
	})
	.from(projects)
	.innerJoin(products, eq(projects.productId, products.id))
	.where(eq(products.userId, session.user.id))
	
	// Get all pieces with project and preset information
	const userPieces = await db.select({
		id: pieces.id,
		name: pieces.name,
		slug: pieces.slug,
		projectId: pieces.projectId,
		projectName: projects.name,
		presetId: pieces.presetId,
		presetName: presets.name,
		createdAt: pieces.createdAt,
		updatedAt: pieces.updatedAt
	})
	.from(pieces)
	.innerJoin(projects, eq(pieces.projectId, projects.id))
	.innerJoin(products, eq(projects.productId, products.id))
	.innerJoin(presets, eq(pieces.presetId, presets.id))
	.where(eq(products.userId, session.user.id))
	
	// Get all presets that belong to user's projects
	const userPresets = await db.select({
		id: presets.id,
		name: presets.name,
		projectId: presets.projectId,
		projectName: projects.name,
		createdAt: presets.createdAt,
		updatedAt: presets.updatedAt
	})
	.from(presets)
	.innerJoin(projects, eq(presets.projectId, projects.id))
	.innerJoin(products, eq(projects.productId, products.id))
	.where(eq(products.userId, session.user.id))
	
	// Get all user's products for forms
	const userProducts = await db.select().from(products).where(eq(products.userId, session.user.id))
	
	return {
		projects: userProjects,
		pieces: userPieces,
		presets: userPresets,
		products: userProducts
	}
}