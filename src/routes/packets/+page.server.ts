import { db } from '$lib/server/db'
import { project, packet, piece, preset } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export async function load({ parent }) {
  const { user } = await parent()

  if (!user?.id) {
    throw redirect(302, '/login')
  }

  // Packets that belong to the user's projects
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
    .where(eq(project.userId, user.id))

  return {
    packets: userPackets
  }
}