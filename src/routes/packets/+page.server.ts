import { db } from '$lib/server/db'
import { project, packet, piece, preset } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export async function load({ parent, cookies }) {
  const { user } = await parent()

  if (!user?.id) {
    throw redirect(302, '/login')
  }

  const activeProjectId = cookies.get('activeProjectId')

  // Packets that belong to the user's projects (filtered by active project if specified)
  let query = db
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

  if (activeProjectId && activeProjectId !== 'default') {
    query = query.where(and(
      eq(project.userId, user.id),
      eq(project.id, activeProjectId)
    ))
  } else {
    query = query.where(eq(project.userId, user.id))
  }

  const userPackets = await query

  return {
    packets: userPackets
  }
}