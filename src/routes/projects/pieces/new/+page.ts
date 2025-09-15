import { db } from '$lib/server/db'
import { projects, products, presets, publications } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export async function load({ parent }) {
	const { session } = await parent()
	
	if (!session?.user?.id) {
		throw redirect(302, '/login')
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
	
	// Get user's presets (from their publications)
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
		projects: userProjects,
		presets: userPresets
	}
}