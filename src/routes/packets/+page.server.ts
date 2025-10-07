import { db } from '$lib/server/db'
import { project, packet, piece, preset } from '$lib/server/db/schema'
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
    return {
      packets: []
    }
  }

  // Packets that belong to the user's projects (filtered by active project)
  const userPackets = await db
    .select({
      id: packet.id,
      name: packet.name,
      slug: packet.slug,
      projectId: packet.projectId,
      projectName: project.name,
      createdAt: packet.createdAt,
      updatedAt: packet.updatedAt
    })
    .from(packet)
    .innerJoin(project, eq(packet.projectId, project.id))
    .where(and(
      eq(project.userId, user.id),
      eq(project.id, activeProjectId)
    ))

  return {
    packets: userPackets
  }
}