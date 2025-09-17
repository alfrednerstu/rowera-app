import { db } from '$lib/server/db'
import { page, project } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export async function load({ parent, cookies }) {
  const { user } = await parent()

  if (!user?.id) {
    throw redirect(302, '/login')
  }

  const activeProjectId = cookies.get('activeProjectId')

  // Pages that belong to the user's projects (filtered by active project if specified)
  let pageQuery = db
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

  if (activeProjectId && activeProjectId !== 'default') {
    pageQuery = pageQuery.where(and(
      eq(project.userId, user.id),
      eq(project.id, activeProjectId)
    ))
  } else {
    pageQuery = pageQuery.where(eq(project.userId, user.id))
  }

  const userPages = await pageQuery

  const userProjects = await db
    .select()
    .from(project)
    .where(eq(project.userId, user.id))

  return {
    pages: userPages,
    projects: userProjects
  }
}
