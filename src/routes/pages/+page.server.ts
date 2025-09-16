import { db } from '$lib/server/db'
import { page, project } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export async function load({ parent }) {
  const { user } = await parent()

  if (!user?.id) {
    throw redirect(302, '/login')
  }

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
    .where(eq(project.userId, user.id))

  const userProjects = await db
    .select()
    .from(project)
    .where(eq(project.userId, user.id))

  return {
    pages: userPages,
    projects: userProjects
  }
}
