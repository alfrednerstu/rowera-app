import { db } from '$lib/server/db'
import { project } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export async function load({ parent }) {
  const { user } = await parent()

  if (!user?.id) {
    throw redirect(302, '/login')
  }

  // Get all user's projects for the select field
  const userProjects = await db
    .select()
    .from(project)
    .where(eq(project.userId, user.id))

  return {
    projects: userProjects
  }
}
