import { db } from '$lib/server/db'
import { publication, post, preset, project } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export async function load({ parent }) {
  const { user } = await parent()

  if (!user?.id) {
    throw redirect(302, '/login')
  }

  // Publications belonging to the user's projects
  const userPublications = await db
    .select({
      id: publication.id,
      name: publication.name,
      slug: publication.slug,
      projectId: publication.projectId,
      projectName: project.name,
      createdAt: publication.createdAt,
      updatedAt: publication.updatedAt
    })
    .from(publication)
    .innerJoin(project, eq(publication.projectId, project.id))
    .where(eq(project.userId, user.id))

  // Posts with publication and preset information
  const userPosts = await db
    .select({
      id: post.id,
      title: post.title,
      slug: post.slug,
      publicationId: post.publicationId,
      publicationName: publication.name,
      presetId: post.presetId,
      presetName: preset.name,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt
    })
    .from(post)
    .innerJoin(publication, eq(post.publicationId, publication.id))
    .innerJoin(project, eq(publication.projectId, project.id))
    .innerJoin(preset, eq(post.presetId, preset.id))
    .where(eq(project.userId, user.id))

  // Presets that belong to user's publications
  const userPresets = await db
    .select({
      id: preset.id,
      name: preset.name,
      publicationId: preset.publicationId,
      publicationName: publication.name,
      createdAt: preset.createdAt,
      updatedAt: preset.updatedAt
    })
    .from(preset)
    .innerJoin(publication, eq(preset.publicationId, publication.id))
    .innerJoin(project, eq(publication.projectId, project.id))
    .where(eq(project.userId, user.id))

  // User's projects for forms
  const userProjects = await db
    .select()
    .from(project)
    .where(eq(project.userId, user.id))

  return {
    publications: userPublications,
    posts: userPosts,
    presets: userPresets,
    projects: userProjects
  }
}
