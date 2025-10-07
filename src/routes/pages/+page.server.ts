import { db } from '$lib/server/db'
import { page, project } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export async function load({ parent, cookies }) {
  const { user } = await parent()

  if (!user?.id) {
    throw redirect(302, '/login')
  }

  let activeProjectId = cookies.get('activeProjectId')

  // If activeProjectId is 'default', look up the actual Default project
  if (activeProjectId === 'default') {
    const defaultProject = await db
      .select()
      .from(project)
      .where(and(eq(project.userId, user.id), eq(project.name, 'Default')))
      .limit(1)

    if (defaultProject.length > 0) {
      activeProjectId = defaultProject[0].id
    }
  }

  // If still 'default' or not set, return empty arrays
  if (!activeProjectId || activeProjectId === 'default') {
    const userProjects = await db
      .select()
      .from(project)
      .where(eq(project.userId, user.id))

    return {
      pages: [],
      projects: userProjects
    }
  }

  // Pages that belong to the user's projects (filtered by active project)
  const userPages = await db
    .select({
      id: page.id,
      name: page.title,
      slug: page.slug,
      projectId: page.projectId,
      projectName: project.name,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt
    })
    .from(page)
    .innerJoin(project, eq(page.projectId, project.id))
    .where(and(
      eq(project.userId, user.id),
      eq(project.id, activeProjectId)
    ))

  const userProjects = await db
    .select()
    .from(project)
    .where(eq(project.userId, user.id))

  return {
    pages: userPages,
    projects: userProjects
  }
}
