import { db } from '$lib/server/db'
import { publication, post, preset, project } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export async function load({ parent, cookies }) {
  const { user } = await parent()

  if (!user?.id) {
    throw redirect(302, '/login')
  }

  const activeProjectId = cookies.get('activeProjectId')

  // Build base conditions
  const userCondition = eq(project.userId, user.id)
  const projectCondition = activeProjectId && activeProjectId !== 'default' 
    ? and(userCondition, eq(project.id, activeProjectId))
    : userCondition

  // Publications belonging to the user's projects (filtered by active project if specified)
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
    .where(projectCondition)

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
    .where(projectCondition)

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
    .where(projectCondition)

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
