import { db } from '$lib/server/db'
import { page, pageContent, primitive, primitiveField, partial, publication, packet } from '$lib/server/db/schema'
import { error } from '@sveltejs/kit'
import { eq, and, isNotNull } from 'drizzle-orm'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, parent }) => {
	const { project, publications, packets } = await parent()

	// Check if this slug matches a publication or packet first
	const isPublication = publications.some(p => p.slug === params.pageSlug)
	const isPacket = packets.some(p => p.slug === params.pageSlug)

	if (isPublication || isPacket) {
		// This is handled by publication/packet routes
		return
	}

	// Find page by slug within this project (only published)
	const pageData = await db
		.select()
		.from(page)
		.where(
			and(
				eq(page.slug, params.pageSlug),
				eq(page.projectId, project.id),
				isNotNull(page.publishedAt)
			)
		)
		.limit(1)

	if (!pageData || pageData.length === 0) {
		throw error(404, 'Page not found')
	}

	// Load page content with primitives
	const content = await db
		.select({
			id: pageContent.id,
			order: pageContent.order,
			content: pageContent.content,
			primitiveId: pageContent.primitiveId,
			primitiveName: primitive.name,
			primitiveDescription: primitive.description,
			sourcePartialId: pageContent.sourcePartialId,
			partialName: partial.name
		})
		.from(pageContent)
		.leftJoin(primitive, eq(pageContent.primitiveId, primitive.id))
		.leftJoin(partial, eq(pageContent.sourcePartialId, partial.id))
		.where(eq(pageContent.pageId, pageData[0].id))
		.orderBy(pageContent.order)

	// Load primitive fields for each content item
	const contentWithFields = await Promise.all(
		content.map(async (item) => {
			if (!item.primitiveId) return item

			const fields = await db
				.select()
				.from(primitiveField)
				.where(eq(primitiveField.primitiveId, item.primitiveId))
				.orderBy(primitiveField.order)

			return {
				...item,
				fields
			}
		})
	)

	return {
		page: pageData[0],
		content: contentWithFields
	}
}
