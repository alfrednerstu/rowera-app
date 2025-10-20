import { db } from '$lib/server/db'
import { publication, post, postContent, primitive } from '$lib/server/db/schema'
import { error } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, parent }) => {
	const { project } = await parent()

	// Find publication by slug within this project
	const publicationData = await db
		.select()
		.from(publication)
		.where(
			and(
				eq(publication.slug, params.publicationSlug),
				eq(publication.projectId, project.id)
			)
		)
		.limit(1)

	if (!publicationData || publicationData.length === 0) {
		throw error(404, 'Publication not found')
	}

	// Load all published posts for this publication
	const posts = await db
		.select({
			id: post.id,
			title: post.title,
			slug: post.slug,
			publishedAt: post.publishedAt,
			createdAt: post.createdAt,
			updatedAt: post.updatedAt
		})
		.from(post)
		.where(
			and(
				eq(post.publicationId, publicationData[0].id),
				eq(post.isPublished, true)
			)
		)
		.orderBy(post.publishedAt)

	return {
		publication: publicationData[0],
		posts
	}
}
