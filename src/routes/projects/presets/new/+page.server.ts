import { db } from '$lib/server/db'
import { project, product } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export const load = async ({ locals }) => {
	
	
	if (!locals.session?.user?.id) {
		throw redirect(302, '/login')
	}
	
	// Get user's projects for the form
	const userProjects = await db.select({
		id: project.id,
		name: project.name,
		productName: product.name
	})
	.from(project)
	.innerJoin(product, eq(project.productId, product.id))
	.where(eq(product.userId, locals.session.user.id))
	
	return {
		projects: userProjects
	}
}