import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { page, project, pageContent, publication, packet } from '$lib/server/db/schema'
import { eq, and, or, sql } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, locals, cookies }) => {
	if (!locals.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const { title, slug, plateId, content } = await request.json()

		if (!title?.trim()) {
			return json({ error: 'Page title is required' }, { status: 400 })
		}

		// Get projectId from cookie
		const projectId = cookies.get('activeProjectId')

		if (!projectId) {
			return json({ error: 'No project selected' }, { status: 400 })
		}

		// Verify that the project belongs to the user
		const projectRows = await db.select()
			.from(project)
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

		// Generate slug from title if not provided
		let finalSlug = slug?.trim() || title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

		// Check if slug is unique across pages, publications, and packets
		const isSlugUnique = async (slugToCheck: string) => {
			const [pageExists, publicationExists, packetExists] = await Promise.all([
				db.select({ id: page.id }).from(page).where(and(eq(page.slug, slugToCheck), eq(page.projectId, projectId))).limit(1),
				db.select({ id: publication.id }).from(publication).where(and(eq(publication.slug, slugToCheck), eq(publication.projectId, projectId))).limit(1),
				db.select({ id: packet.id }).from(packet).where(and(eq(packet.slug, slugToCheck), eq(packet.projectId, projectId))).limit(1)
			])
			return pageExists.length === 0 && publicationExists.length === 0 && packetExists.length === 0
		}

		// Make slug unique by appending counter if necessary
		let counter = 1
		let uniqueSlug = finalSlug
		while (!(await isSlugUnique(uniqueSlug))) {
			uniqueSlug = `${finalSlug}-${counter}`
			counter++
		}

		const [newPage] = await db.insert(page).values({
			title: title.trim(),
			slug: uniqueSlug,
			projectId,
			plateId: plateId || null,
			userId: locals.user.id
		}).returning()

		// Insert page content if provided
		if (content && Array.isArray(content) && content.length > 0) {
			await db.insert(pageContent).values(
				content.map((item) => ({
					pageId: newPage.id,
					order: item.order,
					primitiveId: item.primitiveId || null,
					sourcePartialId: item.sourcePartialId || null,
					content: item.content
				}))
			)
		}

		return json(newPage)
	} catch (error) {
		console.error('Error creating page:', error)
		return json({ error: 'Failed to create page' }, { status: 500 })
	}
}
