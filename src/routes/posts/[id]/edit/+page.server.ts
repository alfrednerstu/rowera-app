import { db } from '$lib/server/db'
import { post, publication, preset, project } from '$lib/server/db/schema'
import { error, redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export const load = async ({ params, locals }) => {
	
	
	if (!locals.user?.id) {
		throw redirect(302, '/login')
	}
	
	// Get the post with ownership verification through publication
	const post = await db.select({
		id: post.id,
		title: post.title,
		slug: post.slug,
		content: post.content,
		publicationId: post.publicationId,
		presetId: post.presetId,
		createdAt: post.createdAt,
		updatedAt: post.updatedAt
	})
	.from(post)
	.innerJoin(publication, eq(post.publicationId, publication.id))
	.innerJoin(project, eq(publication.projectId, project.id))
	.where(
		and(
			eq(post.id, params.id),
			eq(project.userId, locals.user.id)
		)
	)
	.limit(1)
	
	if (!post.length) {
		throw error(404, 'Post not found')
	}
	
	// Get all publications that belong to the user's projects
	const userPublications = await db.select({
		id: publication.id,
		name: publication.name,
		projectId: publication.projectId
	})
	.from(publication)
	.innerJoin(project, eq(publication.projectId, project.id))
	.where(eq(project.userId, locals.user.id))
	
	// Get all presets that belong to user's publications
	const userPresets = await db.select({
		id: preset.id,
		name: preset.name,
		publicationId: preset.publicationId
	})
	.from(preset)
	.innerJoin(publication, eq(preset.publicationId, publication.id))
	.innerJoin(project, eq(publication.projectId, project.id))
	.where(eq(project.userId, locals.user.id))
	
	return {
		post: post[0],
		publications: userPublications,
		presets: userPresets
	}
}